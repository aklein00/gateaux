// Display Case Management for Gateaux
// Per-cake decay timers: each cake ages individually based on its recipe's decay rate

import { getRecipeById } from './recipeData.js';

const DEFAULT_DECAY_HOURS = 6;

export class DisplayCase {
    constructor() {
        this.inventory = {
            spanish: [],
            french: []
        };
        this.maxCakesPerShelf = 8;

        this.loadFromStorage();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.checkDecay();
                this.updateDisplay();
            });
        } else {
            this.checkDecay();
            this.updateDisplay();
        }
    }

    // Get total decay time for a cake based on its recipe
    getDecayMs(cake) {
        const recipe = getRecipeById(cake.recipeId);
        const hours = recipe?.decayHours || DEFAULT_DECAY_HOURS;
        return hours * 60 * 60 * 1000;
    }

    // Add a cake to the display
    addCake(language, lessonId, recipeId) {
        if (!this.inventory[language]) {
            this.inventory[language] = [];
        }

        // Auto-remove expired cakes first to make room
        this.checkDecay();

        const cake = {
            id: `cake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            language: language,
            lessonId: lessonId,
            recipeId: recipeId || null,
            createdAt: Date.now(),
            freshness: 'fresh'
        };

        if (this.inventory[language].length < this.maxCakesPerShelf) {
            this.inventory[language].push(cake);
            this.saveToStorage();
            this.updateDisplay();
            return true;
        }

        return false;
    }

    // Remove a cake (when sold)
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

    // Per-cake decay: update freshness and remove expired cakes
    checkDecay() {
        const now = Date.now();
        let changed = false;

        Object.keys(this.inventory).forEach(language => {
            // Remove cakes past their total decay time
            const before = this.inventory[language].length;
            this.inventory[language] = this.inventory[language].filter(cake => {
                const totalDecayMs = this.getDecayMs(cake);
                return (now - cake.createdAt) < totalDecayMs;
            });
            if (this.inventory[language].length !== before) changed = true;

            // Update freshness for remaining cakes
            this.inventory[language].forEach(cake => {
                const age = now - cake.createdAt;
                const totalDecayMs = this.getDecayMs(cake);
                const freshLimit = totalDecayMs * 0.50;
                const dayOldLimit = totalDecayMs * 0.75;
                const oldFreshness = cake.freshness;

                if (age < freshLimit) {
                    cake.freshness = 'fresh';
                } else if (age < dayOldLimit) {
                    cake.freshness = 'day_old';
                } else {
                    cake.freshness = 'stale';
                }

                if (cake.freshness !== oldFreshness) changed = true;
            });
        });

        if (changed) {
            this.saveToStorage();
        }
    }

    // Get time remaining for a specific cake (in ms)
    getCakeTimeRemaining(cake) {
        const totalDecayMs = this.getDecayMs(cake);
        const age = Date.now() - cake.createdAt;
        return Math.max(0, totalDecayMs - age);
    }

    // Format time remaining as short string
    formatTimeRemaining(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    // Get current inventory status
    getInventoryStatus() {
        const status = {};

        Object.keys(this.inventory).forEach(language => {
            const cakes = this.inventory[language];
            status[language] = {
                count: cakes.length,
                maxCount: this.maxCakesPerShelf,
                percentage: (cakes.length / this.maxCakesPerShelf) * 100,
                freshCount: cakes.filter(c => c.freshness === 'fresh').length,
                dayOldCount: cakes.filter(c => c.freshness === 'day_old').length,
                staleCount: cakes.filter(c => c.freshness === 'stale').length,
                isLow: cakes.length < 3,
                isEmpty: cakes.length === 0
            };
        });

        return status;
    }

    // Update the visual display
    updateDisplay() {
        const displayElement = document.getElementById('display-case');
        if (!displayElement) return;

        displayElement.innerHTML = '';

        Object.entries(this.inventory).forEach(([language, cakes]) => {
            const shelf = this.createShelfElement(language, cakes);
            displayElement.appendChild(shelf);
        });
    }

    // Create a shelf element
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
                slot.innerHTML = this.getCakeVisual(language, cake);
            } else {
                slot.classList.add('empty');
            }

            cakeContainer.appendChild(slot);
        }

        shelf.appendChild(cakeContainer);
        return shelf;
    }

    // Get cake visual with per-cake timer
    getCakeVisual(language, cake) {
        const recipe = getRecipeById(cake.recipeId);

        // Use recipe data if available, fallback to hardcoded defaults
        const filename = recipe?.imageFile || (language === 'french' ? 'eclair_fresh.png' : 'tres_leches_fresh.png');
        const name = recipe?.name || (language === 'french' ? 'Eclair' : 'Tres Leches');
        const rarity = recipe?.rarity || 'common';

        const freshnessClass = cake.freshness === 'fresh' ? 'fresh' :
                              cake.freshness === 'day_old' ? 'day-old' : 'stale';

        const timeLeft = this.getCakeTimeRemaining(cake);
        const timeStr = this.formatTimeRemaining(timeLeft);

        return `
            <div class="cake-visual ${freshnessClass} rarity-${rarity}">
                <img class="cake-image-placeholder"
                     data-image-name="${name}"
                     src="assets/images/cakes/${filename}"
                     alt="${name}">
                <span class="cake-timer">${timeStr}</span>
            </div>
        `;
    }

    // Stock status lives once, in the shelf header (see createShelfElement's
    // "Low stock" / "Empty" badge). The bake cards intentionally stay silent
    // on inventory count — they only say what they bake — so this fact never
    // appears twice on screen.

    saveToStorage() {
        try {
            localStorage.setItem('gateaux_display_case', JSON.stringify({
                inventory: this.inventory
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
            }
        } catch (error) {
            console.error('Failed to load display case:', error);
        }
    }

    reset() {
        this.inventory = { spanish: [], french: [] };
        this.saveToStorage();
        this.updateDisplay();
    }
}

export const displayCase = new DisplayCase();
