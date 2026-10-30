Ext.define('MyMain.view.main.ParkingPayment', {
    extend: 'Ext.form.Panel',
    xtype: 'parkingpayment',
    padding: '10',
    cls:'noborder',
    data: null,

    initComponent:function(){
        var me= this;
        this.items = [
	        {
	            xtype: 'displayfield',
	            fieldLabel: '',
	            labelWidth: 63,
	            value: portalUserName
	        },{
	            xtype: 'displayfield',
	            labelWidth: 77,
	            fieldLabel: 'ID',
	            value: portalUserUID
	        },{
                xtype: 'displayfield',
                labelWidth: 77,
                name: 'serviceName',
                fieldLabel: 'Service',
                value: ' '+me.data.serviceName
            },{
                xtype: 'displayfield',
                labelWidth: 130,
                name: 'numberOfParking',
                fieldLabel: 'Number of parking',
                value: ' '+me.data.parkingPlaceCode
            },{
                xtype: 'displayfield',
                labelWidth: 130,
                name: 'numberOfParking',
                fieldLabel: 'Parking period',
                value: ' '+me.data.beginDate+' - '+me.data.endDate
            }
	        ,{
				xtype: 'displayfield',
				name: 'paymentSum',
				labelWidth: 77,
				margin: '15 0 0 0',
				fieldLabel: 'Sum',
                value: me.data.paymentSum
			},{
                xtype: 'displayfield',
                name: 'paymentDate',
                labelWidth: 110,
                fieldLabel: 'Payment date ',
                /*renderer: function(value){
                    var  valueDate = me.data.paymentDate;
                    value = new Date(parseInt(valueDate));
                    return Ext.util.Format.date(value, 'd.m.Y');
                }*/
                value: me.data.paymentDate
            }
        ];
        this.callParent();  
    }
});