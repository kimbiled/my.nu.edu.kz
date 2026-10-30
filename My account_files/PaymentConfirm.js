Ext.define('MyMain.view.main.PaymentConfirm', {
    extend: 'Ext.panel.Panel',
    xtype: 'paymentconfirm',
    layout: {
        type: 'vbox',
        align: 'stretch',
        padding: 5
    },
    form: null,
    initComponent: function () {
        var frm = Ext.create('MyMain.view.main.PaymentConfirmForm');
        this.items = [frm];
        this.form = frm;
        this.callParent(arguments);
    },

    loadRecord: function (record) {
        this.form.loadRecord(record);
    }
});

Ext.define('MyMain.view.main.PaymentConfirmForm', {
    extend: 'Ext.form.Panel',
    xtype: 'paymentconfirmform',

    bodyPadding: 20,
    buttonAlign: 'left',
    autoScroll: true,
    url: running_mode == 'prod' ? 'https://epay.kkb.kz/jsp/process/logon.jsp' : 'https://testpay.kkb.kz/jsp/process/logon.jsp',
    //url: 'https://epay.kkb.kz/jsp/process/logon.jsp',    // Prod
    // url: 'https://testpay.kkb.kz/jsp/process/logon.jsp',    // Тест
    standardSubmit: true,

    initComponent: function () {

        Ext.applyIf(this, {
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 185,
                msgTarget: 'side'
            },
            items: [{
                xtype: 'fieldset',
                title: 'Payment confirmation',
                defaultType: 'textfield',
                defaults: {
                    width: 480
                },
                items: [{
                    xtype: 'hidden',
                    name: 'Language',
                    value: 'rus'
                }, {
                    fieldLabel: 'Payment ID',
                    readOnly: true,
                    name: 'orderNumber'
                }, {
                    fieldLabel: 'Payment Sum',
                    readOnly: true,
                    name: 'paySumm'
                }, {
                    fieldLabel: 'E-mail',
                    allowBlank: false,
                    name: 'email'
                }, {
                    xtype: 'hidden',
                    name: 'BackLink'
                    //value : window.location.origin+basePath+'rest/payments/completePayment'
                }, {
                    xtype: 'hidden',
                    name: 'FailureBackLink'
                    //value : window.location.origin+basePath+'rest/payments/cancelPayment'
                }, {
                    xtype: 'hidden',
                    name: 'PostLink'
                    //value : window.location.origin+basePath+'rest/payments/paypost'
                }, {
                    xtype: 'hidden',
                    name: 'Signed_Order_B64'
                }, {
                    xtype: 'hidden',
                    name: 'appendix'
                }, {
                    xtype: 'hidden',
                    name: 'person_id'
                }, paymentType != 'ALFA' ? null : {
                    xtype: 'box',
                    cls: 'closing',
                    itemId: 'LotosContacts',
                    html: '<br/>ТОО «Лотос - Астана Компани»'+
                    '<br/>БИН  030340004642'+
                    '<br/>г. Астана,  Кабанбай Батыра 53'+
                    '<br/>тел. (7172)79-30-96'
                }]
            }],
            buttons: [
                {
                    text: 'Proceed to payment',
                    action: 'doPay2',
                    margin: '0 0 0 12',
                    formBind: true,
                    handler: this.proceedPayment
                }, {
                    text: 'Cancel',
                    margin: '0 0 0 12',
                    action: 'cancel'
                },
                running_mode == 'prod' ? null : {
                    text: 'ТЕСТ',
                    margin: '0 0 0 12',
                    action: 'test'
                }
            ]
        });

        this.callParent(arguments);

    },

    proceedPayment: function () {
        //var me = Ext.ComponentQuery.query('paymentconfirmform')[0];

        localStorage.setItem("payment", "paid");
        MyMain.app.getController('Main').markPaid();
        if (paymentType == 'ALFA') {
            window.location.replace(alfaBankUrl);
        } else {
            this.up('form').getForm().submit();
        }
    }
});