import {
  WebAPI
} from './web-api'
import {
  inject
} from 'aurelia-framework'
import {
  EventAggregator
} from 'aurelia-event-aggregator'
import {
  Router
} from 'aurelia-router'

@inject(WebAPI, EventAggregator, Router)
export class NewBroadCast {
  broadcasts = null
  segments = null
  segment = null
  bots = null
  bot = null
  newBroadcast = {
    alias: null,
    action_type: 'change_context',
    action_value: null
  }
  defaultNewBroadcast = {...this.newBroadcast}

  constructor(api, ea, router) {
    this.ea = ea
    this.api = api
    this.router = router
  }

  activate() {
    this.setSegments()
    this.api.getBotsList()
      .then(response => {this.bots = [...response]; console.log(this.bots)})
  }

  setSegments() {
    this.getSegments()
    .then(response => {
      if(response.status !== 'error') {
        this.segments = response.data
        console.log(this.segments)
      }
    })
  }

  selectSegment(segment) {
    this.segment = {...segment}
    console.log(this.segment)
  }

  selectBot(bot) {
    this.bot = {...bot}
    console.log(this.bot)
  }

  getSegments() {
    return this.api.segments()
      .get()
      .then(response => response)
  }

  createBroadcast(broadcast) {
    this.api.broadcasts()
      .create(broadcast)
      .then(response => {
        if(response.status !== "error") {
          this.router.navigate(`chat/broadcast/${response.data.id}`)
        }
      })
  }
}