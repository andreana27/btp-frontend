import {  WebAPI } from './web-api';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(WebAPI, EventAggregator)
export class BotDataManagment {
  //Local variables
  selectedBotId = [];
  selectedContextId = [];
  //bool indicator enables the bot variable table
  botSelected = false;
  //petition package size
  recordsPerPetition = 50;
  //list of intents
  intentList = [];
  //records array
  tableRecords = [];
  //pagination size
  pageSize = 10;
  totalRecords = 0;
  //filters settings
  filters = [];
  //
  filteredRecords = [];
  //
  allRecords = [];
  //
  hasIntents = false;
  //
  context_list = [];
  //
  intentName = '';
  intentId = 0;
  countLabel = '';
  //attached functionallity
  attached(){}
  //Function gets called whenever the class is created
  created() {}
  isEditing = false;
  txtSaveButton = 'Save New Intent';

  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
  }

  //Function gets called whenever the view is activated
  activate(routeConfig) {
    this.routeConfig = routeConfig;
    //getting the bot list
    return this.api.getBotsList().then(bots => {
      this.bot_list = bots
      this.selectedBotId = this.bot_list[0].id;
      this.getData(this.selectedBotId);
    });
  }

  getData(bot_id){
    this.getContexts(bot_id);
    this.getIntents(bot_id);
  }

  getContexts(bot_id) {
    this.api.getContextList(bot_id).then(context_list => {
      this.context_list = context_list;
    });
  }

  //gets all the intents relative to a bot
  getIntents(botId) {
    try {
      //setting the selected bot
      this.bot = this.bot_list.filter(x => x.id == this.selectedBotId)[0];
      //clearing values
      this.allRecords = [];
      this.tableRecords = [];
      this.totalRecords = 0;
      this.api.getIntentCount(this.selectedBotId).then(numberOfRecords => {
        this.numberOfRecords = numberOfRecords;
        this.botSelected = true;
        if(this.numberOfRecords <= 0) {
          this.countLabel = "The selected bot has no intents";
        }
        else {
          this.countLabel = "";
          //setting the number of petitions to make to the backend depending of the number of records of variables
          this.numberOfPetitions = (this.numberOfRecords / this.recordsPerPetition)+1;
          if (this.numberOfPetitions == 0) {
            this.numberOfPetitions = 1;
          }
          //start getting the records
          for(let iteration = 0; iteration < this.numberOfPetitions;iteration++) {
            let inf_limit = this.recordsPerPetition * iteration;
            let sup_limit = inf_limit + this.recordsPerPetition;
            this.api.getBotIntents(this.selectedBotId,inf_limit,sup_limit).then(response => {
              //getting all the contacts from the logged Messages
              for(let n = 0;n<response.intents.length;n++) {
                let record = response.intents[n];
                this.addRecord(
                  record.id,
                  record.bot_id,
                  record.context_id,
                  record.name
                );
              }
              this.totalRecords = this.tableRecords.length;
              this.hasRecords = true;
            });
          }
        }
      });
    }
    catch(err) {
      console.log(err);
    }
  }

  addRecord(id,bot_id,context_id,name) {
    let record = { id:'', bot_id:'', context_id:'', name:''};
    record.id = id;
    record.bot_id = bot_id;
    record.context_id = context_id;
    record.context_name = this.context_list.filter(x => x.id == context_id)[0].name;
    record.name = name;
    this.tableRecords.push(record);
  }

  get canSaveIntent() {
    return this.intentName && !this.api.isRequesting;
  }

  saveIntent() {
    let intent = {bot_id: this.selectedBotId, context_id: this.selectedContextId, name: this.intentName, id:this.intentId };
    if (this.isEditing) {
      intent.id =
      this.api.updateBotIntent(intent).then(response => {
        this.intentName = '';
        this.getIntents(this.selectedBotId);
        this.isEditing = false;
      });
    } else {
      this.api.insertBotIntent(intent).then(response => {
        this.intentName = '';
        this.getIntents(this.selectedBotId);
      });
    }

  }

  //get the selected connector and set's it up to view/edit
  editIntent(intent) {
    this.intentName = intent.name;
    this.intentId = intent.id;
    this.selectedContextId = this.context_list.filter(x => x.id == intent.context_id)[0].id;
    this.isEditing = true;
    this.txtSaveButton = 'Save Changes';
  }

  cancelEdit() {
    this.isEditing = false;
    this.intentName = '';
    this.txtSaveButton = 'Save New Intent';
  }

  deleteIntent() {
    let intent = {id: this.intentId};
    this.api.deleteBotIntent(intent).then(response => {
      this.intentName = '';
      this.intentId = 0;
      this.getIntents(this.selectedBotId);
      this.isEditing = false;
    });
  }

  confirmDelete(intent){
    if (typeof intent === "undefined") {
      //close modal in case there is no connector selected
      $("#modal-danger").modal('hide');
    }
    else {
      this.intentId = intent.id;
      this.delete_message = {};
      this.delete_message.title = `Delete Intent ${intent.name}?`;
      this.delete_message.content = `You are about to delete the intent ${intent.name}.\r\nBeware you cannot undo this action, do you wish to proceed?`;
      $("#modal-danger").modal('show');
    }
  }

}//END BotDataManagment
