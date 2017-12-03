// lib file for responses object, 
// should move to `OASModule/someLibFolder/OASResources/response.lib.ts`
import * as OA3_TYPES from 'openapi3-ts';
// export the types here is important
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

// the code below should be in a seperate lib file

// lib file for OAS resources,
// should move to `OASModule/someLibFolder/OASResources/OASResources.lib.ts`
export interface OASResourcesType {
    [key: string]: any
    OASResponses?: OA3_TYPES.ResponsesObject
    // !this interface is not completed yet, more resource items to be added
}

export class OASResources {
  OASResources?: OASResourcesType
  
  constructor(OASResources?: OASResourcesType) {
      this.OASResources = OASResources || {};
  }  

  addResource(key: string, value: any) {
    this.OASResources = this.OASResources || {};
    this.OASResources[key] = value;
  }

  returnResources(): OASResourcesType {
      return this.OASResources || {};
  }

}
