## my concern of the rest module

I find lots of code in [rest-server.ts](https://github.com/strongloop/loopback-next/blob/master/packages/rest/src/rest-server.ts) that build the swagger file from bottom-up for a server's routing, IMO the server module should not collect a controller class's OAS metadata:

RestServer's responsibility:

- its instance contains server config info (can be used to generate OAS servers spec).
- its instance knows which controllers belong to it (it can give OAS module the controller class).
- it **SHOULD NOT** collect a target controller class's OAS metadata
- rest server itself **SHOULD NOT** have any logic thats integrate elements of an OAS file

According to my investigation of the top-down template generating story,
and the controversy we have about multiple server support, 
I suggest we extract some functionalities from rest server module to a new OAS module, 
and start to add new OAS functionalities there.

I haven't decided would the OAS module be a component or other extensions, in the spike I just simplify it as a class extends `Context`, so you can create an instance `oas` in `application.ts`, bind specs to it. Then bind `oas` to a rest server instance `restServerFoo`

## OAS module

### Functionalities:

- Provide rest routing decorators for controllers, like `@operation`, `@param`. 
- Provide function converts a decorated controller to an OAS path spec + tag spec.
  - collects OAS metadata of the target class
  - levaraging OAS-builder to generate path specs
- Provide OAS schema decorators for models, like `allof`, `anyOf`, `oneOf`.
- Provide function converts a decorated model to an OAS schema spec.
  - collects OAS metadata of the target class
  - levaraging OAS-builder to generate schema specs
- Provide function converts a decorated model to an interface, used as the type of controller function's parameters
- Provide function that integrates OAS specs by its bindings.
- Provide types that define the shape of each OAS spec object. 
- Provide function that parses an OAS/swagger object from top-down, returns enough information for template generator to scaffold an app.

### Benefits:

- Decouple the relation among app, server, controller:
  - It is user's choice to have any number of OAS instances in an app, I am not implying this is the approach we encourage them to take, or we want to parse multiple OAS files, but at least we make it possible.
  - The shape of controllers and models are not constrainted to OAS or rest, instead, we apply OAS decorators to annotate class/properties/method and convert them to OAS concepts(spec) by reflector metadata. We are doing this already, just need an OAS module to organize these decorators, so they are not separately kept in restServer and repository.
  - Less code change if people have different opinions on multiple server support, you can either bind controller classes with `restServer` or `oas`
  - Now one rest server only uses one OAS file as its routing reference, in the future if someone wants to turn the rest component to have a cluster of servers, which may require more OAS files, they can easily make it happen. (Again I am not suggesting this approach, just a possibility) 
  - User can bind arbitrary OAS resources to an OAS instance in the app,instead of we specify a path and the OAS module reads data from it.  

People may argue that if one rest server only has one OAS spec, why not just bind resources specs to the server, but by 

### bind controllers

You can bind controller classes to either a rest server instance, or OAS instance,
the logic in rest component would be like this:

```js
//...

let oas = this.getSync('rest.oas');
let serverSpecs = oas.generateServersByConfig(this.serverConfigs);
if (this.hasControllers) {
    let ctorClasses = this.getSync('rest.controllers');
    let pathSpecs = oas.generatePathsByCtors(ctorClasses);
    if (ONE_OAS_ONLY_MAP_TO_ONE_SERVER) {
      oas.bind('oas.pathSpecs').to(pathSpecs);
      oas.bind('oas.serverSpecs').to(serverSpecs);
      this.apiSpecs = oas.generateCompleteOASByBindings();
    } else if (MULTIPLE_SERVER_SHARE_ONE_OAS) {
      this.apiSpecs = oas.generateCompleteOASByBindings({
          pathSpecs: pathSpecs
          serverSpecs: serverSpecs
      });
    }
}

// if we don't bind controllers to server, but to oas instead
this.apiSpecs = oas.generateCompleteOASByBindings({
    serverSpecs: serverSpecs
});

// if some module like explorer needs server's apiSpecs
function getAPISpecs() {
    return this.apiSpecs
}
// ...
```

You can still decorate a controller class by server decorator, but IMO that decorator should add metadata to `app` instance, and server instance can retrieve app level bindings to know which controlles belong to it.



