# TOP-DOWN Conversion to LB4 Artifacts

The design begins with assumptions that give our framework the max possibility:

- **one app** can have **multiple OAS** files
- **one OAS** file contains **multiple servers** and **multiple controllers**(by tags)
- **one lb4 rest server** only use **one OAS** file as its routing reference
  (any better word to describe what does swagger file mean for a rest server?)
- **one lb4 rest server** only has **one host** and **one port**, and it's creatd by `http.createServer()`
  (we will have https and http2 server in the future, not a concern now)

*I understand that there are debate on the assumptions above,* 
*let's start with the max possibility and narrow it down afterwards.*
*And one of the spike's purposes is: providing a plan that only needs a few line's change if we decide to switch from some assumptions to the other ones, instead of people creating long PoC PRs*

Picture [mapping.png](https://github.com/jannyHou/spike/blob/master/mapping.png) shows the concepts mapping between LB4 artifacts and swagger2/OAS3 elements.

I will use openapi3 spec in the examples due to it's multiple server support and better orginazing of components, so in this spike you will see the word `OAS` everywhere NOT `swagger`.

I am going through the OAS elements in that picture and elaborate 

- where to put them in the generated template
- how to make users easily modify them
- how to retrieve/use them when building the OAS object from bottom-up

**!IMPORTANT:**

My spike also includes creating a new module for OAS, it contains some existing functionalities from rest server module, like generating `pathSpecs` for a controller class, and some features we don't have yet, like generating `schemaSpecs` for a model class.

I put the design of OAS module in file [OAS.md](https://github.com/jannyHou/spike/blob/reviewBranch/OAS.md), please read it first to understand how I use the module below. If some parts are too complicated or based on wrong assumptions(I don't have enough knowledge of our rest module so some understanding could be wrong), please at least take a look of the [functionality section](https://github.com/jannyHou/spike/blob/reviewBranch/OAS.md#functionalities)

## version

I haven't decided would the OAS module be a component or other extensions, in the spike I just simplify it as a class extends `Context`, so you can create an instance `oas` in `application.ts`, bind specs to it. Then bind `oas` to a rest server instance `restServerFoo`

We create a new `OAS` instance in the template, with `version` provided in constructor. `version` is NOT optional, since lots of functions in the OAS module should be version based.

*template file `app/src/application.ts`*

```js
import { OAS } from '@loopback/OAS';
export class MyMicroservice extends Application {
    constructor() {
    super({
      components: [RestComponent],
    });
    const app = this;
  }
  async start() {
    const oas = new OAS('3.0.0');
    await super.start();
  }
}
```

## servers

There will be a parsing function in the OAS module that returns the servers we want to build for this app,
in the spike, I simplify the scenario as an array of servers of which url is **a string**

e.g.:

```
servers:
  - url: https://api.example.com/v1
    description: Production server (uses live data)
  - url: https://sandbox-api.example.com:8443/v1
    description: Sandbox server (uses test data)
```

*template file app/src/application.ts*

```js
export class MyMicroservice extends Application {
    constructor() {
    super({
      components: [RestComponent],
    });
    const app = this;
  }
  async start() {
    const oas = new OAS('3.0.0');

    const serverPublic = await app.getServer(RestServer);
    const serverPrivate = await app.getServer(RestServer);
    // assume we support using an url as the rest server's config
    serverPublic.bind("rest.url").to(url1_parsed_from_openapi);
    serverPublic.bind("rest.description").to(desc1_parsed_from_openapi);
    serverPublic.bind("rest.oas").to(oas);

    serverPrivate.bind("rest.url").to(url2_parsed_from_openapi);
    serverPrivate.bind("rest.description").to(desc12_parsed_from_openapi);
    serverPrivate.bind("rest.oas").to(oas);
    await super.start();
  }
}
```
Now the server only provides info of `OAS.servers`, for controllers, I will cover it in [the paths section](#paths)


## paths

Controllers are categorised by `tags` in an OAS file, we create one controller for each tag, and a default controller for paths with no tag.

- each path is converted to a controller function, the function name is path's `x-operation-name`(unique)
- we can dump some implementation details in the function if `x-implementation-template` is specified

The `controller.ts` file looks like this:

*template file app/src/controllers/oas-controller-default.ts*
```js
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
``` 

The template file contains these things:

- import operation decorators from OAS module 
- import model classes from `../models` as targets, import type generator function from OAS module, give targets to the function, it collects metadata and generate schema types for targets, returns the types.
  - the types should be interfaces specifying the type of each property, and a property is optional or requried
- import path specs from `./pathSpecs`, the decorator has type safety check in editor, you don't have to realize something wrong until compiling time: 
  - In folder `/controllers/pathSpecs`, we create a `.ts` file for each path, it exports the path spec as a json object
  - As a top-down parsing, we keep the specs simple as one object can be passed as the 2nd parameter of `@operation('/pathName', pathSpec)`,instead of parsing them into composed decorators like `@operation()@param()` 
- the `parameters` object in the OAS `path` should be fully resolved without `$ref`

And in `application.ts`, we have two choices:
- option1: bind controllers to an `oas`
- option2: bind controllers to a server instance

With the OAS module and the refactored rest server module, we can do either:

option1:

```js
import { OASControllerDefault } from './controllers/oas-controlle-default';
export class MyMicroservice extends Application {
    constructor() {
    super({
      components: [RestComponent],
    });
    const app = this;
  }
  async start() {
    const oas = new OAS('3.0.0');
    // bind controller to `oas`
    oas.bind('oas.controllers').to([OASControllerDefault]);

    const serverPublic = await app.getServer(RestServer);
    const serverPrivate = await app.getServer(RestServer);
    // assume we support using an url as the rest server's config
    serverPublic.bind("rest.url").to(url1_parsed_from_openapi);
    serverPublic.bind("rest.description").to(desc1_parsed_from_openapi);
    // `serverPublic` and `serverPrivate` share the same controllers bound to `oas`
    serverPublic.bind("rest.oas").to(oas);

    serverPrivate.bind("rest.url").to(url2_parsed_from_openapi);
    serverPrivate.bind("rest.description").to(desc12_parsed_from_openapi);
    serverPrivate.bind("rest.oas").to(oas);
    await super.start();
  }
}
```

option2:

```js
// assume we have two contollers
import { OASControllerDefault } from './controllers/oas-controlle-default';
import { OASControllerBar } from './controllers/oas-controlle-bar';

export class MyMicroservice extends Application {
    constructor() {
    super({
      components: [RestComponent],
    });
    const app = this;
  }
  async start() {
    const oas = new OAS('3.0.0');

    const serverPublic = await app.getServer(RestServer);
    const serverPrivate = await app.getServer(RestServer);
    // assume we support using an url as the rest server's config
    serverPublic.bind("rest.url").to(url1_parsed_from_openapi);
    serverPublic.bind("rest.description").to(desc1_parsed_from_openapi);
    serverPublic.bind("rest.oas").to(oas);
    // here we bind controllers per server instance
    // rest server component will call some functions from `oas` to get the `pathSpces`,
    // details please check [OAS.md](https://github.com/jannyHou/spike/blob/reviewBranch/OAS.md)
    serverPublic.bind("rest.controllers").to([OASControllerDefault]);

    serverPrivate.bind("rest.url").to(url2_parsed_from_openapi);
    serverPrivate.bind("rest.description").to(desc12_parsed_from_openapi);
    serverPrivate.bind("rest.oas").to(oas);
    // here we bind controllers per server instance
    serverPublic.bind("rest.controllers").to([OASControllerBar]);
    await super.start();
  }
}
```

At this moment I could not decide the relation between `tags` and `servers` in an OAS file,
appreciate more opinions on these two choices. 
By top-down parsing I tend to bind controllers to `oas`...

## resources

OAS resources are the ones marked with yellow border in [mapping.png](https://github.com/jannyHou/spike/blob/master/mapping.png).

OAS resources are not universal concepts like model and controller in LB4, so we may not want to cast them into complicated reprentations, I have 2 proposals:

### json file

Store each resourcesObject in a json file. The objects are parsed as they are without resolving any reference value.

Example: https://github.com/jannyHou/spike/tree/openapi/app/src/controllers/swaggerResources

Pros: 

- easy to generate as template files, the json files contain the original object parsed from the OAS file without additional code, in `application.ts` just add one line to register the resources:

```js
oas.bind('oas.resources.path').to('./controlers/OASResources');
```

Cons:

- **no type safety check for resource object in editor**, you have to run some validation function and see the errors at compling time
- overhead of adding code in OAS component to read json files and merge them. 
- the files have to be organized in the only way that OAS module's parsing function accepts.

Personally I would not use this approach compared with the other one...

### class and interface

Don't have a good name for it yet...

In the OAS module, for each resource, we create a class to manage its resource items: 

- take in an object of items in constructor
  - this can be used for adding original OAS data
- provide a function to add more item
- provide a function to return all items

```js
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
```

And take the same approach to create a class for `OASResources`,
which can add new resource and return existing resources

I temporarily write the lib code in https://github.com/jannyHou/spike/blob/reviewBranch/app/src/controllers/OASResources/lib.not.in.template.tsts for the classes & types above, but it is not a part of the template.

The template folder is generated like this:

https://github.com/jannyHou/spike/tree/reviewBranch/app/src/controllers/OASResources

Cons:

- We need some .ts files to generate resource instances
  - one file that adds resources: 2+2*n lines code, n = num of resources
  - each resource has one file to add resource items: 1+2*n lines code, n= num of resource items

Pros:

- keep each resource item as a js object, more flexible and editorable than json.
- **type safety check in editor**
- people can easily do these:
   - edit/add a new resource object in an existing resource folder with type safety check
   - add(generate) a new resource folder containing template files by cli
- OAS module only provides lib files that exports classes and types, but it doesn't constrain your template file structure.
- the additional .ts files only contain a few lines code, but it saves our effort to design and maintain OAS module's file structure constraint.

Add resources in `application.ts`:

*template file app/src/application.ts*

```js
import { resources } from './controllers/OASResources/OASResources';
import { OASControllerDefault } from './controllers/oas-controlle-default';

export class MyMicroservice extends Application {
    constructor() {
    super({
      components: [RestComponent],
    });
    const app = this;
  }
  async start() {
    const oas = new OAS('3.0.0');
    // here we bind the resources
    oas.bind('oas.resources').to(resources.returnResources());
    oas.bind('oas.controllers').to([OASControllerDefault]);

    const serverPublic = await app.getServer(RestServer);
    const serverPrivate = await app.getServer(RestServer);
    // assume we support using an url as the rest server's config
    serverPublic.bind("rest.url").to(url1_parsed_from_openapi);
    serverPublic.bind("rest.description").to(desc1_parsed_from_openapi);
    serverPublic.bind("rest.oas").to(oas);

    serverPrivate.bind("rest.url").to(url2_parsed_from_openapi);
    serverPrivate.bind("rest.description").to(desc12_parsed_from_openapi);
    serverPrivate.bind("rest.oas").to(oas);
    await super.start();
  }
}
```

## schemas

Take LB3 app as an example, it has two level's representation for a model,
one is in template: a json file, the other one is the Model Class, we register instances of Model to the app, which are bound as `app.models`.

Let's first consider the model class:

### model class

- it should be a class(I mean, not an interface)
- every field in `schema.properties` should be a class property
- handle `anyOf`, `allOf`, `oneOf`:
  - give each schema a name
  - only resolve first level `$ref`
  - decorate a property with its schema's name

Take the `Pet` schema as an example:

```json
"Pet": {
	"type": "object",
	"allOf": [
		{
			"$ref": "#/components/schemas/NewPet"
		},
		{
			"required": [
				"id"
			],
			"properties": {
				"id": {
				    "type": "integer",
			        "format": "int64"
                },
                "name": {
                    "type": "string"
                }
	        }
	    }
    ]
}
```

`allOf` contains two schemas, we name one as `newPet` since its first level `$ref` points to schema `newPet`, and name the second one as `default`.

Create three properties for `Pet` model and decorate them in a way that can be easily converted to OAS schema:

```js
import { NewPet } from './new-pet.ts';
import { allOf, OASConfig, OASConfigType } from '@loopback/OAS';

export class Pet extends Model {
    @allOf('default')
    id: number
    @allOf('default')
    name: string
    @allOf('newPet')
    newPet: NewPet
    @OASConfig
    static OAS_config:OASConfigType = {<some_oas_metadata>}
}
```

The static property `OAS_config` is set to some OAS schema metadata that used by OAS module to restore the schema.
By retrieving a model class's OAS metadata, the OAS module knows how to map the model to an OAS schema.

Now we have 2 plans:
- option1: put json file in `/models`, dynamically create the model class at boot phase.
- option2: generate .ts model file in `/models` directly.
 
Personally I strongly like option2, importing and applying those decorators are too hard if everything is configured in a static json file.

And I would suggest we define a LB4 model nothing more than a class with properties, but use the property decorator to make it convertable to a specific representation, like OAS schema.

Thus if people decide to make their GRPC models, they can keep all properties as they are and just change the decorators to GRPC decorators

Add models to `oas`, and this is the complete `application.ts` file we have in our template:

*template file app/src/application.ts*

```js
import { resources } from './controllers/OASResources/OASResources';
import { OASControllerDefault } from './controllers/oas-controlle-default';
// assume we export all model classes in folder `./models`
import * as models from './models/index';

export class MyMicroservice extends Application {
    constructor() {
    super({
      components: [RestComponent],
    });
    const app = this;
  }
  async start() {
    const oas = new OAS('3.0.0');
    oas.bind('oas.resources').to(resources.returnResources());
    // If we use json file as model representation in `/model`
    // here we should bind a file path instead of model classes
    // `oas.bind('oas.schemas.models.path').to('./models');`
    oas.bind('oas.schemas.modelClasses').to(models);
    oas.bind('oas.controllers').to([OASControllerDefault]);

    const serverPublic = await app.getServer(RestServer);
    const serverPrivate = await app.getServer(RestServer);
    // assume we support using an url as the rest server's config
    serverPublic.bind("rest.url").to(url1_parsed_from_openapi);
    serverPublic.bind("rest.description").to(desc1_parsed_from_openapi);
    serverPublic.bind("rest.oas").to(oas);

    serverPrivate.bind("rest.url").to(url2_parsed_from_openapi);
    serverPrivate.bind("rest.description").to(desc12_parsed_from_openapi);
    serverPrivate.bind("rest.oas").to(oas);
    await super.start();
  }
}
```
