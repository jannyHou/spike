const async = require('async');
const glob = require('glod');
import * as fs from 'fs';

export async function getPathspecs() {
  let files:any = await glob('./**.json',{});
  let pathSpecs:any = {};

  // bug: it doesn't wait
  await async.forEachOf(files, (value: string, key: string, callback: any) => {
    fs.readFile(value, "utf8", (err, data) => {
        if (err) return callback(err);
        try {
          pathSpecs[key] = JSON.parse(data);
        } catch (e) {
          return callback(e);
        }
        callback();
    });
  }, (err:any) => {
    if (err) console.error(err.message);
  });

  return pathSpecs;
}



