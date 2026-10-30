Ext.define('MyMain.store.main.Payments', {
    extend: 'Ext.data.Store',
    model: 'MyMain.model.Payments',
	remoteSort: true,
    remoteFilter:true,
    pageSize: 10,
	isLoaded: false,
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: basePath +'rest/payments/list',
		jsonData: {},
		reader: {
			type: 'json',
			root: 'data',
			successProperty: 'success'
		} 
	},
    sorters: [
    	{
	        property: 'id',
	        direction: 'DESC'
    	}
    ],
    listeners: {
        'load' :  function(store,records,options) {
            this.isLoaded = true;
            console.log('services loaded');
        }
    }
});