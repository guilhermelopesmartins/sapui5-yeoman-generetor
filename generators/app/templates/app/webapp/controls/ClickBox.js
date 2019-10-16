sap.ui.define([
    "sap/ui/core/Control",
], function (Control) {
	"use strict";
	return Control.extend("<%= appName %>.controls.ClickBox", {
		metadata : {
            properties : {
                color: {
                    type: "sap.ui.core.CSSColor",
                    defaultValue: "100%"
                },
                data : {
                    type :"Object",
                    defaultValue:{}
                }
            },
            aggregations : {
                content: {
                    singularName: "content"
                }
            },
            events : {
				press : {
                    enablePreventDefault : true,
				}
			}
        },

		init : function () {

        },
        onPress : function(){
            console.log("cliek")
        },
        onAfterRendering: function() {

        },
		renderer : function (oRM, oControl) {
            oRM.write(`<div`);
            oRM.writeControlData(oControl);

            oRM.write(">");

            $.each(oControl.getContent(), function(key, value){
                oRM.renderControl(value)
            });
			oRM.write("</div>");
        },

	});
});
