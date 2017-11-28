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

@inject(WebAPI, EventAggregator)
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

  isSA = false;
  istext = false;
  isQR = false;
  isEnd = false;
  isRest = false;

  selectedValSA = [];
  ContentValue = '';
  ContentValueQR = '';
  SenderActionValue = '';
  //Contains the value of the selected option for flow (repeat/return)
  selectedValEnd =[];
  //Contains the value of the selected method(POST/GET) for the JSON api
  selectedValMethod = [];
  //Contains the value selected fot the context to sent the action-reply property
  selectedValContext  = [];

  json_Context;

  items = [{
    title: '',
    content_type: 'text',
    sendTo: null
  }];

  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
  }
  elementSelected(selectedValType) {
    //console.log(JSON.stringify(this.contextChlidContexts));
    //console.log((this.contextChlidContexts));
    if (selectedValType == 'sa') {
      if (!this.isSA) {
        this.isSA = true;
        this.istext = false;
        this.isQR = false
        this.isEnd = false;
        this.isRest = false;
      } else {
        this.isSA = false;
      }
    } else
    if (selectedValType == 'text') {
      if (!this.istext) {
        this.isSA = false;
        this.istext = true;
        this.isQR = false;
        this.isEnd = false;
        this.isRest = false;
      } else {
        this.istext = false;
      }
    } else
    if (selectedValType == 'qr') {
      if (!this.isQR) {
        this.isSA = false;
        this.istext = false;
        this.isQR = true;
        this.isEnd = false;
        this.isRest = false;
      } else {
        this.isQR = false;
      }
    } else
    if (selectedValType == 'end') {
      if (!this.isRptRet) {
        this.isSA = false;
        this.istext = false;
        this.isQR = false;
        this.isEnd = true;
        this.isRest = false;
      } else {
        this.isEnd = false;
      }
    }  else
    if (selectedValType == 'rest') {
      if (!this.isRptRet) {
        this.isSA = false;
        this.istext = false;
        this.isQR = false;
        this.isEnd = false;
        this.isRest = true;
      } else {
        this.isRest = false;
      }
    }
  }
  created() {}
  additem(type) {
    var newElement = {};

    var arrayLength;

    if (type == 'text') {

      newElement.type = type;
      newElement.content = this.ContentValue;
      newElement.store = this.StoreOnText;
      this.ContentValue = "";
      this.istext = false;
      alert('Text element added');

    } else
    if (type == 'sender_action') {
      newElement.type = type;
      newElement.sender_action = this.selectedValSA;
      this.selectedValSA = [];
      this.isSA = false;
      alert('Sender action element added');

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
      alert('Quick reply element added');
    } else
    if (type == 'end') {
      newElement.type = type;
      newElement.action = this.selectedValEnd;
      this.selectedValEnd = [];
      this.isEnd = false;
      alert('End element added');
    }

    arrayLength = this.json_Context[this.context.name].length;
    //this.json_Context[this.context.name][arrayLength] = newElement;
    this.json_Context[this.context.name].push(newElement);

    //console.log(JSON.stringify(this.json_Context));
    this.context.context_json = JSON.stringify(this.json_Context);
    this.save();
    //this.activate(this.params,this.routeConfig);
  }
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;
    this.params = params;
    return this.api.getContextDetails(params.contextid).then(context => {
      this.context = context;
      //getting the child contexts for the current contexts
      this.api.getContextListByParentContext(this.context.bot_id,this.context.id).then(Childcontexts => {
        //Setting up the context child contexts
        this.contextChlidContexts = Childcontexts;
        let defaultEmptyContext = {id:null,name:'No Context'}
        //Adding the default empty context option at the first position of the array
        this.contextChlidContexts.unshift(defaultEmptyContext);
      });
      this.json_Context = this.context.context_json;
      this.routeConfig.navModel.setTitle(context.name);
      this.originalContext = JSON.parse(JSON.stringify(context));
      this.ea.publish(new ContextViewed(this.context));
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
}
