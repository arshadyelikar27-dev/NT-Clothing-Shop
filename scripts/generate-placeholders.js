// Script to generate placeholder product images as colored SVGs
const fs = require('fs');
const path = require('path');

const products = [
  { slug: 'printed-cotton-fabric', color: '#C67B3C', label: 'Printed Cotton' },
  { slug: 'rayon-fabric', color: '#1A6B6A', label: 'Rayon Fabric' },
  { slug: 'georgette-fabric', color: '#C4889B', label: 'Georgette' },
  { slug: 'chiffon-fabric', color: '#1B2A4A', label: 'Chiffon' },
  { slug: 'embroidered-dress-material', color: '#6B8F71', label: 'Dress Material' },
  { slug: 'printed-dress-material', color: '#D97941', label: 'Printed Dress' },
  { slug: 'designer-kurti-block-print', color: '#2B4066', label: 'Designer Kurti' },
  { slug: 'mens-formal-shirt-white', color: '#E8E4DF', label: 'Formal Shirt' },
  { slug: 'mens-shirt-fabric-blue-check', color: '#4A73A8', label: 'Shirt Fabric' },
  { slug: 'suit-fabric-charcoal-grey', color: '#4A4A4A', label: 'Suit Fabric' },
  { slug: 'printed-chiffon-saree-teal', color: '#2A7B7B', label: 'Chiffon Saree' },
  { slug: 'cotton-dupatta-block-print', color: '#B83A3A', label: 'Cotton Dupatta' },
  { slug: 'kids-ethnic-kurta-set', color: '#F5F0E6', label: 'Kids Kurta' },
  { slug: 'festive-silk-blend-fabric', color: '#1A5C3A', label: 'Festive Silk' },
  { slug: 'premium-plain-fabric-offwhite', color: '#F0EBE3', label: 'Plain Fabric' },
  { slug: 'seasonal-collection-monsoon', color: '#3A7D8C', label: 'Monsoon Edit' },
];

const dir = path.join(__dirname, '..', 'public', 'images', 'products');

for (const p of products) {
  const filePath = path.join(dir, `${p.slug}.jpg`);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${p.slug} already exists`);
    continue;
  }
  
  const textColor = ['#E8E4DF', '#F5F0E6', '#F0EBE3'].includes(p.color) ? '#1A1918' : '#FAF7F2';
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="${p.color}"/>
  <rect x="0" y="0" width="600" height="800" fill="url(#texture)" opacity="0.08"/>
  <defs>
    <pattern id="texture" width="20" height="20" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="20" y2="20" stroke="${textColor}" stroke-width="0.5" opacity="0.3"/>
      <line x1="20" y1="0" x2="0" y2="20" stroke="${textColor}" stroke-width="0.5" opacity="0.15"/>
    </pattern>
  </defs>
  <text x="300" y="380" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${textColor}" opacity="0.7">${p.label}</text>
  <text x="300" y="420" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${textColor}" opacity="0.4">NOBLE TEXTILE</text>
</svg>`;

  // Save as SVG with .jpg extension (browsers handle it fine for dev)
  // In production, these would be replaced with real product photos
  fs.writeFileSync(filePath.replace('.jpg', '.svg'), svg);
  // Create a copy as jpg path reference
  fs.copyFileSync(filePath.replace('.jpg', '.svg'), filePath);
  console.log(`  + ${p.slug}`);
}

console.log('\n✅ Placeholder images created');
