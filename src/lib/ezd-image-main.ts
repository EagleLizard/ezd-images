
import path, { ParsedPath } from 'path';

import Jimp from 'jimp';

import {
  parseArgV,
  CliArgs,
} from './cli/parse-args';
import {
  mkdirIfNotExists,
} from '../util/files';
import {
  IMAGE_OUT_DIR_PATH,
} from './constants';
import {
  clonePixel,
  ColorChannel,
  RGBA, rgbaToInt, scanPixelMatrix,
} from './pixel';

export async function ezdImageMain(argv: string[]) {
  let cliArgs: CliArgs, parsedFilePath: ParsedPath;
  cliArgs = parseArgV(argv);
  console.log('cliArgs');
  console.log(cliArgs);
  console.log(IMAGE_OUT_DIR_PATH);
  await mkdirIfNotExists(IMAGE_OUT_DIR_PATH);
  parsedFilePath = path.parse(cliArgs.filePath);
  await applyColorTransform(cliArgs.filePath, {
    outputFileName: `color_transform_${parsedFilePath.name}`,
    r: -0.15,
    g: 0.15,
    b: 0.075,
  });
}

type ColorTransformOpts = {
  outputFileName: string,
  r?: number,
  g?: number,
  b?: number,
};

async function applyColorTransform(imagePath: string, opts: ColorTransformOpts) {
  let imgData: Jimp, pixelMatrix: RGBA[][];
  let nextImage: Jimp, nextImageFileName: string, nextImagePath: string;
  let nextWidth: number, nextHeight: number;
  let colorChannels: ColorChannel[];
  colorChannels = ['r', 'g', 'b'];
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
      nextPixel = applyChannelTransform(nextPixel, colorChannel, opts[colorChannel])
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

function getPixelMatrix(image: Jimp): RGBA[][] {
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
