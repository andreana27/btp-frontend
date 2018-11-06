import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';
import {
  Router
} from 'aurelia-router';


@inject(WebAPI,Router)
export class UserEdit {
  //Class constructor
  constructor(api, router) {
    //this.ea = ea;
    this.api = api;
    this.router = router;
    //this.router.reset();
  }

  activate(params) {
    this.userInfo = params.info;
  }
  
//********************************************************
  UpdateUserData(){
    console.log("usuario a actualizar: "+this.userInfo.id+" "+this.userInfo.first_name+" "+this.userInfo.last_name+" "+this.userInfo.email+" "+this.userInfo.enabled_access);
     this.api.getUpdateUser(this.userInfo).then((resultado)=>{
          console.log(resultado);
          this.router.navigate('user/manager');
         });
  }
  
  handleClick(){
    //console.log("entra: "+this.clicked);
    this.clicked = !this.clicked; // toggle clicked true/false
    //console.log("sale: "+this.clicked);
    if (this.clicked==true){
        this.userInfo.enabled_access='disable';
    }else{
       this.userInfo.enabled_access='enable';
    }
    //console.log('var: '+this.userInfo.enabled_access);
    return true; 
  }

}//fin de cla clase
