// Use this file when generating swagger file from bottom-up!!
const async = require('async');
import * as fs from 'fs';

export async function getswaggerResources() {
  let files:any = {responses: "./responses.json"};
  let components:any = {};

  // bug: it doesn't wait
  await async.forEachOf(files, (value: string, key: string, callback: any) => {
    fs.readFile(value, "utf8", (err, data) => {
        if (err) return callback(err);
        // console.log('data' +  data);
        try {
          components[key] = JSON.parse(data);
        } catch (e) {
          return callback(e);
        }
        callback();
    });
  }, (err:any) => {
    if (err) console.error(err.message);
  });

  // console.log(components);
  return components;
}

// getCompoennts();


