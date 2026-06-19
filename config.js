const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define o tamanho do canvas baseado na tela do celular
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define a área útil do jogo (o quadrado centralizado)
const gameArea = {
    size: Math.min(canvas.width, canvas.height) * 0.9, // 90% da menor dimensão
    x: 0,
    y: 0
};

// Centraliza o quadrado na tela
gameArea.x = (canvas.width - gameArea.size) / 2;
gameArea.y = (canvas.height - gameArea.size) / 2;