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
  ConnectorTelegram
} from './connector-telegram';
import {
  ConnectorViewed,
  ConnectorUpdated,
  ConnectorCreated,
  ConnectorDeleted,
  BotViewed,
  BotUpdated
} from './messages';
import * as toastr from 'toastr';


@inject(ConnectorTelegram, WebAPI, EventAggregator)
export class ConnectorTelegramDetail {
  constructor(telegramConnectors, api, ea){
    this.telegramConnectors = telegramConnectors;
    this.api = api;
    this.ea = ea;
    ea.subscribe(BotViewed, msg => this.select(msg.bot));
    this.suscriptions = [];
  }

  attached()
  {
    this.suscriptions.push(this.ea.subscribe(ConnectorDeleted, msg => {
      toastr.warning(`Token ${msg.connector.token} deleted.`);
    }));
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.connectorType = 'messenger';
    if (params.token != null)
    {
      return this.telegramConnectors.getConnectorDetails(params.token).then(connector => {
        this.connector = connector;
        //this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalConnector = JSON.parse(JSON.stringify(connector));
        //changes are publised
        this.ea.publish(new ConnectorViewed(this.connector));
      });
    }
  }

  //function that checks that the connector values are good to go for saving
  get canSave() {
    // in case of a new connector validations are skipped
    if(this.connector != null)
    {
      return this.connector.token && this.connectorType && !this.api.isRequesting;
    }
    return false;
  }

  //function for save/update a connector
  save() {
    this.telegramConnectors.save(this.connector.token);
    this.clearform();
  }

  //function for deleting an existing connector
  delete() {
    this.telegramConnectors.delete(this.connector.token);
    //publishing the deletion event
    this.ea.publish(new ConnectorDeleted(this.connector));
    this.clearform();
  }

  confirmdelete(){

    if (typeof this.connector === "undefined") {
      //close modal in case there is no connector selected
      $(this.mdlDeleteConnector).modal('hide');
    }
    else {
      if (this.telegramConnectors.existsConnector(this.connector.token))
      {
        this.delete_message = {};
        this.delete_message.title = `Delete Token ${this.connector.token}?`;
        this.delete_message.content = `
        You are about to delete the connector with token value: ${this.connector.token}.
        This can't be reversed.
        Continue?`;
        $(this.mdlDeleteConnector).modal('open');
      }
      else {
        $(this.mdlDeleteConnector).modal('hide');
      }
    }
  }

  //function that clears the form controls
  clearform() {
    this.connector.token="";
  }

  //function for selected the selected bot
  select(bot) {
    this.bot = bot;
    return true;
  }

}
