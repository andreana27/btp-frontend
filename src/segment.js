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
export class Segment {
  routeConfig = null
  segment = null
  variables = null
  filterTypes = filterTypes
  newFilterType = null
  editFilterType = null
  editFilter = null
  activeFilterIndex = null
  filters = null
  filterVariables = null
  newSegmentName = null
  bots = null
  botStatistics = null

  constructor(api, ea, router) {
    this.ea = ea
    this.api = api
    this.router = router
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig
    this.getSegmentInfo(params.id)
    this.getVariables()
    this.changeFilterType(this.filterTypes[0].type)
    this.getBots(params.id)
  }

  getSegmentInfo(id) {
    return this.api.segments()
      .find(id)
      .then(response => {
        if(response.status !== 'error') {
          this.segment = response.data
          this.filters = response.data.filters ? [...response.data.filters] : []
          this.newSegmentName = response.data.name
          this.changeSegmentVariables()
        }
      })
  }

  getVariables() {
    this.api.variables()
      .get()
      .then(response => {
        this.variables = [...response.data]
      })
  }

  getBots(segment_id) {
    this.api.bots()
      .bySegment(segment_id)
      .then(response => {
        if (response.status !== 'error') {
          this.bots = [...response.data]
          console.log(response)
        }
      })
  }

  getBotStatistics(segment_id, bot_id = 1) {
    this.api.bots()
      .bySegment(segment_id, bot_id, true)
      .then(response => {
        if (response.status != 'error') {
          console.log(response.data[0])
          this.botStatistics = response.data[0]
        }
      })
  }

  showValue(variable, user) {
    let item = user.responses.filter(item => item.storage_key == variable)[0]
    console.log(item)
    return item.storage_value
  }

  changeFilterType(type) {
    this.newFilterType = this.filterTypes.filter(item => item.type === type)[0]
  }

  changeSegmentVariables() {
    let variables = new Set()
    this.filters.map(filter => variables.add(filter.variable))
    this.filterVariables = Array.from(variables)
  }

  createFilter(newFilter) {
    let {id} = this.segment
    let filters = [...this.filters, newFilter]
    this.api.segments().update({id, filters})
      .then(response => {
        if (response.status !== "error") {
          this.filters = [...response.data.filters]
          this.newFilterVariable.value = null
          this.newFilterValue.value = null
          this.changeSegmentVariables()
          this.getBots(id)
        }
      })
  }

  setModalValues(index) {
      this.editFilter = {...this.filters[index]}
      this.activeFilterIndex = index
      this.changeEditFilterType(this.editFilter.type)
  }

  changeEditFilterType(type) {
    this.editFilterType = this.filterTypes.filter(item => item.type === type)[0]
  }

  editFilters(filter) {
    let newFilter = {...filter}
    let filters = [...this.filters]
    filters.splice(this.activeFilterIndex, 1, newFilter)
    let {id} = this.segment
    this.updateSegment({id, filters})
      .then(response => {
        if(response.status !== 'error') {
          this.filters = response.data.filters
          this.segment.updated_at = response.data.updated_at
          this.changeSegmentVariables()
          $('#editFilterModal').modal('hide')
          this.getBots(id)
        }
      })
  }

  deleteFilter(index) {
    let confirm = window.confirm(`Confirm delete this filter?`)
    if (confirm) {
      let filters = [...this.filters]
      filters.splice(index, 1)
      let {id} = this.segment
      this.updateSegment({id, filters})
        .then(response => {
          if(response.status !== 'error') {
            this.filters = response.data.filters
            this.segment.updated_at = response.data.updated_at
            this.changeSegmentVariables()
            this.getBots(id)
          }
        })
    }
  }

  changeComparation(comparation) {
    let {id} = this.segment
    this.updateSegment({id, comparation})
    .then(response => {
      if(response.status !== 'error') {
        this.segment = response.data
        this.getBots(id)
      }
    })
  }

  setSegmentValuesInModal() {
    this.newSegmentName = this.segment.name
  }

  updateSegment(segment) {
    return this.api.segments()
      .update(segment)
      .then(response => response )
      .catch(err => err)
  }

  duplicateSegment() {
    let confirm = window.confirm(`Confirm duplicate the segment with name: ${this.segment.name}`)
    if(confirm) {
      let newSegment = {...this.segment, name: `${this.segment.name} copy`}
      delete newSegment.id
      this.createSegment(newSegment)
        .then(response => {
          if(response.status !== 'error') {
            this.router.navigate(`chat/segment/${response.data.id}`)
          }
        })
    }
  }

  createSegment(segment) {
    return this.api.segments()
      .create(segment)
      .then(response => response)
  }

  editSegment(segment) {
    let newSegment = {...this.segment, ...segment}
    delete newSegment.filters
    delete newSegment.updated_at
    delete newSegment.created_at
    this.updateSegment(newSegment)
      .then(response => {
        if (response.status !== 'error') {
          this.segment = response.data
          this.changeSegmentVariables()
          $('#editSegmentModal').modal('hide')
        }
      })
  }

  deleteSegment() {
    let confirm  = window.confirm(`Confirm to delete the segment with name: ${this.segment.name}`)
    if(confirm) {
      this.destroySegment(this.segment)
      .then(response => {
        if(response.status !== 'error') {
          this.router.navigate(`chat/segments`)
        }
      })
    }
  }

  destroySegment(segment) {
    return this.api.segments()
      .destroy(segment)
        .then(response => response)
  }
}

let filterTypes = [
  {
    type: 'text',
    inputType: 'text',
    comparations: [
      {
        value: 'equals',
        label: 'Equals'
      },
      {
        value: 'not-equals',
        label: 'Not Equals'
      }
    ]
  },
  {
    type: 'date',
    inputType: 'date',
    comparations: [
      {
        value: 'equals',
        label: 'Equals'
      },
      {
        value: 'not-equals',
        label: 'Not Equals'
      },
      {
        value: 'before',
        label: 'Before'
      },
      {
        value: 'after',
        label: 'After'
      }
    ]
  },
  {
    type: 'numeric',
    inputType: 'number',
    comparations: [
      {
        value: 'equals',
        label: 'Equals'
      },
      {
        value: 'not-equals',
        label: 'Not Equals'
      },
      {
        value: 'greater-than',
        label: 'Greater than'
      },
      {
        value: 'smaller-than',
        label: 'Smaller Than'
      }
    ]
  }
]