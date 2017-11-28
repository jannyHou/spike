// This file is generated as template when parsing a swagger file from top-down,
// and is used when generating a swagger file from bottom-up.
// Function `getPathSpecs` is used in `../swagger-controller.ts`.

// most of the code are duplicate of `pathSpecs.ts`,
// please extract them into a lib when implementing the template.

// We can build sub cli for swagger cmd, like `lb swagger --add parameters`
// which adds a `/parameter` template folder under `/swaggerResources`
// while this file has to be entirely regenerated everytime

import * as OA3_TYPES from 'openapi3-ts';
import { swaggerResponses } from './responses/responses';

export interface swaggerResourcesType {
  swaggerResponses?: OA3_TYPES.ResponsesObject
  // !important etc...
}

export function getSwaggerResources() {
  let swaggerResources: swaggerResourcesType = {};
  swaggerResources.swaggerResponses = swaggerResponses;
  return swaggerResources;
} 

