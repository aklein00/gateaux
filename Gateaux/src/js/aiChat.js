// AI Chat Integration for Gateaux
// Uses Venus SDK ai.requestChatCompletionAsync for language-learning interactions
import VenusAPI from '@series-inc/venus-sdk/api';

const DEFAULT_MODEL = 'gpt-4o-mini';

// Build a system prompt for the language tutor context
function buildSystemPrompt({ language, region, teacherName, teacherPersonality, customerName, customerPersonality }) {
    return [
        'You are a friendly language tutor in a cozy cafe game called Gateaux.',
        `The player is learning ${language}${region ? ` (${region} dialect)` : ''}.`,
        teacherName ? `Their teacher is ${teacherName}, who is ${teacherPersonality}.` : '',
        customerName ? `The customer is ${customerName}, who is ${customerPersonality}.` : '',
        'Keep responses under 2 sentences. Be encouraging. Use the target language with English translations in parentheses.'
    ].filter(Boolean).join(' ');
}

// Request a chat completion from the Venus AI API
// Returns the response text, or null if unavailable
export async function requestChat(messages, options = {}) {
    try {
        const response = await VenusAPI.ai.requestChatCompletionAsync({
            model: options.model || DEFAULT_MODEL,
            messages,
            maxTokens: options.maxTokens || 150,
            temperature: options.temperature || 0.7
        });

        if (response && response.choices && response.choices.length > 0) {
            return response.choices[0].message.content;
        }
        return null;
    } catch (error) {
        console.error('AI chat request failed:', error);
        return null;
    }
}

// Get a hint for a phrase the player is learning
export async function getPhraseHint({ phrase, language, region, teacherName, teacherPersonality }) {
    const nativeText = phrase[language] || phrase.french || phrase.spanish;
    const systemPrompt = buildSystemPrompt({ language, region, teacherName, teacherPersonality });

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Help me understand this phrase: "${nativeText}" (${phrase.english}). Context: ${phrase.context}` }
    ];

    return await requestChat(messages);
}

// Generate a customer greeting or dialogue line
export async function getCustomerDialogue({ customerName, customerPersonality, language, scenario }) {
    const systemPrompt = buildSystemPrompt({ language, customerName, customerPersonality });

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `The customer walks in. Scenario: ${scenario}. Generate a short greeting they would say in ${language} with an English translation.` }
    ];

    return await requestChat(messages, { maxTokens: 80 });
}

// Generate correction text for a wrong answer (for AI-generated phrases)
// Returns a 1-2 sentence teacher-voiced explanation of why the answer is wrong
export async function generateCorrectionText({ phrase, wrongAnswer, language, teacherName, teacherPersonality }) {
    const nativeText = phrase[language] || phrase.french || phrase.spanish;
    const correctAnswer = phrase.english;

    const messages = [
        {
            role: 'system',
            content: [
                `You are ${teacherName}, a ${teacherPersonality} language teacher in a cafe game.`,
                'You are correcting a student who chose the wrong answer.',
                'Explain in 1-2 sentences WHY their answer is wrong and what the correct answer means.',
                `Write in ${teacherName}'s personality and voice. Be educational but brief.`
            ].join(' ')
        },
        {
            role: 'user',
            content: `The student was asked what "${nativeText}" means. They chose "${wrongAnswer}" but the correct answer is "${correctAnswer}". Context: ${phrase.context}. Explain why they're wrong.`
        }
    ];

    return await requestChat(messages, { maxTokens: 100, temperature: 0.8 });
}

// Check if AI is available (will work in mock mode too, but responses may be limited)
export async function getAvailableModels() {
    try {
        return await VenusAPI.ai.getAvailableCompletionModels();
    } catch {
        return [];
    }
}
