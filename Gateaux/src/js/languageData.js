// Language Data for Gateaux
// This file loads phrase data from the master JSON file

let phrasesData = null;

// Load phrases from JSON file
export async function loadPhrases() {
    try {
        const url = new URL('../data/phrases.json', import.meta.url).href;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        phrasesData = await response.json();

        // Set customer types after loading
        if (phrasesData && phrasesData.customerTypes) {
            customerTypes = phrasesData.customerTypes;
        }

        return phrasesData;
    } catch (error) {
        console.error('Failed to load phrases:', error);
        return null;
    }
}

// Get phrases by criteria
export function getPhrases(filters = {}) {
    if (!phrasesData) return [];
    
    let phrases = phrasesData.phrases;
    
    if (filters.language) {
        phrases = phrases.filter(p => p.language === filters.language);
    }
    if (filters.region) {
        phrases = phrases.filter(p => p.region === filters.region);
    }
    if (filters.category) {
        phrases = phrases.filter(p => p.category === filters.category);
    }
    if (filters.formality) {
        phrases = phrases.filter(p => p.formality === filters.formality);
    }
    
    return phrases;
}

export const FIRST_RUN_LESSON_ID = 'greetings_casual';
export const MAX_LESSON_PROMPTS = 5;
export const PHRASE_PACK_SIZE = 5;

export function getPhraseById(phraseId) {
    if (!phrasesData || !phraseId) return null;
    return phrasesData.phrases.find(p => p.id === phraseId) || null;
}

export function selectLessonPhrasePack(lesson, packIndex = 0, packSize = PHRASE_PACK_SIZE) {
    if (!lesson) return lesson;
    const phrases = lesson.phrases || [];
    const packs = Math.max(1, Math.ceil(phrases.length / packSize));
    const index = ((packIndex % packs) + packs) % packs;
    return {
        ...lesson,
        phrases: phrases.slice(index * packSize, index * packSize + packSize)
    };
}

// Get lesson structure (organized by category and teacher)
export function getLessons(language, region = null) {
    if (!phrasesData) {
        return [];
    }
    
    const lessons = [];
    const categories = Object.keys(phrasesData.categories);
    
    categories.forEach(categoryId => {
        const category = phrasesData.categories[categoryId];
        const phrases = getPhrases({ 
            language, 
            region, 
            category: categoryId 
        });
        
        if (phrases.length > 0) {
            lessons.push({
                id: categoryId,
                title: category.name,
                teacher: category.teacher,
                description: category.description,
                phrases: phrases,
                difficulty: category.difficulty || 1,
                sortOrder: category.sortOrder ?? 99
            });
        }
    });

    return lessons.sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.difficulty - b.difficulty;
    });
}

export function getLessonById(language, lessonId, region = null) {
    return getLessons(language, region).find(lesson => lesson.id === lessonId) || null;
}

export function trimLessonPhrases(lesson, max = MAX_LESSON_PROMPTS) {
    return selectLessonPhrasePack(lesson, 0, max);
}

// Get teacher info
export const teachers = {
    amelie: {
        name: "Amélie",
        style: "formal",
        personality: "Refined and patient",
        specialties: ["Formal greetings", "Polite conversation", "Proper etiquette"]
    },
    marcel: {
        name: "Marcel",
        style: "casual",
        personality: "Street-smart and friendly",
        specialties: ["Slang", "Local expressions", "Quick phrases"]
    },
    cafe: {
        name: "Café",
        style: "sarcastic",
        personality: "Overwhelmed but witty",
        specialties: ["Coffee complaints", "Multitasking phrases", "Café culture"]
    },
    bisou: {
        name: "Bisou",
        style: "romantic",
        personality: "Dramatic and flirty",
        specialties: ["Compliments", "Social phrases", "Romantic expressions"]
    },
    gaston: {
        name: "Gaston",
        style: "grumpy",
        personality: "Critical but helpful",
        specialties: ["Complaints", "Opinions", "Witty comebacks"]
    }
};

// Cake types for display case
export const cakeTypes = {
    french: {
        paris: {
            name: "Éclair Parisien",
            color: "#8B4513",
            description: "Classic chocolate éclair",
            decayRate: 8 // hours
        },
        quebec: {
            name: "Tarte au Sucre",
            color: "#D2691E",
            description: "Québécois sugar pie",
            decayRate: 6 // hours
        }
    },
    spanish: {
        spain: {
            name: "Tarta de Santiago",
            color: "#FFE4B5",
            description: "Almond cake from Galicia",
            decayRate: 10 // hours
        },
        mexico: {
            name: "Tres Leches",
            color: "#FFFACD",
            description: "Three milk cake",
            decayRate: 4 // hours (dairy spoils faster!)
        }
    }
};

// Customer types - populated from phrases.json via loadPhrases()
export let customerTypes = [];