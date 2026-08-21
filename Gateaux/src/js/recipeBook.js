// Recipe Book UI for Gateaux
// One-page gallery + simple cookbook pages

import { getBookCatalog, getBookRecipe } from './recipeData.js';
import { gameState } from './gameState.js';
import { teachers } from './languageData.js';

let onBakeCallback = null;

export function setOnBakeCallback(cb) {
    onBakeCallback = cb;
}

function isUnlocked(recipe) {
    if (recipe?.alwaysUnlocked) return true;
    return gameState.getBakeCount(recipe.id) > 0;
}

function teacherLabel(recipe) {
    if (recipe.teacher === 'all') return 'The whole kitchen';
    return teachers[recipe.teacher]?.name || recipe.teacher;
}

export function openRecipeBook() {
    const overlay = document.getElementById('recipe-book-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.classList.remove('overlay-enter');
    void overlay.offsetWidth;
    overlay.classList.add('overlay-enter');
    renderGallery();
}

export function closeRecipeBook() {
    const overlay = document.getElementById('recipe-book-overlay');
    if (overlay) overlay.style.display = 'none';
    closeCakeDetail();
}

function renderGallery() {
    const grid = document.getElementById('recipe-book-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const catalog = getBookCatalog();
    const unlocked = catalog.filter(isUnlocked);
    const locked = catalog.filter(r => !isUnlocked(r));
    const rows = [...unlocked, ...locked];

    rows.forEach((recipe, i) => {
        const open = isUnlocked(recipe);
        const card = document.createElement('article');
        card.className = `rb-mag-row${open ? '' : ' locked'}${i % 2 ? ' flip' : ''}`;
        card.innerHTML = `
            <img class="rb-mag-img" src="assets/images/recipes/${recipe.bookImage}"
                 alt="${recipe.name}" data-image-name="${recipe.name}">
            <div class="rb-mag-copy">
                <p class="rb-mag-kicker">${teacherLabel(recipe)}</p>
                <h4 class="rb-mag-title">${recipe.name}</h4>
                <p class="rb-mag-blurb">${recipe.bookBlurb}</p>
                ${open ? '' : '<p class="rb-lock-info">Keep practicing</p>'}
            </div>
        `;
        card.addEventListener('click', () => showCakeDetail(recipe.id));
        grid.appendChild(card);
    });
}

export function showCakeDetail(recipeId) {
    const recipe = getBookRecipe(recipeId);
    if (!recipe) return;

    const popup = document.getElementById('cake-detail-popup');
    if (!popup) return;

    const open = isUnlocked(recipe);
    popup.classList.toggle('locked', !open);

    document.getElementById('cake-detail-teacher').textContent = teacherLabel(recipe);
    document.getElementById('cake-detail-name').textContent = recipe.name;

    const meta = document.getElementById('cake-detail-meta');
    meta.innerHTML = `
        <span>${recipe.prepMinutes || 10} min prep</span>
        <span>${recipe.cookMinutes || 10} min cook</span>
        <span>${recipe.servings || 4} servings</span>
    `;

    const img = document.getElementById('cake-detail-img');
    img.src = `assets/images/recipes/${recipe.topdownImage}`;
    img.alt = recipe.name;
    img.classList.toggle('is-locked', !open);

    const body = document.getElementById('cake-detail-body');
    if (open) {
        const ings = (recipe.ingredients || []).map(x => `<li>${x}</li>`).join('');
        const steps = (recipe.steps || []).map((x, i) => `<li><span>${i + 1}</span>${x}</li>`).join('');
        body.innerHTML = `
            <h4>Ingredients</h4>
            <ul class="cookbook-ings">${ings}</ul>
            <h4>Preparation</h4>
            <ol class="cookbook-steps">${steps}</ol>
        `;
    } else {
        body.innerHTML = `<p class="cookbook-locked-note">Keep practicing with ${teacherLabel(recipe)}. Finish those exercises to unlock this kitchen recipe.</p>`;
    }

    const bakeBtn = document.getElementById('cake-detail-bake-btn');
    if (recipe.alwaysUnlocked) {
        bakeBtn.textContent = 'Go bake with the staff';
        bakeBtn.className = 'btn-primary cake-detail-bake-btn';
        bakeBtn.onclick = () => {
            closeCakeDetail();
            closeRecipeBook();
        };
    } else if (open) {
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
    popup.onclick = (e) => {
        if (e.target === popup) closeCakeDetail();
    };
}

export function closeCakeDetail() {
    const popup = document.getElementById('cake-detail-popup');
    if (popup) popup.style.display = 'none';
}

export function setupRecipeBookListeners() {
    document.getElementById('close-recipe-book')?.addEventListener('click', closeRecipeBook);
    document.getElementById('close-cake-detail')?.addEventListener('click', closeCakeDetail);
}
