Ext.define('MyMain.model.AvailableServiceType', {
	extend: 'Ext.data.Model',
	fields: [
		'groupName',
		'serviceCode',
     	'serviceName',
		'closed',
		'sortBy',
		'groupSortBy',
		'payCode'
    ]
});