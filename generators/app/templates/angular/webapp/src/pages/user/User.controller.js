sap.ui.define(
	[
		"<%= appName %>/src/app/BaseController",
		"sap/m/MessageToast",
		'<%= appName %>/model/RestModel'	,

	],
	function (BaseController, MessageToast, RestModel) {
	"use strict";

	return BaseController.extend("<%= appName %>.src.pages.user.User", {

		onInit : function () {
			console.log("Inicializado")	;
		},




	});

});
