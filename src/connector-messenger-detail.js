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
  ConnectorMessenger
} from './connector-messenger';
import {
  ConnectorViewed,
  ConnectorUpdated,
  ConnectorCreated,
  ConnectorDeleted,
  BotViewed,
  BotUpdated
} from './messages';
import * as toastr from 'toastr';


@inject(ConnectorMessenger, WebAPI, EventAggregator)
export class ConnectorMessengerDetail {
  constructor(messengerConnectors, api, ea){
    this.messengerConnectors = messengerConnectors;
    this.api = api;
    this.ea = ea;
    ea.subscribe(BotViewed, msg => this.select(msg.bot));
    this.suscriptions = [];
    this.edit=false;
  }

  attached()
  {
    this.suscriptions.push(this.ea.subscribe(ConnectorDeleted, msg => {
      //toastr.warning(`Token ${msg.connector.token} deleted.`);
    }));
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.connectorType = 'messenger';
    this.api.getConnectorList(this.bot.id,'messenger').then(conn=>{
        if(conn.length>0&!this.edit){
          this.existcon= true}
        else {
          this.existcon=false;}
    });
    if (params.token != null)
    {
      return this.messengerConnectors.getConnectorDetails(params.token).then(connector => {
        this.connector = connector;
        //this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalConnector = JSON.parse(JSON.stringify(connector));
        //changes are publised
        this.ea.publish(new ConnectorViewed(this.connector));
        this.existcon=false;
        this.edit=true;

      });
    }
  }

  //function that checks that the connector values are good to go for saving
  get canSave() {
    // in case of a new connector validations are skipped
    if(this.connector != null)
    {
      return this.connector.token && this.connector.challenge && this.connectorType && !this.api.isRequesting;
    }
    return false;
  }

  //function for save/update a connector
  save() {
    this.api.getConnectorList(this.bot.id,'messenger').then(connectors =>
      {
        this.existcon=true;
        if(connectors.length>0)
        {
          if(!this.messengerConnectors.existsConnector(this.connector.token))
          {
            toastr.error('You must select the connector if you want to change it.')
          }
          else
          {
            toastr.warning('The connector has been modify');
            this.messengerConnectors.save(this.connector.token,this.connector.challenge);
            this.clearform();
          }

        }
        else
        {
          toastr.success('The connector has been created!');
          this.messengerConnectors.save(this.connector.token,this.connector.challenge);
          this.clearform();

        }
      });
      }

  //function for deleting an existing connector
  delete() {
    if(this.delete_message.option=='Delete')
    {
      this.api.deleteMessengerConnector(this.bot.id,this.connector.token).then(status=>
        {
          this.messengerConnectors.delete(this.connector.token);

          this.ea.publish(new ConnectorDeleted(this.connector));
          this.clearform();
        });

    }
  }


  confirmdelete(){

    if (typeof this.connector === "undefined") {
      //close modal in case there is no connector selected
      this.delete_message = {};
      this.delete_message.option='OK'
      this.delete_message.title = `Error`;
      this.delete_message.content = `You have to select the connector you want to delete!`;
      $(this.mdlDeleteConnector).modal('open');
    }
    else {
      if (this.messengerConnectors.existsConnector(this.connector.token))
      {
        this.delete_message = {};
        this.delete_message.option='Delete'
        this.delete_message.title = `Delete Token ${this.connector.token}?`;
        this.delete_message.content = `
        You are about to delete the connector with token value: ${this.connector.token}.
        This can't be reversed.
        Continue?`;
        $(this.mdlDeleteConnector).modal('open');
      }
      else {
        this.delete_message = {};
        this.delete_message.option='OK'
        this.delete_message.title = `Error`;
        this.delete_message.content = `You have to select the connector you want to delete!`;
        $(this.mdlDeleteConnector).modal('open');

      }
    }
  }

  //function that clears the form controls
  clearform() {
    if(this.connector != null){
      this.connector.token="";
      this.connector.challenge="";
    }
  }

  //function for selected the selected bot
  select(bot) {
    this.bot = bot;
    return true;
  }

}
