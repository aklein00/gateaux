// First-run copy: matching intro story, then one slang closer.
// Keep UI text out of phrases.json.

export const FIRST_RUN_CLOSER_IDS = {
    french: 'fr_greet_casual_4',
    spanish: 'es_greet_casual_4'
};

export const FIRST_RUN_STORY = {
    french: [
        "You walk in. Marcel still doesn't look up. <em>Salut! Ça va?</em> That's the whole hello — not a handshake, a nod.",
        "He tips his chin at the case. <em>Qu'est-ce que je te sers?</em> What do you want. Not how may I help you.",
        "Been here before? <em>Comme d'hab?</em> The usual. He already started the drink.",
        "<em>Ça roule, ma poule?</em> is him being a menace on purpose. Then <em>À plus!</em> and he's gone."
    ],
    spanish: [
        "You walk in. Marcel still doesn't look up. <em>¿Qué onda?</em> That's the hello — a wave, not a bow.",
        "He taps the counter. <em>¿Qué te sirvo?</em> What do you want. Not may I take your order.",
        "Been here before? <em>¿Lo de siempre?</em> The usual. Cup's already in his hand.",
        "<em>¿Qué tal, compa?</em> means you're in. Then <em>Ahí nos vemos</em> and he's gone."
    ]
};
