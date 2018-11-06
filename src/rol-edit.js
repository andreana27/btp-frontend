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


@inject(WebAPI, Router)
export class UserEdit {
  //Class constructor
  constructor(api,router) {
    //this.ea = ea;
    this.api = api;
    this.idUser = {
      id:''
    };
    this.router = router;
    //this.router.reset();
  }

  activate(params) {
    this.roleInfo = params.info;
  }
  created(){
    
      this.api.getCountUsersRoles(this.roleInfo.id).then((cuenta)=>{
            //console.log("long: "+Object.keys(datos.data).length);
              this.cuenta=cuenta;
              console.log("cuenta: "+this.cuenta);
             
          });
    
      this.api.getSelectRoles(this.roleInfo.id).then((datos)=>{
                //console.log("long: "+Object.keys(datos.data).length);
                  this.memberData=datos;
                  console.log("usuarios agregados");
             
          });
    
  }
  get canUser() {
    return this.iduser.id;
  }
  DeleteUserRole(id,group){
    console.log("a eliminar: "+id+" "+group);
    this.api.deleteUsersRoles(id,group).then((dato)=>{
          
            this.member=dato;
            //this.router.navigate('rol-edit');
            console.log("valor a eliminar: "+this.member.data);
             
          });
  }
//********************************************************
  UpdateRole(){
    console.log("role a actualizar: "+this.roleInfo.id+" "+this.roleInfo.access_role);
     this.api.getUpdateRole(this.roleInfo).then((resultado)=>{
          console.log(resultado);
          this.router.navigate('rol/roles');
         });
  }
  
  handleClick(){
    //console.log("entra: "+this.clicked);
    this.clicked = !this.clicked; // toggle clicked true/false
    //console.log("sale: "+this.clicked);
    if (this.clicked==true){
        this.roleInfo.access_role='disable';
    }else{
       this.roleInfo.access_role='enable';
    }
    //console.log('var: '+this.userInfo.enabled_access);
    return true; 
  }
  ocultar(){
    //console.log("entra: "+this.clicked);
    this.clicked = !this.clicked; // toggle clicked true/false
    //console.log("sale: "+this.clicked);
    if (this.clicked==true){
        this.oculto=true;
    }else{
       this.oculto=false;
    }
    //console.log('var: '+this.userInfo.enabled_access);
    return true; 
  }

  Adduser(idrole){
    console.log("datos user: "+this.idUser.id+" role: "+idrole);
    this.api.addUserMembership(this.idUser.id,idrole).then((resultado)=>{
          console.log(resultado);
          //ruta
          this.router.navigate('rol/roles');
         });
  }

}//fin de cla clase
