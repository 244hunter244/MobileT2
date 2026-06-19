// Configura o clique/toque assim que a página estiver pronta
function initInput() {
    const container = document.getElementById('game-container');

    // Funciona tanto para clique de mouse quanto para toque no celular
    container.addEventListener('pointerdown', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;

        // Verifica se o toque aconteceu estritamente dentro da gameArea (com desconto das bordas)
        if (clickX >= gameArea.x + 32 && clickX <= gameArea.x + gameArea.size - 32 &&
            clickY >= gameArea.y + 32 && clickY <= gameArea.y + gameArea.size - 32) {
            
            triggerAttackAnimation(clickX, clickY);
            checkEnemyHit(clickX, clickY);
        }
    });
}

// Cria a espada no local do toque e a rotaciona de 0 a 180 graus
function triggerAttackAnimation(x, y) {
    const container = document.getElementById('game-container');
    const attackImg = document.createElement('img');
    
    attackImg.src = equippedWeapon.src;
    attackImg.style.position = 'absolute';
    attackImg.style.width = '80px';
    attackImg.style.height = '80px';
    // Centraliza o meio da espada no ponto exato do toque
    attackImg.style.left = (x - 40) + 'px';
    attackImg.style.top = (y - 40) + 'px';
    attackImg.style.zIndex = '30';
    attackImg.style.pointerEvents = 'none';
    attackImg.style.imageRendering = 'pixelated';
    attackImg.style.transition = 'transform 0.15s linear'; // Duração do giro
    attackImg.style.transform = 'rotate(0deg)';

    container.appendChild(attackImg);

    // Força o navegador a processar o estado inicial antes de girar
    requestAnimationFrame(() => {
        attackImg.style.transform = 'rotate(180deg)';
    });

    // Remove a espada da tela após a animação acabar
    setTimeout(() => {
        attackImg.remove();
    }, 150);
}

// Verifica se a posição do toque colidiu com a caixa de algum slime vivo
function checkEnemyHit(hx, hy) {
    const swordDamage = 8;

    // Percorre a lista de trás para frente para evitar bugs ao remover itens do array
    for (let i = activeEnemies.length - 1; i >= 0; i--) {
        const enemy = activeEnemies[i];

        // Checa se o clique ocorreu dentro da área visual de 80x80 do inimigo
        if (hx >= enemy.x && hx <= enemy.x + enemySize &&
            hy >= enemy.y && hy <= enemy.y + enemySize) {
            
            enemy.hp -= swordDamage; // Aplica o dano da espada

            // Se a vida zerar ou negativar, destrói o inimigo
            if (enemy.hp <= 0) {
                enemy.element.remove(); // Remove o GIF do HTML
                activeEnemies.splice(i, 1); // Remove do array lógico do jogo
            }
            break; // Interrompe para acertar apenas um inimigo por clique
        }
    }
}