Ext.define('MyMain.model.ServiceType', {
	extend: 'Ext.data.Model',
    
    requires:['MyMain.model.ServiceInfo'],
    
	fields: [
        'id',
        'name',
        'createDate',
        //{name: 'createDate', type: Ext.data.Types.DATE, dateFormat: 'd.m.Y H:i:s'},
        'status'
    ]
    
	,hasMany:[
		{
			model:'MyMain.model.ServiceInfo',
			name:'services'
		}
    ]
    
});