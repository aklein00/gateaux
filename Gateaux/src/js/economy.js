// Soft currency = coins (wallet). Hard currency = diamonds.
// XP levels the player and is never spent.

export const STARTER_COINS = 150;
export const STARTER_DIAMONDS = 30;

/** Soft cost to replay a lesson you've already cleared (extra bake). */
export const LESSON_REPLAY_COST = 12;

export function getSpeedUpDiamondCost(remainingMs) {
    if (remainingMs <= 0) return 0;
    const mins = remainingMs / 60000;
    if (mins <= 2) return 1;
    if (mins <= 20) return 2;
    if (mins <= 60) return 3;
    return 5;
}

/** Cost when the lesson was already completed at least once. */
export function replayLessonCoinCost(alreadyCompleted) {
    return alreadyCompleted ? LESSON_REPLAY_COST : 0;
}
