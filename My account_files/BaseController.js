/**
 * Abstract Controller. Provides common functionalty
 */
Ext.define('MyMain.controller.Base', {
    extend: 'Ext.app.Controller',
    
    /**
     * A custom logic to render views. If the view is already rendered
     * just display it. Otherwise create it on demand.
     */
    render: function(xtype) {
        var tabPanel= Ext.getCmp('viewport').child('tabpanel'),
            view    = tabPanel.child(xtype);
        
        if (!view) {
            view = tabPanel.add({
                xtype: xtype
            });
        }
        
        tabPanel.setActiveTab(view);
        return view;
    },
	
	isStoreModified: function(store)
	{
	  var modifiedRecords = store.getModifiedRecords();
	  return modifiedRecords && modifiedRecords.length  && modifiedRecords.length > 0;
	},

	reloadStores:function(storeNames){
		var me = this;
		Ext.each(storeNames, function(name){
			console.log('load store '+name);
			if(name !== 'main.Payments'){
                me.getStore(name).reload();
            }
		});
	}
});