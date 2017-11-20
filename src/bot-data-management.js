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
export class BotDataManagment {
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
    this.bots = [];
    this.suscriptions = [];
  }
}
