import { getSwaggerResources } from './swaggerResources/swaggerResources';
import { getSwaggerSchemas } from '../models/warning';
const _ = require('lodash');

async function someFunctionNotExistYet(name: string, resources:any){
  
}

export async function getAPISpecPerServer(name: string) {
  let resources = getSwaggerResources();
  let schemas = await getSwaggerSchemas();
  // see doc in http://loopback.io/doc/en/lb4/Defining-and-validating-the-API.html#putting-together-the-final-api-specification
  // previously we manually generate the `apispec`, put them together,
  // then register a server with it by `server.api(spec);`

  // I am not sure what is the approach now:
  // how can I generate the paths spec for a server with all controller files I have?
  // - we already have a function to do that?
  // - we need to write such a function?
  // - we don't do it anymore?
  // anyway the RESOURCES are here to be consumed by a server.

  // if our rest server doesn't support reading `$ref`
  // - we have to expand everything here?
  // - or support it in rest server? (I prefer this one)
  // if it supports then we are good
  let paths = await someFunctionNotExistYet(name, resources);
  // pseudocode, doesn't mean merge them directly like this.
  return _.merge({}, paths, schemas, resources);
  
}

export async function getServerAPISpecs() {
    let result:any = {};

    result.serverFoo = await getAPISpecPerServer('serverFoo');
    result.serverBar = await getAPISpecPerServer('serverBar');

    return result;
}