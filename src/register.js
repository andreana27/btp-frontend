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
    this.activa=false;
  }


  //Function gets called whenever the class is created
  created() {
  }

  //Function that gets called whenever the view is activated
  activate() {
    this.api.getPolicies('password strength').then((datosF3)=>{
                       try{
                       this.politicas3=datosF3;
                       var activa=this.politicas3.data.policies_active;
                       //console.log("expirable: "+activa);
                       if(activa){
                          this.isVisible=true;
                       }else{
                         this.isVisible=false;
                       }
                      }catch(e){
                       }
                    });
    
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
        //--------------------------------------
        this.api.getPolicies('password strength').then((datosF1)=>{
          this.activa=datosF1.data.policies_active;
          //console.log("politica fortaleza: "+this.activa);
          if(this.activa==true){
            if (this.isPassword()) {
              this.crearUser();
            }
          }else{//politica no activa
              this.crearUser();
          }
            
        });
        //----------------------------------------
        
      }// end if - isValidPassword
    }
    else {
      toastr.warning('Valid e-mail is required.');
    }
  }// end registerNewUser
  crearUser(){
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
  }
//***********************************************************************************
  validateLetter() {
    if (this.userData1.password.match(/[A-z]/)){
      return true;
    }else{
      return false;
    }
  }
  validateCapitalLetter() {
    if (this.userData1.password.match(/[A-Z]/)){
      return true;
    }else{
      return false;
    }
  }
  validateNumber() {
    if (this.userData1.password.match(/\d/)){
      return true;
    }else{
      return false;
    }
  }
  validateSymbol() {
    if (this.userData1.password.match(/\W/)){
      return true;
    }else{
      return false;
    }
  }
  longPassword(){
    if(this.userData1.password.length>=6){
      return true;
    }else{
      return false;
    } 
  }
//***********************************************************
//JQuery
attached(){
  var longitud = false,
    minuscula = false,
    numero = false,
    symbolo=false,
    mayuscula = false;
  $("#pass").keyup(function() {
    var pswd = $(this).val();
    if (pswd.length < 6) {
      $('#length').removeClass('valid').addClass('invalid');
      longitud = false;
    } else {
      $('#length').removeClass('invalid').addClass('valid');
      longitud = true;
    }

    //validate letter
    if (pswd.match(/[A-z]/)) {
      $('#letter').removeClass('invalid').addClass('valid');
      minuscula = true;
    } else {
      $('#letter').removeClass('valid').addClass('invalid');
      minuscula = false;
    }

    //validate capital letter
    if (pswd.match(/[A-Z]/)) {
      $('#capital').removeClass('invalid').addClass('valid');
      mayuscula = true;
    } else {
      $('#capital').removeClass('valid').addClass('invalid');
      mayuscula = false;
    }

    //validate number
    if (pswd.match(/\d/)) {
      $('#number').removeClass('invalid').addClass('valid');
      numero = true;
    } else {
      $('#number').removeClass('valid').addClass('invalid');
      numero = false;
    }
    //validate special character
    if (pswd.match(/\W/)) {
      $('#symbol').removeClass('invalid').addClass('valid');
      symbolo = true;
    } else {
      $('#symbol').removeClass('valid').addClass('invalid');
      symbolo = false;
    }

    return true;
  }).focus(function() {
    $('#pswd_info').show();
  }).blur(function() {
    $('#pswd_info').hide();
  });
} 
}
