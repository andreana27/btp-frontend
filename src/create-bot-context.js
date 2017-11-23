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
  ContextCreated,
  ContextViewed
} from './messages';
import {
  LogManager
} from 'aurelia-framework';
import {
  Router
} from 'aurelia-router';

@inject(WebAPI, EventAggregator, Router)
export class CreateBotContext {


  constructor(api, ea, router) {
    this.api = api;
    this.ea = ea;
    this.router = router;

    this.context = {
      name: '',
      context_json: '',
      bot_id: '',
      parent_context: ''
    };
    ea.subscribe(ContextViewed, msg => this.selectParentContext(msg.context));
    this.subscriptions = [];
  }

  attached()
  {
    this.subscriptions.push(this.ea.subscribe(ContextViewed, msg => this.selectParentContext(msg.context)));
  }

  created() {}
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.selectedContextId = params.contextid;
    this.botid = params.botid;
    this.context.bot_id = this.botid;
  }
  get canSave() {
    this.context.context_json = {};
    this.context.context_json[this.context.name] = [];
    return this.context.name && !this.api.isRequesting;
  }
  save() {
    this.context.parent_context = this.selectedContextId;

    this.api.createContext(this.context).then(context => {
      this.context = context;
      this.ea.publish(new ContextCreated(this.context));
    });
    //this.router.navigate('');
  }
  selectParentContext(context)
  {
    this.selectedContextId= context.id;
    console.log(context.id);
  }

}
