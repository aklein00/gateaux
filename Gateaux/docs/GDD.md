# Gateaux - Game Design Document (v2.0)

## Game Overview

**Title:** Gateaux  
**Genre:** Educational Language Learning / Café Management Sim  
**Platform:** Web (HTML5)  
**Target Audience:** Young adults, travelers, language learners who want practical AND fun phrases  
**Development Time:** 3-6 months  

## Core Concept

You run a quirky patisserie staffed by five memorable cats, each with their own personality. These cats teach you everything from polite greetings to playful street slang. To keep your café stocked and customers happy, you must complete language lessons to "bake" new cakes. Each completed lesson adds a fresh cake to your display case, but cakes are purchased by customers over time, requiring you to maintain your stock through continued learning.

The twist? Your customers are real characters - some want formal service, others appreciate a witty comeback. Learning when to be polite and when to be playfully sassy is part of mastering a language!

## The Meta-Game Loop

### 1. The Display Case System
- **Visual Center**: Your café has a beautiful display case showing all your cakes
- **Each Language = Cake Type**: Spanish = Tres Leches, French = Croissant, etc.
- **Stock Management**: Complete lessons to add cakes to the display
- **Customer Purchases**: Cakes disappear over time as customers buy them

### 2. Cake Decay Mechanics
- **Purchase Rate**: 1-2 cakes are "bought" every 4-8 hours
- **Visual Feedback**: Display case slowly empties, creating urgency
- **Language Balance**: Popular languages (Spanish) sell faster than others
- **Minimum Stock**: Warning when a language section is nearly empty

### 3. Lesson Structure
- **Lesson = Baking a Cake**: Each lesson completion adds one cake
- **5-10 Phrases per Lesson**: Focused, bite-sized learning
- **Quick Sessions**: 2-3 minutes per lesson
- **Side Panel Learning**: Lessons appear in a dedicated panel, not full-screen

## Core Gameplay Loop

### Phase 1: Check Your Café
- Open game to see your display case status
- Visual indicators show which cakes are low
- Customers waiting indicate demand

### Phase 2: Bake Cakes (Learn)
- Select a language/cake type that needs restocking
- Side panel opens with lesson content
- **NEW: Customer-Driven Learning**
  - A customer appears with a specific request/situation
  - Player must choose which cat character would best handle this customer
  - Learn phrases appropriate to that interaction style
  - Practice through contextual minigames
- Complete lesson = fresh cake added to display

### Phase 3: Serve Customers
- Customers speak in their native language (audio only from NPCs)
- Read the customer's mood and choose appropriate response:
  - Elderly tourist? Use Amélie's formal phrases
  - Young local? Marcel's slang gets better tips
  - Grumpy customer? Gaston's sarcasm might work!
- Match phrase style to customer type for bonus tips
- Wrong tone = awkward interaction (but often funny!)
- Failed service = customer leaves, potential cake waste

## Simplified Audio System
- **NPC Audio Only**: Customers speak with native pronunciation
- **No Voice Recognition**: Players select written responses
- **Audio Cues**: Pleasant sounds for correct/incorrect answers
- **Ambient Café Sounds**: Background atmosphere

## Visual Minigames (Lesson Activities)

### 1. Cake Decoration Matching
- Match phrase "decorations" to complete a cake
- Drag frosting patterns that represent phrases
- Visual metaphor: building language like decorating a cake

### 2. Recipe Card Arrangement
- Arrange "recipe cards" in correct order
- Each card has a phrase component
- Complete recipe = complete phrase

### 3. Customer Order Tickets
- Match order tickets to correct phrases
- Visual representation of real café scenarios
- Time pressure adds gentle challenge

## The Display Case

### Visual Design
- **Beautiful Glass Case**: Central focus of the café
- **Multiple Shelves**: One per language
- **Cake Varieties**: Each cake type reflects its culture
- **Stock Indicators**: Visual warnings when low

### Cake Types by Language
- **Spanish**: Tres Leches (white, layered)
- **French**: Éclair (elegant, chocolate-topped)
- **Italian**: Tiramisu (coffee-dusted layers)
- **German**: Black Forest (cherries and cream)
- **Japanese**: Matcha Roll (green tea spiral)

## Progression & Retention

### Daily Engagement
- **Morning Check**: See overnight cake sales
- **Quick Restocking**: 2-3 lessons to refill
- **Evening Prep**: Stock up before bed

### Weekly Goals
- **Full Display Bonus**: Keep all shelves stocked for rewards
- **Special Orders**: Weekly challenges for rare cakes
- **Café Upgrades**: Earn decorations and improvements

### Long-term Progression
- **Café Expansion**: Unlock new display cases
- **Rare Recipes**: Advanced phrases unlock special cakes
- **Seasonal Events**: Holiday-themed cakes and phrases

## User Interface

### Main Screen Layout
```
+------------------------+
|    Display Case        |
|  [Cakes Arranged]      |
|                        |
+------------------------+
|  Customer Area  | Side |
|  [Waiting NPCs] | Panel|
|                 |      |
+-----------------+------+
```

