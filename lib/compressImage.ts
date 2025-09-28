import sharp from 'sharp';

interface CompressOptions {
  targetKB: number;      // desired size in kilobytes
  maxWidth?: number;     // maximum width in pixels
  maxHeight?: number;    // maximum height in pixels
  format?: 'webp' | 'jpeg' | 'avif' | 'png';
  minQ?: number;         // minimum quality for binary search
  maxQ?: number;         // maximum quality for binary search
}

// Compress an image buffer to approximately targetKB (not exact)
export async function compressImage(
  input: Buffer,
  {
    targetKB,
    maxWidth = 1600,
    maxHeight = 1600,
    format = 'webp',
    minQ = 40,
    maxQ = 95,
  }: CompressOptions
): Promise<{ buffer: Buffer; usedQuality: number }> {
  const targetBytes = targetKB * 1024;
  // Resize without enlarging
  const base = sharp(input).rotate().resize({ width: maxWidth, height: maxHeight, fit: 'inside', withoutEnlargement: true });

  async function encode(q: number) {
    let pipeline = base.clone();
    if (format === 'png') pipeline = pipeline.png({ compressionLevel: Math.round((9 * (100 - q)) / 100) });
    else if (format === 'webp') pipeline = pipeline.webp({ quality: q });
    else if (format === 'jpeg') pipeline = pipeline.jpeg({ quality: q });
    else if (format === 'avif') pipeline = pipeline.avif({ quality: q });
    const buffer = await pipeline.toBuffer();
    return { buffer, size: buffer.length, q };
  }

  // Quick test at maximum quality
  let high = await encode(maxQ);
  if (high.size <= targetBytes) return { buffer: high.buffer, usedQuality: high.q };
  // If even lowest quality is larger, return it
  let low = await encode(minQ);
  if (low.size > targetBytes) return { buffer: low.buffer, usedQuality: low.q };

  // Binary search to find quality under targetBytes
  let left = minQ;
  let right = maxQ;
  let best = low;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const attempt = await encode(mid);
    if (attempt.size <= targetBytes) {
      best = attempt;
      left = mid + 1;  // try higher quality
    } else {
      right = mid - 1; // lower quality
    }
  }
  return { buffer: best.buffer, usedQuality: best.q };
}
