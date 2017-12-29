import environment from './environment';
import {WebAPI} from './web-api';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-table')
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => {
      //getting the bakckend as an auth ref.
	  	var auth = aurelia.container.get(WebAPI);
      //if there is no active session the default page is the login page
      let root;
      if (auth.isRegister() == true)
      {
        root = 'register';
      }
	    else
      {
        root = auth.isAuthenticated() ? 'app' : 'login';
      }
	    aurelia.setRoot(root);
});
}
