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
    //this.userData = [];
  }
  created() {
        this.api.getLogUser().then((datos)=>{
           try{
            this.logData=datos;
            this.numero=30;
            //this.logCuenta=Object.keys(datos.data).length;
            }catch(e){
              console.log(e);
            }
          });
  }
  mostrarfilas(filas){
    this.api.getLogUserRows(filas).then((datos)=>{
           try{
            this.logData=datos;
            //this.logCuenta=Object.keys(datos.data).length;
            }catch(e){
              console.log(e);
            }
          });
  }
  
}//fin de clase
