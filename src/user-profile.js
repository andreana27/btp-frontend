import {
  WebAPI
} from './web-api';
import {
  inject
} from 'aurelia-framework';
import {
  EventAggregator
} from 'aurelia-event-aggregator';


@inject(WebAPI, EventAggregator)
export class UserProfile {
  //Class constructor
  constructor(api, ea) {
    this.ea = ea;
    this.api = api;
    this.userData = {
      firstName:'',
      lastName:''
    };
  }

  //Function gets called whenever the class is created
  created() {
    this.userData = this.api.getUserData();
  }

  //Function that gets called whenever the view is activated
  activated() {
  }

  get canUpdateUserData() {
    return this.register.firstName
      && this.register.lastName
      && !this.api.isRequesting;
  }

  UpdateUserData() {
    this.api.registerUser(this.register).then(result => {
      //console.log(login);
    });
    /*
    this.api.logIn(this.login).then(login => {
      console.log(login);
    });
    this.router.navigate('manager');*/
  }

}
