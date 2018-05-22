import {  WebAPI } from './web-api';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as toastr from 'toastr';

@inject(WebAPI, EventAggregator)
export class BotDataManagment {
  //Local variables
  selectedBotId = [];
  selectedContextId = [];
  selectedTrigContext = [];
  //bool indicator enables the bot variable table
  botSelected = false;
  //petition package size
  recordsPerPetition = 50;
  //list of intents
  intentList = [];
  //records array
  tableRecords = [];
  tableRequest=[];
  show_request=false;
  intentExamples = [];
  //pagination size
  pageSize = 10;
  totalRecords = 0;
  totalRequests = 0;

  intentExPageSize = 10;
  intentExampleCount = 0;
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
  exampleContextList = [];
  //
  intentName = '';
  exampleText = '';
  triggeredContext = 0;
  intentId = 0;
  intentExampleId = 0;
  countLabel = '';
  //attached functionallity
  attached(){}
  //Function gets called whenever the class is created
  created() {}
  isEditing = false;
  isEditingExample = false;
  hasExamples = false;
  txtSaveButton = 'Save New Intent';
  txtSaveExButton = 'Save New Example';
  HTMLError = '';
  file_content = '';
  intentsQualify = false;
  exampleCount = 0;
  bot_language = 'en';
  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
  }

  //Function gets called whenever the view is activated
  activate(routeConfig) {
    this.routeConfig = routeConfig;
    this.intentsQualify = false;
    //getting the bot list
    return this.api.getBotsList().then(bots => {
      this.bot_list = bots
      this.selectedBotId = this.bot_list[0].id;
      this.getData(this.selectedBotId);
      this.textlogfilevisible=false;

    });
  }

  getData(bot_id){
    this.show_request=false;
    this.getContexts(bot_id);
    this.getIntents(bot_id);
  }

  getContexts(bot_id) {
    this.api.getContextList(bot_id).then(context_list => {
      this.context_list = context_list;
      this.exampleContextList = context_list;
      /*let defaultEmptyContext = {id:null,name:'No Context'}
      //Adding the default empty context option at the first position of the array
      this.exampleContextList.unshift(defaultEmptyContext);
      */
      this.textlogfile=''
      this.textlogfilevisible=false;
    });
  }

  //validates the intent name, with an RE with allowance only for letters, numbers and -/_
  validateIntentName(name){
    var regex = /[a-zA-Z\-0-9]+([_]|[-]|[a-zA-Z\-0-9])*$/;
    return regex.test(name);
  }

  //gets all the intents relative to a bot
  getIntents(botId) {
    try {
      //setting the selected bot
      this.bot = this.bot_list.filter(x => x.id == this.selectedBotId)[0];
      //getting the language
      this.bot_language = this.bot.bot_language;
      //clearing values
      this.allRecords = [];
      this.tableRecords = [];
      this.intentList =  [];
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
    this.intentList.push(record);
  }

  get canSaveIntent() {
    return this.intentName && !this.api.isRequesting;
  }

  saveIntent() {
    if (this.validateIntentName(this.intentName)) {
      this.api.existsIntentName(this.selectedBotId,this.intentName).then(cant => {
        if(cant.cont==0)
        {
          this.HTMLError = '';
          let intent = {bot_id: this.selectedBotId, context_id: this.selectedContextId, name: this.intentName, id:this.intentId };
          if (this.isEditing) {
            intent.id =
            this.api.updateBotIntent(intent).then(response => {
              this.intentName = '';
              this.getIntents(this.selectedBotId);
              this.isEditing = false;
              this.generateJSONFile();
            });
          } else {
            this.api.insertBotIntent(intent).then(response => {
              this.intentName = '';
              this.getIntents(this.selectedBotId);
              this.generateJSONFile();
            });
          }
          this.api.setFalseBotTrainStatus(this.selectedBotId);
        }
        else
        {
          this.HTMLError = '<br><label>the intent name already exists.<label>';
        }

      });


    }
    else {
      this.HTMLError = '<br><label>Allowed name characters: Letters A-9, Numbrers:0-9, Underscore: _ and Hyphen: -<label>';
    }
  }

  //get the selected connector and set's it up to view/edit
  editIntent(intent) {
    this.intentName = intent.name;
    this.intentId = intent.id;
    this.selectedContextId = this.context_list.filter(x => x.id == intent.context_id)[0].id;
    this.isEditing = true;
    this.getExamples(intent.id);
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
      this.api.setFalseBotTrainStatus(this.selectedBotId);

    });
  }

  confirmDelete(intent){
    if (typeof intent === "undefined") {
      //close modal in case there is no connector selected
      $("#mdlDeleteIntent").modal('hide');
    }
    else {
      this.intentId = intent.id;
      this.delete_message = {};
      this.delete_message.title = `Delete Intent ${intent.name}?`;
      this.delete_message.content = `You are about to delete the intent ${intent.name}.\r\nBeware you cannot undo this action, do you wish to proceed?`;
      $("#mdlDeleteIntent").modal('show');
    }
  }

  get canSaveIntentExample(){
    return this.exampleText && !this.api.isRequesting;
  }

  saveExample() {
    //Remove comment for triggeredContext re-activation
    /*let triggeredContextId = null;
    if (!(this.selectedTrigContext == "null")) {
        triggeredContextId = this.selectedTrigContext;
    }
    let intentExample = {intent_id: this.intentId, example_text: this.exampleText, triggered_context: triggeredContextId, id:this.intentExampleId };
    */
    let intentExample = {intent_id: this.intentId, example_text: this.exampleText, id:this.intentExampleId };
    if (this.isEditingExample) {
      this.api.intentExampleCRUD(3,intentExample).then(response => {
        this.exampleText = '';
        this.getExamples(this.intentId);
        this.cancelEditExample();
        this.generateJSONFile();
      });
    } else {
      this.api.intentExampleCRUD(1,intentExample).then(response => {
        this.exampleText = '';
        this.getExamples(this.intentId);
        this.generateJSONFile();
      });
    }
    this.api.setFalseBotTrainStatus(this.selectedBotId);
  }


  cancelEditExample(){
    this.isEditingExample = false;
    this.exampleText = '';
    this.txtSaveExButton = 'Save New Intent Example';
  }

  editExample(example) {
    this.exampleText = example.example_text;
    this.intentExampleId = example.id;
    /*
    let SelectedContext = {name: "No Context", id: null};
    if (!(example.triggered_context == 'null')) {
      SelectedContext = this.exampleContextList.filter(x => x.id == example.triggered_context)[0];
    }
    this.selectedTrigContext = SelectedContext;*/
    this.isEditingExample = true;
    this.txtSaveExButton = 'Save Changes';
  }

  deleteExample() {
    let example = {id: this.intentExampleId};
    this.api.intentExampleCRUD(2, example).then(response => {
      this.exampleText = '';
      //this.selectedTrigContext = 0;
      this.intentExampleId = 0;
      this.getExamples(this.intentId);
      this.isEditingExample = false;
      this.generateJSONFile();
    });
  }

  confirmExampleDelete (example) {
    if (typeof example === "undefined") {
      //close modal in case there is no connector selected
      $("#mdlDeleteExample").modal('hide');
    }
    else {
      this.intentExampleId = example.id;
      this.deleteEx_message = {};
      this.deleteEx_message.title = `Delete Example ${example.id}?`;
      this.deleteEx_message.content = `You are about to delete the example that contains the text ${example.example_text}.\r\nBeware you cannot undo this action, do you wish to proceed?`;
      $("#mdlDeleteExample").modal('show');
    }
  }


  getExamples(intent_id) {
    try {
      //clearing values
      this.intentExamples = [];
      this.intentExampleCount = 0;
      //this.selectedTrigContext = this.context_list[0];
      this.api.getIntentExampleCount(intent_id).then(numberOfRecords => {
        this.intentExampleCount = numberOfRecords;
        this.hasExamples = true;
        if(this.numberOfRecords <= 0) {
          this.countLabel = "The selected intent has no examples";
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
            this.api.getIntentExamples(intent_id,inf_limit,sup_limit).then(response => {
              //getting all the contacts from the logged Messages
              for(let n = 0;n<response.examples.length;n++) {
                let record = response.examples[n];
                this.addExampleToTable(
                  record.id,
                  intent_id,
                  record.example_text
                  //record.triggered_context
                );
              }
              this.intentExampleCount = this.intentExamples.length;
              this.hasExamples = true;
            });
          }
        }
      });
    }
    catch(err) {
      console.log(err);
    }
  }
  addExampleToTable(id,intent_id,example_text) {
    try{
      /*
      let contextId = null;
      let contextName = "No Context";
      if (!(triggered_context == 'null')) {
        contextId = triggered_context;
        contextName = this.exampleContextList.filter(x => x.id == triggered_context)[0].name;
      }
      let record = { id:'', intent_id:'', example_text:'', triggered_context:''};
      */
      let record = { id:'', intent_id:'', example_text:''};
      record.id = id;
      record.intent_id = intent_id;
      record.example_text = example_text;
      //record.context_name = contextName;
      //record.triggered_context = contextId;
      this.intentExamples.push(record);
    }
    catch(err){
      console.log("error: " + err);
    }

  }

  generateJSONFile() {
    this.file_content = {
      rasa_nlu_data : {
        common_examples : [],
        regex_features : [],
        entity_synonyms : []
      }
    };
    this.exampleCount = 0;
    //adding Examples
    let i = 0;
    for (i=0;i<this.intentList.length;i++){
      //getting the intent
      let intent = this.intentList[i];
      //getting the Examples
      this.api.getIntentExampleCount(intent.id).then(numberOfRecords => {
        if(numberOfRecords <= 0) { }
        else {
          let nPetitions = (numberOfRecords / 50) +1;
          if (nPetitions == 0) { nPetitions = 1; }
          for(let iteration = 0; iteration < nPetitions;iteration++) {
            let inf_limit = this.recordsPerPetition * iteration;
            let sup_limit = inf_limit + this.recordsPerPetition;
            this.api.getIntentExamples(intent.id,inf_limit,sup_limit).then(response => {
              //getting all the contacts from the logged Messages
              for(let n = 0;n<response.examples.length;n++) {
                let record = response.examples[n];
                //creating the example structure
                let example = {
                  text:record.example_text,
                  intent:intent.name,
                  entities:[]
                }
                this.exampleCount++;
                if (this.exampleCount > 2){
                    this.intentsQualify = true;
                }
                else {
                  this.intentsQualify = false;
                }
                this.file_content.rasa_nlu_data.common_examples.push(example);
                //console.log(JSON.stringify(file_content));
              }
              this.api.createAIFile(this.selectedBotId, JSON.stringify(this.file_content));
            });
          }
        }
      });
    }
    return JSON.stringify(this.file_content);
  }

  generateTrainningFiles(){
    this.api.createAIConfigFile(this.selectedBotId, this.bot_language).then(res=>
      {
        this.api.setBotTrainStatus(this.selectedBotId).then(response=>
          {
            console.log(response.cont)
            if(response.cont=='ok')
            {
              toastr.success('The bot has been trained successfully!');
            }
            else
            {
              toastr.error('Something wrong has happened! See the log for more information.');
            }
          });
      });

    this.intentsQualify = false;
  }
  seelog()
  {
    this.api.getTrainLog(this.selectedBotId).then(response=>
      {
        this.textlogfile=response.cont
        //this.textlogfilevisible=true;
        this.delete_message = {};
        this.delete_message.title = `Log File`;
        this.delete_message.content = response.cont;
        $("#mdllogfile").modal('show');
      });
  }
  showRequest()
  {
    this.tableRequest=[];
    this.api.getAiRequests(this.selectedBotId).then(response=>
      {
        this.show_request=true;
        var r=response.cont;
        for(var i=0; i<r.length;i++)
        {
          let request={}
          request.user=r[i].owner;
          request.time=r[i].time;
          request.date=r[i].date;
          request.medium=r[i].medium;
          request.status=r[i].status;
          request.message=r[i].content;
          request.ai_response=r[i].ai_response;
          this.tableRequest.push(request);
        }
        this.tableRequest.sort(function(a, b) {
          return (a.date +a.time) - (b.date + b.time);
        });
      });

  }

}//END BotIntentManagment
