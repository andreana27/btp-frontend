import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  Router
} from 'aurelia-router';
@inject(WebAPI, Router)
export class Login {
  constructor(api, router) {
    this.api = api;
    this.router = router;
    this.login = {
      email:'',
      password:''
    };
  }
  get canLogin() {
    return this.login.email && this.login.password && !this.api.isRequesting;
  }
  logIn() {
    this.api.logIn(this.login).then(login => {
      console.log(login);
    });
    this.router.navigate('manager');
  }

  activate(routeConfig) {
    this.routeConfig = routeConfig;
  }
}
