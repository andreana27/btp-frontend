import {WebAPI} from './web-api';
import {inject} from 'aurelia-framework';
import $ from 'admin-lte';

@inject(WebAPI)
export class MenuBar {
  //variable for the logged user name
  userName = '';

  constructor(api) {
    this.api = api;
  }
  created() {
    this.userName = this.api.getUserName();
  }

  activate(routeConfig) {
    this.userName = this.api.getUserName();
  }
  attached() {
    console.log('prueba');
    console.log($('*[data-widget="tree"]').tree());
  }
}
