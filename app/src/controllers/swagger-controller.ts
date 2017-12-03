// operation decorators decorate model properties to fit into the OAS schema
// OAS module also provides the type generator that reads metadata of a model
// and generate the type used controller
import * as PATH_SPECS from './pathSpecs/pathSpecs';
import { NewPet } from '../models/new-pet';
import { get, post, schemaTypeGen } from '@loopback/OAS';

// here `NewPet` is a class, `typeGen` takes in an array of model 
// classes(the targets for metadata retrieving), then returns the
// corresponding schema types
const SCHEMA_TYPES = schemaTypeGen([NewPet]);

export class OASControllerDefault {
    // Had a chat with Raymond, two flavours for decorators we can choose:
    // - option 1: provide full spec like the code above
    // - option 2: provide composed decorators seperately
    // option 1 is definitely easier when doing top-down parsing.

    // @server() multiple server support.

    // For parameters parsing:
    // 1. parameters must be fully resolved without `$ref`,
    // need a type conversion system mapping openapi schema type to ts type
    // 2. function name is the value of `x-operation-name`
    // 3. we can dump some implementation details into function
    // if `x-implementation-template` is specified

    @post('/pets', PATH_SPECS.addPet)
    async addPet(newPet: SCHEMA_TYPES.NewPet) {
        <%x-implementation-template%>
    }

    @get('/pets', PATH_SPECS.findPets)
    async findPets() {
        <%x-implementation-template%>
    }

    // other paths...
}