Ext.define('MyMain.view.main.ReceiptEng', {
    extend: 'Ext.form.Panel',
    xtype: 'receiptEng',
    padding: '10',
    cls:'noborder',
    data: null,

    initComponent:function(){
        this.items = [
	        {
	            xtype: 'displayfield',
	            fieldLabel: 'Address ',
	            labelWidth: 63,
	            value: 'Qabanbay Batyr Ave 53 Nur-sultan 010000 Kazakhstan'
	        },{
	            xtype: 'displayfield',
	            name: 'paymentDate',
	            labelWidth: 90,
	            fieldLabel: 'Date & time ',
	            renderer: function(value){
	              	value = new Date(parseInt(value));
	                return Ext.util.Format.date(value, 'd.m.Y');
	            }
	        },{
	            xtype: 'displayfield',
	            labelWidth: 77,
	            fieldLabel: 'Student',
	            value: portalUserName
	        },{
	            xtype: 'displayfield',
	            labelWidth: 57,
	            fieldLabel: 'ID',
	            value: portalUserUID
	        },{
	            xtype: 'displayfield',
	            labelWidth: 48,
	            name: 'serviceName',
	            fieldLabel: 'Service'
	        },{
				xtype: 'displayfield',
				labelWidth: 48,
				itemId:'details',
				name: 'details',
				fieldLabel: 'Details'
			},{
				xtype: 'displayfield',
				name: 'bankReference',
				labelWidth: 116,
				margin: '15 0 0 0',
				fieldLabel: 'Bank reference ID'
			},{
	            xtype: 'displayfield',
	            labelWidth: 80,
	            fieldLabel: 'Recipient',
	            value: 'University Service Management PE'
	        },{
	            xtype: 'displayfield',
	            labelWidth: 104,
	            margin: '25 0 0 0',
	            name: 'paymentAmount',
	            fieldLabel: 'Sum'
	        }
        ];   
        this.callParent();  
    }
});