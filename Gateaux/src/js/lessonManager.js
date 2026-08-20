// Lesson Manager for Gateaux — Quiz with Timer + Streak
import { gameState } from './gameState.js';
import { teachers, MAX_LESSON_PROMPTS, trimLessonPhrases } from './languageData.js';
import { audioManager } from './audioManager.js';
import { FIRST_RUN_CLOSER_IDS, FIRST_RUN_STORY } from './firstRun.js';

// Timer is off for standard lessons. Kept for a future Café "Rush Hour" mode.
const TIMER_ENABLED_DEFAULT = false;
const TIMER_BY_DIFFICULTY = { 1: 15, 2: 12, 3: 8 };
const TIMER_RING_CIRCUMFERENCE = 2 * Math.PI * 36; // matches SVG r=36

// Teacher-voiced wrong answer interjections (5 per teacher)
const WRONG_INTERJECTIONS = {
    amelie: [
        "Not quite, dear. Let me show you the proper way.",
        "A small misstep. Precision matters -- here's the correct form.",
        "Almost, but not quite. Allow me to clarify.",
        "That's not it, I'm afraid. The correct answer requires a bit more finesse.",
        "Close, but a lady always gets the details right. Let me help.",
    ],
    marcel: [
        "Nah, that ain't it. Check this out --",
        "Wrong one, friend. No stress though, here's the deal --",
        "Missed it! But hey, nobody nails it first try. The real answer is --",
        "Not even close, but I respect the hustle. Here's what you want --",
        "Swing and a miss! Let me break it down for you --",
    ],
    cafe: [
        "Wrong! Sorry, three customers yelling at me -- the answer is --",
        "Nope! I'd explain more but the espresso machine is on fire. It's --",
        "That's incorrect and I don't have time to sugarcoat it. The answer --",
        "Not that one! Look, I'll make this quick --",
        "Miss! Okay, deep breath. Here's what you needed --",
    ],
    bisou: [
        "Oh no, mon amour. That's not it. The correct answer is --",
        "Not quite, darling. But I still believe in you. It's --",
        "That broke my heart a little. The right answer is --",
        "So close, sweetheart! But the one you're looking for is --",
        "Wrong, but your effort was beautiful. The answer is --",
    ],
    gaston: [
        "Wrong. Obviously. The correct answer is --",
        "That was painful to witness. The answer is --",
        "I expected nothing and I'm still disappointed. The answer is --",
        "Incorrect. Even I could do better, and I hate everything. It's --",
        "No. Just... no. Let me spell it out for you --",
    ],
};

const CORRECT_INTERJECTIONS = {
    amelie: [
        "That's the one. Precisely.",
        "Yes. A lady always gets the details right.",
        "Well done, dear. Keep that pronunciation.",
        "Exactly. You may have a future at the counter.",
        "Mm. I almost smiled.",
    ],
    marcel: [
        "Now you sound local.",
        "That one has some street on it.",
        "Good. Textbook voice: gone.",
        "Keep that one in your pocket.",
        "There it is. Say it like you mean it.",
    ],
    cafe: [
        "Yes! Ok I have three other tickets — keep going.",
        "That's it. Don't make me proud, I don't have time.",
        "Correct. The milk didn't scorch. Miracle.",
        "You got it. Next.",
        "Fine. You're useful today.",
    ],
    bisou: [
        "That's the one, and I am choosing to be impressed.",
        "Yes. Say it again, slower.",
        "Beautiful. I would order from you.",
        "Oh, that was charming.",
        "Correct, darling. Don't let it go to your head. Or do.",
    ],
    gaston: [
        "Fine. That was acceptable.",
        "Yes. Even I couldn't ruin that one.",
        "Correct. Don't get comfortable.",
        "Huh. You listened.",
        "That's the one. Obviously.",
    ],
};

function cleanFeedbackCopy(text = '') {
    return text
        .replace(/\bactually\b/gi, 'really')
        .replace(/\s+/g, ' ')
        .trim();
}

