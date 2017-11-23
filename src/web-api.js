import {
  HttpClient
} from 'aurelia-fetch-client';

export class WebAPI {
  backend = 'https://developer.innovare.es/backend/';
  isRequesting = false;
  constructor() {
    this.client_auth = new HttpClient();
    this.client_auth.configure(config => {
      config
        .withBaseUrl(this.backend+'v1/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
    this.client = new HttpClient();
    this.client.configure(config => {
      config
        .withBaseUrl(this.backend+'v1/api/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
  }

  logIn(datum) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in datum) {
      formData.append(key, datum[key]);
    }
    return this.client_auth.fetch('authk.json', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content;
      });
  }

  getBotsList() {
    this.isRequesting = true;
    return this.client.fetch('bot.json')
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content;
      });
  }

  getBotDetails(id) {
    this.isRequesting = true;
    return this.client.fetch(`bot/id/${id}.json`)
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];

      });
  }
  saveBot(bot) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in bot) {
      if (typeof(bot[key]) === 'object'){
        formData.append(key, JSON.stringify(bot[key]));
      }else{
        formData.append(key, bot[key]);
      }
    }
    return this.client.fetch(`bot/${bot.id}.json`, {
        method: 'PUT',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });
  }

  createBot(bot) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in bot) {
      if ((key === 'picture') && (bot[key]!== undefined)){
        console.log('sending picture');
        for (let i = 0; i < bot[key].length; i++) {
          formData.append(key, bot[key][i]);
        }
      }else if (key !== 'picture'){
        formData.append(key, bot[key]);
      }
    }
    return this.client.fetch('bot.json', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });
  }
  deleteBot(bot) {
    this.isRequesting = true;
    return this.client.fetch(`bot/${bot.id}.json`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content;
      });
  }
  getContextList(botid) {
    this.isRequesting = true;
    return this.client.fetch(`bot-context/bot-id/${botid}.json`)
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content;
      });
  }

  //function that gets the list of contexts for an specified context parent
  getContextListByParentContext(botid,parentContextId) {
    this.isRequesting = true;
    return this.client.fetch(`bot-context/bot-id/${botid}.json`)
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        //return data.content;
        if (data.content != null)
        {
          let arr = data.content;
          let filteredeContexts = [];
          for(var i = arr.length - 1; i >= 0; i--) {
            var obj = arr[i];
            if (obj.parent_context == parentContextId)
            {
              filteredeContexts.push(obj);
            }
          }
          //The return value only contains an array of matching parent context
          return filteredeContexts;
        }
      });
  }

  createContext(context) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in context) {
      if (typeof(context[key]) === 'object'){
        formData.append(key, JSON.stringify(context[key]));
      }else{
        formData.append(key, context[key]);
      }
    }
    return this.client.fetch('bot_context.json', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });
  }

  getContextDetails(id) {
    this.isRequesting = true;
    return this.client.fetch(`bot-context/id/${id}.json`)
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];

      });
  }

  saveContext(context) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in context) {
      if ((context[key] != null)||(context[key]!=undefined)){
        formData.append(key, context[key]);
      }
    }
    return this.client.fetch(`bot_context/${context.id}.json`, {
        method: 'PUT',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });
  }

  //Connectors

  //Function that returns a list of the existing connectors of a bot (via botid as parameter)
  getConnectorList(botId,connectorType) {
    this.isRequesting = true;
    //call to backend api
    return this.client.fetch(`bot/id/${botId}.json`)
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        if (data.content[0].connectors != null)
        {
          let arr = data.content[0].connectors;
          let filteredConnectors = arr.filter(function( obj ) {
            //connectos are filtred based on their type
            return obj.type == connectorType;
          });
          //checking if null
          if (filteredConnectors === null) filteredConnectors = [];
          //The return value only contains an array of existing connectors
          return filteredConnectors;
        }
        return [];

      });
  }
}
