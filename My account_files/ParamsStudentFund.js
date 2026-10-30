Ext.define('MyMain.view.main.params.ParamsStudentFund', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsStudentFund',
    cls: 'paramsStudentFund noborder',
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
    semesterInfo: null,
    funding: null,
    originalCost: 0,

    initComponent: function () {
        var semesterFund = Ext.Ajax.servicesMap['611'];
        var semesterFundAdd = Ext.Ajax.servicesMap['612'];
        this.funding = semesterFund;
        var mainController = MyMain.app.getController('Main');
        this.originalCost =  mainController.currentService.data.cost;
        var me = this;
        window.paramsStudentFundView = this;
        this.items = [
            {
                xtype: 'combo',
                itemId: 'paramsSemester',
                store:'main.Semesters',
                fieldLabel: 'Payment semester',
                valueField: 'name',
                displayField: 'name',
                disableKeyFilter: true,
                width: 275,
                labelWidth: 120,
                listeners: {
                    select: function(combo) {
                        me.changeInfo();
                    },
                    afterrender: function(combo) {
                        console.log('Combobox is rendered ' +  combo.getStore().getAt(0));
                        var recordSelected = combo.getStore().getAt(0);
                        combo.setValue(recordSelected.get('name'));
                        me.changeInfo();
                    }
                }
            },
            {
                xtype: 'panel',
                cls: 'noborder',
                itemId: 'paramsDetails',
                width: 400,
                html: ''
            }
            /*
            {
                xtype: 'radiogroup',
                fieldLabel: '',
                columns: 1,
                items: [
                    {boxLabel: 'Payment for semester', name: 'rb', inputValue: 1, style: 'color: #3a6cbf;font-weight: bold;', checked: true}
                ],
                listeners: {
                    'change': function( radiogroup, newValue, oldValue, eOpts ) {
                        var me = this;
                        var mainController = MyMain.app.getController('Main');
                        var type = newValue.rb;
                        switch (type) {
                            case 1:
                                this.up().funding = semesterFund;
                                mainController.currentService.raw.id = semesterFund.id;
                                mainController.currentService.raw.cost = semesterFund.cost;
                                break;
                            case 2:
                                this.up().funding = yearFund;
                                mainController.currentService.raw.id = yearFund.id;
                                mainController.currentService.raw.cost = yearFund.cost;
                                break;
                            case 3:
                                this.up().funding = semesterFundAdd;
                                mainController.currentService.raw.id = semesterFundAdd.id;
                                mainController.currentService.raw.cost = semesterFundAdd.cost;
                                break;
                        }

                        if (Ext.Ajax.paidStudentFund2) {
                            if (mainController.currentService.raw.id == semesterFund.id) {
                                MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning',
                                    'This service fee has already been paid. Please contact our support – helpdesk@nu.edu.kz');
                                mainController.getServiceDetails().setPaySumm(this.up().funding.cost, '');
                            }
                            if (mainController.currentService.raw.id == semesterFundAdd.id) {
                                MyMain.app.getController('Main').getServiceDetails().enablePayButton();
                                mainController.getServiceDetails().setPaySumm(this.up().funding.cost, 'editable');
                            }
                        } else {
                            if (mainController.currentService.raw.id == semesterFundAdd.id) {
                                MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning',
                                    'First you must to pay for semester');
                                mainController.getServiceDetails().setPaySumm(this.up().funding.cost, '');
                            } else {
                                MyMain.app.getController('Main').getServiceDetails().enablePayButton();
                                mainController.getServiceDetails().setPaySumm(this.up().funding.cost, 'editable');
                            }
                        }
                    }
                }
            }
            */
        ];
        this.callParent(arguments);
    },

    initParams: function (params) {
        // if (Ext.Ajax.paidStudentFund2  ) {
        //     MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'This service fee has already been paid. ' +
        //         'Please contact our support – helpdesk@nu.edu.kz');
        //     return null;
        // }
        /*Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });*/
        // var me = this;
        // Ext.Ajax.request({
        //     url: basePath + 'rest/services/info/semestr',
        //     method: 'GET',
        //     success: function (response) {
        //         Ext.MessageBox.hide();
        //         var json = JSON.parse(response.responseText);
        //         if (json.success == true) {
        //             me.semesterInfo = json.data;
        //             me.changeInfo();
        //         } else {
        //             MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', json.errorMessage);
        //         }
        //     },
        //     failure: function () {
        //         Ext.MessageBox.hide();
        //         Ext.Msg.alert('Error', 'Error on service info retrieving');
        //     }
        // });
        console.log('-----------------> called initParams method');
        this.changeInfo();
    },

    changeInfo: function () {
        var combobx = this.down('#paramsSemester');
        var mainController = MyMain.app.getController('Main');
        var semesterFund = Ext.Ajax.servicesMap['611'];
        var semesterFundAdd = Ext.Ajax.servicesMap['612'];

        if (Ext.Ajax.paidStudentFund2) {
            var serviceCode = ''+mainController.currentService.raw.id;
            if(mainController.hasNotificationServiceCode==null || mainController.hasNotificationServiceCode!=serviceCode)
                MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'This service fee has already been paid. Please contact our support – helpdesk@nu.edu.kz');
        }

            // if (Ext.Ajax.academicDescription.level === 'NUFYP' && Ext.Ajax.academicDescription.school === 'CPS') {
            //     this.funding = semesterFundAdd;
            //     MyMain.app.getController('Main').getServiceDetails().setPaySumm((this.funding.cost), '');
            // } else {
                Ext.MessageBox.show({
                    msg: 'service info retrieving',
                    progressText: 'service info retrieving',
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: basePath+'rest/services/info/getServiceCostForSemester/'+mainController.currentService.data.id + '/'+combobx.findRecord('name', combobx.getValue()).data.name,
                    method: 'GET',
                    scope: this,
                    success: function (response) {
                        Ext.MessageBox.hide();
                        var json = JSON.parse(response.responseText);
                        if (json.success==true){
                            var serviceCost = json.data.cost;
                            MyMain.app.getController('Main').getServiceDetails().setPaySumm((serviceCost), 'editable');
                            this.funding = semesterFund;
                            MyMain.app.getController('Main').getServiceDetails().setPaySumm((serviceCost), 'editable');
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
            //}

        this.semesterInfo = combobx.findRecord('name', combobx.getValue()).data;
        var info = ' ';
        info += '<div><b>' + this.semesterInfo.name;
        if(this.semesterInfo.dateStart !== null){
            info += ' From </b>' + this.semesterInfo.dateStart + ' <b>to</b> ' + this.semesterInfo.dateEnd;
        }
        info += '</div><br/>';
        this.down('#paramsDetails').update(info);
        this.checkPaidForSemester(combobx, mainController);
    },

    getParams: function () {
        return {
            type: 'Semester',
            serviceCode: this.funding.serviceCode,
            cost: MyMain.app.getController('Main').getServiceDetails().paySumm,
            fullCost: MyMain.app.getController('Main').getServiceDetails().paySumm,
            semesterInfo:this.semesterInfo,
            originalCost:this.originalCost
        };
    },

    checkPaidForSemester: function(combo, mainController){
        Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        Ext.Ajax.request({
            url: basePath+'rest/payments/hasAlreadyPaidForSemester/'+mainController.currentService.data.id + '/'+combo.findRecord('name', combo.getValue()).data.name,
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    var isPaid = json.data;
                    if (isPaid) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'This service fee has already been paid. Please contact our support – helpdesk@nu.edu.kz')
                    }else {
                        MyMain.app.getController('Main').getServiceDetails().enablePayButton();
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
    }
});