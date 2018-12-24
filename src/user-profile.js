import {
  WebAPI
} from './web-api';
import {
  inject, customElement, bindable
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';
import * as toastr from 'toastr';
import $ from 'jquery';

@customElement('tag-it')
@inject(WebAPI, EventAggregator,Element)
export class UserProfile {

   @bindable tags;
  @bindable id = '';
  @bindable name;
  @bindable options = {};
  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
    this.userData1 = {
      //token:sessionStorage.sessionToken,
      first_name:'',
      last_name:'',
      password:'',
      confirmPassword:''

    };
    this.activa=false;
  }

  //Function gets called whenever the class is created
  created() {
    this.userData = this.api.getUserData();
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

  get canUpdateUserData() {
    return this.register.firstName
      && this.register.lastName
      && this.register.password
      && this.register.confirmPassword
      && !this.api.isRequesting;
  }
  //**********************************************************************
  isEqualPassword()
  {
    if (this.userData1.password.length > 0){
      if (this.userData1.password === this.userData1.confirmPassword) {
        return true;
      }
      else {
        toastr.warning('Passwords doesn\'t match.');
        return false;
      }
    }
    return false;
  }
  isPassword()
  {
    //verificar politica
      if(this.longPassword() && this.validateSymbol() && this.validateLetter() && this.validateCapitalLetter() && this.validateNumber() ) {
        return true;
      }
      else {
        toastr.warning('Password doesn\'t meet requirements');
        return false;
      }
    return false;
  }
  UpdateUserData() {
    this.userData1.first_name=this.userData.firstName;
    this.userData1.last_name=this.userData.lastName;
    //console.log(this.userData1.first_name+this.userData1.last_name+" "+this.userData1.password+"-- "+this.userData1.confirmPassword);
    try{
      if(this.isEqualPassword()){
        //console.log("valor: "+this.isPassword());
        
          //console.log("paso: "+this.userData1.password);
        this.api.getPolicies('password strength').then((datosF1)=>{
          this.activa=datosF1.data.policies_active;
          //console.log("politica fortaleza: "+this.activa);
          if(this.activa==true){
            if (this.isPassword()) {
              this.actualizarPerfil();
              this.userData1.password='';
              this.userData1.confirmPassword='';
            }
          }else{//politica no activa
              this.actualizarPerfil();
              this.userData1.password='';
              this.userData1.confirmPassword='';
          }
            
        });
          
          }
      }catch(e){
        toastr.error('Fields are empty');
      }
   
  }
  actualizarPerfil(){
    this.api.getUpdateProfile(this.userData1).then((resultado)=>{           
      try{
          if(resultado.data==1){
            toastr.success('Profile has been update');
          }else{
            toastr.error('Action not done');
          }
          //this.router.navigate('user/manager');
        }catch(e){
          console.log(e);
        }

         });
  }
  //*****************************************************************
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
  //*************************************************************************
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
