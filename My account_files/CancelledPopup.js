Ext.define('MyMain.view.main.CancelledPopup', {
    extend: 'Ext.window.Window',
    alias: 'widget.cancelledpopup',
    tabs: null,
    autoShow: true,
    modal: true,
    title: 'Refunded payment',
    cls:'bill-popup',
    initComponent:function(){
        this.items = [
			{
                xtype:'tabpanel',
                activeTab: 0,
                bodyCls: 'popup-tabs-body',
                items: this.tabs,
                padding: '5'
            }
        ];   
        this.dockedItems = [
            {
                dock: 'bottom',
                xtype: 'toolbar',
                items: [
                    {
                        xtype:'tbspacer',
                        flex:1
                    },{
                        xtype: 'button',
                        text: 'PDF',
                        disabled: true,
                        action: 'exportCancelledToPdf',
                        style: {
                            float: 'right'
                        }
                    }
                ]
            }
        ];
        this.callParent(); 
    }
});