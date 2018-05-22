import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import * as toastr from 'toastr';
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

  isValidPassword()
  {
    if (this.register.password.length > 0){
      if (this.register.password === this.register.confirmPassword) {
        return true;
      }
      else {
        toastr.warning('Passwords doesn\'t match.');
        return false;
      }
    }
    return false;
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

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  registerNewUser() {
    //email validation
    if (this.validateEmail(this.register.email)) {
      //password matching validation
      if (this.isValidPassword()) {
        //email existance validation
        this.api.validateNewUserEmail(this.register.email).then(response => {
          //if the user already exists
          if (response.count > 0) {
            toastr.warning(`E-mail ${this.register.email} already registered.`);
          }
          else {
            this.api.registerUser(this.register).then(result => {
              //a valid token is generated
              if (result.data.length > 3) {
                let login = { email:this.register.email,password:this.register.password};
                this.api.logIn(login);
              }
              else {
                toastr.error('Registration failed.');
              }
            });
          }// end else - user existance
        });// end validateNewUserEmail
      }// end if - isValidPassword
    }
    else {
      toastr.warning('Valid e-mail is required.');
    }
  }// end registerNewUser


}
