import { HttpClient } from 'aurelia-fetch-client';
import { Aurelia, inject } from 'aurelia-framework';

@inject(Aurelia)
export class WebAPI {
  backend = 'https://developer.innovare.es/backend/';
  //backend = 'https://a2.botprotec.com/backend/';
  isRequesting = false;
  sessionUser = null;

  constructor(Aurelia) {
    this.app = Aurelia;
    localStorage.isRegister = false;
    //setting the session
    this.session = sessionStorage.sessionToken || null;
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
            //console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            //console.log(`Received ${response.status} ${response.url}`);
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
            //console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            //console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
  }

  logIn(data) {
    let loginData = new FormData();
    for (let key in data) {
      if (typeof(data[key]) === 'object'){
        loginData.append(key, JSON.stringify(data[key]));
      }else{
        loginData.append(key, data[key]);
      }
    }
    this.isRequesting = true;
    return this.client_auth.fetch(`authk.json`, {
      method: 'PUT',
      body: loginData
    })
      .then(response => response.json())
      .then((responseData) => {
        let response = {'type':0,'msg':''};
        try {
          if (responseData.data[0].length > 3)
          {
            response.msg = '';
            response.type = 200;
            //getting the information
            sessionStorage.sessionToken = responseData.data[0]
            sessionStorage.userFirstName = responseData.data[1];
            sessionStorage.userLastName = responseData.data[2];
            // .. and set root to app.
            this.app.setRoot('app');
          } else {
            response.msg = 'The login data is not valid';
            response.type = 500;
          }
        }
        catch(err){
          response.msg = 'The login data is not valid';
          response.type = 500;
        }
        return response;
      });
  }

  isAuthenticated() {
		return this.session !== null;
	}

  isRegister(){
    return localStorage.isRegister;
  }

  setRegister(value){
    localStorage.isRegister = value;
    if(!value)
    {
      this.app.setRoot('login');
    }
    else
    {
      this.app.setRoot('register');
    }
  }

  setPasswordRecovery(value){
    localStorage.isRegister = value;
    if(!value)
    {
      this.app.setRoot('login');
    }
    else
    {
      this.app.setRoot('password-reset');
    }
  }


	can(permission) {
    //TODO set roles or permission
		return true;
  }

  logout() {
  	// Clear from sessionStorage
    sessionStorage.clear();
  	// .. and from the session object
  	this.session = null;
  	// .. and set root to login.
  	this.app.setRoot('login')
    return true;
  }

  getUserName()
  {
    return sessionStorage.userFirstName + ' ' + sessionStorage.userLastName;
  }

  getUserData()
  {
      let data = {firstName: sessionStorage.userFirstName, lastName: sessionStorage.userLastName}
      return data;
  }

  recoverPassword(email,new_password) {
    //TODO Validation of email and renewal of password
    return true;
  }

  registerUser(userData) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in userData) {
      if (typeof(userData[key]) === 'object'){
        formData.append(key, JSON.stringify(userData[key]));
      }else{
        formData.append(key, userData[key]);
      }
    }
    return this.client_auth.fetch(`user.json`, {
        method: 'PUT',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        //this.app.setRoot('app')
        return data;
      });
  }

  validateNewUserEmail(email) {
    this.isRequesting = true;
    return this.client_auth.fetch(`user/${email}.json`, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => {
        return data;
      });
  }

  resetPassword(email) {
    this.isRequesting = true;
    return this.client_auth.fetch(`password_reset/${email}.json`, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => {
        return data;
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
        //console.log('sending picture');
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
        /*call the method that creates the ai file*/
        //console.log(JSON.stringify(data.content[0].id));
        this.createAIFile(data.content[0].id,'');
        //this.createAIConfigFile(data.content[0].id);
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
      if (typeof(context[key]) === 'object'){
        formData.append(key, JSON.stringify(context[key]));
      }else{
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

  activateConnector(botId, connectoridx){
    this.isRequesting = true;
    return this.client_auth.fetch(`bot_register/${botId}/${connectoridx}.json`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data;
    });
  }

    deactivateConnector(botId, connectoridx){
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_register/${botId}/${connectoridx}.json`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    //Function that gets the variable list for a bot
    getVariableList(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_variables/${botId}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Gets the record count for the variables registered to a bot
    getVariableRecordsCount(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_variables_recordcount/${botId}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Returns a segment of the variable records stored fot the selected bot
    getBotVariablesRecords(botId,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_variables_records/${botId}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Gets the record count for the variables registered to a bot
    getBotMessageRecordCount(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_conversations_recordcount/${botId}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Returns a segment of the variable records stored fot the selected bot
    getBotMessages(botId,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_conversations/${botId}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Returns a segment of the variable records stored fot the selected bot
    getBotMessagesByContact(botId,contact,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_conversations_contact/${botId}/${contact}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Generates and stores a website connector for the specified bot
    saveWebsiteConnector(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`website_connector.json`, {
        method: 'PUT',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    //Updates a website connector for the specified bot
    updateWebsiteConnector(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`website_connector.json`, {
        method: 'POST',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    //Deletes a website connector for the specified bot
    deleteWebsiteConnector(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`website_connector.json`, {
        method: 'DELETE',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    //Gets the record count for the variables registered to a bot
    getIntentCount(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intent_recordcount/${botId}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Returns a segment of the intent records stored fot the selected bot
    getBotIntents(botId,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents/${botId}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    updateBotIntent(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents.json`, {
        method: 'PUT',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    deleteBotIntent(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents.json`, {
        method: 'DELETE',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    insertBotIntent(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents.json`, {
        method: 'POST',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }
    /*------------------------------------*/
    /*INTENT EXAMPLES*/
    //Gets the record count for the variables registered to a bot
    getIntentExampleCount(intent_id) {
      this.isRequesting = true;
      return this.client_auth.fetch(`intent_example_count/${intent_id}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });
    }

    //Returns a segment of the intent records stored fot the selected bot
    getIntentExamples(intent_id,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`intent_example/${intent_id}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }

    //Returns a segment of the intent records stored fot the selected bot
    intentExampleCRUD(operationType,parameters){
      //operation types:
      //  1 - insert
      //  2 - delete
      //  3 - update
      let method = '';
      switch(operationType) {
        case 1:
            method = 'POST';
            break;
        case 3:
            method = 'PUT';
            break;
        case 2:
            method = 'DELETE';
            break;
      }
      //Setting up the parameters
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //sending the data
      this.isRequesting = true;
      return this.client_auth.fetch(`intent_example.json`, {
        method: method,
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }
    /*------------------------------------*/
    /*------------------------------------*/
    /*AI ENGINE - FILE HANDLING*/
    createAIFile(bot_id,file_content){
      let parameters = {bot_id: bot_id, file_content:file_content}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_ai.json`, {
        method: 'POST',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }
    //
    createAIConfigFile(bot_id, bot_language){
      var file_content = '{"project": "Project_' + bot_id +'","language": "'+ bot_language +'", "pipeline": "spacy_sklearn","path" : "./projects","data" : "./data/examples/rasa/Project_' + bot_id +'.json"}';
      let parameters = {bot_id: bot_id, file_content:file_content}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_ai_config.json`, {
        method: 'POST',
        body: data
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }
    /*------------------------------------*/
}
