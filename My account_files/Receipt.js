Ext.define('MyMain.view.main.Receipt', {
    extend: 'Ext.form.Panel',
    xtype: 'receipt',
    padding: '10',
    cls:'noborder',
    data: null,

    initComponent:function(){
        this.items = [
	        {
	            xtype: 'displayfield',
	            labelWidth: 55,
	            value: '"Личный кабинет пользователя"'
	        },{
	            xtype: 'displayfield',
	            fieldLabel: 'Адрес',
	            labelWidth: 43,
	            value: 'Казахстан, г.Астана, пр. Кабанбай батыра, д.53'
	        },{
	            xtype: 'displayfield',
	            name: 'paymentDate',
	            labelWidth: 90,
	            fieldLabel: 'Дата и время',
	            renderer: function(value){
	              	value = new Date(parseInt(value));
	                return Ext.util.Format.date(value, 'd.m.Y');
	            }
	        },{
	            xtype: 'displayfield',
	            name: 'paymentDocNumber',
	            labelWidth: 86,
	            margin: '25 0 0 0',
	            fieldLabel: 'ID операции'
	        },{
	            xtype: 'displayfield',
	            labelWidth: 97,
	            fieldLabel: 'Обучающийся',
	            value: portalUserName
	        },{
	            xtype: 'displayfield',
	            labelWidth: 157,
	            fieldLabel: 'ID карта обучающегося',
	            value: portalUserUID
	        },{
	            xtype: 'displayfield',
	            labelWidth: 48,
	            name: 'serviceName',
	            fieldLabel: 'Услуга'
	        },
			{
	            xtype: 'displayfield',
	            labelWidth: 80,
	            fieldLabel: 'Получатель',
	            value: 'ЧУ "USM"'
	        },{
	            xtype: 'displayfield',
	            labelWidth: 104,
	            margin: '25 0 0 0',
	            name: 'paymentAmount',
	            fieldLabel: 'Сумма платежа'
	        }
        ];   
        this.callParent();  
    }
});