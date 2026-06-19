const particles = [];
const bloodStains = [];

function createDeathEffect(ex, ey) {
    const centerX = ex + 40; 
    const centerY = ey + 40;

    // Salva posições de "sub-poças" para criar o formato de mancha orgânica
    const blobs = [];
    const numBlobs = Math.floor(Math.random() * 3) + 3; // de 3 a 5 círculos por poça
    
    for(let i=0; i<numBlobs; i++) {
        blobs.push({
            offsetX: (Math.random() * 40) - 20,
            offsetY: (Math.random() * 40) - 20,
            radius: (Math.random() * 15) + 10
        });
    }

    bloodStains.push({
        x: centerX,
        y: centerY,
        blobs: blobs,
        opacity: 1,
        spawnTime: Date.now()
    });

    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        
        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 4, 
            opacity: 1
        });
    }
}

function updateEffects() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.04; 
        if (p.opacity <= 0) particles.splice(i, 1);
    }

    for (let i = bloodStains.length - 1; i >= 0; i--) {
        const s = bloodStains[i];
        if (Date.now() - s.spawnTime > 4000) {
            s.opacity -= 0.02; 
            if (s.opacity <= 0) bloodStains.splice(i, 1);
        }
    }
}

function drawEffects() {
    // Força visualização pixelada sem suavizar bordas
    ctx.imageSmoothingEnabled = false;

    // Desenha as poças arredondadas e orgânicas
    bloodStains.forEach(s => {
        ctx.fillStyle = `rgba(160, 0, 0, ${s.opacity})`;
        s.blobs.forEach(b => {
            ctx.beginPath();
            ctx.arc(s.x + b.offsetX, s.y + b.offsetY, b.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    });

    particles.forEach(p => {
        ctx.fillStyle = `rgba(210, 0, 0, ${p.opacity})`;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.floor(p.size), Math.floor(p.size));
    });
}