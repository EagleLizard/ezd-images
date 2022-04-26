
import path, { ParsedPath } from 'path';

import Jimp from 'jimp';

import { getPixelMatrix, RGBA, rgbaToInt, scanPixelMatrix } from '../pixel';
import { IMAGE_OUT_DIR_PATH } from '../constants';

export type ShuffleTransformOpts = {
  yShufflePx: number;
};

export async function shuffleTransform(imagePath: string, opts: ShuffleTransformOpts) {
  let imgData: Jimp, pixelMatrix: RGBA[][];
  let nextImage: Jimp, nextImageFileName: string, nextImagePath: string;
  let nextWidth: number, nextHeight: number;
  let parsedImagePath: ParsedPath;
  let shiftYBy: number;

  shiftYBy = opts.yShufflePx;

  parsedImagePath = path.parse(imagePath);

  imgData = await Jimp.read(imagePath);
  nextImage = await Jimp.create(imgData.getWidth(), imgData.getHeight());
  nextWidth = nextImage.getWidth();
  nextHeight = nextImage.getHeight();

  pixelMatrix = getPixelMatrix(imgData);

  scanPixelMatrix(pixelMatrix, nextWidth, nextHeight, (x, y, currPixel) => {
    if(
      (y > shiftYBy)
      && ((y % shiftYBy) === 0)
    ) {
      for(let i = 0; i < shiftYBy; ++i) {
        let swapY: number, currY: number;
        let swapPixelVal: number, currPixelVal: number;
        swapY = y - (shiftYBy - i);
        currY = y - i;
        swapPixelVal = rgbaToInt(pixelMatrix[x][swapY]);
        currPixelVal = rgbaToInt(pixelMatrix[x][y]);
        nextImage.setPixelColor(swapPixelVal, x, currY);
        nextImage.setPixelColor(currPixelVal, x, swapY);

        // nextImage.setPixelColor(rgbaToInt(pixelMatrix[x][y - i]), x, y - (shiftYBy - i));
        // nextImage.setPixelColor(rgbaToInt(pixelMatrix[x][y + i]), x, y + (shiftYBy - i));
      }
    }
  });

  nextImageFileName = `shuffle_transform_${parsedImagePath.name}.${imgData.getExtension()}`;
  nextImagePath = [
    IMAGE_OUT_DIR_PATH,
    nextImageFileName,
  ].join(path.sep);
  await nextImage.writeAsync(nextImagePath);
  return nextImagePath;
}
