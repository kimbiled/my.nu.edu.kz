Ext.define('MyMain.view.main.Payment', {
    extend: 'Ext.panel.Panel',
    xtype: 'payment',
    cls:'noborder',
    layout:'border',
    autoScroll: mobilecheck()?true:false,
    initComponent:function(){
        this.items = [
            {
                xtype:'mainservices',
                cls:'noborder',
                region:'west',
                width: mobilecheck()?'100%':300,
            }, 
            {
                xtype:'servicedetails',
                region:'center',
                cls:'noborder',
                margin:'0 0 0 0',
                width: '100%'
            }
        ];    
        this.callParent();
    }
});