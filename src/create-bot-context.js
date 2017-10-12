import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ContextCreated} from './messages';
import {LogManager} from 'aurelia-framework';
let logger = LogManager.getLogger('testItems');

@inject(WebAPI, EventAggregator)
export class CreateBotContext{
	
   
  constructor(api, ea){
    this.api = api;
    
    this.ea = ea;
   
    this.context = {name:'', contextJson:'',bot_id:''}; 
       
    
  }
  
  
  created(){
  }
  activate(params, routeConfig){
    this.routeConfig = routeConfig;
    this.botid = params.botid;
    this.context.bot_id = this.botid;
  }
   get canSave(){    
	return this.context.name && !this.api.isRequesting;
}
save(){
	
		
	//alert(this.context.contextJson);
    this.api.createContext(this.context).then(context => {
      this.context = context;     
      this.ea.publish(new ContextCreated(this.context));
    });
    
  } 
  
}
