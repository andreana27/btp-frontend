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
import * as toastr from 'toastr';


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
    //this.userInfo.token=sessionStorage.sessionToken;
  }
  
//********************************************************
  UpdateUserData(){    
    if(this.userInfo.first_name=="" || this.userInfo.last_name==""){
      toastr.error('Check the fields of first and last name');
    }else{
      this.api.getUpdateUser(this.userInfo).then((resultado)=>{
      try{
        console.log(resultado.data);
        if(resultado.data==1){
            this.router.navigate('user/manager');
        }else{
          toastr.warning('Action not done');
        } 
        }catch(e){
          console.log(e);
        }

         });
    }
    
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
