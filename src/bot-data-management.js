import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';

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
  }

  //Function gets called whenever the class is created
  created() {
  }

  //Function gets called whenever the view is activated
  activate(routeConfig) {
      this.routeConfig = routeConfig;
      return this.api.getBotsList().then(bots => this.bot_list = bots);
      /*return this.api.getBotDetails(params.botId).then(variable_list => {
        //getting the list of variables
        this.variable_list = variable_list;
      });*/
    }
    //------------------------
    //User defined funtcions
    //------------------------
    getVariables() {
      this.api.getVariableList(this.selectedBotId).then(variable_list => {
        this.variable_list = variable_list;
        if(this.variable_list.length > 0)
        {
          this.botSelected = true;
        } else {
          alert("The selected bot has no variables registered");
        }

      });//end api.getVariableList
    }//end getVariables

}
