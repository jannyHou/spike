import * as PATH_SPECS from './pathSpecs/pathSpecs';
import { get, post } from '@loopback/rest';

export class SwaggerController {
    @get('/pets', PATH_SPECS.findPetsSpec)
    // Had a chat with Raymond, two flavours for decorators we can choose:
    // - option 1: provide full spec like the code above
    // - option 2: provide composed decorators seperately
    // option 1 is definitely easier when doing top-down parsing.

    // @server() multiple server support, 
    // restServer expert can share more details of it.

    // For parameters parsing:
    // 1. parameters must be fully resolved without `$ref`,
    // need a type conversion system mapping openapi schema type to ts type
    // 2. function name is the value of `x-operation-name`
    // 3. we can dump some implementation details into function
    // if `x-implementation-template` is specified
    async findPets(tags:[string], limit:number) {
      // enjoy writing your `findPets` implementation here
    }

    @post('/pets', PATH_SPECS.addPetSpec)
    // @server()
    async addPet() {
      // enjoy writing your `addPets` implementation here
    }

    // ... other paths
}