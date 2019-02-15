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
    this.inrole={
      id:'',
      idfeature:''
    };
    this.userol={
      idrol:'',
      iduser:''
    };
    this.router = router;
    //this.router.reset();
  }

  activate(params) {
    this.roleInfo = params.info;
  }
  created(){
    //------------------modulos y rol-------------------------------
      this.api.getSelectFunction(this.roleInfo.id).then((datosF)=>{
             try{
             this.function=datosF;
              this.cuenta=Object.keys(datosF.data).length;
            }catch(e){
             }
          });
      //----------------usuarios------------------------------------
      this.api.getSelectUser().then((datos)=>{
           try{
            this.userData=datos;
            this.userCuenta=Object.keys(datos.data).length;
            }catch(e){
              //console.log(e);
            }
          });
      //-------------------Usuarios en el rol------------------------
      this.api.getSelectRoles(this.roleInfo.id).then((datos)=>{
                //console.log("long: "+Object.keys(datos.data).length);
                try{
                this.numUser=Object.keys(datos.data).length;
                  this.memberData=datos;
             }catch(e){

             }
          });
      //-----------------features-----------------------
      this.api.getSelectFeatures().then(result => {
        try{
            this.numerofeature=Object.keys(result.grid).length;
            this.feature=result;
          }catch(e){
          }
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
    this.userol.idrol=group;
    this.userol.iduser=id;
    this.api.deleteUsersRoles(this.userol).then((dato)=>{
          try{
            this.member=dato;
            console.log("valor a eliminar: "+dato);
            if(dato.data==1){
              this.userol.idrol='';
              this.userol.iduser='';
              toastr.success("Delete User in Role");
              window.location.reload();
            }else{
              toastr.error("Action not done");
            }
            //this.router.navigate('rol-edit');
                        
           }catch(e){}
          });
  }
   DeleteFeature(feature){
    this.inrole.id=this.roleInfo.id;
    this.inrole.idfeature=feature;
    this.api. deleteFeature(this.inrole).then((datos)=>{
            //this.router.navigate('rol-edit');
            if(datos.data==1){
              this.inrole.id='';
              this.inrole.idfeature='';
              toastr.success("Delete Functionality");
             window.location.reload();
            }else{
              toastr.error("Action not done");
            }
            
          });
  }
  DeletePermission(id,name,table){
  }
//********************************************************
  UpdateRole(){
     this.api.getUpdateRole(this.roleInfo).then((resultado)=>{
      try{
          if(resultado.data==1){
            toastr.success("Update done");
             //window.location.reload();
             this.router.navigate('rol/roles');
          }else{
            toastr.error("Update not done");
          }
         
        }catch(e){console.log(e);}
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

  Adduser(iduser,idrole){
    //verificar que el usuario no este en otro rol--------------
    this.userol.idrol=idrole;
    this.userol.iduser=iduser;
     this.api.validateUserinRole(iduser).then(response => {
          //if the user already exists
          if (response.count > 0) {            
            toastr.warning('User id: '+iduser+' already registered in a role.');
          }else{
            this.api.addUserMembership(this.userol).then((resultado)=>{
            try{
              if(resultado.data==='ok add'){
                this.userol.idrol='';
                this.userol.iduser='';
                toastr.success("Added User ID: "+iduser);
                window.location.reload();
              }else{
                toastr.error(resultado.data);
              }
            }catch(e){}
             });
            }
        });
    
        
  }
  addFeature(id){
    this.inrole.id=this.roleInfo.id;
    this.inrole.idfeature=id;
              this.api.registerFeature(this.inrole).then(resultp => {
                        //this.router.navigate('rol/roles');
                        try{
                        if(resultp.data==='ok add'){
                          this.inrole.id='';
                          this.inrole.idfeature='';
                            toastr.success("Add Functionality");
                            window.location.reload();
                            
                        }else{
                          toastr.error("Module not added");
                        }
                      }catch(e){
                        console.log(e);
                      }
                });
  }
  addPermission(){
   /*this.permiso.id=this.roleInfo.id;
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
                });*/
  }

}//fin de cla clase