function firstSentence(text = '') {
    const clean = cleanFeedbackCopy(text);
    const sentenceEnd = clean.indexOf('. ');
    return sentenceEnd === -1 ? clean : clean.slice(0, sentenceEnd + 1);
}

function trimNote(text, maxLength = 190) {
    if (text.length <= maxLength) return text;
    const shortened = text.slice(0, maxLength);
    const lastSpace = shortened.lastIndexOf(' ');
    return `${shortened.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

function getPhraseSuccessNote(phrase) {
    if (phrase.success_note) return cleanFeedbackCopy(phrase.success_note);
    if (phrase.formality === 'slang' && phrase.correction) {
        return firstSentence(phrase.correction);
    }
    return trimNote(cleanFeedbackCopy(phrase.context || 'Use it when the moment fits.'));
}

export class LessonManager {
    constructor() {
        this.currentLesson = null;
        this.currentPhraseIndex = 0;
        this.currentLanguage = null;
        this.currentRegion = null;
        this.currentRecipe = null;
        this.completionCallback = null;
        this.selectedAnswer = null;
        this.correctAnswer = null;

        // Timer state (disabled unless a lesson opts into rush hour)
        this.timerEnabled = TIMER_ENABLED_DEFAULT;
        this.timerInterval = null;
        this.timerSeconds = 0;
        this.timerMax = 15;
        this.questionMode = 'meaning';
        this.isFirstRun = false;
        this.firstRunPhase = 'quiz';
        this.matchSelected = null;
        this.matchCount = 0;

        // Streak state
        this.streak = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('quiz-action-btn')?.addEventListener('click', () => {
            this.checkAnswer();
        });
        document.getElementById('first-run-story-go')?.addEventListener('click', () => {
            this.startFirstRunCloser();
        });
    }

    startLesson(language, region, lesson, onComplete, recipe = null, options = {}) {
        this.currentLanguage = language;
        this.currentRegion = region;
        this.currentLesson = trimLessonPhrases(lesson, MAX_LESSON_PROMPTS);
        this.currentRecipe = recipe;
        this.currentPhraseIndex = 0;
        this.completionCallback = onComplete;
        this.streak = 0;
        this.updateStreakDisplay();

        this.timerEnabled = options.timed === true;
        this.timerMax = TIMER_BY_DIFFICULTY[lesson.difficulty] || 15;
        this.setTimerVisible(this.timerEnabled);

        this.isFirstRun = options.firstRun === true;
        this.firstRunPhase = this.isFirstRun ? 'match' : 'quiz';
        this.matchSelected = null;
        this.matchCount = 0;

        if (this.isFirstRun) {
            this.startMatchRound();
        } else {
            this.setQuizLayout('quiz');
            this.loadCurrentPhrase();
        }
    }

    setQuizLayout(mode) {
        const matchBoard = document.getElementById('match-board');
        const story = document.getElementById('first-run-story');
        const answerArea = document.querySelector('.quiz-answer-area');
        const listenBtn = document.getElementById('quiz-listen-btn');

        if (matchBoard) matchBoard.style.display = mode === 'match' ? 'flex' : 'none';
        if (story) story.style.display = mode === 'story' ? 'flex' : 'none';
        if (answerArea) answerArea.style.display = mode === 'quiz' ? '' : 'none';
        if (listenBtn && mode !== 'quiz') listenBtn.style.display = 'none';
    }

    nativeOf(phrase) {
        return phrase[this.currentLanguage] || phrase.french || phrase.spanish;
    }

    startMatchRound() {
        this.firstRunPhase = 'match';
        this.matchSelected = null;
        this.matchCount = 0;
        this.setQuizLayout('match');
        this.setupQuizChrome();
        this.stopTimer();

        const phrases = this.currentLesson.phrases;
        const fill = document.getElementById('quiz-progress-fill');
        if (fill) fill.style.width = '0%';

        const nativeEl = document.getElementById('quiz-phrase-native');
        const pronEl = document.getElementById('quiz-phrase-pronunciation');
        const contextEl = document.getElementById('quiz-phrase-context');
        if (nativeEl) nativeEl.textContent = 'Tap the pairs.';
        if (pronEl) pronEl.textContent = '';
        if (contextEl) contextEl.textContent = 'Same meaning. Two taps.';

        this.updateMatchStatus('');

        const enCol = document.getElementById('match-col-en');
        const nativeCol = document.getElementById('match-col-native');
        if (!enCol || !nativeCol) return;
        enCol.innerHTML = '';
        nativeCol.innerHTML = '';

        const enTiles = this.shuffleArray(phrases.map(p => ({
            phraseId: p.id,
            side: 'en',
            text: p.english
        })));
        const nativeTiles = this.shuffleArray(phrases.map(p => ({
            phraseId: p.id,
            side: 'native',
            text: this.nativeOf(p)
        })));

        enTiles.forEach(tile => enCol.appendChild(this.createMatchTile(tile)));
        nativeTiles.forEach(tile => nativeCol.appendChild(this.createMatchTile(tile)));
    }

    createMatchTile(tile) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'match-tile';
        btn.textContent = tile.text;
        btn.dataset.phraseId = tile.phraseId;
        btn.dataset.side = tile.side;
        btn.addEventListener('click', () => this.onMatchTile(btn));
        return btn;
    }

    updateMatchStatus(text) {
        const el = document.getElementById('match-status');
        if (el) el.textContent = text;
    }

    onMatchTile(btn) {
        if (btn.classList.contains('matched') || btn.disabled) return;

        if (this.matchSelected === btn) {
            btn.classList.remove('selected');
            this.matchSelected = null;
            return;
        }

        if (!this.matchSelected) {
            document.querySelectorAll('.match-tile.selected').forEach(el => el.classList.remove('selected'));
            btn.classList.add('selected');
            this.matchSelected = btn;
            this.updateMatchStatus('');
            return;
        }

        if (this.matchSelected.dataset.side === btn.dataset.side) {
            this.matchSelected.classList.remove('selected');
            btn.classList.add('selected');
            this.matchSelected = btn;
            return;
        }

        const a = this.matchSelected;
        const b = btn;
        const isMatch = a.dataset.phraseId === b.dataset.phraseId;

        if (isMatch) {
            a.classList.remove('selected');
            b.classList.remove('selected');
            a.classList.add('matched');
            b.classList.add('matched');
            a.disabled = true;
            b.disabled = true;
            this.matchSelected = null;
            this.matchCount++;
            this._vibrateCorrect();
            audioManager.playCorrect();
            this.updateMatchStatus('Yeah.');
            const fill = document.getElementById('quiz-progress-fill');
            if (fill) fill.style.width = `${(this.matchCount / this.currentLesson.phrases.length) * 80}%`;

            const phrase = this.currentLesson.phrases.find(p => p.id === a.dataset.phraseId);
            if (phrase?.id) gameState.learnPhrase(this.currentLanguage, phrase.id);

            if (this.matchCount >= this.currentLesson.phrases.length) {
                setTimeout(() => this.showFirstRunStory(), 450);
            }
        } else {
            a.classList.add('miss');
            b.classList.add('miss');
            this._vibrateWrong();
            audioManager.playWrong();
            this.updateMatchStatus('Nah.');
            const first = a;
            const second = b;
            this.matchSelected = null;
            setTimeout(() => {
                first.classList.remove('selected', 'miss');
                second.classList.remove('selected', 'miss');
            }, 420);
        }
    }

    showFirstRunStory() {
        this.firstRunPhase = 'story';
        this.setQuizLayout('story');
        this.updateMatchStatus('');

        const nativeEl = document.getElementById('quiz-phrase-native');
        const contextEl = document.getElementById('quiz-phrase-context');
        if (nativeEl) nativeEl.textContent = 'Ok. That was the easy part.';
        if (contextEl) contextEl.textContent = '';

        const linesEl = document.getElementById('first-run-story-lines');
        const lines = FIRST_RUN_STORY[this.currentLanguage] || FIRST_RUN_STORY.french;
        if (linesEl) {
            linesEl.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
        }
    }

    startFirstRunCloser() {
        this.firstRunPhase = 'closer';
        this.setQuizLayout('quiz');
        const closerId = FIRST_RUN_CLOSER_IDS[this.currentLanguage];
        const idx = this.currentLesson.phrases.findIndex(p => p.id === closerId);
        this.currentPhraseIndex = idx >= 0 ? idx : Math.min(3, this.currentLesson.phrases.length - 1);
        this.loadCurrentPhrase();
    }

    loadCurrentPhrase() {
        if (!this.currentLesson || this.currentPhraseIndex >= this.currentLesson.phrases.length) {
            this.completeLesson();
            return;
        }

        const phrase = this.currentLesson.phrases[this.currentPhraseIndex];

        const progress = this.firstRunPhase === 'closer'
            ? 90
            : (this.currentPhraseIndex / this.currentLesson.phrases.length) * 100;
        const fill = document.getElementById('quiz-progress-fill');
        if (fill) fill.style.width = `${progress}%`;

        this.setupQuizChrome();
        this.renderQuizQuestion(phrase);
        if (this.timerEnabled) this.startTimer();
        else this.stopTimer();
    }

    setupQuizChrome() {
        const charImg = document.getElementById('quiz-character-img');
        if (charImg && this.currentLesson.teacher) {
            const teacherId = this.currentLesson.teacher;
            charImg.src = `assets/images/characters/${teacherId}_concept.png`;
            charImg.alt = teachers[teacherId]?.name || 'Teacher';
            charImg.onerror = () => {
                charImg.onerror = null;
                charImg.src = `assets/images/characters/${teacherId}_neutral.png`;
            };
        }
        // Reset expression badge to thinking (neutral) at the start of each question
        const badge = document.getElementById('expression-badge');
        if (badge) badge.textContent = '🤔';

        // Set cake preview (if recipe selected)
        const cakePreview = document.getElementById('quiz-cake-preview');
        const cakeImg = document.getElementById('quiz-cake-img');
        if (cakePreview && cakeImg && this.currentRecipe) {
            cakeImg.src = `assets/images/cakes/${this.currentRecipe.imageFile}`;
            cakeImg.alt = this.currentRecipe.name;
            cakeImg.dataset.imageName = this.currentRecipe.name;
            cakePreview.style.display = 'block';
            cakePreview.className = `quiz-cake-preview rarity-${this.currentRecipe.rarity}`;
        } else if (cakePreview) {
            cakePreview.style.display = 'none';
        }
    }

    setTimerVisible(visible) {
        document.querySelectorAll('.timer-ring').forEach(el => {
            el.style.display = visible ? '' : 'none';
        });
        document.getElementById('lesson-quiz-screen')?.classList.toggle('quiz-untimed', !visible);
    }

    // ── Timer ──

    startTimer() {
        if (!this.timerEnabled) return;
        this.stopTimer();
        this.timerSeconds = this.timerMax;
        this.updateTimerRing(1);

        this.timerInterval = setInterval(() => {
            this.timerSeconds--;
            const fraction = this.timerSeconds / this.timerMax;
            this.updateTimerRing(fraction);

            if (this.timerSeconds <= 4 && this.timerSeconds > 0) {
                audioManager.playTimerTick();
            }

            if (this.timerSeconds <= 0) {
                this.stopTimer();
                this.onTimerExpired();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerRing(fraction) {
        const ring = document.getElementById('timer-ring-progress');
        if (!ring) return;

        const offset = TIMER_RING_CIRCUMFERENCE * (1 - fraction);
        ring.style.strokeDashoffset = offset;

        // On-palette color progression: muted green -> gold -> warm red
        if (fraction > 0.5) {
            ring.style.stroke = '#7ab87a';
        } else if (fraction > 0.25) {
            ring.style.stroke = '#c49a30';
        } else {
            ring.style.stroke = '#c9807a';
        }
    }

    onTimerExpired() {
        // Disable all buttons
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.disabled = true;
        });

        audioManager.playWrong();

        // Reset streak
        this.streak = 0;
        this.updateStreakDisplay();

        // Show wrong feedback
        this.showWrongFeedback();
    }

    // ── Streak ──

    getStreakMultiplier() {
        if (this.streak >= 8) return 5;
        if (this.streak >= 5) return 3;
        if (this.streak >= 3) return 2;
        return 1;
    }

    updateStreakDisplay() {
        const display = document.getElementById('streak-display');
        const countEl = document.getElementById('streak-count');
        const labelEl = document.getElementById('streak-label');
        const portrait = document.querySelector('.portrait-timer-wrapper');

        if (!display || !countEl || !labelEl) return;

        if (this.streak >= 1) {
            display.style.display = 'flex';
            countEl.textContent = this.streak;

            if (this.streak >= 8) {
                labelEl.textContent = 'ON FIRE! 5x';
                display.className = 'streak-display streak-fire';
            } else if (this.streak >= 5) {
                labelEl.textContent = '3x';
                display.className = 'streak-display streak-hot';
            } else if (this.streak >= 3) {
                labelEl.textContent = '2x';
                display.className = 'streak-display streak-warm';
            } else {
                labelEl.textContent = '';
                display.className = 'streak-display';
            }
        } else {
            display.style.display = 'none';
        }

        // Portrait glow effect
        if (portrait) {
            portrait.classList.remove('streak-glow', 'streak-fire-glow');
            if (this.streak >= 5) {
                portrait.classList.add('streak-fire-glow');
            } else if (this.streak >= 3) {
                portrait.classList.add('streak-glow');
            }
        }
    }

    // ── Quiz Rendering ──

    renderQuizQuestion(phrase) {
        const nativeText = phrase[this.currentLanguage] || phrase.french || phrase.spanish;
        if (this.firstRunPhase === 'closer') {
            this.questionMode = 'meaning';
        } else {
            const modeIndex = this.currentPhraseIndex % 3;
            this.questionMode = modeIndex === 2 ? 'listen' : (modeIndex === 1 ? 'reverse' : 'meaning');
        }

        const nativeEl = document.getElementById('quiz-phrase-native');
        const pronEl = document.getElementById('quiz-phrase-pronunciation');
        const contextEl = document.getElementById('quiz-phrase-context');
        const listenBtn = document.getElementById('quiz-listen-btn');

        if (this.questionMode === 'meaning') {
            if (nativeEl) nativeEl.textContent = nativeText;
            if (pronEl) pronEl.textContent = phrase.pronunciation ? `[${phrase.pronunciation}]` : '';
            if (contextEl) contextEl.textContent = 'What does this mean?';
            if (listenBtn) listenBtn.style.display = 'none';
            const wrongAnswers = phrase.wrong_answers_en || this.generateFallbackWrongAnswers(phrase.english, 'en');
            const options = this.shuffleArray([phrase.english, ...wrongAnswers.slice(0, 3)]);
            this.renderOptions(options, phrase.english);
        } else if (this.questionMode === 'reverse') {
            if (nativeEl) nativeEl.textContent = phrase.english;
            if (pronEl) pronEl.textContent = '';
            if (contextEl) contextEl.textContent = 'How do you say this?';
            if (listenBtn) listenBtn.style.display = 'none';
            const wrongAnswers = phrase.wrong_answers_native || this.generateFallbackWrongAnswers(nativeText, 'native');
            const options = this.shuffleArray([nativeText, ...wrongAnswers.slice(0, 3)]);
            this.renderOptions(options, nativeText);
        } else {
            if (nativeEl) nativeEl.textContent = 'Listen';
            if (pronEl) pronEl.textContent = '';
            if (contextEl) contextEl.textContent = 'What did they say?';
            if (listenBtn) {
                listenBtn.style.display = 'inline-flex';
                listenBtn.onclick = () => this.speakNative(nativeText);
            }
            const wrongAnswers = phrase.wrong_answers_en || this.generateFallbackWrongAnswers(phrase.english, 'en');
            const options = this.shuffleArray([phrase.english, ...wrongAnswers.slice(0, 3)]);
            this.renderOptions(options, phrase.english);
            this.speakNative(nativeText);
        }

        const actionBtn = document.getElementById('quiz-action-btn');
        if (actionBtn) {
            actionBtn.textContent = "That's the one";
            actionBtn.disabled = true;
        }
        this.selectedAnswer = null;
    }

    speakNative(text) {
        if (!text || !('speechSynthesis' in window)) return;
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.currentLanguage === 'spanish' ? 'es-ES' : 'fr-FR';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }

    renderOptions(options, correctAnswer) {
        const container = document.getElementById('quiz-options');
        if (!container) return;
        container.innerHTML = '';
        container.classList.remove('feedback-dimmed');
        this.correctAnswer = correctAnswer;

        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = option;
            btn.addEventListener('click', () => this.selectOption(btn, option));
            container.appendChild(btn);
        });
    }

    selectOption(btn, value) {
        document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedAnswer = value;
        const actionBtn = document.getElementById('quiz-action-btn');
        if (actionBtn) actionBtn.disabled = false;
    }

    // ── Answer Checking ──

    checkAnswer() {
        if (!this.selectedAnswer) return;
        this.stopTimer();

        const isCorrect = this.selectedAnswer === this.correctAnswer;

        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === this.correctAnswer) btn.classList.add('correct');
            if (btn.classList.contains('selected') && !isCorrect) btn.classList.add('incorrect');
        });

        if (isCorrect) {
            this.streak++;
            this.updateStreakDisplay();
            this.showCorrectFeedback();
        } else {
            this.streak = 0;
            this.updateStreakDisplay();
            this.showWrongFeedback();
        }
    }

    // ── Haptic feedback helpers ──
    _vibrateCorrect() {
        try { navigator.vibrate?.([10]); } catch (_) {}
    }

    _vibrateWrong() {
        try { navigator.vibrate?.([20, 40, 20]); } catch (_) {}
    }

    // ── Quiz character — always uses full-body concept image ──
    _setQuizTeacherExpression(expression = 'neutral') {
        const charImg = document.getElementById('quiz-character-img');
        if (!charImg || !this.currentLesson?.teacher) return;
        const teacherId = this.currentLesson.teacher;
        // Full-body concept image for the main quiz display (expression variants are portrait-only)
        charImg.src = `assets/images/characters/${teacherId}_concept.png`;
        charImg.onerror = () => {
            charImg.onerror = null;
            charImg.src = `assets/images/characters/${teacherId}_neutral.png`;
        };

        // Update emoji badge to reflect the current expression state
        const EXPRESSION_EMOJIS = {
            neutral:      '🤔',
            thinking:     '🤔',
            happy:        '😄',
            correct:      '😄',
            disappointed: '😢',
            wrong:        '😢',
        };
        const badge = document.getElementById('expression-badge');
        if (badge) {
            const emoji = EXPRESSION_EMOJIS[expression] || '🤔';
            if (badge.textContent !== emoji) {
                badge.textContent = emoji;
                badge.classList.remove('expression-pop');
                void badge.offsetWidth;
                badge.classList.add('expression-pop');
            }
        }
    }

    showCorrectFeedback() {
        const feedback = document.getElementById('correct-feedback');
        if (feedback) feedback.style.display = 'flex';
        document.getElementById('quiz-options')?.classList.add('feedback-dimmed');
        this.spawnConfetti();
        this._vibrateCorrect();

        // Switch teacher to happy expression (emoji badge shows 😄)
        this._setQuizTeacherExpression('happy');

        audioManager.playCorrect();

        // Award tips with streak multiplier
        const multiplier = this.getStreakMultiplier();
        const tips = 2 * multiplier;
        gameState.addTips(tips);

        const phrase = this.currentLesson.phrases[this.currentPhraseIndex];
        if (phrase.id) gameState.learnPhrase(this.currentLanguage, phrase.id);

        const teacherId = this.currentLesson.teacher;
        const lines = CORRECT_INTERJECTIONS[teacherId] || CORRECT_INTERJECTIONS.marcel;
        const titleEl = document.getElementById('correct-bar-title');
        if (titleEl) titleEl.textContent = lines[Math.floor(Math.random() * lines.length)];

        const nativeText = phrase[this.currentLanguage] || phrase.french || phrase.spanish;
        const phraseEl = document.getElementById('correct-bar-phrase');
        const transEl = document.getElementById('correct-bar-translation');
        const noteEl = document.getElementById('correct-bar-note');
        if (phraseEl) phraseEl.textContent = nativeText;
        if (transEl) transEl.textContent = phrase.english;
        if (noteEl) noteEl.textContent = getPhraseSuccessNote(phrase);

        // Springy phrase pulse animation
        const correctBar = document.getElementById('correct-feedback')?.querySelector('.correct-bar');
        if (correctBar) {
            correctBar.classList.remove('animate-phrase');
            void correctBar.offsetWidth;
            correctBar.classList.add('animate-phrase');
        }

        // Wire continue button
        const continueBtn = document.getElementById('correct-continue-btn');
        if (continueBtn) {
            continueBtn.onclick = () => {
                if (feedback) feedback.style.display = 'none';
                document.getElementById('quiz-options')?.classList.remove('feedback-dimmed');
                const confetti = document.getElementById('confetti-container');
                if (confetti) confetti.innerHTML = '';
                this._setQuizTeacherExpression('neutral');
                if (this.firstRunPhase === 'closer') {
                    this.completeLesson();
                    return;
                }
                this.currentPhraseIndex++;
                this.loadCurrentPhrase();
            };
        }
    }

    showWrongFeedback() {
        const feedback = document.getElementById('wrong-feedback');
        document.getElementById('quiz-options')?.classList.add('feedback-dimmed');
        const phrase = this.currentLesson.phrases[this.currentPhraseIndex];
        const nativeText = phrase[this.currentLanguage] || phrase.french || phrase.spanish;
        const teacherId = this.currentLesson.teacher;
        const teacher = teachers[teacherId];

        this._vibrateWrong();

        // Switch teacher to disappointed expression (emoji badge shows 😢)
        this._setQuizTeacherExpression('disappointed');

        // Set teacher portrait in wrong modal (disappointed expression, falls back to neutral)
        const teacherImg = document.getElementById('wrong-teacher-img');
        if (teacherImg) {
            teacherImg.src = `assets/images/characters/${teacherId}_disappointed.png`;
            teacherImg.onerror = () => {
                teacherImg.onerror = null;
                teacherImg.src = `assets/images/characters/${teacherId}_neutral.png`;
            };
            teacherImg.alt = teacher?.name || 'Teacher';
        }

        // Set teacher name
        const nameEl = document.getElementById('wrong-teacher-name');
        if (nameEl) nameEl.textContent = teacher?.name || '';

        // Pick a random teacher-voiced interjection
        const interjections = WRONG_INTERJECTIONS[teacherId] || WRONG_INTERJECTIONS.amelie;
        const interjection = interjections[Math.floor(Math.random() * interjections.length)];

        const titleEl = document.getElementById('wrong-modal-title');
        if (titleEl) titleEl.textContent = interjection;

        // Show the correct answer and explanation
        const correctEl = document.getElementById('wrong-correct-answer');
        const explainEl = document.getElementById('wrong-explanation');

        if (correctEl) correctEl.textContent = `"${this.correctAnswer}"`;
        const explanation = phrase.correction
            || `"${nativeText}" means "${phrase.english}" — ${phrase.context}`;
        if (explainEl) explainEl.textContent = explanation;
        if (feedback) feedback.style.display = 'flex';
        audioManager.playWrong();

        const continueBtn = document.getElementById('wrong-continue-btn');
        if (continueBtn) {
            continueBtn.onclick = () => {
                if (feedback) feedback.style.display = 'none';
                document.getElementById('quiz-options')?.classList.remove('feedback-dimmed');
                this._setQuizTeacherExpression('neutral');
                this.renderQuizQuestion(phrase);
                if (this.timerEnabled) this.startTimer();
            };
        }
    }

    spawnConfetti() {
        const container = document.getElementById('confetti-container');
        if (!container) return;
        // On-palette confetti: warm golds, greens, muted reds
        const colors = ['#c49a30', '#deb87a', '#7ab87a', '#c9807a', '#d4a574', '#a8d4a8'];
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.top = `${Math.random() * 30}%`;
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDelay = `${Math.random() * 0.3}s`;
            p.style.animationDuration = `${0.8 + Math.random() * 0.6}s`;
            container.appendChild(p);
        }
    }

    generateFallbackWrongAnswers(correctAnswer, mode) {
        // Pull distractors from the same lesson first — most contextually relevant
        const otherPhrases = this.currentLesson.phrases
            .filter((_, i) => i !== this.currentPhraseIndex)
            .map(p => mode === 'en' ? p.english : (p[this.currentLanguage] || p.french || p.spanish))
            .filter(text => text && text !== correctAnswer);
        const shuffled = this.shuffleArray([...otherPhrases]);

        // Expanded fallback pools — café-appropriate, varied enough to avoid easy elimination
        const nativeFallbacks = this.currentLanguage === 'french'
            ? ["C'est très bien", 'Bonne journée', 'Avec plaisir', "S'il vous plaît",
               'Pardon', 'Je voudrais', 'Je ne comprends pas', 'Au revoir',
               'Un moment', 'Bien sûr', 'Excusez-moi', 'De rien']
            : ['Muy bien', 'Buenos días', 'Con mucho gusto', 'Por favor',
               'Perdón', 'Quisiera', 'No entiendo', 'Hasta luego',
               'Un momento', 'Claro que sí', 'Disculpe', 'De nada'];
        const enFallbacks = [
            'Very well, thank you', 'Good morning', 'With pleasure',
            'Please', 'Excuse me', 'I would like', 'I do not understand',
            'See you later', 'One moment', 'Of course', 'You are welcome', 'No problem'
        ];
        const pool = mode === 'en' ? enFallbacks : nativeFallbacks;

        // Fill to 3 using a Set to guarantee no duplicates and no leakage of the correct answer
        const used = new Set([correctAnswer, ...shuffled]);
        for (const fb of pool) {
            if (shuffled.length >= 3) break;
            if (!used.has(fb)) {
                shuffled.push(fb);
                used.add(fb);
            }
        }
        return shuffled.slice(0, 3);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    completeLesson() {
        this.stopTimer();
        const fill = document.getElementById('quiz-progress-fill');
        if (fill) fill.style.width = '100%';
        if (this.currentLesson.id) gameState.completeLesson(this.currentLanguage, this.currentLesson.id);
        gameState.setLastLesson(this.currentLanguage, this.currentLesson, this.currentLesson.phrases);
        gameState.markFirstLessonDone();
        if (this.completionCallback) this.completionCallback(true);
    }
}
