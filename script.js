let currentScene = 1;
let sceneStep = 1;
let isTyping = false;

// Particle Engine Global Definitions
let canvas, ctx;
let particles = [];
let mouseParticles = []; // New array dedicated to tracking her interaction
let animationFrameId;
let activeAmbientType = 'rain';

// Mouse / Touch Position Tracker
let mouse = { x: undefined, y: undefined };

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('ambient-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        generateGlowTrace();
    });

    // Track touch movement for mobile devices
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            generateGlowTrace();
        }
    });

    startAmbientEngine('rain');

    document.body.addEventListener('click', handleGlobalClick);
    
    const explicitInteractions = document.querySelectorAll('.envelope, .action-btn, .polaroid');
    explicitInteractions.forEach(element => {
        element.addEventListener('click', (event) => event.stopPropagation());
    });
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Generates the interactive trail particles
function generateGlowTrace() {
    // Determine particle type based on the active scene's mood
    let traceType = 'spark'; 
    if (activeAmbientType === 'sakura' || activeAmbientType === 'hearts') {
        traceType = Math.random() > 0.4 ? 'petal' : 'spark';
    }

    // Spawn 2 particles per movement burst for a soft, uncluttered look
    for (let i = 0; i < 2; i++) {
        mouseParticles.push({
            x: mouse.x,
            y: mouse.y,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() * 2 - 1) * 0.5,
            speedY: -Math.random() * 1.5 - 0.5, // Drifts gently upward
            opacity: 0.8,
            decay: Math.random() * 0.015 + 0.01, // How fast it fades out
            angle: Math.random() * Math.PI * 2,
            spin: Math.random() * 0.05 - 0.025,
            type: traceType
        });
    }
}

function handleGlobalClick() {
    if (isTyping) return; 

    switch(currentScene) {
        case 1:
            goToScene(2);
            break;
        case 2:
            goToScene(3);
            break;
        case 3:
            goToScene(4);
            break;
        case 4:
            goToScene(5);
            break;
        case 5:
            if (sceneStep === 1) {
                sceneStep = 2;
                typeWriterEffect("scene5-text-2", "I'm here because I still choose you.", 50);
            } else if (sceneStep === 2) {
                sceneStep = 3;
                typeWriterEffect("scene5-text-3", "Every single day.", 60);
            } else if (sceneStep === 3) {
                goToScene(6);
            }
            break;
        case 6:
            if (sceneStep === 1) {
                sceneStep = 2;
                buildBridgePlanks();
            } else if (sceneStep === 2) {
                sceneStep = 3;
                typeWriterEffect("bridge-text-1", "I'll never force you to cross.", 50);
            } else if (sceneStep === 3) {
                sceneStep = 4;
                typeWriterEffect("bridge-text-2", "I'll simply keep making this bridge stronger.", 50);
            } else if (sceneStep === 4) {
                goToScene(7);
            }
            break;
        case 7:
            const letterEnvelope = document.querySelector('.envelope');
            if (letterEnvelope.classList.contains('open')) {
                goToScene(8);
            } else {
                openLetter();
            }
            break;
        case 8:
            if (sceneStep === 1) {
                sceneStep = 2;
                typeWriterEffect("final-text-2", "Only if both hearts choose to write it together.", 50, () => {
                    const setupBtn = document.getElementById("start-chapter-btn");
                    setupBtn.classList.remove("hidden");
                    setupBtn.style.animation = "fadeInBackground 1s forwards";
                });
            }
            break;
    }
}

function goToScene(sceneNumber) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('visible');
    });

    currentScene = sceneNumber;
    sceneStep = 1; 
    
    const targetScene = document.getElementById(`scene-${sceneNumber}`);
    targetScene.classList.add('visible');

    const ambientType = targetScene.getAttribute('data-ambient');
    if (ambientType) {
        startAmbientEngine(ambientType);
    }

    if (sceneNumber === 3) {
        animateCards();
    } else if (sceneNumber === 5) {
        typeWriterEffect("scene5-text-1", "I'm not here because I'm afraid of losing you.", 50);
    } else if (sceneNumber === 6) {
        document.getElementById("bridge-planks").innerHTML = "";
        document.getElementById("bridge-text-1").innerHTML = "";
        document.getElementById("bridge-text-2").innerHTML = "";
    } else if (sceneNumber === 8) {
        typeWriterEffect("final-text-1", "Every beautiful story deserves another chapter...", 50);
    }
}

function typeWriterEffect(elementId, text, speed, callback) {
    let index = 0;
    isTyping = true;
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            isTyping = false;
            if (callback) callback();
        }
    }
    type();
}

