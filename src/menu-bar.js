import {WebAPI} from './web-api';
import {inject, customElement, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'admin-lte';


@inject(WebAPI,Router)
export class MenuBar {
  //variable for the logged user name
  userName = '';

  constructor(api,router) {
    this.api = api;
    this.router=router;
    this.dato={
      nombre:''
    };
    
  }

  created() {
    this.userName = this.api.getUserName();
  }

  activate() {
    this.userName = this.api.getUserName();
  }
  //*********************************************************
 cancelarpage(){
    this.router.navigate('user/manager');
  }
  metodo(nombre){
    //this.router.navigate('user/manager');
    this.api.getSearchPermission("a8ac53a0ce704cfd0377e93a583e79",nombre).then(resultp => {
                        console.log("*********************"+resultp);
                        //this.router.navigate('user/manager');
                        if(resultp=="ok"){
                          this.router.navigate('user/manager');
                          //this.respuesta='user-manager';
                        }else{
                          this.api.setLocations(false);
                        }
                });
  }
  //*********************************************************
  attached() {
    console.log($('*[data-widget="tree"]').tree());

  }
 
}
