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

            var model = {Theme : ''}
            this.oModel = new JSONModel();
            this.oModel.setData(model);
            this.setModel(this.oModel);
            this._loadThemes();
            this.getModel("oViewModelSelections").setProperty("/selectedTheme/", this.getUserTheme())
            this.setModel(new JSONModel(this.getUserSession().UserSettings), "userSettings")
            let modelTEst =this.createRestModel("Distribuition.json");

            console.log(modelTEst)
        },
        logPress(oEvent){
            console.log(oEvent)
        },
        formatter : formatter,
        _loadThemes : function(){
            var themes = this.getOwnerComponent().getMetadata().getManifest()["sap.ui"].supportedThemes;
            var oViewModelSelections = new JSONModel({themes : themes});
			this.setModel(oViewModelSelections,"oViewModelSelections");
        },

        _loadSettings : function(){
            this.byId('idIconTabBar').setBusy(true);
            let serverURL = this.getServerUrl(this.api.settings);
            let model = new JSONModel(serverURL);

            this.setModel(model,"Settings");
            this.byId('idIconTabBar').setBusy(false);

        },
        _onRouteMatched : function(oEvent){
            this._loadSettings();
        },

        applyConfig : function(oEvent){
            var newConfig = oEvent.getSource().data('theme');
            console.log(newConfig);
            this.getModel("oViewModelSelections").setProperty("/selectedTheme/", newConfig)
            sap.ui.getCore().applyTheme(newConfig);
            this.SaveTheme(newConfig)
        },

        SaveTheme : function(newTheme) {
            let user = this.getUserSession()
            let settings = user.UserSettings || {};
            settings.Theme = newTheme;
            user.UserSettings = settings;
            this.setUserSession(user)
        },
        onChangeMaxItemsTake(oEvent){
            let user = this.getUserSession()
            let settings = user.UserSettings || {};
            settings.MaxRegistryTake = oEvent.getParameter("value");
            user.UserSettings = settings;
            this.setUserSession(user);
            MessageToast.show(this.getText("Commom.SuccessAction"))
        },
        _onNavRouter:function(oEvent){
            let Router = oEvent.getSource().data("router");
            this.getRouter().navTo(Router);
        }
    });
});
