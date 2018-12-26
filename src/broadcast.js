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
  broadcast = null
  segment = null
  bot = null

  constructor(api, ea, router) {
    this.ea = ea
    this.api = api
    this.router = router
  }

  activate(params, routeConfig) {
    this.getBroadcastInfo(params.id)
  }

  getBroadcastInfo(id) {
    this.api.broadcasts()
      .find(id)
      .then(response => {
        if(response.status !== 'error') {
          this.broadcast = response
          console.log(response.info)
          this.getSegmentInfo(response.segments_id)
            .then(response => {
              if(response.status !== 'error') {
                this.segment = response.data
              }
            })
        }
      })
  }

  getSegmentInfo(id) {
    return this.api.segments()
      .find(id)
      .then(response => response)
  }

  getBotInfo(id) {
    this.api.segments()
      find(id)
      .then(response => console.log(response))
  }
}