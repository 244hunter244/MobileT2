const particles = [];
const bloodStains = [];

// Cria a poça pixelada com variação de iluminação e as 5 gotas
function createDeathEffect(ex, ey) {
    const centerX = ex + 40; 
    const centerY = ey + 40;

    // Gerar uma poça pixelada baseada em blocos
    const pixels = [];
    const blockSize = 8; // Tamanho de cada "pixel" da poça
    const radius = 35;   // Raio aproximado da poça

    // Percorre uma grade ao redor do centro do inimigo
    for (let x = -radius; x <= radius; x += blockSize) {
        for (let y = -radius; y <= radius; y += blockSize) {
            // Distância até o centro com uma leve distorção aleatória para não ficar um círculo perfeito
            const dist = Math.sqrt(x * x + y * y) + (Math.random() * 12 - 6);
            
            if (dist < radius) {
                // Sorteia o tom do pixel vermelho para criar variação de iluminação/brilho
                // 0 = Vermelho base, 1 = Tom escuro (sombra), 2 = Tom claro (brilho)
                let colorType = 0;
                const rand = Math.random();
                if (rand < 0.2) colorType = 1;      // Sombra
                else if (rand > 0.85) colorType = 2; // Brilho/Luz

                pixels.push({
                    dx: x,
                    dy: y,
                    colorType: colorType
                });
            }
        }
    }

    bloodStains.push({
        cx: centerX,
        cy: centerY,
        pixels: pixels,
        blockSize: blockSize,
        opacity: 1,
        spawnTime: Date.now()
    });

    // Cria as 5 partículas/gotas
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
    // Atualiza as gotas voando
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.04; 
        if (p.opacity <= 0) particles.splice(i, 1);
    }

    // Atualiza o tempo de sumiço das poças (4 segundos firme, depois esmaece)
    for (let i = bloodStains.length - 1; i >= 0; i--) {
        const s = bloodStains[i];
        if (Date.now() - s.spawnTime > 4000) {
            s.opacity -= 0.02; 
            if (s.opacity <= 0) bloodStains.splice(i, 1);
        }
    }
}

function drawEffects() {
    // Garante que o canvas não suavize as bordas dos retângulos
    ctx.imageSmoothingEnabled = false;

    // Desenha as poças pixel por pixel com suas cores variantes
    bloodStains.forEach(s => {
        s.pixels.forEach(p => {
            let r = 150, g = 0, b = 0; // Vermelho padrão medieval

            if (p.colorType === 1) {
                // Sombra (Vermelho bem escuro)
                r = 90; g = 0; b = 0;
            } else if (p.colorType === 2) {
                // Brilho (Vermelho vivo/alaranjado)
                r = 210; g = 40; b = 40;
            }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.opacity})`;
            ctx.fillRect(
                Math.floor(s.cx + p.dx), 
                Math.floor(s.cy + p.dy), 
                s.blockSize, 
                s.blockSize
            );
        });
    });

    // Desenha as partículas/gotas
    particles.forEach(p => {
        ctx.fillStyle = `rgba(210, 0, 0, ${p.opacity})`;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.floor(p.size), Math.floor(p.size));
    });
}