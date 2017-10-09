import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BotUpdated,BotViewed} from './messages';
import {areEqual} from './utility';


@inject(WebAPI, EventAggregator)
export class BotSettings{
  constructor(api, ea){
    this.api = api;
    this.ea = ea;
  }
  created(){
  }
  activate(params, routeConfig){
    this.routeConfig = routeConfig;
    this.botid = params.id;    
    
     console.log("Botid");
     console.log(this.botid);
     
    return this.api.getBotDetails(params.id).then(bot => {
      this.bot = bot;
      this.routeConfig.navModel.setTitle(bot.name);
      this.originalBot = JSON.parse(JSON.stringify(bot));
      this.ea.publish(new BotViewed(this.bot));
    });
       
  }
  configureRouter(config, router){
    config.title = 'Bot Flow';
    config.map([
      {route: '',   moduleId: 'bot-context', name: 'bot-context', title: 'Select'},
      {route: 'context/:contextid',   moduleId: 'bot-context',   name:'bot-context'},
      {route: 'context/create/:botid',   moduleId: 'create-bot-context',   name:'create-bot-context'}
    ]);
    this.router = router;
  }
}
