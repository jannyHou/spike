// This file is generated as template when parsing a swagger file from top-down,
// and is used when generating a swagger file from bottom-up.

// We can build sub cli for swagger cmd, like `lb swagger --add parameters`,
// which adds a `/parameter` template folder under `/swaggerResources`,
// and imports parameters in this file, adds it to `swaggerResources`,
// see the two lines marked as (template update)
// I think this file has to be entirely regenerated everytime

import { 
  OASResources
} from './lib.not.in.template';
import { OASResponses } from './responses/responses';
// (template update) import { OASParameters } from './parameters/parameters';

export let resources = new OASResources();
resources.addResource('OASResponses', OASResponses.returnResponse());
// (template update) resources.addResource('OASParameters', OASParameters.returnParameter());

// now if you retrieve `OASResources` from other file, 
// the new resource objects are added



