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
export class BroadCasts {
  broadcasts = null

  constructor(api, ea, router) {
    this.ea = ea
    this.api = api
    this.router = router
  }

  activate() {
    this.setBroadcasts()
  }

  setBroadcasts() {
    this.getBroadcasts()
      .then(response => {
        if(response.status !== 'error') {
          this.broadcasts = [...response.data]
        }
      })
  }

  getBroadcasts() {
    return this.api.broadcasts()
      .get()
      .then(response => response)
  }
}