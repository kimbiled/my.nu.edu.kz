Ext.define('MyMain.view.main.ServiceDetails', {
    extend: 'Ext.panel.Panel',
    xtype: 'servicedetails',
    hidden:true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    paySumm:null,
    serviceId:null,
    groupId:null,

    initComponent: function () {
        this.items = [
            {
                xtype:'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch',
                    pack:'end'
                }, 
                cls:'badge-warning service-warning',
                padding:10,
                hidden:true,
                itemId:'serviceInfo',
                items:[
                    {
                        xtype:'box',
                        cls:'information',
                        html:' '
                    }, 
                    {
                        xtype: 'box',
                        cls:'closing',
                        itemId:'closeInfo',
                        html:'<a class="label">Close</a>'
                    }
                ]
            },
            {
                xtype:'panel',
                region:'center',
                padding: '10',
                cls: 'service-details-panel noborder',
                title:'<h5 class="b-blue b-blue__l--nb">Service details</h5>',
                layout: 'vbox',
                items:[
                    {
                        xtype: 'label',
                        itemId: 'serviceName',
                        text: '',
                        overflowY: 'auto',
                        height: 228
                    },
                    {
                        xtype:'panel',
                        layout: 'hbox',
                        width: '100%',
                        cls: 'noborder',
                        items: [
                            {
                                xtype: 'box',
                                itemId: 'paymentInstructions',
                                autoEl: {
                                	tag: 'a', 
                                	target: '_blank', 
                                	cls: 'label', 
                                	html: 'Payment Instructions'
                                },
                                padding: '20 0 0 0',
                                width: 120
                            },
                            {
                                xtype:'tbspacer',
                                flex:1
                            },
                            {
                                xtype: 'box',
                                itemId: 'moreInfo',
                                autoEl: {
                                	tag: 'a', 
                                	target: '_blank', 
                                	cls: 'label', 
                                	html: 'More info ...'
                                },
                                padding: '20 0 0 0',
                                width: 68
                            }
                        ]
                    },
                    
                ]
            },
            {
                xtype:'panel',
                region:'south',
                cls:'service-details-panel noborder',
                margin:'5 0 0 0',
                padding: '10',
                title:'<h5 class="b-blue b-blue__l--nb">Payment details</h5>',
                overflowY: 'auto',
                height: 257,
                layout: {
                    type: 'anchor',
                    align: 'stretch',
                    pack : 'end'
                },
                items:[
                    {
                        xtype: 'panel',
                        itemId: 'paymentParams',
                        region: 'center',
                        cls:'noborder',
                        margin: '10 0 0 0',
                        layout: {
                            type: 'vbox',
                            align: 'stretch',
                            pack : 'end'
                        }
                    }, {
                        xtype: 'textfield',
                        itemId: 'editableSum',
                        fieldLabel: 'Sum',
                        allowBlank: false,
                        hidden: true,
                        anchor: '70%',
                        style: 'font-weight: 900; font-size: 15px; text-transform: uppercase;',
                        listeners: {
                            'render': function(c) {
                                c.getEl().on('keyup', function() {
                                    var controller = MyMain.app.getController('Main');
                                    controller.getServiceDetails().paySumm = this.value;
                                    if (this.value < controller.currentService.raw.cost) {
                                        controller.getServiceDetails().disablePayButton();
                                        this.setFieldStyle('border-color: #c30');
                                    } else if(controller.currentService.raw.cost<=0 && controller.currentService.raw.id!=151){
                                        controller.getServiceDetails().disablePayButton();
                                    }
                                        else {
                                        controller.getServiceDetails().enablePayButton();
                                        this.setFieldStyle('border-color: #ccc');
                                    }
                                }, c);
                            }
                        }
                    },
                    {
                        xtype:'panel',
                        id: 'serviceDetailPaymentPanel',
                        cls:'noborder',
                        region:'south',
                        margin: '10 0 0 0',
                        layout: {
                            type: 'hbox',
                            align: 'stretch',
                            pack : 'end'
                        },
                        items:[
                            {
                                xtype: 'label',
                                itemId: 'paymentSumm',
                                margin: '10 30 0 0',
                                style: 'font-weight: 900; font-size: 15px; text-transform: uppercase;',
                                height: 20,
                                hidden: true
                            },{
                                xtype:'button',
                                action:'doPaymentStep1',
                                text:'<span href="#" class="btn btn--caps-uppercase">Pay off</span>'
                            }
                        ]
                    },
                    {
                        xtype:'panel',
                        id: 'serviceTestCheckPayment',
                        cls:'noborder',
                        region:'south',
                        margin: '10 0 0 0',
                        layout: {
                            type: 'hbox',
                            align: 'stretch',
                            pack : 'end'
                        },
                        items:[
                            {
                                xtype: 'textfield',
                                name: 'changeEndDateSemester',
                                fieldLabel: 'Semester  Name',
                                itemId: 'changeEndDateSemester',
                                margin: '4 4 1 1',
                                height: 20,
                                hidden: true
                            },{
                                xtype:'button',
                                action:'changeEndDate',
                                cls:'pay-off-btn',
                                ui:'primary',
                                text:'changeEndDate',
                                hidden: true
                            }
                        ]
                    }
                ]
            }
        ];
        this.callParent(arguments);
    },

    setDetails: function (serviceInfo, paramsWidgetName, paramsWidgetParams, serviceId, groupId) {
        this.groupId = groupId;
        this.serviceId = serviceId;
        console.log('setvice details: setDetails');
        var paymentInstructions = this.down('#paymentInstructions');
		if (serviceInfo.data.hasPaymentInstruction) {
			paymentInstructions.getEl().dom.href = basePath + 'rest/services/paymentinstruction?code=' + serviceInfo.data.id;
			paymentInstructions.show()
        } else {
        	paymentInstructions.hide();
        }
		var moreInfo = this.down('#moreInfo');
        if (serviceInfo.data.hasAdditionalInfo) {
            moreInfo.getEl().dom.href = basePath + 'rest/services/fullinfo?code=' + serviceInfo.data.id;
            moreInfo.show()
        } else {
            moreInfo.hide();
        }
        this.down('#serviceName').setText(serviceInfo.data.info, false);
        Ext.getCmp('serviceDetailPaymentPanel').show();
        Ext.getCmp('serviceTestCheckPayment').show();
        this.setPaySumm(serviceInfo.data.cost);

       /* if(serviceId=='615')
        this.down('#paymentSumm').setText('Pay for the year sum - '+serviceInfo.data.cost+' KZT');*/

        var paymentParams = this.down('#paymentParams');
        paymentParams.removeAll();
        if (paramsWidgetName!=null){
            var view = Ext.widget({ xtype: paramsWidgetName, region:'center'});
            paymentParams.add(view);
            console.log(paramsWidgetName);
            console.log(view);
            var params = view.initParams(paramsWidgetParams);
            if(params==null)
                return;
        }
        this.down('#serviceInfo').hide();

        this.enablePayButton();

        console.log("Service ID IS"+serviceId);
        if(serviceId=='151') {
            console.log("Service paySumm IS hiiiiiiding");
            this.disableAndShowPayButton();
        }
        this.doLayout();
    },
    
    showInfo:function(notification){
        var infoPanel = this.down('#serviceInfo');
        infoPanel.down('box').update(notification.data.message);
        infoPanel.notification = notification;
        infoPanel.show();
        Ext.get(infoPanel.down('#closeInfo').getEl().dom.children[0]).on('click', 
            function() {
                MyMain.app.getController('Main').markNotificationAsReaded(notification);
                infoPanel.hide();
            }
        );
    },

    setPaySumm: function (paySumm, panelType) {
        console.log('setPaySumm '+paySumm);
        this.paySumm = paySumm;
        if (panelType == 'editable') {
            this.down('#paymentSumm').hide();
            this.down('#editableSum').show();
            this.down('#editableSum').setValue(paySumm);
        } else {
            this.down('#paymentSumm').show();
            this.down('#editableSum').hide();
            this.down('#paymentSumm').setText('Sum - '+paySumm+' KZT');
        }
    },

    clearDetails: function () {
        console.log('clearDetails');
    },
    
    getParams:function(){
        var res = null;
        var paramsPanel = this.down('#params');
        if (paramsPanel!=null){
            res = paramsPanel.getParams();
        }
        if (res!=null){
            res = Ext.encode(res);
        } else {
            res = JSON.stringify({
                serviceId: this.serviceId,
                groupId: this.groupId,
                cost: this.paySumm,
                originalCost: this.paySumm,
                fullCost: this.paySumm
            })
        }
        console.log('getParams = '+res);
        return res;
    },
    
    disablePayButton:function(){
        this.down('button[action="doPaymentStep1"]').setDisabled(true);
    },

    disableAndShowPayButton:function(){
        this.down('button[action="doPaymentStep1"]').setDisabled(false);
        this.down('#paymentSumm').hide();
    },
    enablePayButton:function(){
        this.down('button[action="doPaymentStep1"]').setDisabled(false);
    },

    showMsgDisableBtn: function (msgType, message) {
        if (localStorage.getItem("payment") != "paid") {
            //Ext.Msg.alert(msgType, message);
            Ext.Msg.show({
                title      : msgType,
                msg        : message,
                width      : 300,
                buttons    : Ext.MessageBox.OK
            });
        }
        localStorage.setItem("payment", "");

        this.disablePayButton();
    }
});