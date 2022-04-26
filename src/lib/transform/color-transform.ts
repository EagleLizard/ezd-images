
import path from 'path';

import Jimp from 'jimp';

import {
  IMAGE_OUT_DIR_PATH,
} from '../constants';
import {
  clonePixel,
  ColorChannel,
  getPixelMatrix,
  RGBA,
  rgbaToInt,
  scanPixelMatrix,
} from '../pixel';

export type ColorTransformOpts = {
  outputFileName: string,
  r?: number,
  g?: number,
  b?: number,
};

export async function applyColorTransform(imagePath: string, opts: ColorTransformOpts) {
  let imgData: Jimp, pixelMatrix: RGBA[][];
  let nextImage: Jimp, nextImageFileName: string, nextImagePath: string;
  let nextWidth: number, nextHeight: number;
  let colorChannels: ColorChannel[];
  colorChannels = [ 'r', 'g', 'b' ];
  colorChannels.forEach(colorChannel => {
    if(opts[colorChannel] === undefined) {
      opts[colorChannel] = 0;
    }
  });

  imgData = await Jimp.read(imagePath);
  nextImage = await Jimp.create(imgData.getWidth(), imgData.getHeight());

  pixelMatrix = getPixelMatrix(imgData);
  nextWidth = nextImage.getWidth();
  nextHeight = nextImage.getHeight();

  scanPixelMatrix(pixelMatrix, nextWidth, nextHeight, (x, y, currPixel) => {
    let nextPixelVal: number;
    let nextPixel: RGBA;

    currPixel = pixelMatrix[x][y];
    nextPixel = clonePixel(currPixel);

    colorChannels.forEach(colorChannel => {
      nextPixel = applyChannelTransform(nextPixel, colorChannel, opts[colorChannel]);
    });

    nextPixelVal = rgbaToInt(nextPixel);
    nextImage.setPixelColor(nextPixelVal, x, y);
  });

  nextImageFileName = `${opts.outputFileName}.${imgData.getExtension()}`;
  nextImagePath = [
    IMAGE_OUT_DIR_PATH,
    nextImageFileName,
  ].join(path.sep);
  await nextImage.writeAsync(nextImagePath);
  return nextImagePath;
}

function applyChannelTransform(pixel: RGBA, channel: ColorChannel, transformBy: number): RGBA {
  let nextPixel: RGBA, channelDiff: number;
  let transformVal: number, nextChannelVal: number;
  nextPixel = clonePixel(pixel);
  channelDiff = (transformBy > 0)
    ? 255 - nextPixel[channel]
    : nextPixel[channel]
  ;
  transformVal = Math.round(transformBy * channelDiff);
  nextChannelVal = nextPixel[channel] + transformVal;
  if(
    (channelDiff > 0)
    && (nextChannelVal <= 255)
    && (nextChannelVal >= 0)
  ) {
    nextPixel[channel] = nextChannelVal;
  }
  return nextPixel;
}
