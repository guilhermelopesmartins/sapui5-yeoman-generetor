sap.ui.define(
	[
		"<%= appName %>/controller/BaseController",
		"sap/m/MessageToast",	
		"<%= appName %>/model/RestModel",		
	],
	function (BaseController, MessageToast, RestModel) {
	"use strict";

	return BaseController.extend("<%= appName %>.controller.security.Login", {
		onInit : function(){
			
			var that = this;
			this.byId("<%= appName %>LoginPage").attachBrowserEvent("keypress", oEvent =>{
				if(oEvent.keyCode != jQuery.sap.KeyCodes.ENTER) return;				
				that.onLogin();
			});

			this.UserCredentials = {
				UserName: "",
				Password:"",
				grant_type : 'password'
				
			};			
		},	
			
		
		onLogin : function(oEvent){
			this.onFakeLogin(oEvent);
			return;
			
			let loginButton =this.byId("loginButton");
			if(loginButton.getBusy()) return;				
			
			loginButton.setBusy(true);
			this.UserCredentials.UserName = this.byId("userName").getValue();
			this.UserCredentials.Password = this.byId("userPass").getValue();				
			this.getToken(this.UserCredentials, loginButton); 
		},
		onFakeLogin : function(oEvent){
			let loginButton =this.byId("loginButton");
			if(loginButton.getBusy()) return;				
			
			loginButton.setBusy(true);
			this.UserCredentials.UserName = this.byId("userName").getValue();
			this.UserCredentials.Password = this.byId("userPass").getValue();	
			let serverURL = this.getServerUrl(this.api.user);			
			let model = new RestModel(serverURL);
			model.attachRequestCompleted(response => {				
				let data = response.getSource().getData();				
				this.setUserModel(data);										
				this.setUserSession(data,"thisIsAFakeToken");										
				this.setBusyLogin(false);					
				this.redirectIfLogged(); 
			});			
		},

        setUserSession: function (user, access_token) {										
			user.Token = access_token;
            sessionStorage.setItem('currentUser', JSON.stringify(user));            
		},
		
		setBusyLogin(bBusy){
			this.byId("loginButton").setBusy(bBusy);
		},

		getToken : function(userCredentials){
			
            var sInvalidUserMessage = this.getText("invalidUser");
			
            if (!userCredentials || !userCredentials.UserName || !userCredentials.Password){
				MessageToast.show(sInvalidUserMessage);
				this.setBusyLogin(false);
				return;
			}
			
			userCredentials.grant_type = 'password';
			var serveURL = this.getServeUrl(this.api.token);
			var apiRequest = new RestModel();			   
			apiRequest.request(
				serveURL, 
				userCredentials,
				data => this.getUserData(userCredentials, data),
				err => {
					let erro = err.response;

				    console.log(erro)
					this.showExeption(erro);
					this.setBusyLogin(false);
				},
				"POST",
				"json"
			);			  
		},

		getUserData: function(userCredentials, responseToken){
			this.setUserSessionToken(responseToken.access_token);
			var serveURL = this.getServerUrl(this.api.user , userCredentials.UserName);			
			var apiRequest = new RestModel();	
			
			apiRequest.request(
				serveURL, 
				userCredentials,
				data => {
					console.log(data);
					this.setUserModel(data);										
					this.setBusyLogin(false);					
					this.redirectIfLogged();  
				},
				err => {
					
					this.showExeption({error_description: err.response.Message, error:err.message});
					this.setBusyLogin(false);
				},
				"get",
				"json"
			);		
		},
					
		
	});

});