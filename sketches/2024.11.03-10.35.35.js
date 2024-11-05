const canvasSketch = require("canvas-sketch");
const risoColors = require("../assets/risoColors.json");

const settings = {
  dimensions: [2048, 2048],
  pixelsPerInch: 300,
  animate: true,
  duration: 16,
  fps: 60
};

const sketch = () => {
  // Select three colors from the risoColors array
  const color1 = risoColors[1].hex; // First color
  const color2 = risoColors[5].hex; // Second color
  const color3 = risoColors[4].hex; // Third color

  return ({ context, width, height, playhead }) => {
    // Set the background to a solid color to avoid black edges
    context.fillStyle = 'hsl(0, 0%, 98%)'; 
    context.fillRect(0, 0, width, height);

    const margin = 120; // Define margins
    const canvWidth = width - 2 * margin; // Calculate inner width
    const canvHeight = height - 2 * margin; // Calculate inner height

    const centerX = width / 2; // Center X position
    const centerY = height / 2; // Center Y position

    context.save();

    // Create a radial gradient
    const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2 - margin);
    
    // Define the colors and their positions for the gradient
    const colors = [color1, color2, color3];
    const numberOfWaves = colors.length; // Use the number of selected colors

    for (let i = 0; i < numberOfWaves; i++) {
      const distanceFactor = i / (numberOfWaves - 1); // Normalized distance (0 to 1)
      
      // Use the playhead to animate the sine wave
      const sineValue = Math.sin((distanceFactor + playhead * goldenRatio * 0.1) * Math.PI * 2); // Sine wave for dynamic effect
      const scale = (sineValue + 1) / 2; // Scale to 0 - 1

      // Create an HSL color using the scale to adjust lightness
      const hslColor = `hsl(${(i * 120) % 360}, 100%, ${50 + 20 * scale}%)`; // Adjust lightness based on scale
      gradient.addColorStop(distanceFactor, hslColor);
    }

    // Fill with the gradient
    context.fillStyle = gradient;
    context.fillRect(margin, margin, canvWidth, canvHeight); // Fill the margin-corrected area

    context.restore();

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
