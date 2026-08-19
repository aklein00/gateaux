// Gateaux - Main Game Controller
import { loadPhrases, getLessons, cakeTypes, teachers, getLessonById, FIRST_RUN_LESSON_ID } from './languageData.js';
import { displayCase } from './displayCase.js';
import { gameState } from './gameState.js';
import { LessonManager } from './lessonManager.js';
import { CustomerService } from './customerService.js';
import { getRecipesForLanguage, getRecipesForLevel, getLevelData, getRarityLabel, getRecipeForTeacher } from './recipeData.js';
import { setOnBakeCallback, setupRecipeBookListeners } from './recipeBook.js';
import { audioManager } from './audioManager.js';

// Replace broken <img> elements with labeled gray placeholders
function setupImagePlaceholders() {
    document.addEventListener('error', (e) => {
        if (e.target.tagName !== 'IMG' || e.target.dataset.placeholderApplied) return;
        e.target.dataset.placeholderApplied = 'true';

        const description = e.target.dataset.imageName || e.target.alt || 'Missing image';
        const rect = e.target.getBoundingClientRect();
        const width = Math.max(rect.width, parseInt(e.target.getAttribute('width')) || 80);
        const height = Math.max(rect.height, parseInt(e.target.getAttribute('height')) || 80);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#d0d0d0';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(2, 2, width - 4, height - 4);

        ctx.fillStyle = '#666';
        const fontSize = Math.max(9, Math.min(13, width / 8));
        ctx.font = `${fontSize}px Georgia, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxWidth = width - 12;
        const words = description.split(/[\s_-]+/);
        const lines = [];
        let currentLine = '';
        for (const word of words) {
            const test = currentLine ? currentLine + ' ' + word : word;
            if (ctx.measureText(test).width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = test;
            }
        }
        if (currentLine) lines.push(currentLine);

        const lineHeight = fontSize + 4;
        let y = height / 2 - ((lines.length - 1) * lineHeight) / 2;
        for (const line of lines) {
            ctx.fillText(line, width / 2, y);
            y += lineHeight;
        }

        e.target.src = canvas.toDataURL();
    }, true);
}

// Flag emoji helper
function getFlagEmoji(code) {
    const flags = {
        fr: '\u{1F1EB}\u{1F1F7}',
        ca: '\u{1F1E8}\u{1F1E6}',
        es: '\u{1F1EA}\u{1F1F8}',
        mx: '\u{1F1F2}\u{1F1FD}',
        ar: '\u{1F1E6}\u{1F1F7}'
    };
    return flags[code] || '';
}

class GateauxGame {
    constructor() {
        this.lessonManager = new LessonManager();
        this.customerService = new CustomerService(displayCase);
        this.currentLanguage = null;
        this.currentRegion = null;
        this.currentRecipe = null;
        this.decayCheckInterval = null;

        this.init();
    }

    init() {
        displayCase.updateDisplay();
        this.setupEventListeners();
        this.setupAudioUnlock();
        this.setupPageLifecycle();
        this.setupLevelUpListener();
        this.startDecayTimer();
        this.updateStats();
        this.showAwaySalesLine();

        // Recipe Book
        setupRecipeBookListeners();
        setOnBakeCallback((recipe) => this.onBakeFromRecipeBook(recipe));

        // Audio
        audioManager.loadSettings();
        this.setupMuteButton();

        // First-run: skip the tutorial wall and go straight to a Marcel lesson
        this.setupFirstRun();
        this.setupDebugControls();
        const gameContainer = document.getElementById('game-container');
        const autostart = new URLSearchParams(window.location.search).has('autostart');
        if (!autostart && gameContainer?.style.display === 'block') {
            this.maybeShowFirstRun();
        }
    }

    setupAudioUnlock() {
        const unlockAudio = () => audioManager.unlock();
        document.addEventListener('touchstart', unlockAudio, { once: true });
        document.addEventListener('click', unlockAudio, { once: true });
    }

    setupMuteButton() {
        const btn = document.getElementById('mute-btn');
        if (!btn) return;
        btn.classList.toggle('muted', audioManager.isMuted());
        btn.addEventListener('click', () => {
            audioManager.toggleMute();
        });
    }

    setupFirstRun() {
        document.querySelectorAll('[data-first-lang]').forEach(btn => {
            btn.addEventListener('click', () => {
                const language = btn.dataset.firstLang;
                if (language) this.startFirstRunLesson(language);
            });
        });
    }

    setupDebugControls() {
        const menuButton = document.getElementById('debug-menu-btn');
        const panel = document.getElementById('debug-menu-panel');
        const status = document.getElementById('debug-menu-status');

        const setPanelOpen = (open) => {
            if (panel) panel.style.display = open ? 'block' : 'none';
            menuButton?.setAttribute('aria-expanded', String(open));
        };

        menuButton?.addEventListener('click', () => {
            setPanelOpen(panel?.style.display === 'none');
        });
        document.getElementById('debug-close-btn')?.addEventListener('click', () => {
            setPanelOpen(false);
        });

        document.getElementById('debug-back-btn')?.addEventListener('click', () => {
            document.getElementById('correct-feedback')?.style.setProperty('display', 'none');
            document.getElementById('wrong-feedback')?.style.setProperty('display', 'none');
            document.getElementById('level-up-overlay')?.style.setProperty('display', 'none');
            document.getElementById('close-recipe-book')?.click();

            const lessonOverlay = document.getElementById('lesson-overlay');
            if (lessonOverlay?.style.display !== 'none') {
                this.closeLessonOverlay();
            }
            this.hideFirstRun();

            if (status) status.textContent = 'Back at the café.';
            setPanelOpen(false);
        });

        document.getElementById('debug-finish-btn')?.addEventListener('click', () => {
            const quizScreen = document.getElementById('lesson-quiz-screen');
            const lessonActive = quizScreen?.style.display !== 'none'
                && this.lessonManager.currentLesson;

            if (!lessonActive) {
                if (status) status.textContent = 'Start a lesson first.';
                return;
            }

            document.getElementById('correct-feedback')?.style.setProperty('display', 'none');
            document.getElementById('wrong-feedback')?.style.setProperty('display', 'none');
            this.lessonManager.completeLesson();
            if (status) status.textContent = 'Lesson finished.';
            setPanelOpen(false);
        });

        document.getElementById('debug-restart-btn')?.addEventListener('click', () => {
            const confirmed = window.confirm(
                'Restart Gateaux from scratch? This clears local score, lessons, and cakes.'
            );
            if (!confirmed) return;

            Object.keys(localStorage)
                .filter(key => key.startsWith('gateaux_'))
                .forEach(key => localStorage.removeItem(key));
            window.location.reload();
        });
    }

    maybeShowFirstRun() {
        if (gameState.isFirstLessonDone()) return;
        const overlay = document.getElementById('first-run-overlay');
        if (!overlay) return;
        overlay.style.display = 'flex';
        overlay.classList.remove('overlay-enter');
        void overlay.offsetWidth;
        overlay.classList.add('overlay-enter');
    }

    hideFirstRun() {
        const overlay = document.getElementById('first-run-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    startFirstRunLesson(language) {
        this.hideFirstRun();
        const lesson = getLessonById(language, FIRST_RUN_LESSON_ID);
        if (!lesson) {
            this.openLessonOverlay(language);
            return;
        }
        this.currentLanguage = language;
        this.currentRecipe = getRecipeForTeacher('marcel', language);
        const overlay = document.getElementById('lesson-overlay');
        if (overlay) {
            overlay.style.display = 'block';
            overlay.classList.remove('overlay-enter');
            void overlay.offsetWidth;
            overlay.classList.add('overlay-enter');
        }
        this.startLesson(lesson);
    }

    setupPageLifecycle() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                audioManager.pauseMusic();
                displayCase.touchLastSeen();
                if (this.decayCheckInterval) {
                    clearInterval(this.decayCheckInterval);
                    this.decayCheckInterval = null;
                }
            } else {
                audioManager.resumeMusic();
                displayCase.onSessionResume();
                this.startDecayTimer();
                this.updateStats();
                this.showAwaySalesLine();
            }
        });
    }

    setupLevelUpListener() {
        window.addEventListener('gateaux:level-up', (e) => {
            this.showLevelUpCelebration(e.detail);
        });
    }

    setupEventListeners() {
        // Language cards open the recipe picker
        document.querySelectorAll('.language-card').forEach(card => {
            card.addEventListener('click', () => {
                const language = card.dataset.language;
                if (language) this.openLessonOverlay(language);
            });
            card.style.cursor = 'pointer';
        });

        // Close recipe picker (closes entire overlay)
        document.getElementById('close-recipe-picker')?.addEventListener('click', () => {
            this.closeLessonOverlay();
        });

        // Back to recipes from lesson select
        document.getElementById('back-to-recipes')?.addEventListener('click', () => {
            this.showRecipePicker();
        });

        document.getElementById('quit-lesson')?.addEventListener('click', () => {
            this.closeLessonOverlay();
        });

        // Lesson complete buttons
        document.getElementById('bake-another-btn')?.addEventListener('click', () => {
            this.showRecipePicker();
        });

        document.getElementById('back-to-cafe-btn')?.addEventListener('click', () => {
            this.closeLessonOverlay();
        });

        // Customer service
        document.getElementById('new-customer-btn')?.addEventListener('click', () => {
            this.customerService.generateNewCustomer();
        });

        document.getElementById('play-customer-audio')?.addEventListener('click', () => {
            this.customerService.playCustomerAudio();
        });
    }

    // Handle "Bake This" from recipe book
    onBakeFromRecipeBook(recipe) {
        this.currentLanguage = recipe.language;
        this.currentRecipe = recipe;
        this.openLessonOverlayWithRecipe(recipe);
    }

    // Open full-screen lesson overlay — shows recipe picker first
    openLessonOverlay(language) {
        this.currentLanguage = language;
        this.currentRegion = null;
        this.currentRecipe = null;

        const overlay = document.getElementById('lesson-overlay');
        if (!overlay) return;
        overlay.style.display = 'block';
        overlay.classList.remove('overlay-enter');
        void overlay.offsetWidth;
        overlay.classList.add('overlay-enter');

        this.showRecipePicker();
    }

    // Open lesson overlay with a specific recipe pre-selected (from recipe book)
    openLessonOverlayWithRecipe(recipe) {
        this.currentLanguage = recipe.language;
        this.currentRecipe = recipe;

        const overlay = document.getElementById('lesson-overlay');
        if (!overlay) return;
        overlay.style.display = 'block';
        overlay.classList.remove('overlay-enter');
        void overlay.offsetWidth;
        overlay.classList.add('overlay-enter');

        this.showLessonSelectionForRecipe();
    }

    // Toggle lesson overlay screens with enter animation
    showScreen(screenId) {
        const screens = ['recipe-picker-screen', 'lesson-select-screen', 'lesson-quiz-screen', 'lesson-complete-screen'];
        screens.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = id === screenId ? 'flex' : 'none';
        });
        const active = document.getElementById(screenId);
        if (active) {
            active.classList.remove('screen-enter');
            void active.offsetWidth;
            active.classList.add('screen-enter');
        }
    }

    // Show the recipe picker screen
    showRecipePicker() {
        this.showScreen('recipe-picker-screen');
        this.renderRecipePicker();
    }

    // Render recipe picker cards
    renderRecipePicker() {
        const grid = document.getElementById('recipe-picker-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const recipes = getRecipesForLanguage(this.currentLanguage);
        const playerLevel = gameState.getLevel();

        recipes.forEach(recipe => {
            const isUnlocked = recipe.unlockLevel <= playerLevel;
            const card = document.createElement('div');
            card.className = `recipe-picker-card${isUnlocked ? '' : ' locked'}`;

            const teacherName = recipe.teacher === 'all'
                ? 'All Teachers'
                : (teachers[recipe.teacher]?.name || recipe.teacher);

            card.innerHTML = `
                <img class="rp-cake-img" src="assets/images/cakes/${recipe.imageFile}"
                     alt="${recipe.name}" data-image-name="${recipe.name}">
                <span class="rp-rarity-badge rarity-${recipe.rarity}">${getRarityLabel(recipe.rarity)}</span>
                <span class="rp-cake-name">${isUnlocked ? recipe.name : '???'}</span>
                <span class="rp-teacher-name">${isUnlocked ? teacherName : ''}</span>
                ${!isUnlocked ? `<span class="rp-lock-label">Level ${recipe.unlockLevel}</span>` : ''}
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    this.currentRecipe = recipe;
                    this.showLessonSelectionForRecipe();
                });
            }

            grid.appendChild(card);
        });
    }

    // Show lesson selection filtered by the selected recipe's teacher
    showLessonSelectionForRecipe() {
        this.showScreen('lesson-select-screen');

        // Update title
        const title = document.getElementById('lesson-language-title');
        if (title && this.currentRecipe) {
            title.textContent = this.currentRecipe.name;
        }

        // Render region selector
        this.renderRegionSelector(this.currentLanguage);

        // Load lessons filtered by teacher
        this.showLessonSelection();
    }

    // Close the lesson overlay
    closeLessonOverlay() {
        const overlay = document.getElementById('lesson-overlay');
        if (overlay) overlay.style.display = 'none';
        this.currentRecipe = null;
        this.updateStats();
        if (!gameState.isFirstLessonDone()) this.maybeShowFirstRun();
    }

    // Render region flag buttons
    // Region filtering is not yet active — phrase data does not carry region tags.
    // Keep the container empty so the selector is invisible until that data ships.
    renderRegionSelector(language) {
        const container = document.getElementById('region-selector');
        if (!container) return;
        container.innerHTML = '';
        this.currentRegion = null;
    }

    // Show lesson selection screen (filtered by current recipe's teacher)
    showLessonSelection() {

        // Region filtering disabled: phrases.json doesn't have region data yet
        const lessons = getLessons(this.currentLanguage, null);

        const container = document.getElementById('lesson-categories');
        if (!container) return;
        container.innerHTML = '';

        if (!lessons || lessons.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No lessons available.</p>';
            return;
        }

        // Filter by recipe teacher (unless legendary/all)
        const teacherFilter = this.currentRecipe?.teacher;
        const filteredLessons = teacherFilter && teacherFilter !== 'all'
            ? lessons.filter(l => l.teacher === teacherFilter)
            : lessons;

        if (filteredLessons.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No lessons available for this recipe.</p>';
            return;
        }

        // Group by teacher
        const teacherGroups = {};
        filteredLessons.forEach(lesson => {
            const tid = lesson.teacher;
            if (!teacherGroups[tid]) {
                teacherGroups[tid] = { teacher: teachers[tid], lessons: [] };
            }
            teacherGroups[tid].lessons.push(lesson);
        });

        Object.entries(teacherGroups).forEach(([teacherId, group]) => {
            const section = document.createElement('div');
            section.className = `lesson-category`;

            const diffLabel = group.lessons[0]?.difficulty <= 1 ? 'Beginner' :
                             group.lessons[0]?.difficulty <= 2 ? 'Elementary' : 'Intermediate';
            const diffClass = group.lessons[0]?.difficulty <= 1 ? 'beginner' :
                             group.lessons[0]?.difficulty <= 2 ? 'elementary' : 'intermediate';

            section.innerHTML = `
                <div class="lesson-category-hero">
                    <img src="assets/images/characters/${teacherId}_concept.png"
                         alt="${group.teacher.name}"
                         class="lesson-category-hero-img"
                         data-image-name="${group.teacher.name}">
                    <div class="lesson-category-hero-info">
                        <h3>${group.teacher.name} <span class="difficulty-badge ${diffClass}">${diffLabel}</span></h3>
                        <p class="teacher-description">${group.teacher.personality}</p>
                        <p class="teacher-specialty">${group.teacher.specialties[0]}</p>
                    </div>
                </div>
            `;

            const lessonList = document.createElement('div');
            lessonList.className = 'lesson-list';

            group.lessons.forEach((lesson) => {
                lessonList.appendChild(this.createLessonItem(lesson));
            });

            section.appendChild(lessonList);
            container.appendChild(section);
        });
    }

    // Create a lesson item
    createLessonItem(lesson) {
        const completed = gameState.isLessonCompleted(this.currentLanguage, lesson.id);
        const item = document.createElement('div');
        item.className = `lesson-item ${completed ? 'completed' : ''}`;

        item.innerHTML = `
            <div class="lesson-portrait-wrap">
                <img src="assets/images/characters/${lesson.teacher}_neutral.png"
                     alt="${teachers[lesson.teacher]?.name || ''}"
                     class="lesson-teacher-portrait">
                ${completed ? '<span class="lesson-done-badge">✓</span>' : ''}
            </div>
            <div class="lesson-info">
                <h4>${lesson.title}</h4>
                <p>${lesson.description}</p>
                <span class="phrase-count">${Math.min(lesson.phrases.length, 5)} phrases</span>
            </div>
        `;

        item.addEventListener('click', () => {
            this.startLesson(lesson);
        });

        return item;
    }

    // Start a lesson — switch to quiz screen
    startLesson(lesson) {
        this.showScreen('lesson-quiz-screen');

        this.lessonManager.startLesson(this.currentLanguage, this.currentRegion, lesson, (completed) => {
            if (completed) this.onLessonComplete(lesson);
        }, this.currentRecipe);
    }

    // Lesson completed (completeLesson already called by lessonManager)
    onLessonComplete(lesson) {
        const recipeId = this.currentRecipe?.id || null;
        const firstEver = Object.keys(gameState.bakedCakes).length === 0
            && displayCase.getTotalCount() === 0;
        displayCase.addCake(this.currentLanguage, lesson.id, recipeId, { firstEver });
        this.startDecayTimer();

        gameState.addTips(25);
        this.showTipFeedback('+25');

        if (recipeId) {
            gameState.recordBakedCake(recipeId);
        }

        audioManager.playLessonComplete();
        this.showLessonComplete();
    }

    // Show the floating tip arc feedback
    showTipFeedback(text) {
        const el = document.getElementById('tip-feedback');
        const span = document.getElementById('tip-feedback-text');
        if (!el || !span) return;
        span.textContent = text;
        el.style.display = 'block';
        // Re-trigger animation
        span.style.animation = 'none';
        void span.offsetWidth;
        span.style.animation = '';
        setTimeout(() => {
            el.style.display = 'none';
        }, 1200);
    }

    // Show completion screen — called after lesson finishes
    showLessonComplete() {
        this.showScreen('lesson-complete-screen');

        const recipe = this.currentRecipe;
        const nameEl = document.getElementById('cake-baked-name');
        const imgEl = document.getElementById('cake-reward-img');

        if (recipe) {
            if (nameEl) nameEl.textContent = recipe.name;
            if (imgEl) {
                imgEl.src = `assets/images/cakes/${recipe.imageFile}`;
                imgEl.alt = recipe.name;
                imgEl.dataset.imageName = recipe.name;
            }
        } else {
            const cakeName = cakeTypes[this.currentLanguage]?.spain?.name ||
                            cakeTypes[this.currentLanguage]?.paris?.name ||
                            'Delicious Cake';
            if (nameEl) nameEl.textContent = cakeName;
        }
    }

    // Show level-up celebration
    showLevelUpCelebration({ oldLevel, newLevel }) {
        const overlay = document.getElementById('level-up-overlay');
        if (!overlay) return;
        overlay.classList.remove('overlay-enter');

        const numberEl = document.getElementById('level-up-number');
        const labelEl = document.getElementById('level-up-label');
        const unlockEl = document.getElementById('level-up-unlock');

        const levelData = getLevelData(newLevel);
        if (numberEl) numberEl.textContent = newLevel;
        if (labelEl) labelEl.textContent = levelData?.label || '';

        const newRecipes = getRecipesForLevel(newLevel);
        if (unlockEl) {
            if (newRecipes.length > 0) {
                const teacher = newRecipes[0].teacher;
                if (teacher === 'all') {
                    unlockEl.textContent = 'Legendary recipes unlocked!';
                } else {
                    const teacherName = teachers[teacher]?.name || teacher;
                    unlockEl.textContent = `${teacherName}'s recipes unlocked!`;
                }
            } else {
                unlockEl.textContent = 'New content unlocked!';
            }
        }

        overlay.style.display = 'flex';
        void overlay.offsetWidth;
        overlay.classList.add('overlay-enter');
        audioManager.playLevelUp();

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 3000);
    }

    // 1s while cakes are setting so the countdown is believable; 60s otherwise.
    startDecayTimer() {
        if (this.decayCheckInterval) clearInterval(this.decayCheckInterval);
        const tickMs = displayCase.hasSettingCakes() ? 1000 : 60000;
        this.decayCheckInterval = setInterval(() => {
            displayCase.checkDecay();
            displayCase.updateDisplay();
            this.updateCakeCount();
            this.customerService.syncCounterControls();
            const nextMs = displayCase.hasSettingCakes() ? 1000 : 60000;
            if (nextMs !== tickMs) this.startDecayTimer();
        }, tickMs);
        this.updateCakeCount();
    }

    showAwaySalesLine() {
        const sold = displayCase.lastAwaySales;
        if (!sold) return;
        displayCase.lastAwaySales = 0;
        const banner = document.getElementById('welcome-banner');
        const textEl = document.getElementById('welcome-text');
        if (!banner || !textEl) return;
        banner.classList.remove('hidden');
        textEl.textContent = sold === 1
            ? 'Sold one while you were out.'
            : 'Sold a couple while you were out.';
    }

    updateCakeCount() {
        // Cake count is visible in the display case shelves; no separate counter element needed
    }

    // Update game stats and contextual UI
    updateStats() {
        const tipsEl = document.getElementById('total-tips');
        if (tipsEl) tipsEl.textContent = gameState.getTotalTips();

        gameState.updateUI();
        displayCase.updateDisplay();

        const status = displayCase.getInventoryStatus();
        const totalCakes = Object.values(status).reduce((sum, s) => sum + s.count, 0);
        const readyCakes = Object.values(status).reduce((sum, s) => sum + (s.readyCount || 0), 0);
        const banner = document.getElementById('welcome-banner');
        const textEl = document.getElementById('welcome-text');
        const customerSection = document.getElementById('customer-section');

        if (banner && textEl && !displayCase.lastAwaySales) {
            if (totalCakes === 0) {
                banner.classList.remove('hidden');
                textEl.textContent = 'Pick a language. We start with how locals say hi.';
            } else if (readyCakes === 0) {
                banner.classList.remove('hidden');
                textEl.textContent = "They're setting. Bake another, or hang around.";
            } else if (totalCakes < 3) {
                banner.classList.remove('hidden');
                textEl.textContent = 'Keep a couple cakes in the case — then serve someone.';
            } else {
                banner.classList.add('hidden');
            }
        }

        if (customerSection) {
            customerSection.style.display = totalCakes > 0 ? '' : 'none';
        }

        this.customerService.syncCounterControls();
    }
}

