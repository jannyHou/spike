import { resources } from './controllers/OASResources/OASResources';
import { OASControllerDefault } from './controllers/oas-controlle-default';
import { RestComponent } from '@loopback/rest';
import { Application } from '@loopback/core';
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