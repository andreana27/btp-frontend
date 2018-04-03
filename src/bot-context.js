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
  ContextUpdated,
  ContextViewed
} from './messages';
import {
  areEqual
} from './utility';
import * as toastr from 'toastr';
import {
  Router
} from 'aurelia-router';


@inject(WebAPI, EventAggregator,Router)
export class BotContext {

  SenderActionOptions = [{
      id: 'mark_seen',
      name: 'Mark seen'
    },
    {
      id: 'typing_on',
      name: 'Typing on'
    },
    {
      id: 'typing_off',
      name: 'Typing off'
    }
  ];

  //Elements for the end/repeat combo
  EndRepeatOptions = [{
      id: 'return',
      name: 'Return'
    },
    {
      id: 'repeat',
      name: 'Repeat Flow'
    }
  ];
  //Elements for the type property of the REST element
  RestTypeOptions = [
    {
      id:'POST',
      name: 'POST'
    },
    {
      id:'GET',
      name: 'GET'
    }
  ];
  //Child contexts of the current context
  contextChlidContexts = [];

  isTemplate = false;
  isAttachment = false;
  isSA = false;
  istext = false;
  isQR = false;
  isEnd = false;
  isRest = false;
  isSmartText = false;
  isSmartReply = false;
  isChatCenter=false;

  ChatCenterContentValue='';
  selectedValSA = [];
  ContentValue = '';
  SmartContentValue = '';
  SmartReplyContentValue = '';
  SmartValidationValue='0';
  SmartReplayValidationValue='0';
  ContentValueQR = '';
  SenderActionValue = '';
  //Contains the value of the selected option for flow (repeat/return)
  selectedValEnd =[];
  //Contains the value of the selected method(POST/GET) for the JSON api
  selectedValMethod = [];
  selectedValMethodx = 'link';
  selectedMediaType = 'url';
  //Contains the value selected fot the context to sent the action-reply property
  selectedValContext  = [];
  //contains the list of variables for the selected bot
  variable_list = [];
  variableIndex = null;
  suggestionService = null;
  variableService = null;
  selVar = null;

  json_Context;

  items = [{
    title: '',
    content_type: 'text',
    sendTo: null
  }];

  keys = [{
    in: '',
    out: ''
  }];

