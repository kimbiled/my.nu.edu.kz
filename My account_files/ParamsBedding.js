Ext.define('MyMain.view.main.params.ParamsBedding', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsbedding',
    cls:'paramsbedding noborder',
    itemId:'params',

    layout: {
        type: 'anchor',
        align: 'left'
    },

    defaults:{
        xtype:'fieldcontainer',
        layout: {
            type: 'column',
            align: 'left'
        }
    },
    currentCost:0,
    fullCost:0,
    serviceCosts:[],

    initComponent: function () {
        var beddingItems = [];
        var beddingCodes = ['407', '404', '405', '406'];
        for (id in beddingCodes) {
            //todo Добавить проверку на null в @Ext.Ajax.servicesMap[]
            beddingItems.push(Ext.Ajax.servicesMap[beddingCodes[id]]);
        }
        this.items = [
            {
                xtype:'panel',
                cls:'noborder',
                itemId:'paramsDetails',
                border: 2,
                html:''
            }
        ];
        var bedItem;
        this.currentCost = 0;
        for(var i=0, len=beddingItems.length; i < len; i++){
            bedItem = beddingItems[i];
            var itemCost = bedItem.cost;
            // if (Ext.Ajax.paidStudentFund2) {
            //     itemCost = bedItem.cost - bedItem.cost * 20 / 100;
            //     console.log('Actual cost '+ bedItem.cost + ' -> discounted cost ' +itemCost );
            //
            // }
            this.currentCost += itemCost;
            this.fullCost += bedItem.cost;
            this.items.push({
                items:[
                    {
                        xtype: 'label',
                        html: bedItem.name,
                        columnWidth: 0.4,
                        style: {
                            'text-align': 'right',
                            'padding-right': '10px'
                        }
                    },
                    {
                        xtype:'checkbox',
                        checked: true,
                        listeners: {'change':{fn:this.recalcSum, scope:this}},
                        cost: itemCost,
                        originalCost:bedItem.cost,
                        serviceCode: bedItem.id,
                        columnWidth: 0.2
                    },
                    {
                        xtype:'box',
                        cls:'cost',
                        width:50,
                        html:''+itemCost,
                        columnWidth: 0.4
                    }
                ]
            });
        }
        this.callParent(arguments);
    },

    recalcSum:function(cmp){
        if (cmp.checked){
            this.currentCost += cmp.cost;
        } else {
            this.currentCost -= cmp.cost;
        }
        var mainController = MyMain.app.getController('Main');
        mainController.currentService.raw.cost = this.currentCost;
        mainController.getServiceDetails().setPaySumm(this.currentCost);
    },

    initParams:function(params){
        MyMain.app.getController('Main').getServiceDetails().setPaySumm(this.currentCost);
        // if (Ext.Ajax.paidStudentFund2) {
        //     this.down('#paramsDetails').update('<span style="color:#c76464; font-weight: bolder">discount 20%</span>');
        // }
        /*
        Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        var me = this;
        Ext.Ajax.request({
            url: basePath+'rest/services/info/hasAlreadyPaidService/'+MyMain.app.getController('Main').currentService.data.id,
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    var isPaid = json.data;
                    if (isPaid) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'Bedding has already been paid')
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
        */
    },

    getParams:function(){
        var subServices = [];
        var checkbox;
        var fieldContainers = this.query('fieldcontainer');
        Ext.each(fieldContainers, function(cnt)
        {
            checkbox = cnt.down('checkbox');
            if (checkbox.checked){
                subServices.push({serviceCode:checkbox.serviceCode, count:1, fullCost:checkbox.originalCost, originalCost:checkbox.originalCost});
            }
        });
        return {type:'Bedding', fullCost: this.fullCost,subServices:subServices};
    }
});