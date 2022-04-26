
import path, { ParsedPath } from 'path';

import Jimp from 'jimp';

import {
  clonePixel,
  getPixelMatrix,
  RGBA,
  rgbaToInt,
  scanPixelMatrix,
} from '../pixel';
import {
  IMAGE_OUT_DIR_PATH,
} from '../constants';

const CHARTRUESE_PIXEL: RGBA = {
  r: 128,
  g: 255,
  b: 0,
  a: 255,
};

export type RedTransformOpts = {
  redThreshold?: {
    redMin?: number,
    greenMax?: number,
    blueMax?: number,
  };
};

export async function redTransform(imagePath: string, opts?: RedTransformOpts) {
  let imgData: Jimp, pixelMatrix: RGBA[][];
  let nextImage: Jimp, nextImageFileName: string, nextImagePath: string;
  let nextWidth: number, nextHeight: number;
  let parsedImagePath: ParsedPath;

  let redMin: number, greenMax: number, blueMax: number;

  redMin = opts?.redThreshold?.redMin ?? 150;
  greenMax = opts?.redThreshold?.greenMax ?? 50;
  blueMax = opts?.redThreshold?.blueMax ?? 50;

  parsedImagePath = path.parse(imagePath);

  imgData = await Jimp.read(imagePath);
  nextImage = await Jimp.create(imgData.getWidth(), imgData.getHeight());
  nextWidth = nextImage.getWidth();
  nextHeight = nextImage.getHeight();

  pixelMatrix = getPixelMatrix(imgData);

  scanPixelMatrix(pixelMatrix, nextWidth, nextHeight, (x, y, currPixel) => {
    let nextPixel: RGBA, nextPixelVal: number;
    let isRed: boolean;
    isRed = (currPixel.r > redMin)
      && (currPixel.g < greenMax)
      && (currPixel.b < blueMax)
    ;
    if(isRed) {
      nextPixel = clonePixel(currPixel);
      nextPixel = clonePixel(CHARTRUESE_PIXEL);
      nextImage.setPixelColor(rgbaToInt(nextPixel), x, y);
    } else {
      nextImage.setPixelColor(rgbaToInt(currPixel), x, y);
    }
  });

  nextImageFileName = `red_transform_${parsedImagePath.name}.${imgData.getExtension()}`;
  nextImagePath = [
    IMAGE_OUT_DIR_PATH,
    nextImageFileName,
  ].join(path.sep);
  await nextImage.writeAsync(nextImagePath);
  return nextImagePath;
}
