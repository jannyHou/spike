// This file is generated as template when parsing a swagger file from top-down,
// and is used when generating a swagger file from bottom-up.
// Function `getPathSpecs` is used in `../swagger-controller.ts`.

import {promisify} from 'util';
const glob = require('glob');
const { forEach } = require('p-iteration');
const fs = require('fs-promise');

export async function getPathSpecs() {
  const globAsync = promisify(glob);
  let files:[string] = await globAsync('./**.json',{});
  let pathSpecs:any = {};

  async function readFiles () {
    await forEach(files, async (file:string) => {
      const contents = await fs.readFile(file, 'utf8');
      let pathName = file.replace('./', '');
      pathName = pathName.replace('.json', '');
      pathSpecs[pathName] = JSON.parse(contents);
    });
  }
  
  await readFiles();
  console.log(pathSpecs);
}
