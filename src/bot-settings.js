import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';
import {
  BotViewed,
  ContextViewed,
  ContextUpdated,
  ContextCreated,
  ConnectorUpdated,
  ConnectorDeleted
} from './messages';
import {
  areEqual
} from './utility';
import {
  Router
} from 'aurelia-router';


@inject(WebAPI, EventAggregator)
export class BotSettings {
  constructor(api, ea,router) {
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
    //router setup
    this.router = router;
    //subscriptions
    this.subscriptions = [];
  }
  selectedContext = null;
  created() {}
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.botid = params.id;
    this.contextos = [];
    //getting the full context list
    this.api.getContextList(this.botid).then(contextos => this.fullContextList = contextos);
    this.getConnectorCounters();
    return this.api.getBotDetails(params.id).then(bot => {
      this.bot = bot;
      this.routeConfig.navModel.setTitle(bot.name);
      this.originalBot = JSON.parse(JSON.stringify(bot));
      this.ea.publish(new BotViewed(this.bot));
      //show the default context view
      this.sendToDefaultContext();
    });

  }
  configureRouter(config, router) {
    config.title = 'Bot Flow';
    config.map([{
        route: '',
        moduleId: 'no-selection',
        name: 'bot-context',
        title: 'Select'
      },
      {
        route: 'context/:contextid',
        moduleId: 'bot-context',
        name: 'bot-context'
      },
      {
        route: 'context/create/:botid',
        moduleId: 'create-bot-context',
        name: 'create-bot-context'
      },
      {
        route:'connector/setup/messenger',
        moduleId: 'connector-messenger',
        name:'connector-messenger',
        title: 'messenger'
      },
      {
        route:'connector/setup/telegram',
        moduleId: 'connector-telegram',
        name:'connector-telegram',
        title: 'telegram'
      }
    ]);
    this.router = router;
  }
  select(context) {
    this.previousContext = this.selectedContext;
    this.selectedContext = context;
    this.selectedId = context.id;
    //disables Back button is the default context is selected
    this.isDefaultContext = (this.fullContextList[0].id == this.selectedId);
    //getting the contexts sons
    this.api.getContextListByParentContext(this.botid,this.selectedId).then(contextos => this.contextos = contextos);
    return true;
  }
  //function that redirects the context-settings view to the default context view
  sendToDefaultContext()
  {
    //getting the default context id
    let defaultContextId =  JSON.stringify(this.fullContextList[0].id);
    //getting the botit
    let botId = this.botid;
    //setting up the default context route
    this.router.navigate("manager/bot/"+botId+"/context/"+defaultContextId);
    //console.log(this.api.getContextListByParentContext(botId,defaultContextId));
    this.api.getContextListByParentContext(this.botid,defaultContextId).then(contextos => this.contextos = contextos);
    //disables Back button is the default context is selected
    this.isDefaultContext = true;
  }

  //attached subscriptions
  attached()
  {
    this.subscriptions.push(this.ea.subscribe(ConnectorDeleted, msg => {
        this.getConnectorCounters();
    }));
    this.subscriptions.push(this.ea.subscribe(ConnectorUpdated, msg => {
        this.getConnectorCounters();
    }));
  }

  //function that gets and sets the connector count badges
  getConnectorCounters()
  {
    this.api.getConnectorList(this.botid,'messenger').then(connectors => {
      this.messengerConnectorCount = connectors.length;
    });
    this.api.getConnectorList(this.botid,'telegram').then(connectors => {
      this.telegramConnectorCount = connectors.length;
    });
  }
  //function that navigates a level up on the context tree
  gotoParentContext(){
    let bot = this.botid;
    let parent = this.selectedContext.parent_context;
    this.router.navigate("manager/bot/"+bot+"/context/"+parent);
  }
}
