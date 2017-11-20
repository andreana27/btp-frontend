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
      }
    ]);
    this.router = router;
  }
}
