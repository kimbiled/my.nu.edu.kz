Ext.define('MyMain.view.main.Menu', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.mainmenu',
	cls:'mainmenu-panel',
	border:'bottom',
	defaults :{
		xtype:'button',
		enableToggle: false,
		toggleGroup: 'clientMenu',
        //ui:'plain',
        width:250,
        scale:'medium'
	},
	bodyPadding:'0 0 0 0',
	//height:35,
	
	initComponent: function(){
        this.items = [
// •	Make a payment
// •	My account
			{
				text:'Make a payment',
				id:'makePaymentBtn',
				pressed:true,
				handler: function() {
					//MyMain.app.getController('Main').workersPersonsList();
				}
			},{
				text:'My account',
				id:'myAccountBtn',
				pressed:false,
                cls:'btn',
				handler: function() {
					//MyMain.app.getController('Main').workersStaffList();
                }
            }
		];
		this.callParent();
	}
});