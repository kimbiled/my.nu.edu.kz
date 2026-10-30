Ext.define('MyMain.view.main.Account', {
    extend: 'Ext.panel.Panel',
    xtype: 'myaccount',
    cls:'noborder',
    width: 800,
    autoScroll: mobilecheck()?true:false,
    initComponent:function(){
        this.items = [
        	{
        		xtype: 'filterpanel'
        	},
			{
				xtype: 'userpaymentlist'
			}
        ];    
        this.callParent();
    }
});