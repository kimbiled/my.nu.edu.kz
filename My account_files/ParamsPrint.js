Ext.define('MyMain.view.main.params.ParamsPrint', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsprint',
    cls: 'paramsprint noborder',
    itemId: 'params',
    printAmount: 0,
    originalCost:0,
    fullCost:0,
    funding: null,
    initComponent: function () {
        var print = Ext.Ajax.servicesMap['151'];
        this.funding = print;

        var mainController = MyMain.app.getController('Main');
        this.originalCost =  mainController.currentService.data.cost;

        this.items = [
            {
                xtype: 'panel',
                cls: 'noborder',
                itemId: 'paramsDetails',
                html: ''
            }, {
                xtype: 'panel',
                cls: 'noborder',
                itemId: 'printDetails',
                items: [{
                        xtype: 'container',
                        defaultType: 'button',
                        width: 248,
                        defaults: {
                            margin: '0 15 10 0'
                        },
                        items: [{
                                text: 'Reports',
                                height: 20,
                                width: 100,
                                tooltip: 'History of money operations',
                                handler: function () {
                                    var store = Ext.data.StoreManager.lookup('payHistoryStore');
                                    if (Ext.isDefined(store) && store.getCount() > 0) {
                                        store.removeAll();
                                    }
                                    Ext.create('MyMain.view.main.params.ParamsPrintHistory').show();
                                }
                            } ]
                    }, {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [{
                                xtype: 'label',
                                id: 'printAmount',
                               // flex: 1,
                                margin: '10 10 5 0',
                                text: 'Print: 0 KZT'
                            }, {
                                xtype: 'component',
                                id: 'assignPrint',
                                //flex: 1,
                                margin: '10 10 0 0',
                                autoEl: {
                                    tag: 'a',
                                    href: '#',
                                    html: 'Print is not assigned'
                                },
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function() {
                                            Ext.create('MyMain.view.main.params.ParamsPrintAssign').show();
                                        }
                                    }
                                }
                            }, {
                                xtype: 'container',
                                width: 250,
                                margin: '10 10 5 0',
                                layout: {
                                    type: 'hbox',
                                    pack: 'end'
                                },
                                defaultType: 'component',
                                items: [{
                                        autoEl: {
                                            tag: 'a',
                                            target: '_blank',
                                            href: basePath + 'files/PrintSystem_Contract.pdf',
                                            html: 'Contract'
                                        }
                                    }, {
                                        autoEl: {
                                            tag: 'span',
                                            html: '&nbsp;/&nbsp;'
                                        }
                                    }, {
                                        autoEl: {
                                            tag: 'a',
                                            target: '_blank',
                                            href: basePath + 'files/PrintSystem_manual_ENG.pdf',
                                            html: 'Payment instructions'
                                        }
                                    }]
                            }]
                    }]
            }
        ];
       // mainController.currentService.raw.providerId = 4;
        this.callParent(arguments);
    },
    initParams: function (params) {
        var serviceDetails = MyMain.app.getController('Main').getServiceDetails();
        this.hidePrintAmount();
        var me = this;
        Ext.Ajax.request({
            url: basePath + 'rest/payments/printAccountExists',
            success: function (response) {
                var json = JSON.parse(response.responseText);
                if (json.success === true) {
                    if (json.data) {
                        Ext.Ajax.request({
                            url: basePath + 'rest/payments/printAmount',
                            success: function (response) {
                                var json = JSON.parse(response.responseText);
                                if (json.success === true) {
                                    me.printAmount = json.data;
                                    me.changeInfo();
                                } else {
                                    console.warn(json.errorMessage);
                                    me.down('#paramsDetails').update('<div>Unable to access the print system at this time. Please try again later or send E-mail to <a href="mailto:helpdesk@nu.edu.kz">helpdesk@nu.edu.kz</a></div><br/>');
                                    serviceDetails.disablePayButton();
                                }
                            },
                            failure: function () {
                                serviceDetails.showMsgDisableBtn('Error', 'Error on print amount retrieving');
                            }
                        });
                    } else {
                        console.warn(json.errorMessage);
                        serviceDetails.disablePayButton();
                    }
                } else {
                    console.warn(json.errorMessage);
                    serviceDetails.disablePayButton();
                }
            },
            failure: function () {
                serviceDetails.showMsgDisableBtn('Error', 'Error on check print account');
            }
        });
    },
    changeInfo: function () {
        this.showPrintAmount();
        MyMain.app.getController('Main').getServiceDetails().setPaySumm((this.funding.cost), 'editable');
    },
    getParams: function () {
        return {
            serviceCode: this.funding.serviceCode,
            cost: MyMain.app.getController('Main').getServiceDetails().paySumm,
            originalCost: this.originalCost,
            fullCost: this.funding.cost
        };
    },
    hidePrintAmount: function () {
        this.down('#printAmount').hide();
        this.down('#assignPrint').show();
    },
    showPrintAmount: function () {
        this.down('#assignPrint').hide();
        var amountCmp = this.down('#printAmount');
        amountCmp.update('Print: ' + this.printAmount + ' KZT');
        amountCmp.show();
    }
});