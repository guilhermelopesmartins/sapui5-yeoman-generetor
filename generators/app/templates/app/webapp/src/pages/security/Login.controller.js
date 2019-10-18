sap.ui.define(
	[
		"<%= appName %>/src/app/BaseController",
		"sap/m/MessageToast",
		"<%= appName %>/model/RestModel",
	],
	function (BaseController, MessageToast, RestModel) {
	"use strict";

	return BaseController.extend("<%= appName %>.src.pages.security.Login", {
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

			const conf = new sap.ui.core.Configuration.FormatSettings();
			conf.setDatePattern("short")
			let pattertn = conf.getDatePattern()
			console.log(pattertn)



		},
		animate(){
			const control = this.byId("loginBox").$();
			control.animate({opacity: 0.25, marginTop: '150px'},500,
			()=> { control.animate({opacity:1, marginTop: '0px'}, 1000) });
		},
		onAfterRendering(){
			this.animate()
		},

		onLogin : function(oEvent){
			this.UserCredentials.UserName = this.byId("userName").getValue()
			this.UserCredentials.Password = this.byId("userPass").getValue()

			if(!this.UserCredentials.UserName || !this.UserCredentials.Password) {
				MessageToast.show("Infome o usuário e senha");
				return;
			}

			this.setUserSession(this.UserCredentials)
			this.getRouter().navTo("dashBoard")
		},

	});

});
