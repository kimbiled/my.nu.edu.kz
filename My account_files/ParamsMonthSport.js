Ext.define('MyMain.view.main.params.ParamsMonthSport', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsmonthsport',
    cls:'paramsmonth noborder',
    itemId:'params',

    layout: {
        type: 'vbox',
        align: 'left'
    },
    monthCount:1,
    sportInfo: null,
    originalCost: 0,
    fullCost:0,

    initComponent: function () {
        this.items = [
            {
                xtype: 'text',
                name: 'placesAvailable',
                anchor: '100%',
                id:'placesAvailable',
                fieldLabel: '',
                hidden: true,
                style: 'font-size: 13px; color: black;',
                value: 0
            },
             {
                 xtype: 'panel',
                 layout: {
                     type: 'hbox',
                     align: 'left'
                 },
                 cls:'paramsmonth noborder',
                 items: [
                     {
                         xtype: 'box',
                         itemId: 'monthParamDetails',
                         cls: 'details',
                         hidden: true,
                         html: ''
                     },
                     {
                         xtype: 'textfield',
                         fieldLabel: 'Months',
                         valueField: 'id',
                         displayField: 'name',
                         disableKeyFilter: true,
                         forceSelection: false,
                         readOnly: true,
                         value: 1,
                         width: 160,
                         labelWidth: 60,
                         listeners: {
                             'afterrender': function () {
                                 console.log("called after render");
                                 var count = 1;
                                 this.up().up().monthCount = count;
                                 console.log('month count = ' + count);
                                 var mainController = MyMain.app.getController('Main');
                                 var totalCost = count * mainController.currentService.data.cost;
                                 this.up().up().fullCost = totalCost;
                                 console.log('cost=' + mainController.currentService.data.cost + ', total cost = ' + totalCost);
                                 mainController.getServiceDetails().setPaySumm(totalCost);
                             }
                         }
                     }

                ]
             }
        ];
        this.callParent(arguments);
    },

    initParams:function(params){
        var mainController = MyMain.app.getController('Main');
        this.originalCost = mainController.currentService.data.cost;
        if (typeof(params)!='undefined' && params!=null){
            var details = this.down('#monthParamDetails');
            details.update(params);
            details.show();
        }
        Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        var me = this;
        Ext.Ajax.request({
            url: basePath+'rest/services/info/hasAlreadyPaidSport/'+mainController.currentService.data.id,
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    var isPaid = json.data;
                    if (isPaid) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'This sport pass has already been paid')
                    } else {
                        me.getSportInfo(me);
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
    setSportInfo:function(sportInfo){
        this.sportInfo = sportInfo;
    },

    getSportInfo:function(cmp){
        var mainController = MyMain.app.getController('Main');
        Ext.Ajax.request({
            url: basePath+'rest/services/info/sport/'+mainController.currentService.data.id,
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    this.setSportInfo(json.data);
                    if (!this.sportInfo.allowed){
                        mainController.getServiceDetails().showMsgDisableBtn('Warning', 'There are no free places'+ (this.sportInfo.nearestDate!=null?'. The nearest date with free spaces is on '+this.sportInfo.nearestDate:''));
                    }
                    var placesAvailable = cmp.down('#placesAvailable');
                    var availableSeatsCount=this.sportInfo.capacity-this.sportInfo.reservedSeats;
                    placesAvailable.setText('Places available:  '+availableSeatsCount);
                    if(availableSeatsCount>0) {
                        placesAvailable.show();
                    }
                    mainController.getServiceDetails().enablePayButton();
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
        return {type:'Month', value:this.monthCount, originalCost:this.originalCost, fullCost:this.originalCost*this.monthCount };
    }
});