function animateCards() {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.25}s`;
    });
}

function buildBridgePlanks() {
    isTyping = true;
    const planksData = ["Patience", "Respect", "Honesty", "Consistency", "Understanding", "Communication"];
    const bridgeContainer = document.getElementById("bridge-planks");
    bridgeContainer.innerHTML = ""; 

    planksData.forEach((text, index) => {
        const plank = document.createElement("div");
        plank.className = "real-plank";
        
        const label = document.createElement("span");
        label.className = "plank-title";
        label.innerText = text;
        
        plank.appendChild(label);
        plank.style.animationDelay = `${index * 0.45}s`;
        label.style.animationDelay = `${(index * 0.45) + 0.3}s`;
        
        bridgeContainer.appendChild(plank);
    });

    setTimeout(() => {
        isTyping = false;
    }, (planksData.length * 450) + 400);
}

function openLetter() {
    document.querySelector('.envelope').classList.add('open');
}

document.addEventListener('DOMContentLoaded', () => {
    const actionBtn = document.getElementById("start-chapter-btn");
    actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        actionBtn.style.display = "none";
        const heartContainer = document.querySelector('.two-hearts-container');
        heartContainer.style.opacity = "1";
        setTimeout(() => {
            heartContainer.classList.add('animate');
        }, 200);
    });
});

/* --- Contextual Ambient Particle Matrix Engine --- */
function startAmbientEngine(type) {
    activeAmbientType = type;
    particles = [];
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    let maxCount = 60;
    if (type === 'rain') maxCount = 120;
    if (type === 'hearts') maxCount = 20;

    for (let i = 0; i < maxCount; i++) {
        particles.push(createParticle(type, true));
    }
    
    runAmbientLoop();
}

function createParticle(type, initY = false) {
    const p = {
        type: type,
        x: Math.random() * canvas.width,
        y: initY ? Math.random() * canvas.height : -20,
        size: 0,
        speedX: 0,
        speedY: 0,
        opacity: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01
    };

    if (type === 'rain') {
        p.speedY = Math.random() * 6 + 6;
        p.speedX = -1 - Math.random() * 1;
        p.size = Math.random() * 1.5 + 1;
    } else if (type === 'fireflies') {
        p.speedY = Math.random() * 0.6 - 0.3;
        p.speedX = Math.random() * 0.6 - 0.3;
        p.size = Math.random() * 2 + 1.5;
    } else if (type === 'sakura') {
        p.speedY = Math.random() * 1 + 1;
        p.speedX = Math.random() * 1 + 0.5;
        p.size = Math.random() * 4 + 4;
    } else if (type === 'hearts') {
        p.speedY = -(Math.random() * 0.8 + 0.4);
        p.speedX = Math.random() * 0.4 - 0.2;
        p.size = Math.random() * 8 + 8;
        if (!initY) p.y = canvas.height + 20;
    }
    return p;
}

function runAmbientLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Render Background Ambient Particles (Rain, Sakura, etc.)
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        if (p.type === 'fireflies') {
            p.speedX += (Math.random() * 0.1 - 0.05);
            p.speedY += (Math.random() * 0.1 - 0.05);
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === 'rain') {
            ctx.strokeStyle = '#68708c';
            ctx.lineWidth = p.size;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.speedY * 1.5);
            ctx.stroke();
        } else if (p.type === 'fireflies') {
            ctx.fillStyle = '#e2ba73';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#e2ba73';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'sakura') {
            ctx.fillStyle = '#fcaec1';
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'hearts') {
            ctx.fillStyle = '#e05270';
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * 0.2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-p.size/2, -p.size/2, -p.size, 0, 0, p.size);
            ctx.bezierCurveTo(p.size, 0, p.size/2, -p.size/2, 0, 0);
            ctx.fill();
        }

        ctx.restore();

        let outOfBounds = false;
        if (p.type === 'hearts' && p.y < -20) outOfBounds = true;
        if (p.type !== 'hearts' && p.y > canvas.height + 20) outOfBounds = true;
        if (p.x > canvas.width + 20 || p.x < -20) outOfBounds = true;

        if (outOfBounds) {
            particles[i] = createParticle(activeAmbientType, false);
        }
    }

    // 2. Render & Animate Interactive Mouse Glow Trail Layer
    for (let i = mouseParticles.length - 1; i >= 0; i--) {
        let mp = mouseParticles[i];
        mp.x += mp.speedX;
        mp.y += mp.speedY;
        mp.angle += mp.spin;
        mp.opacity -= mp.decay; // Gradually reduce transparency

        // Remove dead trail elements to free system memory
        if (mp.opacity <= 0) {
            mouseParticles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = mp.opacity;

        if (mp.type === 'spark') {
            // Radiant gold glowing particle
            ctx.fillStyle = '#ffd79e';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#e2ba73';
            ctx.beginPath();
            ctx.arc(mp.x, mp.y, mp.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
        } else if (mp.type === 'petal') {
            // Small swirling pink cherry blossom petal
            ctx.fillStyle = '#ffbccc';
            ctx.translate(mp.x, mp.y);
            ctx.rotate(mp.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, mp.size * 1.3, mp.size * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    animationFrameId = requestAnimationFrame(runAmbientLoop);
}
