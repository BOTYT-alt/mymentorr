// Advanced Dynamic Theme System
let sessionStartTime = Date.now();
let currentTheme = 0;
const themes = [
    { 
        accent: '#00f6ff',
        background: 'https://images.unsplash.com/photo-1635776062127-d379bae753c2?auto=format&fit=crop&w=2000&q=80', // Futuristic city
        secondaryColor: '#7000ff'
    },
    {
        accent: '#ff00e5',
        background: 'https://images.unsplash.com/photo-1614726365952-5711717d4d92?auto=format&fit=crop&w=2000&q=80', // Abstract tech
        secondaryColor: '#00ff88'
    },
    {
        accent: '#00ff88',
        background: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80', // Space
        secondaryColor: '#ff00e5'
    },
    {
        accent: '#ff6b00',
        background: 'https://images.unsplash.com/photo-1535868463750-c78d9c19c90e?auto=format&fit=crop&w=2000&q=80', // Cyberpunk
        secondaryColor: '#00f6ff'
    }
];

// Initialize dynamic background and theme system
function initializeDynamicContent() {
    createDynamicBackground();
    setupHUD();
    setupTimeBasedContent();
    updateThemeBasedOnTime();
    createParticleEffect();
    initializeHolographicEffects();
}

// Particle System
function createParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${parseInt(themes[currentTheme].accent.slice(1, 3), 16)}, 
                                 ${parseInt(themes[currentTheme].accent.slice(3, 5), 16)}, 
                                 ${parseInt(themes[currentTheme].accent.slice(5, 7), 16)}, 
                                 ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();
}

// Holographic Effects
function initializeHolographicEffects() {
    const hudPanels = document.querySelectorAll('.hud-panel');
    
    hudPanels.forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 30;
            const angleY = (centerX - x) / 30;
            
            panel.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
            panel.style.backgroundPosition = `${x/5}% ${y/5}%`;
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            panel.style.backgroundPosition = 'center';
        });
    });
}

function createDynamicBackground() {
    const bg = document.createElement('div');
    bg.className = 'dynamic-bg';
    document.body.prepend(bg);
    updateBackground();
}