// Start screen handler
function setupStartScreen() {
    const startBtn = document.getElementById('start-game-btn');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');

    if (startBtn && startScreen && gameContainer) {
        startBtn.addEventListener('click', () => {
            audioManager.unlock();
            startScreen.classList.add('hidden');
            setTimeout(() => {
                startScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                gameContainer.classList.remove('overlay-enter');
                void gameContainer.offsetWidth;
                gameContainer.classList.add('overlay-enter');
                if (window.gateauxGame) {
                    window.gateauxGame.maybeShowFirstRun();
                }
            }, 300);
        });
    }
}

// Module scope initialization
setupImagePlaceholders();
setupStartScreen();

// Dev/review shortcut: ?autostart skips the start screen and tutorial
// Add &screen=lesson-select or &screen=quiz to jump to a specific screen
if (new URLSearchParams(window.location.search).has('autostart')) {
    const params = new URLSearchParams(window.location.search);
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    if (startScreen && gameContainer) {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
    }
    localStorage.setItem('gateaux_tutorial_seen', '1');
    const firstRun = document.getElementById('first-run-overlay');
    if (firstRun) firstRun.style.display = 'none';

    // Jump to a specific screen after init
    const targetScreen = params.get('screen');
    if (targetScreen) {
        window.addEventListener('gateaux:init-complete', () => {
            const game = window.gateauxGame;
            if (!game) return;
            if (targetScreen === 'lesson-select' || targetScreen === 'quiz') {
                game.openLessonOverlay('spanish');
                // Click past the recipe picker to lesson selection
                setTimeout(() => {
                    const firstCard = document.querySelector('.recipe-picker-card');
                    if (firstCard) firstCard.click();
                }, 300);
                // For quiz, also click the first lesson item
                if (targetScreen === 'quiz') {
                    setTimeout(() => {
                        const firstLesson = document.querySelector('.lesson-item');
                        if (firstLesson) firstLesson.click();
                    }, 700);
                }
            }
        });
    }
}

