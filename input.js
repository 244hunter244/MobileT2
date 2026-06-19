// Configura o clique/toque assim que a página estiver pronta
function initInput() {
    const container = document.getElementById('game-container');

    // 'pointerdown' é o melhor evento para celular: ele junta o Touch do dedo e o Clique do mouse sem delay
    container.addEventListener('pointerdown', (e) => {
        // Impede comportamentos estranhos de zoom e scroll no celular ao clicar rápido
        e.preventDefault(); 

        const clickX = e.clientX;
        const clickY = e.clientY;

        // Verifica se o toque aconteceu dentro da gameArea (com desconto das bordas de pedra)
        if (clickX >= gameArea.x + 32 && clickX <= gameArea.x + gameArea.size - 32 &&
            clickY >= gameArea.y + 32 && clickY <= gameArea.y + gameArea.size - 32) {
            
            triggerAttackAnimation(clickX, clickY);
            checkEnemyHit(clickX, clickY);
        }
    }, { passive: false }); // Permite o preventDefault() rodar liso no mobile
}

// Cria a espada no local do toque e a rotaciona de 0 a 180 graus
function triggerAttackAnimation(x, y) {
    const container = document.getElementById('game-container');
    const attackImg = document.createElement('img');
    
    attackImg.src = equippedWeapon.src;
    attackImg.style.position = 'absolute';
    attackImg.style.width = '80px';
    attackImg.style.height = '80px';
    attackImg.style.left = (x - 40) + 'px';
    attackImg.style.top = (y - 40) + 'px';
    attackImg.style.zIndex = '30';
    attackImg.style.pointerEvents = 'none';
    attackImg.style.imageRendering = 'pixelated';
    attackImg.style.transition = 'transform 0.15s linear';
    attackImg.style.transform = 'rotate(0deg)';

    container.appendChild(attackImg);

    requestAnimationFrame(() => {
        attackImg.style.transform = 'rotate(180deg)';
    });

    setTimeout(() => {
        attackImg.remove();
    }, 150);
}

// Verifica se a posição do toque colidiu com a caixa de algum slime vivo
function checkEnemyHit(hx, hy) {
    const swordDamage = 8;

    for (let i = activeEnemies.length - 1; i >= 0; i--) {
        const enemy = activeEnemies[i];

        if (hx >= enemy.x && hx <= enemy.x + enemySize &&
            hy >= enemy.y && hy <= enemy.y + enemySize) {
            
            enemy.hp -= swordDamage; 

            if (enemy.hp <= 0) {
                if (typeof createDeathEffect === 'function') {
                    createDeathEffect(enemy.x, enemy.y);
                }
                
                // Força o incremento de pontos diretamente no escopo global
                if (typeof addPoint === 'function') {
                    addPoint();
                }

                enemy.element.remove();              
                activeEnemies.splice(i, 1);          

                // Checa imediatamente se era o último inimigo para invocar a horda aleatória
                checkNextWave(); 
            }
            break; 
        }
    }
}