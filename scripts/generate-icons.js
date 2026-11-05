import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer with filter byte (0) per row
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(rowStride * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);

    const crcPayload = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(crcPayload);
    crcBuf.writeUInt32BE(crcVal >>> 0, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA color type
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 calculation table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ 0xffffffff;
}

// Navy background: #0a192f = (10, 25, 47)
// Gold highlight: #fbbf24 = (251, 191, 36)
// White: (255, 255, 255)
// Building slate: (30, 41, 59)
function iconDrawer(isMaskable = false) {
  return (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;

    // Center coordinates
    const cx = nx - 0.5;
    const cy = ny - 0.5;
    const distSq = cx * cx + cy * cy;

    // Base deep navy gradient
    let r = Math.round(10 + ny * 12);
    let g = Math.round(25 + ny * 18);
    let b = Math.round(47 + ny * 25);
    let a = 255;

    const scale = isMaskable ? 0.72 : 0.88;
    const px = cx / scale;
    const py = cy / scale;

    // Gold Outer Shield/Hexagon border
    const absX = Math.abs(px);
    const absY = Math.abs(py);
    const inHex = absX <= 0.42 && absY + absX * 0.5 <= 0.46;
    const inHexInner = absX <= 0.39 && absY + absX * 0.5 <= 0.43;

    if (inHex && !inHexInner) {
      return [251, 191, 36, 240]; // Gold border
    }

    // Inside Shield: Building towers silhouette
    // Left Tower
    if (px >= -0.26 && px <= -0.10 && py >= -0.05 && py <= 0.28) {
      if ((Math.floor((py + 0.05) * 40) % 2 === 0) && (Math.floor((px + 0.26) * 40) % 2 === 0)) {
        return [251, 191, 36, 220]; // illuminated gold windows
      }
      return [30, 41, 59, 255]; // slate tower
    }

    // Right Tower
    if (px >= 0.10 && px <= 0.26 && py >= -0.12 && py <= 0.28) {
      if ((Math.floor((py + 0.12) * 40) % 2 === 0) && (Math.floor((px - 0.10) * 40) % 2 === 0)) {
        return [251, 191, 36, 220]; // illuminated gold windows
      }
      return [30, 41, 59, 255];
    }

    // Central Monolith
    if (px >= -0.09 && px <= 0.09 && py >= -0.28 && py <= 0.28) {
      // Golden spire at tip
      if (py < -0.20 && Math.abs(px) < (py + 0.28) * 0.8) {
        return [251, 191, 36, 255];
      }
      // "R" letter emblem in center
      if (py >= -0.15 && py <= 0.15) {
        // Vertical stem of R
        if (px >= -0.06 && px <= -0.02) return [251, 191, 36, 255];
        // Upper loop of R
        if (py >= -0.15 && py <= 0.0 && px >= -0.06 && px <= 0.05) {
          if (py <= -0.12 || py >= -0.03 || px >= 0.02) return [251, 191, 36, 255];
        }
        // Leg of R
        if (py > 0.0 && px >= -0.02 && px <= 0.06 && Math.abs(px - (py * 0.5 - 0.01)) < 0.03) {
          return [251, 191, 36, 255];
        }
      }
      return [15, 23, 42, 255]; // deep structure
    }

    // Dynamic restorative arc at bottom
    const arcDist = Math.abs(Math.sqrt((px) ** 2 + (py - 0.1) ** 2) - 0.32);
    if (arcDist < 0.025 && py > 0.15 && px > -0.32 && px < 0.32) {
      return [251, 191, 36, 255];
    }

    return [r, g, b, a];
  };
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate apple-touch-icon (180x180)
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180, 180, iconDrawer(false)));

// Generate pwa-192x192.png
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPNG(192, 192, iconDrawer(false)));

// Generate pwa-512x512.png
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPNG(512, 512, iconDrawer(false)));

// Generate pwa-maskable-512x512.png
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, iconDrawer(true)));

// Favicon ico placeholder (valid 32x32 png can act as favicon)
fs.writeFileSync(path.join(outDir, 'favicon.ico'), createPNG(32, 32, iconDrawer(false)));

console.log('PWA PNG Icons generated successfully in public/');