function setupHUD() {
    const hud = document.createElement('div');
    hud.className = 'hud-container';
    
    // Create main HUD panels
    const hudContent = `
        <div class="hud-panel" id="timePanel">
            <div class="panel-header">
                <h3>Neural Sync Status</h3>
                <div class="panel-controls">
                    <button class="hud-btn minimize">_</button>
                    <button class="hud-btn expand">□</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="stat-grid">
                    <div class="stat-item">
                        <div class="stat-label">Session Time</div>
                        <div class="stat-value" id="timeSpent">0:00</div>
                        <div class="stat-graph">
                            <canvas class="stat-canvas" width="100" height="30"></canvas>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Focus Level</div>
                        <div class="stat-value" id="focusLevel">97%</div>
                        <div class="stat-graph">
                            <canvas class="stat-canvas" width="100" height="30"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="hud-panel" id="todoPanel">
            <div class="panel-header">
                <h3>Neural Tasks</h3>
                <div class="panel-controls">
                    <button class="hud-btn minimize">_</button>
                    <button class="hud-btn expand">□</button>
                </div>
            </div>
            <div class="panel-content">
                <div id="todoList"></div>
                <div class="task-metrics">
                    <div class="metric">
                        <span class="metric-label">Completion Rate</span>
                        <span class="metric-value" id="completionRate">0%</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Efficiency Score</span>
                        <span class="metric-value" id="efficiencyScore">A+</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="hud-panel" id="systemPanel">
            <div class="panel-header">
                <h3>System Status</h3>
                <div class="panel-controls">
                    <button class="hud-btn minimize">_</button>
                    <button class="hud-btn expand">□</button>
                </div>
            </div>
            <div class="panel-content">
                <div class="system-metrics">
                    <div class="metric-ring">
                        <svg viewBox="0 0 36 36" class="circular-chart">
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.1)"
                                stroke-width="2"
                            />
                            <path d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="var(--primary)"
                                stroke-width="2"
                                stroke-dasharray="75, 100"
                                class="progress"
                            />
                        </svg>
                        <div class="metric-value">75%</div>
                    </div>
                    <div class="status-list">
                        <div class="status-item">
                            <span class="status-label">Neural Link</span>
                            <span class="status-value active">Connected</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Sync Rate</span>
                            <span class="status-value">98.2 Hz</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Data Flow</span>
                            <span class="status-value">Optimal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    hud.innerHTML = hudContent;
    document.body.appendChild(hud);
    
    // Initialize HUD interactions
    initializeHUDControls();
    startHUDAnimations();
}

function initializeHUDControls() {
    // Panel drag functionality
    const panels = document.querySelectorAll('.hud-panel');
    panels.forEach(panel => {
        const header = panel.querySelector('.panel-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === header) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                panel.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    });

    // Panel controls
    document.querySelectorAll('.hud-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.hud-panel');
            const content = panel.querySelector('.panel-content');
            
            if (btn.classList.contains('minimize')) {
                content.style.height = content.style.height === '0px' ? 'auto' : '0px';
            } else if (btn.classList.contains('expand')) {
                panel.classList.toggle('expanded');
            }
        });
    });
}

function startHUDAnimations() {
    // Animate stat graphs
    const canvases = document.querySelectorAll('.stat-canvas');
    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const points = [];
        
        function addPoint() {
            points.push(Math.random() * 30);
            if (points.length > 20) points.shift();
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - points[0]);
            
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(i * (canvas.width / 20), canvas.height - points[i]);
            }
            
            ctx.strokeStyle = 'var(--primary)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        setInterval(addPoint, 1000);
    });

    // Update metrics periodically
    setInterval(() => {
        document.querySelector('#focusLevel').textContent = Math.floor(90 + Math.random() * 10) + '%';
        document.querySelector('#efficiencyScore').textContent = ['A+', 'A', 'A-'][Math.floor(Math.random() * 3)];
        
        // Animate progress rings
        document.querySelectorAll('.progress').forEach(ring => {
            const newProgress = Math.floor(70 + Math.random() * 30);
            ring.style.strokeDasharray = `${newProgress}, 100`;
        });
    }, 5000);
}

// Time-based content updates
function updateThemeBasedOnTime() {
    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
    const themeIndex = Math.floor(timeSpent / 300) % themes.length; // Change theme every 5 minutes
    
    if (themeIndex !== currentTheme) {
        currentTheme = themeIndex;
        updateBackground();
        document.documentElement.style.setProperty('--primary', themes[themeIndex].accent);
    }
    
    document.getElementById('timeSpent').textContent = formatTime(timeSpent);
    requestAnimationFrame(updateThemeBasedOnTime);
}

function updateBackground() {
    const bg = document.querySelector('.dynamic-bg');
    if (bg) {
        bg.style.opacity = '0';
        
        // Get time of day to adjust image category
        const hour = new Date().getHours();
        let category;
        
        if (hour >= 5 && hour < 12) {
            category = 'morning,technology';
        } else if (hour >= 12 && hour < 17) {
            category = 'afternoon,future';
        } else if (hour >= 17 && hour < 20) {
            category = 'evening,cyberpunk';
        } else {
            category = 'night,space';
        }
        
        // Fetch new image from Unsplash with dynamic category
        const imageUrl = `https://source.unsplash.com/1920x1080/?${category}`;
        
        // Preload image
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            bg.style.backgroundImage = `url(${imageUrl})`;
            bg.style.opacity = '1';
            
            // Extract dominant color for theme adaptation
            if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
                bg.style.animation = 'backgroundZoom 20s ease-in-out infinite alternate';
            }
        };
    }
}

// Enhanced background effects
const styleSheet = document.styleSheet || document.createElement('style');
styleSheet.innerHTML = `
@keyframes backgroundZoom {
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
}
`;
document.head.appendChild(styleSheet);