  constructor(api, ea,router) {
    this.api = api;
    this.ea = ea;
    this.router=router;
  }
  elementSelected(selectedValType) {
    console.log(selectedValType);
    //console.log(JSON.stringify(this.contextChlidContexts));
    //console.log((this.contextChlidContexts));
    if (selectedValType == 'sa') {
      if (!this.isSA) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = true;
        this.istext = false;
        this.isQR = false
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.isSA = false;
      }
    } else
    if (selectedValType == 'template') {
      if (!this.isTemplate) {
        this.isAttachment = false;
        this.isTemplate = true;
        this.isSA = false;
        this.istext = false;
        this.isQR = false
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.isTemplate = false;
      }
    } else
    if (selectedValType == 'chatCenter') {
      if (!this.isChatCenter) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = false;
        this.isQR = false
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=true;
      } else {
        this.chatCenter = false;
      }
    } else
    if (selectedValType == 'attachment') {
      if (!this.isAttachment) {
        this.isAttachment = true;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = false;
        this.isQR = false
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.isAttachment = false;
      }
    } else
    if (selectedValType == 'text') {
      if (!this.istext) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = true;
        this.isQR = false;
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.istext = false;
      }
    } else
    if (selectedValType == 'qr') {
      if (!this.isQR) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = false;
        this.isQR = true;
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.isQR = false;
      }
    } else
    if (selectedValType == 'end') {
      if (!this.isEnd) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = false;
        this.isQR = false;
        this.isEnd = true;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.isEnd = false;
      }
    }  else
    if (selectedValType == 'rest') {
      if (!this.isRest) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = false;
        this.isQR = false;
        this.isEnd = false;
        this.isRest = true;
        this.isSmartText = false;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.isRest = false;
      }
    }
    else
    if (selectedValType == 'smartText') {
      if(!this.botTrainStatus)
      {
        toastr.warning('The IA is not train, or it changed and you need to train it again!');
      }
      if (!this.isSmartText) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = false;
        this.isQR = false;
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = true;
        this.isSmartReply = false;
        this.isChatCenter=false;
      } else {
        this.isSmartText = false;
      }
    }
    else
    if (selectedValType == 'smartReply') {
      if(!this.botTrainStatus)
      {
        toastr.warning('The IA is not train, or it changed and you need to train it again!');
      }
      if (!this.isSmartReply) {
        this.isAttachment = false;
        this.isTemplate = false;
        this.isSA = false;
        this.istext = false;
        this.isQR = false;
        this.isEnd = false;
        this.isRest = false;
        this.isSmartText = false;
        this.isSmartReply = true;
        this.isChatCenter=false;
      } else {
        this.isSmartReply = false;
      }
    }
  }
  created() {}
  additem(type) {
    var newElement = {};

    var arrayLength;
    var prom = new Promise(function(accept, reject){accept();});

    if (type == 'text') {

      newElement.type = type;
      newElement.content = this.ContentValue;
      newElement.store = this.StoreOnText;
      this.ContentValue = "";
      this.istext = false;
      toastr.success('Text element added');

    } else
    if (type == 'chatCenter') {

      newElement.type = type;
      newElement.content = this.ChatCenterContentValue;
      newElement.store = this.StoreOnChatCenter;
      this.ChatCenterContentValue = "";
      this.StoreOnChatCenter='';
      this.isChatCenter = false;
      toastr.success('Chat Center element added');

    } else
    if (type == 'attachment') {
      newElement.type = type;
      newElement.media_type = this.selectedValMethodx;
      if (newElement.selectedMediaType == 'upload'){
        prom = this.api.uploadFile(this.context.bot_id, this.uploadFile).then(answer => {
          newElement.url = `${this.api.backend}v1/download/${answer.filename}`;
          this.selectedValMethodx = 'link';
          this.selectedMediaType = 'link';
          this.serviceURL = '';
          this.isRest = false;
          toastr.success('Attachment element added');
        });
      }else{
        newElement.url  = this.serviceURL;
        this.selectedValMethodx = 'link';
        this.selectedMediaType = 'link';
        this.serviceURL = '';
        this.isRest = false;
        toastr.success('Attachment element added');
      }
    } else
    if (type == 'sender_action') {
      newElement.type = type;
      newElement.sender_action = this.selectedValSA;
      this.selectedValSA = [];
      this.isSA = false;
      toastr.success('Sender action element added');

    } else
    if (type == 'quick_reply') {
      newElement.type = type;
      newElement.content = this.ContentValueQR;
      newElement.store = this.StoreOnQR;
      newElement.quick_replies = this.items;
      this.ContentValueQR = "";
      this.items = [{
        title: '',
        content_type: 'text',
        sendTo: null
      }];
      this.isQR = false;
      toastr.success('Quick reply element added');
    } else
    if (type == 'end') {
      newElement.type = type;
      newElement.action = this.selectedValEnd;
      this.selectedValEnd = [];
      this.isEnd = false;
      toastr.success('End element added');
    } else
    if (type == 'rest') {
      newElement.type = type;
      newElement.url  = this.serviceURL;
      newElement.keys = this.keys;
      newElement.method = this.selectedValMethod;
      //clean variables
      this.selectedValMethod = [];
      this.keys = [{
        in: '',
        out: null
      }];
      this.serviceURL = '';
      this.isRest = false;
      toastr.success('REST Plugin element added');
    } else
    if(type == 'smartText'){
      newElement.type = type;
      newElement.store = this.StoreOnSmartText;
      newElement.content = this.SmartContentValue;
      newElement.validation=this.SmartValidationValue;
      this.isSmartText = false;
      this.SmartContentValue = '';
      this.SmartValidationValue='';
      toastr.success('Smart Text element added');
    } else
    if (type == 'smartReply') {
      newElement.type = type;
      newElement.content = this.SmartReplyContentValue;
      newElement.validation=this.SmartReplayValidationValue;
      newElement.store = this.StoreOnSR;
      newElement.quick_replies = this.items;
      this.SmartReplyContentValue = "";
      this.SmartReplayValidationValue='';
      this.items = [{
        title: '',
        content_type: 'text',
        sendTo: null
      }];
      this.isSmartReply = false;
      toastr.success('Smart reply element added');
    }

    prom.then(r=>{
      arrayLength = this.json_Context[this.context.name].length;
      //this.json_Context[this.context.name][arrayLength] = newElement;
      this.json_Context[this.context.name].push(newElement);

      //console.log(JSON.stringify(this.json_Context));
      this.context.context_json = JSON.stringify(this.json_Context);
      this.save();
    })
    //this.activate(this.params,this.routeConfig);
  }
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.params = params;
    return this.api.getContextDetails(params.contextid).then(context => {
      this.context = context;


      //getting the child contexts for the current contexts
      this.api.getContextListForQuick(this.context.bot_id,this.context.id).then(Childcontexts => {
        //Setting up the context child contexts
        this.contextChlidContexts = Childcontexts;
        let defaultEmptyContext = {id:null,name:'No Context'}
        //Adding the default empty context option at the first position of the array
        this.contextChlidContexts.unshift(defaultEmptyContext);
      });
      this.api.getBotTrainStatus(this.context.bot_id).then(response=>{
        if(response.cont==false)
        {
          this.botTrainStatus=false;
        }
        else{
          this.botTrainStatus=true;
        }
      });
      //getting the vairable list for the selected bot
      this.api.getVariableList(this.context.bot_id).then(variable_list => {
        this.variable_list = variable_list;
        this.variableIndex = variable_list;
        this.variableService = new VariableSuggestionService(variable_list);
        //this.suggestionService = new SuggestionService(variable_list);

        this.vars =  [];
        for (let i = 0; i < this.variable_list.length; i++)
        {
          let variable = this.variable_list[i].storage_key;
          this.vars.push(variable);
        }

        this.json_Context = this.context.context_json;
        this.routeConfig.navModel.setTitle(context.name);
        this.originalContext = JSON.parse(JSON.stringify(context));
        this.ea.publish(new ContextViewed(this.context));
        this.newName=context.name;


      }).catch(console.log.bind(console));  //in case something goes wrong


    });
  }

  get canSave() {
    return this.context.name && !this.api.isRequesting;
  }

  get canRemove() {
    return this.items.length > 1;
  }

  save() {
    this.api.saveContext(this.context).then(context => {
      this.context = context;
      this.routeConfig.navModel.setTitle(context.name);
      this.originalContext = JSON.parse(JSON.stringify(context));
      this.ea.publish(new ContextUpdated(this.context));
    });
  }
  select(context) {
    this.selectedId = context.id;
    return true;
  }
  changeContextName()
  {
    if(this.context.parent_context==null)
    {
      toastr.error('the name of this context cannot be change! This is the default context.');
    }
    else
    {
      var regex = /[a-zA-Z\-0-9]+([_]|[-]|[a-zA-Z\-0-9])*$/;
      if(regex.test(this.newName))
      {

        this.api.existsContextName(this.context.bot_id,this.newName).then(response => {
          if(response.cont==0)
          {
            this.json_Context[this.newName]=this.json_Context[this.context.name];
            this.api.changeContextName(this.context.id,this.newName).then(response=>{
              toastr.success('Context updated!');
              delete this.json_Context[this.context.name];
              this.context.name=this.newName;
              this.context.context_json = JSON.stringify(this.json_Context);
              this.save();
            });
          }
          else
          {
            toastr.error('There is a context with that name already. Change the name of the context');
          }

        });

      }
      else {
        toastr.error('Allowed name characters: Letters A-9, Numbrers:0-9, Underscore: _ and Hyphen: ');

      }


    }


  }

  deleteContext()
  {
    if(confirm('This will erase the context and all the context inside. Are you sure?'))
    {
      if(this.context.parent_context==null)
      {
        toastr.error('this context cannot be erased! This is the default context.');
      }
      else {
        //toastr.success('Intentando borrar contexto: '+context.id);
        this.api.deleteContext(this.context.id).then(response=>{
          if(response.data=='ok')
            {
              toastr.success('Context deleted!');
              this.selectedId=this.context.parent_context;
              this.router.navigate(`/manager/bot/${this.context.bot_id}/context/${this.selectedId}`);
            }
          else
          {
            toastr.error(`You must move or delete the intent ${response.datos[0].name}. it's related to the context ${response.cont[0].name}. The context cannot be removed!` );
            console.log(response.datos[0]);
          }

        });
      }
    }
  }

  changedItem(idx, item) {
    this.items[idx].content_type = item.content_type;
    this.items[idx].title = item.title;
    this.items[idx].sendTo = item.sendTo;


  }
  addBlank() {

    if (this.items[this.items.length - 1]) {
      this.items.push({
        title: '',
        content_type: 'text',
        sendTo: ''
      });
    }
  }
  removeItem(idx) {
    if (this.items.length > 1) {
      this.items.splice(idx, 1);
      //console.log(JSON.stringify(this.items));
      //logger.debug('Items: ', this.items);
    }
  }
  removeElement(idx) {
    this.json_Context[this.context.name].splice(idx, 1);
    this.context.context_json = JSON.stringify(this.json_Context);
    this.save();
  }
  elementChanged(idx, element) {
    this.json_Context[this.context.name][idx] = element;
    this.context.context_json = JSON.stringify(this.json_Context);
    this.save();
  }
  editing_addBlank(idx) {
    this.json_Context[this.context.name][idx].quick_replies.push({
      title: '',
      content_type: 'text',
      sendTo: null
    });
    //console.log(idx);

  }
  editing_removeItem(idx, rootidx) {
    if (this.json_Context[this.context.name][rootidx].quick_replies.length > 1) {
      this.json_Context[this.context.name][rootidx].quick_replies.splice(idx, 1)
      this.context.context_json = JSON.stringify(this.json_Context);
      this.save();
    }
  }
  editing_changedItem(idx, rootidx, item) {
    this.json_Context[this.context.name][rootidx].quick_replies[idx] = item;
    this.context.context_json = JSON.stringify(this.json_Context);
    //console.log(JSON.stringify(this.context.context_json));
    this.save();
  }
  move(array, element, delta) {
    var index = array.indexOf(element);
    var newIndex = index + delta;
    if (newIndex < 0 || newIndex == array.length) return; //Already at the top or bottom.
    var indexes = [index, newIndex].sort(); //Sort the indixes
    array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
    this.context.context_json = JSON.stringify(this.json_Context);
    this.save();
  }

  moveUp(array, element) {
    this.move(array, element, -1);
  }

  moveDown(array, element) {
    this.move(array, element, 1);
  }

  //PARAMETERS FOR THE REST PLUGIN
  addBlankParameter() {
    if (this.keys[this.keys.length - 1]) {
      this.keys.push({
        in: '',
        out: ''
      });
    }
  }

  changedParameter(idx, item) {
    this.keys[idx].in = item.in;
    this.keys[idx].out = item.out;
  }

  get canRemoveParameter() {
    return this.keys.length > 1;
  }

  removeParameter(idx) {
    if (this.keys.length > 1) {
      this.keys.splice(idx, 1);
    }
  }

  editing_addKey(idx) {
    this.json_Context[this.context.name][idx].keys.push({
      in: '',
      out: ''
    });
  }

  editing_addBlankKey(idx) {
    this.json_Context[this.context.name][idx].keys.push({
      in: '',
      out: ''
    });
  }

  editing_removeKey(idx, rootidx) {
    if (this.json_Context[this.context.name][rootidx].keys.length > 1) {
      this.json_Context[this.context.name][rootidx].keys.splice(idx, 1)
      this.context.context_json = JSON.stringify(this.json_Context);
      this.save();
    }
  }
  editing_changedKey(idx, rootidx, item) {
    this.json_Context[this.context.name][rootidx].keys[idx] = item;
    this.context.context_json = JSON.stringify(this.json_Context);
    //console.log(JSON.stringify(this.context.context_json));
    this.save();
  }

}
//--------------------------------------------
//class for the variable autocomplete control
//--------------------------------------------
export class VariableSuggestionService {
  constructor(variables) {
    this.variables = variables;
  }

  suggest(value) {
    if (value === '') {
      return Promise.resolve([]);
    }
    value = value.toLowerCase();
    let suggestions = this.variables.filter(x => x.storage_key != null);
    suggestions = suggestions.filter(x => x.storage_key.toLowerCase().indexOf(value) === 0)
      .map(x => x.storage_key);
    /*const suggestions = this.variables.filter(x => x.storage_key.toLowerCase().indexOf(value) === 0)
      .map(x => x.storage_key);*/
    return Promise.resolve(suggestions);
  }

  getName(suggestion) {
    return suggestion;
  }
}
