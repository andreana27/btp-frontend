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
      }
    ]);
    this.router = router;
  }
}
