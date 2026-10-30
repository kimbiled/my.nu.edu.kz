Ext.define('MyMain.view.main.CancelledPayment', {
    extend: 'Ext.form.Panel',
    xtype: 'cancelledpayment',
    padding: '10',
    cls:'noborder',
    data: null,

    initComponent:function(){
        var me= this;
        this.items = [
	        {
	            xtype: 'displayfield',
	            fieldLabel: 'Address ',
	            labelWidth: 63,
	            value: 'Qabanbay Batyr Ave 53 Nur-sultan 010000 Kazakhstan'
	        },{
                xtype: 'displayfield',
                name: 'refundDate',
                labelWidth: 90,
                fieldLabel: 'Date ',
                renderer: function(value){
                   var  valueDate = me.data.refundDate;
                    value = new Date(parseInt(valueDate));
                    return Ext.util.Format.date(value, 'd.m.Y');
                }
            },{
	            xtype: 'displayfield',
	            labelWidth: 77,
	            fieldLabel: 'Student',
	            value: portalUserName
	        },{
                xtype: 'displayfield',
                labelWidth: 77,
                name: 'serviceName',
                fieldLabel: 'Service',
                value: ' '+me.data.serviceName
            }
	        ,{
				xtype: 'displayfield',
				name: 'refundSum',
				labelWidth: 77,
				margin: '15 0 0 0',
				fieldLabel: 'Refund sum',
                value: me.data.refundSum
			},{
                xtype: 'displayfield',
                name: 'paymentDate',
                labelWidth: 110,
                fieldLabel: 'Payment date ',
                renderer: function(value){
                    var  valueDate = me.data.paymentDate;
                    value = new Date(parseInt(valueDate));
                    return Ext.util.Format.date(value, 'd.m.Y');
                }
            },{
	            xtype: 'displayfield',
	            labelWidth: 104,
	            margin: '25 0 0 0',
	            name: 'paymentSum',
	            fieldLabel: 'Payment sum',
                value: me.data.paymentSum

            }
        ];
        this.callParent();  
    }
});