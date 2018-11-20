import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';

@inject(WebAPI, EventAggregator)
export class RoleManager {
  //Class constructor
  constructor(api, ea) {
    //this.ea = ea;
    this.api = api;
    //this.countUserRole='';
  }//end constructor
  created() {

      //-------------------------------------------------------
   /*   this.api.getCountRoles().then((datoscuenta)=>{
          console.log("numroles: "+datoscuenta);
          this.numRoles=datoscuenta;
         });//count role
*/
        this.api.getGroupRoles().then((rol)=>{
                  this.roleData=rol;
                   this.numRoles=Object.keys(rol.data).length;
                  //this.countUserRole=this.roleData;
                  console.log("cuentaUser: "+rol.data);
             });
          //------------------------------------------------------------
           
  }
  quantityUser(id){
    this.api.getCountUsersRoles(id).then((cuenta)=>{
            //console.log("long: "+Object.keys(datos.data).length);
              this.cuenta=cuenta;
              console.log("numuser in role: "+this.cuenta.count);
             
          });
  }
}//
