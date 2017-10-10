import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ContextCreated} from './messages';
import {LogManager} from 'aurelia-framework';
let logger = LogManager.getLogger('testItems');

@inject(WebAPI, EventAggregator)
export class CreateBotContext{
	selectedValType = [];
	selectedValSA = [];
	ContentValue = '';
	ContentValueQR = '';
	SenderActionValue = '';
    isSA = false;
    istext = true;
    isQR = false;
    
    typeOptions = [
        {id: 'text', name: 'Text'},
        {id: 'sender_action', name: 'Sender Action'},
        {id: 'quick_reply', name: 'Quick replay'}
    ];
    
    SenderActionOptions = [
        {id: 'mark_seen', name: 'Mark seen'},
        {id: 'typing_on', name: 'Typing on'},
        {id: 'typing_off', name: 'Typing off'}
    ];
    items = [
		{text:'one',type:'text',payload: 'LISTO_EMPECEMOS'},
		
    ];
   // items = [];
  constructor(api, ea){
    this.api = api;
    
    this.ea = ea;
   
    this.context = {name:'', contextJson:'',bot_id:''}; 
       
    this.items.push({});  
  }
  
  DropdownChanged(selectedValType) {	 
    if(selectedValType == 'sender_action')
		{
			this.isSA = true;
			this.istext=false;
			this.isQR=false
		}
	else 
		if(selectedValType == 'text')
		{
			this.isSA = false;
			this.istext = true;
			this.isQR = false;
		}
	else
		if(selectedValType == 'quick_reply')
		{
			this.isSA = false;
			this.istext = false;
			this.isQR = true;
		}
  }
  
  addBlank(idx, event) {
    logger.debug('add Blank Items: ', this.items.length, 'Item: ', this.items[this.items.length-1]);
    this.items[idx] = event.target.value;
   // event.target.value = '';
    if (this.items[this.items.length-1]) {
      this.items.push({});
      logger.debug('added Blank Item at end: ', this.items);
    }
  }  
  removeItem(idx) {
	if(this.items.length > 1)
	{
		this.items.splice(idx, 1);
		logger.debug('Items: ', this.items);
	}
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
	if(this.selectedValType == 'text')
	{
		this.context.contextJson = "'" + this.context.name + "':[" +
						"{type:'text',"+
						" content: '" +  this.ContentValue + "'}]";
						
	}
	else
		if(this.selectedValType == 'sender_action')
		{
			this.context.contextJson = "'" + this.context.name + "':[" +
						"{type:'sender_action',"+
						" sender_action: '" +  this.selectedValSA + "'}]";
		}
	else
		if(this.selectedValType == 'quick_reply')
		{
			this.context.contextJson = "'" + this.context.name + "':[" +
						"{type:'quick_reply',"+
						" content: '" +  this.ContentValueQR + "'," +
						" quick_replies: " + JSON.stringify(this.items)+ "}]";
		}
		
	//alert(this.context.contextJson);
    this.api.createContext(this.context).then(context => {
      this.context = context;     
      this.ea.publish(new ContextCreated(this.context));
    });
    
  } 
  
}
