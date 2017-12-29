import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';

@inject(WebAPI)
export class Register {
  //Class constructor
  constructor(api) {
    this.api = api;
    this.register = {
      firstName:'',
      lastName:'',
      email:'',
      password:'',
      confirmPassword:''
    };
  }


  //Function gets called whenever the class is created
  created() {
  }

  //Function that gets called whenever the view is activated
  activated() {
  }

  get canRegister() {
    return this.register.email
      && this.register.firstName
      && this.register.lastName
      && this.register.password
      && this.register.confirmPassword
      && !this.api.isRequesting;
  }

  cancelRegistry(){
    this.api.setRegister(false);
  }

  Register() {
    this.api.registerUser(this.register).then(result => {
      let login = { email:this.register.email,password:this.register.password};
      this.api.logIn(login);
    });
  }

}
