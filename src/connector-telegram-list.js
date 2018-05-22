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
  ConnectorTelegram
} from './connector-telegram';

@inject(ConnectorTelegram, WebAPI, EventAggregator)
export class ConnectorTelegramList {
  constructor(telgramConnectors, api, ea){
    this.telgramConnectors = telgramConnectors;
    this.api = api;
    this.ea = ea;
    this.connectors = [];
    //event subscribing
    ea.subscribe(ConnectorViewed, msg => this.selectConnector(msg.connector));
    ea.subscribe(ConnectorUpdated, msg => {
      //get the list of connectors
      this.telgramConnectors.getConnectorList().then(connectors => this.connectors = connectors);
    });
  }

  created() {
    //getting the connector list with type filter
    this.telgramConnectors.getConnectorList().then(connectors => this.connectors = connectors);
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
}
