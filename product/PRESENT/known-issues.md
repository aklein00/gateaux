# Known issues

Bugs and product holes. Feel problems live in `status.md`; this is the working list.

## Blocks the “light Duolingo” feel

| ID | Issue | Status |
|---|---|---|
| K-01 | First session is five taps + a tutorial wall | Fixed — Start + language |
| K-02 | Timer on every question | Fixed — off by default |
| K-03 | Correct feedback is generic “Correct!” | Fixed — teacher lines |
| K-04 | Formal greetings sort first | Fixed — casual / slang lead |
| K-05 | Marcel recipes unlock at level 2 | Fixed — level 1 |
| K-06 | Tutorial is four system bullets | Fixed — Marcel one-liner + language pick |
| K-07 | CHECK is an extra confirm tap | Softened copy; tap-to-commit still Next (P1-4) |
| K-08 | Customers show English first | Fixed — native + hint |
| K-09 | Only one exercise type | Fixed — listen-first added |

## Broken or hollow vs what the UI claims

| ID | Issue | Where |
|---|---|---|
| K-10 | Milestone chests do nothing | Removed |
| K-11 | Region flags never appear | `renderRegionSelector` still empty on purpose |
| K-12 | Welcome banner IDs are missing in HTML | Fixed |
| K-13 | Language cards say “Loading...” until JS fills stock | Fixed — “Bake one” |
| K-14 | Customer types in JSON unused | `phrases.json` vs `customerService.js` |
| K-15 | README still lists matching / listening / fill-blank | `README.md` |
| K-16 | Café customization never surfaces | `gameState.cafe` |
| K-17 | Play button audio is TTS placeholder, not recorded VO | `playCustomerAudio` |

## Technical debt (do not lead with these)

| ID | Issue | Notes |
|---|---|---|
| K-18 | Tips duplicated per language, then read from the first key | Shared currency modeled twice |
| K-19 | `totalLessons = 5` hardcoded on cards | Progress math is fake |
| K-20 | Image paths split between `assets/` and `../../public/assets/` | Easy to break in build |
| K-21 | AI correction is fire-and-forget; static text is the real product | Keep it that way until feel is done |
| K-22 | Decay check is every 60s in-session, GDD said 4–8 hours | Idle-game fantasy vs actual timer |

## Won’t-fix for now

- Extra languages (Italian, German, Japanese) — GDD fantasy, not this quarter.
- Voice input — explicitly out of scope since GDD v2.
- Perfect art consistency — track in art docs, not this list.
