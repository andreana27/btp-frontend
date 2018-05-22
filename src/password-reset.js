import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';

@inject(WebAPI)
export class PasswordReset {
  txtResponse = '';
  //Class constructor
  constructor(api) {
    this.api = api;
    this.userEmail = '';
    this.validUser = false;
    this.txtResponse = '';
    this.btnText='Cancel';
  }


  //Function gets called whenever the class is created
  created() {
  }

  //Function that gets called whenever the view is activated
  activated() {
  }

  get canRecoverPassword(){
    return this.userEmail;
  }

  //validates email input with regular expression
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }//end - validateEmail

  cancelRecovery(){
    this.api.setRegister(false);
  }

  goBack(){
    this.api.setRegister(false);
  }

  recoverPassword(){
    if (this.validateEmail(this.userEmail)){
      this.api.validateNewUserEmail(this.userEmail).then(response => {
        if (response.count > 0) {
          this.api.resetPassword(this.userEmail).then(response => {
            if (response.data === 'ok'){
              this.txtResponse ='Your password has been successfully reseted, please check your email. For further instructions.';
              this.btnText='Go to Login';
              this.userEmail = '';
            }
          });
        }
        else {
          this.txtResponse = "A user with the email " + this.userEmail + " does not exists.";
        }
      });
    } else {
      this.txtResponse = "The provided email address is not valid.";
    }
  }

  clearErrors(){
    this.txtResponse = "";
  }
}
