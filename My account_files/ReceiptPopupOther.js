Ext.define('MyMain.view.main.ReceiptPopupOther', {
    extend: 'Ext.window.Window',
    alias: 'widget.receiptpopupother',
    tabs: null,
    autoShow: true,
    modal: true,
    title: 'Payment',
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
                        action: 'exportReceiptOtherToPdf',
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