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
    this.inrole={
      id:'',
      idfeature:''
    };
    this.router=router;
  }
  //*****************************************************
  //Function gets called whenever the class is created
created() {
    this.api.getSelectFeatures().then(result => {
      try{
            this.numerofeature=Object.keys(result.grid).length;
            this.feature=result;
          }catch(e){}
        });
  }

  //Function that gets called whenever the view is activated
  activate() {
  }

  get canRegister() {
    return this.register.role
      && this.register.description; //&& this.permiso.name && this.permiso.table;
  }
//********************************************************************************
registerNewRole() {
    this.api.registerRole(this.register).then(result => {
      try{
              this.rolecreated=result;
              //console.log(result.data);
              this.inrole.id=result.data[0].id;
              //this.permiso.id=result.data[0].id;
              //this.router.navigate('rol/roles');
              if(this.inrole.id>0){
                this.clicked = !this.clicked;
              if (this.clicked==true){
                  this.oculto1=true;
                  
              }else{
                 this.oculto1=false;

              }
              return true; 
              }
           }catch(e){

            }
            });            
  }// end 

  //*********************************************************************************************
  addFeature(id){
    //this.inrole.id=5;
    this.inrole.idfeature=id;
    console.log(this.inrole.id+" "+this.inrole.idfeature);
              this.api.registerFeature(this.inrole).then(resultp => {
                        //this.router.navigate('rol/roles');
                        try{
                          console.log(resultp.data);
                        if(resultp.data==='ok add'){
                            toastr.success("Add Functionality");
                            //window.location.reload();
                            
                        }else{
                          toastr.error("Module not added");
                        }
                      }catch(e){

                      }
                });
  }
  addPermission(){
    /*console.log("creadoPermission: "+this.permiso.id+" "+this.permiso.name+" "+this.permiso.table);
              this.api.registerPermission(this.permiso).then(resultp => {
                        console.log("creadoPermission: "+resultp.data);
                        if(resultado.data==='ok'){
                          
                            toastr.success("Created Permission in "+this.permiso.table);
                            window.location.reload();
                        }else{
                          toastr.error("Permission not created");
                        }
                });*/
  }
  //*****************************************************************************
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
