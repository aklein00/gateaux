// Game State Management for Gateaux
// Handles progress tracking, leveling, achievements, and user data

import { calculateLevel, getLevelProgress, getRecipesForLevel } from './recipeData.js';

export const gameState = {
    // User progress data
    progress: {
        spanish: {
            completedLessons: [],
            learnedPhrases: [],
            totalTips: 0,
            level: 1
        },
        french: {
            completedLessons: [],
            learnedPhrases: [],
            totalTips: 0,
            level: 1
        }
    },

    // Global player state (level is global, not per-language)
    player: {
        level: 1,
        totalTipsEarned: 0
    },

    // Tracks which recipes have been baked and how many times
    bakedCakes: {},
    // Example: { eclair_classique: { count: 3, firstBaked: 1707400000000 } }

    // Cafe customization data
    cafe: {
        decorations: [],
        layout: 'default',
        theme: 'classic'
    },

    // Settings
    settings: {
        audioEnabled: true,
        difficulty: 'normal',
        language: 'en'
    },

    // Most recent completed lesson — used so café customers recycle those phrases
    lastLesson: {
        language: null,
        lessonId: null,
        phrases: []
    },

    // Initialize game state
    init() {
        this.loadFromStorage();
        this.updateUI();
    },

    // Save progress to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('gateaux_progress', JSON.stringify(this.progress));
            localStorage.setItem('gateaux_player', JSON.stringify(this.player));
            localStorage.setItem('gateaux_baked_cakes', JSON.stringify(this.bakedCakes));
            localStorage.setItem('gateaux_cafe', JSON.stringify(this.cafe));
            localStorage.setItem('gateaux_settings', JSON.stringify(this.settings));
            localStorage.setItem('gateaux_last_lesson', JSON.stringify(this.lastLesson));
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    },

    // Load progress from localStorage
    loadFromStorage() {
        try {
            const savedProgress = localStorage.getItem('gateaux_progress');
            if (savedProgress) {
                const parsedProgress = JSON.parse(savedProgress);
                // Safely merge saved progress to prevent errors with old data structures
                Object.keys(this.progress).forEach(lang => {
                    if (parsedProgress[lang]) {
                        this.progress[lang] = { ...this.progress[lang], ...parsedProgress[lang] };
                    }
                });
            }

            const savedPlayer = localStorage.getItem('gateaux_player');
            if (savedPlayer) {
                this.player = { ...this.player, ...JSON.parse(savedPlayer) };
            } else {
                // Migration: set totalTipsEarned from existing tips for old saves
                this.player.totalTipsEarned = this.getTotalTips();
                this.player.level = calculateLevel(this.player.totalTipsEarned);
            }

            const savedBaked = localStorage.getItem('gateaux_baked_cakes');
            if (savedBaked) {
                this.bakedCakes = JSON.parse(savedBaked);
            }

            const savedCafe = localStorage.getItem('gateaux_cafe');
            if (savedCafe) {
                this.cafe = { ...this.cafe, ...JSON.parse(savedCafe) };
            }

            const savedSettings = localStorage.getItem('gateaux_settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }

            const savedLast = localStorage.getItem('gateaux_last_lesson');
            if (savedLast) {
                this.lastLesson = { ...this.lastLesson, ...JSON.parse(savedLast) };
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
        }
    },

    // Lesson completion
    completeLesson(language, lessonId) {
        if (!this.progress[language]) {
            this.progress[language] = {
                completedLessons: [],
                learnedPhrases: [],
                totalTips: 0,
                level: 1
            };
        }

        if (!this.progress[language].completedLessons.includes(lessonId)) {
            this.progress[language].completedLessons.push(lessonId);
            this.saveToStorage();
            this.updateUI();
        }
    },

    isFirstLessonDone() {
        if (localStorage.getItem('gateaux_first_lesson_done') === '1') return true;
        return Object.values(this.progress).some(p => p.completedLessons?.length > 0);
    },

    markFirstLessonDone() {
        localStorage.setItem('gateaux_first_lesson_done', '1');
        localStorage.setItem('gateaux_tutorial_seen', '1');
    },

    setLastLesson(language, lesson, phrases = []) {
        this.lastLesson = {
            language,
            lessonId: lesson?.id || null,
            phrases: phrases.map(p => ({
                id: p.id,
                native: p[language] || p.french || p.spanish,
                english: p.english
            })).filter(p => p.native && p.english)
        };
        this.saveToStorage();
    },

    getLastLesson() {
        return this.lastLesson;
    },

    // Check if lesson is completed
    isLessonCompleted(language, lessonId) {
        return this.progress[language]?.completedLessons?.includes(lessonId) || false;
    },

    // Learn a phrase
    learnPhrase(language, phraseId) {
        if (!this.progress[language]) {
            this.progress[language] = {
                completedLessons: [],
                learnedPhrases: [],
                totalTips: 0,
                level: 1
            };
        }

        if (!this.progress[language].learnedPhrases.includes(phraseId)) {
            this.progress[language].learnedPhrases.push(phraseId);
            this.addTips(5); // Small tip for learning a phrase (addTips handles save + UI)
        }
    },

    // Add tips (currency) and check for level-up
    addTips(amount) {
        // Add tips to all languages (shared currency)
        Object.keys(this.progress).forEach(language => {
            if (this.progress[language]) {
                this.progress[language].totalTips += amount;
            }
        });

        // Track lifetime tips and check level
        this.player.totalTipsEarned += amount;
        const newLevel = calculateLevel(this.player.totalTipsEarned);
        if (newLevel > this.player.level) {
            const oldLevel = this.player.level;
            this.player.level = newLevel;
            window.dispatchEvent(new CustomEvent('gateaux:level-up', {
                detail: { oldLevel, newLevel, totalTipsEarned: this.player.totalTipsEarned }
            }));
        }

        this.saveToStorage();
        this.updateUI();
    },

    // Get total tips
    getTotalTips() {
        const languages = Object.keys(this.progress);
        if (languages.length === 0) return 0;
        return this.progress[languages[0]].totalTips;
    },

    // Get player level
    getLevel() {
        return this.player.level;
    },

    // Get level progress info
    getLevelProgress() {
        return getLevelProgress(this.player.totalTipsEarned);
    },

    // Record a baked cake
    recordBakedCake(recipeId) {
        if (!this.bakedCakes[recipeId]) {
            this.bakedCakes[recipeId] = { count: 0, firstBaked: Date.now() };
        }
        this.bakedCakes[recipeId].count++;
        this.saveToStorage();
    },

    // Check if a recipe has been baked before
    hasBeenBaked(recipeId) {
        return !!this.bakedCakes[recipeId];
    },

    // Get bake count for a recipe
    getBakeCount(recipeId) {
        return this.bakedCakes[recipeId]?.count || 0;
    },

    // ── Animated number count-up ──
    _animateNumber(el, targetVal, durationMs = 300) {
        if (!el) return;
        const startVal = parseInt(el.textContent, 10) || 0;
        if (startVal === targetVal) return;
        const diff = targetVal - startVal;
        const startTime = performance.now();
        const step = (now) => {
            const t = Math.min((now - startTime) / durationMs, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(startVal + diff * eased);
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    },

    // Pulse the stat pill element briefly
    _pulsePill(el) {
        if (!el) return;
        el.classList.remove('pulse');
        void el.offsetWidth; // reflow
        el.classList.add('pulse');
        el.addEventListener('animationend', () => el.classList.remove('pulse'), { once: true });
    },

    // Update UI elements
    updateUI() {
        // Animate tips display
        const tipsElement = document.getElementById('total-tips');
        if (tipsElement) {
            const target = this.getTotalTips();
            const current = parseInt(tipsElement.textContent, 10) || 0;
            if (current !== target) {
                this._animateNumber(tipsElement, target, 250);
                // Pulse the coin pill when tips change
                const coinPill = tipsElement.closest('.stat-pill');
                this._pulsePill(coinPill);
            }
        }

        // Animate level display
        const levelEl = document.getElementById('player-level');
        if (levelEl) {
            const target = this.player.level;
            const current = parseInt(levelEl.textContent, 10) || 0;
            if (current !== target) this._animateNumber(levelEl, target, 200);
        }

        // Animate level progress bar
        const levelProgress = this.getLevelProgress();
        const levelFill = document.getElementById('level-progress-fill');
        if (levelFill) {
            levelFill.style.width = `${levelProgress.progress * 100}%`;
        }

        const levelLabel = document.getElementById('level-label');
        if (levelLabel) {
            levelLabel.textContent = levelProgress.label;
        }

        // Update language card progress
        this.updateLanguageCardProgress();
    },

    // Update progress bars on language cards
    updateLanguageCardProgress() {
        Object.keys(this.progress).forEach(language => {
            const card = document.querySelector(`[data-language="${language}"]`);
            if (!card) return;

            const progress = this.progress[language];
            if (!progress || !progress.completedLessons) return;

            const totalLessons = 5; // Estimate based on lesson structure
            const completedCount = progress.completedLessons.length;
            const progressPercent = (completedCount / totalLessons) * 100;

            const progressBar = card.querySelector('.progress');
            const progressText = card.querySelector('.progress-text');

            if (progressBar) {
                progressBar.style.width = `${progressPercent}%`;
            }

            if (progressText) {
                progressText.textContent = `${completedCount} lessons learned`;
            }
        });
    },

    // Get user statistics
    getStats() {
        const stats = {
            totalLanguages: Object.keys(this.progress).length,
            totalRecipesCompleted: 0,
            totalPhrasesLearned: 0,
            totalTips: this.getTotalTips(),
            level: this.player.level,
            totalCakesBaked: Object.values(this.bakedCakes).reduce((sum, b) => sum + b.count, 0),
            uniqueRecipesBaked: Object.keys(this.bakedCakes).length
        };

        Object.values(this.progress).forEach(languageProgress => {
            stats.totalRecipesCompleted += languageProgress.completedLessons ? languageProgress.completedLessons.length : 0;
            stats.totalPhrasesLearned += languageProgress.learnedPhrases ? languageProgress.learnedPhrases.length : 0;
        });

        return stats;
    },

    // Reset all progress (for testing)
    resetProgress() {
        this.progress = {
            spanish: {
                completedLessons: [],
                learnedPhrases: [],
                totalTips: 0,
                level: 1
            },
            french: {
                completedLessons: [],
                learnedPhrases: [],
                totalTips: 0,
                level: 1
            }
        };
        this.player = { level: 1, totalTipsEarned: 0 };
        this.bakedCakes = {};
        this.lastLesson = { language: null, lessonId: null, phrases: [] };
        this.cafe = {
            decorations: [],
            layout: 'default',
            theme: 'classic'
        };
        localStorage.removeItem('gateaux_first_lesson_done');
        this.saveToStorage();
        this.updateUI();
    },

    // Export progress (for backup)
    exportProgress() {
        return {
            progress: this.progress,
            player: this.player,
            bakedCakes: this.bakedCakes,
            lastLesson: this.lastLesson,
            cafe: this.cafe,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
    },

    // Import progress (for restore)
    importProgress(data) {
        try {
            if (data.progress) this.progress = data.progress;
            if (data.player) this.player = data.player;
            if (data.bakedCakes) this.bakedCakes = data.bakedCakes;
            if (data.lastLesson) this.lastLesson = data.lastLesson;
            if (data.cafe) this.cafe = data.cafe;
            if (data.settings) this.settings = data.settings;

            this.saveToStorage();
            this.updateUI();
            return true;
        } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
        }
    }
};

// gameState.init() will now be called by the main game controller after the DOM is ready.
