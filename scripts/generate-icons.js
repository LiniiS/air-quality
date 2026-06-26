const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'assets', 'icon.svg');
const svg = fs.readFileSync(svgPath);

const sizes = [
  { file: 'assets/icon.png',          size: 1024 },
  { file: 'assets/adaptive-icon.png', size: 1024 },
];

for (const { file, size } of sizes) {
  const resvg = new Resvg(svg, { width: size, height: size });
  const png = resvg.render().asPng();
  const dest = path.join(__dirname, '..', file);
  fs.writeFileSync(dest, png);
  console.log(`✓ ${file} (${size}x${size})`);
}
