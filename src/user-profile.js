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
    this.longitud = false,
    this.minuscula = false,
    this.numero = false,
    this.symbolo=false,
    this.mayuscula = false;
  }

  //Function gets called whenever the class is created
  created() {
    this.userData = this.api.getUserData();
  }

  //Function that gets called whenever the view is activated
  activated() {
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
  isValidPassword()
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
  UpdateUserData() {
    this.userData1.first_name=this.userData.firstName;
    this.userData1.last_name=this.userData.lastName;
    console.log(this.userData1.first_name+this.userData1.last_name+" "+this.userData1.password+"-- "+this.userData1.confirmPassword);
    try{
      if(this.isEqualPassword()){
        console.log("iguales");
        //if (this.isValidPassword()) {
          this.api.getUpdateProfile(this.userData1).then((resultado)=>{
            console.log(resultado.data);            
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
          //}
        }
      }catch(e){
        toastr.error('Fields are empty');
      }
   
  }
  //*****************************************************************
  //JQuery
attached(){
  
  /*var longitud = false,
    minuscula = false,
    numero = false,
    symbolo=false,
    mayuscula = false;*/

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
