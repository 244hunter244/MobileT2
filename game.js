// Carrega a textura do repositório
const stoneTile = new Image();
stoneTile.src = 'stonetile.png'; 

// Garante que o desenho só acontece após a imagem carregar
stoneTile.onload = () => {
    render();
};

function drawBackground() {
    // Limpa a tela com fundo preto
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGameBounds() {
    const tileSize = 32; // Tamanho visual de cada tile da borda

    // Desenha as linhas horizontal superior e inferior da borda
    for (let i = 0; i < gameArea.size; i += tileSize) {
        ctx.drawImage(stoneTile, gameArea.x + i, gameArea.y, tileSize, tileSize);
        ctx.drawImage(stoneTile, gameArea.x + i, gameArea.y + gameArea.size - tileSize, tileSize, tileSize);
    }

    // Desenha as linhas verticais esquerda e direita da borda
    for (let i = 0; i < gameArea.size; i += tileSize) {
        ctx.drawImage(stoneTile, gameArea.x, gameArea.y + i, tileSize, tileSize);
        ctx.drawImage(stoneTile, gameArea.x + gameArea.size - tileSize, gameArea.y + i, tileSize, tileSize);
    }
}

// Função principal de renderização
function render() {
    drawBackground();
    drawGameBounds();
}