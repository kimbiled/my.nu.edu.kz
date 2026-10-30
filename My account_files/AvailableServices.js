Ext.define('MyMain.store.main.AvailableServices', {
    extend: 'Ext.data.Store',
    model: 'MyMain.model.AvailableServiceType',
	
	isLoaded: false,
	autoLoad: false,

	proxy: {
		type: 'ajax',
		url: basePath+'rest/services/list2',
		jsonData: {},
		reader: {
			type: 'json',
			root: 'data',
			successProperty: 'success'
		}
	},
	
    listeners: {
        'load' :  function(store,records,options) {
            this.isLoaded = true;
            console.log('services loaded');
        }
    }
});