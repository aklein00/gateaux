# Economy

Living balance sheet for Gateaux. Code constants live in `Gateaux/src/js/economy.js`. If this doc and the file disagree, **fix the file**, then fix the doc.

**Last updated:** 2026-08-20 (D-010)

---

## Three meters (do not conflate)

| Meter | Player-facing | Spendable? | Role |
|---|---|---|---|
| **Coins** | Yellow coin | Yes | Soft wallet. Buy another bake (replay), later soft sinks. |
| **Diamonds** | Pink diamond | Yes | Hard wallet. Skip cake *set* wait. Debug grant only until store. |
| **XP** | Level bar | **No** | Progression. Unlocks recipes by level. |

Earning from quiz / lesson complete / Cafe Counter calls `awardEarnings(n)` → **+n coins and +n XP**. Spending coins or diamonds never reduces XP or level.

---

## Unit of account: one replay = 12 coins

`LESSON_REPLAY_COST = 12` is the economy’s yardstick.

Everything soft should answer: *“How many extra bakes is this worth?”*

| Thing | Value | In replay-units |
|---|---|---|
| Replay a cleared lesson | **−12 coins** | −1 bake |
| Common pastry sold at counter | **+12 coins** (`1.0×`) | +1 bake |
| Uncommon sold | **+18** (`1.5×`) | +1.5 |
| Rare sold | **+24** (`2.0×`) | +2 |
| Legendary sold | **+36** (`3.0×`) | +3 |
| Lesson complete bonus | **+25** | ~2 bakes |
| Quiz hit (1× streak) | **+2** | ~⅙ bake |
| First time learning a phrase | **+5** (once) | ~⅖ bake |

**Knock-on for pastries:** `tipMultiplier` is not flavor text — it is **how many lesson replays one successful Cafe Counter sale refunds**. Keep multipliers on that mental model when adding cakes later.

`COUNTER_BASE_PAYOUT` is locked to `LESSON_REPLAY_COST` in code so common sell ↔ one replay stays true if we retune the 12.

---

## Core loops (money flow)

```
First clear (free)
  → quiz earnings + lesson bonus + XP
  → cake enters case (sets)
  → [optional: diamonds skip set]
  → Cafe Counter quiz → pastry payout (coins + XP)
  → cake removed

Replay / extra bake (−12 coins to start)
  → same as above
  → net should stay positive if you finish and sell
```

Cafe Counter is **always** required to monetize a ready cake. Diamonds only buy *time*, not a skip of the language beat.

---

## Session math (targets, not guarantees)

Assumes ~5 phrases / lesson, mostly 1× streak, common pastry.

### First clear of a new lesson (cost 0)

| Step | Coins (approx.) |
|---|---|
| 5× quiz @ 2 | +10 |
| 5× first-learn @ 5 | +25 |
| Lesson complete | +25 |
| Counter sell (common) | +12 |
| **Session total** | **~+72** |
| XP | same ~72 toward level |

### Replay to bake another common (cost 12)

| Step | Coins (approx.) |
|---|---|
| Start replay | −12 |
| 5× quiz @ 2 (phrases already known) | +10 |
| Lesson complete | +25 |
| Counter sell (common) | +12 |
| **Net** | **~+35** |

So: **learning pays**; **selling refunds the bake fee** on commons and profits on higher rarities. Spam-baking without selling still drains coins (you paid 12 and only got quiz+complete ≈ 35 before sell — still net positive today because complete bonus is fat; see “Risks”).

### Streaks (quiz only)

| Streak | Mult | Per-hit coins |
|---|---|---|
| 1–2 | 1× | 2 |
| 3–4 | 2× | 4 |
| 5–7 | 3× | 6 |
| 8+ | 5× | 10 |

Streaks accelerate XP/coins but do not change pastry pricing.

---

## Early game (L1–L2) — should feel generous

| Lever | Value | Why |
|---|---|---|
| Starter coins | 150 | ≈ 12 replays of runway; enough to test doober + replays |
| Starter diamonds | 30 | Several common/uncommon speed-ups |
| First clear | Free | Protects “question in ~15s” feel |
| Common set time | 2 min (first cake 45s) | Short wait; 1◆ to skip |
| Common sell | = 1 replay | Clear cause→effect |

