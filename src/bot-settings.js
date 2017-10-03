export class BotSettings{
  constructor(){
  }
  created(){
  }
  activate(params, routeConfig){
    this.routeConfig = routeConfig;
    console.log("Parent params");
    this.botid = params.id;
    this.contextid = params.contextid;
  }
  configureRouter(config, router){
    config.title = 'Bot Flow';
    config.map([
      {route: '',   moduleId: 'bot-context', name: 'bot-context', title: 'Select'},
      {route: 'context/:contextid',   moduleId: 'bot-context',   name:'bot-context'}
    ]);
    this.router = router;
  }
}
