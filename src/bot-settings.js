import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BotViewed,ContextViewed,ContextUpdated,ContextCreated} from './messages';
import {areEqual} from './utility';


@inject(WebAPI, EventAggregator)
export class BotSettings{
	constructor(api, ea){
		this.api = api;
		this.ea = ea;
		ea.subscribe(ContextViewed, msg => this.select(msg.context));
		ea.subscribe(ContextUpdated, msg => {
			let id = msg.context.id;
			let found = this.contextos.find(x => x.id == id);
			Object.assign(found, msg.context);
		});
		ea.subscribe(ContextCreated, msg => {
			this.contextos.push(msg.context);
		});
  }
	created(){
	}
	activate(params, routeConfig){
		this.routeConfig = routeConfig;
		this.botid = params.id;    
		this.contextos = [];
		this.api.getContextList(this.botid).then(contextos => this.contextos = contextos);
	  
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
			{route: 'no-select',   moduleId: 'no-selection', name: 'bot-context', title: 'Select'},
			{route: 'context/:contextid',   moduleId: 'bot-context',   name:'bot-context'},
			{route: 'context/create/:botid',   moduleId: 'create-bot-context',   name:'create-bot-context'}
		]);
		this.router = router;
	}
	select(context){
		this.selectedId = context.id;
		return true;
	}
	
}
