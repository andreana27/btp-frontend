import {
  WebAPI
} from './web-api';
import {
  inject, customElement, bindable
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';
import {
  TableFilterUpdated
} from './messages';
import $ from 'jquery';
import * as toastr from 'toastr';

@customElement('tag-it')
@inject(WebAPI, EventAggregator)
export class BotChatCenter {

   @bindable tags;
  @bindable id = '';
  @bindable name;
  @bindable options = {};

  //Local variables
  selectedBotId = [];
  //bool indicator enables the bot variable table
  botSelected = false;
  loading=true;
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
  messageToClient='';
  unread=[];
  limite=0;
  json_Context;
  key='';
  values='';
  id_usuario='';
  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
  }

  //attached functionallity
  attached(){    
    var posicion = $("#divfin").offset().top;
    var altura = $(document).height();
    console.log("altura:", altura);
    $("#userchat").click(function(){
      /*var altura = $('#final').height();*/
      console.log("altura:", altura*posicion);
      $("#final").animate({scrollTop:(altura*posicion)+"px"});
    });

    //$("#cambiar").load("#cambiar")
  }

  //Function gets called whenever the class is created
  created() {
  }
  additem(type){
    var newElement = {};

    var prom = new Promise(function(accept, reject){accept();});

      newElement.type = type;
      newElement.key = this.key;
      newElement.values = this.values;
      this.key='';
      this.values='';
     // toastr.success('element added');
      this.json_Context[this.key].push(newElement);

      //console.log(JSON.stringify(this.json_Context));
      this.context.context_json = JSON.stringify(this.json_Context);
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
      this.botSelected = false;
      this.loading=true;
    //document.getElementById('final').scrollIntoView(false);
      //setting the selected bot
      this.bot = this.bot_list.filter(x => x.id == this.selectedBotId)[0];
      //clearing values
      this.allRecords = [];
      this.tableRecords = [];
      this.totalRecords = 0;
      this.contactList = [];
      this.messagesHTML = 'Select a contact';
      this.api.lookForMessages(this.selectedBotId).then(clients=>{//obtiene los datos de los usuarios
        this.unread=clients;
        if(this.unread.length <=0){
          toastr.error('The selected bot has no users registered');
        }
      });
      this.api.getBotMessageRecordCount(this.selectedBotId).then(numberOfRecords => {//obtiene el numero de filas de la conversacion
        this.numberOfRecords = numberOfRecords;
        this.botSelected = true;
        console.log("numeros conversacion",this.numberOfRecords);
        if(this.numberOfRecords <= 0) {
          alert("The selected bot has no logged messages");
        }
        else {
          //setting the number of petitions to make to the backend depending of the number of records of variables
          /*this.numberOfPetitions = this.toInteger(this.numberOfRecords / this.recordsPerPetition) + 1;
          if (this.numberOfPetitions == 0) {
            this.numberOfPetitions = 1;
          }
          //start getting the records
          for(let iteration = 0; iteration < this.numberOfPetitions;iteration++) {
            let inf_limit = this.recordsPerPetition * iteration;
            let sup_limit = inf_limit + this.recordsPerPetition;
            //console.log("limites ",inf_limit,sup_limit);
            this.api.getBotMessages(this.selectedBotId,inf_limit,sup_limit).then(recordList => {//obteiene las conversaciones
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
              this.contactList.sort(function(x, y) {
              return (x.unread === y.unread)? 0 : x.unread? -1 : 1;
              });
              this.totalRecords = this.tableRecords.length;
              this.hasRecords = true;
              let contact = {id:'Broadcast',unread:true,userfb:'',imagen:"assets/images/person_64.png"};
              this.unread.push({owner:'Broadcast',chatcenter:true})
              if(!this.contactList.filter(x=>x.id=='Broadcast')[0])
              {
                this.contactList.unshift(contact);
                this.unread.push({owner:'Broadcast',chatcenter:true});
              }
            });
         }*/
        }
        this.loading=false;
      });
    }
    variablesUser(owner,userfb){//varaibles por usuario en bot_storage
      if (typeof userfb === "undefined"){
        this.selectedContactName ="";
      }else{
        this.selectedContactName =userfb; 
      }
      this.id_usuario =owner; 
      this.api.variablesByUsers(this.selectedBotId,owner).then(keysvalue => {
        this.key_list = keysvalue;
        console.log(this.key_list);
        if(this.key_list.length > 0){

          this.botSelected = true;
        }else {
          //this.botSelected = false;
          toastr.error('The selected bot has no variables registered');
        }
      });
    }
    removeVariable(owner,key,value){
      console.log(owner,key,value);
       this.api.deleteVariables(this.selectedBotId,owner.trim(),key.trim(),value.trim()).then(borrar => {
        this.resultado=borrar.data;
        if(this.resultado>0){
          toastr.success('The bot variable is deleted');
        }else{
           toastr.error('The variable was not eliminated');
         }
      });
    }
    addVariable(owner,key,value){
      console.log(owner,key,value);
       this.api.insertVariables(this.selectedBotId,owner.trim(),key.trim(),value.trim()).then(borrar => {
        this.resultado=borrar.data;
        if(this.resultado>0){
          toastr.success('The bot variable is added');
        }else{
           toastr.error('The variable was not added');
         }
      });
    }
/*
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
      record.unread=this.unread.filter(x=>x.owner==owner)[0].chatcenter;
      record.userfb=this.unread.filter(x=>x.owner==owner)[0].userfb;
      record.imagen=this.unread.filter(x=>x.owner==owner)[0].imagen;
      //adding the Contacts
      console.log('probando',record.unread);
      let foundRecord = this.contactList.filter(x => x.id == owner)[0];

      if (!foundRecord) {
        let contact = {id:owner,unread:this.unread.filter(x=>x.owner==owner)[0].chatcenter,userfb:this.unread.filter(x=>x.owner==owner)[0].userfb,imagen:record.imagen};
        this.contactList.push(contact);
      }
      //adding up the record to the table
      this.tableRecords.push(record);
    }

    //returns a list of messages for the selected contact
    getMessagerByContact(contact) {
      this.selectedContactId = contact;
      //setting the name of the contact
      this.selectedunread=this.unread.filter(x=>x.owner==contact)[0].chatcenter;
      //console.log("holi ",this.unread.filter(x=>x.owner==contact)[0]);
      var usuario=this.unread.filter(x=>x.owner==contact)[0].userfb;
      if (typeof usuario === "undefined"){
        usuario="";
      }
      this.selectedContactName =usuario+"<br>"+contact; //contact;
      //clearing values
      this.messagesHTML = '';
      //setting up the message channel filters
      if (this.hasRecords) {
        //if there are any records they are grouped by contact
        let currentRowPosition = 0;
        for (currentRowPosition; currentRowPosition < this.totalRecords; currentRowPosition++) {
          if (this.tableRecords[currentRowPosition].owner == contact) {
            //checking for the message Channel
            this.client=this.tableRecords[currentRowPosition].channel;
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
            }//tipos de channel
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
        message_html += '<a href="'+ message +'" target="_blank">View original</a>  '+message;
      }
      if (message == '<repeat>')
      {
        message_html = 'flow repetition';
      }
      if (type == 'sent')
      {
        this.messagesHTML += '<li class="right clearfix">';
        this.messagesHTML += '<span class="chat-img pull-right">'
        this.messagesHTML += '<img src="assets/images/logo-no-text.png" alt="User Avatar">'
        this.messagesHTML += '</span>'
        this.messagesHTML += '<div class="chat-body clearfix">';
        this.messagesHTML += '<div class="header">';
        this.messagesHTML += '<strong class="primary-font">' + origin + '</strong>';

      }
      else {
        var usuario=this.unread.filter(x=>x.owner==contact)[0].imagen;
        if (typeof usuario === "undefined"){
          usuario="assets/images/person_64.png";
        }
        //console.log("usuarios-foto: ",usuario);
        this.messagesHTML += '<li class="left clearfix">';
        this.messagesHTML += '<span class="chat-img pull-left">'
    		this.messagesHTML += "<img src=\""+usuario+"\" alt=\"User Avatar\">"
    	  this.messagesHTML += '</span>'
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

    refreshmsg()
    {
      this.loading=true;
      this.tableRecords = [];
      this.totalRecords = 0;
      this.api.getBotMessageRecordCount(this.selectedBotId).then(numberOfRecords => {
        this.numberOfRecords = numberOfRecords;
        this.botSelected = true;
        
        if(this.numberOfRecords <= 0) {
          alert("The selected bot has no logged messages");
        }
        else {
          //start getting the records
          let inf_limit = this.numberOfRecords-20;
          if(inf_limit<1)
          {
            inf_limit=0;
          }
          let sup_limit = this.numberOfRecords;
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
            this.getMessagerByContact(this.selectedContactId);
            this.messageToClient='';
          });

        }
        this.loading=false;
      });
    }

    sendMessage()
    {
      console.log(this.client);
      this.loading=true;
      /*console.log(this.selectedContactId);
      if(this.selectedContactId=='Broadcast')
      {
        this.client=this.selectedContactId;
      }*//*
      if(this.client=='telegram')
      {
        this.api.sendMessageToTelegram(this.selectedBotId,this.selectedContactId,this.messageToClient).then(response=>{
          this.refreshmsg();
          //this.getMessagerByContact(this.selectedContactId);
        });
      }
      else if (this.client=='messenger') {
        this.api.sendMessageToMessenger(this.selectedBotId,this.selectedContactId,this.messageToClient).then(response=>{
          this.tableRecords = [];
          this.totalRecords = 0;
          this.api.getBotMessageRecordCount(this.selectedBotId).then(numberOfRecords => {
            this.numberOfRecords = numberOfRecords;
            this.botSelected = true;
            
            if(this.numberOfRecords <= 0) {
              alert("The selected bot has no logged messages");
            }
            else {
              //start getting the records
              let inf_limit = this.numberOfRecords-20;
              if(inf_limit<1)
              {
                inf_limit=0;
              }
              let sup_limit = this.numberOfRecords;
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
                this.getMessagerByContact(this.selectedContactId);
                this.messageToClient='';
              });

            }
          });
          this.loading=false;
        });
      }
      else
      { //mensaje de Broadcast revisarlo mas adelante
        /*console.log('intentando Broadcast');
        this.api.sendMessageToBroadcast(this.selectedBotId,this.messageToClient).then(response=>
          {
            console.log(response);
          });*//*
      }
    }
    endChat()
    {
      this.api.endChatCenter(this.selectedBotId,this.selectedContactId).then(response=>{
          this.unread.filter(x=>x.owner==this.selectedContactId)[0].chatcenter=false;
          this.contactList.filter(x=>x.id==this.selectedContactId)[0].unread=false;
          this.refreshmsg();
        });
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
    }*/
    toInteger(number){
      return Math.round(  // round to nearest integer
        Number(number)    // type cast your input
      );
    };
}