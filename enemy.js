// Array global para guardar os inimigos ativos no jogo
const activeEnemies = [];

// Função para gerar um número aleatório dentro dos limites do quadrado (descontando as bordas)
function getRandomPosition(min, max, offset) {
    return Math.random() * (max - min - offset - 32) + min + 16;
}

function spawnDeathSlime() {
    // Cria um elemento de imagem no HTML para rodar o GIF animado
    const img = new Image();
    img.src = 'enemys/DeathSlime.gif';
    img.style.position = 'absolute';
    img.style.width = '32px';  // Tamanho do inimigo
    img.style.height = '32px';

    // Sorteia posições X e Y estritamente dentro da gameArea
    const posX = getRandomPosition(gameArea.x, gameArea.x + gameArea.size, 32);
    const posY = getRandomPosition(gameArea.y, gameArea.y + gameArea.size, 32);

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