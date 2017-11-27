import { Application, ApplicationConfig } from '@loopback/core';
import { RestComponent } from '@loopback/rest';
import { getAPISpecs } from './controllers/generate-apispec-for-server';

class MyApp extends Application {
    // create a `new restServer(config)`?
}