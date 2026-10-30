Ext.define('MyMain.view.main.params.ParamsMantia', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsmantia',
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
        var me = this;
        controller.getServiceDetails().disablePayButton();
        Ext.Ajax.request({
            url: basePath+'rest/payments/hasPaidForMantia',
            method: 'GET',
            success: function(response) {
                if(JSON.parse(response.responseText).data) {
                    console.log("Is Mantia is already paid? " + response.responseText);
                    controller.getServiceDetails().disablePayButton();
                    me.mantiaInfo.downloadLink = 'https://my.nu.edu.kz/my-main-web/rest/payments/agree/downloadServiceTerms/620?agreementNumber=' + JSON.parse(response.responseText).data;
                    console.log('this.yearPlanInfo.beginDate');
                    console.log(me.mantiaInfo.downloadLink);
                    var info = '<div style="font-weight: bolder"><a href="'+ me.mantiaInfo.downloadLink +'" target="_blank">Download agreement</a></div>';
                    me.down('#paramsDetails').update(info);
                    //controller.getServiceDetails().showMsgDisableBtn('Warning', 'This service fee has already been paid. Please contact our support вЂ“ helpdesk@nu.edu.kz');
                } else {
                    controller.getServiceDetails().enablePayButton();
                }
            },
            failure: function() {
                Ext.Msg.alert('Error','Error on checking paid Mantia payments');
            }
        });
    },

    getParams:function(){
        return null;
    }
});