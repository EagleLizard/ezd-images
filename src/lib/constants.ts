
import path from 'path';

export const ROOT_DIR_PATH = path.resolve(__dirname, '..', '..');
export const DATA_DIR_PATH = [
  ROOT_DIR_PATH,
  'test-data',
].join(path.sep);

export const IMAGE_OUT_DIR_NAME = 'img-out';
export const IMAGE_OUT_DIR_PATH = [
  ROOT_DIR_PATH,
  IMAGE_OUT_DIR_NAME,
].join(path.sep);
