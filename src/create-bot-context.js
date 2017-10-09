import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BotUpdated,BotViewed,BotCreated} from './messages';

@inject(WebAPI, EventAggregator)
export class CreateBotContext{
	selectedValType = 1;
	selectedValSA = 1;
	ContentValue = '';
    SenderActionValue = '';
    
    typeOptions = [
        {value: 1, name: 'Text'},
        {value: 2, name: 'Sender Action'},
        {value: 3, name: 'Quick replay'}
    ];
    
    SenderActionOptions = [
        {value: 1, name: 'mark_seen'},
        {value: 2, name: 'typing_on'},
        {value: 3, name: 'typing_off'}
    ];
    
  constructor(api, ea){
    this.api = api;
    
    this.ea = ea;
   
    this.context = {name:'', contextJson:''};       
  }
  
  created(){
  }
  activate(params, routeConfig){
    this.routeConfig = routeConfig;
    console.log("Parent params");
    this.botid = params.botid;
  }
   get canSave(){    
	return this.context.name && !this.api.isRequesting;
}
save(){
    this.api.createContext(this.context).then(context => {
      this.context = context;     
      this.ea.publish(new ContextCreated(this.context));
    });
    
  }
}
