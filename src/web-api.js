import { HttpClient } from 'aurelia-fetch-client';
import { Aurelia, inject } from 'aurelia-framework';
//------------------------------
@inject(Aurelia)
export class WebAPI {
  //backend = 'https://developer.innovare.es/backend/';
  //backend = 'https://demo-backend.botprotec.com/backend/';
  backend = 'https://demo-backend.botprotec.com/backenddev1/';
  //backend = 'https://a2.botprotec.com/backend/';

  isRequesting = false;
  sessionUser = null;
  datos=null;

  constructor(Aurelia) {
    this.app = Aurelia;
    localStorage.isRegister = false;
    //setting the session
    this.session = sessionStorage.sessionToken || null;
    this.politica1=null;

    this.client_auth = new HttpClient();
    this.client_auth.configure(config => {
      config
        .withBaseUrl(this.backend+'v1/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            //console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            //console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
    this.client = new HttpClient();
    this.client.configure(config => {
      config
        .withBaseUrl(this.backend+'v1/api/')
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            //console.log(`Requesting ${request.method} ${request.url}`);
            return request;
          },
          response(response) {
            //console.log(`Received ${response.status} ${response.url}`);
            return response;
          }
        });
    });
  }

  logIn(data) {
    let loginData = new FormData();
    for (let key in data) {
      if (typeof(data[key]) === 'object'){
        loginData.append(key, JSON.stringify(data[key]));
      }else{
        loginData.append(key, data[key]);
      }
    }
    this.isRequesting = true;
    return this.client_auth.fetch(`authk.json`, {
      method: 'PUT',
      body: loginData
    })
      .then(response => response.json())
      .then((responseData) => {
        this.isRequesting = false;
        let response = {'type':0,'msg':''};
        try {
          if (responseData.data[0].length > 3)
          {
            response.msg = '';
            response.type = 200;
            //getting the information
            sessionStorage.sessionToken = responseData.data[0]
            sessionStorage.userFirstName = responseData.data[1];
            sessionStorage.userLastName = responseData.data[2];
            sessionStorage.temporal=responseData.data[3];
            sessionStorage.datePassword=responseData.data[4];
            //---------------------------------------------------
            
            //-------------------------------------------------------
            this.getPolicies('temporal password').then((datosF)=>{
               try{
               this.politicas=datosF.data.policies_active;
               //console.log("temporal: "+this.politicas);
               if(this.politicas){

                  if(sessionStorage.temporal=='true'){
                    //console.log("pass temporal");
                    this.app.setRoot('temporal-password');
                  }else{
                    //console.log("pass No temporal");
                     //////this.app.setRoot('app');
                    //------------------------------------
                    //policitca de expiracion
                    this.getPolicies('expirable password').then((datosF1)=>{
                       try{
                       this.politicas2=datosF1;
                       var activa=this.politicas2.data.policies_active;
                       //console.log("expirable: "+activa);
                       if(activa){
                          var diasExpira = new Date(this.politicas2.data.date_end);
                          var fechahoy=new Date();
                          var fechapass=new Date(sessionStorage.datePassword);
                          var diasDif = fechahoy.getTime() - fechapass.getTime();
                          var dias = Math.round(diasDif/(1000 * 60 * 60 * 24));
                          //console.log("dias entre fechas: "+dias);
                          if(dias<=diasExpira){//esta entre el rango de fechas adecuado
                            //console.log("puede entrar");
                            this.app.setRoot('app');
                          }else{//cambiar el pass
                            //console.log("cambiar el password");
                            this.app.setRoot('temporal-password');
                          }
                          
                       }else{
                        //console.log("politica expirable no activa");
                        this.app.setRoot('app');
                       }
                      }catch(e){
                        console.log(e);
                        this.app.setRoot('login');
                       }
                    });
                    //---------------------------------------
                  }
               }else{
                //console.log("politica temporal no activa");
                 //---------------------------------------------
                 //------------------------------------
                    //policitca de expiracion
                    this.getPolicies('expirable password').then((datosF1)=>{
                       try{
                       this.politicas2=datosF1;
                       var activa=this.politicas2.data.policies_active;
                       //console.log("expirable: "+activa);
                       if(activa){
                          var diasExpira = new Date(this.politicas2.data.date_end);
                          var fechahoy=new Date();
                          var fechapass=new Date(sessionStorage.datePassword);
                          var diasDif = fechahoy.getTime() - fechapass.getTime();
                          var dias = Math.round(diasDif/(1000 * 60 * 60 * 24));
                          //console.log("dias entre fechas: "+dias);
                          if(dias<=diasExpira){//esta entre el rango de fechas adecuado
                            //console.log("puede entrar");
                            this.app.setRoot('app');
                          }else{//cambiar el pass
                            //console.log("cambiar el password");
                            this.app.setRoot('temporal-password');
                          }
                          
                       }else{
                        //console.log("politica expirable no activa");
                        this.app.setRoot('app');
                       }
                      }catch(e){
                        console.log(e);
                        this.app.setRoot('login');
                       }
                    });
                    //---------------------------------------
                    //---------------------------------------
               }
              }catch(e){
                this.app.setRoot('login');
               }
            });
            //--------------------------------------------------------
                            
            //this.app.setRoot('app');
          } else {
            response.msg = 'The login data is not valid';
            response.type = 500;
          }
        }
        catch(err){
          console.log(err);
          response.msg = 'The login data is not valid';
          response.type = 500;
        }
        return response;
      });
  }

