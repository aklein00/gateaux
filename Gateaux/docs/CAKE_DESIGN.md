# Gateaux - Cake Recipe Design Document

**Version:** 1.0
**Last Updated:** 2026-02-08

## Design Philosophy

12 cakes total (6 per language). Each cake maps to one teacher, creating a clean mental model: **teacher = personality = cake type = difficulty tier**. The progression is designed so players unlock a new cake roughly every 1-3 play sessions, keeping motivation high without overwhelming choice.

## Currency & Leveling

> **Superseded by** [`product/PRESENT/economy.md`](../../product/PRESENT/economy.md) (2026-08-20).
>
> Soft wallet = **coins**. Hard = **diamonds**. Level = **XP** (not spendable).
> Unit of account = lesson replay cost (**12 coins**). Cafe Counter base payout equals that unit; `tipMultiplier` = how many replays one pastry sale refunds.

### Pastry payouts (replay-units)

| Rarity | tipMultiplier | Counter payout |
|---|---|---|
| Common | 1.0× | 12 coins (= 1 replay) |
| Uncommon | 1.5× | 18 |
| Rare | 2.0× | 24 |
| Legendary | 3.0× | 36 |

### Level Thresholds (XP)

| Level | XP Required | Label | Unlocks | Approx. Lessons |
|-------|-------------|-------|---------|-----------------|
| 1 | 0 | Apprentice Baker | Marcel commons | Start |
| 2 | 75 | Pastry Student | Amélie commons | ~1 lesson |
| 3 | 200 | Line Cook | Cafe uncommons | ~3 lessons |
| 4 | 400 | Sous Chef | Bisou rares | ~6 lessons |
| 5 | 700 | Head Patissier | Gaston rares | ~10 lessons |
| 6 | 1100 | Master Baker | Legendary cakes | ~16 lessons |

---

## French Cakes

### 1. Eclair Classique
- **Teacher:** Amelie (Refined, patient)
- **Rarity:** Common | **Difficulty:** 1 | **Unlock:** Level 1
- **Decay:** 4 hours | **Tip Multiplier:** 1.0x
- **Description:** "The foundation of any self-respecting patisserie. Amelie insists each one is piped to perfection -- even if it's just going to be eaten by a tourist who pronounces 'eclair' like 'ee-CLAIR.'"
- **AI Effect:** Phrases are formal, properly conjugated, and dripping with Parisian politeness. Amelie would rather close the cafe than let you use "tu" with a stranger.

### 2. Crepe de Rue
- **Teacher:** Marcel (Street-smart, casual)
- **Rarity:** Common | **Difficulty:** 1 | **Unlock:** Level 2
- **Decay:** 3 hours | **Tip Multiplier:** 1.0x
- **Description:** "Folded with the casual confidence of someone who learned to cook on a Montmartre street corner. Marcel says the secret ingredient is 'not caring what Amelie thinks.'"
- **AI Effect:** Slang-heavy, casual, and full of shortcuts. Marcel drops half the syllables and adds twice the personality.

### 3. Moka Express
- **Teacher:** Cafe (Overwhelmed, witty)
- **Rarity:** Uncommon | **Difficulty:** 2 | **Unlock:** Level 3
- **Decay:** 5 hours | **Tip Multiplier:** 1.5x
- **Description:** "A cake that tastes like it was made during a rush, because it was. Cafe swears the slightly burnt edges are 'intentional caramelization.'"
- **AI Effect:** Fast-paced cafe service language. Short sentences, urgent tone, and the kind of multitasking vocabulary you need when three customers are yelling at once.

### 4. Mille-feuille d'Amour
- **Teacher:** Bisou (Dramatic, romantic)
- **Rarity:** Rare | **Difficulty:** 3 | **Unlock:** Level 4
- **Decay:** 7 hours | **Tip Multiplier:** 2.0x
- **Description:** "A thousand layers of pastry, each whispering sweet nothings. Bisou claims she invented it after a particularly moving sunset. Nobody has the heart to correct her."
- **AI Effect:** Romantic vocabulary, compliments, and social charm. Every sentence sounds like it belongs in a love letter -- even when ordering napkins.

### 5. Croquembouche Critique
- **Teacher:** Gaston (Critical, sarcastic)
- **Rarity:** Rare | **Difficulty:** 3 | **Unlock:** Level 5
- **Decay:** 7 hours | **Tip Multiplier:** 2.0x
- **Description:** "A towering monument to everything Gaston finds wrong with the world. Each cream puff represents a different complaint. The caramel represents his grudging respect for craftsmanship."
- **AI Effect:** Sarcastic, opinionated, and brutally honest. Gaston teaches you to complain with style and defend your terrible coffee choices with panache.

### 6. Le Gateau Parfait
- **Teacher:** All (AI-generated)
- **Rarity:** Legendary | **Difficulty:** 3 | **Unlock:** Level 6
- **Decay:** 10 hours | **Tip Multiplier:** 3.0x
- **Description:** "The mythical perfect cake. Every teacher claims credit. Amelie says technique, Marcel says vibes, Cafe says speed, Bisou says love, and Gaston says it's 'acceptable.' They're all wrong. It's about the player who made it."
- **AI Effect:** AI-generated lessons blending all five personalities. Difficulty adapts to your level. This is where the training wheels come off.

