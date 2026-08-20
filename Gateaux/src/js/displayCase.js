// Display Case Management for Gateaux
// Cakes set (not sellable) then decay from readyAt. Overnight rush sells ready stock slowly.

import { getRecipeById, getSetMinutes } from './recipeData.js';

const DEFAULT_DECAY_HOURS = 6;
const FIRST_CAKE_SET_MS = 45 * 1000;
const AWAY_SALE_INTERVAL_MS = 4 * 60 * 60 * 1000;

export class DisplayCase {
    constructor() {
        this.inventory = {
            spanish: [],
            french: []
        };
        this.maxCakesPerShelf = 8;
        this.lastSeenAt = null;
        this.lastAwaySales = 0;

        this.loadFromStorage();
        this.migrateReadyAt();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onSessionResume();
            });
        } else {
            this.onSessionResume();
        }
    }

    onSessionResume() {
        this.checkDecay();
        this.lastAwaySales = this.checkAwaySales();
        this.touchLastSeen();
        this.updateDisplay();
    }

    getDecayMs(cake) {
        const recipe = getRecipeById(cake.recipeId);
        const hours = recipe?.decayHours || DEFAULT_DECAY_HOURS;
        return hours * 60 * 60 * 1000;
    }

    getSetMs(cake, { firstEver = false } = {}) {
        if (firstEver) return FIRST_CAKE_SET_MS;
        const recipe = getRecipeById(cake.recipeId);
        return getSetMinutes(recipe) * 60 * 1000;
    }

    isReady(cake, now = Date.now()) {
        if (cake.readyAt == null) return true;
        return now >= cake.readyAt;
    }

    isSetting(cake, now = Date.now()) {
        return !this.isReady(cake, now);
    }

    getReadyCakes(language, now = Date.now()) {
        return (this.inventory[language] || []).filter(cake => this.isReady(cake, now));
    }

    getAllReadyCakes(now = Date.now()) {
        return Object.keys(this.inventory).flatMap(language =>
            this.getReadyCakes(language, now).map(cake => ({ language, cake }))
        );
    }

    hasReadyCakes(now = Date.now()) {
        return this.getAllReadyCakes(now).length > 0;
    }

    hasSettingCakes(now = Date.now()) {
        return Object.values(this.inventory).some(cakes =>
            cakes.some(cake => this.isSetting(cake, now))
        );
    }

    getTotalCount() {
        return Object.values(this.inventory).reduce((sum, cakes) => sum + cakes.length, 0);
    }

    addCake(language, lessonId, recipeId, { firstEver = false } = {}) {
        if (!this.inventory[language]) {
            this.inventory[language] = [];
        }

        this.checkDecay();

        const now = Date.now();
        const cake = {
            id: `cake_${now}_${Math.random().toString(36).substr(2, 9)}`,
            language: language,
            lessonId: lessonId,
            recipeId: recipeId || null,
            createdAt: now,
            readyAt: now,
            freshness: 'fresh'
        };
        cake.readyAt = now + this.getSetMs(cake, { firstEver });

        if (this.inventory[language].length < this.maxCakesPerShelf) {
            this.inventory[language].push(cake);
            this.saveToStorage();
            this.updateDisplay();
            return true;
        }

        return false;
    }

    removeCake(language, cakeId) {
        if (!this.inventory[language]) return false;

        const index = this.inventory[language].findIndex(c => c.id === cakeId);
        if (index !== -1) {
            this.inventory[language].splice(index, 1);
            this.saveToStorage();
            this.updateDisplay();
            return true;
        }

        return false;
    }

    // Decay starts when the cake is ready, not while it is still setting.
    checkDecay() {
        const now = Date.now();
        let changed = false;

        Object.keys(this.inventory).forEach(language => {
            const before = this.inventory[language].length;
            this.inventory[language] = this.inventory[language].filter(cake => {
                if (this.isSetting(cake, now)) return true;
                const totalDecayMs = this.getDecayMs(cake);
                const readyAt = cake.readyAt ?? cake.createdAt;
                return (now - readyAt) < totalDecayMs;
            });
            if (this.inventory[language].length !== before) changed = true;

            this.inventory[language].forEach(cake => {
                const oldFreshness = cake.freshness;
                if (this.isSetting(cake, now)) {
                    cake.freshness = 'fresh';
                } else {
                    const readyAt = cake.readyAt ?? cake.createdAt;
                    const age = now - readyAt;
                    const totalDecayMs = this.getDecayMs(cake);
                    const freshLimit = totalDecayMs * 0.50;
                    const dayOldLimit = totalDecayMs * 0.75;

                    if (age < freshLimit) {
                        cake.freshness = 'fresh';
                    } else if (age < dayOldLimit) {
                        cake.freshness = 'day_old';
                    } else {
                        cake.freshness = 'stale';
                    }
                }

                if (cake.freshness !== oldFreshness) changed = true;
            });
        });

        if (changed) {
            this.saveToStorage();
        }
    }

    // 1 ready cake per 4 hours away, at most half the ready stock.
    checkAwaySales() {
        const now = Date.now();
        if (!this.lastSeenAt) return 0;

        const elapsed = now - this.lastSeenAt;
        const maxByTime = Math.floor(elapsed / AWAY_SALE_INTERVAL_MS);
        if (maxByTime < 1) return 0;

        const ready = this.getAllReadyCakes(now);
        const cap = Math.floor(ready.length / 2);
        const toSell = Math.min(maxByTime, cap);
        if (toSell < 1) return 0;

        let sold = 0;
        for (let i = 0; i < toSell; i++) {
            const entry = ready[i];
            if (!entry) break;
            this.removeCake(entry.language, entry.cake.id);
            sold++;
        }

        return sold;
    }

    touchLastSeen() {
        this.lastSeenAt = Date.now();
        this.saveToStorage();
    }

    getSetTimeRemaining(cake, now = Date.now()) {
        if (this.isReady(cake, now)) return 0;
        return Math.max(0, cake.readyAt - now);
    }

    formatSetRemaining(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) {
            const sec = String(seconds).padStart(2, '0');
            return `${minutes}:${sec}`;
        }
        return `${seconds}s`;
    }

    getInventoryStatus() {
        const status = {};
        const now = Date.now();

        Object.keys(this.inventory).forEach(language => {
            const cakes = this.inventory[language];
            const readyCount = cakes.filter(c => this.isReady(c, now)).length;
            status[language] = {
                count: cakes.length,
                readyCount,
                settingCount: cakes.length - readyCount,
                maxCount: this.maxCakesPerShelf,
                percentage: (cakes.length / this.maxCakesPerShelf) * 100,
                freshCount: cakes.filter(c => c.freshness === 'fresh').length,
                dayOldCount: cakes.filter(c => c.freshness === 'day_old').length,
                staleCount: cakes.filter(c => c.freshness === 'stale').length,
                isLow: cakes.length < 3,
                isEmpty: cakes.length === 0,
                hasReady: readyCount > 0
            };
        });

        return status;
    }

    updateDisplay() {
        const displayElement = document.getElementById('display-case');
        if (!displayElement) return;

        displayElement.innerHTML = '';

        Object.entries(this.inventory).forEach(([language, cakes]) => {
            const shelf = this.createShelfElement(language, cakes);
            displayElement.appendChild(shelf);
        });
    }

    createShelfElement(language, cakes) {
        const shelf = document.createElement('div');
        shelf.className = 'display-shelf';
        shelf.dataset.language = language;

        const header = document.createElement('div');
        header.className = 'shelf-header';

        const label = document.createElement('div');
        label.className = 'shelf-label';
        const langData = { spanish: 'Spanish', french: 'French' };
        label.textContent = langData[language] || language;
        header.appendChild(label);

        if (cakes.length < 3 && cakes.length > 0) {
            const warning = document.createElement('span');
            warning.className = 'low-stock-warning';
            warning.textContent = 'Low stock';
            header.appendChild(warning);
        } else if (cakes.length === 0) {
            const warning = document.createElement('span');
            warning.className = 'empty-stock-warning';
            warning.textContent = 'Empty';
            header.appendChild(warning);
        }

        shelf.appendChild(header);

        const cakeContainer = document.createElement('div');
        cakeContainer.className = 'cake-container';

        for (let i = 0; i < this.maxCakesPerShelf; i++) {
            const slot = document.createElement('div');
            slot.className = 'cake-slot';

            if (i < cakes.length) {
                const cake = cakes[i];
                slot.classList.add('filled', cake.freshness);
                if (this.isSetting(cake)) slot.classList.add('setting');
                slot.dataset.cakeId = cake.id;
                slot.dataset.language = language;
                slot.setAttribute('role', 'button');
                slot.tabIndex = 0;
                slot.setAttribute('aria-label', 'Cake details');
                slot.innerHTML = this.getCakeVisual(language, cake);
            } else {
                slot.classList.add('empty');
            }

            cakeContainer.appendChild(slot);
        }

        shelf.appendChild(cakeContainer);
        return shelf;
    }

    getCakeVisual(language, cake) {
        const recipe = getRecipeById(cake.recipeId);

        const filename = recipe?.imageFile || (language === 'french' ? 'eclair_fresh.png' : 'tres_leches_fresh.png');
        const name = recipe?.name || (language === 'french' ? 'Eclair' : 'Tres Leches');
        const rarity = recipe?.rarity || 'common';

        const setting = this.isSetting(cake);
        const freshnessClass = setting ? 'setting' :
                              cake.freshness === 'fresh' ? 'fresh' :
                              cake.freshness === 'day_old' ? 'day-old' : 'stale';

        const timerHtml = setting
            ? `<span class="cake-timer">${this.formatSetRemaining(this.getSetTimeRemaining(cake))}</span>`
            : '';

        return `
            <div class="cake-visual ${freshnessClass} rarity-${rarity}">
                <img class="cake-image-placeholder"
                     data-image-name="${name}"
                     src="assets/images/cakes/${filename}"
                     alt="${name}">
                ${timerHtml}
            </div>
        `;
    }

    findCake(language, cakeId) {
        return (this.inventory[language] || []).find(c => c.id === cakeId) || null;
    }

    speedUpCake(language, cakeId) {
        const cake = this.findCake(language, cakeId);
        if (!cake || this.isReady(cake)) return false;
        cake.readyAt = Date.now();
        this.saveToStorage();
        this.updateDisplay();
        return true;
    }

    migrateReadyAt() {
        let changed = false;
        Object.values(this.inventory).forEach(cakes => {
            cakes.forEach(cake => {
                if (cake.readyAt == null) {
                    cake.readyAt = cake.createdAt;
                    changed = true;
                }
            });
        });
        if (changed) this.saveToStorage();
    }

    saveToStorage() {
        try {
            localStorage.setItem('gateaux_display_case', JSON.stringify({
                inventory: this.inventory,
                lastSeenAt: this.lastSeenAt
            }));
        } catch (error) {
            console.error('Failed to save display case:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('gateaux_display_case');
            if (saved) {
                const data = JSON.parse(saved);
                this.inventory = data.inventory || this.inventory;
                this.lastSeenAt = data.lastSeenAt || null;
            }
        } catch (error) {
            console.error('Failed to load display case:', error);
        }
    }

    reset() {
        this.inventory = { spanish: [], french: [] };
        this.lastSeenAt = Date.now();
        this.lastAwaySales = 0;
        this.saveToStorage();
        this.updateDisplay();
    }
}

export const displayCase = new DisplayCase();