// Particle System and Effects
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.setupCanvas();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }
    
    setupCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        document.body.appendChild(this.canvas);
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                life: 1,
                color: this.getRandomColor()
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            themes[currentTheme].accent,
            themes[currentTheme].secondaryColor,
            '#ffffff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.addParticlesAtMouse();
        });
    }
    
    addParticlesAtMouse() {
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: this.mouseX,
                y: this.mouseY,
                size: Math.random() * 3 + 2,
                speedX: Math.random() * 4 - 2,
                speedY: Math.random() * 4 - 2,
                life: 1,
                color: this.getRandomColor()
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 0.01;
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                return;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.life * 255).toString(16).padStart(2, '0');
            this.ctx.fill();
            
            // Connect nearby particles
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = particle.color + Math.floor((1 - distance / 100) * 255).toString(16).padStart(2, '0');
                    this.ctx.stroke();
                }
            });
        });
        
        // Add new particles if needed
        if (this.particles.length < 100) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                life: 1,
                color: this.getRandomColor()
            });
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Visual Learning with Enhanced Visualization
function generateVisual() {
    const topic = document.getElementById("visualTopic").value.trim();
    const result = document.getElementById("visualResult");
    if (!topic) return alert("Please enter a topic!");

    result.innerHTML = `
        <div class="visual-container">
            <h4>Generated Visual Concept</h4>
            <div class="image-wrapper">
                <img src="https://source.unsplash.com/1200x600/?${encodeURIComponent(topic)}" alt="${topic}" />
                <div class="image-overlay"></div>
            </div>
            <p class="visual-description">AI-enhanced visualization of <b>${topic}</b></p>
            <div class="visual-stats">
                <div class="stat">
                    <span class="stat-label">Complexity</span>
                    <span class="stat-value">${Math.floor(Math.random() * 30 + 70)}%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Relevance</span>
                    <span class="stat-value">${Math.floor(Math.random() * 20 + 80)}%</span>
                </div>
            </div>
        </div>
    `;
}

// Audio Learning Mockup
function generateAudio() {
    const topic = document.getElementById("audioTopic").value.trim();
    const result = document.getElementById("audioResult");
    if (!topic) return alert("Please enter a topic!");

    result.innerHTML = `
        <h4>Generated Audio Lesson:</h4>
        <audio controls>
            <source src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg" type="audio/ogg">
            Your browser does not support the audio element.
        </audio>
        <p>This is a simulated audio lesson on <b>${topic}</b>.</p>
    `;
}

// Advanced Todo System with AI Progress Tracking
class AdvancedTodoSystem {
    constructor() {
        this.todos = [];
        this.container = document.getElementById('todoList');
        this.stats = {
            totalCompleted: 0,
            streakDays: 0,
            efficiency: 100,
            lastActivity: Date.now()
        };
        this.achievements = new AchievementSystem();
        this.loadFromStorage();
        this.startActivityTracking();
    }

    loadFromStorage() {
        const saved = localStorage.getItem('todoSystem');
        if (saved) {
            const data = JSON.parse(saved);
            this.todos = data.todos || [];
            this.stats = data.stats || this.stats;
        }
    }

    saveToStorage() {
        localStorage.setItem('todoSystem', JSON.stringify({
            todos: this.todos,
            stats: this.stats
        }));
    }