---

## Spanish Cakes

### 7. Tres Leches Clasico
- **Teacher:** Amelie | **Rarity:** Common | **Difficulty:** 1 | **Unlock:** Level 1
- **Decay:** 4 hours | **Tip Multiplier:** 1.0x
- **Description:** "Three milks, one purpose: teaching you to say 'por favor' without sounding like a guidebook. Amelie soaks each layer with the precision of a diplomat."
- **AI Effect:** Formal Spanish with proper usted conjugations. Amelie is the same in every language: polite to a fault.

### 8. Churros Callejeros
- **Teacher:** Marcel | **Rarity:** Common | **Difficulty:** 1 | **Unlock:** Level 2
- **Decay:** 3 hours | **Tip Multiplier:** 1.0x
- **Description:** "Dusted with sugar and attitude. Marcel fries these the way he teaches -- fast, loud, and with zero regard for your feelings about irregular verbs."
- **AI Effect:** Street Spanish, local slang, and the kind of shortcuts that make textbook teachers weep.

### 9. Cafe con Leche Rapido
- **Teacher:** Cafe | **Rarity:** Uncommon | **Difficulty:** 2 | **Unlock:** Level 3
- **Decay:** 5 hours | **Tip Multiplier:** 1.5x
- **Description:** "Half cake, half coffee, fully chaotic. Cafe invented this during a morning rush when she accidentally dropped a muffin in a latte and a customer said it was 'the best thing on the menu.'"
- **AI Effect:** Service-industry Spanish at full speed. Orders, complaints, and the sacred art of saying "one moment please" while everything is on fire.

### 10. Flan de Amor
- **Teacher:** Bisou | **Rarity:** Rare | **Difficulty:** 3 | **Unlock:** Level 4
- **Decay:** 7 hours | **Tip Multiplier:** 2.0x
- **Description:** "Impossibly smooth, dangerously sweet, and guaranteed to make someone fall in love with you. Or at least with the flan. Bisou makes no promises."
- **AI Effect:** Spanish romance vocabulary. Compliments, terms of endearment, and the sort of phrases that sound corny until they actually work.

### 11. Tarta del Critico
- **Teacher:** Gaston | **Rarity:** Rare | **Difficulty:** 3 | **Unlock:** Level 5
- **Decay:** 7 hours | **Tip Multiplier:** 2.0x
- **Description:** "A tart so bitter it could write restaurant reviews. Gaston considers it his masterpiece because 'finally, a dessert that tells the truth.'"
- **AI Effect:** Spanish complaints, opinions, and witty comebacks. Learn to send food back with devastating politeness.

### 12. Pastel Maestro
- **Teacher:** All (AI-generated) | **Rarity:** Legendary | **Difficulty:** 3 | **Unlock:** Level 6
- **Decay:** 10 hours | **Tip Multiplier:** 3.0x
- **Description:** "The cake that ends arguments. Every teacher agrees it exists. None agree on the recipe. The only thing they know for certain is that you have to earn it."
- **AI Effect:** AI-generated mixed-personality lessons. All five teaching styles in one. This is not a cake -- it is a graduation ceremony.

---

## Balance Summary

| Rarity | Decay | Tip Mult | Difficulty | Count |
|--------|-------|----------|------------|-------|
| Common | 3-4h | 1.0x | 1 (Beginner) | 4 |
| Uncommon | 5h | 1.5x | 2 (Elementary) | 2 |
| Rare | 7h | 2.0x | 3 (Intermediate) | 4 |
| Legendary | 10h | 3.0x | 3 (Advanced/AI) | 2 |

### Design Notes

1. **Decay times are generous.** A 3h common cake means casual players checking in twice a day will find fresh cakes. The 10h legendary survives overnight.

2. **Tip multipliers compound with streaks.** A rare cake (2x) sold to a customer while the player has a quiz streak going yields significant tips. This rewards skilled players.

3. **Level curve tuning.** If players reach Level 6 too quickly, increase thresholds. If too slowly, decrease or add bonuses for first-time completions. The LEVEL_THRESHOLDS array in recipeData.js is trivially adjustable.

4. **12 cakes is intentional.** Small enough for completionist appeal, varied enough for meaningful recipe picker choice. Adding more should follow the teacher-mapping pattern.

5. **Legendary cakes as aspirational content.** Level 6 should feel like an achievement. The 3x tip multiplier and 10h decay make them genuinely valuable.

6. **Art pipeline.** The placeholder system means all 12 cakes work from day one with gray squares. Prioritize common cakes first since players see them earliest.

### Rarity Color Scheme

| Rarity | Color | Hex |
|--------|-------|-----|
| Common | Green | #4CAF50 |
| Uncommon | Gold | #DAA520 |
| Rare | Purple | #9C27B0 |
| Legendary | Orange-Gold gradient | #FF8C00 to #FFD700 |
