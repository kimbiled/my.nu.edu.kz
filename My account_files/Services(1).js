Ext.define('MyMain.store.main.Services', {
    extend: 'Ext.data.Store',
    model: 'MyMain.model.ServiceType',
	itemId:'servicesStore',
	
	isLoaded: false,
	autoLoad: false,

	proxy: {
		type: 'ajax',
		url: basePath+'rest/services/list',
		//url: basePath+'mock/servicesTypes.json',
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
          /*  console.log(store);
            console.log(records);*/

        }
    }
});