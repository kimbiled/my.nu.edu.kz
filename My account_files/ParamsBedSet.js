Ext.define('MyMain.view.main.params.ParamsBedSet', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsbedset',
    cls:'noborder',
    itemId:'params',
    //height:100,'
    semestrInfo:null,
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
        const hasDiscount = false;//Ext.Ajax.paidStudentFund2;
        const mainController = MyMain.app.getController('Main');
        var paySumm = mainController.currentService.data.cost;
        this.originalCost = mainController.currentService.data.cost;
        var info = '<div><b> One Set</b> </div>';
        if (hasDiscount) {
            info += '<span style="color:#c76464; font-weight: bolder;">discount 20%</span>';
            console.log('Actual cost '+ paySumm);
            this.fullCost = paySumm;
            paySumm = paySumm - paySumm * 20 / 100;
            console.log(' -> discounted cost ' +paySumm );
        }
        info += '</div>';
        this.down('#paramsDetails').update(info);
        mainController.getServiceDetails().setPaySumm(paySumm);

        Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: basePath+'rest/services/info/hasAlreadyPaidService/'+mainController.currentService.data.id,
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    var isPaid = json.data;
                    if (isPaid) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'Bed Set has already been paid')
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
        return {type:'BedSet', originalCost:this.originalCost, fullCost: this.fullCost };
    }

});