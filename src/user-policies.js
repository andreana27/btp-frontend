import {WebAPI} from './web-api';
import {inject, customElement,customAttribute,bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';//
//import 'bootstrap-datepicker';
import * as toastr from 'toastr';
import $ from 'jquery';

//var moment = require('moment');
@customAttribute('datepicker')
@customElement('tag-it')
@inject(WebAPI,EventAggregator,Element)
//@bindable("value")
export class UserManager {
  //@bindable format = "DD/MM/YY";
   @bindable tags;
  @bindable id = '';
  @bindable name;
  @bindable options = {};

  //Class constructor
  constructor(api, ea,element) {
    this.ea = ea;
    this.api = api;
    //this.element = element;
    this.policyData = {
      name:'',
      status:'',
      fecha1:'',
      fecha2:''
    };
  }//fin constructor

    //Function gets called whenever the class is created
  created() {    

       this.txtSaveExButton = ''; 
       this.txtbutton1 = ''; 
       this.txtbutton2 = 'Active un'; 
  }
  //********************************************************************************
  handleClick(){    
    this.clicked = !this.clicked; // toggle clicked true/false
    //console.log("sale: "+this.clicked);
    if (this.clicked==true){
        this.txtSaveExButton='Active: true';
      this.politicas.data.policies_active='true';
    }else{
      this.txtSaveExButton='Active: false';
      this.politicas.data.policies_active='false';       
    }
    this.policyData.name=this.politicas.data.policies_name;
    this.policyData.status=this.politicas.data.policies_active;    

    /*console.log("seleccion: "+this.politicas.data.policies_name);
    console.log("activo: "+this.politicas.data.policies_active);*/
    return true; 
  }
  handleClickPolitica2(){
    this.clicked = !this.clicked;
    if (this.clicked==true){
        //this.txtbutton1='Active: true';
        this.politicas.data.policies_active='true';
    }else{
      //this.txtbutton1='Active: false';
      this.politicas.data.policies_active='false';       
    }
    this.policyData.name=this.politicas.data.policies_name;
    this.policyData.status=this.politicas.data.policies_active;
    //console.log("seleccion: "+this.politicas.data.policies_name);
    //console.log("activo: "+this.politicas.data.policies_active);
    return true; 
  }
  handleClickPolitica3(){   

    //this.clicked=false;
    this.clicked = !this.clicked; // toggle clicked true/false
    console.log("sale: "+this.clicked);
    if (this.clicked==true){
        //this.txtbutton2='Active: true';
      this.politicas.data.policies_active='true';
    }else{
      //this.txtbutton2='Active: false';
      this.politicas.data.policies_active='false';       
    }
    //console.log(this.clicked+" "+this.politicas.data.policies_active);
    this.policyData.name=this.politicas.data.policies_name;
    this.policyData.status=this.politicas.data.policies_active;
    /*console.log("seleccion: "+this.politicas.data.policies_name);
    console.log("activo: "+this.politicas.data.policies_active);*/
    //this.actualizarPolicies(this.policyData);
    return true; 
  }
  //*****************************************************************************
  selectPolicies(name) {
   this.api.getPolicies(name).then((datosF)=>{
             try{
             this.politicas=datosF;
            }catch(e){
             }
          });
   
  }
  actualizarPoliciesDate(name,estado,fecha2) {
          if(this.formato(fecha2)){
                  this.policyData.fecha2=fecha2;
                  this.policyData.name=name;
                  this.policyData.status=estado;
                  this.api.updatePolicies(this.policyData).then((datosF)=>{
                     try{
                     this.politicas=datosF;
                     console.log("resultado: "+this.politicas.data);
                     if(datosF.data==1){
                        toastr.success('Policy has been update');
                     }else{
                      toastr.error('Unrealized policy');
                     }
                     window.location.reload();
                    }catch(e){
                      console.log(e);
                     }
                  });
          }else{
              toastr.error('Day format is not correct');
          }
      
      
       /**/
  }
  actualizarPolicies() {
    
       this.api.updatePolicies(this.policyData).then((datosF)=>{
             try{
             this.politicas=datosF;
             //console.log("-- "+datosF.data);
             if(datosF.data==1){
                toastr.success('Policy has been update');
             }else{
              toastr.error('Unrealized policy');
             }
             window.location.reload();
            }catch(e){
             }
          });
  }

  /*prueba(texto,texto1){
    //var texto = '2017-01-10';
    var salida = this.formato(texto);
    if(this.formato(texto)){
      console.log("if");
      console.log("salida1: "+salida);
    }else{
      console.log("else");
      console.log("salida2: "+salida);
    }
    var fechauno = new Date(texto);
    var fechados = new Date(texto1);
    console.log(fechauno.getTime()+" "+fechados.getTime());
    if(fechauno.getTime()<fechados.getTime()){
      console.log('menores');
    }else{
      console.log('que onda?');
    }
    
  }*/
  formato(texto){
    
    //((0[1-9])|((1|2)[0-9])|(30|31))[/]((0[1-9])|10|11|12)[/]((1|2)[0-9][0-9][0-9])
    var re = /^((0[1-9])|((1|2)[0-9])|(30|31))$/;
    //var re = /^((1|2)[0-9][0-9][0-9])-((0[1-9])|10|11|12)-((0[1-9])|((1|2)[0-9])|(30|31))$/;
    return re.test(texto);
    //return texto.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');

  }
  //*********************************************************************************
  attached(){
    /*if ( $('[type="date"]').prop('type') != 'date' ) {
      $('[type="date"]').datepicker();
    }*/
    /*$(document).ready(function(){
      var date_input=$('input[name="date"]'); //our date input has the name "date"
      var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
      var options={
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
      };
      date_input.datepicker(options);
    });*/
  }
}//fin de clase
