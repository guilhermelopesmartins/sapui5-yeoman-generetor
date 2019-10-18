sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"<%= appName %>/src/pages/exceptions/Exeption.controller",
		"<%= appName %>/model/formatter",
		"<%= appName %>/model/RestModel",
	], function (Controller, Exeption, formatter, RestModel) {
	"use strict";

	return Controller.extend("<%= appName %>.src.app.BaseController", {
		fmt: formatter,
		USER_SESSION_PATH: "currentUser",
		LOCAL_SETTINGS_PATH:'localSettings',

		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		applySelectedTheme : function(){
			var localSettings = this.getLocalSettings();
			var theme = sap.ui.getCore().getConfiguration().getTheme();

			if(localSettings.Theme != theme)
				sap.ui.getCore().applyTheme(localSettings.Theme);
		},

		getLocalSettings(){
            const localSettings = this.getItem(this.LOCAL_SETTINGS_PATH) || { Theme : 'sap_bluecrystal', MaxRegistryTake : 20 };
            return localSettings
        },

		api :{
			token : 'tokenEndPoint',
			user: 'User.json',
			notification: 'Notifications.json',
			settings:'Settings.json'
		},

		getServerUrl(){
			let base = [];
			let serve = this.getOwnerComponent().getMetadata().getConfig().serviceUrl;
			base.push(serve);

			for (let index = 0; index < arguments.length; index++) {
				const element = arguments[index];
				base.push(element);
			}

			return base.join('/');
		},

		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getText: function(sKey){
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
		},

		onNavBack : function(sRoute, mData) {
				window.history.go(-1);
		},

		getIndexOfPath : function(sPath){
			var pathArray = sPath.split("/");
			var sIndex = pathArray[pathArray.length - 1];
			var index = Number.parseInt(sIndex);
			return index;
		},

		showExeption(exeption){
			let ctrl =new Exeption();
			ctrl.show(exeption);
		},

		getUserSession : function(){
			return this.getItem(this.USER_SESSION_PATH) || {};
		},

		setUserSession : function(userData){
			delete userData.Password ;
			this.setItem(this.USER_SESSION_PATH, userData)
		},

		destroyUserSession : function(){
			this.removeItem(this.USER_SESSION_PATH);
		},

		setItem(path, data){
			localStorage.setItem(path,JSON.stringify(data));

		},
		getItem(path){
			let strData = localStorage.getItem(path)
			if(!strData || strData == '') return null;

			return JSON.parse(strData);
		},

		removeItem(path){
			localStorage.removeItem(path);
		},

		getUserSettings(){

			const settings = this.getUserSession().UserSettings || {};
			return settings;
		},

		createRestModel(path){
			console.log(this.getUserSession())
			const pageSize = this.getUserSettings().MaxRegistryTake;
			const uri = path.startsWith("http") ? path : this.getServerUrl(path);
			const model = new RestModel();

			if(pageSize) model.addHeader("Prefer", `odata.maxpagesize=${pageSize}`)

			model.setUrl(uri);
			return model;

		},

		createPhpApiRestModel(path){
			let uri = this.getOwnerComponent().getMetadata().getConfig().phpApi + path
			let model = new RestModel();
			model.setUrl(uri);
			return model;
		}
	});
});
