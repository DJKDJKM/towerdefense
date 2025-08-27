# Tower Defense Game

A browser-based tower defense game built with HTML5 Canvas and JavaScript. Defend against waves of enemies across 5 unique levels with different enemy types and challenging paths.

## Features

### 5 Unique Levels
- **Grasslands** - Green plains with basic enemies
- **Desert Valley** - Sandy terrain with zigzag paths
- **Frozen Tundra** - Icy landscape with complex winding routes
- **Volcanic Rim** - Fiery environment with challenging patterns
- **Shadow Realm** - Dark realm with the most difficult paths

### Enemy Types
- **Basic** (Red circles) - Standard enemies with moderate health and speed
- **Fast** (Blue circles) - Quick enemies with lower health but high speed
- **Tank** (Dark squares) - Slow but heavily armored enemies
- **Boss** (Purple squares) - Large enemies with high health and damage resistance
- **Flying** (Orange hexagons) - Airborne enemies with unique movement patterns

### Gameplay Mechanics
- Click to place towers ($50 each)
- Towers automatically target and shoot nearby enemies
- Complete 5 waves per level to advance
- Earn money by destroying enemies
- Receive bonuses between levels (+$100, +50 Health)
- Progressive difficulty scaling across levels and waves

## How to Play

1. Open `index.html` in your web browser
2. Click anywhere on the colored area to place towers (avoid the brown path)
3. Towers will automatically shoot at enemies within their range
4. Prevent enemies from reaching the end of the path
5. Complete all waves to advance to the next level
6. Survive all 5 levels to achieve victory!

## Controls

- **Left Click** - Place tower (costs $50)
- Towers automatically target the closest enemy in range
- No manual controls needed - towers fire automatically

## Game Stats

- **Health** - You lose 10 health when an enemy reaches the end
- **Money** - Earned by destroying enemies, used to buy towers
- **Score** - Points accumulated by eliminating enemies
- **Waves** - 5 waves per level, 25 total waves across all levels

## Technical Details

- Built with vanilla JavaScript and HTML5 Canvas
- Object-oriented design with Game, Enemy, Tower, and Projectile classes
- Real-time collision detection and physics
- Responsive canvas-based rendering
- No external dependencies required

## Files

- `index.html` - Main game page with UI and canvas setup
- `game.js` - Complete game logic and classes
- `README.md` - This documentation

## Browser Compatibility

Works in all modern browsers that support HTML5 Canvas:
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported

## Installation

1. Clone or download this repository
2. Open `index.html` in a web browser
3. Start playing immediately - no setup required!

Enjoy defending against the enemy waves!