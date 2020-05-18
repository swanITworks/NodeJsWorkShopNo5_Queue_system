import express from 'express';
import exhbs from 'express-handlebars';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { APP_PORT } from './config/app';
import { connectToMongoose } from './models';
import api from './api';

(async function runApp() {
  try {
    const app = express();

    // Add basic middlewares
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(morgan('combined'));

    // Add templating engine
    // Add your config here
    const hbs = exhbs.create({
      helpers: {},
    });

    // Add new engine to ExpressJS
    app.engine('handlebars', hbs.engine);

    // Set chosen view engine
    app.set('view engine', 'handlebars');

    // Set views path
    app.set('views', 'views');

    // Static dir
    app.use(express.static('public'));

    // Connect to the database
    await connectToMongoose();

    // Add routing
    app.use(api);

    const server = app.listen(APP_PORT, () => {
      console.log(`Listening on port ${server.address().port}`);
    });
  } catch (err) {
    console.log('Problems initializing the app', err);
  }
})();
