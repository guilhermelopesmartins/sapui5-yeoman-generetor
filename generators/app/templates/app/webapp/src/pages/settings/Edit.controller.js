sap.ui.define([
    "<%= appName %>/src/app/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "<%= appName %>/model/formatter",
    'sap/ui/model/Filter',
    "sap/ui/model/resource/ResourceModel",
    "<%= appName %>/model/RestModel",
],

function (BaseController, JSONModel, Device, MessageToast, MessageBox, BusyIndicator, formatter, Filter,ResourceModel,RestModel) {
    "use strict";


    return BaseController.extend("<%= appName %>.src.pages.settings.Edit", {

        onInit : function () {
            this
            .getRouter()
            .getRoute('settings')
            .attachPatternMatched(this._onRouteMatched, this);

            this._loadThemes()
            this._loadSettings();
        },



        updateLocalSettings(){
            let data = this.getModel("CurrentSetting").getData();
            this.setItem(this.LOCAL_SETTINGS_PATH, data);
            MessageToast.show(this.getText("Commom.SuccessAction"))
        },

        logPress(oEvent){
            console.log(oEvent)
        },

        _loadThemes : function(){
            var themes = this.getOwnerComponent().getMetadata().getManifest()["sap.ui"].supportedThemes;
            var oViewModelSelections = new JSONModel({themes : themes});
			this.setModel(oViewModelSelections,"oViewModelSelections");
        },

        _loadSettings : function(){
            this._currentSettingModel = new JSONModel(this.getLocalSettings());
            this.setModel(this._currentSettingModel, "CurrentSetting");
        },

        _onRouteMatched : function(oEvent){

        },

        applyConfig : function(oEvent){
            var newConfig = oEvent.getSource().data('theme');
            this._currentSettingModel.setProperty("/Theme", newConfig)
            sap.ui.getCore().applyTheme(newConfig);
            this.updateLocalSettings()
        },

        onChangeMaxItemsTake(oEvent){
            let maxRegistryTake = oEvent.getParameter("value");
            this._currentSettingModel.setProperty("/MaxRegistryTake", maxRegistryTake);
            this.updateLocalSettings();
        },
        _onNavRouter:function(oEvent){
            let Router = oEvent.getSource().data("router");
            this.getRouter().navTo(Router);
        }
    });
});
