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
  /*metodo(nombre){
    //this.router.navigate('user/manager');
    this.api.getSearchPermission(nombre).then(resultp => {
                        console.log("*********************"+resultp);
                        //this.router.navigate('user/manager');
                        if(resultp=="ok"){
                          if(nombre=="User Manager"){
                              this.router.navigate('user/manager');
                          }else if(nombre=="Role Manager"){
                              this.router.navigate('rol/roles');
            //************************************************************
                          }else if(nombre=="Bot Management"){
                              this.router.navigate('');
                          }else if(nombre=="Bot Intents Manager"){
                              this.router.navigate('bot/intents');
                          }
            //**************************************************************
                           else if(nombre=="Bot Chat Center"){
                              this.router.navigate('bot/chat-center/');
                          }else if(nombre=="Chat Widget Setup"){
                              this.router.navigate('chat/widget-setup');
                          }
            //******************************************************************   
                         else if(nombre=="Bot Data Manager"){
                              this.router.navigate('bot/data-management/');
                          }else if(nombre=="Bot Statistics"){
                              this.router.navigate('bot/data-statistics/');
                          }
            //------------------------------------------------------------------        
                        }else{
                          this.api.setLocations(false);
                        }
                });
  }*/
  //*********************************************************
  attached() {
    console.log($('*[data-widget="tree"]').tree());

  }
 
}
