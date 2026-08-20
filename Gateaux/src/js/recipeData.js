// Recipe Data for Gateaux
// Single source of truth for all cake recipes and level thresholds

export const LEVEL_THRESHOLDS = [
    { level: 1, tipsRequired: 0, label: 'Apprentice Baker' },
    { level: 2, tipsRequired: 75, label: 'Pastry Student' },
    { level: 3, tipsRequired: 200, label: 'Line Cook' },
    { level: 4, tipsRequired: 400, label: 'Sous Chef' },
    { level: 5, tipsRequired: 700, label: 'Head Patissier' },
    { level: 6, tipsRequired: 1100, label: 'Master Baker' },
];

export const RECIPES = [
    // ── French Cakes ──
    {
        id: 'eclair_classique',
        name: 'Eclair Classique',
        language: 'french',
        teacher: 'amelie',
        rarity: 'common',
        difficulty: 1,
        decayHours: 4,
        setMinutes: 2,
        tipMultiplier: 1.0,
        unlockLevel: 2,
        imageFile: 'eclair_fresh.png',
        description: "The foundation of any self-respecting patisserie. Amelie insists each one is piped to perfection -- even if it's just going to be eaten by a tourist who pronounces 'eclair' like 'ee-CLAIR.'",
        aiEffect: 'Phrases are formal, properly conjugated, and dripping with Parisian politeness. Amelie would rather close the cafe than let you use "tu" with a stranger.',
    },
    {
        id: 'crepe_de_rue',
        name: 'Crepe de Rue',
        language: 'french',
        teacher: 'marcel',
        rarity: 'common',
        difficulty: 1,
        decayHours: 3,
        setMinutes: 2,
        tipMultiplier: 1.0,
        unlockLevel: 1,
        imageFile: 'crepe_de_rue_fresh.png',
        description: "Folded with the casual confidence of someone who learned to cook on a Montmartre street corner. Marcel says the secret ingredient is 'not caring what Amelie thinks.'",
        aiEffect: 'Slang-heavy, casual, and full of shortcuts. Marcel drops half the syllables and adds twice the personality.',
    },
    {
        id: 'moka_express',
        name: 'Moka Express',
        language: 'french',
        teacher: 'cafe',
        rarity: 'uncommon',
        difficulty: 2,
        decayHours: 5,
        setMinutes: 20,
        tipMultiplier: 1.5,
        unlockLevel: 3,
        imageFile: 'moka_express_fresh.png',
        description: "A cake that tastes like it was made during a rush, because it was. Cafe swears the slightly burnt edges are 'intentional caramelization.'",
        aiEffect: 'Fast-paced cafe service language. Short sentences, urgent tone, and the kind of multitasking vocabulary you need when three customers are yelling at once.',
    },
    {
        id: 'mille_feuille_amour',
        name: "Mille-feuille d'Amour",
        language: 'french',
        teacher: 'bisou',
        rarity: 'rare',
        difficulty: 3,
        decayHours: 7,
        setMinutes: 240,
        tipMultiplier: 2.0,
        unlockLevel: 4,
        imageFile: 'mille_feuille_amour_fresh.png',
        description: "A thousand layers of pastry, each whispering sweet nothings. Bisou claims she invented it after a particularly moving sunset. Nobody has the heart to correct her.",
        aiEffect: 'Romantic vocabulary, compliments, and social charm. Every sentence sounds like it belongs in a love letter -- even when ordering napkins.',
    },
    {
        id: 'croquembouche_critique',
        name: 'Croquembouche Critique',
        language: 'french',
        teacher: 'gaston',
        rarity: 'rare',
        difficulty: 3,
        decayHours: 7,
        setMinutes: 240,
        tipMultiplier: 2.0,
        unlockLevel: 5,
        imageFile: 'croquembouche_critique_fresh.png',
        description: "A towering monument to everything Gaston finds wrong with the world. Each cream puff represents a different complaint. The caramel represents his grudging respect for craftsmanship.",
        aiEffect: 'Sarcastic, opinionated, and brutally honest. Gaston teaches you to complain with style and defend your terrible coffee choices with panache.',
    },
    {
        id: 'gateau_parfait',
        name: 'Le Gateau Parfait',
        language: 'french',
        teacher: 'all',
        rarity: 'legendary',
        difficulty: 3,
        decayHours: 10,
        setMinutes: 240,
        tipMultiplier: 3.0,
        unlockLevel: 6,
        imageFile: 'gateau_parfait_fresh.png',
        description: "The mythical perfect cake. Every teacher claims credit. Amelie says technique, Marcel says vibes, Cafe says speed, Bisou says love, and Gaston says it's 'acceptable.' They're all wrong. It's about the player who made it.",
        aiEffect: 'All five teachers in one lesson -- the formality of Amélie, the slang of Marcel, the chaos of Café, the charm of Bisou, and the critique of Gaston. This is where the training wheels come off.',
    },

    // ── Spanish Cakes ──
    {
        id: 'tres_leches_clasico',
        name: 'Tres Leches Clasico',
        language: 'spanish',
        teacher: 'amelie',
        rarity: 'common',
        difficulty: 1,
        decayHours: 4,
        setMinutes: 2,
        tipMultiplier: 1.0,
        unlockLevel: 2,
        imageFile: 'tres_leches_fresh.png',
        description: "Three milks, one purpose: teaching you to say 'por favor' without sounding like a guidebook. Amelie soaks each layer with the precision of a diplomat.",
        aiEffect: 'Formal Spanish with proper usted conjugations. Amelie is the same in every language: polite to a fault.',
    },
    {
        id: 'churros_callejeros',
        name: 'Churros Callejeros',
        language: 'spanish',
        teacher: 'marcel',
        rarity: 'common',
        difficulty: 1,
        decayHours: 3,
        setMinutes: 2,
        tipMultiplier: 1.0,
        unlockLevel: 1,
        imageFile: 'churros_callejeros_fresh.png',
        description: "Dusted with sugar and attitude. Marcel fries these the way he teaches -- fast, loud, and with zero regard for your feelings about irregular verbs.",
        aiEffect: 'Street Spanish, local slang, and the kind of shortcuts that make textbook teachers weep.',
    },
    {
        id: 'cafe_con_leche_rapido',
        name: 'Cafe con Leche Rapido',
        language: 'spanish',
        teacher: 'cafe',
        rarity: 'uncommon',
        difficulty: 2,
        decayHours: 5,
        setMinutes: 20,
        tipMultiplier: 1.5,
        unlockLevel: 3,
        imageFile: 'cafe_con_leche_rapido_fresh.png',
        description: "Half cake, half coffee, fully chaotic. Cafe invented this during a morning rush when she accidentally dropped a muffin in a latte and a customer said it was 'the best thing on the menu.'",
        aiEffect: 'Service-industry Spanish at full speed. Orders, complaints, and the sacred art of saying "one moment please" while everything is on fire.',
    },
    {
        id: 'flan_de_amor',
        name: 'Flan de Amor',
        language: 'spanish',
        teacher: 'bisou',
        rarity: 'rare',
        difficulty: 3,
        decayHours: 7,
        setMinutes: 240,
        tipMultiplier: 2.0,
        unlockLevel: 4,
        imageFile: 'flan_de_amor_fresh.png',
        description: "Impossibly smooth, dangerously sweet, and guaranteed to make someone fall in love with you. Or at least with the flan. Bisou makes no promises.",
        aiEffect: 'Spanish romance vocabulary. Compliments, terms of endearment, and phrases that sound corny right up until they work.',
    },
    {
        id: 'tarta_del_critico',
        name: 'Tarta del Critico',
        language: 'spanish',
        teacher: 'gaston',
        rarity: 'rare',
        difficulty: 3,
        decayHours: 7,
        setMinutes: 240,
        tipMultiplier: 2.0,
        unlockLevel: 5,
        imageFile: 'tarta_del_critico_fresh.png',
        description: "A tart so bitter it could write restaurant reviews. Gaston considers it his masterpiece because 'finally, a dessert that tells the truth.'",
        aiEffect: 'Spanish complaints, opinions, and witty comebacks. Learn to send food back with devastating politeness.',
    },
    {
        id: 'pastel_maestro',
        name: 'Pastel Maestro',
        language: 'spanish',
        teacher: 'all',
        rarity: 'legendary',
        difficulty: 3,
        decayHours: 10,
        setMinutes: 240,
        tipMultiplier: 3.0,
        unlockLevel: 6,
        imageFile: 'pastel_maestro_fresh.png',
        description: "The cake that ends arguments. Every teacher agrees it exists. None agree on the recipe. The only thing they know for certain is that you have to earn it.",
        aiEffect: 'All five teaching styles in one lesson. Formal, casual, urgent, romantic, and brutally honest -- sometimes in the same sentence. This is not a cake -- it is a graduation ceremony.',
    },
];

