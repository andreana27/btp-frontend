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
  BotDeleted
} from './messages';
import * as toastr from 'toastr';

@inject(WebAPI, EventAggregator)
export class BotList {
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
    this.bots = [];
    this.suscriptions = [];
  }

  attached(){
    this.suscriptions.push(this.ea.subscribe(BotViewed, msg => this.select(msg.bot)));
    this.suscriptions.push(this.ea.subscribe(BotUpdated, msg => {
      let id = msg.bot.id;
      let found = this.bots.find(x => x.id == id);
      Object.assign(found, msg.bot);
      toastr.success(`Bot ${found.name} updated.`);
      console.log('hola');
    }));
    this.suscriptions.push(this.ea.subscribe(BotDeleted, msg => {
      this.api.getBotsList().then(bots => this.bots = bots);
      toastr.warning(`Bot ${msg.bot.name} deleted.`);
    }));
    this.suscriptions.push(this.ea.subscribe(BotCreated, msg => {
      this.bots.push(msg.bot);
    }));
  }

  detached(){
    for (let subscription = 0; subscription < this.suscriptions.length; subscription += 1){
      this.suscriptions[subscription].dispose();
    }
  }

  created() {
    this.api.getBotsList().then(bots => this.bots = bots);
  }

  confirmdelete(bot){
    this.delete_message = {};
    this.delete_message.title = `Delete Bot ${bot.name}?`;
    this.delete_message.content = `
    You are about to delete ${bot.name}.
    This can't be reversed.
    Continue?`;
    this.delete_message.bot = bot;
  }

  toggleEnabled(bot){
    bot.enabled = !bot.enabled;
    //bot.connectors = JSON.stringify(bot.connectors);
    this.api.saveBot(bot).then(answer => this.ea.publish(new BotUpdated(bot)));
  }

  delete(bot){
    let idx = this.bots.indexOf(bot);
    delete this.bots[idx];
    this.api.deleteBot(bot).then(
      answer => this.ea.publish(new BotDeleted(bot))
    );
    //delete all bot web-site connectors
    let parameters = {bot_id:bot.id ,token:0};
    this.api.deleteWebsiteConnector(parameters);
  }

  select(bot) {
    this.selectedId = bot.id;
    return true;
  }
}
