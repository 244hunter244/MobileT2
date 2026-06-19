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

    // Percorre a lista de trás para frente para evitar bugs de remoção
    for (let i = activeEnemies.length - 1; i >= 0; i--) {
        const enemy = activeEnemies[i];

        // Checa se o clique ocorreu dentro do tamanho (80x80) do inimigo
        if (hx >= enemy.x && hx <= enemy.x + enemySize &&
            hy >= enemy.y && hy <= enemy.y + enemySize) {
            
            enemy.hp -= swordDamage; // Aplica o dano de 8

            // Se a vida zerar, elimina o monstro e pontua
            if (enemy.hp <= 0) {
                // Cria os efeitos visuais pixelados de poça e gotas
                if (typeof createDeathEffect === 'function') {
                    createDeathEffect(enemy.x, enemy.y);
                }
                
                // Soma o ponto no HUD (Verifica se a função existe globalmente)
                if (typeof addPoint === 'function') {
                    addPoint();
                }

                enemy.element.remove();      // Tira o GIF da tela
                activeEnemies.splice(i, 1);  // Limpa o array
            }
            break; // Garante que apenas 1 slime sofre dano por clique
        }
    }
}