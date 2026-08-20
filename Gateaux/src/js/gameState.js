// Game State Management for Gateaux
// Wallet (coins / diamonds) is separate from XP (levels the player).

import { calculateLevel, getLevelProgress } from './recipeData.js';
import { STARTER_COINS, STARTER_DIAMONDS, PHRASE_FIRST_LEARN_BONUS } from './economy.js';

export const gameState = {
    progress: {
        spanish: {
            completedLessons: [],
            learnedPhrases: [],
            level: 1
        },
        french: {
            completedLessons: [],
            learnedPhrases: [],
            level: 1
        }
    },

    // Global player: XP levels you; coins/diamonds are wallets
    player: {
        level: 1,
        xp: 0,
        coins: STARTER_COINS,
        diamonds: STARTER_DIAMONDS,
        // Migration flags
        economyMigrated: false
    },

    bakedCakes: {},

    cafe: {
        decorations: [],
        layout: 'default',
        theme: 'classic'
    },

    settings: {
        audioEnabled: true,
        difficulty: 'normal',
        language: 'en'
    },

    lastLesson: {
        language: null,
        lessonId: null,
        phrases: []
    },

    init() {
        this.loadFromStorage();
        this.updateUI();
    },

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

    loadFromStorage() {
        try {
            const savedProgress = localStorage.getItem('gateaux_progress');
            if (savedProgress) {
                const parsedProgress = JSON.parse(savedProgress);
                Object.keys(this.progress).forEach(lang => {
                    if (parsedProgress[lang]) {
                        this.progress[lang] = { ...this.progress[lang], ...parsedProgress[lang] };
                    }
                });
            }

            const savedPlayer = localStorage.getItem('gateaux_player');
            if (savedPlayer) {
                this.player = { ...this.player, ...JSON.parse(savedPlayer) };
            }

            this.migrateEconomy();

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

    // Old saves: totalTipsEarned → xp, per-lang totalTips → coins seed
    migrateEconomy() {
        if (this.player.economyMigrated) {
            if (this.player.xp == null && this.player.totalTipsEarned != null) {
                this.player.xp = this.player.totalTipsEarned;
            }
            this.player.level = calculateLevel(this.player.xp || 0);
            return;
        }

        const legacyXp = this.player.totalTipsEarned
            ?? this.player.xp
            ?? this._legacyWalletFromProgress();
        const legacyCoins = this.player.coins
            ?? this._legacyWalletFromProgress()
            ?? 0;

        this.player.xp = Number(legacyXp) || 0;
        // Fresh install (no prior player save): starter wallets.
        // Returning save with no coins field: seed from old tips balance, floor at starter.
        const hadPlayerSave = localStorage.getItem('gateaux_player');
        if (!hadPlayerSave) {
            this.player.coins = STARTER_COINS;
            this.player.diamonds = STARTER_DIAMONDS;
        } else {
            this.player.coins = Math.max(STARTER_COINS, Number(legacyCoins) || 0);
            if (this.player.diamonds == null) this.player.diamonds = STARTER_DIAMONDS;
        }

        this.player.level = calculateLevel(this.player.xp);
        this.player.economyMigrated = true;
        delete this.player.totalTipsEarned;
        this.saveToStorage();
    },

    _legacyWalletFromProgress() {
        const languages = Object.keys(this.progress);
        if (languages.length === 0) return 0;
        return this.progress[languages[0]].totalTips || 0;
    },

    completeLesson(language, lessonId) {
        if (!this.progress[language]) {
            this.progress[language] = {
                completedLessons: [],
                learnedPhrases: [],
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

    isLessonCompleted(language, lessonId) {
        return this.progress[language]?.completedLessons?.includes(lessonId) || false;
    },

    learnPhrase(language, phraseId) {
        if (!this.progress[language]) {
            this.progress[language] = {
                completedLessons: [],
                learnedPhrases: [],
                level: 1
            };
        }

        if (!this.progress[language].learnedPhrases.includes(phraseId)) {
            this.progress[language].learnedPhrases.push(phraseId);
            this.awardEarnings(PHRASE_FIRST_LEARN_BONUS);
        }
    },

    // Earn coins (wallet) + XP (level). Spending never reduces XP.
    awardEarnings(amount) {
        if (!amount) return;
        this.player.coins = (this.player.coins || 0) + amount;
        this.addXp(amount);
        this.saveToStorage();
        this.updateUI();
    },

    addXp(amount) {
        if (!amount) return;
        this.player.xp = (this.player.xp || 0) + amount;
        const newLevel = calculateLevel(this.player.xp);
        if (newLevel > this.player.level) {
            const oldLevel = this.player.level;
            this.player.level = newLevel;
            window.dispatchEvent(new CustomEvent('gateaux:level-up', {
                detail: { oldLevel, newLevel, xp: this.player.xp }
            }));
        }
    },

    /** @deprecated Use awardEarnings — kept so call sites can migrate gradually */
    addTips(amount) {
        this.awardEarnings(amount);
    },

    getCoins() {
        return this.player.coins || 0;
    },

    getDiamonds() {
        return this.player.diamonds || 0;
    },

    getXp() {
        return this.player.xp || 0;
    },

    /** @deprecated Use getCoins */
    getTotalTips() {
        return this.getCoins();
    },

    canAffordCoins(amount) {
        return this.getCoins() >= amount;
    },

    canAffordDiamonds(amount) {
        return this.getDiamonds() >= amount;
    },

    spendCoins(amount) {
        if (amount <= 0) return true;
        if (!this.canAffordCoins(amount)) return false;
        this.player.coins -= amount;
        this.saveToStorage();
        this.updateUI();
        return true;
    },

    spendDiamonds(amount) {
        if (amount <= 0) return true;
        if (!this.canAffordDiamonds(amount)) return false;
        this.player.diamonds -= amount;
        this.saveToStorage();
        this.updateUI();
        return true;
    },

    addCoins(amount) {
        this.player.coins = (this.player.coins || 0) + amount;
        this.saveToStorage();
        this.updateUI();
    },

    addDiamonds(amount) {
        this.player.diamonds = (this.player.diamonds || 0) + amount;
        this.saveToStorage();
        this.updateUI();
    },

    getLevel() {
        return this.player.level;
    },

    getLevelProgress() {
        return getLevelProgress(this.player.xp || 0);
    },

    recordBakedCake(recipeId) {
        if (!this.bakedCakes[recipeId]) {
            this.bakedCakes[recipeId] = { count: 0, firstBaked: Date.now() };
        }
        this.bakedCakes[recipeId].count++;
        this.saveToStorage();
    },

    hasBeenBaked(recipeId) {
        return !!this.bakedCakes[recipeId];
    },

    getBakeCount(recipeId) {
        return this.bakedCakes[recipeId]?.count || 0;
    },

    _animateNumber(el, targetVal, durationMs = 300) {
        if (!el) return;
        const startVal = parseInt(el.textContent, 10) || 0;
        if (startVal === targetVal) return;
        const diff = targetVal - startVal;
        const startTime = performance.now();
        const step = (now) => {
            const t = Math.min((now - startTime) / durationMs, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(startVal + diff * eased);
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    },

    _pulsePill(el) {
        if (!el) return;
        el.classList.remove('pulse');
        void el.offsetWidth;
        el.classList.add('pulse');
        el.addEventListener('animationend', () => el.classList.remove('pulse'), { once: true });
    },

    updateUI() {
        const coinsEl = document.getElementById('total-coins')
            || document.getElementById('total-tips');
        if (coinsEl) {
            const target = this.getCoins();
            const current = parseInt(coinsEl.textContent, 10) || 0;
            if (current !== target) {
                this._animateNumber(coinsEl, target, 250);
                this._pulsePill(coinsEl.closest('.stat-pill'));
            } else {
                coinsEl.textContent = target;
            }
        }

        const diamondsEl = document.getElementById('total-diamonds');
        if (diamondsEl) {
            const target = this.getDiamonds();
            const current = parseInt(diamondsEl.textContent, 10) || 0;
            if (current !== target) {
                this._animateNumber(diamondsEl, target, 250);
                this._pulsePill(diamondsEl.closest('.stat-pill'));
            } else {
                diamondsEl.textContent = target;
            }
        }

        const levelEl = document.getElementById('player-level');
        if (levelEl) {
            const target = this.player.level;
            const current = parseInt(levelEl.textContent, 10) || 0;
            if (current !== target) this._animateNumber(levelEl, target, 200);
            else levelEl.textContent = target;
        }

        const levelProgress = this.getLevelProgress();
        const levelFill = document.getElementById('level-progress-fill');
        if (levelFill) {
            levelFill.style.width = `${levelProgress.progress * 100}%`;
        }

        const levelLabel = document.getElementById('level-label');
        if (levelLabel) {
            levelLabel.textContent = levelProgress.label;
        }

        this.updateLanguageCardProgress();
    },

    updateLanguageCardProgress() {
        Object.keys(this.progress).forEach(language => {
            const card = document.querySelector(`[data-language="${language}"]`);
            if (!card) return;

            const progress = this.progress[language];
            if (!progress || !progress.completedLessons) return;

            const totalLessons = 5;
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

    getStats() {
        const stats = {
            totalLanguages: Object.keys(this.progress).length,
            totalRecipesCompleted: 0,
            totalPhrasesLearned: 0,
            coins: this.getCoins(),
            diamonds: this.getDiamonds(),
            xp: this.getXp(),
            level: this.player.level,
            totalCakesBaked: Object.values(this.bakedCakes).reduce((sum, b) => sum + b.count, 0),
            uniqueRecipesBaked: Object.keys(this.bakedCakes).length
        };

        Object.values(this.progress).forEach(languageProgress => {
            stats.totalRecipesCompleted += languageProgress.completedLessons
                ? languageProgress.completedLessons.length : 0;
            stats.totalPhrasesLearned += languageProgress.learnedPhrases
                ? languageProgress.learnedPhrases.length : 0;
        });

        return stats;
    },

    resetProgress() {
        this.progress = {
            spanish: { completedLessons: [], learnedPhrases: [], level: 1 },
            french: { completedLessons: [], learnedPhrases: [], level: 1 }
        };
        this.player = {
            level: 1,
            xp: 0,
            coins: STARTER_COINS,
            diamonds: STARTER_DIAMONDS,
            economyMigrated: true
        };
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

    importProgress(data) {
        try {
            if (data.progress) this.progress = data.progress;
            if (data.player) this.player = data.player;
            if (data.bakedCakes) this.bakedCakes = data.bakedCakes;
            if (data.lastLesson) this.lastLesson = data.lastLesson;
            if (data.cafe) this.cafe = data.cafe;
            if (data.settings) this.settings = data.settings;

            this.migrateEconomy();
            this.saveToStorage();
            this.updateUI();
            return true;
        } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
        }
    }
};
