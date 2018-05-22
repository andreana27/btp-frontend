import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class NoSelection {
  constructor(ea) {
    this.message = "Select a bot context";
  }
}
