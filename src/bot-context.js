import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ContextUpdated,ContextViewed} from './messages';
import {areEqual} from './utility';
@inject(WebAPI, EventAggregator)
export class BotContext{	
	constructor(api, ea){
		this.api = api;
		this.ea = ea;
	}
	created(){
	}
	
	activate(params, routeConfig){
		this.routeConfig = routeConfig;   
		return this.api.getContextDetails(params.contextid).then(context => {
		  this.context = context;
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
