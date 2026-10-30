Ext.define('MyMain.model.Notification', {
	extend: 'Ext.data.Model',
    
	fields: [
        'id',
        'notificationType',
        'serviceCode',
        'message',
        'closed',
        'orderNumber',
        'status'
    ]
});