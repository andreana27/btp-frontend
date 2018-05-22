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
  BotViewed,
  BotUpdated,
  ConnectorUpdated
} from './messages';
import {
  Router
} from 'aurelia-router';


@inject(WebAPI, EventAggregator,Router)
export class ConnectorMessenger {
  //constructor funtion for the BotConnectorSetup class
  constructor(api, ea,router) {
    this.api = api;
    this.ea = ea;
    //this.ea.publish(new BotViewed(this.bot));
    ea.subscribe(BotViewed, msg => this.select(msg.bot));
    //router setup
    this.router = router;
  }
  //Routes configuration
  configureRouter(config, router) {
    config.map([
      {
        route: '',
        moduleId: 'connector-messenger-detail',
        name: 'connector-messenger-detail',
      },
      {
        route: 'token/:token',
        moduleId: 'connector-messenger-detail',
        name: 'connector-messenger-detail',
      },
      {
        route: 'no-selection',
        moduleId: 'no-selection',
        name: 'no-selection',
        title: 'Select'
      }
    ]);
    this.router = router;
  }
  created() {}

  getConnectorList()
  {
    return this.api.getConnectorList(this.bot.id,'messenger').then(connectors => this.connectors = connectors);
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
    return [];
  }

  get canSave() {
    return this.token && this.connectortype && !this.api.isRequesting;
  }
  save(token,challenge) {
    if (this.bot.connectors === null)
    {
      this.bot.connectors = [];
    }
    //creating a new array element for the connectors array
    let newConnector = {"token" : token, "challenge":challenge,"type": 'messenger'};
    //checking if the connector already exists
    let exists = this.bot.connectors.filter(x => x.token == token)[0];
    let index = this.bot.connectors.length;
    if(exists){
      //if the connector exists the value is updated
      index = this.bot.connectors.indexOf(exists);
      this.bot.connectors[index] = newConnector;
    }else{
      this.bot.connectors.push(newConnector);
    }
    //calling backend to update the bots connectors array
    this.api.saveBot(this.bot).then(bot => {
      this.bot = bot;
      this.api.activateConnector(this.bot.id, index).then(r => {
        this.ea.publish(new BotUpdated(this.bot));
        this.ea.publish(new ConnectorUpdated(newConnector));
      });
    });
  }

  //función para actualizar contactos
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

  //función para eliminar contactos
  delete(token) {
    if (this.bot.connectors === null)
    {
      this.bot.connectors = [];
    }
    let newConnector = {"token" : token,"type": 'messenger'};
    let exists = this.bot.connectors.filter(x => x.token == token);
    if(exists){
      //getting the selected connector index
      let index = this.bot.connectors.indexOf(exists);
      //deleting the connector from the array
      this.bot.connectors.splice(index,1);
      //this.api.saveBot(this.bot).then(bot => {
      //  this.bot = bot;
      //  this.api.deactivateConnector(this.bot.id, index).then(r => {
      //    this.ea.publish(new BotUpdated(this.bot));
      //    this.ea.publish(new ConnectorUpdated(newConnector));
      //  });
      //});
      this.ea.publish(new BotUpdated(this.bot));
      this.ea.publish(new ConnectorUpdated(newConnector));
    }
  }

  activate(params, routeConfig) {
      this.routeConfig = routeConfig;
      return this.api.getBotDetails(params.id).then(bot => {
        //get the bot from the function
        this.bot = bot;
        //this.routeConfig.navModel.setTitle(bot.firstName);
        this.originalBot = JSON.parse(JSON.stringify(bot));
        //publishing the viewed bot
        this.ea.publish(new BotViewed(this.bot));
      });
    }


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
