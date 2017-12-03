import { Responses } from '../lib.not.in.template';
import { originalResponses } from './originalResponses';
export let OASResponses = new Responses(originalResponses);
// All code above is the template we generate

// The following code shows how you can add new response object:
// - create a new .ts file that export your new response obj as a json object
// - import it in this file and call `addResponse()` to add it like the 2 lines below
import { newResponse } from './newResponse';
OASResponses.addResponse('hi', newResponse.hi);