// ── Utility Functions ──

export function getRecipeById(id) {
    if (!id) return null;
    return RECIPES.find(r => r.id === id) || null;
}

export function getRecipesForLanguage(language) {
    return RECIPES.filter(r => r.language === language);
}

export function getUnlockedRecipes(level, language) {
    return RECIPES.filter(r => r.unlockLevel <= level && (!language || r.language === language));
}

export function getRecipeForTeacher(teacher, language) {
    return RECIPES.find(r => r.teacher === teacher && r.language === language) || null;
}

export function getRecipesForLevel(level) {
    return RECIPES.filter(r => r.unlockLevel === level);
}

export function calculateLevel(totalTipsEarned) {
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalTipsEarned >= LEVEL_THRESHOLDS[i].tipsRequired) {
            level = LEVEL_THRESHOLDS[i].level;
            break;
        }
    }
    return level;
}

export function getLevelData(level) {
    return LEVEL_THRESHOLDS.find(l => l.level === level) || LEVEL_THRESHOLDS[0];
}

export function getNextLevelData(level) {
    return LEVEL_THRESHOLDS.find(l => l.level === level + 1) || null;
}

export function getLevelProgress(totalTipsEarned) {
    const current = getLevelData(calculateLevel(totalTipsEarned));
    const next = getNextLevelData(current.level);
    if (!next) return { level: current.level, label: current.label, progress: 1, tipsToNext: 0 };

    const tipsInLevel = totalTipsEarned - current.tipsRequired;
    const tipsNeeded = next.tipsRequired - current.tipsRequired;
    return {
        level: current.level,
        label: current.label,
        progress: Math.min(1, tipsInLevel / tipsNeeded),
        tipsToNext: Math.max(0, next.tipsRequired - totalTipsEarned),
    };
}

// Rarity display helpers
const SET_MINUTES_BY_RARITY = {
    common: 2,
    uncommon: 20,
    rare: 240,
    legendary: 240
};

export function getSetMinutes(recipe) {
    if (recipe?.setMinutes != null) return recipe.setMinutes;
    return SET_MINUTES_BY_RARITY[recipe?.rarity] || SET_MINUTES_BY_RARITY.common;
}

export const RARITY_COLORS = {
    common: '#4CAF50',
    uncommon: '#DAA520',
    rare: '#9C27B0',
    legendary: '#FF8C00',
};

export function getRarityLabel(rarity) {
    const labels = { common: 'Common', uncommon: 'Uncommon', rare: 'Rare', legendary: 'Legendary' };
    return labels[rarity] || rarity;
}
