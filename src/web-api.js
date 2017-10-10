import {HttpClient} from 'aurelia-fetch-client';

export class WebAPI {
  constructor(){
    this.client = new HttpClient();
    this.client.configure(config => {
      config
        .withBaseUrl('http://localhost:8000/backend/v1/api/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.log('Requesting ${request.method} ${request.url}');
            return request;
          },
          response(response) {
            console.log('Received ${response.status} ${response.url}');
            return response;
          }
        });
    });
  }
  isRequesting = false;

 getBotsList(){
	 this.isRequesting = true;
	 return this.client.fetch('bot.json')
		.then(response => response.json())
		.then(data =>{
				this.isRequesting = false;
				return data.content;
		});
}

getBotDetails(id){
	this.isRequesting = true;
	return this.client.fetch(`bot/id/${id}.json`)
		.then(response => response.json())
		.then(data => {
			this.isRequesting = false;			
			return data.content[0];
			
		});
}
saveBot(bot){
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in bot){
      formData.append(key, bot[key]);
    }
    return this.client.fetch(`bot/${bot.id}.json`,{
      method:'PUT',
      body:formData
    })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });
  }

  createBot(bot){
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in bot){
      formData.append(key, bot[key]);
    }
    return this.client.fetch('bot.json',{
      method:'POST',
      body:formData
    })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });
  }
   getContextList(botid){
	 this.isRequesting = true;
	 return this.client.fetch(`bot-context/bot-id/${botid}.json`)
		.then(response => response.json())
		.then(data =>{
				this.isRequesting = false;
				return data.content;
		});
}

  createContext(context){
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in context){
      formData.append(key, context[key]);
    }
    return this.client.fetch('bot_context.json',{
      method:'POST',
      body:formData
    })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });
  }
}
