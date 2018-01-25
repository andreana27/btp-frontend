import { WebAPI } from './web-api';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(WebAPI, EventAggregator)
export class WidgetSetup {
  //variables
  HTMLgenCode = '';
  botNameValue = '';
  widgetHeight = 300;
  widgetWidth = 300;
  connector_list = [];
  widgetHTML = '';
  token = '';
  botId = 0;
  isSample = false;
  qualifiesForDemo = false;
  jsReference = '<script src="https://developer.innovare.es/backend/static/_2.16.1/widget/js/ChatWidget.js"></script>';
  //List of bots
  selectedBotId = [];
  //bool indicator enables the bot variable table
  botSelected = false;
  //class constructor
  constructor(webAPI, eventAgreggator){
    this.api = webAPI;
    this.ea = eventAgreggator;
    this.generateHTML();
    this.getSampleHTML();
  }//end constructor

  activate(){
    return this.api.getBotsList().then(bots => {
      this.bot_list = bots
      this.selectedBotId = this.bot_list[0].id;
      this.botNameValue = this.bot_list[0].name;
      this.getConnectors();
    });
  }

  getSampleHTML(){
    this.widgetHTML = '<div id="cssId"></div>';
    this.widgetHTML += '<div id="chat-widget-container" botName="Bot Test" botId="66" issample="true" botToken="58801df77b4c288a5b389803f75391" height="400" width="400"></div>';
  }

  getConnectors() {
    this.api.getConnectorList(this.selectedBotId,'website').then(connectors => {
      this.connector_list = connectors
      this.token = '';
      if (this.connector_list.length>0)
      {
          this.token = this.connector_list[0].token;
      }
      this.generateHTML();
    });
  }

  //attached functionality
  attached(){
    //let scriptURL = 'http://localhost:9090/static/javascripts/ChatWidget.js';
    let scriptURL = 'https://developer.innovare.es/backend/static/_2.16.1/widget/js/ChatWidget.js';
    let scriptElement = document.createElement('script');
    scriptElement.src = scriptURL;
    scriptElement.onload = () => {};
    this.scriptElementInHead = document.querySelector('head').appendChild(scriptElement);
  }//end of attached

  generateHTML()
  {
    //<div id="chat-widget-container" botName="Bot Test" botId="66" issample="false" botToken="58801df77b4c288a5b389803f75391" height="400" width="400"></div>
    this.HTMLgenCode = '<div id="cssId"></div>\r\n';
    this.HTMLgenCode += '<div id="chat-widget-container" botName="'+this.botNameValue+'"  botId="' + this.selectedBotId +'" '+ 'height="'+ this.widgetHeight +'" width="' + this.widgetWidth +'" isSample="false" botToken="'+ this.token +'"></div>';
    /*
    if (this.token.length > 3) {
      this.qualifiesForDemo = true;
      this.widgetHTML = this.HTMLgenCode;
    }
    else {this.qualifiesForDemo = false; this.getSampleHTML(); }*/
  }

  SelectBot(botId) {
    this.selectedBotId = botId;
    this.getConnectors();
  }

  SelectToken(token) {
    this.token = token;
    this.generateHTML();
  }

}//End class WidgetSetup

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export class DebugValueConverter {
  toView(value) {
    if (value === undefined) {
      return 'undefined';
    }
    if (value === null) {
      return 'null';
    }
    if (isNumeric(value)) {
      return value.toString(10);
    }
    return `"${value}"`;
  }
}
