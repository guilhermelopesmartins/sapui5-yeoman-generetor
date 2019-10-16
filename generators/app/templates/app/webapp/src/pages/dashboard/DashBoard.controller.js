sap.ui.define(
	[
		"<%= appName %>/src/app/BaseController",
		"sap/m/MessageToast",
		'<%= appName %>/model/RestModel',

	],
	function (BaseController, MessageToast, RestModel) {
	"use strict";

	return BaseController.extend("<%= appName %>.src.pages.dashboard.DashBoard", {

		onInit : function () {
			this.veiculos = "http://fipeapi.appspot.com/api/1/carros/veiculos/";
			this.veiculo = "http://fipeapi.appspot.com/api/1/carros/veiculo/";
			this.ApiRoot = "http://fipeapi.appspot.com/api/1/carros/";
			jQuery.sap.require("sap.ui.core.theming.Parameters");
			var params = sap.ui.core.theming.Parameters;
			var myColor = params.get("sapUiDarkBG");
			console.log(params)
			this.loadMarcas();
		},

		loadMarcas(){
			let url = this.ApiRoot + "/marcas.json"
			let model = this.createRestModel(url);
			let busy = this.getView();
			model
			.setBusy(busy)
			.get().then(()=>{
				let item = this.byId("selectMarca").getSelectedItem().getBindingContext("marcas").getObject();
				this.updateURLs(item);
				this.getLoadCars()

			}).catch(this.showExeption);
			this.setModel(model, "marcas")
		},

		updateVeicleSelected(oEvent){
			let marca = oEvent.getParameters();
			let obj = marca.selectedItem.getBindingContext('marcas').getObject();
			this.updateURLs(obj)
			this.getLoadCars()
		},

		updateURLs(obj){
			this.setModel(new RestModel(obj), "selectedCompany");
			this.veiculo = `${this.ApiRoot}veiculo/${obj.id}`;
			this.veiculos = `${this.ApiRoot}veiculos/${obj.id}`;
		},

		onFakeEx(oEvent){
			var model = this.createRestModel("FakeException.json");
			let busy = this.getView();
			model.removeCredentials()
			var p = model.get();
			p.then(this.showExeption)
			p.catch(this.showExeption)
		},

		getLoadCars(oEvent){
			let url = `${this.veiculos}.json`;
			let model = this.createRestModel(url);
			let busy = this.getView()
			model.removeCredentials()
			model.setBusy(busy).get().catch(this.showExeption)
			this.setModel(model, "fipe");
		},

		loadCarModels(oEvent){
			let path = oEvent.getSource().getBindingContextPath();
			let idPath = `${path}/id`;
			let id = this.getModel("fipe").getProperty(idPath)


			const _dialogModelsAndYear = sap.ui.xmlfragment("<%= appName %>.src.pages.centercosts.ChooseFromModal", this);
			_dialogModelsAndYear.addStyleClass(this.getOwnerComponent().getContentDensityClass());


			this.SelectedCarUrl = `${this.veiculo}/${id}`;
			let url = this.SelectedCarUrl + ".json";
			let model = this.createRestModel(url);
			const mapCarFields = x =>  {
				return {
					Title : `${x.fipe_marca} ${(x.veiculo || "")}`,
					Description : `${x.key}`}
			};
			model.get().then(x =>{
				let data = model.getData().map(mapCarFields)
				model.setData(data);
			}).catch((err) => {ctx.showExeption([{message : "Ocorreu um erro ao processar a solicitação"}])});

			_dialogModelsAndYear.attachConfirm((oEvent)=> {
				this.loadCarValue(oEvent, this, this.SelectedCarUrl)
			})
			_dialogModelsAndYear.setModel(model);
			_dialogModelsAndYear.open()

		},

		loadCarValue(oEvent, ctx, url)  {
			var selectedModel = oEvent.getParameters().selectedItem.getBindingContext().getObject().Description;

			url = `${url}/${selectedModel}.json`;

			let modelCar = this.createRestModel(url);
			modelCar.get()
			.then((req)=>{
				ctx.showDialogPriceView(modelCar);
			})
			.catch((err) => {ctx.showExeption([{message : "Ocorreu um erro ao processar a solicitação"}])})

		},

		showDialogPriceView: function (model) {

			if (!this.DialogPriceView) {
				this.DialogPriceView = this.getDialog()

			}
			this.DialogPriceView.setModel(model)
			this.DialogPriceView.open();
		},

		getDialog(){
			let vBox = new sap.m.VBox();
			vBox.addStyleClass("sapUiTinyMargin")
			vBox.addItem(new sap.m.Title({text : "{/preco} em {/referencia}", level:"H2" }));
			vBox.addItem(new sap.m.Label({text : "Combustivel: {/combustivel}" }));
			vBox.addItem(new sap.m.Label({text : "Ano: {/ano_modelo}" }));
			vBox.addItem(new sap.m.Label({text : "Marca: {/marca}" }));
			vBox.addItem(new sap.m.Label({text : "Modelo: {/name}" }));
			vBox.addItem(new sap.m.Label({text : "Código Fipe: {/fipe_codigo}" }));

			return new sap.m.Dialog({
				contentWidth: "40%",
				resizable: true,
				title: '{/marca} {/name}',
				content: vBox,
				beginButton: new sap.m.Button({
					text: 'Close',
					press: function () {
						this.DialogPriceView.close();
					}.bind(this)
				})
			});
		},

		filterCars(oEvent){
			let query = oEvent.getParameter("query");
			let oBinding = this.byId("fipeList").getBinding("items"),
				aFilters = [],
				filterStatus;

			filterStatus = new sap.ui.model.Filter("fipe_name",  sap.ui.model.FilterOperator.Contains, query);
			aFilters.push(filterStatus);
			oBinding.filter(aFilters);

		}


	});

});
