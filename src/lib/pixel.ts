
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

export function getPixelMatrix(image: Jimp): RGBA[][] {
  let width: number, height: number;
  let pixelMatrix: RGBA[][];
  width = image.getWidth();
  height = image.getHeight();
  
  pixelMatrix = Array(width).fill(0).map(() => {
    return Array(height).fill(0).map(() => undefined);
  });

  for(let x = 0; x < width; ++x) {
    let currPixelRow: RGBA[];
    currPixelRow = pixelMatrix[x];
    for(let y = 0; y < height; ++y) {
      let colorVal: number, pixel: RGBA;
      colorVal = image.getPixelColor(x, y);
      pixel =  Jimp.intToRGBA(colorVal);
      currPixelRow[y] = pixel;
    }
  }
  return pixelMatrix;
}
