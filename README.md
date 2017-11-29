# BOTTOM-UP

## Define Openapi3 types

Module 'openapi3-ts' exports a bunch of interfaces mapping to openapi3 specs:
https://github.com/metadevpro/openapi3-ts/blob/master/src/model/OpenApi.ts

# TOP-DOWN

## Strategy1

Define a class for each openapi element, define each property of the element as a class property.

example: https://github.com/Apicurio/oai-ts-core/blob/master/src/models/common/info.model.ts

```js
export abstract class OasInfo extends OasExtensibleNode {
    public title: string;
    public description: string;
    public termsOfService: string;
    public contact: OasContact;
    public license: OasLicense;
    public version: string;
    public accept(visitor: IOasNodeVisitor): void {
        visitor.visitInfo(this);
    }
    public abstract createContact(): OasContact;
    public abstract createLicense(): OasLicense;
}
```
The idea comes from module https://github.com/Apicurio/oai-ts-core

It is an awesome module but IMO this design doesn't benefit our artifacts generation. 
I briefly describe how it works and the reason why I don't use its library here 
in case I overlook its value.

This module can parse an openapi json file as an instance of an openapi class, 
let's name the instance as `oasdocument`, each property of `oasdocument` is 
an instance of an openapi element class, e.g. `oasdocument.info` is an instance of 
class `Oas3Info`, and the module also defines model classes for all sub elements.

It's helpful if your domain is built following the openapi spec's structure, 
and most of the representations can extend openapi element classes, or you need 
an in-memory object of the swagger file. IMO LB4 is neither of them.

Creating a class instance is complicated with this design, since we need the code 
that assigns value for each property, for example:

```ts
// This would be the template file
// Assume we aready read the info obj from an openapi json file,
// and dump its property values into the template:
let info = new Oas3Info();
info.title = <%title>;
info.description = <%description>;
// etc...
// finally you get the model instance `info`
```

For those swagger resources, we mostly just keep the metadata from the swagger file 
as they are, and make them easily readable when generating a new swagger file from bottom-up.

We want users to be able to edit/add/delete those specs in a very straight forward way,
for example manipulating them as a json object, BUT having the type safety check when
they typing, so we come up with the second strategy [link...]()

This module is useful as a reference when unifying swagger2 and openapi3 specs, 
it defines common models under `/common` and OAS2, OAS3 models extend them, see: https://github.com/Apicurio/oai-ts-core/tree/master/src/models

## Strategy2

## Build template 

Yeoman uses https://github.com/SBoudrias/mem-fs-editor to build template.

Implementation details to be figured out:

- How to build a function(multiple parameters, sync/async, multiple returns)
- How to add Class property
- How to add multiple decorators to one property

*See implementation in loopback-swagger as a reference*

## Design principles: 

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

Conflict means something like:

```ts
@get('/greet')
@param(name)
async function hi(name: string, limit: number) {
  // the apispec only has one param, but the function has two!
}
```

Let user solve the conflict if any. This is restricted by the language nature: 
we have define a function as it is, it's not user-friendly to build a function at runtime.

## Loopback4 app structure

Given a swagger/openapi file, this will be the app we generate for user:

- /src
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
- index.ts

You can check files in https://github.com/jannyHou/spike/blob/openapi/app
to see the template details.

For the questions I post in:

- https://github.com/jannyHou/spike/blob/openapi/app/src/controllers/generate-apispec-for-server.ts
- https://github.com/jannyHou/spike/blob/openapi/app/src/application.ts

I am going to give answers if I have a chance to talk with a rest server expert tomorrow.
While appreciate any feedbacks or discussions before that happens :)

### **controller files**

Target on `openapiObj.paths`

*swagger-controller.ts*

https://github.com/jannyHou/spike/blob/openapi/app/src/controllers/swagger-controller.ts

### **model files**

Target on `openapiObj.components.schemas`

Design TBD.

#### Convert swagger schema to LB model

- anyOf, oneOf, allOf

LB3 model doesn't have these concepts, let's make them happen in LB4.

### **swaggerResources files**

Target on `openapiObj.components` and some other resources like `externalDocs`

## CLI prompts

- Read all schemas(defined in `openapiObj.components.schemas`) in the swagger file
- Convert to LB model
  - option1: Let user choose which ones to convert
  - option2: Convert all of them (preffer this)
- Split into multiple controllers by `tag`
- Create artifacts in parallel:
  - `/src/controllers/swaggerResources`
  - `/src/models`
  - `/src/controllers/pathSpecs`
  - `/src/controllers/swagger-controller.ts`
  - `/src/application.ts`
  - `index.ts`

## Artifacts mapping

Please check the picture in https://github.com/jannyHou/spike/blob/openapi/mapping.png

FULL DETAILS NOT COMPLETED YET

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


## TBD

- unify swagger2 and openapi3
- design a Model fully compatible with swagger schema
- need a type conversion system mapping openapi schema type to ts type
- refactor the current rest server
  - multiple restServer support
  - see ALL my questions in   
    - https://github.com/jannyHou/spike/blob/openapi/app/src/controllers/generate-apispec-for-server.ts
    - https://github.com/jannyHou/spike/blob/openapi/app/src/application.ts
- we need a domain representation for parameter to make it fully reusable, if we want, instead of only using the controller function decorator(not a high priority IMO) 
