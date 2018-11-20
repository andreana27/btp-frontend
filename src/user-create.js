import {WebAPI} from './web-api';
import {inject, customElement, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import * as toastr from 'toastr';
import $ from 'jquery';

@customElement('tag-it')
@inject(WebAPI,Router,Element)
export class UserCreate {
  @bindable tags;
  @bindable id = '';
  @bindable name;
  @bindable options = {};

  //Class constructor
  constructor(api,router) {
    this.api = api;
    this.register = {
      firstName:'',
      lastName:'',
      email:'',
      password:'',
      confirmPassword:''
    };
    this.router=router;
    //this.myKeypressCallback = this.keypressInput.bind(this);
  }

  /*activate() {
        window.addEventListener('keypress', this.myKeypressCallback, false);
    }
    deactivate() {
        window.removeEventListener('keypress', this.myKeypressCallback);
    }*/
  //---------------------------------------------------------------------------

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

  /*cancelRegistry(){
    this.api.setRegister(false);
  }*/

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
                this.router.navigate('user/manager');
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
  cancelarpage(){
    this.router.navigate('user/manager');
  }
  //**********************************************************************************
  
  //***********************************************************************************
  /*keypressInput(e) {
    
     if (this.tiene_numeros(e)) {
      console.log("Cumple");
     }else{
      console.log("no cumple");
     }
      //this.tiene_numeros(e);
        //console.log(e);        
    }*/

//********************************************************
  
//--------------------------------------------------
tiene_numeros(texto){
  var re = /^([a-zA-Z0-9]+)$/;// ([a-zA-Z\-0-9]+
    return re.test(texto);
   /* var numeros="0123456789";
   for(var i=0; i<texto.length; i++){
      if (numeros.indexOf(texto.charAt(i),0)!=-1){
         //return 1;
         console.log("tiene numeros");
      }
   }
   //return 0;
   console.log("no tiene numeros");*/
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

}//fin de cla clase
