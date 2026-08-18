# Gateaux - Art Planning Document

## Visual Style Guide

### Overall Aesthetic
- **Style**: Hand-drawn, warm, cozy French patisserie, in the style of Foster's home for imaginary friends.
- **Color Palette**: 
  - Primary: Warm browns (#8B4513, #D2691E)
  - Secondary: Cream/Beige (#F5F5DC, #FFF8DC)
  - Accents: Pastel pink (#FFB6C1), Mint (#98FB98), Soft yellow (#FFFACD)
- **Line Work**: Soft, rounded edges with slight imperfections for hand-drawn feel
- **Lighting**: Warm, golden hour lighting throughout

## Core Visual Assets

### 1. Display Case System

#### The Display Case (Centerpiece)
- **Size**: 800x600px (2x: 1600x1200px)
- **Style**: Elegant glass case with brass/gold trim
- **Shelves**: 5 levels (one per language)
- **Details**: 
  - Soft reflections on glass
  - Warm interior lighting
  - Price tags and labels
  - Slight condensation effect

#### Cake Sprites (Per Language)

**Spanish - Tres Leches**
- `tres_leches_fresh.png` - 120x80px (2x: 240x160px)
- `tres_leches_day_old.png` - 120x80px (slightly less vibrant)
- `tres_leches_stale.png` - 120x80px (needs replacing)
- **Visual**: White layered cake, milk dripping, cinnamon dust

**French - Éclair**
- `eclair_fresh.png` - 120x80px (2x: 240x160px)
- `eclair_day_old.png` - 120x80px
- `eclair_stale.png` - 120x80px
- **Visual**: Glossy chocolate top, cream visible at ends

**Italian - Tiramisu**
- `tiramisu_fresh.png` - 120x80px (2x: 240x160px)
- `tiramisu_day_old.png` - 120x80px
- `tiramisu_stale.png` - 120x80px
- **Visual**: Cocoa powder dusting, layered mascarpone

**German - Black Forest**
- `black_forest_fresh.png` - 120x80px (2x: 240x160px)
- `black_forest_day_old.png` - 120x80px
- `black_forest_stale.png` - 120x80px
- **Visual**: Chocolate layers, cherries, whipped cream

**Japanese - Matcha Roll**
- `matcha_roll_fresh.png` - 120x80px (2x: 240x160px)
- `matcha_roll_day_old.png` - 120x80px
- `matcha_roll_stale.png` - 120x80px
- **Visual**: Green tea spiral, white cream center

### 2. Customer Characters

#### Base Character Sprites
**Size**: 150x200px (2x: 300x400px)

**Spanish Customers**
- `spanish_bull_casual.png` - Friendly bull in casual wear
- `spanish_dancer_elegant.png` - Flamenco dancer rabbit
- `spanish_tourist_happy.png` - Happy bear with camera

**French Customers**
- `french_cat_chic.png` - Chic cat with beret
- `french_rabbit_artist.png` - Artist rabbit with scarf
- `french_mouse_chef.png` - Mouse in chef's hat

#### Emotion Variations
For each character: `_happy`, `_waiting`, `_disappointed`
- Total: 18 character emotion sprites

### 3. Café Environment

#### Background Elements
- `cafe_interior_main.png` - 1200x800px (2x: 2400x1600px)
  - Warm wood paneling
  - Vintage French posters
  - Cozy lighting fixtures
  
- `cafe_counter.png` - 600x300px (2x: 1200x600px)
  - Marble or wood top
  - Cash register
  - Coffee machine in background

#### Decorative Elements
- `potted_plant_1.png` - 80x120px
- `potted_plant_2.png` - 80x120px
- `wall_clock.png` - 100x100px
- `menu_board.png` - 200x300px
- `vintage_poster_1.png` - 150x200px
- `vintage_poster_2.png` - 150x200px

### 4. UI Elements

#### Buttons & Controls
- `button_normal.png` - 200x60px (9-slice)
- `button_hover.png` - 200x60px (9-slice)
- `button_pressed.png` - 200x60px (9-slice)
- `button_disabled.png` - 200x60px (9-slice)

#### Side Panel Elements
- `lesson_panel_bg.png` - 400x600px (9-slice)
- `lesson_progress_bar_empty.png` - 300x30px
- `lesson_progress_bar_fill.png` - 300x30px
- `lesson_complete_badge.png` - 80x80px

#### Icons
- `icon_tips_coin.png` - 32x32px (64x64px)
- `icon_clock.png` - 32x32px
- `icon_checkmark.png` - 32x32px
- `icon_warning.png` - 32x32px
- `icon_star.png` - 32x32px

### 5. Minigame Assets

#### Cake Decoration Game
- `frosting_bag.png` - 100x150px
- `decoration_swirl_1-5.png` - 60x60px each
- `cake_base_plain.png` - 200x150px
- `cake_decorated_stages_1-5.png` - 200x150px each

#### Recipe Card Game
- `recipe_card_bg.png` - 150x200px
- `recipe_card_selected.png` - 150x200px
- `card_flip_animation_1-6.png` - 150x200px (sprite sheet)

#### Order Ticket Game
- `order_ticket.png` - 200x100px
- `ticket_holder.png` - 250x400px
- `ticket_correct.png` - 200x100px (green tint)
- `ticket_incorrect.png` - 200x100px (red tint)

### 6. Effects & Animations

#### Particle Effects
- `sparkle_1-4.png` - 32x32px (rotating sparkles)
- `steam_1-6.png` - 64x64px (coffee steam animation)
- `coin_spin_1-8.png` - 32x32px (tip animation)

#### Transition Effects
- `cake_appear_poof_1-8.png` - 150x150px
- `customer_enter_1-6.png` - transition frames
- `panel_slide_shadow.png` - 50x600px

## Asset Production Guidelines

### File Naming Convention
```
[category]_[item]_[variant]_[state].png
Examples:
- cake_tres_leches_fresh.png
- customer_spanish_bull_happy.png
- ui_button_normal.png
```

### Color Specifications
- Always work in sRGB color space
- Export with embedded color profile
- Maintain consistent lighting angle (top-left, 45°)

### Resolution Guidelines
- Create all assets at 2x resolution
- Scale down for 1x with bicubic resampling
- Maintain pixel-perfect alignment for UI elements

### Sprite Optimization
- Use PNG-8 where possible (UI elements)
- PNG-24 for complex illustrations
- Compress with tools like TinyPNG
- Target <100KB per sprite

## Animation Specifications

### Character Animations
- **Idle**: 2-3 frame subtle breathing/blinking
- **Happy**: 4-6 frame celebration
- **Disappointed**: 3-4 frame sad reaction
- **Frame Rate**: 12 FPS for all animations

### UI Animations
- **Button Press**: 3 frames (normal → pressed → normal)
- **Panel Slide**: CSS transition (no sprites needed)
- **Progress Bar**: Smooth fill (CSS animation)

### Effect Animations
- **Sparkles**: 4 frame loop
- **Steam**: 6 frame loop with fade
- **Coin Spin**: 8 frame full rotation

## Batch Creation List for Nano Banana

### Priority 1 (Core Gameplay)
1. Display case structure - 800x600px
2. All 5 cake types (3 states each) - 120x80px each
3. 3 customer characters (3 emotions each) - 150x200px each
4. Café interior background - 1200x800px

### Priority 2 (UI/UX)
1. UI buttons (4 states) - 200x60px
2. Side panel background - 400x600px
3. Progress indicators - various sizes
4. Basic icons set - 32x32px

### Priority 3 (Polish)
1. Decorative elements - various sizes
2. Particle effects - 32x32px to 64x64px
3. Additional customer variants
4. Seasonal cake variants

## Prompt Templates for Nano Banana

### Display Case
```
"Elegant French patisserie display case, glass front with brass trim, 5 wooden shelves, 
warm interior lighting, soft reflections, cozy bakery style, hand-drawn illustration, 
warm color palette with browns and creams"
```

### Cakes
```
"[Cake type] on small decorative plate, French patisserie style, hand-drawn illustration, 
warm lighting, appetizing appearance, [specific details for each cake], 
soft shadows, 3/4 view angle"
```

### Characters
```
"Cute [animal] character dressed as [nationality] customer, anthropomorphic, 
friendly expression, café setting appropriate, hand-drawn style, warm colors, 
full body standing pose, simple clothing"
```

## File Structure
```
assets/
├── display_case/
│   ├── case_structure.png
│   └── shelves/
├── cakes/
│   ├── spanish/
│   ├── french/
│   └── [other languages]/
├── characters/
│   ├── spanish/
│   ├── french/
│   └── [other languages]/
├── ui/
│   ├── buttons/
│   ├── panels/
│   └── icons/
├── environment/
│   ├── backgrounds/
│   └── decorations/
├── minigames/
│   ├── decoration/
│   ├── recipe_cards/
│   └── order_tickets/
└── effects/
    ├── particles/
    └── animations/
```

---

*This document serves as the complete visual asset guide for Gateaux development.*
