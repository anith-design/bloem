const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random');
const risoColors = require("../assets/risoColors.json");

const settings = {
  dimensions: [ 2048, 2048 ],
  pixelsPerInch: 300,
  animate: true,
  duration: 16
};

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

    context.fillStyle = 'hsl(320, 25%, 5%)';
    context.fillRect(margin, margin, width - 2 * margin, height - 2 * margin);

    const centerX = width / 2;
    const centerY = height / 2;

    // Drawing the outer margin guide
    context.strokeStyle = 'rgba(200, 0, 0, 0.5)';
    context.lineWidth = 2;
    context.strokeRect(margin, margin, gridWidth, gridHeight);

    // Drawing the center crosshair
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(centerX, 0);
    context.lineTo(centerX, height);
    context.moveTo(0, centerY);
    context.lineTo(width, centerY);
    context.stroke();

    // Drawing grid lines (optional, for clarity on alignment)
    // context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    // context.lineWidth = 4;
    // for (let i = 0; i <= cols; i++) {
    //   const x = margin + (i * gridWidth) / cols;
    //   context.beginPath();
    //   context.moveTo(x, margin);
    //   context.lineTo(x, height - margin);
    //   context.stroke();
    // }
    // for (let j = 0; j <= rows; j++) {
    //   const y = margin + (j * gridHeight) / rows;
    //   context.beginPath();
    //   context.moveTo(margin, y);
    //   context.lineTo(width - margin, y);
    //   context.stroke();
    // }

    context.save();

    context.beginPath();
    context.rect(margin, margin, gridWidth, gridHeight);
    context.clip();

    context.translate(centerX, centerY);
    context.scale(1.37, 1.37);
    context.rotate(playhead * Math.PI * 2 * 0.25);
    context.translate(-centerX, -centerY);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = startX + i * squareW;
        const y = startY + j * squareH;

        const gridCenterX = x + squareW / 2;
        const gridCenterY = y + squareH / 2;

        const maxDistance = Math.sqrt((centerX - margin) ** 2 + (centerY - margin) ** 2);

        const flower = new Flower(centerX, centerY, maxDistance, filteredColors, goldenRatio);
        flower.draw(context, playhead, margin, squareW, squareH, gridCenterX, gridCenterY);
      }
    }

    context.restore();

    context.globalAlpha = 0.2;
    context.drawImage(noiseCanvas, 0, 0, noiseCanvas.width, noiseCanvas.height, margin, margin, width - 2 * margin, height - 2 * margin);
    context.globalAlpha = 1.0;

    // Lockup.
    const currentFrame = Math.floor(playhead * totalFrames);

    const fontFill = 'hsl(320, 25%, 5%)';
    const fontName = 'bold 30px Neue Haas Grotesk Text';
    const fontYPos = height - 50;

    context.fillStyle = fontFill;
    context.font = fontName;
    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText('14.11.24', margin, fontYPos);
    // context.fillText(`Frame: ${currentFrame} / ${totalFrames}`, margin, fontYPos);

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

class Flower {
  constructor(centerX, centerY, maxDistance, colors, goldenRatio) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.maxDistance = maxDistance;
    this.colors = colors;
    this.goldenRatio = goldenRatio;
  }

  draw(context, playhead, margin, squareW, squareH, gridCenterX, gridCenterY) {
    this.margin = margin;
    this.gridCenterX = gridCenterX;
    this.gridCenterY = gridCenterY;

    const distX = this.gridCenterX - this.centerX;
    const distY = this.gridCenterY - this.centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    const distanceFactor = distance / this.maxDistance;

    context.globalAlpha = Math.pow(1 - distanceFactor, 5);

    const wave = Math.sin(distance * this.goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6));
    const scale = (wave + this.goldenRatio - 2 * distanceFactor) / 2;

    const interpFactor = (Math.cos(distance * this.goldenRatio * 0.4 - playhead * (Math.PI * 2 * 6)));
    const lerpedColor = this.hueShift(this.interpolateColor(this.colors[0], this.colors[2], interpFactor), playhead * 360);

    context.save();

    context.translate(this.gridCenterX, this.gridCenterY);
    context.scale(scale, scale);

    context.fillStyle = lerpedColor;

    const numPetals = 10;
    const petalRotationFac = playhead * Math.PI * 2 * 8;

    for (let k = 0; k < numPetals; k++) {
      const angle = (Math.PI * 2 / numPetals) * k + petalRotationFac;

      context.rotate(angle);
      context.fillRect(-squareW / 2, -squareH / 2, squareW, squareH);
    }
    context.restore();
  }

  interpolateColor(color1, color2, factor) {
    const hex1 = this.hexToRgb(color1);
    const hex2 = this.hexToRgb(color2);

    const r = Math.round(hex1.r + (hex2.r - hex1.r) * factor);
    const g = Math.round(hex1.g + (hex2.g - hex1.g) * factor);
    const b = Math.round(hex1.b + (hex2.b - hex1.b) * factor);

    return this.rgbToHex(r, g, b);
  }

  hexToRgb(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return match ? {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16)
    } : null;
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
  }

  hueShift(color, degree) {
    const { r, g, b } = this.hexToRgb(color);
    const hsl = this.rgbToHsl(r, g, b);
    hsl.h = (hsl.h + degree) % 360;
    const rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return { h, s, l };
  }

  hslToRgb(h, s, l) {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
}