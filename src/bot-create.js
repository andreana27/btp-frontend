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
  BotUpdated,
  BotViewed,
  BotCreated,
  ContextCreated
} from './messages';
import {
  Router
} from 'aurelia-router';


@inject(WebAPI, EventAggregator, Router)
export class CreateBot {
  constructor(api, ea, router) {
    this.api = api;
    this.ea = ea;
    this.router = router;
    this.bot = {
      name: '',
      enabled: 'True',
      bot_language: 'en'
    };
  }

  get canSave() {
    return this.bot.name && !this.api.isRequesting;
  }
  save() {
    this.api.createBot(this.bot).then(bot => {
      this.bot = bot;
      this.ea.publish(new BotCreated(this.bot));
      let context = {
        name: 'default',
        isdefault: true,
        context_json: {"default": []},
        bot_id: bot.id
      };
      this.api.createContext(context).then(context => {
        this.ea.publish(new ContextCreated(context));
        this.router.navigate(`bot/${bot.id}/context/${context.id}`);
      });
      //this.router.navigate('');
    });
  }

  activate(routeConfig) {
    this.routeConfig = routeConfig;
  }
}
