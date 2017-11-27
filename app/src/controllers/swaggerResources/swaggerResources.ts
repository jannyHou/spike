// This file is generated as template when parsing a swagger file from top-down,
// and is used when generating a swagger file from bottom-up.
// Function `getPathSpecs` is used in `../swagger-controller.ts`.

// most of the code are duplicate of `pathSpecs.ts`,
// please extract them into a lib when implementing the template.

import {promisify} from 'util';
const glob = require('glob');
const { forEach } = require('p-iteration');
const fs = require('fs-promise');

export async function getSwaggerResources() {
  const globAsync = promisify(glob);
  let files:[string] = await globAsync('./**.json',{});
  let swaggerResources:any = {};

  async function readFiles () {
    await forEach(files, async (file:string) => {
      const contents = await fs.readFile(file, 'utf8');
      let resourceName = file.replace('./', '');
      resourceName = resourceName.replace('.json', '');
      swaggerResources[resourceName] = JSON.parse(contents);
    });
  }
  
  await readFiles();
  console.log(swaggerResources);
}
