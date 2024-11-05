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
    const cols = 80;
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

        const wave = Math.sin(distance * 1 * goldenRatio * 0.4 - playhead * (Math.PI * 2 * 3));
        const scale = (wave + 1) / 2;

        context.save();

        context.translate(gridCenterX, gridCenterY);
        context.scale(scale, scale);
        //context.rotate(i * 0.2, j * 0.1, goldenRatio * 0.2);

        context.fillStyle = color.hex;

        const numPetals = 10; // Number of lines to draw
        const petalLength = squareW * 0.5;

        for (let k = 0; k < numPetals; k++) {
          const angle = (Math.PI * 2 / numPetals) * k;
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(petalLength * Math.cos(angle), petalLength * Math.sin(angle));
          context.strokeStyle = color.hex;
          context.stroke();

          context.rotate(angle);
          context.fillRect(-squareW / 2, -squareH / 2, squareW, squareH);
        }

        // // Draw lines instead of rectangles
        // // Draw lines instead of rectangles
        // const lineLength = squareW * 1.2; // Length of the line
        // context.strokeStyle = color.hex; // Use the chosen riso color
        // context.lineWidth = 8; // Increased line width for better visibility

        // // Draw lines radiating outward in different angles
        // for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / numLines) {
        //   context.beginPath();
        //   context.moveTo(0, 0); // Start at the center of the grid cell
        //   context.lineTo(lineLength * Math.cos(angle), lineLength * Math.sin(angle)); // End at the calculated point
        //   context.stroke();
        // }

        context.restore();
      }
    }

    // Font stuff.
    const fontFill = 'hsl(0, 0%, 20%)';
    const fontName = 'bold 28px Neue Haas Grotesk Text';
    const fontYPos = height - 50;

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText('05/11/24', margin, fontYPos);

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'center';
    context.textBaseline = 'bottom';
    context.fillText('bloem', width / 2, fontYPos); 

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'right';
    context.textBaseline = 'bottom';
    context.fillText('@anith.png', width - margin, fontYPos); 
  };
};

canvasSketch(sketch, settings);
