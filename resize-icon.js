const sharp = require('sharp');
const path = require('path');

const inputFile = path.join(__dirname, 'assets/images/logoTrans.png');
const outputFile = path.join(__dirname, 'assets/images/icon-foreground.png');

// Target adaptive icon dimensions are 1024x1024.
// The "safe zone" is usually the inner 66%. 1024 * 0.66 = ~675.
// We'll resize the logo to 680x680 and pad the rest.

sharp(inputFile)
  .resize(680, 680, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .extend({
    top: 172,
    bottom: 172,
    left: 172,
    right: 172,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .toFile(outputFile)
  .then(() => {
    console.log('Foreground icon generated successfully.');
  })
  .catch((err) => {
    console.error('Error generating icon:', err);
    process.exit(1);
  });
