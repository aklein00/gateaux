# Gateaux - Production Milestones

**Project Status:** Alpha (Playable Vertical Slice)
**Last Updated:** 2026-02-08
**Target Platform:** Web (HTML5) via Venus/run.game
**Languages:** Spanish & French (MVP)
**Dev Server:** localhost:8081

---

## Overall Progress: ~35%

### Quick Status
- Foundation & Architecture -- 90% complete
- Visual Assets -- 40% complete
- Core Gameplay (Quiz System) -- 70% complete
- Content & Language Data -- 15% complete (70 phrases hardcoded, AI planned)
- Game Mechanics (Difficulty) -- 30% complete (leveling + recipe system implemented)
- Leveling & Recipe System -- 80% complete (code done, needs art + testing)
- UI/UX Polish -- 50% complete
- Audio -- 0% complete
- AI Integration -- 10% complete (module exists, not wired in)
- Deployment -- 0% complete

---

## Milestone 1: Foundation -- COMPLETE

- [x] Project structure, GDD, character docs, art planning
- [x] Core modules: gameState, displayCase, lessonManager, customerService, venusIntegration
- [x] localStorage persistence
- [x] Per-cake decay timers (individual countdown per cake)
- [x] Vite build system on port 8081
- [x] Venus SDK integration (lifecycle hooks, audio unlock, haptics ready)
- [x] AI chat module wrapper (aiChat.js using Venus SDK)

---

## Milestone 2: Visual Assets -- 40% COMPLETE

### Done
- [x] Splash screen (layered: background + characters + logo)
- [x] 5 main cast neutral portraits (amelie, marcel, cafe, bisou, gaston)
- [x] 5 customer bust portraits (tourist, hipster, business, love_struck, foodie)
- [x] 2 cake images (tres_leches_fresh, eclair_fresh)
- [x] UI icons (coin, clock, warning, error)
- [x] Transparent logo
- [x] Wallpaper background texture
- [x] Placeholder system (canvas-generated gray squares for missing images)

### Remaining
- [ ] Character expression variants (happy/concerned for each cat)
- [ ] Cake freshness variants (day_old, stale states)
- [ ] Additional cake types art (churros, croissant, flan, mille-feuille)
- [ ] Display case structure asset
- [ ] UI buttons/panels artwork

---

## Milestone 3: Core Gameplay -- 85% COMPLETE

### Done
- [x] Full-screen Duolingo-style quiz overlay
- [x] Two alternating question modes (native-to-English, English-to-native)
- [x] Correct answer: confetti celebration + auto-advance
- [x] Wrong answer: slide-up modal with explanation + retry
- [x] Lesson selection with Duolingo path layout (circular portrait nodes)
- [x] Region selector (France/Quebec, Spain/Mexico/Argentina flags)
- [x] Per-cake display case with individual decay timers
- [x] Customer service counter (appears when cakes exist)
- [x] Welcome banner with contextual guidance
- [x] Difficulty-sorted lessons (Beginner/Elementary/Intermediate badges)
- [x] Timer pressure on quiz questions (15s/12s/8s by difficulty)
- [x] Streak multiplier system (2x/3x/5x with visual effects)
- [x] Leveling system (tips = XP, 6 levels, level-up celebration)
- [x] Cake recipe unlock progression (12 cakes, 5 teachers, rarity tiers)
- [x] Recipe Book overlay with cake details and "Bake This" flow
- [x] Recipe Picker (choose cake before lesson, filtered by teacher)
- [x] Per-recipe decay rates (3h-10h based on rarity)
- [x] Tip multiplier from cake rarity on customer sales
- [x] Cake preview on quiz screen below teacher portrait

### Remaining
- [ ] Daily Brew challenge (Phase 2)
- [ ] Customer difficulty scaling (Phase 3)
- [ ] AI-generated lessons for difficulty 3+ (Phase 3)
- [ ] Smarter AI wrong answers (Phase 3)

---

## Milestone 4: Content & Language Data -- 15% COMPLETE

### Done
- [x] 70 phrases (35 French + 35 Spanish) across 7 categories
- [x] Wrong answers for all 70 phrases (wrong_answers_en + wrong_answers_native)
- [x] Difficulty levels assigned to categories (1-3)
- [x] Edgy character-voiced context descriptions for all non-Amelie phrases
- [x] Region metadata in phrases.json