async function initGame() {
    try {
        await loadPhrases();
        gameState.init();
        window.gateauxGame = new GateauxGame();

        window.debugGame = {
            game: window.gateauxGame,
            gameState: gameState,
            getLessons: getLessons,
            testOpenOverlay: (lang) => window.gateauxGame.openLessonOverlay(lang)
        };

        window.dispatchEvent(new CustomEvent('gateaux:init-complete'));
    } catch (e) {
        console.error('[init] Failed to initialize GateauxGame:', e);
        // Surface a visible retry screen so players don't see a blank start screen
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.innerHTML = `
                <div style="text-align:center;padding:40px 20px;">
                    <p style="color:#fff;font-size:1.1rem;margin-bottom:8px;font-family:Comfortaa,sans-serif;">
                        Couldn't load Gateaux
                    </p>
                    <p style="color:rgba(255,255,255,.65);font-size:0.9rem;margin-bottom:24px;">
                        Please refresh and try again.
                    </p>
                    <button onclick="location.reload()"
                        style="padding:12px 28px;border-radius:12px;border:none;background:#C49A30;
                               color:#2F1B14;font-size:1rem;cursor:pointer;font-weight:600;
                               font-family:Comfortaa,sans-serif;">
                        Refresh
                    </button>
                </div>
            `;
        }
    }
}

initGame();
