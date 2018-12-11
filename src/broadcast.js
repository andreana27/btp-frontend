import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';

@inject(WebAPI, EventAggregator)
export class Broadcast {
  title = ""
  bots = []
  selectedBot = null
  selectedBroadcast = null
  botVariables = []
  broadcastList = []
  broadcastFilters = []
  
  constructor(api, ea) {
    this.title = "Welcome to broadcast"
    this.ea = ea;
    this.api = api;
  }

  activate() {
    this.api.getBotsList().then(bots => {
      this.bots = [...bots]
      if(this.bots) {
        this.selectedBot = this.bots[0]
        this.getBotVariables(this.selectedBot)
        this.getBroadcastsList(this.selectedBot)
      }
    })
  }

  changeSelectedBot() {
    //clean values
    this.selectedBroadcast = null
    this.botVariables = []
    this.broadcastList = []
    
    //set new values
    this.getBotVariables(this.selectedBot)
    this.getBroadcastsList(this.selectedBot)
  }

  getBotVariables(bot) {
    this.api.botVariables().get(bot)
  }

  getBroadcastsList(bot) {
    this.api.broadcast().getByBot(bot)
      .then(data => this.broadcastList = [...data])
  }

  selectBroadcast(broadcast) {
    this.selectedBroadcast = broadcast
    this.getBroadcastFilters(broadcast)
  }

  getBroadcastFilters(broadcast) {
    this.api.broadcast().getById(broadcast.id)
      .then(broadcast_selected => console.log('broadcast selected: ', broadcast_selected))
  }

  createBroadcast(botId) {
    let newBroadcast = {
      name: this.newBroadcastName.value,
      bot_id: botId
    }
    this.api.broadcast().create(newBroadcast)
      .then(response => {
        if(response.status != 'error') {
          this.broadcastList = [...this.broadcastList, response.data]
          this.newBroadcastName.value = ""
        }
      })
  }
}