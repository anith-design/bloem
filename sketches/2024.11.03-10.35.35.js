const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random');
const risoColors = require("../assets/risoColors.json");
console.log(risoColors);

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300,
  animate: true,
  duration: 16
};

function interpolateColor(color1, color2, factor) {
  const hex1 = hexToRgb(color1);
  const hex2 = hexToRgb(color2);

  const r = Math.round(hex1.r + (hex2.r - hex1.r) * factor);
  const g = Math.round(hex1.g + (hex2.g - hex1.g) * factor);
  const b = Math.round(hex1.b + (hex2.b - hex1.b) * factor);

  return rgbToHex(r, g, b);
}

// Function to convert hex to RGB
function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match ? {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  } : null;
}

// Function to convert RGB to Hex
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

const sketch = () => {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const primaryColor = risoColors[66].hex;
  const secondaryColor = risoColors[75].hex;
  const accentColor = risoColors[12].hex;

  const filteredColors = [primaryColor, secondaryColor, accentColor];

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

    context.fillStyle = 'hsl(0, 0%, 98%)';
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

        const maxDistance = Math.sqrt((centerX - margin) ** 2 + (centerY - margin) ** 2);
        const distanceFactor = distance / maxDistance;

        const wave = Math.sin(distance * goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6));
        const scale = (wave + 1) / 2;
        // const scale = (wave + goldenRatio - 1 * distanceFactor) / 2;

        const colorIndex = Math.floor(playhead * filteredColors.length) % filteredColors.length;
        const color = filteredColors[colorIndex];

        const interpFactor = (Math.sin(distance * goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6)));
        const lerpedColor = interpolateColor(color, filteredColors[(colorIndex + 1) % filteredColors.length], interpFactor);

        context.save();

        context.translate(gridCenterX, gridCenterY);
        context.scale(scale, scale);

        context.fillStyle = lerpedColor;

        const numPetals = 10;
        for (let k = 0; k < numPetals; k++) {
          const angle = (Math.PI * 2 / numPetals) * k;
          context.rotate(angle);
          context.fillRect(-squareW / 2, -squareH / 2, squareW, squareH);
        }
        context.restore();
      }
    }

    // Lockup.
    const fontFill = 'hsl(0, 0%, 20%)';
    const fontName = 'bold 32px Neue Haas Grotesk Text';
    const fontYPos = height - 50;

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText('07.11.24', margin, fontYPos);

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
