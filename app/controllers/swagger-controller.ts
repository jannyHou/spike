export class SwaggerController {
    @get('/pets')
    //no input: use the spec defined in `/pathSpecs`
    //input: override it with own data
    @description()
    @parameters()
    @responses()
    @server()
    // parameters must be fully resolved without `$ref`,
    // need a type conversion system mapping openapi schema type to ts type
    async findPets(tags:[string], limit:number) {
      // enjoy writing your `findPets` implementation here
    }

    @post('/pets')
    @description()
    @requestBody()
    @server()
    async addPet() {
      // enjoy writing your `addPets` implementation here
    }

    // ... other paths
}