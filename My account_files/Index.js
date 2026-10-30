Ext.define('MyMain.view.main.Index', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainindex',
    layout:'border',
    cls:'noborder',

    initComponent:function(){
        this.items = [
            {
                region:'center',
                xtype:'tabpanel',
                activeTab: 0,
                items: [
                    {
                        xtype:'payment',
                        header: {},
                        layout: mobilecheck()?'vbox':''
                    },
                    {
                        xtype:'myaccount',
                        header: {},
                        width: 800
                    }
                ]
            }
        ];
        this.callParent();
    }
});