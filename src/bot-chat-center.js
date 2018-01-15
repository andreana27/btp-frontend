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
export class BotChatCenter {
  //Local variables
  selectedBotId = [];
  //bool indicator enables the bot variable table
  botSelected = false;
  //petition package size
  recordsPerPetition = 50;
  //list of contacts
  contactList = [];
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
  contactGroup = 'All Contacts';
  channel = '';
  //
  selectedContactName = 'Select a Contact';
  selectedContactId = '';
  //
  messagesHTML = 'Select a contact';

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
      return this.api.getBotsList().then(bots => {
        this.bot_list = bots
        this.selectedBotId = this.bot_list[0].id;
        this.api.getBotDetails(this.selectedBotId).then(bot => {
          this.bot = bot;
          this.getChats();
        });
      });
      //this.filters = [{value: '', keys: ['owner']}];
    }
    //------------------------
    //User defined funtcions
    //------------------------
    getChats() {
      //setting the selected bot
      this.bot = this.bot_list.filter(x => x.id == this.selectedBotId)[0];
      //clearing values
      this.allRecords = [];
      this.tableRecords = [];
      this.totalRecords = 0;
      this.contactList = [];
      this.messagesHTML = 'Select a contact';
      this.api.getBotMessageRecordCount(this.selectedBotId).then(numberOfRecords => {
        this.numberOfRecords = numberOfRecords;
        this.botSelected = true;
        if(this.numberOfRecords <= 0) {
          alert("The selected bot has no logged messages");
        }
        else {
          //setting the number of petitions to make to the backend depending of the number of records of variables
          this.numberOfPetitions = this.toInteger(this.numberOfRecords / this.recordsPerPetition) + 1;
          if (this.numberOfPetitions == 0) {
            this.numberOfPetitions = 1;
          }
          //start getting the records
          for(let iteration = 0; iteration < this.numberOfPetitions;iteration++) {
            let inf_limit = this.recordsPerPetition * iteration;
            let sup_limit = inf_limit + this.recordsPerPetition;
            this.api.getBotMessages(this.selectedBotId,inf_limit,sup_limit).then(recordList => {
              //getting all the contacts from the logged Messages
              for(let n = 0;n<recordList.length;n++) {
                let record = recordList[n];
                this.addRecord(
                  record.id,
                  record.storage_owner,
                  record.ctype,
                  record.ccontent,
                  record.origin,
                  record.medium,
                  record.message_date,
                  record.message_time,
                  record.content_type
                );
              }
              this.totalRecords = this.tableRecords.length;
              this.hasRecords = true;
            });
          }
        }
      });
    }

    addRecord(id,owner,type,content,origin,medium,message_date,message_time,content_type) {
      let record = { id:'', owner:'', ctype:'', ccontent:'',origin:'',channel:'',date:'',time:''};
      //setting the owner
      record.owner = owner;
      record.id = id;
      record.ctype = type;
      record.ccontent = content;
      record.origin = origin;
      record.channel = medium;
      record.date = message_date;
      record.time = message_time;
      record.content_type = content_type;
      //adding the Contacts
      let foundRecord = this.contactList.filter(x => x.id == owner)[0];
      if (!foundRecord) {
        let contact = {id:owner};
        this.contactList.push(contact);
      }
      //adding up the record to the table
      this.tableRecords.push(record);
    }

    //returns a list of messages for the selected contact
    getMessagerByContact(contact) {
      this.selectedContactId = contact;
      //setting the name of the contact
      this.selectedContactName = contact;
      //clearing values
      this.messagesHTML = '';
      //setting up the message channel filters
      if (this.hasRecords) {
        //if there are any records they are grouped by contact
        let currentRowPosition = 0;
        for (currentRowPosition; currentRowPosition < this.totalRecords; currentRowPosition++) {
          if (this.tableRecords[currentRowPosition].owner == contact) {
            //checking for the message Channel
            if (this.channel == '') {
                this.appendHTMLMessage(
                  this.tableRecords[currentRowPosition].ctype,
                  this.tableRecords[currentRowPosition].owner,
                  this.tableRecords[currentRowPosition].origin,
                  this.tableRecords[currentRowPosition].ccontent,
                  this.tableRecords[currentRowPosition].date,
                  this.tableRecords[currentRowPosition].time,
                  this.tableRecords[currentRowPosition].content_type,
                );
            }
            else
            {
                if (this.tableRecords[currentRowPosition].channel == this.channel) {
                  this.appendHTMLMessage(
                    this.tableRecords[currentRowPosition].ctype,
                    this.tableRecords[currentRowPosition].owner,
                    this.tableRecords[currentRowPosition].origin,
                    this.tableRecords[currentRowPosition].ccontent,
                    this.tableRecords[currentRowPosition].date,
                    this.tableRecords[currentRowPosition].time,
                    this.tableRecords[currentRowPosition].content_type
                  );
                }
            }
          }
        }
      }
    }

    appendHTMLMessage(type, contact, origin, message, date, time,content_type) {
      let message_html = '<p>'+ message+'</p>';
      if (content_type == 'attachment')
      {
        message_html = '<img src="' + message + '" alt="recieved attachment" width="300" height="300">';
        message_html += '<a href="'+ message +'" target="_blank">View original</a> ';
      }
      if (message == '<repeat>')
      {
        message_html = 'flow repetition';
      }
      if (type == 'sent')
      {
        this.messagesHTML += '<li class="right clearfix">';
        this.messagesHTML += '<div class="chat-body clearfix">';
        this.messagesHTML += '<div class="header">';
        this.messagesHTML += '<strong class="primary-font">' + origin + '</strong>';

      }
      else {
        this.messagesHTML += '<li class="left clearfix">';
        this.messagesHTML += '<div class="chat-body clearfix">';
        this.messagesHTML += '<div class="header">';
        this.messagesHTML += '<strong class="primary-font">' + origin + '</strong>';
      }
      this.messagesHTML += '<small class="pull-right text-muted"><i class="fa fa-clock-o"></i> ' + date + ' ' + time + '</small>';
      this.messagesHTML += '</div>';
      this.messagesHTML += message_html;//
      this.messagesHTML += '</div>';
      this.messagesHTML += '</li>';
    }

    getContactsByChannel() {
      //clearing the array
      this.contactList = [];
      //searching the records for matches
      let currentRowPosition = 0;
      for (currentRowPosition; currentRowPosition < this.totalRecords; currentRowPosition++) {
        if(this.channel == '') {
          let contactId = this.tableRecords[currentRowPosition].owner;
          //checking for the message Channel
          if (this.contactList.length == 0) {
            let contact = {id:contactId};
            this.contactList.push(contact);
          }
          else
          {
            let foundRecord = this.contactList.filter(x => x.id == contactId)[0];
            if (!foundRecord) {
              let contact = {id:contactId};
              this.contactList.push(contact);
            }
          }
        }
        else {
          if (this.tableRecords[currentRowPosition].channel == this.channel) {
            //get the contactId
            let contactId = this.tableRecords[currentRowPosition].owner;
            //checking for the message Channel
            if (this.contactList.length == 0) {
              let contact = {id:contactId};
              this.contactList.push(contact);
            }
            else
            {
              let foundRecord = this.contactList.filter(x => x.id == contactId)[0];
              if (!foundRecord) {
                let contact = {id:contactId};
                this.contactList.push(contact);
              }
            }
          }
        }
      }
    }

    setChannel(channelId) {
      switch(channelId) {
        case 0:
          this.channel = '';
          this.contactGroup = 'All Contacts';
          break;
        case 1:
          this.channel = 'messenger';
          this.contactGroup = this.channel + ' Contacts';
          break;
        case 2:
          this.channel = 'telegram';
          this.contactGroup = this.channel + ' Contacts';
          break;
      }

      this.messagesHTML = 'Select a Contact';
      this.getContactsByChannel();
      //this.getMessagerByContact(this.selectedContactId);
    }
    toInteger(number){
      return Math.round(  // round to nearest integer
        Number(number)    // type cast your input
      );
    };
}
