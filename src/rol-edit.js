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


@inject(WebAPI, Router)
export class UserEdit {
  //Class constructor
  constructor(api,router) {
    //this.ea = ea;
    this.api = api;
    this.idUser = {
      id:''
    };
    this.permiso={
      id:'',
      name:'',
      table:''
    };
    this.router = router;
    //this.router.reset();
  }

  activate(params) {
    this.roleInfo = params.info;
  }
  created(){
    
      this.api.getSelectFunction(this.roleInfo.id).then((datosF)=>{
            //console.log("long: "+Object.keys(datos.data).length);
            this.function=datosF;
              this.cuenta=Object.keys(datosF.data).length;
             
          });
      this.api.getSelectRoles(this.roleInfo.id).then((datos)=>{
                //console.log("long: "+Object.keys(datos.data).length);
                this.numUser=Object.keys(datos.data).length;
                  this.memberData=datos;
             
          });
      this.api.getSelectFeatures().then(result => {
            this.numerofeature=Object.keys(result.grid).length;
            this.feature=result;
            //console.log("creado: "+this.table.grid[0]);
        });
      /*this.api.getSelectPermission(this.roleInfo.id).then((datosP)=>{
                  console.log("longPermission: "+Object.keys(datosP.data).length);
                  this.numPermission=Object.keys(datosP.data).length;
                  this.permissionRole=datosP;
                  console.log("permissons agregados");
             
          });
      this.api.selectTables().then(result => {
            this.numero=Object.keys(result.grid).length;
            this.table=result;
            //console.log("creado: "+this.table.grid[0]);
        });*/
    
  }
  get canUser() {
    return this.iduser.id;
  }
//------------------------------------------------------------------  
  DeleteUserRole(id,group){
    console.log("a eliminar: "+id+" "+group);
    this.api.deleteUsersRoles(id,group).then((dato)=>{
          
            this.member=dato;
            //this.router.navigate('rol-edit');
            console.log("valor a eliminar: "+this.member.data);
            toastr.success("Delete User in Role");
             window.location.reload();
          });
  }
   DeleteFeature(feature){
    this.api. deleteFeature(this.roleInfo.id,feature).then((datos)=>{
            //this.router.navigate('rol-edit');
            if(datos.data==1){
              toastr.success("Delete Functionality");
             window.location.reload();
            }else{
              toastr.error("Action not done");
            }
            
          });
  }
  DeletePermission(id,name,table){
    console.log("a eliminar: "+id+" "+table+" "+name);
    //quitar db. in table
    //var table_name=table.substring(3);
    //console.log("table name: "+table_name);
    this.api.deletePermission(id,name,table).then((datos)=>{
            //this.router.navigate('rol-edit');
            console.log("valor a eliminar: "+datos.data);
            toastr.success("Delete Permission");
             window.location.reload();
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
  
  manejoclick(){
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
  //*****************************************************************
  ocultar(){
    this.clicked = !this.clicked; // toggle clicked true/false
    if (this.clicked==true){
        this.oculto=true;
    }else{
       this.oculto=false;
    }
    return true; 
  }
  ocultarPermiso(){
    this.clicked = !this.clicked; // toggle clicked true/false
    if (this.clicked==true){
        this.oculto1=true;
    }else{
       this.oculto1=false;
    }
    return true; 
  }
  ocultarUsuario(){
    this.clicked = !this.clicked; // toggle clicked true/false
    if (this.clicked==true){
        this.oculto2=true;
    }else{
       this.oculto2=false;
    }
    return true; 
  }
  //*******************************************************************

  Adduser(idrole){
    console.log("datos user: "+this.idUser.id+" role: "+idrole);
    this.api.addUserMembership(this.idUser.id,idrole).then((resultado)=>{
          console.log(resultado);
          //ruta
          console.log(resultado.data);
          if(resultado.data==='ok add'){
            toastr.success("Added User ID: "+this.idUser.id);
            window.location.reload();
          }else{
            toastr.error(resultado.data);
          }
          
         });
  }
  addFeature(id){
              this.api.registerFeature(this.roleInfo.id,id).then(resultp => {
                        //this.router.navigate('rol/roles');
                        if(resultp.data==='ok add'){
                            toastr.success("Add Functionality");
                            window.location.reload();
                            
                        }else{
                          toastr.error("Module not added");
                        }
                });
  }
  addPermission(){
   this.permiso.id=this.roleInfo.id;
    console.log("creadoPermission: "+this.permiso.id+" "+this.permiso.name+" "+this.permiso.table);
              this.api.registerPermission(this.permiso).then(resultp => {
                        console.log("creadoPermission: "+resultp.data);
                        //this.router.navigate('rol/roles');
                        if(resultado.data==='ok'){
                            toastr.success("Created Permission in "+this.permiso.table);
                            window.location.reload();
                            
                        }else{
                          toastr.error("Permission not created");
                        }
                });
  }

}//fin de cla clase
