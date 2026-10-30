Ext.application({
    name: 'MyMain',
    appFolder : basePath+'js-app/mymain',

    requires: [
        //'Ext.ux.Router' // Require the UX
        //'Ext.ux.grid.FiltersFeature',
        //'Ext.ux.ExtCombo' // Require the UX
    ],
    //enableRouter: true,
    autoCreateViewport: false,

    controllers: [
		'Main'
    ],


    launch: function() {
        console.log('MyMain started');
		Ext.Ajax.timeout= 360000; // 60 seconds
		Ext.override(Ext.form.Basic, { timeout: Ext.Ajax.timeout / 1000 });
		Ext.override(Ext.data.proxy.Server, { timeout: Ext.Ajax.timeout });
		Ext.override(Ext.data.Connection, { timeout: Ext.Ajax.timeout });
		var vp = Ext.create("MyMain.view.Viewport");
		vp.setHeight(Math.max(document.getElementById('mymainbody').offsetParent.clientHeight-2, 600));
		console.log("MyMain app: Viewport created");
		Ext.defer(function(){
			MyMain.app.getController('Main').index();
		}, 10, this);
    }
});


Ext.data.writer.Json.override({
	getRecordData:function (record) {
		var me = this, i, association, childStore, data = {};
		data = me.callParent([record]);

		/* Iterate over all the hasMany associations */
		for (i = 0; i < record.associations.length; i++) {

			association = record.associations.get(i);
			if (association.type == 'hasMany') {
				data[association.name] = [];
				childStore = eval('record.' + association.name + '()');

				//Iterate over all the children in the current association
				childStore.each(function (childRecord) {

					//Recursively get the record data for children (depth first)
					var childData = this.getRecordData.call(this, childRecord);
					if (childRecord.dirty | childRecord.phantom | (childData != null)) {
						data[association.name].push(childData);
						record.setDirty();
					}
				}, me);
			}

			if(association.type == 'belongsTo') {
				// we need ucfirst
				var method = 'get' + association.name.charAt(0).toUpperCase() + association.name.slice(1);
				var childRecord = eval('record.' + method + '()');
				var childData = this.getRecordData.call(this, childRecord);

				if (childRecord.dirty | childRecord.phantom | (childData != null)) {
					data[association.name] = childData;
					record.setDirty();
				}
			}
		}
		return data;
	}
});