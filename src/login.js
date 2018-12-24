import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import * as toastr from 'toastr';
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
      },
      {
        route: 'password-reset',
        moduleId: 'password-reset',
        name: 'password-reset'
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
        this.login.email="";
        this.login.password="";
        this.router.navigate('manager');
      } else {
        this.login.email="";
        this.login.password="";
        toastr.error(`${loginResponse.msg}`);
      }
    });
  }

  gotoRegister(){
    this.api.setRegister(true);
  }

  gotoPasswordReset(){
    this.api.setPasswordRecovery(true);
  }

}
