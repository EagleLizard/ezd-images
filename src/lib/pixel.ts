
import Jimp from 'jimp';

export type RGB = {
  r: number,
  g: number,
  b: number,
}

export type RGBA = RGB & {
  a: number,
};

export type ColorChannel = 'r' | 'g' | 'b';

export type ScanPixelMatrixCb = (x: number, y: number, pixel: RGBA) => void;

export function scanPixelMatrix(pixelMatrix: RGBA[][], width: number, height: number, cb: ScanPixelMatrixCb) {
  for(let y = 0; y < height; ++y) {
    for(let x = 0; x < width; ++x) {
      cb(x, y, pixelMatrix[x][y]);
    }
  }
}

export function clonePixel(pixel: RGBA): RGBA {
  return {
    r: pixel.r,
    g: pixel.g,
    b: pixel.b,
    a: pixel.a,
  }
}

export function rgbaToInt(pixel: RGBA): number {
  return Jimp.rgbaToInt(
    pixel.r,
    pixel.g,
    pixel.b,
    pixel.a,
  );
}
