import {WebAPI} from './web-api';
import {inject, customElement, bindable} from 'aurelia-framework';
import * as toastr from 'toastr';
import $ from 'jquery';

@customElement('tag-it')
@inject(WebAPI,Element)
export class Register {

  @bindable tags;
  @bindable id = '';
  @bindable name;
  @bindable options = {};
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
    this.longitud = false,
    this.minuscula = false,
    this.numero = false,
    this.symbolo=false,
    this.mayuscula = false;
  }


  //Function gets called whenever the class is created
  created() {
  }

  //Function that gets called whenever the view is activated
  activated() {
  }
  isPassword()
  {
      if(this.longitud && this.minuscula && this.mayuscula && this.numero && this.symbolo) {
        return true;
      }
      else {
        toastr.warning('Password doesn\'t meet requirements');
        return false;
      }
    return false;
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
        //if (this.isPassword()) {
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
    //}
    }
    else {
      toastr.warning('Valid e-mail is required.');
    }
  }// end registerNewUser

//***********************************************************
//JQuery
attached(){
  $("#pass").keyup(function() {
    var pswd = $(this).val();
    if (pswd.length < 6) {
      $('#length').removeClass('valid').addClass('invalid');
      this.longitud = false;
    } else {
      $('#length').removeClass('invalid').addClass('valid');
      this.longitud = true;
    }

    //validate letter
    if (pswd.match(/[A-z]/)) {
      $('#letter').removeClass('invalid').addClass('valid');
      this.minuscula = true;
    } else {
      $('#letter').removeClass('valid').addClass('invalid');
      this.minuscula = false;
    }

    //validate capital letter
    if (pswd.match(/[A-Z]/)) {
      $('#capital').removeClass('invalid').addClass('valid');
      this.mayuscula = true;
    } else {
      $('#capital').removeClass('valid').addClass('invalid');
      this.mayuscula = false;
    }

    //validate number
    if (pswd.match(/\d/)) {
      $('#number').removeClass('invalid').addClass('valid');
      this.numero = true;
    } else {
      $('#number').removeClass('valid').addClass('invalid');
      this.numero = false;
    }
    //validate special character
    if (pswd.match(/\W/)) {
      $('#symbol').removeClass('invalid').addClass('valid');
      this.symbolo = true;
    } else {
      $('#symbol').removeClass('valid').addClass('invalid');
      this.symbolo = false;
    }

    return true;
  }).focus(function() {
    $('#pswd_info').show();
  }).blur(function() {
    $('#pswd_info').hide();
  });
} 
}
