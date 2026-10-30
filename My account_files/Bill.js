Ext.define('MyMain.view.main.Bill', {
    extend: 'Ext.form.Panel',
    xtype: 'bill',
    padding: '10',
    cls:'noborder',
    data: null,
    
    initComponent:function(){
        this.items = [
	        {
	            xtype: 'displayfield',
	            name: 'invoiceNumber',
	            labelWidth: 198,
	            labelStyle: 'font-weight: bold;',
	            fieldLabel: 'Счет на оплату/ Invoice №'
	        },{
	            xtype: 'displayfield',
	            name: 'invoiceDate',
	            margin: '0 0 25 0',
	            labelWidth: 80,
	            labelStyle: 'font-weight: bold;',
	            fieldLabel: 'Дата/Date',
				renderer: function(value){
					value = new Date(parseInt(value));
					return Ext.util.Format.date(value, 'd.m.Y');
				}
	        },{
	            xtype: 'displayfield',
	            fieldLabel: 'Получатель:',
	            labelWidth: 92,
	            labelStyle: 'font-weight: bold;',
                    name: 'serviceCode',
                    renderer: function (value) {

                        if(value!=='401' && value!=='402' && value!=='403' && value!=='' && value!==null) {
                            this.up().down('#recieptDate').hide();
                        }

                        return value === '604' ? 'Автономная организация образования «Назарбаев Университет»' : 
                            'Частное учреждение «University Service Management»';
                    }
	        },{ 
	            xtype: 'displayfield',
	            fieldLabel: 'Recipient:',
	            labelWidth: 71, 
	            labelStyle: 'font-weight: bold;',
	            value: 'Private Entity University Service Management'
	        },{ 
	            xtype: 'displayfield',
	            margin: '25 0 0 0',
	            labelWidth: 152, 
	            labelStyle: 'font-weight: bold;',
	            fieldLabel: 'Плательщик / Payer:',
	            value: portalUserName
	        },{ 
	            xtype: 'displayfield',
	            labelWidth: 58, 
	            labelStyle: 'font-weight: bold;',
	            fieldLabel: 'ID card:',
	            value: portalUserUID
	        },{ 
	            xtype: 'grid',
	            width: 727,
	            margin: '25 0 25 0',
	            store: Ext.create('Ext.data.Store', {
	                model: 'MyMain.model.Payments',
	                autoLoad: true,
	                data:  this.data
	            }),
	            features: [{
	                ftype: 'summary'
	            }],
	            columns: [
	                {
	                    text: "Наименование услуги/Description",
	                    dataIndex: 'serviceName',
	                    menuDisabled: true,
	                    sortable: false,
	                    fixed: true,
	                    width: 233,
	                    summaryRenderer: function() {
	                        return 'Итого к оплате/To Pay';
	                    }
	                },{
	                    text: "Количество/Quantity (kg)",
	                    dataIndex: 'quantity',
	                    menuDisabled: true,
	                    sortable: false,
	                    fixed: true,
	                    width: 182
	                },{ 
	                    text: "Цена/Price",
	                    dataIndex: 'price',
	                    menuDisabled: true,
	                    sortable: false,
	                    fixed: true,
	                    width: 88
	                },{ 
	                    text: "Сумма, тенге/the amount of KZT",
	                    dataIndex: 'sum',
	                    menuDisabled: true,
	                    sortable: false,
	                    fixed: true,
	                    width: 224,
	                    summaryType: 'sum'
	                }
	            ]
	        },{
	            xtype: 'displayfield',
	            name: 'thingsReceiptDate',
				itemId:'recieptDate',
	            labelWidth: 149, 
	            labelStyle: 'font-weight: bold;',
	            fieldLabel: 'Дата приема вещей:',
	            renderer: function(value){
	            	value = new Date(parseInt(value));
	                return Ext.util.Format.date(value, 'd.m.Y');
	            }
	        },{
	            xtype: 'displayfield',
	            name: 'paymentDeadline',
	            labelWidth: 183, 
	            labelStyle: 'font-weight: bold;',
	            fieldLabel: 'Срок оплаты не позднее:',
	            renderer: function(value){
	              	value = new Date(parseInt(value));
	                return Ext.util.Format.date(value, 'd.m.Y');
	            }
	        },{
	            xtype: 'displayfield',
	            margin: '25 0 0 0',
	            value: 'В случае неуплаты в указанный срок блокируется предоставление услуг в Личном кабинете',
	            fieldCls: 'attention'
	        }
        ]; 
        this.callParent(); 
    }
});