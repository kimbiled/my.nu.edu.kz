Ext.define('MyMain.view.main.Agreement', {
	extend: 'Ext.window.Window',
	alias: 'widget.agreement',
	closable: false,
	layout: 'fit',
	autoShow: true,
	modal: true,
	paymentRequest:null,
	border:10,
    margins: '4',
	agreementType: null,
	width: Ext.getBody().getViewSize().width - (Ext.getBody().getViewSize().width*10/100),
    height: Ext.getBody().getViewSize().height - (Ext.getBody().getViewSize().height*10/100),
	initComponent: function() {
		var cancelHandler;
		var pdfFileSrc;
		if (this.agreementType == 'acceptServiceTerms') {
			this.title = 'Service payment agreement';
			pdfFileSrc = basePath+'rest/payments/agree/downloadServiceTerms/{serviceCode}?agreementNumber={agreementNumber}';
			cancelHandler = this.close
		} else if (this.agreementType == 'acceptAccountTerms') {
			this.title = 'Payment account agreement';
			pdfFileSrc = basePath+'rest/payments/agree/download/{providerId}';
			cancelHandler = function(){
				window.location.href = '/wps/myportal/student';
			}
		}

		this.items = [
			{
				xtype: 'component',
				border:false,
				tpl: [
					'<tpl for=".">',
                    '<div style="height: 100%">',
                    '<embed src="' + pdfFileSrc + '" width="100%" height="100%" type="application/pdf"/>',
                    '</div>',
					'</tpl>'
				],
				data:this.paymentRequest
			}
		];
		this.buttons = [
			{
				xtype:'checkbox',
				itemId:'acknowledgeApprove',
                scale:'large',
                width:mobilecheck()?100:'',
				boxLabel:'I agree with this payment agreement',
				handler: function(){
					var btn = this.ownerCt.getComponent('agreementAcceptBtn');
					btn = btn.disabled ? btn.enable() : btn.disable();
				}
			},
			{
				text: 'Accept',
                ui:'primary',
                itemId: 'agreementAcceptBtn',
                scale:'large',
                width:100,
				action: this.agreementType,
				disabled: true
			},
			{
				text: 'Cancel',
				scope: this,
                scale:'large',
				handler: cancelHandler
			}
		];
		this.callParent(arguments);
	}
});
