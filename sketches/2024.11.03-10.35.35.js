const canvasSketch = require("canvas-sketch");
const { noise2D, value } = require('canvas-sketch-util/random');
const risoColors = require("../assets/risoColors.json");

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300,
  animate: true,
  duration: 16,
  fps: 60
};

const sketch = () => {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const color = risoColors[2];

  return ({ context, width, height, playhead }) => {
    const margin = 120;
    const cols = 40;
    const rows = cols;

    const gridWidth = width - 2 * margin;
    const gridHeight = height - 2 * margin;

    const squareW = gridWidth / cols;
    const squareH = gridHeight / rows;

    const startX = margin;
    const startY = margin;

    context.fillStyle = "hsl(0, 0%, 98%)";
    context.fillRect(0, 0, width, height); 

    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = startX + i * squareW;
        const y = startY + j * squareH;

        const gridCenterX = x + squareW / 2;
        const gridCenterY = y + squareH / 2;

        const distX = gridCenterX - centerX;
        const distY = gridCenterY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        const wave = Math.cos(distance * goldenRatio * 0.2 - playhead * (Math.PI * 2 * 3));
        const scale = (wave + 1) / 2;

        context.save();

        context.translate(gridCenterX, gridCenterY);
        context.scale(scale, scale);
        context.rotate(i * 0.1, j,  goldenRatio * 0.05);

        context.fillStyle = color.hex; // Use the chosen riso color
        context.fillRect(-squareW / 2, -squareH / 2, squareW, squareH);

        context.restore();
      }
    }

    // Add your name and date at the bottom
    context.fillStyle = 'hsl(0, 0%, 20%)';
    context.font = "bold 28px sans-serif";
    context.textAlign = "right";
    context.textBaseline = "bottom";
    context.fillText("@anith.png", width - margin, height - 55); 

    context.fillStyle = 'hsl(0, 0%, 20%)';
    context.font = "bold 28px sans-serif";
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText("05/11/24", margin, height - 55);
  };
};

canvasSketch(sketch, settings);
