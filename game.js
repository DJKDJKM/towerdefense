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
        
        this.setupEventListeners();
        this.gameLoop();
    }
    
    createLevels() {
        return [
            {
                id: 1,
                name: "Grasslands",
                backgroundColor: '#27ae60',
                path: [
                    {x: 0, y: 300}, {x: 200, y: 300}, {x: 200, y: 150},
                    {x: 400, y: 150}, {x: 400, y: 450}, {x: 600, y: 450},
                    {x: 600, y: 300}, {x: 800, y: 300}
                ],
                spawnInterval: 120,
                enemiesPerWave: 8,
                enemyTypes: ['basic']
            },
            {
                id: 2,
                name: "Desert Valley",
                backgroundColor: '#f4d03f',
                path: [
                    {x: 0, y: 100}, {x: 150, y: 100}, {x: 150, y: 300},
                    {x: 300, y: 300}, {x: 300, y: 500}, {x: 500, y: 500},
                    {x: 500, y: 200}, {x: 650, y: 200}, {x: 650, y: 400},
                    {x: 800, y: 400}
                ],
                spawnInterval: 100,
                enemiesPerWave: 10,
                enemyTypes: ['basic', 'fast']
            },
            {
                id: 3,
                name: "Frozen Tundra",
                backgroundColor: '#85c1e9',
                path: [
                    {x: 0, y: 200}, {x: 100, y: 200}, {x: 100, y: 400},
                    {x: 250, y: 400}, {x: 250, y: 100}, {x: 400, y: 100},
                    {x: 400, y: 350}, {x: 550, y: 350}, {x: 550, y: 150},
                    {x: 700, y: 150}, {x: 700, y: 450}, {x: 800, y: 450}
                ],
                spawnInterval: 90,
                enemiesPerWave: 12,
                enemyTypes: ['basic', 'fast', 'tank']
            },
            {
                id: 4,
                name: "Volcanic Rim",
                backgroundColor: '#cb4335',
                path: [
                    {x: 0, y: 300}, {x: 100, y: 300}, {x: 100, y: 100},
                    {x: 300, y: 100}, {x: 300, y: 500}, {x: 500, y: 500},
                    {x: 500, y: 200}, {x: 700, y: 200}, {x: 700, y: 400},
                    {x: 800, y: 400}
                ],
                spawnInterval: 80,
                enemiesPerWave: 15,
                enemyTypes: ['basic', 'fast', 'tank', 'boss']
            },
            {
                id: 5,
                name: "Shadow Realm",
                backgroundColor: '#2c3e50',
                path: [
                    {x: 0, y: 250}, {x: 120, y: 250}, {x: 120, y: 450},
                    {x: 280, y: 450}, {x: 280, y: 150}, {x: 440, y: 150},
                    {x: 440, y: 350}, {x: 600, y: 350}, {x: 600, y: 100},
                    {x: 720, y: 100}, {x: 720, y: 500}, {x: 800, y: 500}
                ],
                spawnInterval: 70,
                enemiesPerWave: 18,
                enemyTypes: ['basic', 'fast', 'tank', 'boss', 'flying']
            }
        ];
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.placeTower(x, y);
        });
    }
    
    placeTower(x, y) {
        if (this.gameState.money >= 50) {
            if (this.isValidTowerPosition(x, y)) {
                this.towers.push(new Tower(x, y));
                this.gameState.money -= 50;
                this.updateUI();
            }
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
                    this.projectiles.splice(index, 1);
                    
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
        const levelMultiplier = 1 + (level - 1) * 0.3;
        const waveMultiplier = 1 + (wave - 1) * 0.2;
        
        switch(type) {
            case 'basic':
                this.speed = (1.0 + wave * 0.05) * levelMultiplier;
                this.health = Math.floor((50 + wave * 8) * levelMultiplier);
                this.radius = 12;
                this.points = 10 * level;
                this.money = 12 + level * 2;
                this.color = '#e74c3c';
                break;
            case 'fast':
                this.speed = (2.0 + wave * 0.1) * levelMultiplier;
                this.health = Math.floor((35 + wave * 6) * levelMultiplier);
                this.radius = 10;
                this.points = 15 * level;
                this.money = 18 + level * 3;
                this.color = '#3498db';
                break;
            case 'tank':
                this.speed = (0.6 + wave * 0.03) * levelMultiplier;
                this.health = Math.floor((150 + wave * 25) * levelMultiplier);
                this.radius = 16;
                this.points = 25 * level;
                this.money = 30 + level * 5;
                this.color = '#2c3e50';
                break;
            case 'boss':
                this.speed = (0.8 + wave * 0.05) * levelMultiplier;
                this.health = Math.floor((250 + wave * 40) * levelMultiplier);
                this.radius = 20;
                this.points = 50 * level;
                this.money = 60 + level * 8;
                this.color = '#8e44ad';
                break;
            case 'flying':
                this.speed = (1.5 + wave * 0.08) * levelMultiplier;
                this.health = Math.floor((75 + wave * 12) * levelMultiplier);
                this.radius = 14;
                this.points = 30 * level;
                this.money = 40 + level * 6;
                this.color = '#e67e22';
                this.flying = true;
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
        
        const target = this.path[this.pathIndex + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.speed) {
            this.pathIndex++;
            if (this.pathIndex >= this.path.length - 1) {
                this.reachedEnd = true;
            }
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
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
    }
}

class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.damage = 25;
        this.fireRate = 60;
        this.fireTimer = 0;
        this.target = null;
        this.size = 20;
    }
    
    update(enemies, projectiles) {
        this.fireTimer--;
        
        this.target = this.findTarget(enemies);
        
        if (this.target && this.fireTimer <= 0) {
            projectiles.push(new Projectile(this.x, this.y, this.target, this.damage));
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
    
    draw(ctx) {
        ctx.fillStyle = '#34495e';
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        
        if (this.target) {
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.target.x, this.target.y);
            ctx.stroke();
        }
    }
}

class Projectile {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.targetX = target.x;
        this.targetY = target.y;
        this.speed = 8;
        this.damage = damage;
        this.shouldRemove = false;
        this.radius = 4;
        
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / distance) * this.speed;
        this.velocityY = (dy / distance) * this.speed;
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
    
    draw(ctx) {
        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

const game = new Game();