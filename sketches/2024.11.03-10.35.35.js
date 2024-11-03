const canvasSketch = require("canvas-sketch");
const risoColors = require("riso-colors");

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300,
  animate: true,
  duration: 12,
  fps: 60
};

const sketch = () => {
  const color = risoColors[Math.floor(Math.random() * risoColors.length)];
  return ({ context, width, height, time }) => {
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
    //context.fillStyle = color.hex;
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

        //const wave = Math.sin(distance - time * 1.5);
        const wave = Math.sin(distance - time * 1.5);
        //const wave = Math.sin(distance * 0.05 - time * 5)

        const scale = (wave + 1) / 2;

        context.save();

        context.translate(gridCenterX, gridCenterY);
        context.scale(scale, scale);

        context.fillStyle = color.hex;

        context.beginPath();
        context.rect(-squareW / 2, -squareH / 2, squareW, squareH);
        //context.arc(0, 0, squareW / 2, 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    }
  };
};

canvasSketch(sketch, settings);