### Side Panel (Lesson Area)
- **Slides in from right**: Doesn't obscure café view
- **Lesson Progress Bar**: Shows phrases completed
- **Current Phrase Display**: Large, clear text
- **Minigame Area**: Compact, focused activities

## Language Content Structure

### Lesson Categories (Per Language)

#### Formal Lessons (Taught by Amélie)
1. **Polite Greetings** (3 lessons)
2. **Formal Café Orders** (4 lessons)
3. **Respectful Directions** (3 lessons)

#### Street Smart Lessons (Taught by Marcel)
1. **Casual Greetings & Slang** (3 lessons)
2. **Local Food Terms** (4 lessons)
3. **Street Directions** (3 lessons)

#### Specialty Lessons
1. **Coffee Complaints** (Taught by Café) (3 lessons)
2. **Flirting & Compliments** (Taught by Bisou) (3 lessons)
3. **Witty Comebacks** (Taught by Gaston) (3 lessons)

#### Regional Variations
- **Parisian French vs. Québécois Slang**
- **Madrid Spanish vs. Mexican Street Talk**
- Each region has unique expressions and attitudes

### Phrases per Lesson
- **Formal Lessons**: 5-7 phrases (proper and clear)
- **Slang Lessons**: 5-7 phrases (casual and fun)
- **Specialty Lessons**: 8-10 phrases (situational humor)

### Example Phrase Pairs (Formal vs. Slang)
**Greeting:**
- Amélie: "Bonjour, comment allez-vous?" (Hello, how are you?)
- Marcel: "Salut, ça gaze?" (Hey, what's up?)

**Ordering Coffee:**
- Amélie: "Je voudrais un café, s'il vous plaît" (I would like a coffee, please)
- Marcel: "File-moi un café, steup" (Hook me up with a coffee, please)

**Complaining:**
- Amélie: "Excusez-moi, mais ce n'est pas ce que j'ai commandé" (Excuse me, but this isn't what I ordered)
- Gaston: "C'est une blague? Mon chat fait un meilleur café" (Is this a joke? My cat makes better coffee)

## Monetization Strategy

### Free-to-Play Core
- **2 Languages Free**: Spanish and French
- **Basic Café**: Functional but simple
- **Daily Limits**: 10 cakes per day maximum

### Premium Features
- **All Languages**: Unlock Italian, German, Japanese
- **Faster Baking**: Reduced lesson time
- **Special Decorations**: Unique café customizations
- **No Daily Limits**: Unlimited cake production

## Technical Simplifications

### No Complex Audio Input
- Removed voice recognition requirements
- Simplified to NPC audio output only
- Reduced technical complexity significantly

### Lightweight Design
- Minimal server requirements
- Local storage for progress
- Quick loading times
- Mobile-friendly responsive design

## Humor & Tone Guidelines

### PG-13 Approach
- **Light Teasing**: Playful jabs that make people smile, not cringe
- **Cultural Observations**: Gentle humor about cultural differences
- **Self-Deprecating**: Characters poke fun at themselves too
- **Wordplay**: Puns and language-based humor when possible

### Example Interactions

**Tourist asks for directions in broken French:**
- Amélie: "Your pronunciation is... creative. Let me help."
- Marcel: "Pas mal pour un touriste!" (Not bad for a tourist!)

**Customer orders complicated coffee:**
- Café: "Un demi-décaf-soja-latte-sans-mousse? T'es sérieux?" (A half-decaf-soy-latte-no-foam? Are you serious?)
- Gaston: "Why don't you just chew the beans directly?"

**Failed flirting attempt:**
- Bisou: "That was painful to watch. Let me teach you something with more... finesse."
- Marcel: "Smooth comme du papier de verre!" (Smooth as sandpaper!)

### Regional Personality Differences

**French (Paris vs. Québec):**
- Parisian slang: More attitude, fashion-conscious jibes
- Québécois slang: More playful, incorporates English humor

**Spanish (Spain vs. Mexico):**
- Spanish slang: Dryer humor, more direct
- Mexican slang: Warmer teasing, more wordplay

## Success Metrics

### Engagement
- **Daily Active Users**: 60% return rate
- **Session Length**: 5-10 minutes average
- **Lessons per Session**: 2-3 average

### Learning
- **Phrase Retention**: 70% after one week
- **Practical Application**: Focus on travel phrases
- **Confidence Building**: Progressive difficulty

## Comparison to Duolingo

### What We Keep
- Daily engagement mechanics
- Visual progress tracking
- Bite-sized lessons

### What We Simplify
- No grammar explanations
- No written exercises
- No voice input required
- Focused phrase learning only

### What We Add
- Visual café management
- Aesthetic motivation (pretty cakes!)
- Clearer real-world application
- Relaxing, cozy atmosphere

---

*This document reflects the evolution of Gateaux into a lightweight, visually-driven language learning experience that maintains engagement through café management mechanics.*