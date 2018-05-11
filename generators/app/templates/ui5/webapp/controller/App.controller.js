sap.ui.define(
	[
		"<%= appName %>/controller/BaseController",
		"sap/m/MessageToast",	
		"sap/ui/model/json/JSONModel",		
	],
	function (BaseController, MessageToast, JSONModel) {
	"use strict";

	return BaseController.extend("<%= appName %>.controller.App", {
		onInit : function(){
			var that = this;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.setUserTheme()			
			$(document).ajaxSend(function (event, jqxhr, settings) {
				var isGettingToken = settings.url.includes(that.api.token);
				var token = that.getUserSession().Token;
				
				if(token && !isGettingToken)
					jqxhr.setRequestHeader('Authorization', 'Bearer ' + token);
				
				jqxhr.error(function(httpObj, textStatus) {       
					if(httpObj.status === 401)
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

			this.setUserModelFromSession();				

		},		
		
		onHome : function(){
			if(this.getUserSession())
				this.getRouter().navTo('dashBoard');
			else
				this.getRouter().navTo('login');
			
		},
		
		onLoginPopOver : function(oEvent){
			if(!this.getUserSession()){
				MessageToast.show(this.getText("ApprovalModel.NoLoggedUser"));				
				this.getRouter().navTo('login');
			}
			else
				this.loggedPopOver(oEvent);		
		},
		
		handlePopOverSystemConfig: function (oEvent) {
			var model = this.getView().getModel("SystemConfig");			
			
			if (!this._oPopoverSystemConfig) {
			    this._oPopoverSystemConfig = sap.ui.xmlfragment("<%= appName %>.view.fragments.systemConfig", this);
			    this.getView().addDependent(this._oPopoverSystemConfig);
			}
			
			this._oPopoverSystemConfig.setModel(model);			
			var oButton = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function () {
			    this._oPopoverSystemConfig.openBy(oButton);
			});
		},

		handleClosePopOverSystemConfig: function (oEvent) {
            this._oPopoverSystemConfig.close();   
            if (this._oPopoverSystemConfig) {
                this._oPopoverSystemConfig.destroy();
                this._oPopoverSystemConfig=false;
			}        
		},

		applyConfig : function(){
			var newConfig = this._oPopoverSystemConfig.getModel().getData();			
			sap.ui.getCore().applyTheme(newConfig.Theme); 
		},

		showErrorMessage : function(error){			
			MessageToast.show(error.responseJSON.error_description)
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
		}
	});
});