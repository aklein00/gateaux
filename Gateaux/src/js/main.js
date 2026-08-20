// Gateaux - Main Game Controller
import { loadPhrases, getLessons, cakeTypes, teachers, getLessonById, FIRST_RUN_LESSON_ID } from './languageData.js';
import { displayCase } from './displayCase.js';
import { gameState } from './gameState.js';
import { LessonManager } from './lessonManager.js';
import { CustomerService } from './customerService.js';
import { getRecipesForLevel, getLevelData, getRarityLabel, getRecipeForTeacher } from './recipeData.js';
import { setOnBakeCallback, setupRecipeBookListeners } from './recipeBook.js';
import { audioManager } from './audioManager.js';

const PATH_ORDER = ['marcel', 'amelie', 'cafe', 'bisou', 'gaston', 'all'];
const PATH_LABELS = {
    marcel: 'Beginner slang',
    amelie: 'Next: polite',
    cafe: 'Rush',
    bisou: 'Charm',
    gaston: 'Shade',
    all: 'The whole kitchen'
};
const MARCEL_FIRST_LESSON = 'greetings_casual';

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
        this.startLesson(lesson, { firstRun: true });
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

        document.getElementById('close-path-select')?.addEventListener('click', () => {
            this.closeLessonOverlay();
        });

        document.getElementById('quit-lesson')?.addEventListener('click', () => {
            this.closeLessonOverlay();
        });

        document.getElementById('bake-another-btn')?.addEventListener('click', () => {
            this.showPathSelect();
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

        this.showPathSelect();
    }

    openLessonOverlayWithRecipe(recipe) {
        this.currentLanguage = recipe.language;
        this.currentRecipe = recipe;

        const overlay = document.getElementById('lesson-overlay');
        if (!overlay) return;
        overlay.style.display = 'block';
        overlay.classList.remove('overlay-enter');
        void overlay.offsetWidth;
        overlay.classList.add('overlay-enter');

        this.showPathSelect(recipe.teacher);
    }

    showScreen(screenId) {
        const screens = ['path-select-screen', 'lesson-quiz-screen', 'lesson-complete-screen'];
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
    showPathSelect(expandTeacher = null) {
        this.showScreen('path-select-screen');
        const title = document.getElementById('path-select-title');
        if (title) {
            title.textContent = this.currentLanguage === 'spanish' ? 'Spanish' : 'French';
        }
        this.renderPathSelect(expandTeacher);
    }

    isPathUnlocked(teacherId, recipe) {
        const level = gameState.getLevel();
        if (teacherId === 'marcel') return true;
        if (teacherId === 'amelie') {
            return gameState.isLessonCompleted(this.currentLanguage, MARCEL_FIRST_LESSON);
        }
        return recipe && recipe.unlockLevel <= level;
    }

    pathLockCopy(teacherId, recipe) {
        if (teacherId === 'amelie') return 'Finish Marcel’s first hello.';
        if (recipe) return `Level ${recipe.unlockLevel}`;
        return 'Locked';
    }

    renderPathSelect(expandTeacher = null) {
        const list = document.getElementById('path-list');
        if (!list) return;
        list.innerHTML = '';

        const lessons = getLessons(this.currentLanguage, null) || [];
        const openId = expandTeacher || 'marcel';

        PATH_ORDER.forEach(teacherId => {
            const recipe = getRecipeForTeacher(teacherId, this.currentLanguage);
            if (!recipe && teacherId !== 'all') return;

            const pathLessons = teacherId === 'all'
                ? []
                : lessons.filter(l => l.teacher === teacherId)
                    .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));

            const unlocked = this.isPathUnlocked(teacherId, recipe);
            const teacherName = teacherId === 'all'
                ? 'Everyone'
                : (teachers[teacherId]?.name || teacherId);
            const rarity = recipe?.rarity || 'common';

            const card = document.createElement('div');
            card.className = `path-card${unlocked ? '' : ' locked'}${openId === teacherId && unlocked ? ' expanded' : ''}`;
            card.dataset.teacher = teacherId;

            const portraitFile = teacherId === 'all'
                ? 'marcel_concept.png'
                : `${teacherId}_concept.png`;

            card.innerHTML = `
                <button type="button" class="path-card-row" ${unlocked ? '' : 'disabled'}>
                    <img class="path-portrait" src="assets/images/characters/${portraitFile}"
                         alt="${teacherName}" data-image-name="${teacherName}">
                    <div class="path-copy">
                        <h3>${teacherName}</h3>
                        <p>${PATH_LABELS[teacherId] || ''}</p>
                        <span class="rp-rarity-badge rarity-${rarity}">${getRarityLabel(rarity)}</span>
                        ${unlocked ? '' : `<span class="path-lock">${this.pathLockCopy(teacherId, recipe)}</span>`}
                    </div>
                    <img class="path-cake" src="assets/images/cakes/${recipe?.imageFile || 'eclair_fresh.png'}"
                         alt="${recipe?.name || ''}" data-image-name="${recipe?.name || 'Cake'}">
                </button>
                <div class="path-lessons"></div>
            `;

            const row = card.querySelector('.path-card-row');
            const lessonWrap = card.querySelector('.path-lessons');

            if (unlocked) {
                row.addEventListener('click', () => {
                    const wasOpen = card.classList.contains('expanded');
                    list.querySelectorAll('.path-card').forEach(el => el.classList.remove('expanded'));
                    if (!wasOpen) card.classList.add('expanded');
                });

                pathLessons.forEach((lesson, index) => {
                    const prev = pathLessons[index - 1];
                    const seqLocked = index > 0 && !gameState.isLessonCompleted(this.currentLanguage, prev.id);
                    lessonWrap.appendChild(this.createLessonItem(lesson, recipe, seqLocked));
                });

                if (teacherId === 'all' && pathLessons.length === 0) {
                    const empty = document.createElement('p');
                    empty.className = 'path-empty';
                    empty.textContent = unlocked
                        ? 'No extra lesson — that cake is the brag.'
                        : '';
                    if (unlocked) lessonWrap.appendChild(empty);
                }
            }

            list.appendChild(card);
        });
    }

    createLessonItem(lesson, recipe, seqLocked) {
        const completed = gameState.isLessonCompleted(this.currentLanguage, lesson.id);
        const item = document.createElement('div');
        item.className = `lesson-item${completed ? ' completed' : ''}${seqLocked ? ' locked' : ''}`;

        item.innerHTML = `
            <div class="lesson-portrait-wrap">
                <img src="assets/images/characters/${lesson.teacher}_neutral.png"
                     alt="${teachers[lesson.teacher]?.name || ''}"
                     class="lesson-teacher-portrait">
                ${completed ? '<span class="lesson-done-badge">✓</span>' : ''}
            </div>
            <div class="lesson-info">
                <h4>${lesson.title}</h4>
                <p>${seqLocked ? 'Do the one above first.' : lesson.description}</p>
                <span class="phrase-count">${Math.min(lesson.phrases.length, 5)} phrases</span>
            </div>
        `;

        if (!seqLocked) {
            item.addEventListener('click', () => {
                this.currentRecipe = recipe;
                this.startLesson(lesson);
            });
        }

        return item;
    }

    closeLessonOverlay() {
        const overlay = document.getElementById('lesson-overlay');
        if (overlay) overlay.style.display = 'none';
        this.currentRecipe = null;
        this.updateStats();
        if (!gameState.isFirstLessonDone()) this.maybeShowFirstRun();
    }

    // Start a lesson — switch to quiz screen
    startLesson(lesson, options = {}) {
        this.showScreen('lesson-quiz-screen');

        this.lessonManager.startLesson(this.currentLanguage, this.currentRegion, lesson, (completed) => {
            if (completed) this.onLessonComplete(lesson);
        }, this.currentRecipe, options);
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
                if (targetScreen === 'quiz') {
                    setTimeout(() => {
                        const firstLesson = document.querySelector('.lesson-item:not(.locked)');
                        if (firstLesson) firstLesson.click();
                    }, 400);
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
