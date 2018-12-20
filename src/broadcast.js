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
  filterType = null
  newFilter = {
    comparation: null,
    comparationValue: null
  }
  newNameBroadcast = null
  isWorking = false
  filterTypes = [
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
    this.api.botVariables()
      .get(bot)
      .then(response => this.botVariables = [...response])
  }

  getBroadcastsList(bot) {
    this.api.broadcast()
      .getByBot(bot)
      .then(data => this.broadcastList = [...data])
  }

  selectBroadcast(broadcast) {
    this.selectedBroadcast = {...broadcast}
    this.getBroadcastFilters(broadcast)
  }

  getBroadcastFilters(broadcast) {
    this.api.broadcast()
      .getById(broadcast.id)
      .then(broadcast_selected => broadcast_selected.rules ? this.broadcastFilters = [...broadcast_selected.rules] : this.broadcastFilters = [])
  }

  createBroadcast(botId) {
    this.isWorking = true
    this.api.broadcast()
      .create({name: this.newBroadcastName.value, bot_id: botId})
      .then(response => {
        if(response.status != 'error') {
          this.broadcastList = [...this.broadcastList, response.data]
          this.newBroadcastName.value = ""
        }
        this.isWorking = false
      })
      .catch(err => {this.isWorking = false})
  }

  updateBroadcast(broadcast) {
    let privBroadcast = {
      ...broadcast,
      name: this.activeBroadcastName.value,
      action_type: this.activeBroadcastActionType.value,
      action_value: this.activeBroadcastActionValue.value
    }
    this.isWorking = true
    return this.api.broadcast()
      .update(privBroadcast)
      .then(response => {
        if(response.status !== 'error') {
          console.log('changed: ', response.data)
          let cloneArray = [...this.broadcastList]
          let indexChange = null
          cloneArray.map((item, index) => { item.id == response.data.id ? indexChange = index : null })
          cloneArray[indexChange] = response.data
          this.broadcastList = [...cloneArray]
          return response
        }
        this.isWorking = false
      })
      .catch(err => {this.isWorking = false})
  }

  deleteBroadcast(broadcast) {
    let confirm = window.confirm(`Confirm delete broadcast with name ${broadcast.name}?`)
    if(confirm) {
      this.isWorking = true
      this.api.broadcast()
        .destroy(broadcast)
        .then(response => {
          if(response.status != "error") {
            this.selectedBroadcast = null
            this.broadcastList = this.broadcastList.filter(item => item.id !== response.data.id)
            this.broadcastFilters = []
          }
          this.isWorking = false
        })
        .catch(err => {this.isWorking = false})
    }
  }

  createFilter() {
    let newFilter = {variable: this.filterVariableInput.value, type: this.filterTypeInput.value, comparation: this.newFilter.comparation, value: this.newFilter.comparationValue}
    let rules = [...this.broadcastFilters, newFilter]
    let broadcast = {...this.selectedBroadcast, rules}
    this.isWorking = true
    this.updateBroadcast(broadcast)
      .then(response => {
        this.broadcastFilters = [...response.data.rules]
        this.newFilter = {...this.newFilter, comparationValue: null, comparation: null}
        this.isWorking = false
        $('#exampleModal').modal('hide')
      })
      .catch(err => {this.isWorking = false})
  }
}