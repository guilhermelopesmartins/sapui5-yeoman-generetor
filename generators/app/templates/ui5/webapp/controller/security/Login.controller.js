sap.ui.define(
	[
		"<%= appName %>/controller/BaseController",
		"sap/m/MessageToast",	
		"sap/ui/model/json/JSONModel",		
	],
	function (BaseController, MessageToast, JSONModel) {
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
			
		
		onLogin : function(){								
			if(this.byId("loginButton").getBusy()) return;				
			
			this.byId("loginButton").setBusy(true);
			this.UserCredentials.UserName = this.byId("userName").getValue();
			this.UserCredentials.Password = this.byId("userPass").getValue();				
			this.getToken(this.UserCredentials, this.getUserData, this.showErrorMessage);
		},
        setUserSession: function (user, access_token) {
										
			user.Token = access_token;
            sessionStorage.setItem('currentUser', JSON.stringify(user));            
		},
		
		setBusyLogin(bBusy){
			this.byId("loginButton").setBusy(bBusy);
		},
		getToken : function(userCredentials, successCallback, errorCallback){
			var sErrorOnRequest = this.getText("errorOnRequest");
            var sInvalidUserMessage = this.getText("invalidUser");
			var that = this;
            if (!userCredentials || !userCredentials.UserName || !userCredentials.Password){
				MessageToast.show(sInvalidUserMessage);
				that.setBusyLogin(false);
				return;
			}
			
			   userCredentials.grant_type = 'password';
			   var serveURL = this.getApiUrl(this.api.token);
			jQuery.ajax({
                url: serveURL,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                data: userCredentials,
                success: function (result) {   					
                    successCallback(userCredentials, result, that);
                },
                error: function (result) {
					errorCallback(result, that);	
					that.setBusyLogin(false);									
                },
            });  
		},
		getUserData: function(userCredentials, responseToken, that){
			that.setUserSessionToken(responseToken.access_token);
			var serveURL = that.getApiUrl(that.api.auth , userCredentials.UserName);
			$.ajax({
                url: serveURL ,
                async: false,
                dataType: 'json',
                type: 'GET',                               
                success: function (data, status) {					
					that.setUserSession(data, responseToken.access_token);
					that.setUserModel(data);										
					that.setBusyLogin(false);					
					that.redirectIfLogged();                    
                },
                error: function (data) {
				   	that.showErrorMessage(data,that);
					that.setBusyLogin(false);				   
                },
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + responseToken.access_token);
                }
            });
		},
		showErrorMessage : function(error,ctx){	
			try {				
				MessageToast.show(error.responseJSON.error_description);			
			} catch (error) {
				MessageToast.show(ctx.getText("Commom.ServeError"));							
			}			
		},			
		
	});

});