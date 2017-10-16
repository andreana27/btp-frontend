import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ContextUpdated,ContextViewed} from './messages';
import {areEqual} from './utility';
@inject(WebAPI, EventAggregator)
export class BotContext{	
	SenderActionOptions = [
        {id: 'mark_seen', name: 'Mark seen'},
        {id: 'typing_on', name: 'Typing on'},
        {id: 'typing_off', name: 'Typing off'}
    ];
    isSA = false;
    istext = false;
    isQR = false;
    
    selectedValSA = [];
	ContentValue = '';
	ContentValueQR = '';
	SenderActionValue = '';
	
	json_Context;
	
	constructor(api, ea){
		this.api = api;
		this.ea = ea;
	}
	elementSelected(selectedValType) {	 
		if(selectedValType == 'sa')
			{
				if (!this.isSA)
				{
					this.isSA = true;
					this.istext=false;
					this.isQR=false
				}
				else
				{this.isSA = false;}
			}
		else 
			if(selectedValType == 'text')
			{
				if (!this.istext)
				{
					this.isSA = false;
					this.istext = true;
					this.isQR = false;
				}
				else{this.istext = false;}
			}
		else
			if(selectedValType == 'qr')
			{
				if (!this.isQR)
				{
					this.isSA = false;
					this.istext = false;
					this.isQR = true;
				}
				else{this.isQR = false;}
			}
	}
	created(){
	}
	additem(type)
	{
		var newElement = {};
		
		var arrayLength;
		
		if(type=='text')
		{
			
                                
			newElement.type= type;
			newElement.content = this.ContentValue;
			console.log(newElement);					
			this.ContentValue = "";
			this.istext = false;
			alert('Text element added');	
			
		}
		else
			if(type=='sender_action')
			{				
				newElement.type= type;
				newElement.content = this.selectedValSA;
				this.selectedValSA = [];
				console.log(newElement);
				this.isSA = false;
				alert('Sender action element added');                          
			}
		else
			if(type=='quick_reply')
			{
				newElement.type= type;
				newElement.content = this.ContentValueQR;
			}
			
			//json_Context= "{\"" + this.context.name + "\":[]}";
			
			//this.json_Context = JSON.parse(this.context.context_json);
			arrayLength = this.json_Context[this.context.name].length;
			this.json_Context[this.context.name][arrayLength] = newElement;
			
			console.log(this.json_Context);
			this.context.context_json = JSON.stringify(this.json_Context);
			
			this.save();
	}
	activate(params, routeConfig){
		this.routeConfig = routeConfig;   
		return this.api.getContextDetails(params.contextid).then(context => {
		  this.context = context;
		  this.json_Context = JSON.parse(this.context.context_json);
		  this.routeConfig.navModel.setTitle(context.name);
		  this.originalContext = JSON.parse(JSON.stringify(context));
		  this.ea.publish(new ContextViewed(this.context));
		});
	}
	
	get canSave(){    
		return this.context.name && !this.api.isRequesting;
	}
	
	save(){
		this.api.saveContext(this.context).then(context => {
		  this.context = context;
		  this.routeConfig.navModel.setTitle(context.name);
		  this.originalContext= JSON.parse(JSON.stringify(context));
		  this.ea.publish(new ContextUpdated(this.context));
		});
	  }
}
