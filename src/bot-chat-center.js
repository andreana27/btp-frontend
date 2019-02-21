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
  showvar=false;
  loading=true;
  loading_mensaje=false;
  //petition package size
  recordsPerPetition = 100;
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
  messagesHTML = ' ';
  messageToClient='';
  unread=[];
  limite=0;
  json_Context;
  key='';
  values='';
  id_usuario='';
  keys1='';
  values1='';
  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
  }

  //attached functionallity
  attached(){    
    /*var posicion = $("#divfin").offset().top;
    var altura = $(document).height();
    console.log("altura:", altura,"posicion",posicion);
    $("#userchat").click(function(){
      console.log("altura:", altura*posicion);
      $("#final").animate({scrollTop:"20000px"});
    });*/

    //********************************************************************
    $(document).ready(function() {
       $('#a1').val("");
       $('#a2').val("");
            $('#btnAdd').click(function() {
                var num     = $('.clonedInput').length; // how many "duplicatable" input fields we currently have
                var newNum  = new Number(num + 1);      // the numeric ID of the new input field being added
                // create the new element via clone(), and manipulate it's ID using newNum value
                var newElem = $('#input' + num).clone().attr('id', 'input' + newNum);
                // manipulate the name/id values of the input inside the new element
                newElem.children(':first').attr('id', 'name' + newNum).attr('name', 'name' + newNum);
                // insert the new element after the last "duplicatable" input field
                $('#input' + num).after(newElem);
                $('#input' + num).val("");
                // enable the "remove" button
                console.log('add',num);
                if (num< 1){
                    $('#btnDel').attr('disabled','disabled');
                }else{
                  $("#btnDel").removeAttr('disabled');
                }
                // business rule: you can only add 5 names
                //if (newNum == 5)
                //    $('#btnAdd').attr('disabled','disabled');
            });
            $('#btnDel').click(function() {
                var num = $('.clonedInput').length; // how many "duplicatable" input fields we currently have
                $('#input' + num).remove();     // remove the last element
                console.log('delete',num);
                if (num-1 == 1){
                    $('#btnDel').attr('disabled','disabled');
                }else{
                  $("#btnDel").removeAttr('disabled');
                }
            });
            
        });
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
      this.loading=true;this.messagesHTML="";
      //setting the selected bot
      this.bot = this.bot_list.filter(x => x.id == this.selectedBotId)[0];
      //clearing values
      this.allRecords = [];
      this.tableRecords = [];
      this.totalRecords = 0;
      this.contactList = [];
      
      this.api.lookForMessages(this.selectedBotId).then(clients=>{//obtiene los datos de los usuarios
        this.unread=clients;
        this.selectedContactName = 'Select a contact';
        this.id_usuario='';
        this.showvar=false;
        this.botSelected = true;
        if(this.unread.length <=0){
          toastr.error('The selected bot has no users registered');
        }
      });      
      this.loading=false;
    }
    variablesUser(owner,userfb){//varaibles por usuario en bot_storage
      if (typeof userfb === "undefined"){
        this.selectedContactName ="";
      }else{
        this.selectedContactName =userfb; 
      }
      this.id_usuario =owner;
      this.selectedContactId =owner; 
      this.showvar=true;
      this.api.variablesByUsers(this.selectedBotId,owner).then(keysvalue => {
        this.key_list = keysvalue;
        this.lim=this.key_list.length;
        //console.log(this.key_list);
        if(this.key_list.length > 0){

          this.botSelected = true;
        }else {
          //this.botSelected = false;
          toastr.error('The selected bot has no variables registered');
        }
      });
    }
    removeVariable(owner,key,value){
      //console.log(owner,key,value);
      if((key=="" | key ==null | typeof key === "undefined")|(value==""||value==null || typeof value === "undefined")|
        (owner=="" | owner ==null | typeof owner === "undefined")){
        toastr.error('The variable is empty you did not select a user');
      }
      else{              
        this.api.deleteVariables(this.selectedBotId,owner,key,value).then(borrar => {
          this.resultado=borrar.data;
          if(this.resultado>0){
            toastr.success('The bot variable is deleted');
            //console.log(owner,this.selectedContactName);
            this.variablesUser(owner,this.selectedContactName);
          }else{
             toastr.error('The variable was not eliminated');
           }
        });
      }
    }
    updateVariable(owner,key,value){
      console.log(owner,key,value);
      if((key=="" | key ==null | typeof key === "undefined")|(value==""||value==null || typeof value === "undefined")|
        (owner=="" | owner ==null | typeof owner === "undefined")){
        toastr.error('The variable is empty or you did not select a user');
      }
      else{   
       this.api.updateVariables(this.selectedBotId,owner.trim(),key.trim(),value.trim()).then(borrar => {
        this.resultado=borrar.data;
        if(this.resultado>0 | this.resultado==null){
          toastr.success('The bot variable is updated');
          this.variablesUser(owner,this.selectedContactName);
        }else{
           toastr.error('The variable was not updated');
         }
      });
     }
     this.keys1="";this.values1="";
    }
    scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }
    conversations(owner,userfb,imagen){
      this.messagesHTML="";this.loading_mensaje=true;
      this.variablesUser(owner,userfb);

      //*****************************************************
      this.api.getBotMessageRecordCount(this.selectedBotId,owner).then(numberOfRecords => {//obtiene el numero de filas de la conversacion
        this.numberOfRecords = numberOfRecords;
        //this.botSelected = true;
        console.log("numeros conversacion",this.numberOfRecords);
        if(this.numberOfRecords <= 0) {
          alert("The selected bot has no logged messages");
        }
        else {
          //setting the number of petitions to make to the backend depending of the number of records of variables
          this.numberOfPetitions = this.toInteger(this.numberOfRecords / this.recordsPerPetition) + 1;
          if (this.numberOfPetitions == 0) {
            this.numberOfPetitions = 1;
          }
          console.log(this.numberOfPetitions);
          //start getting the records
          for(let iteration = 0; iteration < this.numberOfPetitions;iteration++) {
            let inf_limit = this.recordsPerPetition * iteration;
            let sup_limit = inf_limit + this.recordsPerPetition;
            //console.log("limites ",inf_limit,sup_limit);
            this.api.getBotMessages(this.selectedBotId,inf_limit,sup_limit,owner).then(recordList => {//obteiene las conversaciones
              //this.lis=recordList;

              //console.log('mensajes',this.lis);
              //getting all the contacts from the logged Messages
              for(let n = 0;n<recordList.length;n++) {
                let record = recordList[n];
                //console.log('mensajes',record);
                this.addRecord(
                  record.id,
                  record.storage_owner,
                  record.ctype,
                  record.ccontent,
                  record.origin,
                  record.medium,
                  record.message_date,
                  record.message_time,
                  record.content_type,
                  userfb,imagen
                );
                var chatBox = document.querySelector('#final');
              chatBox.scrollTop = chatBox.scrollHeight;
             console.log('height: ',chatBox.scrollHeight);
              }
              /*var messages = document.getElementById('#final');
      console.log(messages);*/
              
             /*var posicion = $("#divfin").offset().top;
              var altura = $(document).height();
              console.log("altura:", altura,"posicion",posicion);
              $("#userchat").click(function(){
                console.log("altura1:", altura*posicion);
                $("#final").animate({scrollTop:"50px"});
              });*/
              /*this.contactList.sort(function(x, y) {
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
              }*/
            });
         }
        }

      });
    }

    addRecord(id,owner,type,content,origin,medium,message_date,message_time,content_type,userfb,imagen) {
      //console.log(id,owner,type,content,origin,medium,message_date,message_time,content_type);
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
      record.userfb=userfb;
      record.imagen=imagen;
      //adding the Contacts
      //record.unread=this.unread.filter(x=>x.owner==owner)[0].chatcenter;
      if(origin=="bot"){
        record.userfb="bot";
        record.imagen="assets/images/logo-no-text.png";
      //adding the Contacts
      }else if(origin=="chatCenter"){
        record.userfb="chatCenter";
        record.imagen="assets/images/call-center.png";
      }
      
      //console.log('probando',record);
      /*let foundRecord = this.contactList.filter(x => x.id == owner)[0];

      if (!foundRecord) {*/
        //let contact = {id:owner,,userfb:this.unread.filter(x=>x.owner==owner)[0].userfb,imagen:record.imagen};
        //this.contactList.push(contact);
      //}
      //adding up the record to the table
      /*this.tableRecords.push(record);
      console.log('probando',this.tableRecords);*/
      //----------------------------------------------------------------------------
      this.appendHTMLMessage(
                    record.ctype,
                    record.owner,
                    record.origin,
                    record.ccontent,
                    record.date,
                    record.time,
                    record.content_type,
                    record.imagen
                  );
      this.loading_mensaje=false;

    }
    appendHTMLMessage(type, contact, origin, message, date, time,content_type,imagen) {
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
        this.messagesHTML += "<img src=\""+imagen+"\" alt=\"User Avatar\">"
        this.messagesHTML += '</span>'
        this.messagesHTML += '<div class="chat-body clearfix">';
        this.messagesHTML += '<div class="header">';
        this.messagesHTML += '<strong class="primary-font">' + origin + '</strong>';

      }
      else {
        /*var usuario=this.unread.filter(x=>x.owner==contact)[0].imagen;
        if (typeof usuario === "undefined"){
          usuario="assets/images/person_64.png";
        }*/
        //console.log("usuarios-foto: ",usuario);
        this.messagesHTML += '<li class="left clearfix">';
        this.messagesHTML += '<span class="chat-img pull-left">'
    		this.messagesHTML += "<img src=\""+imagen+"\" alt=\"User Avatar\">"
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
      //--------------------------------------------
      
    }
     //returns a list of messages for the selected contact
 /*   getMessagerByContact(contact) {
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
    }*/

    sendMessage(mensaje)
    {
      console.log('SEND: ',this.selectedContactId,mensaje);//owner
       var message = mensaje//document.querySelector('#message');
      //if (this.client=='messenger') {
        //validacion de que los campos no vengan vacios
        /*this.api.sendMessageToMessenger(this.selectedBotId,this.selectedContactId,mensaje).then(response=>{
          console.log(response.cont);*/
          //*********************************************************************
          let message_html = '<p>'+ message+'</p>';
          let mhtml="";
          mhtml += '<li class="right clearfix">';
          mhtml += '<span class="chat-img pull-right">';
          mhtml += '<img src="assets/images/call-center.png" alt=\"User Avatar\">';
          mhtml += '</span>';
          mhtml += '<div class="chat-body clearfix">';
          mhtml += '<div class="header">';
          mhtml += '<strong class="primary-font">chatCenter</strong>';
          mhtml += '<small class="pull-right text-muted"><i class="fa fa-clock-o"></i> fecha y hora </small>';
          mhtml += '</div>';
          mhtml += message_html;//
          mhtml += '</div>';
          mhtml += '</li>';
          //*********************************************************************
          var chatBox = document.querySelector('#final');
          var node = document.createElement("LI");
          var textnode=document.createTextNode(message);
          //textnode.node.innerHTML = mhtml;//
          node.appendChild(textnode);
          document.getElementById("lista").appendChild(node);


          chatBox.scrollTop = chatBox.scrollHeight;
          //validacion de que la respuesta sea status 200

          /*this.tableRecords = [];
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
          this.loading=false;*/
        //});
        this.messageToClient='';
      /*}
      else
      { //mensaje de Broadcast revisarlo mas adelante
        console.log('intentando Broadcast');
        this.api.sendMessageToBroadcast(this.selectedBotId,this.messageToClient).then(response=>
          {
            console.log(response);
          });
      }*/
    }
    /*endChat()
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