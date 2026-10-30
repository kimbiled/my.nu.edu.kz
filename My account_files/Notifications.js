Ext.define('MyMain.store.main.Notifications', {
    extend: 'Ext.data.Store',
    model: 'MyMain.model.Notification',
	
	isLoaded: false,
	autoLoad: false,
    count:0,

	proxy: {
		type: 'ajax',
		url: basePath+'rest/services/notifications',
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
            this.count = 0;
            if(records!=null){
                this.count = records.length;
            }
            console.log('notifications loaded');
        }
    }
});