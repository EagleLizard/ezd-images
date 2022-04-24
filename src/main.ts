
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { ezdImageMain } from './lib/ezd-image-main';
import { isString } from './lib/type-validation/validate-primitives';

(async () => {
  try {
    await main(process.argv);
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main(argv: string[]) {
  await ezdImageMain(argv);
}
