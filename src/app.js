import {inject} from 'aurelia-framework';
import {WebAPI} from './web-api';

@inject(WebAPI)
export class App {
  constructor(api) {
    this.api = api;
    this.message = 'Hello World!';
  }
  configureRouter(config, router) {
    config.title = 'BotPro';
    config.map([{
        route: 'login/',
        moduleId: 'login',
        name: 'login',
        title: 'Log In'
      },
      {
        route: 'manager/',
        moduleId: 'manager',
        name: 'manager'
      },
      {
        route: '',
        redirect: 'manager'
      }
    ]);
    this.router = router;
  }
}
