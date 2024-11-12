const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random');
const risoColors = require("../assets/risoColors.json");
console.log(risoColors);

const settings = {
  dimensions: [ 2048, 2048 ],
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

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match ? {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  } : null;
}

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
    const margin = 128;
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

    context.fillStyle = 'hsl(320, 25%, 5%)';
    context.fillRect(margin, margin, width - 2 * margin, height - 2 * margin);

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

        context.globalAlpha = Math.pow(1 - distanceFactor, 3.5);

        // const wave = Math.sin(distance * goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6));
        const wave = Math.sin(distance * goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6));
        const scale = (wave + goldenRatio - 2 * distanceFactor) / 2;

        const interpFactor = (Math.cos(distance * goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6)));
        const lerpedColor = interpolateColor(filteredColors[0], filteredColors[2], interpFactor);

        const flowerRotation = playhead * Math.PI * 2; // Full rotation based on playhead

        context.save();

        context.translate(gridCenterX, gridCenterY);
        context.rotate(flowerRotation);
        context.scale(scale, scale);

        context.fillStyle = lerpedColor;

        const numPetals = 10;
        const petalRotationFac = playhead * Math.PI * 2;
        for (let k = 0; k < numPetals; k++) {
          const angle = (Math.PI * 2 / numPetals) * k + petalRotationFac;

          context.rotate(angle);
          context.fillRect(-squareW / 2, -squareH / 2, squareW, squareH);
        }
        context.restore();
      }
    }

    context.globalAlpha = 0.2; 
    context.drawImage(noiseCanvas, 0, 0, noiseCanvas.width, noiseCanvas.height, margin, margin, width - 2 * margin, height - 2 * margin);
    context.globalAlpha = 1.0;

    // Lockup.
    const fontFill = 'hsl(320, 25%, 5%)';
    const fontName = 'bold 28px Neue Haas Grotesk Text';
    const fontYPos = height - 50;

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText('12.11.24', margin, fontYPos);

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
