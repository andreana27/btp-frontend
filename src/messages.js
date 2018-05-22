 export class BotUpdated {
   constructor(bot) {
     this.bot = bot;
   }
 }

 export class BotCreated {
   constructor(bot) {
     this.bot = bot;
   }
 }

 export class BotViewed {
   constructor(bot) {
     this.bot = bot;
   }
 }

 export class BotDeleted {
   constructor(bot) {
     this.bot = bot;
   }
 }
 export class ContextCreated {
   constructor(context) {
     this.context = context;
   }
 }
 export class ContextUpdated {
   constructor(context) {
     this.context = context;
   }
 }
 export class ContextViewed {
   constructor(context) {
     this.context = context;
   }
 }
//Connectors
export class ConnectorUpdated {
  constructor(connector) {
    this.connector = connector;
  }
}
export class ConnectorDeleted {
  constructor(connector) {
    this.connector = connector;
  }
}
export class ConnectorCreated {
  constructor(connector) {
    this.connector = connector;
  }
}
export class ConnectorViewed {
  constructor(connector) {
    this.connector = connector;
  }
}

export class TableFilterUpdated {
  constructor(filter) {
    this.filter = filter;
  }
}