Player can burn starter coins on replays without touching diamonds. Diamonds are optional impatience.

---

## Mid / late game — same formulas, different multipliers

| Rarity | Set wait | Speed-up ◆ | tipMultiplier | Sell (coins) | Replays funded |
|---|---|---|---|---|---|
| Common | 2 min | 1 | 1.0 | 12 | 1 |
| Uncommon | 20 min | 2 | 1.5 | 18 | 1.5 |
| Rare | 4 h | 5 | 2.0 | 24 | 2 |
| Legendary | 4 h | 5 | 3.0 | 36 | 3 |

**Later-game sinks (not built yet — reserve against this sheet):**

1. Diamonds → buy coins (store rate TBD; suggest dear: e.g. 1◆ → fewer than one replay’s coins so speed-up stays the better diamond use).
2. Soft sinks beyond replay: café dress-up, recipe slots, region packs (backlog). Price in replay-units (e.g. a cosmetic = 5–10 replays).
3. Hard acquire: rewarded moments / IAP. Until then, **debug only**.

**Do not** invent a third soft currency. Scale with `LESSON_REPLAY_COST`, multipliers, and XP thresholds.

### XP thresholds (unchanged numerically; unit is XP not “tips”)

| Lv | XP | Label | Cake tier unlocked |
|---|---|---|---|
| 1 | 0 | Apprentice Baker | Common (Marcel path) |
| 2 | 75 | Pastry Student | Common (Amélie) |
| 3 | 200 | Line Cook | Uncommon |
| 4 | 400 | Sous Chef | Rare |
| 5 | 700 | Head Patissier | Rare |
| 6 | 1100 | Master Baker | Legendary |

Roughly one solid first-clear session ≈ 70 XP → level 2 in one sitting is possible; level 6 is many sessions. Wallet size does not gate level.

---

## Invariants (break these = rebalance ticket)

1. **XP ≠ wallet.** Spending must not de-level.
2. **Counter quiz required to sell.** No instant convert cake→coins.
3. **Diamonds skip set time only**, not the quiz and not the replay fee.
4. **`COUNTER_BASE_PAYOUT === LESSON_REPLAY_COST`.** Common pastry ↔ one extra bake.
5. **First clear of a lesson id is free.** Retunes must not charge the onboarding path.
6. **One soft + one hard.** No energy/stars unless this doc and the icebox are updated together.

---

## Risks / watch in playtest

| Risk | Signal | Likely fix |
|---|---|---|
| Complete bonus (25) too fat vs replay (12) | Infinite profitable grind without caring about sell | Lower `LESSON_COMPLETE_BONUS` toward 12–15, or charge a small fee on *every* bake after N free / day |
| Players ignore Cafe Counter | Case full, coins from lessons only | Soft-gate “Bake” when case near full, or move more of the payout into the counter |
| Diamond skip feels required | Anger at 20m/4h sets | Keep free wait; ensure ◆ costs stay low bands; never gate content behind skip |
| Starter 150 too high | No coin tension for days | Drop starter after playtest; keep replay=12 |
| Replay blocks “one more” feel | Drop-off after first clear | First daily replay free, or first replay of each recipe free |

---

## Tuning checklist (when changing a number)

1. Change the constant in `economy.js` (or recipe `tipMultiplier` / `setMinutes`).
2. Recompute the “replay-units” column above.
3. Note the change in `PAST/changelog.md` and, if philosophical, `PAST/decision-log.md`.
4. Play: first-run → one sell → one paid replay → one ◆ speed-up.

---

## Related

- Decision: `PAST/decision-log.md` D-010 (coins / diamonds / XP), D-009 (set timers)
- Feel constraints: `CREATIVE/player-feel.md` (don’t let economy outrun the joke)
- Cake roster: `Gateaux/docs/CAKE_DESIGN.md` (multipliers; currency section superseded by this doc)
