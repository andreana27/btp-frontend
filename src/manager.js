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
        route: 'user/profle',
        moduleId: 'user-profile',
        name: 'user-profile'
      }
    ]);
    this.router = router;
  }
}
