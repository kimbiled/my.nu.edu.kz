Ext.define('MyMain.model.ServiceInfo', {
	extend: 'Ext.data.Model',
	fields: [
        'id',
        'name',
        'currency',
        {name:'cost', type:'NUMBER'},
        'providerId',
        'dateFrom',
        'dateTo',
        'needPayments',
        'info',
        'hasAdditionalInfo',
        'hasPaymentInstruction'
    ]
});