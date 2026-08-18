# Decision log

Write a row when we choose something that future-us will otherwise re-argue. Newest first.

Format: **Decision → Context → Choice → Consequence → Revisit when.**

---

## D-008 — Local slang is Option B, later (2026-08-17)

**Context.** Wish: auto-pick ~50 places Americans travel, generate a slang database, use a fast model for conversation. Duolingo stays fast by generating offline and serving static quizzes. Gateaux already has unused region metadata and eight slang lines.

**Choice.** Skip for now. When we do slang packs, ship **Option B**: country default plus ~8 French/Spanish city packs, cheap-model drafts, human edit, static `phrases.json`. Not Option C (50 world destinations + live chat).

**Consequence.** First-run stays language-only. No flag picker. Live LLM stays garnish. Third languages stay off the roadmap.

**Revisit when.** A stranger finishes one Marcel lesson, and Next (tap-to-commit / VO) is done or parked. Ticket: backlog P2-2.

---

## D-007 — Pivot feel toward colloquial Duolingo (2026-08-14)

**Context.** The GDD already wanted “practical AND fun.” The live game leads with formal greetings, a five-tap path to the first question, and a timer on every item. It feels like a systems demo, not a five-minute language snack.

**Choice.** For the next stretch of work, *feel* beats *features*. First session goes to a question fast. Marcel-voice content leads. Timer is not the default. UI copy talks like a café, not a textbook.

**Consequence.** Recipe rarity, café customization, extra languages, and AI tutor chat are deferred until the core lesson is charming.

**Revisit when.** A stranger can finish one lesson, smile, and know what to do next.

---

## D-006 — Full-screen lessons, not a side panel (implemented)

**Context.** GDD described a side panel so the café stayed visible. Duolingo-style focus wants the opposite: one task, full screen.

**Choice.** Full-screen overlay. Café is the hub; lessons are a mode.

**Consequence.** Hub and lesson are two games that do not talk much. That is fine if the hub is a rest screen. It is a problem if the hub is another menu.

**Revisit when.** We add a “back to café” moment that actually uses a phrase you just learned.

---

## D-005 — Multiple choice only (implemented, against GDD)

**Context.** GDD and README promised matching, listening, fill-in-the-blank, cake-decoration minigames.

**Choice.** Ship one quiz type and make it solid (options, timer, streak, feedback).

**Consequence.** Learning is a translation exam. Character voice only shows up on wrong answers. This is the main feel gap.

**Revisit when.** Default lesson is fun. Then add *one* second type (listen-first), not three.

---

## D-004 — Timer on every question (implemented)

**Context.** Streaks and juice feel good. Timed challenges are a Duo *mode*, not the default lesson.

**Choice.** 15 / 12 / 8 second rings by difficulty.

**Consequence.** Pressure reads as quiz-show, not café. Wrong-because-slow is punishing for a language beginner.

**Revisit when.** D-007 ships. Timer becomes an optional “Rush Hour” lesson, taught by Café.

---

## D-003 — Formal greetings as lesson one (content)

**Context.** Amélie is the elegant mentor. Curriculum starts where a textbook would.

**Choice.** `greetings_formal` is difficulty 1 and first in the list.

**Consequence.** First five phrases are “How may I help you?” / “Que désirez-vous?” Players who wanted slang wait. Marcel’s best lines are buried.

**Revisit when.** We reorder so session one is Marcel: Salut, Ça va, Merci, Un café, Comme d’hab.

---

## D-002 — Venus as publish / AI host

**Context.** HTML5 game needs a store path. Venus SDK is already in the repo.

**Choice.** Build with Vite, publish with Venus. Optional AI only for wrong-answer color.

**Consequence.** Offline static copy still has to work. AI is garnish, not the lesson.

**Revisit when.** Core loop is fun without network.

---

## D-001 — Café + cakes as the metaphor (GDD)

**Context.** Language apps are a graveyard of identical skill trees.

**Choice.** Lessons bake cakes. Cakes stock a case. Customers buy them. Teachers are cats.

**Consequence.** Unique and sticky *if* the metaphor serves learning. Dangerous if collection/rarity/decay outrun the phrases.

**Revisit when.** We catch ourselves adding a system before adding a joke.
