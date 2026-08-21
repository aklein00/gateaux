// Recipe Data for Gateaux
// Single source of truth for all cake recipes and level thresholds

// Level is driven by XP (lifetime earnings), never by wallet balance.
export const LEVEL_THRESHOLDS = [
    { level: 1, xpRequired: 0, label: 'Apprentice Baker' },
    { level: 2, xpRequired: 75, label: 'Pastry Student' },
    { level: 3, xpRequired: 200, label: 'Line Cook' },
    { level: 4, xpRequired: 400, label: 'Sous Chef' },
    { level: 5, xpRequired: 700, label: 'Head Patissier' },
    { level: 6, xpRequired: 1100, label: 'Master Baker' },
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
        kitchenRecipe: "Amélie: Bonjour, bienvenue. Pour l'éclair classique — pâte à choux, four chaud. Voulez-vous un café ou un thé pendant que ça dore? Quand c'est prêt: Ce sera tout? On garnit de crème, glaçage chocolat. Merci et bonne journée — et s'il vous plaît, pas de tu avec un inconnu.",
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
        kitchenRecipe: "Marcel: Salut, ça va? Crêpe de rue — une poêle chaude, comme d'hab. Qu'est-ce que je te sers, Nutella ou sucre? Un petit noir à côté si t'es en forme. À plus — et t'inquiète, ça se plie tout seul.",
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
        kitchenRecipe: "Café: Deux secondes! Moka Express — café serré dans le gâteau, on accélère. Derrière toi! Un à la fois. Service! Si c'est brûlé sur le bord: nickel, c'est la caramelisation. On respire après.",
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
        kitchenRecipe: "Bisou: Chaque couche est une déclaration d'amour. Mille-feuille — pâte, crème, encore une couche. C'est un délice, vraiment. Restez un peu plus longtemps. Encore une part, je vous en supplie. Le caramel chante.",
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
        kitchenRecipe: "Gaston: Charmant. Vraiment. Croquembouche — choux, caramel, de l'audace. Bravo pour l'effort si ça penche. Ce n'est pas à la hauteur? Recommencez. Je note. Intérieurement. Le four a fait de son mieux.",
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
        kitchenRecipe: "Tout le monde: Bonjour. Salut. Deux secondes. C'est un délice. Charmant. Le gâteau parfait — génoise, crème, patience. Ce sera tout? Comme d'hab? Service! Encore une part. Je vais m'en souvenir.",
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
        kitchenRecipe: "Amélie: Encantado de recibirle. Tres leches — bizcocho, tres leches, paciencia. ¿Me permite un momento? Cuando esté listo: ¿será todo? Gracias por su visita. Que tenga un lindo día — y por favor, use usted.",
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
        kitchenRecipe: "Marcel: ¿Qué onda? Churros callejeros — masa, aceite caliente, como de hab. ¿Qué te sirvo, chocolate o nada? Un cortado al lado si andas puro vida. Nos vemos luego. No te preocupes, se fríen solos.",
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
        kitchenRecipe: "Café: ¡Dos segundos! Café con leche rápido — muffin en el latte, aceleramos. ¡Atrás de ti! ¡Uno a la vez! ¡Servicio! Si se quema el borde: todo tranqui, es caramelo. Respiramos después.",
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
        kitchenRecipe: "Bisou: Cada capa es una carta de amor. Flan de amor — huevos, leche, caramelo que canta. Es un deleite, de verdad. Quédese un rato más. Otra porción, se lo ruego. Me derrito por esta tarta.",
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
        kitchenRecipe: "Gaston: Encantador. De verdad. Tarta del crítico — masa, cítricos, audacia. Bravo por el esfuerzo si queda chueca. ¿No está a la altura? Empiece de nuevo. Lo anoto. Por dentro. El horno hizo lo que pudo.",
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
        kitchenRecipe: "Todos: Encantado. ¿Qué onda? ¡Dos segundos! Es un deleite. Encantador. Pastel maestro — bizcocho, crema, paciencia. ¿Será todo? ¿Lo de siempre? ¡Servicio! Otra porción. Me voy a acordar de esto.",
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

export function calculateLevel(xp) {
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i].xpRequired) {
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

export function getLevelProgress(xp) {
    const current = getLevelData(calculateLevel(xp));
    const next = getNextLevelData(current.level);
    if (!next) return { level: current.level, label: current.label, progress: 1, xpToNext: 0 };

    const xpInLevel = xp - current.xpRequired;
    const xpNeeded = next.xpRequired - current.xpRequired;
    return {
        level: current.level,
        label: current.label,
        progress: Math.min(1, xpInLevel / xpNeeded),
        xpToNext: Math.max(0, next.xpRequired - xp),
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

export const BOOK_ORDER = [
    'sugar_cookie',
    'eclair_classique',
    'tres_leches_clasico',
    'crepe_de_rue',
    'churros_callejeros',
    'moka_express',
    'cafe_con_leche_rapido',
    'mille_feuille_amour',
    'flan_de_amor',
    'croquembouche_critique',
    'tarta_del_critico',
    'gateau_parfait',
    'pastel_maestro',
];

export const SUGAR_COOKIE = {
    id: 'sugar_cookie',
    name: 'Sugar Cookie',
    language: 'english',
    teacher: 'marcel',
    alwaysUnlocked: true,
    rarity: 'common',
    bookBlurb: "Basic. Butter, sugar, a pinch of salt. I'm not even charging you for this one. Bake it, eat it, then come learn how we actually talk around here — the real pages unlock when you practice with us.",
    bookImage: 'book_sugar_cookie.png',
    topdownImage: 'book_sugar_cookie_top.png',
    prepMinutes: 15,
    cookMinutes: 12,
    servings: 24,
    ingredients: [
        '2¼ cups flour',
        '½ tsp baking soda',
        '1 tsp salt',
        '1 cup butter, soft',
        '1½ cups sugar',
        '1 egg',
        '1 tsp vanilla',
    ],
    steps: [
        'Heat the oven to 375°F. Don’t overthink it.',
        'Mix flour, baking soda, and salt in one bowl.',
        'Beat butter and sugar until it looks like you meant it. Add the egg and vanilla.',
        'Stir in the dry stuff. Scoop balls onto a sheet. Sprinkle extra sugar if you’re feeling fancy.',
        'Bake 10–12 minutes until the edges go gold. Cool. Eat one. Then go bake with the staff so this book actually fills up.',
    ],
};

const BOOK_PAGES = {
    eclair_classique: {
        bookBlurb: "L'éclair naît au XIXe siècle, tout en pâte à choux et en patience. Le chocolat est brillant, la crème est calme — un plaisir poli, comme il se doit. Installez-vous, je vous prie.",
        bookImage: 'book_eclair.png',
        topdownImage: 'book_eclair_top.png',
        prepMinutes: 40,
        cookMinutes: 30,
        servings: 8,
        ingredients: ['Pâte à choux', 'Crème pâtissière', 'Chocolat noir', 'Beurre', 'Œufs'],
        steps: [
            'Faites la pâte à choux. Un four chaud, s’il vous plaît.',
            'Dressez des éclairs. Cuisez jusqu’à ce qu’ils soient dorés.',
            'Garnissez de crème. Glaçage chocolat. Ce sera tout?',
        ],
    },
    tres_leches_clasico: {
        bookBlurb: "Tres leches llega de fiesta: bizcocho, tres leches, paciencia. Es tierno, no vulgar. Un postre que dice por favor sin abrir un libro. Tome asiento.",
        bookImage: 'book_tresleches.png',
        topdownImage: 'book_tresleches_top.png',
        prepMinutes: 25,
        cookMinutes: 35,
        servings: 12,
        ingredients: ['Bizcocho', 'Leche evaporada', 'Leche condensada', 'Crema', 'Canela'],
        steps: [
            'Hornee el bizcocho y déjelo enfriar.',
            'Mezcle las tres leches. Empape con paciencia.',
            'Cubra con crema. Canela. ¿Será todo?',
        ],
    },
    crepe_de_rue: {
        bookBlurb: "La crêpe de rue, c’est Montmartre sans le ticket. Une poêle chaude, comme d’hab. Ça goûte le beurre et le weekend. T’inquiète, ça se plie tout seul.",
        bookImage: 'book_crepe.png',
        topdownImage: 'book_crepe_top.png',
        prepMinutes: 10,
        cookMinutes: 15,
        servings: 8,
        ingredients: ['Farine', 'Lait', 'Œufs', 'Beurre', 'Nutella ou sucre'],
        steps: [
            'Mélange la pâte. Repose un peu.',
            'Poêle chaude. Une louche. Comme d’hab.',
            'Plie. Nutella ou sucre. À plus.',
        ],
    },
    churros_callejeros: {
        bookBlurb: "Churro de feria: masa, aceite, azúcar. Nació en la calle y se quedó ahí. Crujiente por fuera, suave por dentro. No te preocupes, se fríen solos.",
        bookImage: 'book_churros.png',
        topdownImage: 'book_churros_top.png',
        prepMinutes: 15,
        cookMinutes: 15,
        servings: 6,
        ingredients: ['Harina', 'Agua', 'Sal', 'Aceite', 'Azúcar y canela', 'Chocolate'],
        steps: [
            'Hierve agua con sal. Agrega harina. Masa lista.',
            'Fríe tiras. Órale.',
            'Azúcar. Chocolate al lado. Nos vemos luego.',
        ],
    },
    moka_express: {
        bookBlurb: "Moka Express: le gâteau d’un rush. Café serré dans la pâte, bords un peu brûlés — nickel, c’est la caramelisation. On respire après.",
        bookImage: 'book_moka.png',
        topdownImage: 'book_moka_top.png',
        prepMinutes: 20,
        cookMinutes: 25,
        servings: 8,
        ingredients: ['Génoise', 'Café serré', 'Chocolat', 'Crème'],
        steps: [
            'Génoise au café. Deux secondes, le four est chaud.',
            'Garnis, assemble, accélère.',
            'Service. Si le bord est foncé: voulu.',
        ],
    },
    cafe_con_leche_rapido: {
        bookBlurb: "Mitad muffin, mitad latte, todo caos. Nació un lunes. Sabe a café con leche y a no hay tiempo. El borde tostado es caramelo. Respiramos después.",
        bookImage: 'book_cafecake.png',
        topdownImage: 'book_cafecake_top.png',
        prepMinutes: 15,
        cookMinutes: 22,
        servings: 8,
        ingredients: ['Muffin', 'Café con leche', 'Azúcar', 'Canela'],
        steps: [
            'Masa de muffin. Café en el bol. Aceleramos.',
            'Horno. ¡Atrás de ti!',
            'Si se quema el borde: todo tranqui.',
        ],
    },
    mille_feuille_amour: {
        bookBlurb: "Mille feuilles, mille excuses pour rester. La pâte craque, la crème chuchote. Chaque couche est une déclaration d’amour. C’est trop beau pour être mangé… presque.",
        bookImage: 'book_millefeuille.png',
        topdownImage: 'book_millefeuille_top.png',
        prepMinutes: 45,
        cookMinutes: 25,
        servings: 6,
        ingredients: ['Pâte feuilletée', 'Crème pâtissière', 'Fraises', 'Sucre glace'],
        steps: [
            'Cuisez la pâte. Laissez-la chanter.',
            'Couche, crème, couche. Restez un peu.',
            'Fraises. Encore une part, je vous en supplie.',
        ],
    },
    flan_de_amor: {
        bookBlurb: "El flan no corre: se desliza. Huevos, leche, caramelo que canta. Nació para enamorar a alguien — o al menos al postre. Me derrito por esta tarta.",
        bookImage: 'book_flan.png',
        topdownImage: 'book_flan_top.png',
        prepMinutes: 20,
        cookMinutes: 50,
        servings: 8,
        ingredients: ['Huevos', 'Leche', 'Azúcar', 'Vainilla'],
        steps: [
            'Caramelo en el molde. Que cante.',
            'Baño María. Paciencia, amor.',
            'Enfríe. Desmolde. Quédese un rato más.',
        ],
    },
    croquembouche_critique: {
        bookBlurb: "Une tour de choux et de griefs. Le caramel a de l’audace. Craquant, un peu trop sûr de lui. Charmant. Vraiment. Le four a fait de son mieux.",
        bookImage: 'book_croquembouche.png',
        topdownImage: 'book_croquembouche_top.png',
        prepMinutes: 60,
        cookMinutes: 40,
        servings: 10,
        ingredients: ['Pâte à choux', 'Crème', 'Caramel'],
        steps: [
            'Choux. Four. Bravo pour l’effort.',
            'Caramel. Montez la tour. Si ça penche, recommencez.',
            'Je note. Intérieurement.',
        ],
    },
    tarta_del_critico: {
        bookBlurb: "Tarta ácida, honesta, sin azúcar de más. Nació para decir la verdad al postre. Un bocado y ya hay notas. Encantador. De verdad. El horno hizo lo que pudo.",
        bookImage: 'book_tarta.png',
        topdownImage: 'book_tarta_top.png',
        prepMinutes: 30,
        cookMinutes: 40,
        servings: 8,
        ingredients: ['Masa quebrada', 'Cítricos', 'Azúcar', 'Huevos'],
        steps: [
            'Masa. Horno. Audacia.',
            'Relleno de cítricos. No lo dulcifique demasiado.',
            'Si no está a la altura: empiece de nuevo.',
        ],
    },
    gateau_parfait: {
        bookBlurb: "Bonjour. Salut. Deux secondes. C’est un délice. Charmant. Le gâteau que tout le monde revendique. Technique, vibes, rush, amour, et une note. Ce sera tout?",
        bookImage: 'book_gateau.png',
        topdownImage: 'book_gateau_top.png',
        prepMinutes: 50,
        cookMinutes: 45,
        servings: 12,
        ingredients: ['Génoise', 'Crème', 'Fruits', 'Patience'],
        steps: [
            'Génoise. Patience. Bonjour.',
            'Crème. Comme d’hab. Service!',
            'Montez. Encore une part. Je vais m’en souvenir.',
        ],
    },
    pastel_maestro: {
        bookBlurb: "Encantado. ¿Qué onda? ¡Dos segundos! Es un deleite. Encantador. El pastel que termina discusiones. Nadie coincide en la receta. Todos coinciden en que hay que merecerlo.",
        bookImage: 'book_pastel.png',
        topdownImage: 'book_pastel_top.png',
        prepMinutes: 50,
        cookMinutes: 45,
        servings: 12,
        ingredients: ['Bizcocho', 'Crema', 'Fruta', 'Paciencia'],
        steps: [
            'Bizcocho. Paciencia. Encantado.',
            'Crema. ¿Lo de siempre? ¡Servicio!',
            'Arme. Otra porción. Me voy a acordar de esto.',
        ],
    },
};

export function getBookRecipe(id) {
    if (id === SUGAR_COOKIE.id) return SUGAR_COOKIE;
    const base = getRecipeById(id);
    if (!base) return null;
    return { ...base, alwaysUnlocked: false, ...BOOK_PAGES[id] };
}

export function getBookCatalog() {
    return BOOK_ORDER.map(id => getBookRecipe(id)).filter(Boolean);
}
