// Cria a instância do áudio globalmente para evitar atrasos (delay) no mobile
const killSound = new Audio('kill.mp3');

// Configura o clique/toque assim que a página estiver pronta
function initInput() {
    const container = document.getElementById('game-container');

    container.addEventListener('pointerdown', (e) => {
        e.preventDefault(); 

        const clickX = e.clientX;
        const clickY = e.clientY;

        if (clickX >= gameArea.x + 32 && clickX <= gameArea.x + gameArea.size - 32 &&
            clickY >= gameArea.y + 32 && clickY <= gameArea.y + gameArea.size - 32) {
            
            triggerAttackAnimation(clickX, clickY);
            checkEnemyHit(clickX, clickY);
        }
    }, { passive: false });
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

    if (equippedWeapon.isLegendary) {
        attackImg.style.filter = 'drop-shadow(0px 0px 6px #ffff00)';
    }

    container.appendChild(attackImg);

    requestAnimationFrame(() => {
        attackImg.style.transform = 'rotate(180deg)';
    });

    setTimeout(() => {
        attackImg.remove();
    }, 150);
}

// Cria o texto do dano flutuando em pixel art por 1 segundo
function spawnDamageText(x, y, damageAmount) {
    const container = document.getElementById('game-container');
    const damageText = document.createElement('div');
    
    damageText.innerText = damageAmount;
    damageText.style.position = 'absolute';
    damageText.style.left = (x - 10) + 'px';
    damageText.style.top = (y - 25) + 'px';
    damageText.style.fontFamily = "'Press Start 2P', monospace";
    damageText.style.fontSize = '14px'; 
    damageText.style.color = '#ffffff'; 
    damageText.style.zIndex = '40';
    damageText.style.pointerEvents = 'none';
    damageText.style.userSelect = 'none';
    damageText.style.transition = 'transform 1s ease-out, opacity 1s ease-out';

    container.appendChild(damageText);

    requestAnimationFrame(() => {
        damageText.style.transform = 'translateY(-30px)';
        damageText.style.opacity = '0';
    });

    setTimeout(() => {
        damageText.remove();
    }, 1000);
}

// Verifica se a posição do toque colidiu com a caixa de algum inimigo vivo
function checkEnemyHit(hx, hy) {
    if (typeof checkSwordPickup === 'function' && checkSwordPickup(hx, hy)) {
        return; 
    }

    const currentDamage = equippedWeapon.damage;

    for (let i = activeEnemies.length - 1; i >= 0; i--) {
        const enemy = activeEnemies[i];

        if (hx >= enemy.x && hx <= enemy.x + enemySize &&
            hy >= enemy.y && hy <= enemy.y + enemySize) {
            
            enemy.hp -= currentDamage; 
            spawnDamageText(hx, hy, currentDamage);

            if (enemy.hp <= 0) {
                // --- SISTEMA DE ÁUDIO DE MORTE ---
                killSound.currentTime = 0; // Reseta o áudio para o início (essencial para cliques rápidos)
                killSound.play().catch(err => console.log("Áudio bloqueado pelo navegador até o primeiro clique:", err));
                // ---------------------------------

                if (typeof createDeathEffect === 'function') {
                    createDeathEffect(enemy.x, enemy.y);
                }
                
                if (typeof addPoint === 'function') {
                    addPoint();
                }

                const deadX = enemy.x;
                const deadY = enemy.y;

                enemy.element.remove();              
                activeEnemies.splice(i, 1);          

                if (typeof registerKillForLoot === 'function') {
                    registerKillForLoot(deadX, deadY);
                }

                if (typeof checkNextWave === 'function') {
                    checkNextWave(deadX, deadY); 
                }
            }
            break; 
        }
    }
}