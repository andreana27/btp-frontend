import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(WebAPI, Router)
export class Login {
  constructor(api, router) {
    this.api = api;
    this.router = router;
    this.login = {
      email:'',
      password:''
    };
    this.router.reset();
  }

  configureRouter(config, router) {
    this.router.reset();
    config.title = 'Login';
    config.map([
      {
        route: 'register',
        moduleId: 'register',
        name: 'register',
        generationUsesHref: true
      }
    ]);
    this.router = router;
  }

  get canLogin() {
    return this.login.email && this.login.password && !this.api.isRequesting;
  }


  logIn() {
    this.api.logIn(this.login).then(loginResponse => {
      //if a sucessfull login takes place
      if (loginResponse.type == 200) {
        this.router.navigate('manager');
      } else {
        alert(loginResponse.msg);
      }
    });
  }

  gotoRegister(){
    this.api.setRegister(true);
  }

}
