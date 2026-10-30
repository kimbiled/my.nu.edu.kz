Ext.define('MyMain.view.main.params.ParamsRecovery', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsrecovery',
    cls:'noborder',
    itemId:'params',

    mantiaInfo:{
        downloadLink: null
    },
    originalCost:0,
    fullCost:0,


    initComponent: function () {
        this.items = [
            {
                xtype:'panel',
                cls:'noborder',
                itemId:'paramsDetails',
                html:''
            }
        ];
        this.callParent(arguments);
    },

    initParams:function(params){
        var controller = MyMain.app.getController('Main');
        Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: basePath+'rest/services/info/hasAlreadyPaidService/'+controller.currentService.data.id,
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    var isPaid = json.data;
                    if (isPaid) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'Recovery ID service has already been paid')
                    }
                } else {
                    mainController.getServiceDetails().disablePayButton();
                    Ext.Msg.alert('Error', 'Error on service info retrieving: '+json.error);
                }
            },
            failure: function () {
                Ext.MessageBox.hide();
                mainController.getServiceDetails().disablePayButton();
                Ext.Msg.alert('Error','Error on service info retrieving');
            }
        });
    },

    getParams:function(){
        return null;
    }
});