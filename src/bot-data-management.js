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
  filters = [];
  //
  filteredRecords = [];
  //
  allRecords = [];

  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
  }

  //attached functionallity
  attached(){
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
      //clearing values
      this.allRecords = [];
      this.tableRecords = [];
      this.totalRecords = 0;
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
                  this.allRecords = this.tableRecords;
                  this.totalRecords = this.tableRecords.length;
                  //Setting up the dynamics filter settings
                  this.filters = [{ key:'owner', value:''}];
                  for (let x = 0; x < this.variable_list.length; x++) {
                    let filter = { key:'', value:''};
                    filter.key = ['vars['+x.toString()+'].value'];
                    this.filters.push(filter);
                  }
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
    downloadVariables()
    {
      var CsvString = "owner";
      for(var i=0; i<this.tableRecords.length;i++)
      {
        for(var j=0 ; j<this.tableRecords[i].vars.length;j++)
        {
          if(i==0&j==0)
          {
            for(var k=0 ; k<this.tableRecords[0].vars.length;k++)
            {
              CsvString+=','+this.tableRecords[0].vars[k].key;
            }
            CsvString+='\r\n';
          }
          if(j==0)
          {
            CsvString+=this.tableRecords[i].owner;
          }
          CsvString+=','+this.tableRecords[i].vars[j].value;
        }
        CsvString+="\r\n";
      }
      //this.tableRecords.forEach(function(RowItem, RowIndex) {
        //RowItem.forEach(function(ColItem, ColIndex) {
          //CsvString += ColItem + ',';
        //});
        //CsvString += "\r\n";
      //});
      console.log(CsvString);
      CsvString = "data:application/csv," + encodeURIComponent(CsvString);
      var x = document.createElement("A");
      x.setAttribute("href", CsvString );
      x.setAttribute("download","Bot_"+this.selectedBotId+"_Variables.csv");
      document.body.appendChild(x);
      x.click();
    }

    //Filter the existing records in accordance to the selected row and entered value
    filterRecords(){
      //clearing the records
      this.tableRecords = [];
      let searchTable = this.allRecords;
      let resultsTable = [];
      //for every column
      for (let i = 0; i < this.filters.length; i++) {
        //getting the filter value
        let filterValue = this.filters[i].value.toLowerCase();
        // for every row
        for (let j = 0; j < searchTable.length; j++){
          let propertyValue;
          if (i == 0) { propertyValue = searchTable[j].owner.toLowerCase(); } //search by owner
          else { propertyValue = searchTable[j].vars[i - 1].value.toLowerCase(); } //search by variable
          //in case the value introduced by the user starts with = , a full match comparisson is made
          if (filterValue.startsWith("=")) {
            if (filterValue.length > 1) {
              //if it is an exact match the row is added to the resultsTable
              if (propertyValue === filterValue.substr(1)) {
                resultsTable.push(searchTable[j]);
              }
            }
            else {
              resultsTable.push(searchTable[j]);
            }
          } else {
            if(propertyValue.indexOf(filterValue)!=-1) {  //if there is any match
              resultsTable.push(searchTable[j]);
            }
          }
        }
        searchTable = resultsTable;
        resultsTable = [];
      }
      this.tableRecords = searchTable;
      //setting the new table lenght
      this.totalRecords = this.tableRecords.length;
    }

    toInteger(number){
      return Math.round(  // round to nearest integer
        Number(number)    // type cast your input
      );
    };
}
