sap.ui.define([
    "<%= appName %>/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast",	
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "<%= appName %>/model/formatter",
    'sap/ui/model/Filter',
    "sap/ui/model/resource/ResourceModel"	
], 

function (BaseController, JSONModel, Device, MessageToast, MessageBox, BusyIndicator, formatter, Filter,ResourceModel) {
    "use strict";

    return BaseController.extend("<%= appName %>.controller.settings.Edit", {

        onInit : function () {							
            var oRouter;				                                  
            oRouter = this.getRouter();
            oRouter.attachRoutePatternMatched(this._onRouteMatched, this);          
            var model = {Theme : ''}
            this.oModel = new JSONModel();
            this.oModel.setData(model);
            this.setModel(this.oModel);
            this._loadThemes();
            this._loadDocumentNumbers()
        }, 
        formatter : formatter,    
        _loadThemes : function(){
            var themes = [
				{Id:"sap_belize", Description:"Belize"},
				{Id:"sap_belize_plus", Description:"Belize Plus"}, 
				{Id:"sap_bluecrystal", Description:"Blue Crystal"}, 
				{Id:"sap_belize_hcb", Description:"Alto Constraste Preto"}, 
				{Id:"sap_belize_hcw", Description:"Alto Contraste Branco"}
				
			];
			
			var oViewModelSelections = new JSONModel({themes : themes});
			this.setModel(oViewModelSelections,"oViewModelSelections");		
        },
        _loadDocumentNumbers : function(){
            this.loadModel(this, this.getApiUrl(this.api.documentNumber), 'DocumentNumbers', [this.byId('documentsNumberControlId')]);
        },
        _loadSettings : function(){
            this.loadModel(this, this.getApiUrl(this.api.userSettings), "Settings", [this.byId('idIconTabBar')]);
        },
        _onRouteMatched : function(oEvent){            
            if (oEvent.getParameter("name")==="settings"){ 
                this._loadSettings();
            }
        },

        
        applyConfig : function(oEvent){            
			var newConfig = this.getModel("Settings").getProperty("/Theme");
            sap.ui.getCore().applyTheme(newConfig);   
            this.Save(oEvent)         
        },
        
        Save : function(oEvent)     {
            var buttonFired = oEvent.getSource();
            buttonFired.setBusy(true);
            var messageSucess = this.getText("Commom.Updated");                        
            var model = JSON.stringify(this.getModel("Settings").getData());
            var serverUrl = this.getApiUrl(this.api.updateUserSettings);            
            var that = this;
            $.ajax({
                type : 'PUT',
                contentType : "application/json",
                url :serverUrl,
                data: model,
                dataType : "json",
                success: function (data) {																			
                    buttonFired.setBusy(false);	
                    var newConfig = that.getModel("Settings").getProperty("/Theme");
                    var user = that.getUserSession();
                    user.UserSettings.Theme = newConfig;
                    MessageToast.show(messageSucess);
                    that.setUserSession(user);				         
                               
                },
                error: function (data) {
                    MessageToast.show(data.responseText)
                    buttonFired.setBusy(false);				                    		   
                }
            });
        },
        navToMeasurementUnit : function(){
            this.getRouter().navTo("measurementUnit")
        }
    });
});