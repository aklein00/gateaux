// Recipe Book UI for Gateaux
// Overlay that displays all cake recipes, locked/unlocked states, and detail popups

import { getRecipesForLanguage, getRecipeById, getRarityLabel, RARITY_COLORS, getLevelData, getNextLevelData } from './recipeData.js';
import { gameState } from './gameState.js';
import { teachers } from './languageData.js';
import { getCounterPayout } from './economy.js';

let currentLanguageTab = 'french';
let onBakeCallback = null;

export function setOnBakeCallback(cb) {
    onBakeCallback = cb;
}

export function openRecipeBook() {
    const overlay = document.getElementById('recipe-book-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.classList.remove('overlay-enter');
    void overlay.offsetWidth;
    overlay.classList.add('overlay-enter');
    updateLevelBar();
    renderCakeGrid(currentLanguageTab);
    setupTabListeners();
}

export function closeRecipeBook() {
    const overlay = document.getElementById('recipe-book-overlay');
    if (overlay) overlay.style.display = 'none';
    closeCakeDetail();
}

function setupTabListeners() {
    document.querySelectorAll('.rb-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.rb-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentLanguageTab = tab.dataset.rbLang;
            renderCakeGrid(currentLanguageTab);
        };
    });
}

function updateLevelBar() {
    const levelInfo = gameState.getLevelProgress();
    const nextLevel = getNextLevelData(levelInfo.level);

    const labelEl = document.getElementById('recipe-book-level-label');
    const fillEl = document.getElementById('rb-level-fill');
    const tipsEl = document.getElementById('recipe-book-level-tips');

    if (labelEl) labelEl.textContent = `Lv ${levelInfo.level} - ${levelInfo.label}`;
    if (fillEl) fillEl.style.width = `${levelInfo.progress * 100}%`;
    if (tipsEl) {
        tipsEl.textContent = nextLevel
            ? `${levelInfo.xpToNext} XP to next`
            : 'MAX';
    }
}

function renderCakeGrid(language) {
    const grid = document.getElementById('recipe-book-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const recipes = getRecipesForLanguage(language);

    recipes.forEach(recipe => {
        const bakeCount = gameState.getBakeCount(recipe.id);
        const isUnlocked = bakeCount > 0;
        const teacherName = recipe.teacher === 'all'
            ? 'the whole kitchen'
            : (teachers[recipe.teacher]?.name || recipe.teacher);
        const card = document.createElement('div');
        card.className = `rb-cake-card${isUnlocked ? '' : ' locked'}`;
        card.title = isUnlocked
            ? recipe.name
            : `Keep practicing — finish ${teacherName}'s exercises to unlock this kitchen recipe.`;

        card.innerHTML = `
            <img class="rb-cake-img" src="assets/images/cakes/${recipe.imageFile}"
                 alt="${recipe.name}" data-image-name="${recipe.name}">
            <span class="rp-rarity-badge rarity-${recipe.rarity}">${getRarityLabel(recipe.rarity)}</span>
            <span class="rb-cake-name">${isUnlocked ? recipe.name : '???'}</span>
            ${isUnlocked
                ? `<span class="rb-baked-count">Baked ${bakeCount}x</span>`
                : `<span class="rb-lock-info">Keep practicing</span>`}
        `;

        card.addEventListener('click', () => {
            showCakeDetail(recipe.id);
        });

        grid.appendChild(card);
    });
}

export function showCakeDetail(recipeId) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return;

    const popup = document.getElementById('cake-detail-popup');
    if (!popup) return;

    const bakeCount = gameState.getBakeCount(recipe.id);
    const isUnlocked = bakeCount > 0;

    document.getElementById('cake-detail-img').src = `assets/images/cakes/${recipe.imageFile}`;
    document.getElementById('cake-detail-img').alt = recipe.name;
    document.getElementById('cake-detail-name').textContent = isUnlocked ? recipe.name : '???';

    const rarityEl = document.getElementById('cake-detail-rarity');
    rarityEl.textContent = getRarityLabel(recipe.rarity);
    rarityEl.className = `cake-detail-rarity rarity-${recipe.rarity}`;

    const teacherName = recipe.teacher === 'all'
        ? 'All Teachers'
        : (teachers[recipe.teacher]?.name || recipe.teacher);

    document.getElementById('cake-detail-desc').textContent = isUnlocked
        ? recipe.description
        : `Keep practicing with ${teacherName}. Bake this pastry in a lesson to unlock the real kitchen recipe.`;

    const kitchenEl = document.getElementById('cake-detail-kitchen');
    if (kitchenEl) {
        if (isUnlocked && recipe.kitchenRecipe) {
            kitchenEl.hidden = false;
            kitchenEl.innerHTML = `<h4>Kitchen recipe</h4><p>${recipe.kitchenRecipe}</p>`;
        } else {
            kitchenEl.hidden = true;
            kitchenEl.innerHTML = '';
        }
    }

    document.getElementById('cake-detail-decay').textContent = `${recipe.decayHours}h`;
    document.getElementById('cake-detail-tips').textContent =
        `${recipe.tipMultiplier}x (${getCounterPayout(recipe)} coins)`;
    document.getElementById('cake-detail-teacher').textContent = teacherName;

    document.getElementById('cake-detail-ai-effect').textContent = isUnlocked
        ? recipe.aiEffect
        : 'Unlock this pastry by doing the exercises — the kitchen recipe comes with it.';

    const bakedEl = document.getElementById('cake-detail-baked');
    if (bakeCount > 0) {
        bakedEl.textContent = `Baked ${bakeCount} time${bakeCount !== 1 ? 's' : ''}`;
    } else if (isUnlocked) {
        bakedEl.textContent = 'Not yet baked';
    } else {
        bakedEl.textContent = '';
    }

    const bakeBtn = document.getElementById('cake-detail-bake-btn');
    if (isUnlocked) {
        bakeBtn.textContent = 'Bake again';
        bakeBtn.className = 'btn-primary cake-detail-bake-btn';
        bakeBtn.onclick = () => {
            closeCakeDetail();
            closeRecipeBook();
            if (onBakeCallback) onBakeCallback(recipe);
        };
    } else {
        bakeBtn.textContent = 'Keep practicing';
        bakeBtn.className = 'btn-primary cake-detail-bake-btn locked';
        bakeBtn.onclick = null;
    }

    popup.style.display = 'flex';

    // Close on backdrop click
    popup.onclick = (e) => {
        if (e.target === popup) closeCakeDetail();
    };
}

export function closeCakeDetail() {
    const popup = document.getElementById('cake-detail-popup');
    if (popup) popup.style.display = 'none';
}

// Setup close buttons (called once from main.js)
export function setupRecipeBookListeners() {
    document.getElementById('close-recipe-book')?.addEventListener('click', closeRecipeBook);
    document.getElementById('close-cake-detail')?.addEventListener('click', closeCakeDetail);
}
