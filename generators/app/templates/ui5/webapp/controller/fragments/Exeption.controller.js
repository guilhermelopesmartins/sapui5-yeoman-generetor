sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Controller, JSONModel) {
	"use strict";


	return Controller.extend("<%= appName %>.controller.fragments.Exeption", {

		show: function (exeption) {
           
            console.log(exeption)
			var that = this;
			

			var oMessageTemplate = new sap.m.MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}',
				markupDescription: "{markupDescription}",
				
			});
            let titulo =exeption.error || exeption.statusText;
            let msg =exeption.error_description || exeption.Message;
			let aMockMessages = [{
				type: 'Error',
				title: titulo ,
				description: msg,
				subtitle: ''
				
			},  {
				type: 'Warning',
				title: 'Warning without description',
				description: ''
			}, {
				type: 'Success',
				title: 'Success message',
				description: 'First Success message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Information',
				title: 'Information message',
				description: 'First Information message description',
				subtitle: 'Example of subtitle',
				counter: 1
			} ];

			var oModel = new JSONModel(),
				that = this;

			oModel.setData(aMockMessages);

			var oMessageView = new sap.m.MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				}),
				oBackButton = new sap.m.Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						oMessageView.navigateBack();
						this.setVisible(false);
					}
				});

            oMessageView.setModel(oModel);
            
            
			var oCloseButton =  new sap.m.Button({
                icon: sap.ui.core.IconPool.getIconURI("decline"),
                press: function () {
						that._oPopover.close();
					}
				}),
				
				
				
				oPopoverBar = new sap.m.Bar({
					contentLeft: [oBackButton],
					contentMiddle: [
						new sap.ui.core.Icon({
							color: "#bb0000",
							src: "sap-icon://message-error"}),
						new sap.m.Text({
							text: "Messages"
						})
					]
				});

			this._oPopover = new sap.m.Dialog({
				customHeader: oPopoverBar,
				contentWidth: "440px",
				contentHeight: "440px",
				verticalScrolling: false,
				modal: true,
				content: [oMessageView],
				beginButton: oCloseButton
            });
            
			this._oPopover.open();//By(button);
            
		},

		/* handlePopoverPress: function (oEvent) {
		} */

	});

});
