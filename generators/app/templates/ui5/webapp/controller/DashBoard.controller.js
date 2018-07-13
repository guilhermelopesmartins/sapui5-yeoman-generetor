sap.ui.define(
	[
		"<%= appName %>/controller/BaseController",
		"sap/m/MessageToast",   
		"sap/ui/model/json/JSONModel",	
		"sap/m/MessageBox",	
		'<%= appName %>/model/formatter'		
	],
	function (BaseController, MessageToast,JSONModel,MessageBox, Formatter) {
	"use strict";

	return BaseController.extend("<%= appName %>.controller.DashBoard", {
				
		onInit : function () {			
			this.setUserTheme();
			this.getRouter()
				.getRoute("dashBoard")
				.attachPatternMatched(this._onRouteMatched, this);

		},
		fmt: Formatter,		
		setUserModel : function(user){			
			var userModel = new JSONModel();
            userModel.setData(user);
            this.setModel(userModel, "currentUser");			
		},
		_loadData : function(){
			let model = new JSONModel();
			model.setData([{
				"icon" : "sap-icon://customize",
				"number" :10,
				"title" :"Configurações",
				"info" :"Gerenciar App",
				"infoState" :"None",
				"numberUnit" :"",
				"type":"None",
				"route":"settings"
			}]);
			this.setModel(model);
		},
		onNavRoute:function(oEvent){
            let Router = oEvent.getSource().data("route");
            this.getRouter().navTo(Router);
		},
		
		onAfterRendering : function(){
			this.redirectIfNotLogged();
		},

		onShowRequestPurchasePress : function(oEvent){
			var oItem = oEvent.getSource().getParent().getParent();		
			this._showResquest(oItem);
		},
		
		_onRouteMatched : function (oEvent) {
			this.setUserModel(this.getUserSession());
			this.setUserTheme();
			this._loadData();
		},
		
		userSettingPress : function(){
			var usercode = this.getUserSession().USER_CODE;
			this.getRouter().navTo("settings", {
				userName: usercode
			});
		},

		_showResquest : function (oItem) {
			var path = oItem.oBindingContexts.Approvals.sPath;
			var index = this.getIndexOfPath(path);
			var oId = oItem.oBindingContexts.Approvals.oModel.oData.RequestsPurchase[index].Id;
			this.getRouter().navTo("requestPurchaseDetail", {
				id: oId
			});
		},

		
	});

});