Ext.define('MyMain.store.main.UserInfo', {
    extend: 'Ext.data.Store',
    model: 'MyMain.model.UserInfo',
	isLoaded: false,
	autoLoad: false,
	proxy: {
		type: 'ajax',
		url: basePath +'rest/services/user',
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
            console.log('user info loaded');
        }
    }
});