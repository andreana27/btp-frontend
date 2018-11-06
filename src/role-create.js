import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import * as toastr from 'toastr';
@inject(WebAPI,Router)
export class Register {
  //Class constructor
  constructor(api,router) {
    this.api = api;
    this.register = {
      role:'',
      description:''
    };
    this.router=router;
  }
  //***************
  //*******************
  //Function gets called whenever the class is created
  created() {
  }

  //Function that gets called whenever the view is activated
  activated() {
  }

  get canRegister() {
    return this.register.role
      && this.register.description;
  }

  registerNewRole() {
    this.api.registerRole(this.register).then(result => {
              
              this.rolecreated=result;
              console.log("creado: "+this.rolecreated.data);
              this.router.navigate('rol/roles');
            });
  }// end 
  cancelarpage(){
    this.router.navigate('rol/roles');
  }
}//fin de cla clase
