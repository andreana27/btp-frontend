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
        this.api.getSelectUser().then((datos)=>{
           try{
            this.userData=datos;
            this.userCuenta=Object.keys(datos.data).length;
            }catch(e){
              //console.log(e);
            }
          });
  }
  gotoRegister(){
    this.api.UserRegister(true);
  }
  
}//fin de clase
