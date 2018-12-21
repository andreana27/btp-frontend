export class Manager {
  constructor() {
    this.message = 'Hello World!';
  }
  configureRouter(config, router) {
    config.title = 'My Bots';
    config.map([{
        route: '',
        moduleId: 'bot-list',
        name: 'bot-list',
        title: 'Select'
      },
      {
        route: 'bot/:id',
        moduleId: 'bot-settings',
        name: 'bot-flow'
      },
      {
        route: 'bot/create/',
        moduleId: 'bot-create',
        name: 'bot-create'
      },
      {
        route: 'bot/data-statistics/',
        moduleId: 'bot-statistics',
        name: 'bot-statistics'
      },
      {
        route: 'bot/data-management/',
        moduleId: 'bot-data-management',
        name: 'bot-data-management'
      },
      {
        route: 'bot/chat-center/',
        moduleId: 'bot-chat-center',
        name: 'bot-chat-center'
      },
      {
        route: 'chat/widget-setup',
        moduleId: 'widget-setup',
        name: 'widget-setup'
      },
      {
        route: 'chat/broadcast/:id',
        moduleId: 'broadcast',
        name: 'broadcast'
      },
      {
        route: 'chat/broadcasts',
        moduleId: 'broadcasts',
        name: 'broadcasts'
      },
      {
        route: 'chat/new_broadcast',
        moduleId: 'new_broadcast',
        name: 'new_broadcast'
      },
      {
        route: 'chat/segments',
        moduleId: 'segments',
        name: 'segments'
      },
      {
        route: 'chat/segment/:id',
        moduleId: 'segment',
        name: 'segment' 
      },
      //-------------------------------------
      {
        route: 'bot/tracking',
        moduleId: 'bot-tracking',
        name: 'bot-tracking',
        title:'tracking'
      },
      //************************************
      {
        route: 'user/profile',
        moduleId: 'user-profile',
        name: 'user-profile'
      },
      {
        route: 'user/manager',
        moduleId: 'user-manager',
        name: 'user-manager',
        title:'Users'
      },
       {
        route: 'user/edit',
        moduleId: 'user-edit',
        name: 'user-edit'
      },
      {
        route: 'user/create',
        moduleId: 'user-create',
        name: 'user-create'
      },
      //**********************************
      {
        route: 'user/policies',
        moduleId: 'user-policies',
        name: 'user-policies',
        title:'Policies'
      },
      //*********************************
      {
        route: 'rol/roles',
        moduleId: 'user-roles',
        name: 'user-roles',
        title:'Roles'
      },

       {
        route: 'rol/edit',
        moduleId: 'rol-edit',
        name: 'rol-edit',
        title:'edit'
      },
      {
        route: 'rol/create',
        moduleId: 'role-create',
        name: 'role-create',
        title:'create'
      },
      //******************************************
      {
        route: 'user/temporal',
        moduleId: 'temporal-password',
        name: 'temporal-password',
        title:'temporal-password'
      },
      //******************************************
      {
        route: 'bot/intents',
        moduleId: 'bot-intents',
        name: 'bot-intents'
      }
    ]);
    this.router = router;
  }
}
