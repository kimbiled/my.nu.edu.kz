Ext.define('MyMain.view.main.BillPopup', {
    extend: 'Ext.window.Window',
    alias: 'widget.billpopup',
    tabs: null,
    autoShow: true,
    modal: true,
    title: 'Invoice for payment',
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
                        xtype : 'button',
                        text: 'Excel',
                        action: 'exportBillToExcel'
                    },{
                        xtype: 'button',
                        text: 'PDF',
                        action: 'exportBillToPdf',
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