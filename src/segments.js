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
export class Segments {
  title = ""
  segments = null
  loading = false

  constructor(api, ea, router) {
    this.title = "for broadcast use"
    this.ea = ea
    this.api = api
    this.router = router
  }

  activate() {
    this.getSegments()
  }

  getSegments() {
    this.loading = true
    this.api.segments()
      .get()
      .then(response => {
        if(response.status !== 'error') {
          this.segments = response.data
          this.loading = false
        } else { 
          this.loading = false
        }
      })
  }

  createSegment() {
    let newSegment = {name: this.newSegmentName.value}
    return this.api.segments()
      .create(newSegment)
      .then(response => {
        if(response.status !== "error") {
          this.newSegmentName.value = ""
          this.segments = [...this.segments, response.data]
          $('#createSegmentModal').modal('hide')
          this.router.navigate(`chat/segment/${response.data.id}`)
        }
      })
  }
}