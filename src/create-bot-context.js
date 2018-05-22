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
    this.HTMLError = '';
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
    var regex = /[a-zA-Z\-0-9]+([_]|[-]|[a-zA-Z\-0-9])*$/;
    if(regex.test(this.context.name))
    {

      this.api.existsContextName(this.botid,this.context.name).then(response => {
        if(response.cont==0)
        {
          this.context.parent_context = this.selectedContextId;
          this.api.createContext(this.context).then(context => {
            this.context = context;
            this.ea.publish(new ContextCreated(this.context));
            this.router.navigateToRoute('bot-context', { 'contextid': this.context.id }, // route parameters object
                    { trigger: true, replace: true }); // options
          });

//          this.router.navigate('');
        }
        else
        {
            this.HTMLError = '<br><label>There is a context with that name already. Change the name of the context <label>';
        }

      });

    }
    else {
      this.HTMLError = '<br><label>Allowed name characters: Letters A-9, Numbrers:0-9, Underscore: _ and Hyphen: -<label>';
    }

  }
  selectParentContext(context)
  {
    this.selectedContextId= context.id;
  }

}
