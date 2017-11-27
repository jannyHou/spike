import { Application, ApplicationConfig } from '@loopback/core';
import { RestComponent } from '@loopback/rest';
import { getServerAPISpecs } from './controllers/generate-apispec-for-server';
import { getSwaggerResources } from './controllers/swaggerResources/swaggerResources';

export class MyApp extends Application {
    constructor(options?: ApplicationConfig) {
      // TBD:
      // set swagger info and version from here?
      // or bind it in `index.ts`?
      super(options);
    }
    
    // TBD: 
    // create servers here? 
    // how can I register apispec for server?
}