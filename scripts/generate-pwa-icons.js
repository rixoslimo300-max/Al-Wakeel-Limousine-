// Script to generate luxury Al Wakeel Limousine icons using Node's built-in zlib
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makePng(width, height, getPixel) {
  // RGB 3 bytes per pixel
  const rowLen = 1 + width * 3;
  const rawData = Buffer.alloc(rowLen * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      const [r, g, b] = getPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // No interlace

  function makeChunk(typeStr, dataBuf) {
    const typeBuf = Buffer.from(typeStr, 'ascii');
    const len = dataBuf.length;
    const chunk = Buffer.alloc(8 + len + 4);
    chunk.writeUInt32BE(len, 0);
    typeBuf.copy(chunk, 4);
    dataBuf.copy(chunk, 8);
    const crcVal = crc32(Buffer.concat([typeBuf, dataBuf]));
    chunk.writeUInt32BE(crcVal, 8 + len);
    return chunk;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Visual generator: Deep Navy (#101D2D) with Gold Crest (#C9A96B) and diamond emblem
function luxuryLimousinePixel(x, y, w, h, isMaskable) {
  const nx = (x / w) * 2 - 1; // -1 to 1
  const ny = (y / h) * 2 - 1; // -1 to 1
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Brand Colors
  const bgR = 16, bgG = 29, bgB = 45;      // #101D2D
  const bg2R = 11, bg2G = 21, bg2B = 34;   // #0B1522
  const goldR = 201, goldG = 169, goldB = 107; // #C9A96B
  const lightGoldR = 223, lightGoldG = 200, lightGoldB = 155; // #DFC89B

  // Subtle radial gradient in background
  const bgFactor = Math.min(1, dist * 0.8);
  let r = Math.round(bgR * (1 - bgFactor) + bg2R * bgFactor);
  let g = Math.round(bgG * (1 - bgFactor) + bg2G * bgFactor);
  let b = Math.round(bgB * (1 - bgFactor) + bg2B * bgFactor);

  // Safe scale for maskable icons
  const scale = isMaskable ? 0.65 : 0.82;
  const sx = nx / scale;
  const sy = ny / scale;

  // Outer gold ring
  const ringDist = Math.sqrt(sx * sx + sy * sy);
  if (ringDist >= 0.82 && ringDist <= 0.89) {
    return [goldR, goldG, goldB];
  }

  // Diamond shape: |sx| + |sy| <= 0.70
  const diamond = Math.abs(sx) + Math.abs(sy);
  if (diamond <= 0.68 && diamond >= 0.58) {
    return [lightGoldR, lightGoldG, lightGoldB];
  }

  // W / Emblem wings
  // Left wing
  if (sx >= -0.45 && sx <= -0.15 && Math.abs(sy - (sx * 1.2 + 0.1)) < 0.08) {
    return [goldR, goldG, goldB];
  }
  // Center-left
  if (sx >= -0.22 && sx <= 0 && Math.abs(sy - (-sx * 1.5 - 0.2)) < 0.08) {
    return [lightGoldR, lightGoldG, lightGoldB];
  }
  // Center-right
  if (sx >= 0 && sx <= 0.22 && Math.abs(sy - (sx * 1.5 - 0.2)) < 0.08) {
    return [lightGoldR, lightGoldG, lightGoldB];
  }
  // Right wing
  if (sx >= 0.15 && sx <= 0.45 && Math.abs(sy - (-sx * 1.2 + 0.1)) < 0.08) {
    return [goldR, goldG, goldB];
  }

  // Center crown / diamond star
  if (Math.abs(sx) + Math.abs(sy + 0.25) <= 0.1) {
    return [lightGoldR, lightGoldG, lightGoldB];
  }

  return [r, g, b];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. icon.svg
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#16273c"/>
      <stop offset="100%" stop-color="#0a121c"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DFD0B5"/>
      <stop offset="50%" stop-color="#C9A96B"/>
      <stop offset="100%" stop-color="#9C7A3C"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bgGrad)"/>
  <circle cx="256" cy="256" r="210" fill="none" stroke="url(#goldGrad)" stroke-width="6" opacity="0.6"/>
  <circle cx="256" cy="256" r="195" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.4"/>
  <!-- Diamond Crest -->
  <polygon points="256,90 390,256 256,422 122,256" fill="none" stroke="url(#goldGrad)" stroke-width="8"/>
  <polygon points="256,120 360,256 256,392 152,256" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.5"/>
  <!-- Stylized Al Wakeel W Emblem -->
  <path d="M 160 210 L 210 330 L 256 250 L 302 330 L 352 210" fill="none" stroke="url(#goldGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Crown Diamond Star -->
  <polygon points="256,160 268,180 256,200 244,180" fill="url(#goldGrad)"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Created public/icon.svg');

// 2. PNG files
const p192 = makePng(192, 192, (x, y, w, h) => luxuryLimousinePixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), p192);
console.log('Created public/pwa-192x192.png');

const p512 = makePng(512, 512, (x, y, w, h) => luxuryLimousinePixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), p512);
console.log('Created public/pwa-512x512.png');

const pMaskable = makePng(512, 512, (x, y, w, h) => luxuryLimousinePixel(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pMaskable);
console.log('Created public/pwa-maskable-512x512.png');

const pApple = makePng(180, 180, (x, y, w, h) => luxuryLimousinePixel(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pApple);
console.log('Created public/apple-touch-icon.png');
