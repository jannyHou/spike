import { MyApp } from './src/application';
import { RestServer } from '@loopback/rest';

const app = new MyApp();

app
  .start()
  .then(async () => {
    // do something
  })
  .catch(err => {
    console.error(`Unable to start application: ${err}`);
  });
