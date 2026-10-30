	Ext.define('MyMain.store.main.Semesters', {
    extend: 'Ext.data.Store',
    model: 'MyMain.model.Semester',
	
	isLoaded: false,
	autoLoad: true,

	proxy: {
		type: 'ajax',
		url: basePath+'rest/services/info/semestr',
		jsonData: {},
		reader: {
			type: 'json',
			root: 'data',
			successProperty: 'success'
		}
	},
	
    listeners: {
        'load' :  function(store,records,options) {
            console.log('semesters is loaded');
        }
    }
});