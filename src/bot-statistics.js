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
  //petition package size
  recordsPerPetition = 50;
  //owners list
  ownersList = [];
  //records array
  tableRecords = [];
  //pagination size
  pageSize = 10;
  totalRecords = 0;
  //filters settings
  filters = [];
  //
  filteredRecords = [];
  //

  allRecords = [];

  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
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
        this.selectedtime='1';
        this.dates=false;
        this.telegram=0;
        this.messenger=0;
        this.website=0;
        this.isStatistics=false;
      });
      //this.filters = [{value: '', keys: ['owner']}];
    }
    changeCombo()
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
    }
    getStatistics()
    {
      if (this.selectedtime=='1') {
        this.start_date='0';
        this.end_date='0';
      }
      else if(this.selectedtime=='2')
      {
        this.start_date='1';
        this.end_date='1';
      }
      if((this.dates)&(this.start_date==null | this.end_date == null))
      {
          toastr.warning('You must select valid dates for the range!');
      }
      else
      {
        console.log("start: "+this.start_date+" end:"+this.end_date);
        this.api.getStatistics(this.selectedBotId,this.start_date,this.end_date).then(response=>
          {
            this.telegram=response.telegram_t;
            this.messenger=response.messenger_t;
            this.website=response.website_t;
            this.telegram_c=response.telegram_clients;
            this.messenger_c=response.messenger_clients;
            this.website_c=response.website_clients;
            this.total=(this.telegram+this.messenger+this.website)/100;
            this.total_c=(this.telegram_c+this.messenger_c+this.website_c)/100;
            this.telegram_p=response.telegram_t/this.total;
            this.messenger_p=response.messenger_t/this.total;
            this.website_p=response.website_t/this.total;
            this.telegram_p_c=response.telegram_clients/this.total_c;
            this.messenger_p_c=response.messenger_clients/this.total_c;
            this.website_p_c=response.website_clients/this.total_c;
            this.checkpoints=response.check;
            this.isStatistics=true;
          });
      }
    }


}
