const fs = require('fs');
const path = require('path');

const jpegPath = path.join(process.cwd(), 'public', 'dr-leegale-signature.jpg');
const jpegData = fs.readFileSync(jpegPath);
const jpeg = require('jpeg-js');
const rawImage = jpeg.decode(jpegData);
const w = rawImage.width;
const h = rawImage.height;

// Convert to thresholded pixels: dark ink → 0, white bg → 255
const pixels = [];
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = (y * w + x) * 4;
    const gray = 0.2126 * rawImage.data[idx] + 0.7152 * rawImage.data[idx+1] + 0.0722 * rawImage.data[idx+2];
    // Invert so ink is bright (ImageTracer traces bright regions)
    pixels.push(255 - gray);
  }
}

const ImageTracer = require('imagetracerjs');
const rawSvg = ImageTracer.imagedataToSVG({ width: w, height: h, data: pixels }, {
  ltres: 0.5, qtres: 1.0, blurRadius: 3, scale: 1, cors: false,
  colorquantcyc: 1, colorsampling: 0, numberofcolors: 2,
  palette: [{ r: 0, g: 0, b: 0, a: 255 }, { r: 255, g: 255, b: 255, a: 255 }],
  pathomit: 8, rightangleenhance: true
});

// Extract only paths that look like signature strokes
// Filter: skip paths that cover >50% of image area (background fills)
const areaThreshold = w * h * 0.5;
const pathMatches = [...rawSvg.matchAll(/<path[^>]*d="([^"]*)"[^>]*\/>/g)];
const keepPaths = [];

for (const pm of pathMatches) {
  const full = pm[0];
  const d = pm[1];
  
  // Estimate bounding box from path data
  const coords = [...d.matchAll(/[MLQCT]\s*([\d.-]+)\s*([\d.-]+)/g)];
  if (coords.length < 3) continue;
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of coords) {
    const x = parseFloat(c[1]), y = parseFloat(c[2]);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  
  const area = (maxX - minX) * (maxY - minY);
  
  // Skip background fills, keep small/medium path areas
  if (area < areaThreshold && minX > 5 && minY > 5 && maxX < w - 5 && maxY < h - 5) {
    // Make it dark but not fully black for a natural ink look
    const clean = full
      .replace(/fill="rgb\(0,\s*0,\s*0\)"/g, 'fill="#1a1a1a"')
      .replace(/stroke="rgb\(0,\s*0,\s*0\)"/g, 'stroke="#1a1a1a"');
    keepPaths.push(clean);
  }
}

// Also keep paths that look like signature strokes (small width/height ratio)
for (const pm of pathMatches) {
  const full = pm[0];
  const d = pm[1];
  const coords = [...d.matchAll(/[MLQCT]\s*([\d.-]+)\s*([\d.-]+)/g)];
  if (coords.length < 3) continue;
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const c of coords) {
    const x = parseFloat(c[1]), y = parseFloat(c[2]);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  
  const width = maxX - minX, height = maxY - minY;
  const area = width * height;
  
  // Signature strokes are typically long and thin (width >> height or height >> width)
  // and don't cover the full page
  const ratio = width > height ? width / (height || 1) : height / (width || 1);
  
  if (ratio > 3 && area < areaThreshold * 0.3 && !keepPaths.includes(full)) {
    const clean = full
      .replace(/fill="rgb\(0,\s*0,\s*0\)"/g, 'fill="#1a1a1a"')
      .replace(/stroke="rgb\(0,\s*0,\s*0\)"/g, 'stroke="#1a1a1a"');
    keepPaths.push(clean);
  }
}

const finalSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">\n' +
  keepPaths.join('\n') + '\n</svg>';

fs.writeFileSync('public/dr-leegale-signature.svg', finalSvg);
const size = fs.statSync('public/dr-leegale-signature.svg').size;
console.log('SVG written: ' + size + ' bytes, paths: ' + keepPaths.length);
