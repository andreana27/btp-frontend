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
      //-------------------------------------
      {
        route: 'user/profile',
        moduleId: 'user-profile',
        name: 'user-profile'
      },
      {
        route: 'rol/roles',
        moduleId: 'user-roles',
        name: 'user-roles'
      },
      {
        route: 'user/manager',
        moduleId: 'user-manager',
        name: 'user-manager'
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
      //*********************************
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
      //---------------------------------
      {
        route: 'bot/intents',
        moduleId: 'bot-intents',
        name: 'bot-intents'
      }
    ]);
    this.router = router;
  }
}
