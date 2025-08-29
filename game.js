class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.gameState = {
            score: 0,
            health: 100,
            money: 100,
            wave: 1,
            level: 1,
            gameRunning: true,
            levelTransition: false,
            transitionTimer: 0
        };
        
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        
        this.levels = this.createLevels();
        this.currentLevel = this.levels[0];
        this.path = this.currentLevel.path;
        
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = this.currentLevel.spawnInterval;
        this.enemiesSpawned = 0;
        this.enemiesPerWave = this.currentLevel.enemiesPerWave;
        this.maxWavesPerLevel = 5;
        
        this.selectedTower = null;
        this.selectedTowerType = 'cannon';
        this.towerTypes = this.createTowerTypes();
        
        this.setupEventListeners();
        this.gameLoop();
    }
    
    createLevels() {
        return [
            {
                id: 1, name: "Peaceful Meadows", backgroundColor: '#58d68d',
                path: [{x: 0, y: 300}, {x: 200, y: 300}, {x: 200, y: 150}, {x: 600, y: 150}, {x: 600, y: 450}, {x: 800, y: 450}],
                spawnInterval: 150, enemiesPerWave: 6, enemyTypes: ['basic']
            },
            {
                id: 2, name: "Rolling Hills", backgroundColor: '#82e5aa',
                path: [{x: 0, y: 200}, {x: 150, y: 200}, {x: 150, y: 400}, {x: 300, y: 400}, {x: 300, y: 100}, {x: 500, y: 100}, {x: 500, y: 350}, {x: 800, y: 350}],
                spawnInterval: 130, enemiesPerWave: 8, enemyTypes: ['basic', 'fast']
            },
            {
                id: 3, name: "Dark Forest", backgroundColor: '#239b56',
                path: [{x: 0, y: 300}, {x: 100, y: 300}, {x: 100, y: 100}, {x: 400, y: 100}, {x: 400, y: 500}, {x: 700, y: 500}, {x: 700, y: 200}, {x: 800, y: 200}],
                spawnInterval: 110, enemiesPerWave: 10, enemyTypes: ['basic', 'fast', 'armored']
            },
            {
                id: 4, name: "Crystal Caves", backgroundColor: '#a569bd',
                path: [{x: 0, y: 150}, {x: 200, y: 150}, {x: 200, y: 450}, {x: 400, y: 450}, {x: 400, y: 250}, {x: 600, y: 250}, {x: 600, y: 500}, {x: 800, y: 500}],
                spawnInterval: 100, enemiesPerWave: 12, enemyTypes: ['basic', 'fast', 'armored', 'crystal']
            },
            {
                id: 5, name: "Sandy Dunes", backgroundColor: '#f7dc6f',
                path: [{x: 0, y: 400}, {x: 120, y: 400}, {x: 120, y: 150}, {x: 300, y: 150}, {x: 300, y: 450}, {x: 500, y: 450}, {x: 500, y: 100}, {x: 680, y: 100}, {x: 680, y: 350}, {x: 800, y: 350}],
                spawnInterval: 90, enemiesPerWave: 14, enemyTypes: ['basic', 'fast', 'armored', 'desert', 'burrower']
            },
            {
                id: 6, name: "Scorching Desert", backgroundColor: '#f4d03f',
                path: [{x: 0, y: 250}, {x: 150, y: 250}, {x: 150, y: 500}, {x: 350, y: 500}, {x: 350, y: 150}, {x: 550, y: 150}, {x: 550, y: 400}, {x: 800, y: 400}],
                spawnInterval: 85, enemiesPerWave: 16, enemyTypes: ['basic', 'fast', 'armored', 'desert', 'burrower', 'mirage']
            },
            {
                id: 7, name: "Frozen Lake", backgroundColor: '#aed6f1',
                path: [{x: 0, y: 300}, {x: 200, y: 300}, {x: 200, y: 100}, {x: 600, y: 100}, {x: 600, y: 500}, {x: 800, y: 500}],
                spawnInterval: 80, enemiesPerWave: 18, enemyTypes: ['basic', 'fast', 'armored', 'ice', 'frozen']
            },
            {
                id: 8, name: "Icy Mountains", backgroundColor: '#85c1e9',
                path: [{x: 0, y: 400}, {x: 100, y: 400}, {x: 100, y: 200}, {x: 250, y: 200}, {x: 250, y: 450}, {x: 400, y: 450}, {x: 400, y: 100}, {x: 600, y: 100}, {x: 600, y: 350}, {x: 800, y: 350}],
                spawnInterval: 75, enemiesPerWave: 20, enemyTypes: ['basic', 'fast', 'armored', 'ice', 'frozen', 'avalanche']
            },
            {
                id: 9, name: "Lava Fields", backgroundColor: '#ec7063',
                path: [{x: 0, y: 200}, {x: 150, y: 200}, {x: 150, y: 450}, {x: 300, y: 450}, {x: 300, y: 150}, {x: 500, y: 150}, {x: 500, y: 400}, {x: 650, y: 400}, {x: 650, y: 250}, {x: 800, y: 250}],
                spawnInterval: 70, enemiesPerWave: 22, enemyTypes: ['basic', 'fast', 'armored', 'fire', 'lava', 'phoenix']
            },
            {
                id: 10, name: "Volcanic Core", backgroundColor: '#cb4335',
                path: [{x: 0, y: 300}, {x: 120, y: 300}, {x: 120, y: 100}, {x: 280, y: 100}, {x: 280, y: 500}, {x: 440, y: 500}, {x: 440, y: 200}, {x: 600, y: 200}, {x: 600, y: 450}, {x: 800, y: 450}],
                spawnInterval: 65, enemiesPerWave: 25, enemyTypes: ['basic', 'fast', 'armored', 'fire', 'lava', 'phoenix', 'inferno']
            },
            {
                id: 11, name: "Storm Plains", backgroundColor: '#5d6d7e',
                path: [{x: 0, y: 350}, {x: 100, y: 350}, {x: 100, y: 150}, {x: 300, y: 150}, {x: 300, y: 500}, {x: 500, y: 500}, {x: 500, y: 250}, {x: 700, y: 250}, {x: 700, y: 400}, {x: 800, y: 400}],
                spawnInterval: 60, enemiesPerWave: 28, enemyTypes: ['basic', 'fast', 'armored', 'storm', 'lightning', 'thunder']
            },
            {
                id: 12, name: "Lightning Valley", backgroundColor: '#48c9b0',
                path: [{x: 0, y: 250}, {x: 150, y: 250}, {x: 150, y: 450}, {x: 350, y: 450}, {x: 350, y: 100}, {x: 550, y: 100}, {x: 550, y: 350}, {x: 800, y: 350}],
                spawnInterval: 55, enemiesPerWave: 30, enemyTypes: ['basic', 'fast', 'armored', 'storm', 'lightning', 'thunder', 'electro']
            },
            {
                id: 13, name: "Void Entrance", backgroundColor: '#2c3e50',
                path: [{x: 0, y: 300}, {x: 200, y: 300}, {x: 200, y: 150}, {x: 400, y: 150}, {x: 400, y: 450}, {x: 600, y: 450}, {x: 600, y: 250}, {x: 800, y: 250}],
                spawnInterval: 50, enemiesPerWave: 32, enemyTypes: ['basic', 'fast', 'armored', 'shadow', 'void', 'phantom']
            },
            {
                id: 14, name: "Shadow Realm", backgroundColor: '#1b2631',
                path: [{x: 0, y: 200}, {x: 100, y: 200}, {x: 100, y: 400}, {x: 250, y: 400}, {x: 250, y: 100}, {x: 400, y: 100}, {x: 400, y: 350}, {x: 550, y: 350}, {x: 550, y: 180}, {x: 700, y: 180}, {x: 700, y: 480}, {x: 800, y: 480}],
                spawnInterval: 45, enemiesPerWave: 35, enemyTypes: ['basic', 'fast', 'armored', 'shadow', 'void', 'phantom', 'wraith']
            },
            {
                id: 15, name: "Cosmic Nexus", backgroundColor: '#7d3c98',
                path: [{x: 0, y: 300}, {x: 80, y: 300}, {x: 80, y: 150}, {x: 200, y: 150}, {x: 200, y: 450}, {x: 320, y: 450}, {x: 320, y: 200}, {x: 440, y: 200}, {x: 440, y: 500}, {x: 560, y: 500}, {x: 560, y: 250}, {x: 680, y: 250}, {x: 680, y: 100}, {x: 800, y: 100}],
                spawnInterval: 40, enemiesPerWave: 40, enemyTypes: ['basic', 'fast', 'armored', 'shadow', 'void', 'phantom', 'wraith', 'cosmic', 'dimensional', 'ultimate']
            }
        ];
    }
    
    createTowerTypes() {
        return {
            // Basic Towers
            'cannon': { name: 'Cannon Tower', cost: 50, color: '#34495e', borderColor: '#2c3e50', damage: 35, range: 100, fireRate: 50, special: 'basic', projectileColor: '#2c3e50' },
            'archer': { name: 'Archer Tower', cost: 40, color: '#27ae60', borderColor: '#229954', damage: 20, range: 140, fireRate: 25, special: 'fast', projectileColor: '#8b4513' },
            'ballista': { name: 'Ballista Tower', cost: 80, color: '#8d6e63', borderColor: '#6d4c41', damage: 60, range: 180, fireRate: 80, special: 'pierce', projectileColor: '#3e2723' },
            
            // Elemental Ice Towers
            'ice': { name: 'Ice Tower', cost: 70, color: '#81d4fa', borderColor: '#4fc3f7', damage: 25, range: 110, fireRate: 45, special: 'slow', projectileColor: '#b3e5fc' },
            'frost': { name: 'Frost Tower', cost: 120, color: '#4fc3f7', borderColor: '#29b6f6', damage: 40, range: 120, fireRate: 60, special: 'freeze', projectileColor: '#81d4fa' },
            'blizzard': { name: 'Blizzard Tower', cost: 200, color: '#0277bd', borderColor: '#01579b', damage: 30, range: 150, fireRate: 30, special: 'aoe_freeze', projectileColor: '#b3e5fc' },
            'glacier': { name: 'Glacier Tower', cost: 350, color: '#0d47a1', borderColor: '#01579b', damage: 80, range: 130, fireRate: 90, special: 'permafrost', projectileColor: '#e3f2fd' },
            
            // Elemental Fire Towers  
            'fire': { name: 'Fire Tower', cost: 75, color: '#ff5722', borderColor: '#d84315', damage: 35, range: 90, fireRate: 35, special: 'burn', projectileColor: '#ff8a65' },
            'inferno': { name: 'Inferno Tower', cost: 140, color: '#d84315', borderColor: '#bf360c', damage: 50, range: 100, fireRate: 50, special: 'burn_spread', projectileColor: '#ff5722' },
            'volcano': { name: 'Volcano Tower', cost: 250, color: '#bf360c', borderColor: '#870000', damage: 35, range: 160, fireRate: 40, special: 'lava_pool', projectileColor: '#ff3d00' },
            'phoenix': { name: 'Phoenix Tower', cost: 400, color: '#ff6d00', borderColor: '#e65100', damage: 90, range: 140, fireRate: 70, special: 'rebirth', projectileColor: '#ff8f00' },
            
            // Lightning/Electric Towers
            'lightning': { name: 'Lightning Tower', cost: 90, color: '#ffd54f', borderColor: '#ffc107', damage: 45, range: 120, fireRate: 60, special: 'chain', projectileColor: '#ffeb3b' },
            'tesla': { name: 'Tesla Tower', cost: 160, color: '#03a9f4', borderColor: '#0277bd', damage: 55, range: 130, fireRate: 75, special: 'electric_field', projectileColor: '#40c4ff' },
            'storm': { name: 'Storm Tower', cost: 280, color: '#3f51b5', borderColor: '#303f9f', damage: 70, range: 150, fireRate: 80, special: 'tornado', projectileColor: '#7986cb' },
            'thunder': { name: 'Thunder Tower', cost: 450, color: '#1a237e', borderColor: '#0d1461', damage: 120, range: 170, fireRate: 100, special: 'shockwave', projectileColor: '#3f51b5' },
            
            // Nature/Earth Towers
            'nature': { name: 'Nature Tower', cost: 60, color: '#4caf50', borderColor: '#388e3c', damage: 30, range: 100, fireRate: 40, special: 'root', projectileColor: '#66bb6a' },
            'thorn': { name: 'Thorn Tower', cost: 100, color: '#689f38', borderColor: '#558b2f', damage: 25, range: 80, fireRate: 25, special: 'poison_thorns', projectileColor: '#8bc34a' },
            'vine': { name: 'Vine Tower', cost: 150, color: '#558b2f', borderColor: '#33691e', damage: 20, range: 140, fireRate: 35, special: 'entangle', projectileColor: '#7cb342' },
            'earth': { name: 'Earth Tower', cost: 300, color: '#5d4037', borderColor: '#3e2723', damage: 100, range: 110, fireRate: 80, special: 'earthquake', projectileColor: '#8d6e63' },
            
            // Dark/Shadow Towers
            'shadow': { name: 'Shadow Tower', cost: 180, color: '#424242', borderColor: '#212121', damage: 70, range: 110, fireRate: 45, special: 'stealth', projectileColor: '#616161' },
            'void': { name: 'Void Tower', cost: 320, color: '#1a1a1a', borderColor: '#000000', damage: 85, range: 130, fireRate: 65, special: 'absorb', projectileColor: '#424242' },
            'nightmare': { name: 'Nightmare Tower', cost: 500, color: '#4a148c', borderColor: '#311b92', damage: 110, range: 150, fireRate: 70, special: 'fear', projectileColor: '#7b1fa2' },
            'demon': { name: 'Demon Tower', cost: 700, color: '#880e4f', borderColor: '#560027', damage: 150, range: 120, fireRate: 60, special: 'soul_steal', projectileColor: '#ad1457' },
            
            // Advanced Tech Towers
            'laser': { name: 'Laser Tower', cost: 200, color: '#e91e63', borderColor: '#c2185b', damage: 60, range: 160, fireRate: 20, special: 'beam', projectileColor: '#ff1744' },
            'plasma': { name: 'Plasma Tower', cost: 350, color: '#9c27b0', borderColor: '#7b1fa2', damage: 90, range: 140, fireRate: 45, special: 'melt', projectileColor: '#e91e63' },
            'ion': { name: 'Ion Tower', cost: 500, color: '#673ab7', borderColor: '#512da8', damage: 120, range: 150, fireRate: 55, special: 'disintegrate', projectileColor: '#9c27b0' },
            'quantum': { name: 'Quantum Tower', cost: 650, color: '#3f51b5', borderColor: '#303f9f', damage: 100, range: 200, fireRate: 75, special: 'quantum_split', projectileColor: '#5c6bc0' },
            
            // Artillery Towers
            'mortar': { name: 'Mortar Tower', cost: 130, color: '#795548', borderColor: '#5d4037', damage: 80, range: 180, fireRate: 90, special: 'explosive', projectileColor: '#8d6e63' },
            'howitzer': { name: 'Howitzer Tower', cost: 250, color: '#607d8b', borderColor: '#455a64', damage: 120, range: 200, fireRate: 120, special: 'mega_explosive', projectileColor: '#78909c' },
            'railgun': { name: 'Railgun Tower', cost: 400, color: '#37474f', borderColor: '#263238', damage: 200, range: 250, fireRate: 150, special: 'railgun_pierce', projectileColor: '#546e7a' },
            'nuke': { name: 'Nuclear Tower', cost: 800, color: '#ff9800', borderColor: '#f57c00', damage: 300, range: 160, fireRate: 200, special: 'nuclear', projectileColor: '#ffc107' },
            
            // Support Towers
            'radar': { name: 'Radar Tower', cost: 120, color: '#00acc1', borderColor: '#00838f', damage: 0, range: 200, fireRate: 0, special: 'boost_range', projectileColor: '#26c6da' },
            'amplifier': { name: 'Amplifier Tower', cost: 150, color: '#26a69a', borderColor: '#00695c', damage: 0, range: 120, fireRate: 0, special: 'boost_damage', projectileColor: '#4db6ac' },
            'battery': { name: 'Battery Tower', cost: 180, color: '#66bb6a', borderColor: '#388e3c', damage: 0, range: 130, fireRate: 0, special: 'boost_speed', projectileColor: '#81c784' },
            'shield': { name: 'Shield Tower', cost: 200, color: '#42a5f5', borderColor: '#1976d2', damage: 0, range: 100, fireRate: 0, special: 'shield', projectileColor: '#64b5f6' },
            
            // Ultimate Towers
            'cosmic': { name: 'Cosmic Tower', cost: 900, color: '#7c4dff', borderColor: '#651fff', damage: 200, range: 180, fireRate: 60, special: 'cosmic_ray', projectileColor: '#b388ff' },
            'dimensional': { name: 'Dimensional Tower', cost: 1200, color: '#e040fb', borderColor: '#d500f9', damage: 250, range: 190, fireRate: 70, special: 'dimension_rift', projectileColor: '#ea80fc' },
            'ultimate': { name: 'Ultimate Tower', cost: 1500, color: '#ff6ec7', borderColor: '#ff1744', damage: 400, range: 220, fireRate: 80, special: 'omnipotent', projectileColor: '#ff80ab' },
            'godlike': { name: 'Godlike Tower', cost: 2000, color: '#ffd700', borderColor: '#ffb300', damage: 600, range: 250, fireRate: 50, special: 'divine_wrath', projectileColor: '#fff176' }
        };
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.handleClick(x, y);
            
            // Focus canvas for keyboard events
            this.canvas.focus();
        });
        
        // Make canvas focusable
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.focus();
        
        // Listen for keyboard events on both canvas and document
        this.canvas.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key);
            this.handleKeyPress(e.key);
            e.preventDefault();
        });
        
        document.addEventListener('keydown', (e) => {
            console.log('Document key pressed:', e.key);
            this.handleKeyPress(e.key);
        });
        
        // Button event listeners for tower types
        const towerButtons = [
            'cannon', 'archer', 'ballista', 'nature',
            'ice', 'frost', 'blizzard', 'glacier',
            'fire', 'inferno', 'volcano', 'phoenix',
            'lightning', 'tesla', 'storm', 'thunder',
            'laser', 'plasma', 'quantum', 'nuke'
        ];
        
        towerButtons.forEach(towerType => {
            const button = document.getElementById(towerType + 'Btn');
            if (button) {
                button.addEventListener('click', () => {
                    this.selectedTowerType = towerType;
                    this.updateButtonStates();
                    console.log('Selected tower type:', towerType);
                });
                console.log('Added event listener for', towerType + 'Btn');
            } else {
                console.log('Button not found:', towerType + 'Btn');
            }
        });
        
        // Initialize button states
        this.updateButtonStates();
    }
    
    handleClick(x, y) {
        if (this.gameState.levelTransition || !this.gameState.gameRunning) return;
        
        const clickedTower = this.getTowerAt(x, y);
        
        if (clickedTower) {
            if (this.selectedTower === null) {
                // First tower selected
                this.selectedTower = clickedTower;
                console.log('Selected tower type', clickedTower.type);
            } else if (this.selectedTower === clickedTower) {
                // Same tower clicked - deselect
                this.selectedTower = null;
                console.log('Deselected tower');
            } else {
                // Different tower clicked - just select it (no merging for now)
                this.selectedTower = clickedTower;
                console.log('Selected different tower type', clickedTower.type);
            }
        } else {
            // Clicked empty space - check if we can afford the tower first
            const towerStats = this.towerTypes[this.selectedTowerType];
            if (towerStats && this.gameState.money >= towerStats.cost) {
                this.selectedTower = null;
                this.placeTower(x, y, this.selectedTowerType);
            } else if (towerStats) {
                console.log(`Not enough money for ${towerStats.name}! Cost: $${towerStats.cost}, Have: $${this.gameState.money}`);
            }
        }
    }
    
    handleKeyPress(key) {
        if (this.gameState.levelTransition || !this.gameState.gameRunning) return;
        
        console.log('Handling key press:', key);
        const towerKeys = {
            '1': 'cannon', '2': 'archer', '3': 'ballista', '4': 'nature',
            '5': 'ice', '6': 'frost', '7': 'fire', '8': 'inferno',
            '9': 'lightning', '0': 'tesla'
        };
        
        if (towerKeys[key]) {
            this.selectedTowerType = towerKeys[key];
            this.updateButtonStates();
            console.log('Selected tower type:', towerKeys[key]);
        } else {
            console.log('Invalid key:', key);
        }
    }
    
    updateButtonStates() {
        const towerButtons = [
            'cannon', 'archer', 'ballista', 'nature',
            'ice', 'frost', 'blizzard', 'glacier',
            'fire', 'inferno', 'volcano', 'phoenix',
            'lightning', 'tesla', 'storm', 'thunder',
            'laser', 'plasma', 'quantum', 'nuke'
        ];
        
        towerButtons.forEach(towerType => {
            const button = document.getElementById(towerType + 'Btn');
            if (button) {
                if (towerType === this.selectedTowerType) {
                    button.style.border = '3px solid #f1c40f';
                    button.style.transform = 'scale(1.05)';
                } else {
                    const towerStats = this.towerTypes[towerType];
                    if (towerStats) {
                        button.style.border = `2px solid ${towerStats.borderColor}`;
                    }
                    button.style.transform = 'scale(1)';
                }
            }
        });
    }
    
    placeTower(x, y, towerType = 'cannon') {
        const towerStats = this.towerTypes[towerType];
        if (!towerStats) return;
        
        const cost = towerStats.cost;
        
        if (this.gameState.money >= cost) {
            if (this.isValidTowerPosition(x, y)) {
                this.towers.push(new Tower(x, y, towerType));
                this.gameState.money -= cost;
                console.log(`Placed ${towerStats.name} for $${cost}`);
                this.updateUI();
            }
        } else {
            console.log(`Not enough money! Need $${cost}, have $${this.gameState.money}`);
        }
    }
    
    isValidTowerPosition(x, y) {
        const minDistance = 40;
        
        for (let point of this.path) {
            const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
            if (distance < minDistance) return false;
        }
        
        for (let tower of this.towers) {
            const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
            if (distance < 60) return false;
        }
        
        return true;
    }
    
    getTowerAt(x, y) {
        return this.towers.find(tower => {
            const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2);
            return distance <= tower.size;
        });
    }
    
    
    spawnEnemy() {
        if (this.enemySpawnTimer <= 0 && this.enemiesSpawned < this.enemiesPerWave) {
            const enemyType = this.getRandomEnemyType();
            this.enemies.push(new Enemy(this.path, this.gameState.wave, this.gameState.level, enemyType));
            this.enemySpawnTimer = this.enemySpawnInterval;
            this.enemiesSpawned++;
        } else {
            this.enemySpawnTimer--;
        }
        
        if (this.enemiesSpawned >= this.enemiesPerWave && this.enemies.length === 0) {
            if (this.gameState.wave >= this.maxWavesPerLevel) {
                this.completeLevel();
            } else {
                this.gameState.wave++;
                this.enemiesSpawned = 0;
                this.enemySpawnInterval = Math.max(60, this.enemySpawnInterval - 5);
                this.enemiesPerWave += 1;
            }
        }
    }
    
    getRandomEnemyType() {
        const availableTypes = this.currentLevel.enemyTypes;
        return availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }
    
    completeLevel() {
        if (this.gameState.level < this.levels.length) {
            this.gameState.levelTransition = true;
            this.gameState.transitionTimer = 180;
            this.gameState.level++;
            this.gameState.wave = 1;
            this.enemiesSpawned = 0;
            this.gameState.money += 100;
            this.gameState.health = Math.min(100, this.gameState.health + 50);
            
            this.currentLevel = this.levels[this.gameState.level - 1];
            this.path = this.currentLevel.path;
            this.enemySpawnInterval = this.currentLevel.spawnInterval;
            this.enemiesPerWave = this.currentLevel.enemiesPerWave;
            
            this.towers = [];
            this.projectiles = [];
        } else {
            this.gameState.gameRunning = false;
        }
    }
    
    update() {
        if (!this.gameState.gameRunning && !this.gameState.levelTransition) return;
        
        if (this.gameState.levelTransition) {
            this.gameState.transitionTimer--;
            if (this.gameState.transitionTimer <= 0) {
                this.gameState.levelTransition = false;
            }
            return;
        }
        
        if (!this.gameState.levelTransition) {
            this.spawnEnemy();
        }
        
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.reachedEnd) {
                this.gameState.health -= 10;
                this.enemies.splice(index, 1);
                if (this.gameState.health <= 0) {
                    this.gameState.gameRunning = false;
                }
            }
        });
        
        this.towers.forEach(tower => {
            tower.update(this.enemies, this.projectiles);
        });
        
        this.projectiles.forEach((projectile, index) => {
            projectile.update();
            if (projectile.shouldRemove) {
                this.projectiles.splice(index, 1);
            }
            
            this.enemies.forEach((enemy, enemyIndex) => {
                if (projectile.checkCollision(enemy)) {
                    enemy.takeDamage(projectile.damage);
                    projectile.onHit(enemy);
                    
                    if (projectile.shouldRemove) {
                        this.projectiles.splice(index, 1);
                    }
                    
                    if (enemy.health <= 0) {
                        this.gameState.score += enemy.points;
                        this.gameState.money += enemy.money;
                        this.enemies.splice(enemyIndex, 1);
                    }
                }
            });
        });
        
        this.updateUI();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = this.currentLevel.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.drawPath();
        
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.towers.forEach(tower => tower.draw(this.ctx));
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));
        
        this.drawSelectedTower();
        this.drawMergeHints();
        
        if (this.gameState.levelTransition) {
            this.drawLevelTransition();
        } else if (!this.gameState.gameRunning) {
            if (this.gameState.level > this.levels.length) {
                this.drawVictory();
            } else {
                this.drawGameOver();
            }
        }
    }
    
    drawPath() {
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 30;
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        this.ctx.stroke();
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 50);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.gameState.score}`, this.width / 2, this.height / 2 + 20);
        this.ctx.fillText('Refresh to play again', this.width / 2, this.height / 2 + 60);
    }
    
    drawLevelTransition() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#3498db';
        this.ctx.font = '36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Level ${this.gameState.level}`, this.width / 2, this.height / 2 - 40);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(this.currentLevel.name, this.width / 2, this.height / 2 + 10);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Bonus: +$100, +50 Health', this.width / 2, this.height / 2 + 40);
        this.ctx.fillText('Towers cleared - place new defenses!', this.width / 2, this.height / 2 + 65);
    }
    
    drawVictory() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.width / 2, this.height / 2 - 50);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('You completed all levels!', this.width / 2, this.height / 2);
        this.ctx.fillText(`Final Score: ${this.gameState.score}`, this.width / 2, this.height / 2 + 40);
        this.ctx.fillText('Refresh to play again', this.width / 2, this.height / 2 + 80);
    }
    
    drawSelectedTower() {
        if (this.selectedTower) {
            this.ctx.strokeStyle = '#f39c12';
            this.ctx.lineWidth = 4;
            this.ctx.setLineDash([8, 8]);
            this.ctx.strokeRect(this.selectedTower.x - this.selectedTower.size / 2 - 3, 
                               this.selectedTower.y - this.selectedTower.size / 2 - 3, 
                               this.selectedTower.size + 6, 
                               this.selectedTower.size + 6);
            this.ctx.setLineDash([]);
            
            // Highlight other towers of the same level
            this.towers.forEach(tower => {
                if (tower !== this.selectedTower && tower.level === this.selectedTower.level && tower.level < 3) {
                    this.ctx.strokeStyle = '#27ae60';
                    this.ctx.lineWidth = 3;
                    this.ctx.setLineDash([5, 5]);
                    this.ctx.strokeRect(tower.x - tower.size / 2 - 2, 
                                       tower.y - tower.size / 2 - 2, 
                                       tower.size + 4, 
                                       tower.size + 4);
                    this.ctx.setLineDash([]);
                }
            });
        }
    }
    
    drawMergeHints() {
        const towerStats = this.towerTypes[this.selectedTowerType];
        if (!towerStats) return;
        
        this.ctx.fillStyle = towerStats.color;
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Selected: ${towerStats.name} ($${towerStats.cost})`, 10, 25);
        
        this.ctx.fillStyle = '#bdc3c7';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Range: ${towerStats.range} • Damage: ${towerStats.damage} • Special: ${towerStats.special}`, 10, 45);
        
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.font = '11px Arial';
        this.ctx.fillText('Press 1-0 keys or click buttons to select tower types', 10, 60);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('health').textContent = this.gameState.health;
        document.getElementById('money').textContent = this.gameState.money;
        document.getElementById('level').textContent = this.gameState.level;
        document.getElementById('wave').textContent = this.gameState.wave;
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Enemy {
    constructor(path, wave, level, type) {
        this.path = path;
        this.pathIndex = 0;
        this.x = path[0].x;
        this.y = path[0].y;
        this.type = type;
        this.wave = wave;
        this.level = level;
        
        this.setEnemyStats(type, wave, level);
        this.reachedEnd = false;
    }
    
    setEnemyStats(type, wave, level) {
        const levelMultiplier = 1 + (level - 1) * 0.2;
        const waveMultiplier = 1 + (wave - 1) * 0.15;
        const baseMultiplier = levelMultiplier * waveMultiplier;
        
        switch(type) {
            case 'basic':
                this.speed = 1.2 * levelMultiplier;
                this.health = Math.floor(60 * baseMultiplier);
                this.radius = 12; this.points = 15 * level; this.money = 18 + level * 3; this.color = '#e74c3c';
                break;
            case 'fast':
                this.speed = 2.5 * levelMultiplier;
                this.health = Math.floor(40 * baseMultiplier);
                this.radius = 10; this.points = 20 * level; this.money = 22 + level * 3; this.color = '#3498db';
                break;
            case 'armored':
                this.speed = 0.8 * levelMultiplier;
                this.health = Math.floor(180 * baseMultiplier);
                this.radius = 14; this.points = 30 * level; this.money = 35 + level * 5; this.color = '#95a5a6'; this.armor = 5;
                break;
            case 'crystal':
                this.speed = 1.0 * levelMultiplier;
                this.health = Math.floor(120 * baseMultiplier);
                this.radius = 13; this.points = 35 * level; this.money = 40 + level * 6; this.color = '#9b59b6'; this.reflects = true;
                break;
            case 'desert':
                this.speed = 1.3 * levelMultiplier;
                this.health = Math.floor(90 * baseMultiplier);
                this.radius = 12; this.points = 25 * level; this.money = 28 + level * 4; this.color = '#f39c12'; this.sandstorm = true;
                break;
            case 'burrower':
                this.speed = 0.7 * levelMultiplier;
                this.health = Math.floor(200 * baseMultiplier);
                this.radius = 15; this.points = 40 * level; this.money = 45 + level * 6; this.color = '#8b4513'; this.underground = true;
                break;
            case 'mirage':
                this.speed = 2.0 * levelMultiplier;
                this.health = Math.floor(70 * baseMultiplier);
                this.radius = 11; this.points = 45 * level; this.money = 50 + level * 7; this.color = '#f1c40f'; this.illusion = true;
                break;
            case 'ice':
                this.speed = 1.1 * levelMultiplier;
                this.health = Math.floor(100 * baseMultiplier);
                this.radius = 12; this.points = 30 * level; this.money = 32 + level * 4; this.color = '#85c1e9'; this.freezing = true;
                break;
            case 'frozen':
                this.speed = 0.6 * levelMultiplier;
                this.health = Math.floor(250 * baseMultiplier);
                this.radius = 16; this.points = 50 * level; this.money = 55 + level * 8; this.color = '#aed6f1'; this.iceArmor = true;
                break;
            case 'avalanche':
                this.speed = 0.5 * levelMultiplier;
                this.health = Math.floor(400 * baseMultiplier);
                this.radius = 20; this.points = 70 * level; this.money = 80 + level * 10; this.color = '#d5dbdb'; this.massive = true;
                break;
            case 'fire':
                this.speed = 1.4 * levelMultiplier;
                this.health = Math.floor(85 * baseMultiplier);
                this.radius = 12; this.points = 35 * level; this.money = 38 + level * 5; this.color = '#e74c3c'; this.burning = true;
                break;
            case 'lava':
                this.speed = 0.9 * levelMultiplier;
                this.health = Math.floor(180 * baseMultiplier);
                this.radius = 15; this.points = 55 * level; this.money = 62 + level * 8; this.color = '#cb4335'; this.molten = true;
                break;
            case 'phoenix':
                this.speed = 1.8 * levelMultiplier;
                this.health = Math.floor(120 * baseMultiplier);
                this.radius = 14; this.points = 65 * level; this.money = 75 + level * 9; this.color = '#ff6b35'; this.rebirth = true; this.flying = true;
                break;
            case 'inferno':
                this.speed = 1.0 * levelMultiplier;
                this.health = Math.floor(300 * baseMultiplier);
                this.radius = 18; this.points = 80 * level; this.money = 95 + level * 12; this.color = '#922b21'; this.fireAura = true;
                break;
            case 'storm':
                this.speed = 1.5 * levelMultiplier;
                this.health = Math.floor(95 * baseMultiplier);
                this.radius = 13; this.points = 40 * level; this.money = 42 + level * 5; this.color = '#5d6d7e'; this.electric = true;
                break;
            case 'lightning':
                this.speed = 3.0 * levelMultiplier;
                this.health = Math.floor(60 * baseMultiplier);
                this.radius = 10; this.points = 50 * level; this.money = 55 + level * 6; this.color = '#f7dc6f'; this.chain = true;
                break;
            case 'thunder':
                this.speed = 0.8 * levelMultiplier;
                this.health = Math.floor(220 * baseMultiplier);
                this.radius = 16; this.points = 60 * level; this.money = 68 + level * 8; this.color = '#48c9b0'; this.shockwave = true;
                break;
            case 'electro':
                this.speed = 1.2 * levelMultiplier;
                this.health = Math.floor(150 * baseMultiplier);
                this.radius = 14; this.points = 70 * level; this.money = 82 + level * 10; this.color = '#52be80'; this.electromagnetic = true;
                break;
            case 'shadow':
                this.speed = 1.3 * levelMultiplier;
                this.health = Math.floor(110 * baseMultiplier);
                this.radius = 12; this.points = 45 * level; this.money = 48 + level * 6; this.color = '#2c3e50'; this.stealth = true;
                break;
            case 'void':
                this.speed = 1.1 * levelMultiplier;
                this.health = Math.floor(160 * baseMultiplier);
                this.radius = 15; this.points = 65 * level; this.money = 75 + level * 9; this.color = '#1b2631'; this.absorb = true;
                break;
            case 'phantom':
                this.speed = 2.2 * levelMultiplier;
                this.health = Math.floor(80 * baseMultiplier);
                this.radius = 11; this.points = 55 * level; this.money = 62 + level * 7; this.color = '#34495e'; this.phase = true;
                break;
            case 'wraith':
                this.speed = 1.6 * levelMultiplier;
                this.health = Math.floor(200 * baseMultiplier);
                this.radius = 13; this.points = 75 * level; this.money = 88 + level * 11; this.color = '#17202a'; this.soul = true;
                break;
            case 'cosmic':
                this.speed = 1.4 * levelMultiplier;
                this.health = Math.floor(250 * baseMultiplier);
                this.radius = 16; this.points = 90 * level; this.money = 105 + level * 13; this.color = '#7d3c98'; this.cosmic = true;
                break;
            case 'dimensional':
                this.speed = 1.8 * levelMultiplier;
                this.health = Math.floor(180 * baseMultiplier);
                this.radius = 14; this.points = 100 * level; this.money = 120 + level * 15; this.color = '#6c3483'; this.portal = true;
                break;
            case 'ultimate':
                this.speed = 1.0 * levelMultiplier;
                this.health = Math.floor(500 * baseMultiplier);
                this.radius = 22; this.points = 150 * level; this.money = 180 + level * 20; this.color = '#4a148c'; this.ultimate = true;
                break;
            default:
                this.setEnemyStats('basic', wave, level);
        }
        
        this.maxHealth = this.health;
    }
    
    update() {
        if (this.pathIndex >= this.path.length - 1) {
            this.reachedEnd = true;
            return;
        }
        
        // Handle status effects
        this.updateStatusEffects();
        
        // Calculate movement speed with effects
        let currentSpeed = this.speed;
        if (this.slowEffect > 0) currentSpeed *= 0.5;
        if (this.freezeEffect > 0) currentSpeed = 0;
        
        const target = this.path[this.pathIndex + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < currentSpeed) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length - 1) {
                this.reachedEnd = true;
            }
        } else if (currentSpeed > 0) {
            this.x += (dx / distance) * currentSpeed;
            this.y += (dy / distance) * currentSpeed;
        }
    }
    
    updateStatusEffects() {
        // Slow effect
        if (this.slowEffect > 0) {
            this.slowEffect--;
        }
        
        // Freeze effect
        if (this.freezeEffect > 0) {
            this.freezeEffect--;
        }
        
        // Burn effect
        if (this.burnEffect > 0) {
            this.burnEffect--;
            if (this.burnDamage) {
                this.takeDamage(this.burnDamage);
            }
        }
        
        // Poison effect
        if (this.poisonEffect > 0) {
            this.poisonEffect--;
            if (this.poisonDamage) {
                this.takeDamage(this.poisonDamage);
            }
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
    
    draw(ctx) {
        if (this.flying) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 4;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        if (this.type === 'tank') {
            ctx.fillRect(this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
        } else if (this.type === 'boss') {
            ctx.fillRect(this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
            ctx.strokeStyle = '#f39c12';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - this.radius / 2, this.y - this.radius / 2, this.radius, this.radius);
        } else if (this.type === 'flying') {
            const points = 6;
            const angle = (Math.PI * 2) / points;
            ctx.moveTo(this.x + this.radius, this.y);
            for (let i = 1; i < points; i++) {
                const x = this.x + Math.cos(angle * i) * this.radius;
                const y = this.y + Math.sin(angle * i) * this.radius;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else {
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        }
        
        ctx.fill();
        
        if (this.flying) {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
        }
        
        const healthWidth = Math.max(20, this.radius * 1.5);
        const healthHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(this.x - healthWidth / 2, this.y - this.radius - 8, healthWidth, healthHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
        ctx.fillRect(this.x - healthWidth / 2, this.y - this.radius - 8, healthWidth * healthPercent, healthHeight);
        
        if (this.type === 'fast') {
            ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw status effect indicators
        let effectY = this.y - this.radius - 15;
        
        if (this.slowEffect > 0) {
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x - 4, effectY, 8, 3);
            effectY -= 5;
        }
        
        if (this.freezeEffect > 0) {
            ctx.fillStyle = '#85c1e9';
            ctx.fillRect(this.x - 5, effectY, 10, 3);
            effectY -= 5;
        }
        
        if (this.burnEffect > 0) {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x - 3, effectY, 6, 3);
            effectY -= 5;
        }
        
        if (this.poisonEffect > 0) {
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(this.x - 3, effectY, 6, 3);
        }
    }
}

class Tower {
    constructor(x, y, type = 'cannon') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.setTowerStats(type);
        this.fireTimer = 0;
        this.target = null;
        this.size = 22;
    }
    
    setTowerStats(type) {
        const game = window.game;
        if (game && game.towerTypes[type]) {
            const stats = game.towerTypes[type];
            this.range = stats.range;
            this.damage = stats.damage;
            this.fireRate = stats.fireRate;
            this.color = stats.color;
            this.borderColor = stats.borderColor;
            this.special = stats.special;
            this.name = stats.name;
            this.cost = stats.cost;
        } else {
            this.range = 120;
            this.damage = 40;
            this.fireRate = 45;
            this.color = '#34495e';
            this.borderColor = '#2c3e50';
            this.special = 'basic';
            this.name = 'Cannon Tower';
            this.cost = 80;
        }
    }
    
    update(enemies, projectiles) {
        this.fireTimer--;
        
        this.target = this.findTarget(enemies);
        
        if (this.target && this.fireTimer <= 0) {
            this.executeSpecialAbility(enemies, projectiles);
            this.fireTimer = this.fireRate;
        }
    }
    
    findTarget(enemies) {
        let closestEnemy = null;
        let closestDistance = this.range;
        
        enemies.forEach(enemy => {
            const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
            if (distance <= this.range && distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        });
        
        return closestEnemy;
    }
    
    executeSpecialAbility(enemies, projectiles) {
        const game = window.game;
        
        switch(this.special) {
            case 'basic':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                break;
                
            case 'fast':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                break;
                
            case 'pierce':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                break;
                
            case 'slow':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                this.target.slowEffect = 180; // 3 seconds
                break;
                
            case 'freeze':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                this.target.freezeEffect = 120; // 2 seconds
                break;
                
            case 'burn':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                this.target.burnEffect = 300; // 5 seconds
                this.target.burnDamage = this.damage / 4;
                break;
                
            case 'burn_spread':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                // Spread burn to nearby enemies
                enemies.forEach(enemy => {
                    if (enemy !== this.target) {
                        const dist = Math.sqrt((enemy.x - this.target.x) ** 2 + (enemy.y - this.target.y) ** 2);
                        if (dist < 40) {
                            enemy.burnEffect = 180;
                            enemy.burnDamage = this.damage / 6;
                        }
                    }
                });
                break;
                
            case 'chain':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                // Chain to nearby enemies
                this.chainLightning(enemies, this.target, this.damage * 0.7, 3);
                break;
                
            case 'explosive':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                break;
                
            case 'poison_thorns':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                this.target.poisonEffect = 240;
                this.target.poisonDamage = this.damage / 3;
                break;
                
            case 'beam':
                // Laser beam - continuous damage
                if (this.target) {
                    this.target.takeDamage(this.damage / 3); // Continuous damage
                    projectiles.push(new Projectile(this.x, this.y, this.target, 0, this.special)); // Visual only
                }
                break;
                
            case 'aoe_freeze':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                // Freeze all enemies in area
                enemies.forEach(enemy => {
                    const dist = Math.sqrt((enemy.x - this.target.x) ** 2 + (enemy.y - this.target.y) ** 2);
                    if (dist < 60) {
                        enemy.freezeEffect = 90;
                    }
                });
                break;
                
            case 'boost_range':
                // Support tower - boost nearby towers range
                if (game) {
                    game.towers.forEach(tower => {
                        if (tower !== this) {
                            const dist = Math.sqrt((tower.x - this.x) ** 2 + (tower.y - this.y) ** 2);
                            if (dist < this.range) {
                                tower.rangeBoost = 1.5;
                            }
                        }
                    });
                }
                break;
                
            case 'boost_damage':
                // Support tower - boost nearby towers damage
                if (game) {
                    game.towers.forEach(tower => {
                        if (tower !== this) {
                            const dist = Math.sqrt((tower.x - this.x) ** 2 + (tower.y - this.y) ** 2);
                            if (dist < this.range) {
                                tower.damageBoost = 1.8;
                            }
                        }
                    });
                }
                break;
                
            case 'nuclear':
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                // Nuclear explosion affects large area
                enemies.forEach(enemy => {
                    const dist = Math.sqrt((enemy.x - this.target.x) ** 2 + (enemy.y - this.target.y) ** 2);
                    if (dist < 100) {
                        const falloffDamage = this.damage * (1 - dist / 100);
                        enemy.takeDamage(falloffDamage);
                    }
                });
                break;
                
            default:
                projectiles.push(new Projectile(this.x, this.y, this.target, this.damage, this.special));
                break;
        }
    }
    
    chainLightning(enemies, startEnemy, damage, remaining) {
        if (remaining <= 0) return;
        
        let closestEnemy = null;
        let closestDist = 80;
        
        enemies.forEach(enemy => {
            if (enemy !== startEnemy && !enemy.chainHit) {
                const dist = Math.sqrt((enemy.x - startEnemy.x) ** 2 + (enemy.y - startEnemy.y) ** 2);
                if (dist < closestDist) {
                    closestEnemy = enemy;
                    closestDist = dist;
                }
            }
        });
        
        if (closestEnemy) {
            closestEnemy.chainHit = true;
            closestEnemy.takeDamage(damage);
            this.chainLightning(enemies, closestEnemy, damage * 0.8, remaining - 1);
        }
        
        // Reset chain hits
        setTimeout(() => {
            enemies.forEach(enemy => enemy.chainHit = false);
        }, 100);
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        // Draw tower type indicator
        if (this.type && this.type !== 'cannon') {
            ctx.fillStyle = 'white';
            ctx.font = `${this.size / 3}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const symbol = this.type.charAt(0).toUpperCase();
            ctx.fillText(symbol, this.x, this.y);
        }
        
        if (this.target) {
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.target.x, this.target.y);
            ctx.stroke();
        }
    }
}

class Projectile {
    constructor(x, y, target, damage, special = 'basic') {
        this.x = x;
        this.y = y;
        this.targetX = target.x;
        this.targetY = target.y;
        this.damage = damage;
        this.special = special;
        this.shouldRemove = false;
        this.radius = this.special === 'beam' ? 2 : 4;
        this.pierceCount = 0;
        this.maxPierce = this.special === 'pierce' ? 3 : this.special === 'railgun_pierce' ? 10 : 0;
        
        // Set speed and color based on special ability
        this.speed = this.getProjectileSpeed();
        this.color = this.getProjectileColor();
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / distance) * this.speed;
        this.velocityY = (dy / distance) * this.speed;
    }
    
    getProjectileSpeed() {
        switch(this.special) {
            case 'fast': return 12;
            case 'beam': return 15;
            case 'chain': return 10;
            case 'railgun_pierce': return 20;
            default: return 8;
        }
    }
    
    getProjectileColor() {
        const game = window.game;
        if (game && game.towerTypes) {
            // Find tower type that matches this projectile special
            for (let towerType of Object.values(game.towerTypes)) {
                if (towerType.special === this.special) {
                    return towerType.projectileColor || '#f39c12';
                }
            }
        }
        return '#f39c12'; // Default color
    }
    
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
            this.shouldRemove = true;
        }
    }
    
    checkCollision(enemy) {
        const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
        return distance < this.radius + enemy.radius;
    }
    
    onHit(enemy) {
        // Handle pierce ability
        if (this.maxPierce > 0) {
            this.pierceCount++;
            if (this.pierceCount >= this.maxPierce) {
                this.shouldRemove = true;
            }
        } else {
            this.shouldRemove = true;
        }
        
        // Handle explosive damage
        if (this.special === 'explosive' || this.special === 'mega_explosive' || this.special === 'nuclear') {
            const explosionRadius = this.special === 'nuclear' ? 80 : this.special === 'mega_explosive' ? 50 : 30;
            const game = window.game;
            if (game) {
                game.enemies.forEach(otherEnemy => {
                    if (otherEnemy !== enemy) {
                        const dist = Math.sqrt((otherEnemy.x - enemy.x) ** 2 + (otherEnemy.y - enemy.y) ** 2);
                        if (dist < explosionRadius) {
                            const falloffDamage = this.damage * (1 - dist / explosionRadius) * 0.7;
                            otherEnemy.takeDamage(falloffDamage);
                        }
                    }
                });
            }
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        
        if (this.special === 'beam') {
            // Draw laser beam
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.targetX, this.targetY);
            ctx.stroke();
        } else {
            // Draw normal projectile
            let size = this.radius;
            if (this.special === 'explosive' || this.special === 'mega_explosive') {
                size = this.radius + 2;
            }
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Wait for DOM to be fully loaded before starting game
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting game...');
    const game = new Game();
    window.game = game;
});

// Fallback in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded
} else {
    // DOM already loaded
    console.log('DOM already loaded, starting game immediately...');
    const game = new Game();
    window.game = game;
}