import { Stats } from "fs";
import { mkdir, stat } from "fs/promises";

export async function checkDir(dirPath: string): Promise<boolean> {
  let stats: Stats;
  try {
    stats = await stat(dirPath);
  } catch(e) {
    if(e?.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
  return stats.isDirectory();
}

export async function mkdirIfNotExists(dirPath: string) {
  let dirExists: boolean;
  dirExists = await checkDir(dirPath);
  if(dirExists) {
    return;
  }
  await mkdir(dirPath);
}
