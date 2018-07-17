sap.ui.define(
	[
		"<%= appName %>/controller/BaseController",
		"sap/m/MessageToast",	
		"sap/ui/model/json/JSONModel",	
		"<%= appName %>/model/RestModel",
		"<%= appName %>/model/formatter",
        "<%= appName %>/controller/fragments/Notification.controller",

	],
	function (BaseController, MessageToast, JSONModel, RestModel, formatter,NotificationController) {
	"use strict";

	return BaseController.extend("<%= appName %>.controller.App", {
		fmt:formatter,

		onInit : function(){			
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.setUserTheme()			
			this.setUserModelFromSession();	
			this.registerEventAllRequestsSend();
			this.registerNotificationsTimeInterval();	
		},		
		
		onHome : function(){
			if(this.getUserSession())
				this.getRouter().navTo('dashBoard');
			else
				this.getRouter().navTo('login');
			
		},

		//Interceptar Chamadas a API para alterar ou abortar se necessário
		registerEventAllRequestsSend: function(){
			let that = this;
			$(document).ajaxSend(function (event, jqxhr, settings) {
				var isGettingToken = settings.url.includes(that.api.token);
				var isGettingNottifications = settings.url.includes(that.api.alertMessage);
				var token = that.getAccessToken();
				if(isGettingNottifications && that.isOnLogginPage())
					jqxhr.abort('As notificações só podem ser lidas após o login');

				if(token && !isGettingToken)
					jqxhr.setRequestHeader('Authorization', 'Bearer ' + token);
				
				jqxhr.error(function(httpObj, textStatus) {       
					if(httpObj.status === 401 && !that.isOnLogginPage())
					{
						MessageToast.show(that.getText("Commom.SessionExpired"),{
							duration:15000
						});

						setTimeout(function(){
							that.onLogOut();
						}, 5000);
					}
				});
			});
		},
		
		//Notificações
		onUserNotifications: function (oEvent) {
			this.showUserNotifications(oEvent.getSource());			
		},

		showUserNotifications(button){
			if(this._oPopoverUserNotifications && this._oPopoverUserNotifications.isOpen())
			{
				this._oPopoverUserNotifications.close();
				this._oPopoverUserNotifications.destroy();
				this._oPopoverUserNotifications = false;
				return;
			}

			let controller = new NotificationController();				
			this._oPopoverUserNotifications = sap.ui.xmlfragment("<%= appName %>.view.fragments.Notifications", controller);
			this.getView().addDependent(this._oPopoverUserNotifications);
			controller.connectToView(this._oPopoverUserNotifications);
			
			//Acesso ao json model local
			let serverURL = this.getServerUrl(this.api.notification);			
			let model = new RestModel(serverURL);
			model.attachRequestCompleted(response => {				
				this.UpdateNotificationButtonStyle(button, response.getSource().getData());
			});
			this._oPopoverUserNotifications.setModel(model);			
			this._oPopoverUserNotifications.openBy(button);			

			/*
				Exemplo Acesso a API Externa

				button.setBusy(true);
				let model = new RestModel(serverURL);
				model.get(serverURL,
				(data)=> {				
					button.setBusy(false);	
					this._oPopoverUserNotifications.setModel(model);			
					this._oPopoverUserNotifications.openBy(button);
					this._oPopoverUserNotifications.getModel().refresh(true);
					this.UpdateNotificationButtonStyle(button, data);			
					console.log(data);
				},err => {console.log(err); button.setBusy(false)}); 
			*/
		},

		loadUserNotifications(button){

			if(this._oPopoverUserNotifications && this._oPopoverUserNotifications.isOpen()) return;
			
			let model = new RestModel();
			let serverURL = this.getServerUrl(this.api.notification);			
			model.get(serverURL,
			(data)=> {								
				this.UpdateNotificationButtonStyle(button, data);				
			},err => {});
		},

		UpdateNotificationButtonStyle(button, data){
			if(data.length){				
				button.setType(sap.m.ButtonType.Emphasized)				
				button.setText(data.length);
			}else{				
				button.setText("");
				button.setType(sap.m.ButtonType.Transparent)				
			}
		},

		registerNotificationsTimeInterval : function(){
			let butonNotify = this.byId("userNotifications");	
			
			setInterval(()=>{
				if(this._oPopoverUserNotifications && this._oPopoverUserNotifications.isOpen())
					 return;
				this.loadUserNotifications(butonNotify);
			}, 5000 * 60);	
		},
		
		//Session Logout
		onLoginPopOver : function(oEvent){
			if(!this.getUserSession()){
				MessageToast.show(this.getText("Commom.NoLoggedUser"));				
				this.getRouter().navTo('login');
			}
			else
				this.loggedPopOver(oEvent);		
		},
		
		onLogOut : function (){
			this.destroyUserSession();
			this.redirectIfNotLogged();						
			this.setModel(new JSONModel(), "currentUser");
		},	

		setUserModelFromSession(){
			var user = this.getUserSession();
			if(user)
				this.setModel(new JSONModel(user), 'currentUser');
		},

		loggedPopOver : function(oEvent){
			
			if (!this._oPopoverLogged) {
			    this._oPopoverLogged = sap.ui.xmlfragment("<%= appName %>.view.fragments.Logged", this);
			    this.getView().addDependent(this._oPopoverLogged);
			}
			
			this._oPopoverLogged.setModel(new JSONModel(this.getUserSession()), 'currentUser');
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
			    this._oPopoverLogged.openBy(oButton);
			});
		},

		userSettingPress : function(){
			var usercode = this.getUserSession().USER_CODE;
			this.getRouter().navTo("settings", {
				userName: usercode
			});
		},

		isOnLogginPage : function(){
			return window.location.hash == "";
		},
		
	});
});