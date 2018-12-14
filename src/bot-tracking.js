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
import * as toastr from 'toastr';


@inject(WebAPI, EventAggregator)
export class BotDataManagment {
  //Local variables

  selectedBotId = [];
  //bool indicator enables the bot variable table
  botSelected = false;


  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
        this.dates=true;
        this.end_date=null;
        this.start_date=null;
        this.canal=null;
  }

  //attached functionallity
  attached(){
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
    getStatistics()
    {
      /*var fechahoy = new Date();
      console.log("start: "+this.start_date+" end:"+this.end_date+" hoy: "+fechahoy);
      var fechauno=new Date(this.start_date);
      var fechados=new Date(this.end_date);
      if(fechauno.getTime()<=fechados.getTime() && fechados.getTime()<=fechahoy.getTime()){
        console.log("entro");*/
         this.canales = [];
         this.ads=[];
         this.user=[];
         this.usuarios=null;
         this.resul=null;
        this.api.getDataStorage(this.selectedBotId,this.start_date,this.end_date).then(keys=>
          {
           this.isStatistics=true;
           this.data_list = keys;
           this.long_canal=Object.keys(this.data_list.canalito).length;
           this.clientes=this.data_list.Total_interStorage;
           //-------------------------------------------------------
           console.log(this.data_list.anuncio[0]+" "+this.data_list.canalito[0]+" "+this.data_list.buser[0]);
           
            this.resul=(parseInt(this.usuarios)*100)/parseInt(this.clientes);
            console.log("clientes:"+this.data_list.Total_interStorage+" largo: "+this.long_canal);
            
          });
      
      /*}else{
        console.log("no entro");
         this.isStatistics=false;
        toastr.error('Incorrect date range');
      }*/
       
    }
    getdata(){
      console.log("canal: "+this.canal);
     
    }
    selectStatus(){
     console.log("numbot: "+this.selectedBotId);
     this.api.getStorageKey(this.selectedBotId).then(keys => {
        this.key_list = keys;
        if(this.key_list.length > 0){

          this.botSelected = true;
          this.isStatistics1=true;
        }else {
          this.botSelected = false;
           this.isStatistics1=false;
          toastr.error('The selected bot has no status registered');
          //alert("");
        }
        console.log("estatus: "+keys);
      });
  }
  viewReport(){

  }


}
