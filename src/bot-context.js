export class BotContext{
  constructor(){
  }
  created(){
  }
  activate(params, routeConfig){
    this.routeConfig = routeConfig;
    console.log("Child params");
    console.log(params);
  }
}
