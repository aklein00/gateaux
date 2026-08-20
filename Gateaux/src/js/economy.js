// Gateaux economy — single source of truth for wallets + XP payouts.
// Design intent: product/PRESENT/economy.md
//
// Soft = coins (spendable). Hard = diamonds (speed-ups; debug grant until store).
// XP levels the player and is never spent.
//
// Unit of account: LESSON_REPLAY_COST (one extra bake of a cleared lesson).
// Counter pastry payouts are expressed as multiples of that unit via tipMultiplier.

/** Soft wallet seed for new / migrated saves (playtest-friendly). */
export const STARTER_COINS = 150;

/** Hard wallet seed (debug-only acquire until a store exists). */
export const STARTER_DIAMONDS = 30;

/**
 * Soft cost to start a lesson you have already cleared (extra bake / replay).
 * This is the economy’s unit of account — pastry sells and later sinks
 * should read clearly against this number.
 */
export const LESSON_REPLAY_COST = 12;

/**
 * Base Cafe Counter payout for a correct sale before rarity multiplier.
 * Intentionally equal to LESSON_REPLAY_COST so a common pastry refunds
 * exactly one replay; rarity tipMultiplier scales above that.
 */
export const COUNTER_BASE_PAYOUT = LESSON_REPLAY_COST; // 12

/** Coins + XP granted when a lesson finishes (after the quiz). */
export const LESSON_COMPLETE_BONUS = 25;

/** Base coins + XP per correct quiz answer (before streak multiplier). */
export const QUIZ_BASE_PAYOUT = 2;

/** Extra coins + XP the first time a phrase is learned (once per phrase id). */
export const PHRASE_FIRST_LEARN_BONUS = 5;

/**
 * Diamond cost to skip remaining set-time on a cake in the case.
 * Bands match rarity set windows (2m / 20m / 4h).
 */
export function getSpeedUpDiamondCost(remainingMs) {
    if (remainingMs <= 0) return 0;
    const mins = remainingMs / 60000;
    if (mins <= 2) return 1;
    if (mins <= 20) return 2;
    if (mins <= 60) return 3;
    return 5;
}

/** Soft cost when starting a lesson; 0 on first clear. */
export function replayLessonCoinCost(alreadyCompleted) {
    return alreadyCompleted ? LESSON_REPLAY_COST : 0;
}

/** Cafe Counter coins + XP for selling one cake of this recipe. */
export function getCounterPayout(recipe) {
    const mult = recipe?.tipMultiplier ?? 1;
    return Math.round(COUNTER_BASE_PAYOUT * mult);
}

/**
 * How many lesson replays one sold pastry funds (for docs / UI).
 * Common 1.0 → 1.0, uncommon 1.5 → 1.5, etc.
 */
export function replaysFundedByPastry(recipe) {
    return (recipe?.tipMultiplier ?? 1);
}
