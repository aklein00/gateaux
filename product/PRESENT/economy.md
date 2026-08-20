# Economy

Living balance sheet for Gateaux. Code constants live in `Gateaux/src/js/economy.js`. If this doc and the file disagree, **fix the file**, then fix the doc.

**Last updated:** 2026-08-20 (coins-from-sales split)

---

## Three meters (do not conflate)

| Meter | Player-facing | Spendable? | Role |
|---|---|---|---|
| **Coins** | Yellow coin | Yes | Soft wallet. Earned by **selling cakes**. Spent on lesson replays (and later soft sinks). |
| **Diamonds** | Pink diamond | Yes | Hard wallet. Skip cake *set* wait. Debug grant only until store. |
| **XP** | Level bar | **No** | Progression from **lessons** (quiz hits, first-learn, lesson complete). Unlocks recipes. |

Spending coins or diamonds never reduces XP or level.

---

## Where money comes from (invariant)

| Source | Coins? | XP? |
|---|---|---|
| Quiz correct answer | **No** | Yes (`QUIZ_BASE_XP` × streak) |
| First time learning a phrase | **No** | Yes (`PHRASE_FIRST_LEARN_XP`) |
| Lesson complete | **No** | Yes (`LESSON_COMPLETE_XP`) |
| **Cafe Counter pastry sale** | **Yes** (main faucet) | **No** |
| Diamonds | Hard only | — |

The Cafe Counter quiz is the skill check that *authorizes* the sale. It does **not** pay a second bonus on top of the pastry payout — the sale *is* the reward.

Lessons used to dump coins via quiz + complete bonus; that flooded the wallet so selling felt optional. That path is closed.

---

## Unit of account: one replay = 12 coins

`LESSON_REPLAY_COST = 12` is the soft-economy yardstick.

| Thing | Value | In replay-units |
|---|---|---|
| Replay a cleared lesson | **−12 coins** | −1 bake |
| Common pastry sold | **+12 coins** (`1.0×`) | +1 bake |
| Uncommon sold | **+18** (`1.5×`) | +1.5 |
| Rare sold | **+24** (`2.0×`) | +2 |
| Legendary sold | **+36** (`3.0×`) | +3 |

`COUNTER_BASE_PAYOUT` is locked to `LESSON_REPLAY_COST` in code. `tipMultiplier` = **how many lesson replays one successful sale refunds**.

---

## Core loops

```
Lesson (free first clear / −12 on replay)
  → XP from quiz + complete
  → cake enters case (sets)
  → [optional: diamonds skip set]
  → Cafe Counter quiz → pastry COINS (sale)
  → cake removed
  → coins fund the next replay
```

**Learn to level. Sell to afford another bake.**

---

## Session math

Assumes ~5 phrases / lesson, mostly 1× streak, common pastry.

### First clear (cost 0)

| Step | Coins | XP |
|---|---|---|
| 5× quiz @ 2 XP | 0 | +10 |
| 5× first-learn @ 5 XP | 0 | +25 |
| Lesson complete | 0 | +25 |
| Counter sell (common) | **+12** | 0 |
| **Total** | **+12** | **~60** |

### Replay + sell common (cost 12)

| Step | Coins | XP |
|---|---|---|
| Start replay | −12 | 0 |
| 5× quiz | 0 | +10 |
| Lesson complete | 0 | +25 |
| Counter sell | +12 | 0 |
| **Net** | **0** | **+35** |

Common replay is coin-neutral if you sell. Higher rarities profit in coins. Skipping the counter leaves you down 12 — selling is required to stay liquid.

### Streaks (XP only)

| Streak | Mult | XP per hit |
|---|---|---|
| 1–2 | 1× | 2 |
| 3–4 | 2× | 4 |
| 5–7 | 3× | 6 |
| 8+ | 5× | 10 |

---

## Early game (L1–L2)

| Lever | Value | Why |
|---|---|---|
| Starter coins | 150 | ~12 replays of runway while learning the sell loop |
| Starter diamonds | 30 | Optional impatience on set timers |
| First clear | Free | Protects time-to-first-question |
| Common set | 2 min (first cake 45s) | Short; 1◆ to skip |
| Common sell | = 1 replay | Cause → effect is obvious |

---

## Mid / late game

| Rarity | Set wait | Speed-up ◆ | tipMultiplier | Sale coins | Replays funded |
|---|---|---|---|---|---|
| Common | 2 min | 1 | 1.0 | 12 | 1 |
| Uncommon | 20 min | 2 | 1.5 | 18 | 1.5 |
| Rare | 4 h | 5 | 2.0 | 24 | 2 |
| Legendary | 4 h | 5 | 3.0 | 36 | 3 |

**Later sinks (not built — price in replay-units):**

1. Diamonds → coins (keep dear so ◆ stay better on speed-ups).
2. Soft sinks: dress-up, slots, packs (e.g. 5–10 replays).
3. Hard acquire: rewards / IAP. Until then, **debug only**.

### XP thresholds (lessons only)

| Lv | XP | Label |
|---|---|---|
| 1 | 0 | Apprentice Baker |
| 2 | 75 | Pastry Student |
| 3 | 200 | Line Cook |
| 4 | 400 | Sous Chef |
| 5 | 700 | Head Patissier |
| 6 | 1100 | Master Baker |

~60 XP per first-clear session → level 2 in one sitting is possible. Wallet size does not gate level.

---

## Invariants

1. **Coins come from pastry sales** (Cafe Counter). Not from quiz hits or lesson-complete.
2. **Counter quiz does not double-pay** — the sale payout is the only coin reward for that interaction.
3. **XP comes from lessons** (quiz / first-learn / complete). Not from sales.
4. **XP ≠ wallet.** Spending never de-levels.
5. **Diamonds skip set time only**, not the quiz and not the replay fee.
6. **`COUNTER_BASE_PAYOUT === LESSON_REPLAY_COST`.**
7. **First clear of a lesson id is free.**
8. **One soft + one hard.** No energy/stars without updating this doc + icebox.

---

## Risks / watch

| Risk | Signal | Likely fix |
|---|---|---|
| Players skip Cafe Counter | Coin starvation after starter burns | Stronger hub copy; soft-gate Bake when case has ready cakes |
| Long set timers + no ◆ | Drop-off before first sale | Keep common set short; starter ◆ generous |
| XP too slow without coin dual-dip | Level 2 feels far | Bump `LESSON_COMPLETE_XP` slightly, not coin awards |
| Starter 150 too high | No sell pressure | Lower after playtest |

---

## Tuning checklist

1. Change constants in `economy.js` (or recipe `tipMultiplier` / `setMinutes`).
2. Recompute replay-units above.
3. Log in `PAST/changelog.md`; philosophy → `PAST/decision-log.md`.
4. Play: first-run → sell → paid replay → sell → confirm wallet only moves on sales.

---

## Related

- Decision: `PAST/decision-log.md` D-010, D-009
- Feel: `CREATIVE/player-feel.md`
- Cakes: `Gateaux/docs/CAKE_DESIGN.md`
