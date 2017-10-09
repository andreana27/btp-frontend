import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BotUpdated,BotViewed,BotCreated} from './messages';

@inject(WebAPI, EventAggregator)
export class CreateBot{
  constructor(api, ea){
    this.api = api;
    this.ea = ea;
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
    
  }

  canDeactivate(){
    if (this.bot !== this.originalBot){
      let result = confirm('You have unsaved changes, are you sure you want to leave?');
      return result;
    }
    return true;
  }
}
