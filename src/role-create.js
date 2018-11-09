import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import * as toastr from 'toastr';
@inject(WebAPI,Router)
export class Register {
  //Class constructor
  constructor(api,router) {
    this.api = api;
    this.register = {
      role:'',
      description:''
    };
    this.permiso={
      id:'',
      name:'',
      table:''
    };
    this.router=router;
  }
  //***************
  //*******************
  //Function gets called whenever the class is created
  created() {
  }

  //Function that gets called whenever the view is activated
  activated() {
  }

  get canRegister() {
    return this.register.role
      && this.register.description; //&& this.permiso.name && this.permiso.table;
  }

  registerNewRole() {
    this.api.registerRole(this.register).then(result => {
              console.log("creadoRole: "+result.data[0].id);
              this.rolecreated=result;
              this.permiso.id=result.data[0].id;
              //this.router.navigate('rol/roles');
              console.log("role No.:"+this.permiso.id);
              if(this.permiso.id>0){
                this.clicked = !this.clicked; // toggle clicked true/false
              if (this.clicked==true){
                  this.oculto1=true;
                  
              }else{
                 this.oculto1=false;

              }
              return true; 
              }
            });

            
  }// end 
  addPermission(){
    //this.permiso.id=5;
    console.log("creadoPermission: "+this.permiso.id+" "+this.permiso.name+" "+this.permiso.table);
              this.api.registerPermission(this.permiso).then(resultp => {
                        console.log("creadoPermission: "+resultp.data);
                        if(resultado.data==='ok'){
                            toastr.success("Created Permission in "+this.permiso.table);
                            window.location.reload();
                        }else{
                          toastr.error("Permission not created");
                        }
                        //this.router.navigate('rol/roles');
                });
  }
  cancelarpage(){
    this.router.navigate('rol/roles');
  }
  ocultar(){
    this.clicked = !this.clicked; // toggle clicked true/false
    if (this.clicked==true){
        //-------select tables--------
        this.api.selectTables().then(result => {
            this.numero=Object.keys(result.grid).length;
            this.table=result;
            //console.log("creado: "+this.table.grid[0]);
        });
        //---------------------------
        this.oculto=true;
        
    }else{
       this.oculto=false;

    }
    return true; 
  }
}//fin de cla clase
