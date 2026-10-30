Ext.define('MyMain.view.main.params.ParamsDormitory', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsdormitory',
    cls: 'paramsdormitory noborder',
    itemId: 'params',

    layout: {
        type: 'vbox',
        align: 'left'
    },

    defaults: {
        xtype: 'fieldcontainer',
        layout: {
            type: 'fit',
            align: 'left'
        }
    },
    currentCost: 0,
    originalCost: 0,
    dormitoryInfo: null,
    dormitoryInfos: [],
    fullCost:0,
    curSemesterDays: 0,
    fullYearDays: 0,

    initComponent: function () {
        this.items = [
            {
                xtype: 'panel',
                cls: 'noborder',
                itemId: 'paramsDetails',
                html: ''
            }, {
                xtype: 'radiogroup',
                fieldLabel: '',
                columns: 1,
                items: [
                    {boxLabel: 'Payment for semester', name: 'rb', inputValue: 1, checked: true},
                    // todo раскрыть для отображения выбора выплаты за год
                    // {boxLabel: 'Payment for the year', name: 'rb', inputValue: 2}
                ],
                listeners: {
                    'change': function( radiogroup, newValue, oldValue, eOpts ) {
                        var mainController = MyMain.app.getController('Main');
                        var type = newValue.rb;
                        switch (type) {
                            case 1:
                                mainController.getServiceDetails().setPaySumm((this.up().currentCost * this.up().curSemesterDays).toFixed(1));
                                this.up().changeInfo(this.up().curSemesterDays);
                                break;
                            case 2:
                                /**
                                 * Установка условии для годовой оплаты
                                 * */
                        }
                    }
                }
            }
        ];
        this.callParent(arguments);
    },

    initParams: function (params) {
        Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        var isFreeOfCharge = false;
        var me = this;
        Ext.Ajax.request({
            url: basePath + 'rest/services/info/socialCategory',
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success == true) {
                    var socialCategory = json.data;
                    //isFreeOfCharge = socialCategory.belongs == true && socialCategory.dsaApproved == true;
                    isValidSvcDate = new Date() <= new Date(socialCategory.svcdssexpireDate);
                    if (socialCategory.svcdsscommitteeDecision === 1 && isValidSvcDate) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Information',
                            'This service is free of charge. Expiration Date is ' + socialCategory.svcdssexpireDate);
                        var info = '<h5>This service is free of charge</h5>';
                        me.down('#paramsDetails').update(info);
                    } else {
                        this.requestDormitoryInfo();
                    }
                } else {
                    MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', json.errorMessage);
                }
            },
            failure: function () {
                Ext.MessageBox.hide();
                Ext.Msg.alert('Error', 'Error on retrieving social category info. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    },

    requestDormitoryInfo: function () {
        var me=this;
        Ext.Ajax.request({
            url: basePath + 'rest/services/info/dormitoryInfo',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = JSON.parse(response.responseText);
                if (json.success == true) {
                    console.log(json.data[0].curSemesterName);
                    me.hasHmsParams(json.data[0].curSemesterName);
                    this.setDormitoryInfo(json.data);
                } else {
                    var mainController = MyMain.app.getController('Main');
                    var serviceCode = ''+mainController.currentService.raw.id;
                    if(mainController.hasNotificationServiceCode==null || mainController.hasNotificationServiceCode!=serviceCode)
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', json.errorMessage);
                }
            },
            failure: function () {
                Ext.Msg.alert('Error', 'Error on getting dormitory info. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    },

    hasHmsParams: function(currentSemesterName){
        Ext.Ajax.request({
            url: basePath + 'rest/services/info/hasHmsParams?currentSemester=' + currentSemesterName,
            method: 'GET',
            scope: this,
            success: function (response) {
                const json = JSON.parse(response.responseText);
                if (json.success == true) {
                    if (!json.data) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'There are no available data in HMS');
                    }
                } else {
                    MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', json.errorMessage)
                }
            },
            failure: function () {
                Ext.Msg.alert('Error', 'Error on getting dormitory info. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    },

    setDormitoryInfo: function (dormitoryInfos) {
        console.log(dormitoryInfos);
        var mainController = MyMain.app.getController('Main');
        this.dormitoryInfos = dormitoryInfos;
        var dormitoryInfo = dormitoryInfos[0];
        this.dormitoryInfo = dormitoryInfos[0];
        if (dormitoryInfo == null || dormitoryInfo.cost <= 0) {
            mainController.getServiceDetails().showMsgDisableBtn('Error', 'Error on calculating service cost');
        }
        this.currentCost = dormitoryInfo.cost;
        this.originalCost = dormitoryInfo.cost;

        if(Ext.Ajax.paidStudentFund2) {
            this.originalCost = dormitoryInfo.cost/0.8;
        } else {
            this.originalCost = dormitoryInfo.cost;
        }

        this.curSemesterDays = dormitoryInfo.curSemesterDays;
        this.fullYearDays = dormitoryInfo.curSemesterDays + 12;
        mainController.currentService.raw.id = dormitoryInfo.serviceCode;
        console.log('Dormitory dormitoryInfo.hasDiscount ' + dormitoryInfo.hasDiscount);
        console.log('Dormitory original cost: '+this.originalCost  * dormitoryInfo.curSemesterDays);
        this.fullCost = this.originalCost  * dormitoryInfo.curSemesterDays;
        mainController.getServiceDetails().setPaySumm((dormitoryInfo.cost * dormitoryInfo.curSemesterDays).toFixed(1));
        mainController.isFundPaidBefore = dormitoryInfo.hasDiscount;
        this.changeInfo();
    },

    changeInfo: function () {
        this.isPaid(this.dormitoryInfo.orderSeatsId);
        this.hasDormitoryFeeDebt();
        console.log(this.dormitoryInfo.hasDiscount);
        var info = '';
        for(i=0;i<this.dormitoryInfos.length;i++){
            var dormitoryInfo = this.dormitoryInfos[i];
                if(i==0) {
                    if(this.dormitoryInfos.length<=1)
                    info += ' <div><b>  Dormitory fee: From ' + dormitoryInfo.startDate + ' to ' + this.addDays(dormitoryInfo.endDate, dormitoryInfo.additionalDays);
                    else
                    info += ' <div><b> '+(i+1)+') Dormitory fee: From ' + dormitoryInfo.startDate + ' to ' + this.addDays(dormitoryInfo.endDate, dormitoryInfo.additionalDays);

                    info += ', Living in ' + dormitoryInfo.seats + ' person room, ' + dormitoryInfo.curSemesterDays + ' days '+ ', cost: ' + (this.currentCost  * dormitoryInfo.curSemesterDays);
                     info += '</b></div>';
                }
                else {
                    info += '<br/><div>'+ (i+1)+')  Dormitory fee: From ' + dormitoryInfo.startDate + ' to ' + this.addDays(dormitoryInfo.endDate, dormitoryInfo.additionalDays);
                    info += ', Living in ' + dormitoryInfo.seats + ' person room, ' + dormitoryInfo.curSemesterDays + ' days'+ ', cost: ' + (this.currentCost  * dormitoryInfo.curSemesterDays);
                    info += '</div><br/><br/>';
                }
            }
        // if (this.dormitoryInfo.hasDiscount) {
        //     info += '<span style="color:#c76464">Discount 20%</span>';
        // }

        this.down('#paramsDetails').update(info);
    },

    addDays: function(endDate,days){
        var dateEnd= endDate;
        var date = Ext.Date.parse(endDate,'d.m.Y') ;
        console.log(date);
        date.setDate(date.getDate()+days);
        console.log(date);
        var day=date.getDate();
        var month=date.getMonth()+1;
        var year=date.getFullYear();
        if(day<10)
            day='0'+day;
        if(month<10)
            month='0'+month;
        var dateEndString= day+'.'+month+'.'+year;
        console.log(dateEndString);
        return dateEndString;
    },

    getParams: function () {
        return {
            type: 'Semester',
            serviceCode: this.dormitoryInfo.serviceCode,
            cost: this.dormitoryInfo.cost,
            hasDiscount: false,
            originalCost: this.originalCost,
            fullCost: this.fullCost,
            dormitoryInfo:this.dormitoryInfo
        };
    },

    isPaid:function(orderSeatsId){
        var dormitoryServCodes = [605, 606, 607, 608, 609, 610, 630, 631, 701, 702, 703, 704 ];
        const curSemesterName = this.dormitoryInfo.curSemesterName;
        Ext.Ajax.request({
            url: basePath+'rest/payments/hasPaymentOnSemester?semesterName=' + curSemesterName + '&serviceCodes=' + dormitoryServCodes+'&orderSeatsId='+orderSeatsId,
            method: 'GET',
            success: function(response) {
                var mainController = MyMain.app.getController('Main');

                const json = JSON.parse(response.responseText);
                if (json.success == true) {
                    if (json.data) {
                        var serviceCode = ''+mainController.currentService.raw.id;
                        if(mainController.hasNotificationServiceCode==null || mainController.hasNotificationServiceCode!=serviceCode)
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'This service fee has already been paid. Please contact our support – helpdesk@nu.edu.kz');
                    }
                } else {
                    MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', json.errorMessage)
                }
            },
            failure: function() {
                Ext.Msg.alert('Error','Error on checking payments. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    },

    hasDormitoryFeeDebt:function(){
        var me = this;
        Ext.Ajax.request({
            url: basePath+'rest/payments/hasDormitoryFeeDebt',
            method: 'GET',
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    const hasDormitoryFeeDebt = json.data;
                    if (hasDormitoryFeeDebt) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'Please pay the bill for Dormitory Fee in section "My payments"');
                    } else {
                        me.isPaid(me.dormitoryInfo.orderSeatsId);
                    }
                } else {
                    Ext.Msg.alert('Error', 'Error on service info retrieving: '+json.errorMessage+'. Please contact our support – helpdesk@nu.edu.kz');
                }
            },
            failure: function() {
                Ext.Msg.alert('Error','Error on checking paid Dormitory Fee payments. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    },

    countMonth: function (x) {
        var y = 365;
        var y2 = 31;
        var remainder = x % y;
        var casio = remainder % y2;
        var month = (remainder - casio) / y2;
        return month + " month " // + casio + " day";
    }
});