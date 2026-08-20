// Customer Service Module for Gateaux
// Handles NPC customers with audio-only speech

import { gameState } from './gameState.js';
import { getRecipeById } from './recipeData.js';
import { audioManager } from './audioManager.js';
import { getCounterPayout } from './economy.js';

export class CustomerService {
    constructor(displayCase = null) {
        this.currentCustomer = null;
        this.displayCase = displayCase;
        this.customerTypes = [
            { sprite: 'Bunny', name: 'Bunny', personality: 'friendly' },
            { sprite: 'Cat', name: 'Cat', personality: 'sophisticated' },
            { sprite: 'Dog', name: 'Dog', personality: 'enthusiastic' },
            { sprite: 'Bear', name: 'Bear', personality: 'gentle' },
            { sprite: 'Fox', name: 'Fox', personality: 'clever' }
        ];

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Response option clicks are handled dynamically
    }

    // Generate a new customer
    generateNewCustomer() {
        const displayStatus = this.getDisplayStatus();
        if (!displayStatus.hasAnyCakes) {
            this.showNoCakesMessage();
            return;
        }
        if (!displayStatus.hasReadyCakes) {
            this.showSettingMessage();
            return;
        }

        // Choose random customer type
        const customerType = this.customerTypes[Math.floor(Math.random() * this.customerTypes.length)];

        // Choose language based on available cakes
        const language = this.chooseCustomerLanguage(displayStatus);

        // Generate request
        const request = this.generateRequest(language);

        this.currentCustomer = {
            ...customerType,
            language: language,
            request: request
        };

        // Display customer
        this.displayCustomer();
    }

    // Get display case status
    getDisplayStatus() {
        if (!this.displayCase) {
            return {
                hasAnyCakes: false,
                hasReadyCakes: false,
                hasSpanishCakes: false,
                hasFrenchCakes: false,
                status: {}
            };
        }

        const status = this.displayCase.getInventoryStatus();

        const hasSpanishCakes = status.spanish?.count > 0;
        const hasFrenchCakes = status.french?.count > 0;
        const hasSpanishReady = status.spanish?.hasReady;
        const hasFrenchReady = status.french?.hasReady;

        return {
            hasAnyCakes: hasSpanishCakes || hasFrenchCakes,
            hasReadyCakes: hasSpanishReady || hasFrenchReady,
            hasSpanishCakes: hasSpanishReady,
            hasFrenchCakes: hasFrenchReady,
            status
        };
    }

    // Choose customer language based on available cakes
    chooseCustomerLanguage(displayStatus) {
        const lastLang = gameState.getLastLesson()?.language;
        if (lastLang === 'spanish' && displayStatus.hasSpanishCakes) return 'spanish';
        if (lastLang === 'french' && displayStatus.hasFrenchCakes) return 'french';

        const availableLanguages = [];
        if (displayStatus.hasSpanishCakes) availableLanguages.push('spanish');
        if (displayStatus.hasFrenchCakes) availableLanguages.push('french');
        return availableLanguages[Math.floor(Math.random() * availableLanguages.length)] || 'spanish';
    }

    // Prefer phrases from the lesson the player just baked
    generateRequest(language) {
        const last = gameState.getLastLesson();
        if (last?.language === language && last.phrases?.length) {
            const phrase = last.phrases[Math.floor(Math.random() * last.phrases.length)];
            return {
                english: phrase.english,
                native: phrase.native,
                expectedResponse: phrase.english,
                fromLastLesson: true
            };
        }

        const requests = {
            spanish: [
                {
                    english: "Hello! I'd like a coffee, please.",
                    native: "¡Hola! Quisiera un café, por favor.",
                    expectedResponse: "Hello! I'd like a coffee, please."
                },
                {
                    english: "Good morning! How are you?",
                    native: "¡Buenos días! ¿Cómo estás?",
                    expectedResponse: "Good morning! How are you?"
                },
                {
                    english: "Thank you very much!",
                    native: "¡Muchas gracias!",
                    expectedResponse: "Thank you very much!"
                },
                {
                    english: "How much is it?",
                    native: "¿Cuánto cuesta?",
                    expectedResponse: "How much is it?"
                }
            ],
            french: [
                {
                    english: "Hello! I'd like a coffee, please.",
                    native: "Bonjour! Je voudrais un café, s'il vous plaît.",
                    expectedResponse: "Hello! I'd like a coffee, please."
                },
                {
                    english: "Good evening! How are you?",
                    native: "Bonsoir! Comment allez-vous?",
                    expectedResponse: "Good evening! How are you?"
                },
                {
                    english: "Thank you very much!",
                    native: "Merci beaucoup!",
                    expectedResponse: "Thank you very much!"
                },
                {
                    english: "The bill, please.",
                    native: "L'addition, s'il vous plaît.",
                    expectedResponse: "The bill, please."
                }
            ]
        };

        const languageRequests = requests[language] || requests.spanish;
        return languageRequests[Math.floor(Math.random() * languageRequests.length)];
    }

