import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BotUpdated,BotViewed,BotCreated} from './messages';
import {Router} from 'aurelia-router';


@inject(WebAPI, EventAggregator,Router)
export class CreateBot{
  constructor(api, ea, router){
    this.api = api;
    this.ea = ea;
    this.router = router;
    this.bot = {name:'', enabled:'True', id:'', picture:''};
  }

  get canSave(){    
	return this.bot.name && this.bot.picture && !this.api.isRequesting;
}
  save(){
    this.api.createBot(this.bot).then(bot => {
      this.bot = bot;     
      this.ea.publish(new BotCreated(this.bot));
    });
    this.router.navigate('home');
  }
  
  activate(routeConfig){
		this.routeConfig = routeConfig;
	}  
}
