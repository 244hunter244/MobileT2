const particles = [];
const bloodStains = [];

// Cria a explosão de 5 gotas e a mancha no chão
function createDeathEffect(ex, ey) {
    const centerX = ex + 40; // Centraliza no monstro (80px / 2)
    const centerY = ey + 40;

    // 1. Cria a mancha no chão
    bloodStains.push({
        x: ex,
        y: ey,
        size: 80,
        opacity: 1,
        // Sorteia uma variação visual para a mancha não ser sempre igual
        style: Math.floor(Math.random() * 3), 
        spawnTime: Date.now()
    });

    // 2. Cria as 5 partículas/gotas
    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        
        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 4 + 4, // Tamanho do pixel da gota
            opacity: 1
        });
    }
}

// Atualiza a posição das partículas e o tempo das manchas
function updateEffects() {
    // Atualiza gotas
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.04; // Desaparece gradualmente
        if (p.opacity <= 0) particles.splice(i, 1);
    }

    // Atualiza manchas (somem após 4 segundos)
    for (let i = bloodStains.length - 1; i >= 0; i--) {
        const s = bloodStains[i];
        if (Date.now() - s.spawnTime > 4000) {
            s.opacity -= 0.02; // Efeito de sumir sumindo devagar
            if (s.opacity <= 0) bloodStains.splice(i, 1);
        }
    }
}

// Desenha tudo pixelado no Canvas
function drawEffects() {
    // Desativa o antialiasing para manter o efeito pixel art nítido
    ctx.imageSmoothingEnabled = false;

    // Desenha as manchas de formato aleatório
    bloodStains.forEach(s => {
        ctx.fillStyle = `rgba(170, 0, 0, ${s.opacity})`;
        if (s.style === 0) {
            ctx.fillRect(s.x + 10, s.y + 20, s.size - 20, s.size - 40);
            ctx.fillRect(s.x + 20, s.y + 10, s.size - 40, s.size - 20);
        } else if (s.style === 1) {
            ctx.fillRect(s.x + 15, s.y + 15, s.size - 30, s.size - 30);
        } else {
            ctx.fillRect(s.x + 5, s.y + 25, s.size - 10, s.size - 50);
            ctx.fillRect(s.x + 25, s.y + 5, s.size - 50, s.size - 10);
        }
    });

    // Desenha as gotas/partículas vermelhas
    particles.forEach(p => {
        ctx.fillStyle = `rgba(210, 0, 0, ${p.opacity})`;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.floor(p.size), Math.floor(p.size));
    });
}