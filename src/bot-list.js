export class BotList{
  constructor(){
    this.bots = [
                  {
                    id: 1,
                    name:'bot 1',
                    enabled:true,
                    picture:'http://lorempixel.com/200/200/people/',
                    messages:'23',
                    users: '12',
                    data: '3'
                  },
                  {
                    id: 2,
                    name:'bot 2',
                    enabled:true,
                    picture:'http://lorempixel.com/200/200/people/',
                    messages:'13',
                    users: '12',
                    data: '2'
                  },
                  {
                    id: 3,
                    name:'bot 3',
                    enabled:false,
                    picture:'http://lorempixel.com/200/200/people/',
                    messages:'3',
                    users: '12',
                    data: '23'
                  },
                ];
  }
  created(){
  }
}
