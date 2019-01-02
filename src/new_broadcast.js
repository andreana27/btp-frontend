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
    this.getBots(this.segment.id)
      .then(response => {
        if(response.status !== 'error') {
          this.bots = [...response.data]
          $('#segments-container').fadeOut(300)
          $('#bots-container').delay(300).fadeIn(300)
        }
      })
  }

  selectBot(bot) {
    this.bot = {...bot}
    console.log(this.bot)
    $('#bots-container').fadeOut(300)
    $('#broadcast-container').delay(300).fadeIn(300)
  }

  getSegments() {
    return this.api.segments()
      .get()
      .then(response => response)
  }

  getBots(segment_id) {
    return this.api.bots()
      .bySegment(segment_id)
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

  showBots() {
    $('#broadcast-container').fadeOut(300)
    $('#bots-container').delay(300).fadeIn(300)
  }

  showSegments() {
    $('#broadcast-container').fadeOut(300)
    $('#segments-container').delay(300).fadeIn(300)
  }
}