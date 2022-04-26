
import path, { ParsedPath } from 'path';

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
  applyColorTransform
} from './transform/color-transform';
import {
  shuffleTransform,
} from './transform/shuffle-transform';
import {
  redTransform,
} from './transform/red-transform';

export async function ezdImageMain(argv: string[]) {
  let cliArgs: CliArgs, parsedFilePath: ParsedPath;
  let colorTransformPath: string;
  let colorTransformPromise: Promise<string>,
    shuffleTransformPromise: Promise<string>,
    testTransformPromise: Promise<string>;
  let transformPromises: Promise<string>[];
  cliArgs = parseArgV(argv);
  console.log('cliArgs');
  console.log(cliArgs);
  console.log(IMAGE_OUT_DIR_PATH);
  await mkdirIfNotExists(IMAGE_OUT_DIR_PATH);
  parsedFilePath = path.parse(cliArgs.filePath);

  transformPromises = [];

  colorTransformPromise = applyColorTransform(cliArgs.filePath, {
    outputFileName: `color_transform_${parsedFilePath.name}`,
    r: -0.25,
    g: 0.25,
    b: 0.15,
  });
  transformPromises.push(colorTransformPromise);

  shuffleTransformPromise = shuffleTransform(cliArgs.filePath, {
    yShufflePx: 10,
  });
  transformPromises.push(shuffleTransformPromise);

  testTransformPromise = redTransform(cliArgs.filePath, {
    redThreshold: {
      redMin: 200,
      greenMax: 75,
      blueMax: 75,
    },
  });
  transformPromises.push(testTransformPromise);

  await Promise.all(transformPromises);
}
