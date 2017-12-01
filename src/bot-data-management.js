import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';
import {
  TableFilterUpdated
} from './messages';


@inject(WebAPI, EventAggregator)
export class BotDataManagment {
  //Local variables
  selectedBotId = [];
  //bool indicator enables the bot variable table
  botSelected = false;
  //petition package size
  recordsPerPetition = 50;
  //owners list
  ownersList = [];
  //records array
  tableRecords = [];
  //pagination size
  pageSize = 10;
  totalRecords = 0;
  //filters settings
  tableFilters = [];

  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
    this.subscriptions = [];
  }

  //attached functionallity
  attached(){
    this.subscriptions.push(this.ea.subscribe(TableFilterUpdated, msg => {
      this.tableFilters = msg.filter;
    }));

  }
  //Function gets called whenever the class is created
  created() {
  }

  //Function gets called whenever the view is activated
  activate(routeConfig) {
      this.routeConfig = routeConfig;
      //getting the bot list
      return this.api.getBotsList().then(bots => this.bot_list = bots);
      //this.filters = [{value: '', keys: ['owner']}];
    }
    //------------------------
    //User defined funtcions
    //------------------------
    getVariables() {
      //
      this.api.getVariableList(this.selectedBotId).then(variable_list => {
        this.variable_list = variable_list;
        if(this.variable_list.length > 0)
        {
          this.botSelected = true;
          this.api.getVariableRecordsCount(this.selectedBotId).then(numberOfRecords => {
            this.numberOfRecords = numberOfRecords;
            if(this.numberOfRecords <= 0) {
              alert("The selected bot has no variables records");
            }
            else {
              //setting the number of petitions to make to the backend depending of the number of records of variables
              this.numberOfPetitions = this.toInteger(this.numberOfRecords / this.recordsPerPetition);
              if (this.numberOfPetitions == 0) {
                this.numberOfPetitions = 1;
              }
              //start getting the records
              for(let iteration = 0; iteration < this.numberOfPetitions;iteration++) {
                let inf_limit = this.recordsPerPetition * iteration;
                let sup_limit = inf_limit + this.recordsPerPetition;
                this.api.getBotVariablesRecords(this.selectedBotId,inf_limit,sup_limit).then(recordList => {
                  //getting a list of all the owners in the array
                  this.owners = recordList.map(owners => owners.storage_owner);
                  //adding to the list of owners
                  this.ownersList = this.ownersList.concat(this.owners);
                  //removing duplicates
                  this.ownersList = Array.from(new Set(this.ownersList));
                  //setting up the table of records
                  for(let n = 0;n<recordList.length;n++) {
                    let record = recordList[n];
                    this.addValueToTable(record.storage_owner,record.storage_key,record.storage_value);
                    //this.addRecord(record.storage_owner,record.storage_key,record.storage_value);
                  }
                  this.totalRecords = this.tableRecords.length;
                  this.tableFilters = [{ value:'', keys:['owner'] }];
                  //setting up the table Filters
                  for (let i = 0; i < this.variable_list.length; i++) {
                    let filter = { value:'', keys:'' };
                    filter.keys = ['vars['+i.toString()+'].value'];
                    this.tableFilters.push(filter);
                  }
                  this.ea.publish(new TableFilterUpdated(this.tableFilters));
                  this.hasRecords = true;
                });
              }
            }
          });
        } else {
          alert("The selected bot has no variables registered");
        }
      });//end api.getVariableList
    }//end getVariables

    addValueToTable(owner,key,value) {
      if(this.tableRecords.length > 0)
      {
        let foundRecord = this.tableRecords.filter(x => x.owner == owner)[0];
        if(foundRecord){
          let foundVariable = foundRecord.vars.filter(x => x.key == key)[0];
          //setting the found variable value
          foundVariable.value = value;
        } else {
          //creating a new owner
          let record = { owner:'',vars:[]};
          //setting the owner
          record.owner = owner;
          for(let step = 0; step < this.variable_list.length; step++) {
              let variable = { key:this.variable_list[step].storage_key,value:''};
              //variable is added to the collection of variables per owner
              record.vars.push(variable);
          }
          //search for the variable
          let foundVariable = record.vars.filter(x => x.key == key)[0];
          //setting the variable value
          foundVariable.value = value;
          //adding up the record to the table
          this.tableRecords.push(record);
        }
      }
      else {
        //if there are no records an empty record is created
        let record = { owner:'',vars:[]};
        //setting the owner
        record.owner = owner;
        //setting all the possible variables
        for(let step = 0; step < this.variable_list.length; step++) {
            let variable = { key:this.variable_list[step].storage_key,value:''};
            //variable is added to the collection of variables per owner
            record.vars.push(variable);
        }
        //search for the variable
        let foundVariable = record.vars.filter(x => x.key == key)[0];
        //setting the variable value
        foundVariable.value = value;
        //adding up the record to the table
        this.tableRecords.push(record);
      }
    }

    toInteger(number){
      return Math.round(  // round to nearest integer
        Number(number)    // type cast your input
      );
    };
}
