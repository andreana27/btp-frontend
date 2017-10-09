import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {BotUpdated,BotViewed,BotCreated} from './messages';

@inject(WebAPI, EventAggregator)
export class BotList{
  constructor(api, ea){
    this.api = api;
    this.bots = [];
    ea.subscribe(BotViewed, msg => this.select(msg.bot));
    ea.subscribe(BotUpdated, msg => {
      let id = msg.bot.id;
      let found = this.bots.find(x => x.id == id);
      Object.assign(found, msg.bot);
    });
    ea.subscribe(BotCreated, msg => {
      this.bots.push(msg.bot);
    });
  }

  created(){
    this.api.getBotsList().then(bots => this.bots = bots);
  }

  select(bot){
    this.selectedId = bot.id;
    return true;
  }
}
/*
export class BotList{
  constructor(){
    this.bots = [
                  {
                    id: 1,
                    name:'bot 1',
                    enabled:true,
                    picture:'http://lorempixel.com/200/200/people/',
                    messages:'23',
                    users: '12',
                    data: '3'
                  },
                  {
                    id: 2,
                    name:'bot 2',
                    enabled:true,
                    picture:'http://lorempixel.com/200/200/people/',
                    messages:'13',
                    users: '12',
                    data: '2'
                  },
                  {
                    id: 3,
                    name:'bot 3',
                    enabled:false,
                    picture:'http://lorempixel.com/200/200/people/',
                    messages:'3',
                    users: '12',
                    data: '23'
                  },
                ];
  }
  created(){
  }
}
*/
