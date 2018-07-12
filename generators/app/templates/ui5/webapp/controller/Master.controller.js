sap.ui.define(
	[
		"<%= appName %>/controller/BaseController",
		"sap/m/MessageToast",   
		"sap/ui/model/json/JSONModel",	
		"sap/m/MessageBox",			
	],
	function (BaseController, MessageToast,JSONModel,MessageBox) {
	"use strict";

	return BaseController.extend("<%= appName %>.controller.Master", {
				
		onInit : function () {			
			this.setUserTheme();
			this.getRouter().getRoute("dashBoard")
			.attachPatternMatched(this._onRouteMatched, this);
		},		
		setUserModel : function(user){			
			var userModel = new JSONModel();
            userModel.setData(user);
            this.setModel(userModel, "currentUser");			
		},
		_loadData : function(){
			var that = this;			
			var oView = that.getView();
			let serverUrl = this.getApiUrl(this.api.dashBoard);
			that.setBusyState(true);			
			jQuery.ajax(
                {
                    type : "GET",
                    contentType : "application/json",
                    url :serverUrl,                
                    dataType : "json",								
                    success : function(oData) {					
                        oView.setModel(new JSONModel(oData));	                        
						that.setBusyState(false);						
                    },
                    error : function(error) {
                        that.setBusyState(false);
                        MessageToast.show(error.responseText);														
                    }
                }
			);
		},
		onTilePress: function(oEvent){					
			var tittle = oEvent.getSource().getHeader();
						
			if(tittle == "Solicitações de Compras")
				this.getRouter().navTo('requestPurchase');
			else if(tittle == "Status Requisição") 
				this.getRouter().navTo('requestStatus');
			else if(tittle == "Aprovações")
				this.getRouter().navTo('approvals');
			else if(tittle == "Contratos")
				this.getRouter().navTo('contracts');
			else if(tittle == "Modelos de Aprovação")
				this.getRouter().navTo('approvalModels');
			else if(tittle == "Configurações")
				this.getRouter().navTo('settings', {userName : this.getUserSession().USER_CODE});
			else
			{
				MessageToast.show("Funcionalidade não disponível "+ tittle)	;
				console.error("É necessário definiar a rota implementar método de navegação para: " + tittle);			
			}
		},
		
		setBusyState : function(bBusy){
			this._page = this.byId("containerTile");
			if(this._page == null)
			return;
            if(this._page.isBusy() && bBusy)
                return;

            this._page.setBusy(bBusy);
		},

		onAfterRendering : function(){
			this.redirectIfNotLogged();
		},

		onShowRequestPurchasePress : function(oEvent){
			var oItem = oEvent.getSource().getParent().getParent();		
			this._showResquest(oItem);
		},
		
		_onRouteMatched : function () {           
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