### Remaining
- [ ] Expand to ~100 phrases per language (AI can generate)
- [ ] Regional phrase variants (Parisian vs Quebecois, Spain vs Mexico vs Argentina)
- [ ] Longer phrases for intermediate/advanced lessons
- [ ] Customer scenario dialogue for cafe counter

---

## Milestone 5: Game Mechanics -- 60% COMPLETE

### Phase 1: Quick Wins -- COMPLETE
- [x] Quiz timer (15s/12s/8s by difficulty, circular ring on portrait)
- [x] Streak multiplier (1x/2x/3x/5x based on consecutive correct)
- [x] Visual streak effects (glow at 3+, fire at 5+)

### Phase 2: Leveling & Recipe System -- COMPLETE
- [x] Tips as level progression (6 levels, cumulative lifetime tips)
- [x] Level indicator in stat bar with progress bar
- [x] 12 cake recipes (5 per language + 1 legendary each) -- see CAKE_DESIGN.md
- [x] Recipe Book overlay (grid, detail popup, descriptions, AI effects)
- [x] Recipe Picker screen (choose cake before lesson)
- [x] Per-recipe variable decay (3h common to 10h legendary)
- [x] Tip multiplier from cake rarity (1x to 3x)
- [x] Cake preview on quiz screen
- [x] Level-up celebration overlay
- [x] Baked-cake tracking in gameState
- [x] Backward compatibility for existing saves

### Phase 3: Retention Hooks
- [ ] Daily Brew challenge (mixed lesson, bonus rewards, daily streak)

### Phase 4: Depth (After AI)
- [ ] AI-generated lessons for intermediate/advanced (legendary cakes)
- [ ] Smarter AI wrong answers (false friends, similar sounds)
- [ ] Customer difficulty scaling (formality matching, multi-part orders)

---

## Milestone 6: UI/UX Polish -- 50% COMPLETE

### Done
- [x] Wallpaper background texture
- [x] Compact stat bar + centered logo header
- [x] Vertical language cards with cake images
- [x] No-scroll quiz screen (Duolingo-style)
- [x] Mobile-responsive layout
- [x] No emojis in UI
- [x] No overlapping elements

### Remaining
- [ ] Sound effects (correct/wrong/complete)
- [ ] Background music with mute toggle
- [ ] Tutorial/onboarding overlay for first-time users
- [ ] Settings screen
- [ ] Smooth page transitions/animations

---

## Milestone 7: Audio -- NOT STARTED
- [ ] Sound effects (correct ding, wrong buzz, lesson complete fanfare)
- [ ] Background cafe ambiance music
- [ ] Mute toggle in header
- [ ] AI-generated voice pronunciation (future)

---

## Milestone 8: AI Integration -- 10% COMPLETE
- [x] aiChat.js module (Venus SDK wrapper)
- [x] requestChat(), getPhraseHint(), getCustomerDialogue() functions
- [ ] generateLesson() for difficulty 3+ categories
- [ ] Wire into lessonManager for intermediate/advanced lessons
- [ ] Loading spinner during AI generation
- [ ] Cache AI results in localStorage
- [ ] Fallback to hardcoded phrases when AI unavailable

---

## Milestone 9: Testing & Optimization -- NOT STARTED
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile device testing (iPhone SE, iPhone 12, Android)
- [ ] Performance profiling (60fps target)
- [ ] Asset compression
- [ ] Venus storage sync (replace localStorage)

---

## Milestone 10: Deployment -- NOT STARTED
- [ ] Venus publish (unlisted)
- [ ] QA testing on Venus app
- [ ] Ad integration (rewarded ads for hints?)
- [ ] Analytics setup
- [ ] Venus publish (public)

---

## Change Log
- 2026-02-08: Implemented leveling system + recipe book. 12 cakes defined (CAKE_DESIGN.md), 6 player levels, recipe picker flow, recipe book overlay, per-recipe decay, tip multipliers. Milestone 5 Phase 1+2 complete. Timer/streak marked done in M3.
- 2026-02-08: Major update -- reflected actual build state (~35%), added game mechanics milestones (timer, streaks, daily brew, XP, customer scaling, cake unlocks), reorganized into 10 milestones
- 2026-01-29: Initial milestone document created
