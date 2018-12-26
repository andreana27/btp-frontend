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
  TableFilterUpdated
} from './messages';
import $ from 'jquery';
import datepicker from 'jquery-ui-datepicker'
import * as toastr from 'toastr';

@inject(WebAPI, EventAggregator)
export class BotTracking{
  //Local variables

  selectedBotId = [];
  //bool indicator enables the bot variable table
  botSelected = false;


  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
     this.dateSelected1 = null;
     this.dateSelected2 = null;
        this.dates=true;
        //this.end_date=null;
        //this.start_date=null;
        this.canal=null;
        this.prueba='hola';
        this.selectedId='';
  }

  //Function gets called whenever the class is created
  created() {
  }

  //Function gets called whenever the view is activated
  activate(routeConfig) {
      this.routeConfig = routeConfig;
      //getting the bot list
      return this.api.getBotsList().then(bots => {
        this.bot_list = bots
        this.isStatistics=false;
        this.isStatistics1=false;
      });
      //this.filters = [{value: '', keys: ['owner']}];
    }
    /*changeCombo()
    {
      if(this.selectedtime=='3')
      {
        this.dates=true;
        this.end_date=null;
        this.start_date=null;
      }
      else if(this.selectedtime=='1')
      {
        this.dates=false;
        this.end_date='0';
        this.start_date='0';
        this.getStatistics();
      }
      else if(this.selectedtime=='2')
      {
        this.dates=false;
        this.end_date='1';
        this.start_date='1';
        this.getStatistics();
      }
    }*/
    getTable1()
    {
      this.isStatistics1=false;
      this.botSelected=false;
      var fechahoy = new Date();
      this.submitDateToServer();
      var fechauno=new Date(this.dateSelected1);
      var fechados=new Date(this.dateSelected2);
      if(fechauno.getTime()<=fechados.getTime() && fechados.getTime()<=fechahoy.getTime()){
        console.log("entro");
        try{
        this.api.getDataStorage(this.selectedBotId,this.dateSelected1,this.dateSelected2).then(keys=>
          {
           this.isStatistics=true;
           this.data_list = keys;
           this.long_canal=Object.keys(this.data_list.canalito).length;
           this.clientes=this.data_list.Total_interStorage;
           //-------------------------------------------------------
           //console.log(this.data_list.adpropio[0]+" "+this.data_list.anuncio[0]+" "+this.data_list.canalito[0]+" "+this.data_list.buser[0]);
           
            this.resul=(parseInt(this.usuarios)*100)/parseInt(this.clientes);
            //console.log("clientes:"+this.data_list.Total_interStorage+" largo: "+this.long_canal);
            
          });
      }catch(ex){
        toastr.error('Check the dates field');
      }
      }else{
        //console.log("no entro");
         this.isStatistics=false;
        toastr.error('Incorrect date range');
      }
       
    }
    selectStatus(){
     //console.log("numbot: "+this.selectedBotId);
     this.api.getStorageKey(this.selectedBotId).then(keys => {
        this.key_list = keys;
        if(this.key_list.length > 0){

          this.botSelected = true;
          //this.isStatistics1=true;
        }else {
          this.botSelected = false;
           this.isStatistics1=false;
          toastr.error('The selected bot has no status registered');
          //alert("");
        }
        //console.log("estatus: "+keys);
      });
  }
  viewTable2(key){
    this.isStatistics=false;
    var fechahoy = new Date();
      this.submitDateToServer();
      var fechauno=new Date(this.dateSelected1);
      var fechados=new Date(this.dateSelected2);
      if(fechauno.getTime()<=fechados.getTime() && fechados.getTime()<=fechahoy.getTime()){
        console.log("entro");
        try{
    console.log(this.selectedBotId+"/"+key+"/"+this.dateSelected1+"/"+this.dateSelected2);
   
    this.api.getDataTable2(this.selectedBotId,key,this.dateSelected1,this.dateSelected2).then(keysdata => {
        this.canalT2=[];
        this.adT2=[];
        this.datastorage=keysdata.datos1;
        this.total=keysdata.Total;
        this.isStatistics1=true;
        this.long_storage=Object.keys(this.datastorage).length;
        try{
        for (var i = 0;i<=this.long_storage; i++) {
            this.largo_cadena=this.datastorage[0].bot_internal_storage.channel_id.split(",").length;
          this.canalT2.push(this.datastorage[0].bot_internal_storage.channel_id.split(",")[0]);
          console.log(this.datastorage[0].bot_internal_storage.channel_id.split(",")[0]);
          if(this.largo_cadena==2){
            this.adT2.push(this.datastorage[0].bot_internal_storage.channel_id.split(",")[1]);
          }
          
        }
      }catch(ex1){}
      });
    }catch(ex){
        toastr.error('Check the dates field');
      }
      }else{
         this.isStatistics=false;
        toastr.error('Incorrect date range');
      }

  }
  confirmName(id){
    this.selectedId = id;
  }
  addNameAd(id,adname){
    
    if(id==null || id==""){
      toastr.warning('Check if there is a FB ad ID');
    }else{
      if(adname==null || adname==""){
        toastr.warning('Check the ad name field');
      }else{
        console.log(this.selectedBotId,adname,id);
        //updateAdName
        this.api.updateAdName(this.selectedBotId,id,adname).then(infodata => {
          this.info=infodata.info;
          if(this.info==1){
            toastr.success('Action done');
          }else{
            toastr.warning('Action not done');
          }
        });
        window.location.reload();
      }
      
    }
  }
  submitDateToServer() {
    console.log('SENDING TO SERVER:', this.dateSelected1,this.dateSelected2)
  }
  attached(){
    $('#datepicker').datepicker({dateFormat:'yy-mm-dd',startDate: '-3d'});
    $('#datepicker1').datepicker({dateFormat:'yy-mm-dd',startDate: '-3d'});
  }


}

