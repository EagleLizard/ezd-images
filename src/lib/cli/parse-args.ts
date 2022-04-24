
import path from 'path';

import {
  isString,
} from '../type-validation/validate-primitives';

export type CliArgs = {
  filePath?: string;
};

export function parseArgV(argv: string[]): CliArgs {
  let argParts: string[], parsedCliArgs: CliArgs;
  let filePath: string;
  parsedCliArgs = {} as CliArgs;
  argParts = argv.slice(2);
  
  if(argParts.length > 0) {
    if(isString(argParts[0])) {
      filePath = parseFileArg(argParts[0]);
    }
  }

  parsedCliArgs.filePath = filePath;

  return parsedCliArgs;
}

function parseFileArg(fileArg: string): string {
  let resolvedFilePath: string;
  resolvedFilePath = path.resolve(fileArg);
  return resolvedFilePath;
}