    // Display customer
    displayCustomer() {
        const customerEl = document.getElementById('current-customer');
        const requestEl = document.getElementById('customer-request');
        const spriteEl = customerEl?.querySelector('.customer-sprite');
        const idleEl = document.getElementById('customer-idle');
        const responseAreaEl = document.getElementById('response-area');

        if (!customerEl || !requestEl) return;

        // Show customer, hide the idle invitation
        customerEl.style.display = 'flex';
        if (idleEl) idleEl.style.display = 'none';
        if (responseAreaEl) responseAreaEl.style.display = 'block';

        // Update sprite with customer bust image (contain so faces aren't cropped)
        if (spriteEl) {
            const imageMap = {
                Bunny: 'bunny_bust.png',
                Cat: 'cat_bust.png',
                Dog: 'dog_bust.png',
                Bear: 'bear_bust.png',
                Fox: 'fox_bust.png'
            };
            const imgFile = imageMap[this.currentCustomer.name] || 'tourist_bust.png';
            spriteEl.classList.remove('placeholder-square');
            spriteEl.removeAttribute('data-image-name');
            spriteEl.innerHTML = '';
            spriteEl.style.backgroundImage = `url(assets/images/customers/${imgFile})`;
            spriteEl.style.backgroundSize = 'contain';
            spriteEl.style.backgroundRepeat = 'no-repeat';
            spriteEl.style.backgroundPosition = 'center';
            spriteEl.style.transform = '';
        }

        // Native speech only during the challenge — English is the answer, so hide it
        requestEl.textContent = this.currentCustomer.request.native;
        const hintEl = document.getElementById('customer-hint');
        if (hintEl) {
            hintEl.textContent = '';
            hintEl.hidden = true;
        }

        // Generate response options
        this.generateResponseOptions();
        this.playCustomerAudio();
    }

    revealEnglishMeaning() {
        const hintEl = document.getElementById('customer-hint');
        if (!hintEl || !this.currentCustomer?.request) return;
        hintEl.textContent = this.currentCustomer.request.english;
        hintEl.hidden = false;
    }

