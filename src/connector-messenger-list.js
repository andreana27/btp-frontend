import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {
  BotViewed,
  BotUpdated,
  ConnectorUpdated,
  ConnectorViewed
} from './messages';
import {inject} from 'aurelia-framework';
import {
  ConnectorMessenger
} from './connector-messenger';

@inject(ConnectorMessenger, WebAPI, EventAggregator)
export class ConnectorMessengerList {
  constructor(messengerConnectors, api, ea){
    this.messengerConnectors = messengerConnectors;
    this.api = api;
    this.ea = ea;
    this.connectors = [];

    //ea.subscribe(BotViewed, msg => this.select(msg.bot));
    //setting up the selected bot
    //this.ea.publish(new BotViewed(this.bot));

    ea.subscribe(ConnectorViewed, msg => this.selectConnector(msg.connector));
    ea.subscribe(ConnectorUpdated, msg => {
      /*let token = msg.connector.token;
      let found = this.connectors.find(x => x.token == token);
      Object.assign(found, msg.connector);*/
      this.messengerConnectors.getConnectorList().then(connectors => this.connectors = connectors);
      //this.api.getConnectorList(this.bot.id,this.connectortype).then(connectors => this.connectors = connectors);
    });
  }

  created() {
    //getting the connector list with type filter
    this.messengerConnectors.getConnectorList().then(connectors => this.connectors = connectors);
  }

  activate(params, routeConfig) {
    //setting up the connector type
    this.connectortype = params.connectortype;
    this.routeConfig = routeConfig;
  }

  select(bot) {
    this.bot = bot;
    return true;
  }

  selectConnector(connector) {
    //getting the id of the selected connector
    this.selectedToken = connector.token;
    return true;
  }

  viewToken(token){
    console.log("token: "+token);
  }
}
