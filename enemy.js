// Array global para guardar os inimigos ativos no jogo
const activeEnemies = [];

// Tamanho do inimigo atualizado para telas mobile
const enemySize = 80; 

// Função para gerar um número aleatório dentro dos limites do quadrado (descontando as bordas)
function getRandomPosition(min, max, offset) {
    // 32px é o tamanho do tile da borda para o inimigo não nascer em cima dela
    return Math.random() * (max - min - offset - 64) + min + 32;
}

function spawnDeathSlime() {
    // Cria um elemento de imagem no HTML para rodar o GIF animado
    const img = new Image();
    img.src = 'enemys/DeathSlime.gif';
    img.style.position = 'absolute';
    img.style.width = `${enemySize}px`;  // Novo tamanho horizontal aplicado
    img.style.height = `${enemySize}px`; // Novo tamanho vertical aplicado
    img.style.pointerEvents = 'none';    // Impede que o toque no GIF bloqueie cliques futuros no canvas

    // Sorteia posições X e Y considerando o novo tamanho do inimigo
    const posX = getRandomPosition(gameArea.x, gameArea.x + gameArea.size, enemySize);
    const posY = getRandomPosition(gameArea.y, gameArea.y + gameArea.size, enemySize);

    img.style.left = `${posX}px`;
    img.style.top = `${posY}px`;

    // Adiciona o GIF na tela por cima do Canvas
    document.body.appendChild(img);

    // Salva o objeto do inimigo com suas propriedades e vida
    activeEnemies.push({
        element: img,
        name: 'DeathSlime',
        hp: 15,
        x: posX,
        y: posY
    });
}

// Inicializa os 3 inimigos pedidos no começo
function initEnemies() {
    for (let i = 0; i < 3; i++) {
        spawnDeathSlime();
    }
}