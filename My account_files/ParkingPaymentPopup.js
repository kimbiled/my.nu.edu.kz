Ext.define('MyMain.view.main.ParkingPaymentPopup', {
    extend: 'Ext.window.Window',
    alias: 'widget.parkingpaymentpopup',
    tabs: null,
    autoShow: true,
    modal: true,
    title: 'Parking payment',
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
                    }
                ]
            }
        ];
        this.callParent(); 
    }
});