# BOTTOM-UP

## Define Openapi3 types

Module 'openapi3-ts' exports a bunch of interfaces mapping to openapi3 specs:
https://github.com/metadevpro/openapi3-ts/blob/master/src/model/OpenApi.ts

# TOP-DOWN

## Parse a swagger2/3 file

Parse a swagger2/3 file into spec models, 
then create a swagger2/3 object for building LB app.
A very helpful module: https://github.com/Apicurio/oai-ts-core.

Models for spec: https://github.com/Apicurio/oai-ts-core/tree/master/src/models
Read the swagger file, build each spec as an instance of the spec model(class).

*Could not use it out of box, solve the build failure OR build our own one*

## Build template 

Yeoman uses https://github.com/SBoudrias/mem-fs-editor to build template.

Implementation details to be figured out:

- How to build a function(multiple parameters, sync/async, multiple returns)
- How to add Class property
- How to add multiple decorators to one property

*See implementation in loopback-swagger as a reference*

## Loopback4 app structure

- /controllers
  - swagger-controller.ts
  - /pathSpecs (created from `openapiObj.paths`)
    - pathSpecs.ts
    - path1.json
    - path2.json
  - /swaggerResources (created from `openapiObj.components` and other resources)
    - swaggerResources.ts
    - parameters.json
    - responses.json
    - examples.json
    - requestBody.json
    - headers.json
    - securitySchemas.json
    - links.json
    - callbacks.json
- /models
- generate-apispec-for-server.ts
- application.ts

### **controller file**

Target on `openapiObj.paths`

*swagger-controller.ts*

```js
export class SwaggerController {
    // BOTTOM-UP:
    // when encounter a ref to schema, 
    // resolve the schema by convert the model defined in folder `/models`,
    // or find it in `/swaggerResources/schemas`
    @get('/tests')
    // the following objects will be retrived from `/pathSpecs`
    // or be defined here
    // - if value not provided, retrieve from `/pathSpecs`
    // - otherwise use the provided value
    @param()
    @response()
    @example()
    @header()
    @security()
    @link()
    @callback()
    // parameters must be fully resolved without `$ref`,
    // need a type conversion system mapping openapi schema type to ts type
    async findAll(param1, param2) {
      // enjoy writing your implementation here
    }
}
```
### **model file**

Target on `openapiObj.components.schemas`

Design TBD.

#### Convert swagger schema to LB model

- anyOf, oneOf, allOf

LB3 model doesn't have these concepts, let's make them happen in LB4.

### **application file**

*application.ts*

```js
class MyApp extends Application {
    // create a `new restServer(config)`?
}
```

What does apic need to do with:
- swagger info
- consumes
- produces
- securities

## CLI prompts

- Read all schemas(defined in `openapiObj.components.schemas`) in the swagger file
- Convert to LB model
  - option1: Let user choose which ones to convert
  - option2: Convert all of them (preffer this)
- (Optional) split into multiple controllers by `tag`
- Create artifacts in parallel:
  - `/controllers/swaggerResources`
  - `/models`
  - `/controllers/pathSpecs`
  - `/controllers/swagger-controller.ts`
  - `application.ts`

## Artifacts mapping

NOT COMPLETED YET

|                 | LB Artifact         | Swagger 2   | Openapi 3             |
|-----------------|---------------------|-------------|-----------------------|
| swagger version | ?                   | swagger     | openapi               |
| info            | ?                   | info        | info                  |
| consumes        | ?                   | ?           | ?                     |
| produces        | ?                   | ?           | ?                     |
|                 |                     |             |                       |
| paths           | operation decorator | paths       | paths                 |
| definitions     | model properties    | definitions | components/schemas    |
| parameters      | param decorator     | parameters  | components/parameters |
| responses       | definitions?        | responses   | components/responses  |
|                 |                     |             |                       |
| servers         | ?                   | N/A         | servers               |
| host            | restServer's config | host        | servers[i].url        |
| basePath        | restServer's config | basePath    | servers[i].url        |
| schemas         | restServer's config | schemas     | servers[i].url        |
|                 |                     |             |                       |
| security        | ?                   | security    | security              |

## Extensibility

KEY PRINCIPLES: 

- In the top-down convertion, ONLY put same spec in one place to make sure there is no conflict when building it from bottom-up
- The original reusable swagger spec element should be still reusable

### Domain representation we have 

Example: Model

Two options:

- Convert everything
- Convert compatible ones and leave the incompatible ones

The choice should be case by case, now we only have `Model`, or say `RestModel`,
and I suggest we build it to be fully compatible with swagger schema,
e.g. anyOf, oneOf, allOf

### Domain representation we don't have

Example: Response

Give people the flexibility to plugin extensions.

### Must be fully resolved when build

Example: function parameters

Let user solve the conflict if any. This is restricted by the language nature: 
we have define a function as it is, it's not user-friendly to build a function at runtime.

## TBD

- unify swagger2 and openapi3
- design a Model fully compatible with swagger schema
- need a type conversion system mapping openapi schema type to ts type
- refactor the current rest server
  - multiple restServer support
- we need a domain representation for parameter to make it fully reusable, if we want, instead of only using controller function decorator 