    // Generate response options
    generateResponseOptions() {
        const container = document.getElementById('response-options');
        if (!container) return;

        container.innerHTML = '';

        // Get correct response and generate wrong options
        const correct = this.currentCustomer.request.expectedResponse;
        const options = this.generateOptions(correct, this.currentCustomer.language);

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'response-option';
            btn.textContent = option;
            btn.addEventListener('click', () => {
                this.handleResponse(btn, option === correct);
            });
            container.appendChild(btn);
        });
    }

    // Generate response options
    generateOptions(correctAnswer, language) {
        const last = gameState.getLastLesson();
        const fromLesson = (last?.language === language ? last.phrases : [])
            .map(p => p.english)
            .filter(text => text && text !== correctAnswer);

        const fallback = [
            'Very well, thank you', 'Good morning', 'With pleasure',
            'Please', 'Excuse me', 'I would like', 'I do not understand',
            'See you later', 'One moment', 'Of course', 'You are welcome'
        ].filter(opt => opt !== correctAnswer);

        const pool = this.shuffleArray([...fromLesson, ...fallback]);
        return this.shuffleArray([correctAnswer, ...pool.slice(0, 2)]);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Handle response selection
    handleResponse(button, isCorrect) {
        // Disable all buttons
        document.querySelectorAll('.response-option').forEach(btn => {
            btn.disabled = true;
        });

        this.revealEnglishMeaning();

        if (isCorrect) {
            button.classList.add('correct');
            this.handleCorrectResponse();
        } else {
            button.classList.add('incorrect');
            this.handleIncorrectResponse();
        }

        // Hide customer after delay
        setTimeout(() => {
            this.hideCustomer();
            this.syncCounterControls();
        }, 2000);
    }

    // Handle correct response
    handleCorrectResponse() {
        // Update customer sprite to happy
        const spriteEl = document.querySelector('.customer-sprite');
        if (spriteEl) {
            spriteEl.style.transform = 'scale(1.2)';
        }

        audioManager.playCorrect();

        let tipAmount = getCounterPayout(null); // common base

        // Remove a cake and apply its tip multiplier
        if (this.displayCase) {
            const ready = this.displayCase.getReadyCakes(this.currentCustomer.language);
            if (ready.length > 0) {
                const cake = ready[0];
                const recipe = getRecipeById(cake.recipeId);
                tipAmount = getCounterPayout(recipe);
                this.displayCase.removeCake(this.currentCustomer.language, cake.id);
            }
        }

        gameState.awardCoins(tipAmount);
        this.showTipFeedback(tipAmount);
    }

    // Show floating coin feedback
    showTipFeedback(amount) {
        const feedbackEl = document.getElementById('tip-feedback');
        const textEl = document.getElementById('tip-feedback-text');
        if (!feedbackEl || !textEl) return;

        // Clone to restart CSS animation, then set text on the new node
        const newText = textEl.cloneNode(true);
        newText.textContent = `+${amount} coins`;
        textEl.parentNode.replaceChild(newText, textEl);
        feedbackEl.style.display = 'block';

        setTimeout(() => {
            feedbackEl.style.display = 'none';
        }, 1200);
    }

    // Handle incorrect response
    handleIncorrectResponse() {
        // Update customer sprite to confused
        const spriteEl = document.querySelector('.customer-sprite');
        if (spriteEl) {
            spriteEl.style.transform = 'rotate(-10deg)';
        }

        audioManager.playWrong();
    }

    // Hide customer
    hideCustomer() {
        const customerEl = document.getElementById('current-customer');
        if (customerEl) {
            customerEl.style.display = 'none';
        }
        const hintEl = document.getElementById('customer-hint');
        if (hintEl) {
            hintEl.textContent = '';
            hintEl.hidden = true;
        }

        const spriteEl = document.querySelector('.customer-sprite');
        if (spriteEl) {
            spriteEl.style.transform = '';
        }

        // Clear response options and go back to the idle invitation
        const container = document.getElementById('response-options');
        if (container) {
            container.innerHTML = '';
        }
        const responseAreaEl = document.getElementById('response-area');
        if (responseAreaEl) responseAreaEl.style.display = 'none';
        const idleEl = document.getElementById('customer-idle');
        if (idleEl) idleEl.style.display = 'block';
    }

    // Show no cakes message
    showNoCakesMessage() {
        this.setIdleCopy('Case is empty. Bake a cake first, then come back.');
        this.syncCounterControls();
    }

    showSettingMessage() {
        this.setIdleCopy("They're still setting. Bake another or come back.");
        this.syncCounterControls();
    }

    setIdleCopy(text) {
        const idleEl = document.getElementById('customer-idle');
        const responseAreaEl = document.getElementById('response-area');
        if (responseAreaEl) responseAreaEl.style.display = 'none';
        if (idleEl) {
            idleEl.style.display = 'block';
            idleEl.innerHTML = `<p>${text}</p>`;
        }
    }

    syncCounterControls() {
        const btn = document.getElementById('new-customer-btn');
        const idleEl = document.getElementById('customer-idle');
        if (!this.displayCase) return;

        const total = this.displayCase.getTotalCount();
        const hasReady = this.displayCase.hasReadyCakes();
        const setting = this.displayCase.hasSettingCakes();

        if (btn) {
            btn.disabled = total === 0 || !hasReady;
        }

        if (idleEl && idleEl.style.display !== 'none') {
            if (total === 0) {
                idleEl.innerHTML = '<p>Case is empty. Bake a cake first, then come back.</p>';
            } else if (!hasReady && setting) {
                idleEl.innerHTML = "<p>They're still setting. Bake another or come back.</p>";
            } else if (hasReady) {
                idleEl.innerHTML = "<p>Someone's about to walk in. Think fast when they order.</p>";
            }
        }
    }

    // Play customer audio (NPC speech)
    playCustomerAudio() {
        if (!this.currentCustomer) return;

        // In a real implementation, this would play the audio file
        // For now, we'll use the Web Speech API as a placeholder
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentCustomer.request.native);

            // Set language
            if (this.currentCustomer.language === 'spanish') {
                utterance.lang = 'es-ES';
            } else if (this.currentCustomer.language === 'french') {
                utterance.lang = 'fr-FR';
            }

            utterance.rate = 0.9; // Slightly slower for clarity
            speechSynthesis.speak(utterance);
        }
    }
}
