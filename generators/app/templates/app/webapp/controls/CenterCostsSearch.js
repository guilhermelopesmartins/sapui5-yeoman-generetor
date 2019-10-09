sap.ui.define([
    "sap/m/SearchField",
    "<%= appName %>/model/formatter"
], function (SearchField, formatter) {
	"use strict";
	return SearchField.extend("<%= appName %>.controls.CenterCostsSearch", {
		metadata : {
            properties : {
				dimension: 	{type : "int", defaultValue :-1}
			}
        },

		init : function () {

        },
        renderer : {}
	});
});
