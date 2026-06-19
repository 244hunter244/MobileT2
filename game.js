// Carrega a textura do repositório (Essa linha faltou no topo antes)
const stoneTile = new Image();
stoneTile.src = 'stonetile.png'; 

// Função que desenha o cenário
function render() {
    // Limpa a tela com fundo preto
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tileSize = 32; // Tamanho de cada tile da borda

    // Desenha as bordas horizontais
    for (let i = 0; i < gameArea.size; i += tileSize) {
        ctx.drawImage(stoneTile, gameArea.x + i, gameArea.y, tileSize, tileSize);
        ctx.drawImage(stoneTile, gameArea.x + i, gameArea.y + gameArea.size - tileSize, tileSize, tileSize);
    }

    // Desenha as bordas verticais
    for (let i = 0; i < gameArea.size; i += tileSize) {
        ctx.drawImage(stoneTile, gameArea.x, gameArea.y + i, tileSize, tileSize);
        ctx.drawImage(stoneTile, gameArea.x + gameArea.size - tileSize, gameArea.y + i, tileSize, tileSize);
    }
}

// Força o jogo a inicializar assim que a janela do navegador carregar completamente
window.onload = () => {
    render();
    initEnemies();
    createWeaponHUD(); // Inicializa o indicador da espada equipada
};