  isAuthenticated() {
		return this.session !== null;
	}

  isRegister(){
    return localStorage.isRegister;
  }

  setRegister(value){
    localStorage.isRegister = value;
    if(!value)
    {
      this.app.setRoot('login');
    }
    else
    {
      this.app.setRoot('register');
    }
  }

  setPasswordRecovery(value){
    localStorage.isRegister = value;
    if(!value)
    {
      this.app.setRoot('login');
    }
    else
    {
      this.app.setRoot('password-reset');
    }
  }


	can(permission) {
    //TODO set roles or permission
		return true;
  }
  logoutTemporal(){
    sessionStorage.clear();
    // .. and from the session object
    this.session = null;
    return true;
  }
  logout() {
  	// Clear from sessionStorage
    sessionStorage.clear();
  	// .. and from the session object
  	this.session = null;
  	// .. and set root to login.
  	this.app.setRoot('login')
    return true;
  }

  getUserName()
  {
    return sessionStorage.userFirstName + ' ' + sessionStorage.userLastName;
  }

  getUserData()
  {
      let data = {firstName: sessionStorage.userFirstName, lastName: sessionStorage.userLastName}
      return data;
  }
  getUserDataTemporal()
  {
      let data = {firstName: sessionStorage.userFirstName, lastName: sessionStorage.userLastName,tokenApi: sessionStorage.sessionToken}
      return data;
  }
  //**********************************************************************************
  //-----------------------------------------------------------------
  getSearchPermission(modules) {    
    this.isRequesting = true;
    return this.client_auth.fetch(`feature_decorador/${sessionStorage.sessionToken}/${modules}.json`, {
      method: 'GET'
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseJson) => {
      // Do something with the response
      //console.log("entro")
      return "ok";
    })
    .catch((error) => {
      return "401 (UNAUTHORIZED)";
      this.logout();
    });
  }
  setLocations(value){
    localStorage.isRegister = value;
    if(!value)
    {
      this.app.setRoot('login');
    }
    else
    {
      this.app.setRoot('user-manager');
    }
  }
    
//----------------------------Politicas & perfil-----------------------------------
activePolicy(name){//not used
  var activated=false;
  this.getPolicies(name).then((datosF)=>{
             try{
             this.politicas=datosF;
             console.log("politica: "+this.politicas.data.policies_active);
             if(this.politicas.data.policies_active){                
                activated=true;
                console.log("if "+activated);
                return activated;
             }else{
              activated= false;
              console.log("else "+activated);
              return activated;
             }
                          
            }catch(e){
              console.log(e);
              activated=false;
              console.log("catch "+activated);
              return activated;
             }

          });
}
getPoliciesTemporal(name,token) {    
    this.isRequesting = true;
    return this.client_auth.fetch(`select_policies/${token}/${name}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
getPoliciesAll() {  //not used  
    this.isRequesting = true;
    return this.client_auth.fetch(`select_policiesALL/${sessionStorage.sessionToken}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log(error);
      this.logout();
      /*console.log("401 UNAUTHORIZED");
      this.app.setRoot('login');*/
    });
  }
