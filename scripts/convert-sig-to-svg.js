const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const jpegPath = path.join(process.cwd(), 'public', 'dr-leegale-signature.jpg');
const jpegData = fs.readFileSync(jpegPath);
const jpeg = require('jpeg-js');
const rawImage = jpeg.decode(jpegData);
const w = rawImage.width;
const h = rawImage.height;

// Create PGM (grayscale) - threshold to pure black/white
// Higher threshold means only very dark ink becomes black
const threshold = 100;
let pgmData = `P5\n${w} ${h}\n255\n`;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = (y * w + x) * 4;
    const r = rawImage.data[idx];
    const g = rawImage.data[idx+1];
    const b = rawImage.data[idx+2];
    const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    // Invert: ink is dark, we want ink as black in the bitmap
    const val = gray < threshold ? 0 : 255;
    pgmData += String.fromCharCode(val);
  }
}

const pgmPath = '/tmp/sig.pgm';
fs.writeFileSync(pgmPath, pgmData, 'binary');

// Run potrace
const svgPath = '/root/aliento-nextjs/public/dr-leegale-signature.svg';
const result = spawnSync('potrace', [
  '-s',           // SVG output
  '--svg',        // SVG format
  '--turdsize', '5',    // Suppress speckles smaller than 5px
  '--opttolerance', '0.3', // Curve optimization
  '--turnpolicy', 'black', // Follow black (ink) regions
  '-o', svgPath,
  pgmPath
], { encoding: 'utf-8' });

if (result.error) {
  console.error('Potrace error:', result.error.message);
  process.exit(1);
}
if (result.stderr) console.error('stderr:', result.stderr);

const svgContent = fs.readFileSync(svgPath, 'utf-8');
const size = fs.statSync(svgPath).size;
console.log('SVG written: ' + size + ' bytes');

// Make the SVG paths dark, not fully black
let clean = svgContent
  .replace(/stroke="[^"]*"/g, 'stroke="#1a1a1a"')
  .replace(/fill="#000000"/g, 'fill="#1a1a1a"')
  .replace(/fill="black"/g, 'fill="#1a1a1a"')
  .replace(/stroke="#000000"/g, 'stroke="#1a1a1a"');

fs.writeFileSync(svgPath, clean);
console.log('Final size: ' + fs.statSync(svgPath).size + ' bytes');
console.log('---');
console.log(clean.substring(0, 600));
