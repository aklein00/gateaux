# Content inventory

Source of truth: `Gateaux/src/data/phrases.json` and `Gateaux/src/js/recipeData.js`. Counted 14 Aug 2026.

## Languages

| Language | Phrases | Cake (hub card) | Regions in metadata | Regions in phrases |
|---|---|---|---|---|
| French | 60 | Éclair | France, Québec | None tagged |
| Spanish | 60 | Tres Leches | Spain, Mexico, Argentina | None tagged |

## Formality

| Register | Count | Share | Player-facing today |
|---|---|---|---|
| Casual | 69 | 58% | First lesson (Marcel) |
| Formal | 43 | 36% | Later in the list |
| Slang | 8 | 7% | In “The usual” / café slang, available at L1 |

Slang lines we already have and should put on the porch:

- `Salut! Ça va?` — Hey! How’s it going?
- `Comme d’hab?` — The usual?
- `Ça roule, ma poule?` — How’s it rolling, buddy?
- `T’as la dalle?` — You hungry?
- `Ça passe crème!` — It goes down smooth!
- `¿Qué onda?` — What’s up?
- `¿Qué tal, compa?` — How’s it going, buddy?
- `¡Órale, ahí va!` — Alright, here it goes!

## Categories (12 × 10 phrases)

| Category | Teacher | Difficulty | Tone |
|---|---|---|---|
| Formal Greetings | Amélie | 1 | Textbook host |
| Casual Greetings | Marcel | 1 | Locals |
| Proper Farewells | Amélie | 1 | Textbook |
| Taking Orders | Amélie | 2 | Professional |
| Café Slang | Marcel | 2 | Fast and casual |
| Small Talk | Marcel | 2 | Filler talk |
| Apologies & Excuses | Amélie | 2 | Polite |
| Food Praise | Bisou | 2 | Gushy |
| Rush Hour Chaos | Café | 3 | Stressed |
| Sweet Talk | Bisou | 3 | Flirty PG-13 |
| Complaints Department | Gaston | 3 | Grumpy |
| Advanced Sarcasm | Gaston | 3 | Mean-funny |

## Recipes (12 cakes)

6 French + 6 Spanish. Unlock ladder: L1 Amélie → L2 Marcel → L3 Café → L4 Bisou → L5 Gaston → L6 legendary “all teachers.”

That ladder **used to lock slang behind level 2.** Marcel’s crêpe and churros now unlock at level 1.

## Teachers

| ID | Role in bible | Role in first session |
|---|---|---|
| Amélie | Proper basics | Later, labeled fancy |
| Marcel | How people talk | First session |
| Café | Service chaos | Midgame |
| Bisou | Charm | Midgame |
| Gaston | Complaints | Late |

## Quiz coverage

- Direction: native→EN, EN→native, listen-first, cycling.
- Distractors: per-phrase `wrong_answers_*`, else other lesson phrases, else a café fallback pool.
- Audio: TTS for listen questions and customers.
- Corrections: static `correction` field on each phrase.
- Cap: 5 prompts per lesson.

## Hollow content (exists as UI, empty as product)

| Surface | Status |
|---|---|
| Region selector | Rendered empty on purpose |
| Milestone “Recipe Unlock” nodes | Removed |
| Café decorations / layout / theme | State keys, no UI |
| Customer types in JSON (elderly tourist, hipster, etc.) | Not used by `customerService.js` (Bunny/Cat/Dog/Bear/Fox instead) |
| `getPhraseHint` / `getCustomerDialogue` | Written, unused |