    addTodo(text) {
        if (!text.trim()) return;

        const todo = {
            id: Date.now(),
            text,
            completed: false,
            created: Date.now(),
            priority: this.analyzePriority(text),
            category: this.analyzeCategory(text),
            timeEstimate: this.estimateTime(text)
        };

        this.todos.push(todo);
        this.updateEfficiency();
        this.render();
        this.saveToStorage();

        // Trigger achievement check
        this.achievements.checkAchievement('taskCreated');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            if (todo.completed) {
                todo.completedAt = Date.now();
                this.stats.totalCompleted++;
                this.achievements.checkAchievement('taskCompleted');
            }
            this.updateEfficiency();
            this.render();
            this.saveToStorage();
        }
    }

    analyzePriority(text) {
        const urgentKeywords = ['urgent', 'asap', 'important', 'critical'];
        const lowKeywords = ['later', 'whenever', 'optional'];
        
        text = text.toLowerCase();
        if (urgentKeywords.some(word => text.includes(word))) return 'high';
        if (lowKeywords.some(word => text.includes(word))) return 'low';
        return 'medium';
    }

    analyzeCategory(text) {
        const categories = {
            learning: ['study', 'learn', 'read', 'practice'],
            work: ['work', 'project', 'meeting', 'deadline'],
            health: ['exercise', 'workout', 'gym', 'health'],
            personal: ['home', 'family', 'friend', 'personal']
        };

        text = text.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(word => text.includes(word))) return category;
        }
        return 'other';
    }

    estimateTime(text) {
        const timeKeywords = {
            quick: ['quick', 'fast', 'brief'],
            medium: ['medium', 'moderate'],
            long: ['long', 'extensive', 'comprehensive']
        };

        text = text.toLowerCase();
        for (const [duration, keywords] of Object.entries(timeKeywords)) {
            if (keywords.some(word => text.includes(word))) return duration;
        }
        return 'medium';
    }

    updateEfficiency() {
        const completedTodos = this.todos.filter(t => t.completed);
        if (completedTodos.length === 0) return;

        const averageCompletionTime = completedTodos.reduce((acc, todo) => {
            return acc + (todo.completedAt - todo.created);
        }, 0) / completedTodos.length;

        const efficiency = Math.min(100, Math.max(0,
            100 * (1 - (averageCompletionTime / (24 * 60 * 60 * 1000)))
        ));

        this.stats.efficiency = Math.round(efficiency);
        this.updateProgressRing();
    }

    render() {
        // Update completion rate
        const completionRate = Math.round((this.todos.filter(t => t.completed).length / Math.max(1, this.todos.length)) * 100);
        document.getElementById('completionRate').textContent = `${completionRate}%`;

        // Update efficiency score
        document.getElementById('efficiencyScore').textContent = this.getEfficiencyGrade();

        // Render todos with categories and priorities
        this.container.innerHTML = this.todos
            .map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}"
                     onclick="todoList.toggleTodo(${todo.id})">
                    <div class="todo-checkbox">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                        <div class="checkbox-ring"></div>
                    </div>
                    <div class="todo-content">
                        <span class="todo-text">${todo.text}</span>
                        <div class="todo-meta">
                            <span class="todo-category">${todo.category}</span>
                            <span class="todo-time">${todo.timeEstimate}</span>
                        </div>
                    </div>
                    <div class="todo-priority" title="Priority: ${todo.priority}">
                        ${this.getPriorityIcon(todo.priority)}
                    </div>
                </div>
            `).join('');
    }

    getEfficiencyGrade() {
        if (this.stats.efficiency >= 90) return 'A+';
        if (this.stats.efficiency >= 80) return 'A';
        if (this.stats.efficiency >= 70) return 'B+';
        if (this.stats.efficiency >= 60) return 'B';
        return 'C+';
    }

    getPriorityIcon(priority) {
        const icons = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };
        return icons[priority] || '⚪';
    }
}

class AchievementSystem {
    constructor() {
        this.achievements = {
            taskMaster: {
                name: 'Task Master',
                description: 'Complete 50 tasks',
                progress: 0,
                threshold: 50,
                reward: 'Unlocked custom themes'
            },
            speedDemon: {
                name: 'Speed Demon',
                description: 'Maintain 90%+ efficiency for 7 days',
                progress: 0,
                threshold: 7,
                reward: 'Unlocked advanced analytics'
            },
            consistent: {
                name: 'Consistent Achiever',
                description: 'Maintain a 5-day streak',
                progress: 0,
                threshold: 5,
                reward: 'Unlocked priority automation'
            }
        };
    }

    checkAchievement(trigger) {
        switch(trigger) {
            case 'taskCompleted':
                this.updateProgress('taskMaster');
                break;
            case 'highEfficiency':
                this.updateProgress('speedDemon');
                break;
            case 'dailyStreak':
                this.updateProgress('consistent');
                break;
        }
    }

    updateProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return;

        achievement.progress++;
        if (achievement.progress >= achievement.threshold) {
            this.unlockAchievement(achievementId);
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement.unlocked) {
            achievement.unlocked = true;
            this.showAchievementNotification(achievement);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <h4>🏆 Achievement Unlocked!</h4>
            <p>${achievement.name}</p>
            <p class="reward">Reward: ${achievement.reward}</p>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

// AI Mentor Mock Chat
function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();
  if (!message) return;

  // Display user message
  chatBox.innerHTML += `<div class="message user"><b>You:</b> ${message}</div>`;

  // Mock AI response
  setTimeout(() => {
    const aiResponse = `<div class="message ai"><b>MyMentor:</b> Here's a simple explanation of "${message}". Focus on understanding the key concepts step-by-step!</div>`;
    chatBox.innerHTML += aiResponse;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);

  input.value = "";
}
