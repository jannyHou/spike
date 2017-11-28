import * as OA3_TYPES from 'openapi3-ts';
import { originalResponses } from './originalResponses';
// export is important
// otherwise you see this error: 
// "Public property 'schemas' of exported class has or is using private name 'schemaType'."
// we need to be careful about the type's name
// or don't even create such a short cut but using OA3_TYPES.ResponseObject all the time?
export type responseType = OA3_TYPES.ResponseObject;
export type responsesType = OA3_TYPES.ResponsesObject;

export class Responses {
    responses:responsesType;

    constructor(responses?: responsesType) {
      if (responses) this.responses = responses;
    };

    addResponse(key: string, item: responseType):void {
      this.responses[key] = item;
    }

    returnResponse(): responsesType {
        return this.responses;
    }
}

export let swaggerResponses = new Responses(originalResponses);
// All code above is what we can generate by the template

// The following code shows how you can add new response object
import { newResponse } from './newResponse';
swaggerResponses.addResponse('hi', newResponse.hi);





