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
  statusChecker = null

  constructor(api, ea, router) {
    this.ea = ea
    this.api = api
    this.router = router
  }

  activate(params, routeConfig) {
    this.setBroadcastInfo(params.id)
      .then(() => this.setStatusChecker())
  }

  getBroadcastInfo(id, show_request) {
    return this.api.broadcasts()
      .find(id, show_request)
      .then(response => response)
  }

  setBroadcastInfo(id) {
    return this.getBroadcastInfo(id, false)
      .then(response => {
        console.log(response)
        if (response.status != "error") {
          this.broadcast = response.data
          this.getSegmentInfo(response.data.segments_id)
          .then(response => {
            if(response.status !== 'error') {
              this.segment = response.data
            }
          })
        }
      })
  }

  setStatusChecker() {
    this.statusChecker = setInterval(() => {
      this.getBroadcastInfo(this.broadcast.id)
        .then(response => {
          console.log(this.broadcast.status, response.data.status)
          if(response.data.status != this.broadcast.status) {
            console.log(response.data)
            this.broadcast = response.data
          }
          if(response.data.status == 'completed') {
            console.log('response is completed')
            this.unsetStatusChecker()
          }
        })
    }, 5000)
  }

  unsetStatusChecker() {
    clearInterval(this.statusChecker)
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

  sendBroadcast(broadcast_id, send_type) {
    return this.api.broadcasts()
      .send(broadcast_id, send_type)
      .then(response => {
        if (response.errors != {}) {
          console.log(response)
          this.broadcast = {...this.broadcast, status: 'working'}
          this.setStatusChecker()
        }
      })
  }
}