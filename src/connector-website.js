import { WebAPI } from './web-api';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BotViewed, BotUpdated, ConnectorUpdated } from './messages';
import { Router } from 'aurelia-router';


@inject(WebAPI, EventAggregator,Router)
export class ConnectorWebsite {
  //selected/new connector
  connector = {website:null,token:null, type:'website'};
  //list of connectors
  connector_list = [];
  //flag
  isEditing = false;
  //constructor function for the BotConnectorSetup class
  constructor(api, ea, router) {
    this.api = api;
    this.ea = ea;
    this.router = router;
    this.connectortype = 'website';
    ea.subscribe(BotViewed, msg => this.select(msg.bot));
  }

  //function called when the page is created
  created() {
    this.getConnectorList();
  }

  getConnectorList()
  {
    //gets the connectors list
    return this.api.getConnectorList(this.bot.id,'website').then(connectors => {
      this.connector_list = connectors;
      this.connector.website = null;
      this.connector.token = null;
    });
  }

  getConnectorDetails(token)
  {
    if (this.bot.connectors != null)
    {
      return new Promise(resolve => {
          let connector = this.bot.connectors.filter(x => x.token == token)[0];
          resolve(connector);
          this.isRequesting = false;
      });
    }
    //returns empty case not
    return [];
  }


  get canSaveConnector()
  {
    return this.connector.website && this.connectortype && !this.api.isRequesting;
  }

  saveConnector()
  {
    let parameters = {bot_id: this.bot.id,website: this.connector.website}
    if(this.isEditing == false) {
        this.api.saveWebsiteConnector(parameters).then (response => {
          //getting the generated token
          this.connector.token = response.WebToken;
          //checking if the bot has connectors already
          if (this.bot.connectors === null) {
            //if there are no connectors the connector array of the bot is created
            this.bot.connectors = [];
          }
          //checking if the connector already exists
          let exists = this.bot.connectors.filter(x => x.token == this.connector.token)[0];
          let index = this.bot.connectors.length;
          if(exists){
            //if the connector exists the value is updated
            index = this.bot.connectors.indexOf(exists);
            this.bot.connectors[index] = this.connector;
          }else{
            this.bot.connectors.push(this.connector);
            index = this.bot.connectors.indexOf(this.connector);
          }
          //calling backend to update the bots connectors array
          this.api.saveBot(this.bot).then(bot => {
            this.bot = bot;
            this.api.activateConnector(this.bot.id, index).then(r => {
              this.ea.publish(new BotUpdated(this.bot));
              this.ea.publish(new ConnectorUpdated(this.connector));
            })
            //getting the new list of connectors
            this.getConnectorList();
          });
      });
    }
    else {
       parameters = {bot_id: this.bot.id,website: this.connector.website, token: this.connector.token};
       this.api.updateWebsiteConnector(parameters).then (response => {
         //calling backend to update the bots connectors array
         //checking if the connector already exists
         let exists = this.bot.connectors.filter(x => x.token == this.connector.token)[0];
         let index = this.bot.connectors.length;
         if(exists){
           //if the connector exists the value is updated
           index = this.bot.connectors.indexOf(exists);
           this.bot.connectors[index] = this.connector;
         }else{
           this.bot.connectors.push(this.connector);
           index = this.bot.connectors.indexOf(this.connector);
         }
         //calling backend to update the bots connectors array
         this.api.saveBot(this.bot).then(bot => {
           this.bot = bot;
           this.api.activateConnector(this.bot.id, index).then(r => {
             this.ea.publish(new BotUpdated(this.bot));
             this.ea.publish(new ConnectorUpdated(this.connector));
           })
           this.isEditing = false;
           //getting the new list of connectors
           this.getConnectorList();
         });
       });
    }//end else
  }

  //get the selected connector and set's it up to view/edit
  editConnector(token) {
    this.connector = this.bot.connectors.filter(x => x.token == token)[0];
    this.isEditing = true;
  }

  deleteConnector() {
    if (this.bot.connectors === null)
    {
      this.bot.connectors = [];
    }
    let exists = this.bot.connectors.filter(x => x.token == this.connector.token)[0];
    if(exists){
      var index = this.bot.connectors.indexOf(exists);
      this.bot.connectors.splice(index,1);
      this.api.saveBot(this.bot).then(bot => {
        this.bot = bot;
        this.ea.publish(new BotUpdated(this.bot));
        this.ea.publish(new ConnectorUpdated(this.connector));
        let parameters = {bot_id: this.bot.id,website: this.connector.website, token: this.connector.token};
        this.api.deleteWebsiteConnector(parameters);
        this.getConnectorList();
      });//saveBot end
    }
    else {
      ///
    }
  }

  confirmDelete(token){
    this.connector = this.bot.connectors.filter(x => x.token == token)[0];
    if (typeof this.connector === "undefined") {
      //close modal in case there is no connector selected
      $("#modal-danger").modal('hide');
    }
    else {
      let exists = this.bot.connectors.filter(x => x.token == this.connector.token)[0];
      if(exists) {
        this.delete_message = {};
        this.delete_message.title = `Delete Token ${this.connector.token}?`;
        this.delete_message.content = `
        You are about to delete the connector with token value: ${this.connector.token}.
        This can't be reversed.
        Continue?`;
        $("#modal-danger").modal('show');
        //$(this.mdlDeleteConnector).modal('open');
      }
      else {
        $("#modal-danger").modal('hide');
        //$(this.mdlDeleteConnector).modal('hide');
      }
    }
  }
  /*
  save(token) {
    if (this.bot.connectors === null)
    {
      this.bot.connectors = [];
    }
    //creating a new array element for the connectors array
    let newConnector = {"token" : token, "type": 'website'};
    //checking if the connector already exists
    let exists = this.bot.connectors.filter(x => x.token == token)[0];
    let index = this.bot.connectors.length;
    if(exists){
      //if the connector exists the value is updated
      index = this.bot.connectors.indexOf(exists);
      this.bot.connectors[index] = newConnector;
    }else{
      this.bot.connectors.push(newConnector);
      index = this.bot.connectors.indexOf(newConnector);
    }
    //calling backend to update the bots connectors array
    this.api.saveBot(this.bot).then(bot => {
      this.bot = bot;
      this.api.activateConnector(this.bot.id, index).then(r => {
        this.ea.publish(new BotUpdated(this.bot));
        this.ea.publish(new ConnectorUpdated(newConnector));
      })
    });
  }
*/

  //
  existsConnector(token) {
    if (this.bot.connectors === null)
    {
      return false;
    }
    //checking if the connector already exists
    let exists = this.bot.connectors.filter(x => x.token == token)[0];
    if(exists){
      return true;
    }
    return false;
  }

  //function called when the view is activated
  activate(params) {
      return this.api.getBotDetails(params.id).then(bot => {
        //get the bot from the function
        this.bot = bot;
        //this.routeConfig.navModel.setTitle(bot.firstName);
        this.originalBot = JSON.parse(JSON.stringify(bot));
        //publishing the viewed bot
        this.ea.publish(new BotViewed(this.bot));
      });
    }

    //set the selected bot
    select(bot) {
      this.bot = bot;
      return true;
    }
    //returns to bot flow
    closeConnectorPane(){
      let bot = this.bot.id;
      this.router.navigateToRoute('bot-flow', { 'id': bot }, // route parameters object
              { trigger: true, replace: true }); // options
    }
}
