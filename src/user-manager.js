import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';//


@inject(WebAPI,EventAggregator)
export class UserManager {
  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
    this.userData = [];
    //this.router = router;
    //this.router.reset();
  }//fin constructor
/*configureRouter(config,router) {
   config.map([
          
       {
        route: 'user/edit',
        moduleId: 'user-edit',
        name: 'user-edit'
      }]);
    this.router = router;
  }*/
    //Function gets called whenever the class is created

  created() {
      this.api.getCountUser().then((datoscuenta)=>{
          //console.log(datoscuenta);
          this.userCuenta=datoscuenta;
         });
        this.api.getSelectUser().then((datos)=>{
          //console.log(datos);
            this.userData=datos;
            console.log("mostrar datos usuarios "+datos);
          });
          //this.api.getSelectUser().then(datos => this.contacts = datos);
  }
  gotoRegister(){
    this.api.UserRegister(true);
  }
  
}//fin de clase
