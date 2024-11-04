const canvasSketch = require("canvas-sketch");
const { noise2D } = require('canvas-sketch-util/random');
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
  console.log(goldenRatio);
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
        const wave = Math.sin(distance * goldenRatio * 0.2 - playhead * (Math.PI * 2 * 3));
        //const wave = Math.sin(distance * 0.05 - time * 5)
        
        const goldenScale = noise2D(goldenRatio, -distance * 0.1);
        const scale = (wave + 1) / 2 * goldenScale;

        context.save();

        context.translate(gridCenterX, gridCenterY);
        // context.rotate(wave * Math.PI * goldenRatio * 0.2);
        context.scale(scale * 5, scale * 1.5);

        context.fillStyle = 'hsl(0, 0%, 60%)';

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
