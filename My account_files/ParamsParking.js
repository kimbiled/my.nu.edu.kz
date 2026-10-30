Ext.define('MyMain.view.main.params.ParamsParking', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsparking',
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
    fullCost: 0,
    paymentAllowed: false,
    parkingInfo: null,


    initComponent: function () {
        this.items = [
            {
                xtype: 'panel',
                cls: 'noborder',
                itemId: 'paramsDetails',
                html: ''
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

        var me = this;
        this.requestParkingInfo();
    },

    requestParkingInfo: function () {
        var me=this;
        Ext.Ajax.request({
            url: basePath + 'rest/services/info/parkingInfo',
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                console.log('response.data: ');
                console.log(response);
                var json = JSON.parse(response.responseText);
                if (json.success == true) {
                    if(json.data!=null)
                    me.setParkingInfo(json.data);
                    console.log('json.data: ');
                    console.log(json.data);

                } else {
                    var mainController = MyMain.app.getController('Main');
                    var serviceCode = ''+mainController.currentService.raw.id;
                    if(mainController.hasNotificationServiceCode==null || mainController.hasNotificationServiceCode!=serviceCode)
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', json.errorMessage);
                }
            },
            failure: function () {
                Ext.MessageBox.hide();
                Ext.Msg.alert('Error', 'Error on getting parking info. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    },

    setParkingInfo: function (parkingInfo) {
        console.log('parkingInfo');
        console.log(parkingInfo);
        var mainController = MyMain.app.getController('Main');

        this.parkingInfo = parkingInfo;

        this.currentCost = this.parkingInfo.cost;
        this.fullCost = this.parkingInfo.cost;
        this.paymentAllowed = parkingInfo.paymentAllowed;
        mainController.currentService.raw.id = parkingInfo.serviceCode;
        console.log('Parking cost: '+this.currentCost );
        console.log('Parking paymentAllowed: '+this.paymentAllowed );
        if(this.parkingInfo.ticketStatusId===4) {
            var dayPassed=  this.addDays(this.parkingInfo.startDate, 3);
            var errorText = 'Dear student, your payment deadline passed '+dayPassed+' . Your parking spot booking is cancelled. Please contact DSA to re-book a place, if there is any left' ;
            Ext.Msg.alert('Error',errorText);
            mainController.getServiceDetails().disablePayButton();

        }
        else {
            if(this.paymentAllowed) {
                mainController.getServiceDetails().enablePayButton();
            }
            else {
                mainController.getServiceDetails().disablePayButton();
            }
        }

        mainController.getServiceDetails().setPaySumm(parkingInfo.cost);

        this.changeInfo();
    },

    changeInfo: function () {

        var info = '';
        var today = new Date();
       // var dd = Ext.Date.format(today.getDate(),'d.m.Y');
        var dd1 = Ext.Date.format(today,'d.m.Y');

            if(this.parkingInfo!=null) {
                info += ' <div><b>  Parking period:  ' + this.parkingInfo.startDate + ' - ' + this.parkingInfo.endDate+'</b></div>';
                console.log(this.parkingInfo.paidRecords);
                var paidRecords  = parseInt(this.parkingInfo.paidRecords);
                if(paidRecords > 0) {
                    var addDays =this.addDays(this.parkingInfo.startDate, -10);
                    console.log('Params paidRecords: '+this.parkingInfo.paidRecords);
                    console.log('Params addDays: '+addDays);

                    info += ' <div><b>  Payment accepted:  ' + addDays  + ' - '+ this.addDays(this.parkingInfo.startDate, 3) + '</b></div>';
                }
                else {
                  //  console.log('Params dd: '+dd);
                    console.log('Params dd: '+dd1);
                    info += ' <div><b>  Payment accepted:  ' + dd1 + ' - ' + this.addDays(this.parkingInfo.startDate, 3) + '</b></div>';
                }

                info += ' <div><b>  Parking number:  ' +this.parkingInfo.parkingPlaceCode+'</b></div>';
            }



        this.down('#paramsDetails').update(info);
    },

    addDays: function(endDate,days){
        var dateEnd= endDate;
        dateEnd = dateEnd.split(".").reverse().join();
        var date = new Date(dateEnd);
        date.setDate(date.getDate()+days);
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
            serviceCode: this.parkingInfo.serviceCode,
            cost: this.parkingInfo.cost,
            fullCost: this.fullCost,
            parkingInfo:this.parkingInfo,
            originalCost: this.parkingInfo.cost
        };
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