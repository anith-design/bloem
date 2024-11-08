const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random');
const risoColors = require("../assets/risoColors.json");

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
  const primaryColor = risoColors[59].hex;
  const secondaryColor = risoColors[75].hex;
  const accentColor = risoColors[12].hex;

  const filteredColors = [primaryColor, secondaryColor, accentColor];

  const noiseCanvas = document.createElement("canvas");
  const noiseContext = noiseCanvas.getContext("2d");
  noiseCanvas.width = 1024;
  noiseCanvas.height = 1024;

  noiseContext.fillStyle = 'white';
  noiseContext.fillRect(0, 0, noiseCanvas.width, noiseCanvas.height);

  const imageData = noiseContext.getImageData(0, 0, noiseCanvas.width, noiseCanvas.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255;
    imageData.data[i + 1] = 255;
    imageData.data[i + 2] = 255;
    imageData.data[i + 3] = random.rangeFloor(50, 175);
  }

  noiseContext.putImageData(imageData, 0, 0);

  return ({ context, width, height, playhead }) => {
    const cols = 80;
    const rows = cols;

    const squareW = width / cols;
    const squareH = height / rows;

    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    const effRadius = Math.min(width, height) * 0.8;
    // context.fillStyle = risoColors[6].hex;
    // context.fillRect(margin, margin, width - 2 * margin, height - 2 * margin);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * squareW;
        const y = j * squareH;

        const gridCenterX = x + squareW / 2;
        const gridCenterY = y + squareH / 2;

        const distX = gridCenterX - centerX;
        const distY = gridCenterY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        const distanceFactor = Math.min(1, distance / effRadius);
        context.globalAlpha = Math.pow(1 - distanceFactor, 3);

        // const wave = Math.sin(distance * goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6)) && Math.cos(distanceFactor + goldenRatio * 0.3);
        const wave = Math.sin(distance * goldenRatio - playhead * (Math.PI * 2 * 6));
        const scale = (wave + 1) / 2;
        // const scale = (wave + goldenRatio - 2 * distanceFactor + 0.1) / 2;

        const interpFactor = (Math.cos(distance * goldenRatio - playhead * (Math.PI * 2 * 6)));
        const lerpedColor = interpolateColor(filteredColors[0], filteredColors[2], interpFactor);

        context.save();

        context.translate(gridCenterX, gridCenterY);
        context.scale(scale, scale);

        context.fillStyle = lerpedColor;

        const numPetals = 10;
        for (let k = 0; k < numPetals; k++) {
          const angle = (Math.PI * 2 / numPetals) * k;
          context.rotate(angle);

          context.fillStyle = lerpedColor;
          context.fillRect(0, 0, squareW, squareH);
        }
        context.restore();
      }
    }

    context.globalAlpha = 0.5;
    context.drawImage(noiseCanvas, 0, 0, noiseCanvas.width, noiseCanvas.height, 0, 0, width, height);
    context.globalAlpha = 1.0;

    // Lockup.
    const fontFill = 'hsl(0, 0%, 19%)';
    const fontName = 'bold 30px Neue Haas Grotesk Text';
    const fontYPos = height - 30;

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText('08.11.24', 30, fontYPos);

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'center';
    context.textBaseline = 'bottom';
    context.fillText('bloem', width / 2, fontYPos);

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'right';
    context.textBaseline = 'bottom';
    context.fillText('@anith.png', width - 30, fontYPos);
  };
};

canvasSketch(sketch, settings);
