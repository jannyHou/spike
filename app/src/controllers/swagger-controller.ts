import { getPathSpecs } from './pathSpecs/pathSpecs';

export class SwaggerController {
    pathSpecs:any;

    constructor() {
      this.pathSpecs = this._getPathSpecs();
    };

    async _getPathSpecs() {
      let result = await getPathSpecs();
      return result; 
    }

    @get('/pets', this.pathSpces.findPets)
    // had a chat with Raymond, two flavours for decorators:
    // - option 1: provide full spec like the code above
    // - option 2: provide composed decorators seperately
    // option 1 is definitely easier when doing top-down parsing.
    // @server()
    // 1. parameters must be fully resolved without `$ref`,
    // need a type conversion system mapping openapi schema type to ts type
    // 2. function name is the value of `x-operation-name`
    // 3. we can dump some implementation details if `x-implementation-template` is specified
    async findPets(tags:[string], limit:number) {
      // enjoy writing your `findPets` implementation here
    }

    @post('/pets', this.pathSpecs.addPet)
    // @server()
    async addPet() {
      // enjoy writing your `addPets` implementation here
    }

    // ... other paths
}