getPolicies(name) {    
    this.isRequesting = true;
    return this.client_auth.fetch(`select_policies/${sessionStorage.sessionToken}/${name}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
updatePolicies(policyData) {    
    this.isRequesting = true;

    let formData = new FormData();
    for (let key in policyData) {
      if (typeof(policyData[key]) === 'object'){
        formData.append(key, JSON.stringify(policyData[key]));
      }else{
        formData.append(key, policyData[key]);
      }
    }

    return this.client_auth.fetch(`update_policies/${sessionStorage.sessionToken}.json`, {
      method: 'POST',
      body: formData
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  //---------------------------------
  temporalPassword(policyData) {    
    this.isRequesting = true;

    let formData = new FormData();
    for (let key in policyData) {
      if (typeof(policyData[key]) === 'object'){
        formData.append(key, JSON.stringify(policyData[key]));
        console.log(formData);
      }else{
        formData.append(key, policyData[key]);
      }
    }

    return this.client_auth.fetch(`temp_password/${sessionStorage.sessionToken}.json`, {
      method: 'PUT',
      body: formData
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  //----------------------------------
  istemporalPassword() {    
    this.isRequesting = true;

    return this.client_auth.fetch(`view_temporal/${sessionStorage.sessionToken}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  getUpdateProfile(userData) {
      this.isRequesting = true;
    let formData = new FormData();
    for (let key in userData) {
      if (typeof(userData[key]) === 'object'){
        formData.append(key, JSON.stringify(userData[key]));
        console.log(formData);
      }else{
        formData.append(key, userData[key]);
      }
    }     
    return this.client_auth.fetch(`update_profile/${sessionStorage.sessionToken}.json`, {
        method: 'PUT',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  getUpdatePassTemporal(userData,token) {
      this.isRequesting = true;
    let formData = new FormData();
    for (let key in userData) {
      if (typeof(userData[key]) === 'object'){
        formData.append(key, JSON.stringify(userData[key]));
        console.log(formData);
      }else{
        formData.append(key, userData[key]);
      }
    }     
    return this.client_auth.fetch(`update_passTemporal/${token}.json`, {
        method: 'PUT',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  //--------------------------------Usuarios-----------------------------------------
  getUpdateUser(userData) {
      this.isRequesting = true;
    let formData = new FormData();
    for (let key in userData) {
      if (typeof(userData[key]) === 'object'){
        formData.append(key, JSON.stringify(userData[key]));
        console.log(formData);
      }else{
        formData.append(key, userData[key]);
      }
    }     
    return this.client_auth.fetch(`update_user/${sessionStorage.sessionToken}.json`, {
        method: 'PUT',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  getSelectUser() {    
    this.isRequesting = true;
    return this.client_auth.fetch(`auth_users/${sessionStorage.sessionToken}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });

      //-----------------------------------------------------------
      /*.then((algo)=>{
        console.log("enumeracionUsuarios: "+algo);
        return algo;
      });*/
  }
  //----------------------------Roles----------------------------------------------------------
  getSelectRoles(id) {    
    this.isRequesting = true;
    return this.client_auth.fetch(`group_membership/${sessionStorage.sessionToken}/${id}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  
  getGroupRoles() {    
    this.isRequesting = true;
    return this.client_auth.fetch(`select_roles/${sessionStorage.sessionToken}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
     /* .then(response => response.json())
      .then((responseData) => {
        this.isRequesting = false;
        return responseData;
      });*/
  }
  
  getCountUsersRoles(infoRole) {//pendiente
    this.isRequesting = true;
    return this.client_auth.fetch(`count_membership/${infoRole}.json`, {
        method: 'GET'
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.count;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        return data.count;
      });*/
  }
  deleteUsersRoles(userol) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in userol) {
      if (typeof(userol[key]) === 'object'){
        formData.append(key, JSON.stringify(userol[key]));
      }else{
        formData.append(key, userol[key]);
      }
    }
    return this.client_auth.fetch(`delete_Userinroles/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        return data;
      });*/
  }
  addUserMembership(userol) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in userol) {
      if (typeof(userol[key]) === 'object'){
        formData.append(key, JSON.stringify(userol[key]));
      }else{
        formData.append(key, userol[key]);
      }
    }
    return this.client_auth.fetch(`add_user_role/${sessionStorage.sessionToken}.json`, {
        method: 'POST',//GET
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        return data;
      });*/
  }
getUpdateRole(roleData) {
      this.isRequesting = true;
    let formData = new FormData();
    for (let key in roleData) {
      if (typeof(roleData[key]) === 'object'){
        formData.append(key, JSON.stringify(roleData[key]));
      }else{
        formData.append(key, roleData[key]);
      }
    }
    return this.client_auth.fetch(`update_role/${sessionStorage.sessionToken}.json`, {
        method: 'PUT',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  registerRole(roleData) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in roleData) {
      if (typeof(roleData[key]) === 'object'){
        formData.append(key, JSON.stringify(roleData[key]));
      }else{
        formData.append(key, roleData[key]);
      }
    }
    return this.client_auth.fetch(`role/${sessionStorage.sessionToken}.json`, {
        method: 'PUT',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
    /*
      .then(response => response.json())
      .then(data => {
        return data;
      });*/
  }
  //---------------------------Features--------------------------------------------
  getSelectFeatures() {    
    this.isRequesting = true;
    return this.client_auth.fetch(`select_features/${sessionStorage.sessionToken}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  registerFeature(funcionData) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in funcionData) {
      if (typeof(funcionData[key]) === 'object'){
        formData.append(key, JSON.stringify(funcionData[key]));
      }else{
        formData.append(key, funcionData[key]);
      }
    }
    return this.client_auth.fetch(`add_functionality/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  getSelectFunction(role) {    
    this.isRequesting = true;
    return this.client_auth.fetch(`select_functionality/${sessionStorage.sessionToken}/${role}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
  deleteFeature(funcionData) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in funcionData) {
      if (typeof(funcionData[key]) === 'object'){
        formData.append(key, JSON.stringify(funcionData[key]));
      }else{
        formData.append(key, funcionData[key]);
      }
    }
    return this.client_auth.fetch(`delete_functionality/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: formData
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
         this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
  }
    //**************************************************************************************************

  recoverPassword(email,new_password) {
    //TODO Validation of email and renewal of password
    return true;
  }

  registerUser(userData) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in userData) {
      if (typeof(userData[key]) === 'object'){
        formData.append(key, JSON.stringify(userData[key]));
      }else{
        formData.append(key, userData[key]);
      }
    }
    return this.client_auth.fetch(`user/${sessionStorage.sessionToken}.json`, {
        method: 'PUT',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        //this.app.setRoot('app')
        return data;
      });*/
  }

  validateNewUserEmail(email) {
    this.isRequesting = true;
    return this.client_auth.fetch(`user/${email}.json`, {
        method: 'GET'//GET
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data;
      });*/
  }

  resetPassword(email) {
    this.isRequesting = true;
    return this.client_auth.fetch(`password_reset/${email}.json`, {
        method: 'GET'
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
          this.logout();
        }
    }).catch((error) => {
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data;
      });*/
  }
//****************************************************************************************************
  getStorageKey(botId) {
    this.isRequesting = true;
    return this.client_auth.fetch(`tracking_status/${sessionStorage.sessionToken}/${botId}.json`, {
      method: 'POST'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((responseData) => {
      this.isRequesting = false;
      try{
        return responseData.content;
      }catch(err){
        console.error(err);
           this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
       this.logout();
    });
  }
//****************************************************************************************************
  getBotsList() {
    this.isRequesting = true;
    return this.client.fetch(`${sessionStorage.sessionToken}/bot.json`)
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content;
      }catch(err){
        console.error(err);
           this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
       this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;        
        return data.content;
      });*/
  }

  getBotDetails(id) {
    this.isRequesting = true;
    return this.client.fetch(`${sessionStorage.sessionToken}/bot/id/${id}.json`)
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content[0];
      }catch(err){
        console.error(err);
           this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
       this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        console.log("botlistArray: "+data.content)
        return data.content[0];

      });*/
  }
  saveBot(bot) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in bot) {
      if (typeof(bot[key]) === 'object'){
        formData.append(key, JSON.stringify(bot[key]));
      }else{
        formData.append(key, bot[key]);
      }
    }
    return this.client.fetch(`${sessionStorage.sessionToken}/bot/${bot.id}.json`, {
        method: 'PUT',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content[0];
      }catch(err){
        console.error(err);
           this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
       this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });*/
  }

  createBot(bot) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in bot) {
      if ((key === 'picture') && (bot[key]!== undefined)){
        //console.log('sending picture');
        for (let i = 0; i < bot[key].length; i++) {
          formData.append(key, bot[key][i]);
        }
      }else if (key !== 'picture'){
        formData.append(key, bot[key]);
      }
    }
    return this.client.fetch(`${sessionStorage.sessionToken}/bot.json`, {
        method: 'POST',
        body: formData
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        /*call the method that creates the ai file*/
        //console.log(JSON.stringify(data.content[0].id));
        this.createAIFile(data.content[0].id,'');
        //this.createAIConfigFile(data.content[0].id);
        return data.content[0];
      }catch(err){
        console.error(err);
           this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
       this.logout();
    });

      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        //call the method that creates the ai file
        //console.log(JSON.stringify(data.content[0].id));
        this.createAIFile(data.content[0].id,'');
        //this.createAIConfigFile(data.content[0].id);
        return data.content[0];
      });*/
  }
  deleteBot(bot) {
    this.isRequesting = true;
    return this.client.fetch(`${sessionStorage.sessionToken}/bot/${bot.id}.json`, {
        method: 'DELETE'
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content;
      });*/
  }
  getContextList(botid) {
    this.isRequesting = true;
    return this.client.fetch(`${sessionStorage.sessionToken}/bot-context/bot-id/${botid}.json`)
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content;
      });*/
  }

  //function that gets the list of contexts for an specified context parent
  getContextListByParentContext(botid,parentContextId) {
    this.isRequesting = true;
    return this.client.fetch(`${sessionStorage.sessionToken}/bot-context/bot-id/${botid}.json`)
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        if (data.content != null)
        {
          let arr = data.content;
          let filteredeContexts = [];
          for(var i = arr.length - 1; i >= 0; i--) {
            var obj = arr[i];
            if (obj.parent_context == parentContextId)
            {
              filteredeContexts.push(obj);
            }
          }
          //The return value only contains an array of matching parent context
          return filteredeContexts;
        }
        //return data.content;

      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        //return data.content;
        if (data.content != null)
        {
          let arr = data.content;
          let filteredeContexts = [];
          for(var i = arr.length - 1; i >= 0; i--) {
            var obj = arr[i];
            if (obj.parent_context == parentContextId)
            {
              filteredeContexts.push(obj);
            }
          }
          //The return value only contains an array of matching parent context
          return filteredeContexts;
        }
      });*/
  }
  getContextListForQuick(botid,parentContextId) {
    this.isRequesting = true;
    return this.client.fetch(`${sessionStorage.sessionToken}/bot-context/bot-id/${botid}.json`)
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        //return data.content;
        if (data.content != null)
        {
          let arr = data.content;
          let filteredeContexts = [];
          for(var i = arr.length - 1; i >= 0; i--) {
            var obj = arr[i];

              filteredeContexts.push(obj);

          }
          //The return value only contains an array of matching parent context
          return filteredeContexts;
        }
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });



      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        //return data.content;
        if (data.content != null)
        {
          let arr = data.content;
          let filteredeContexts = [];
          for(var i = arr.length - 1; i >= 0; i--) {
            var obj = arr[i];

              filteredeContexts.push(obj);

          }
          //The return value only contains an array of matching parent context
          return filteredeContexts;
        }
      });*/
  }

  createContext(context) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in context) {
      if (typeof(context[key]) === 'object'){
        formData.append(key, JSON.stringify(context[key]));
      }else{
        formData.append(key, context[key]);
      }
    }
    return this.client.fetch(`${sessionStorage.sessionToken}/bot_context.json`, {
        method: 'POST',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content[0];
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });*/
  }

  uploadFile(bot_id, file) {
    this.isRequesting = true;
    let formData = new FormData();
    console.log(file);
    formData.append('data', file[0]);
    formData.append('bot_id', bot_id);
    return this.client_auth.fetch(`upload/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: formData
      })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data;
      });*/
  }

  getContextDetails(id) {
    this.isRequesting = true;
    return this.client.fetch(`${sessionStorage.sessionToken}/bot-context/id/${id}.json`)
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content[0];
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];

      });*/
  }

  saveContext(context) {
    this.isRequesting = true;
    let formData = new FormData();
    for (let key in context) {
      if (context[key] === null){
        continue; // this avoids sending null to the backend
      }
      if (typeof(context[key]) === 'object'){
        formData.append(key, JSON.stringify(context[key]));
      }else{
        formData.append(key, context[key]);
      }
    }
    return this.client.fetch(`${sessionStorage.sessionToken}/bot_context/${context.id}.json`, {
        method: 'PUT',
        body: formData
      })
       .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.content[0];
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data.content[0];
      });*/
  }

  //Connectors

  //Function that returns a list of the existing connectors of a bot (via botid as parameter)
  getConnectorList(botId,connectorType) {
    this.isRequesting = true;
    //call to backend api
    return this.client.fetch(`${sessionStorage.sessionToken}/bot/id/${botId}.json`)
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        if (data.content[0].connectors != null)
        {
          let arr = data.content[0].connectors;
          let filteredConnectors = arr.filter(function( obj ) {
            //connectos are filtred based on their type
            return obj.type == connectorType;
          });
          //checking if null
          if (filteredConnectors === null) filteredConnectors = [];
          //The return value only contains an array of existing connectors
          return filteredConnectors;
        }
        return [];
        //return data.content;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });



      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        if (data.content[0].connectors != null)
        {
          let arr = data.content[0].connectors;
          let filteredConnectors = arr.filter(function( obj ) {
            //connectos are filtred based on their type
            return obj.type == connectorType;
          });
          //checking if null
          if (filteredConnectors === null) filteredConnectors = [];
          //The return value only contains an array of existing connectors
          return filteredConnectors;
        }
        return [];

      });*/
  }

  activateConnector(botId, connectoridx){
    this.isRequesting = true;
    return this.client_auth.fetch(`bot_register/${botId}/${connectoridx}.json`, {
      method: 'GET'
    })
    .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*.then(response => response.json())
      .then(data => {
        this.isRequesting = false;
        return data;
    });*/
  }

  deactivateConnector(botId, connectoridx){
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_register/${botId}/${connectoridx}.json`, {
        method: 'DELETE'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    //Function that gets the variable list for a bot
getVariableList(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_variables/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    //Gets the record count for the variables registered to a bot
    getVariableRecordsCount(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_variables_recordcount/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    //Returns a segment of the variable records stored fot the selected bot
    getBotVariablesRecords(botId,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_variables_records/${sessionStorage.sessionToken}/${botId}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      }) 
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    //Gets the record count for the variables registered to a bot
    getBotMessageRecordCount(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_conversations_recordcount/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    //Returns a segment of the variable records stored fot the selected bot
    getBotMessages(botId,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_conversations/${sessionStorage.sessionToken}/${botId}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    //Returns a segment of the variable records stored fot the selected bot
    getBotMessagesByContact(botId,contact,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_conversations_contact/${botId}/${contact}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    getConversationUsers(botId) {
      this.isRequesting = true
      return this.client_auth.fetch(`bot_conversation_users/${botId}`,{
        method: 'GET',
        mode: 'cors'
      })
      .then(response => response.json())
      .then(data => {
        this.isRequesting = false
        return data
      })
    }

    //Generates and stores a website connector for the specified bot
    saveWebsiteConnector(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`website_connector.json`, {
        method: 'PUT',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    //Updates a website connector for the specified bot
    updateWebsiteConnector(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`website_connector.json`, {
        method: 'POST',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    //Deletes a website connector for the specified bot
    deleteWebsiteConnector(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`website_connector/${sessionStorage.sessionToken}.json`, {
        method: 'DELETE',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    //Gets the record count for the variables registered to a bot
    getIntentCount(botId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intent_recordcount/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });/*
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    //Returns a segment of the intent records stored fot the selected bot
    getBotIntents(botId,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents/${sessionStorage.sessionToken}/${botId}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    updateBotIntent(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents/${sessionStorage.sessionToken}.json`, {
        method: 'PUT',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
     this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    deleteBotIntent(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents/${sessionStorage.sessionToken}.json`, {
        method: 'DELETE',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    insertBotIntent(parameters) {
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_intents/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
      /*  .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    /*------------------------------------*/
    /*INTENT EXAMPLES*/
    //Gets the record count for the variables registered to a bot
    getIntentExampleCount(intent_id) {
      this.isRequesting = true;
      return this.client_auth.fetch(`intent_example_count/${sessionStorage.sessionToken}/${intent_id}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data.data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });

        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data.data;
      });*/
    }

    //Returns a segment of the intent records stored fot the selected bot
    getIntentExamples(intent_id,startLimit,endLimit) {
      this.isRequesting = true;
      return this.client_auth.fetch(`intent_example/${sessionStorage.sessionToken}/${intent_id}/${startLimit}/${endLimit}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }

    //Returns a segment of the intent records stored fot the selected bot
    intentExampleCRUD(operationType,parameters){
      //operation types:
      //  1 - insert
      //  2 - delete
      //  3 - update
      let method = '';
      switch(operationType) {
        case 1:
            method = 'POST';
            break;
        case 3:
            method = 'PUT';
            break;
        case 2:
            method = 'DELETE';
            break;
      }
      //Setting up the parameters
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //sending the data
      this.isRequesting = true;
      return this.client_auth.fetch(`intent_example/${sessionStorage.sessionToken}.json`, {
        method: method,
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    /*------------------------------------*/
    /*------------------------------------*/
    /*AI ENGINE - FILE HANDLING*/
    createAIFile(bot_id,file_content){
      let parameters = {bot_id: bot_id, file_content:file_content}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_ai/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    //
    createAIConfigFile(bot_id, bot_language){
      let path = '/home/rasa/rasa_nlu';
      var file_content = '{"project": "Project_' + bot_id +'","language": "'+ bot_language +'", "pipeline": "spacy_sklearn","path" : "'+ path+'/projects","data" : "'+path+'/data/examples/rasa/Project_' + bot_id +'.json"}';
      let parameters = {bot_id: bot_id, file_content:file_content}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`bot_ai_config/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    /*------------------------------------*/
    deleteContext(contextId) {
      this.isRequesting = true;
      return this.client_auth.fetch(`deleteContext/${sessionStorage.sessionToken}/${contextId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    changeContextName(contextId,newName) {
      this.isRequesting = true;
      return this.client_auth.fetch(`changeContextName/${sessionStorage.sessionToken}/${contextId}/${newName}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });

        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    existsContextName(botId,name) {
      this.isRequesting = true;
      return this.client_auth.fetch(`existsContextName/${sessionStorage.sessionToken}/${botId}/${name}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    existsIntentName(botId,name) {
      this.isRequesting = true;
      return this.client_auth.fetch(`existsIntentName/${sessionStorage.sessionToken}/${botId}/${name}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    deleteMessengerConnector(botId,token)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`deleteMessengerConnector/${botId}/${token}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    deleteTelegramConnector(botId,token)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`deleteTelegramConnector/${botId}/${token}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    getBotTrainStatus(botId)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`getBotTrainStatus/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
          this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    setBotTrainStatus(botId)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`setBotTrainStatus/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    setFalseBotTrainStatus(botId)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`setFalseBotTrainStatus/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    getTrainLog(botId)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`getTrainLog/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    sendMessageToMessenger(botId,clientId,message)
    {
      let parameters = {bot_id: botId, message:message,clientid:clientId}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`sendMessageToMesseger/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/

      /*
      this.isRequesting = true;
      return this.client_auth.fetch(`sendMessageToMesseger/${botId}/${clientId}/${message}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    sendMessageToTelegram(botId,clientId,message)
    {
      let parameters = {bot_id: botId, message:message,clientid:clientId}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`sendMessageToTelegram/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: data
      })
        .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });

        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/

      /*/
      this.isRequesting = true;
      return this.client_auth.fetch(`sendMessageToTelegram/${botId}/${clientId}/${message}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    endChatCenter(botId,clientId,message)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`endChatCenter/${sessionStorage.sessionToken}/${botId}/${clientId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    getAiRequests(botId)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`getAiRequests/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
    lookForMessages(botId)
    {//falta implementacion en el backend
      this.isRequesting = true;
      return this.client_auth.fetch(`checkNeedChatCenter/${sessionStorage.sessionToken}/${botId}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    }); 
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
sendMessageToBroadcast(botId,message)
    {
      let parameters = {bot_id: botId, message:message}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`sendMessageToBroadcast/${sessionStorage.sessionToken}.json`, {
        method: 'POST',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
     this.logout();
    }); 
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/


      /*
      return this.client_auth.fetch(`sendMessageToBroadcast/${botId}/${message}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
  //------------------------------------------------------------
  updateAdName(idbot,idad,name)
    {
      let parameters = {idbot: idbot,idad:idad,adname:name}
      let data = new FormData();
      for (let key in parameters) {
        if (typeof(parameters[key]) === 'object'){
          data.append(key, JSON.stringify(parameters[key]));
        }else{
          data.append(key, parameters[key]);
        }
      }
      //bot_ai
      this.isRequesting = true;
      return this.client_auth.fetch(`insertNameAd/${sessionStorage.sessionToken}.json`, {
        method: 'PUT',
        body: data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    });
    }
  getStartButton(bot_token)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`getStartedButton/${sessionStorage.sessionToken}/${bot_token}.json`, {
        method: 'GET'
        //body:data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    }); 
    }
  deleteStartButton(bot_token)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`deleteStartedButton/${sessionStorage.sessionToken}/${bot_token}.json`, {
        method: 'GET'
        //body:data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    }); 
    }
  getDataTable2(botId,key,start,end)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`getTrackingTable2/${sessionStorage.sessionToken}/${botId}/${key}/${start}/${end}.json`, {
        method: 'GET'
        //body:data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    }); 
    }
  getDataStorage(botId,start,end)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`getTracking/${sessionStorage.sessionToken}/${botId}/${start}/${end}.json`, {
        method: 'GET'
        //body:data
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    }); 
    }
  //------------------------------------------------------------
  getStatistics(botId,start,end)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`getStatistics/${sessionStorage.sessionToken}/${botId}/${start}/${end}.json`, {
        method: 'GET'
      })
      .then((response) => {
      if (response.ok) {
          return response.json();
      } else {
        throw new Error('Something went wrong');
      }
    })
    .then((data) => {
      this.isRequesting = false;
      try{
        return data;
      }catch(err){
        console.error(err);
        this.logout();
        }
    }).catch((error) => {
      //console.log(error);
      console.log("401 UNAUTHORIZED");
      this.logout();
    }); 
        /*.then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });*/
    }
  
  botClone(botId,name,full)
    {
      this.isRequesting = true;
      return this.client_auth.fetch(`botClone/${sessionStorage.sessionToken}/${botId}/${name}/${full}.json`, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false;
          return data;
      });
    }
  
  tryNotify(data)
    {
      if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
          }
      else if (Notification.permission === "granted") {
        var notification = new Notification(data);
      }
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          if (permission === "granted") {
            var notification = new Notification(data);
          }
        });
      }
    }

  fbUsers() {
    let get = (bot_id, string) => {
      this.isRequesting = true
      let request = `user_filters/${sessionStorage.sessionToken}/${bot_id}/${string}.json`
      console.log(request)
      return this.client_auth.fetch(request, {
        method: 'GET'
      })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
    }
    return {
      get
    }
  }

    //get bot variables
    botVariables() {
      let get = (bot) => {
        this.isRequesting = true
        return this.client_auth.fetch(`/bot_variables_list?bot_id=${bot.id}`, {
          method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
        .catch(err => ({'status': 'error', 'error': err}))
      }


      return {
        get
      }
    }

    variables() {
      let get = () => {
        this.isRequesting = true
        return this.client_auth.fetch(`/variables`, {
          method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
        .catch(err => ({'status': 'error', 'error': err}))
      }

      return {
        get
      }
    }

    segments() {
      let get = (page, search) => {
        this.isRequesting = true
        return this.client_auth.fetch(`/segments`, {
          method: 'GET'
        })
          .then(response => response.json())
          .then(data => {
            this.isRequesting = false
            return data
          })
          .catch(err => {
            this.isRequesting = false
            return {
              'status': 'error',
              err
            }
          })
      }

      let find = id => {
        this.isRequesting = true
        return this.client_auth.fetch(`segment/${id}`, {
          method: 'get',
          mode: 'cors'
        })
          .then(response => response.json())
          .then(data => {
            this.isRequesting = false
            return data
          })
          .catch(err => {
            this.isRequesting = false
            return {
              'status': 'error',
              err
            }
          })
      }

      let create = segment => {
        this.isRequesting = true
        return  this.client_auth.fetch(`/segment`, {
          method: 'POST',
          body: JSON.stringify(segment)
        })
          .then(response => response.json())
          .then(data => {
            this.isRequesting = false
            return data
          })
          .catch(err => {
            this.isRequesting = false
            return {
              'status': 'error',
              err
            }
          })
      }

      let update = segment => {
        this.isRequesting = true
        return  this.client_auth.fetch(`/segment`, {
          method: 'PUT',
          body: JSON.stringify(segment)
        })
          .then(response => response.json())
          .then(data => {
            this.isRequesting = false
            return data
          })
          .catch(err => {
            this.isRequesting = false
            return {
              'status': 'error',
              err
            }
          })
      }

      let destroy = segment => {
        this.isRequesting = true
        return  this.client_auth.fetch(`/segment`, {
          method: 'DELETE',
          body: JSON.stringify(segment)
        })
          .then(response => response.json())
          .then(data => {
            this.isRequesting = false
            return data
          })
          .catch(err => {
            this.isRequesting = false
            return {
              'status': 'error',
              err
            }
          })
      }

      return {
        get,
        create,
        find,
        update,
        destroy
      }
    }

    //broadcast
    broadcasts() {
      let get = () => {
        this.isRequesting = true
        return this.client_auth.fetch(`/broadcasts`, {
          method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
        .catch(err => ({'status': 'error', 'error': err}))
      }
      
      let find = id => {
        this.isRequesting = true

        return this.client_auth.fetch(`/broadcast/${id}`, {
          method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
        .catch(err => ({'status': 'error', 'error': err}))
      }

      let create = broadcast => {
        this.isRequesting = true

        return this.client_auth.fetch('broadcasts', {
          method: 'POST',
          body: JSON.stringify(broadcast)
        })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
      }

      let update = broadcast => {
        this.isRequesting = true

        return this.client_auth.fetch('broadcast', {
          method: 'PUT',
          body: JSON.stringify(broadcast)
        })
        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
      }

      let destroy = broadcast => {
        this.isRequesting = true

        return this.client_auth.fetch('broadcast', {
          method: 'DELETE',
          body: JSON.stringify(broadcast)
        })

        .then(response => response.json())
        .then(data => {
          this.isRequesting = false
          return data
        })
      }

      return {
        get,
        find,
        create,
        update,
        destroy
      }
    }

    bots() {
      let bySegment = (segment_id, bot_id = null, show_users = false) => {
        bot_id == '_' ? bot_id = null : null
        this.isRequesting = true
        let request = `bots?segment_id=${segment_id}${bot_id && '&bot_id=' + bot_id}${show_users && '&show_users=true'}`
        console.log(request)

        return this.client_auth.fetch(`bots?segment_id=${segment_id}`, {
          'method': 'GET'
        })
          .then(response => response.json())
          .then(data => {
            this.isRequesting = false
            return data
          })
      }

      return {
        bySegment
      }
    }
}
