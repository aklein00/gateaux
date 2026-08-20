// Gateaux economy — single source of truth for wallets + XP payouts.
// Design intent: product/PRESENT/economy.md
//
// Soft = coins (spendable). Hard = diamonds (speed-ups; debug grant until store).
// XP levels the player and is never spent.
//
// Unit of account: LESSON_REPLAY_COST (one extra bake of a cleared lesson).
// Coins come primarily from Cafe Counter pastry sales — not from quiz/lesson clears.
// Lessons award XP only. tipMultiplier = how many replays one pastry sale refunds.

/** Soft wallet seed for new / migrated saves (playtest-friendly). */
export const STARTER_COINS = 150;

/** Hard wallet seed (debug-only acquire until a store exists). */
export const STARTER_DIAMONDS = 30;

/**
 * Soft cost to start a lesson you have already cleared (extra bake / replay).
 * Economy yardstick — pastry sells scale against this.
 */
export const LESSON_REPLAY_COST = 12;

/**
 * Base Cafe Counter coin payout before rarity multiplier.
 * Locked to LESSON_REPLAY_COST so a common pastry refunds exactly one replay.
 * This is the main coin faucet.
 */
export const COUNTER_BASE_PAYOUT = LESSON_REPLAY_COST; // 12

/** XP granted when a lesson finishes (no coins). */
export const LESSON_COMPLETE_XP = 25;

/** XP per correct quiz answer before streak multiplier (no coins). */
export const QUIZ_BASE_XP = 2;

/** XP the first time a phrase is learned (no coins). */
export const PHRASE_FIRST_LEARN_XP = 5;

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

/** Cafe Counter coins for selling one cake of this recipe (main coin earn). */
export function getCounterPayout(recipe) {
    const mult = recipe?.tipMultiplier ?? 1;
    return Math.round(COUNTER_BASE_PAYOUT * mult);
}

/** How many lesson replays one sold pastry funds. */
export function replaysFundedByPastry(recipe) {
    return (recipe?.tipMultiplier ?? 1);
}
