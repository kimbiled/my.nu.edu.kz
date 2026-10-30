Ext.define('MyMain.controller.Main', {
    extend: 'MyMain.controller.Base',

    refs : [
        {
            ref: 'clientViewport',
            selector: 'clientViewport'
        },
        {
            ref: 'serviceDetails',
            selector: 'servicedetails'
        },
        {
            ref:'filterPanel',
            selector: 'filterpanel'
        },
        {
            ref:'userPayments',
            selector: 'userpaymentlist'
        },
        {
            ref:'billPopup',
            selector: 'billpopup'
        },
        {
            ref:'cancelledPayment',
            selector: 'cancelledpayment'
        },
        {
            ref:'receiptPopupOther',
            selector: 'receiptpopupother'
        },
        {
            ref:'cancelledPopup',
            selector: 'cancelledpopup'
        },{
            ref:'parkingPaymentPopup',
            selector: 'parkingpaymentpopup'
        },{
            ref:'parkingPayment',
            selector: 'parkingpayment'
        },
        {
            ref:'bill',
            selector: 'bill'
        },
        {
            ref:'receipt',
            selector: 'receipt'
        },
        {
            ref:'receiptEng',
            selector: 'receiptEng'
        },
        {
            ref:'mainindex',
            selector:'mainindex'
        },
        {
            ref:'previewinvoice',
            selector:'previewinvoice'
        },
        {
            ref:'maintabpanel',
            selector:'mainindex tabpanel'
        }
    ],

    views: [
        'main.Index', 'main.Services', 'main.ServiceDetails',
        'main.Agreement',
        'main.PaymentConfirm',
        'main.Menu',
        'main.Account',
        'main.Bill',
        'main.Receipt',
        'main.ReceiptEng',
        'main.FilterPanel',
        'main.Payment',
        'main.UserPayments',
        'main.BillPopup',
        'main.PreviewInvoice',
        'main.CancelledPopup',
        'main.CancelledPayment',
        'main.ReceiptPopupOther',
        'main.ParkingPayment',
        'main.ParkingPaymentPopup',
        'main.params.ParamsBedSet', //401
        'main.params.ParamsMonth', //501, ..
        'main.params.ParamsYear', //501, ..
        'main.params.ParamsMantia', //620
        'main.params.ParamsRecovery',
        'main.params.ParamsParking', //616, ..
        'main.params.ParamsMonthSport', //with cheking free spaces
        'main.params.ParamsBedding', //402
        'main.params.ParamsMealPlan' , //100
        'main.params.ParamsDormitory', //
        'main.params.ParamsStudentFund', //
        'main.params.ParamsPrint' // 151
    ],

    models: [
        'ServiceType', 'ServiceInfo', 'AvailableServiceType', 'Payments',
        'UserInfo', 'Notification', 'Account', 'Semester'
    ],

    stores: [
        'main.UserInfo',
        'main.Notifications',
        'main.Services',
        'main.AvailableServices',
        'main.Payments',
        'main.ServicesParams',
        'main.SimpleMonth',
        'main.Semesters'
        //,'main.Accounts'
    ],

    currentService: null,
    hasNotificationServiceCode:null,
    fundingType:null,
    currentInvoiceNumber: null,
    userInfo:null,
    newPaymentsViewed: false,
    newPaymentsAmount: 0,
    paidInvoiceNumber: null,
    serviceDetails: null,
    currentReceiptRecord:null,
    isFundPaidBefore:null,

    init:function(){
        this.control({
            'servicedetails button[action="doPaymentStep1"]': {
                click: this.doPaymentStep1
            },
            'servicedetails button[action="changeEndDate"]': {
                click: this.changeEndDate
            },
            'servicedetails container[action="doPaymentStep1"]': {
                click: this.doPaymentStep1
            },
            'agreement button[action="acceptAccountTerms"]':{
                click: this.acceptAccountTerms
            },
            'agreement button[action="acceptServiceTerms"]':{
                click: this.acceptServiceTerms
            },
            'paymentconfirmform button[action="cancel"]':{
                click: this.cancelPaymentConfirm
            },
            'paymentconfirmform button[action="test"]':{
                click: this.testCompletePaymentConfirm
            },
            'filterpanel button[action="clearFilterForm"]': {
                click: this.clearFilterForm
            },
            'filterpanel combobox, datefield, checkbox': {
                change: this.filterChange
            },
            'userpaymentlist button[action="exportPaymentListToExcel"]': {
                click: this.exportPaymentListToExcel
            },
            'userpaymentlist button[action="exportPaymentListToPdf"]': {
                click: this.exportPaymentListToPdf
            },
            'userpaymentlist #viewBill': {
                click: this.openBillPreviewPopup
            },
            'userpaymentlist #pay': {
                click: this.doPayment
            },
            'billpopup button[action="exportBillToPdf"]': {
                click: this.exportBillToPdf
            },
            'billpopup button[action="exportBillToExcel"]': {
                click: this.exportBillToExcel
            },
            'receiptpopupother button[action="exportReceiptOtherToPdf"]': {
                click: this.exportReceiptOtherToPdf
            },
            'bill, receipt': {
                afterrender: this.onBillRendered
            },
            'bill, receiptEng': {
                afterrender: this.onBillRendered
            },
            'previewinvoice #previewPanel': {
                afterrender: this.onPreviewPanelAfterRender
            },

            'mainindex tabpanel': {
                beforerender: function() {
                    console.log("Called beforerender");
                    this.checkAccountTerms();
                    this.fillAjaxVars();
                    this.onMainTabBeforerender();
                }
            },
            'mainindex tabpanel': {
                afterrender: function() {
                    console.log("Called afterrender");
                    this.onMainTabStatusActive();
                    this.getMaintabpanel().getTabBar().hide();
                    this.checkAccountTerms();
                    this.fillAjaxVars();
                    this.onMainTabBeforerender();
                }
            }
        });

        this.getStore('main.Services').on('load', 'onServicesLoaded', this);
        this.getStore('main.UserInfo').on('load', 'onUserInfoLoaded', this);
        this.getStore('main.Notifications').on('load', 'onNotificationsLoaded', this);
    },

    index:function(){
        this.getClientViewport().changeView('mainindex');
        this.reloadStores(['main.UserInfo', 'main.Services', 'main.AvailableServices', 'main.Payments']);
    },

    checkAccountTerms:function(){
        var url = basePath + 'rest/payments/checkAccountTerms';
        console.log("checkAccountTerms ");
        var paymentRequest = {
            'providerId': 2
        };
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function(response){
                var agreed = JSON.parse(response.responseText).data;
                console.log("checkAccountTerms agreed: "+agreed);
                if (!agreed) {
                    Ext.widget({
                        xtype:'agreement',
                        agreementType:'acceptAccountTerms',
                        paymentRequest:paymentRequest
                    });
                }
            },
            failure: function() {
                alert('No valid meal plan information found. Please contact our support – helpdesk@nu.edu.kz')
            }
        });
    },

    fillAjaxVars: function () {
        Ext.Ajax.request({
            url: basePath + 'rest/services/info/serviceMap',
            method: 'GET',
            success: function (response) {
                Ext.Ajax.servicesMap = JSON.parse(response.responseText).data;
            },
            failure: function () {
                Ext.Msg.alert('Error', 'Error on getting all services info. Please contact our support – helpdesk@nu.edu.kz');
            }
        });

        Ext.Ajax.request({
            url: basePath+'rest/services/info/funding',
            method: 'GET',
            success: function (response) {
                var json = JSON.parse(response.responseText);
                if (json.success == true) {
                    var funding = json.data;
                    console.log('funding '+funding.type);
                    var fundingType = funding.type;
                    Ext.Ajax.studentFundingType = fundingType;
                }
                else
                {
                    Ext.Msg.alert('Error',json.errorMessage);
                }
            },
            failure: function () {
                Ext.Msg.alert('Attention','error in getting service Funding Info!. Please contact our support – helpdesk@nu.edu.kz');
            }
        });

        Ext.Ajax.request({
            url: basePath + 'rest/payments/paidStudentFund2',
            method: 'GET',
            success: function (response) {
                var json = JSON.parse(response.responseText);
                if (json.success == true) {
                    Ext.Ajax.paidStudentFund2 = json.data;
                } else {
                    MyMain.app.getController('Main').getServiceDetails().disablePayButton();//showMsgDisableBtn('Warning', json.errorMessage);
                }
            },
            failure: function () {
                Ext.Msg.alert('Error', 'Discount checking error');
            }
        });

        Ext.Ajax.request({
            url: basePath + 'rest/services/info/academicDescription',
            method: 'GET',
            success: function (response) {
                var json = JSON.parse(response.responseText);
                if (json.success == true) {
                    Ext.Ajax.academicDescription = json.data;
                } else {
                    Ext.Msg.alert('Warning', json.errorMessage);
                }
            },
            failure: function () {
                Ext.Msg.alert('Error', 'Academic Description checking error. Please contact our support – helpdesk@nu.edu.kz');
            }
        });

        Ext.Ajax.request({
            url: basePath + 'rest/services/availableServiceCodes',
            method: 'GET',
            success: function(response) {
                var json = JSON.parse(response.responseText);
                if (json.success == true) {
                    if (json.data.cause.length > 0) {
                        Ext.Ajax.availableServiceCodes = json.data.availableServiceCodes;
                        Ext.Msg.alert('Information', json.data.cause);
                    } else {
                        Ext.Ajax.availableServiceCodes = "allAvailable";
                    }
                } else {
                    MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', json.errorMessage);
                }
            },
            failure: function () {
                MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Error', "on getting available service codes. Please contact our support – helpdesk@nu.edu.kz");
            }
        });
    },

    markPaid: function(){
        var url = basePath + 'rest/payments/updatepaidinvoice?invoiceNumber=' + this.paidInvoiceNumber;
        Ext.Ajax.request({
            url: url,
            method: 'GET'
        });
    },

    onMainTabBeforerender: function(tabpanel){
        var that = this;
        Ext.Ajax.request({
            url: basePath + 'rest/payments/newinvoicesamount',
            method: 'GET',
            success: function(response){
                var responseData = JSON.parse(response.responseText);
                if(responseData.data > 0){
                    that.getFilterPanel().down('checkbox').setValue(true);
                    var title = 'MY PAYMENTS (' + responseData.data + ')';
                    document.getElementById('mytab2').text = title;
                }else {
                    that.clearFilterForm()
                }
                that.newPaymentsAmount = responseData.data
            }
        });
    },
    onMainTabStatusActive: function(){
        document.getElementById('tabsId').style.display = 'block';
        /*Ext.Ajax.request({
            url: basePath + 'rest/services/info/status',
            method: 'GET',
            scope: this,
            success: function (response) {
                var json = JSON.parse(response.responseText);
                if (json.success === true) {
                    var status = json.data;
                    console.log("Status student: " + status);
                    var tabMakePayments = document.getElementById('mytab1');
                    if (status.name !== 'Active') {
                        window.tabselect(1)
                        tabMakePayments.remove();
                    }
                    document.getElementById('tabsId').style.display = 'block';
                }
            },
            failure: function () {
                console.log("error get status info")
            }
        });*/
    },
    onSchoolFromRegistrar: function(){
        var response = Ext.Ajax.request({
            url: basePath + 'rest/services/info/school',
            method: 'GET',
            scope: this,
            async: false
        });
        var json = JSON.parse(response.responseText);
        if (json.success === true) {
            return json.data.abbr;
        }
        return "error get school info";
    },
    onServicesLoaded:function(store){
        console.log('onServicesLoaded');
        var me = MyMain.app.getController('Main');
        var store = me.getStore('main.Notifications');
        store.reload();
    },

    onUserInfoLoaded:function(store){
        console.log('onUserInfoLoaded');
        this.userInfo = store.getAt(0);
    },

    onNotificationsLoaded:function(store){
        console.log('onNotificationsLoaded');
        this.hasNotificationServiceCode = null;
        console.log('currentService');

        var me = MyMain.app.getController('Main');
        if (store.count>0){
            //console.log(this.currentService.raw.id);
            var notification = store.getAt(0);
            this.hasNotificationServiceCode =notification.data.serviceCode;
            var serviceId = notification.data.serviceCode;
            console.log('this.hasNotificationServiceCode '+this.hasNotificationServiceCode);

            console.log('serviceId='+serviceId);
            var servicesStore = me.getStore('main.Services');
            console.log(notification);
            console.log(store);

            servicesStore.each(function(serviceType){
                console.log(serviceType);
                console.log(serviceType.services());

                if(serviceId=='606' || serviceId=='607' || serviceId=='608' || serviceId=='609' || serviceId=='610'
                    || serviceId=='701' || serviceId=='702' || serviceId=='703')
                    serviceId = '605';

                var service = serviceType.services().getById(parseInt(serviceId));
                console.log('service=');
                console.log(service);

                if (service!=null){
                    service.notification = notification;
                    //if()
                    me.onServiceSelected(serviceType.data.id, service.data.id);
                }
            });
        }
    },

    onBillRendered: function(view){
        view.loadRecord(view.data);
    },

    countMonth: function (x) {
        var y = 365;
        var y2 = 31;
        var remainder = x % y;
        var casio = remainder % y2;
        var month = (remainder - casio) / y2;
        return month; // + casio + " day";
    },

    daydiff: function(first, second) {
        return Math.round((second-first)/(1000*60*60*24));
    },

    openBillPreviewPopup: function(view, rowIndex, colIndex, item, e, record){
        if(e.target.className.includes('x-item-disabled')){
            return;
        }

        this.currentInvoiceNumber = record.get('invoiceNumber');
        this.currentReceiptRecord = record;

        var isInvoice = record.get('invoiceNumber') != null;
        var isPaid = record.get('paymentSum') != null;
        var tabs = [];
        console.log("record paymentBeginDate: "+record.get('paymentBeginDate'));
        console.log("record paymentEndDate: "+record.get('paymentEndDate'));
        var countDays = this.daydiff(record.get('paymentBeginDate'),record.get('paymentEndDate'));
        console.log('Days between: '+countDays);

        var  countMonth  = Math.round(countDays/30);

        console.log('Months between: '+countMonth);
        var detailString = 'null';

        if(countMonth>=12)
            detailString='Payment for the year';
        else if(countMonth>1)
            detailString='Payment for '+countMonth+' months';
        else if(countMonth==1)
            detailString='Payment for '+countMonth+' month';
        record.set('details',detailString);
        console.log('record');
        console.log(record);
        if(record.get('isRefunded') == 0) {
            if (record.get('status') == 0) {
                if ( record.get('serviceCode') == '601' || record.get('serviceCode') == '602') {
                    console.log(record);

                    tabs.push({
                        title: 'Payments details',
                        items: [{xtype: 'receiptEng', data: record}]
                    });

                    Ext.widget({
                        xtype: 'receiptpopupother',
                        tabs: tabs
                    });

                }
                else if(record.get('serviceCode') == '616'){
                    Ext.Ajax.request({
                        url: basePath + 'rest/payments/parkingTicketPayment',
                        method: 'GET',
                        params: {
                            'paymentNumber': record.get('paymentDocNumber'),
                            'bankReference': record.get('bankReference')
                        },
                        success: function (response) {
                            console.log('parking response:');
                            console.log(response);

                            var data = Ext.JSON.decode(response.responseText);
                            var parkingData = data.data;
                            console.log('parkingData:');
                            console.log(parkingData);
                            if(parkingData!=null && parkingData!=undefined) {
                                parkingData.serviceName=record.get('serviceName');
                                console.log(parkingData);
                                tabs.push({
                                    title: 'Parking payment details',
                                    items: [{xtype: 'parkingpayment', data: parkingData}]
                                });

                                Ext.widget({
                                    xtype: 'parkingpaymentpopup',
                                    tabs: tabs
                                });
                            }
                            else{
                                Ext.MessageBox.alert('Error','Could not find parking payment record for this payment!.\n Please contact our support – helpdesk@nu.edu.kz');
                            }
                        },
                        failure: function () {
                            Ext.MessageBox.alert('Error','Could not connect to service!. Please contact our support – helpdesk@nu.edu.kz');
                        }
                    });
                }
                else if(record.get('serviceCode') == '604') {
                    if (isInvoice) {
                        tabs.push({
                            title: 'Счет на оплату услуги',
                            items: [{xtype: 'previewinvoice', data: record}]
                        });

                        Ext.widget({
                            xtype: 'billpopup',
                            tabs: tabs
                        });
                    }
                }

                else {
                    if (isInvoice) {
                        tabs.push({
                            title: 'Счет на оплату услуги',
                            items: [{xtype: 'bill', data: record}]
                        });

                        Ext.widget({
                            xtype: 'billpopup',
                            tabs: tabs
                        });
                    }

                    else {
                        if (isPaid) {
                            tabs.push({
                                title: 'Квитанция об оплате услуги',
                                items: [{xtype: 'receipt', data: record}]
                            });

                            Ext.widget({
                                xtype: 'receiptpopupother',
                                tabs: tabs
                            });
                        }
                        else {
                            alert('No payment or invoice are found for this record!');
                        }

                    }
                }
            }
        }
        else{

            Ext.Ajax.request({
                url: basePath + 'rest/payments/refund/list',
                method: 'GET',
                params: {
                    'paymentNumber': record.get('paymentDocNumber'),
                    'bankReference': record.get('bankReference')
                },
                success: function (response) {

                    var data = Ext.JSON.decode(response.responseText);
                    var refundData = data.data;
                    console.log('refundData:');
                    console.log(refundData);
                    if(refundData.length>0) {
                        for (i = 0; i < refundData.length; i++) {
                            var dataSet = {
                                data: refundData[i]
                            };
                            // dataSet.data.serviceName = refundData[i].serviceName;

                            console.log(dataSet);
                            tabs.push({
                                title: 'Refund ' + (i + 1) + ' details',
                                items: [{xtype: 'cancelledpayment', data: refundData[i]}]
                            });
                        }

                        var d = Ext.widget({
                            xtype: 'cancelledpopup',
                            tabs: tabs
                        });
                        d.doLayout();
                    }
                    else{
                        Ext.MessageBox.alert('Error','Could not find refunded records for this payment!.\n Please contact our support – helpdesk@nu.edu.kz');
                    }
                },
                failure: function () {
                    Ext.MessageBox.alert('Error','Could not connect to service!. Please contact our support – helpdesk@nu.edu.kz');
                }
            });
        }






    },

    onServiceSelected:function(groupId, serviceId){
        console.log('onServiceSelected ' + groupId+','+serviceId);
        var store = this.getStore('main.Services');
        var serviceType = store.getById(groupId);
        console.log('group id: '+groupId);
        console.log('service  ->');
        console.log(serviceType);
        if (serviceType!=null){
            var paramsWidgetName = null;
            var paramsWidgetParams = null;
            var serviceParams = this.getStore('main.ServicesParams').getById(serviceId);
            if (serviceParams!=null){
                paramsWidgetName = serviceParams.data.name;
                paramsWidgetParams = serviceParams.data.params;
                console.log('paramsWidgetParams');
                console.log(paramsWidgetName);
                console.log(paramsWidgetParams);
            }
            var service = serviceType.services().getById(serviceId);
            console.log(service);
            console.log(service);
            this.currentService = service;
            var serviceDetails = this.getServiceDetails();
            serviceDetails.show();
            serviceDetails.setDetails(service, paramsWidgetName, paramsWidgetParams, serviceId, groupId);
            if (typeof(service.notification)!=='undefined' && service.notification!=null && !service.notification.data.closed){
                serviceDetails.showInfo(service.notification);
                Utils.addSelected('label-'+serviceId);
            }

            var currentServiceInvalid = true;
            if (Ext.Ajax.availableServiceCodes == "allAvailable") {
                currentServiceInvalid = false;
            } else {
                for (id in Ext.Ajax.availableServiceCodes) {
                    if (serviceId == Ext.Ajax.availableServiceCodes[id]) {
                        currentServiceInvalid = false;
                        break;
                    }
                }
            }

            if(serviceId === 611 || serviceId === 612){
                if(Ext.Ajax.paidStudentFund2){
                    currentServiceInvalid=true;
                }
            }
            console.log(service);

            console.log(service.data.cost);

            serviceDetails.enablePayButton();

            if(service.data.cost<=0 && service.data.id!=151)
                currentServiceInvalid=true;

            if (currentServiceInvalid ) {
                serviceDetails.disablePayButton();
            }
        }
        document.getElementById('servicedetails-1016').scrollIntoView(true);
    },

    clearFilterForm: function(){
        this.getFilterPanel().getForm().reset();
        this.getStore('main.Payments').clearFilter();
        this.reloadStores(['main.Payments']);
    },

    filterChange: function(){
        var filters = this.getFilters();
        var store = this.getStore('main.Payments');
        store.clearFilter(true);
        store.filter(filters);
    },

    exportBillToExcel: function(){
        this.exportBill('xlsx');
    },

    exportBillToPdf: function(){
        this.exportBill('pdf');
    },

    exportReceiptOtherToPdf: function(){
        var record =  this.currentReceiptRecord;
        console.log('Viewwww currentReceiptRecord: ');
        console.log(record);
        var url = 'rest/export/receipt';
        if(record!=null) {
            var params = {
                address: record.get('address'),
                paymentDate: record.get('paymentDate'),
                bankReference: record.get('bankReference'),
                userName: portalUserName,
                userUid: portalUserUID,
                serviceName: record.get('serviceName'),
                details: record.get('details'),
                recipient: record.get('recipient'),
                paymentAmount: record.get('paymentAmount'),
                invoiceNumber: '00000000'
            };
            url = basePath + url + '?' + Ext.urlEncode(params)
            this.downloadFile(url);
        }
    },

    exportCancelledToPdf: function(){
        console.log('Not realized yet!');
    },


    exportBill: function(type){
        var url = 'rest/export/bill';
        var params = {
            type: type,
            invoiceNumber: this.currentInvoiceNumber
        };
        url = basePath + url + '?' + Ext.urlEncode(params)
        this.downloadFile(url);
    },

    exportPaymentListToExcel: function(){
        this.exportPaymentList('xlsx');
    },

    exportPaymentListToPdf: function(){
        this.exportPaymentList('pdf');
    },

    exportPaymentList: function(type){
        var filters = Ext.encode(this.getFilters());
        var params = {
            type: type,
            filter: filters
        };
        var url = basePath + 'rest/export/paymentlist?' + Ext.urlEncode(params);
        this.downloadFile(url);
    },

    downloadFile: function(url){
        var body = Ext.getBody();
        var frame = body.createChild({
            tag:'iframe',
            cls:'x-hidden',
            id:'hiddenform-iframe',
            name:'iframe'
        });
        var form = body.createChild({
            tag:'form',
            cls:'x-hidden',
            id:'hiddenform-form',
            action: url,
            target:'iframe',
            method:'POST'
        });
        form.dom.submit();
    },

    acceptAccountTerms:function(button) {
        var win = button.up('window');
        if (win.down('checkbox').getValue()==false){
            Ext.MessageBox.alert('Payment account agreement',
                'Please check a checkbox to approve your agreement');
            return;
        }
        Ext.Ajax.request({
            url: basePath+'rest/payments/acceptAccountTerms',
            method: 'POST',
            jsonData: {
                'providerId': 2
            },
            success: function() {
                win.close();
            },
            failure: function() {
                Ext.MessageBox.alert('Could not accept agreement!. Please contact our support – helpdesk@nu.edu.kz');
            }
        });

    },

    acceptServiceTerms:function(button){
        var win = button.up('window');
        if (win.down('checkbox').getValue()==false){
            Ext.MessageBox.alert('Service payment agreement',
                'Please check a checkbox to approve your agreement');
            return;
        }
        var me = this;
        Ext.Ajax.request({
            url: basePath+'rest/payments/acceptServiceTerms',
            scope: this,
            jsonData: {
                'providerId': win.paymentRequest.providerId,
                'serviceCode': win.paymentRequest.serviceCode,
                'agreementNumber' : win.paymentRequest.agreementNumber
            },
            success: function(conn, response, options, eOpts) {
                console.log('agreement read mark set result: '+conn.responseText);
                var result = JSON.parse(conn.responseText);
                if (result.success==true){
                    win.close();
                    setTimeout(function(){
                        me.pay(win.paymentRequest);
                    }, 20);
                } else {
                    Ext.MessageBox.alert('Error', 'error on agreement mark setting or condition failure. Please contact our support – helpdesk@nu.edu.kz');
                }
            },
            failure: function(conn, response, options, eOpts) {
                Ext.MessageBox.alert('Error', 'error on agreement mark setting | function failure');
            }
        });
    },

    getFilters: function(){
        var data = this.getFilterPanel().getForm().getFieldValues();
        var keys = Object.keys(data);
        var filters = [];
        for(var key in keys){
            key = keys[key];
            var val = data[key];
            filters.push(
                {
                    property: key,
                    value: val
                }
            );
        }
        return filters;
    },

    changeEndDate:function(source,eOpts) {
        console.log(source);
        var changeEndDateSemesterInput =   Ext.ComponentQuery.query('#changeEndDateSemester')[0];
        var changeEndDateSemester = changeEndDateSemesterInput.getValue();
        //console.log('cancelationId: '+cancelationId);
        console.log('changeEndDateSemester: '+changeEndDateSemester);
        Ext.Ajax.request({
            url: basePath+'rest/payments/changeEndDate',
            method: 'POST',
            jsonData: changeEndDateSemester,
            scope: this,
            success: function (response) {
                //  Ext.MessageBox.hide();
                var response = response.responseText;

                if(response!=null && response!=undefined)
                    Ext.Msg.alert('Response '+response);
                // Ext.Msg.alert('Response '+response.substr(response.indexOf("\"Id\":"),response.indexOf(",\"Description\"")-1));
            },
            failure: function () {
                //   Ext.MessageBox.hide();
                Ext.Msg.alert('Внимание','error!');
            }
        });
    },

    doPaymentStep1:function(source,eOpts){
        // Make a payment
        var store = this.getStore('main.Services');
        console.log('doPaymentStep1');
        if (this.currentService!=null){
            //todo хранить тип оплаты сервиса в базе
            if (this.currentService.raw.id == 100) {
                paymentType = 'ALFA';
            } else
            if (this.currentService.raw.id == 611 || this.currentService.raw.id == 612) {
                paymentType = 'KKB';
            } else {
                paymentType = 'SBERBANK';
            }

            console.info(this.currentService);
            var monthCount = 0;
            serviceDetails = this.getServiceDetails();
            var jsonVar = Ext.decode(serviceDetails.getParams());
            if (jsonVar.type == "Month") {
                monthCount = jsonVar.value
            }
            console.log("monthCount = "+monthCount);
            console.log(" this.currentService.raw.providerId = "+ this.currentService.raw.providerId);
            var paymentRequest = {
                'paymentType': paymentType,
                'paySumm': serviceDetails.paySumm,//this.currentService.raw.cost,
                'hasDiscount': Ext.Ajax.paidStudentFund2,
                'discount': Ext.Ajax.paidStudentFund2==true ? '20' : '0',
                'params': serviceDetails.getParams(),
                'serviceCode': this.currentService.raw.id,
                'serviceName': this.currentService.raw.name,
                'providerId': this.currentService.raw.providerId,
                'backRef': window.location.href,
                'monthCount': monthCount,
                'studentFundingType': Ext.Ajax.studentFundingType,
                'isInvoicee': false
            };
            var controller = MyMain.app.getController('Main');
            var serviceCost = controller.getServiceDetails().paySumm;

            console.log(' Student fund & paymentRequest.serviceCode: '+ paymentRequest.serviceName+' && '+ paymentRequest.serviceCode);
            if(paymentRequest.serviceName=='Student fund' && paymentRequest.serviceCode!='611'){
                controller.getServiceDetails().showMsgDisableBtn('Error', "Service code is not correct " + paymentRequest.serviceCode + " with name "+paymentRequest.serviceName);
                return;
            }

            if (paymentRequest.paySumm < serviceCost) {
                controller.getServiceDetails().showMsgDisableBtn('Warning', "Payment summ can't be less than " + serviceCost + " KZT");
                return;
            } else if (paymentRequest.paySumm > serviceCost && paymentRequest.serviceCode == '611' || paymentRequest.serviceCode == '612') {
                Ext.MessageBox.show({
                    title: 'Warning',
                    msg: 'By pressing "OK" button you confirm transferring money to Student Fund on voluntary basis. ' +
                        'The minimal amount of contribution approved by NU Student Government for calendar 2017 year is 3500 ' +
                        '(three thousand five hundred) KZT. In case of over-payment your donation is to be considered ' +
                        'voluntary contribution to the student life development and not refunded.',
                    buttons: Ext.Msg.OKCANCEL,
                    icon: Ext.Msg.WARNING,
                    fn: function (btn) {
                        if (btn == "ok") {
                            controller.pay(paymentRequest);
                        }
                    }
                });
                return;
            }
            else if(paymentRequest.serviceCode == '601')
            {
                Ext.MessageBox.show({
                    title: 'Warning',
                    msg: 'You are going to pay off for Outdoor ground parking for the Year. The sum of '+serviceDetails.paySumm+' KZT.',
                    buttons: Ext.Msg.OKCANCEL,
                    icon: Ext.Msg.WARNING,
                    fn: function (btn) {
                        if (btn == "ok") {
                            controller.pay(paymentRequest);
                        }
                    }
                });
                return;
            }
            else if(paymentRequest.serviceCode == '602')
            {
                Ext.MessageBox.show({
                    title: 'Warning',
                    msg: '       Dear students, Please be informed that payment for parking slot should be completed only after personal ' +
                        ' approval from Department of Student Affairs (DSA). Wrong payments will not be  refunded and will not give you parking slot. ' +
                        ' Parking slots are distributed by DSA at the beginning of each semester, so check your   emails. ' +
                        ' If you have any questions, you can contact student_housing@nu.edu.kz',
                    buttons: Ext.Msg.OKCANCEL,
                    icon: Ext.Msg.WARNING,
                    fn: function (btn) {
                        if (btn == "ok") {
                            controller.pay(paymentRequest);
                        }
                    }
                });
                return;
            }
            else if((paymentRequest.serviceCode == '605' || paymentRequest.serviceCode == '606' || paymentRequest.serviceCode == '607' || paymentRequest.serviceCode == '608'
                || paymentRequest.serviceCode == '609'|| paymentRequest.serviceCode == '610' || paymentRequest.serviceCode == '630'|| paymentRequest.serviceCode == '631') && Ext.Ajax.paidStudentFund2==false )
            {
                if(controller.currentService.data.name === "Dormitory fee" && !controller.isFundPaidBefore){
                    console.log("isFundPaidBefore " + controller.isFundPaidBefore);
                } else {
                    var prevServiceCode = paymentRequest.serviceCode;
                    console.log('paymentRequest.serviceCode '+paymentRequest.serviceCode);
                    var me = this;
                    Ext.MessageBox.show({
                        title: 'Warning',
                        msg: '     Pay sum without discount is ' + paymentRequest.paySumm + ' '+
                            'In case Student fund paid pay sum will be '+ (paymentRequest.paySumm-paymentRequest.paySumm*0.20)  +' with 20% discount.',
                        buttonText: {yes: "Pay Student fund now",no: "Рay dormitory without discount"},
                        icon: Ext.Msg.WARNING,
                        fn: function (btn) {
                            if (btn == "yes") {
                                var serviceType = store.getById(3);
                                controller.currentService=serviceType.services().getById(611);
                                controller.onServiceSelected(3,controller.currentService.data.id);
                            }
                            else{
                                console.log('me.currentService '+me.currentService.raw.id);
                                controller.onServiceSelected(3,605);
                                controller.pay(paymentRequest);
                            }
                        }
                    });
                    return;
                }
            }
            console.log("paid student fund: " + Ext.Ajax.paidStudentFund2);
            this.pay(paymentRequest);
        }
    },

    doPayment:function(view, rowIndex, colIndex, item, e, record){
        // My payments
        if(e.target.className.includes('x-item-disabled')){
            return;
        }
        console.info('doPayment: providerId=' + record.get('providerId'));
        var paymentParams = [ 'Month', 'BedSet', 'Bedding', 'MealPlan', 'Dormitory' ];

        var paramType = record.get('serviceName');
        var type = 'Unknown';
        for(i=0;i<paymentParams.length;i++) {
            if (paramType.indexOf(paymentParams[i]) > -1) {
                type = paymentParams[i];
                if(paramType.indexOf('Dormitory')>-1)
                    type='Semester';
            }
            else  if(paramType.indexOf('place')>-1)
                type='Semester';
            else  if(paramType.indexOf('living')>-1)
                type='Semester';

        }
        paramType = type;
        console.log('payment cost: '+record.get('sum'));
        console.log(record);
        var service =  Ext.Ajax.servicesMap[record.get('serviceCode')];
        var cost = service.cost;
        var params = null;
        console.log('service info: ');
        console.log(service);

        params = {
            type: paramType,
            invoiceNumber: record.get('invoiceNumber'),
            invoiceSemester: record.get('invoiceSemester'),
            invoiceCheckin: record.get('invoiceCheckin'),
            invoiceCheckout: record.get('invoiceCheckout'),
            invoiceDate: Ext.util.Format.date(new Date(parseInt(record.get('invoiceDate'))), 'd.m.Y'),
            serviceCode: record.get('serviceCode'),
            cost: record.get('sum'),
            originalCost: cost,
            fullCost: record.get('sum')
        };


        this.paidInvoiceNumber = record.get('invoiceNumber');
        if (params.serviceCode == 100) {
            paymentType = 'ALFA';
        } else
        if (params.serviceCode == 611 || params.serviceCode == 612) {
            paymentType = 'KKB';
        } else {
            paymentType = 'SBERBANK';
        }
        var providerId=null;

        if(record.get('providerId')!=null)
            providerId = record.get('providerId');
        else{
            providerId = service.providerId;
        }
        var paymentRequest = {
            'paymentType': paymentType,
            'paySumm': record.get('sum'),
            'hasDiscount': Ext.Ajax.paidStudentFund2,
            'discount': Ext.Ajax.paidStudentFund2==true ? '20' : '0',
            'params': JSON.stringify(params),
            'serviceCode': record.get('serviceCode'),
            'serviceName': record.get('serviceName'),
            'providerId': providerId,
            'backRef': window.location.href,
            'invoiceNumber': record.get('invoiceNumber'),
            'studentFundingType': Ext.Ajax.studentFundingType,
            'agreementNumber' : '',
            'isInvoicee': true,
            'schoolAbbr': null
        };
        this.pay(paymentRequest);
    },

    pay: function(paymentRequest){
        console.info('pay: providerId=' + paymentRequest.providerId);
        paymentRequest.schoolAbbr = this.onSchoolFromRegistrar();
        console.log('pay: paymentRequest=');
        console.log(paymentRequest);
        Ext.MessageBox.show({
            msg: 'подготовка к оплате',
            progressText: 'подготовка к оплате..',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        var me = this;
        var viewport = this.getClientViewport();
        delete paymentRequest.agreementNumber;
        Ext.Ajax.request({
            url: basePath+'rest/payments/prepay',
            jsonData: paymentRequest,
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    var payInfo = json.data;
                    if (payInfo.providerAgreed==true){
                        if (payInfo.hasAccount==true){
                            alfaBankUrl = payInfo.alfaFormUrl;

                            if (paymentType == 'SBERBANK') payViaSberbank(me, payInfo, 'en-US');
                            else {
                                var orederNumParam = 'orderNumber=' + payInfo.orderNumber;
                                payInfo.backLink = window.location.origin + basePath + 'rest/payments/completePayment?' + orederNumParam;
                                payInfo.failureBackLink = window.location.origin + basePath + 'rest/payments/cancelPayment?' + orederNumParam + '&reason=payment%20cancelled';
                                payInfo.postLink = window.location.origin + basePath + 'rest/payments/paypost/kkb2';
                                payInfo.failurePostLink = payInfo.failureBackLink;
                                payInfo.portalUserUID = portalUserUID;

                                console.log(" PayInfo: ");
                                console.log(payInfo);
                                console.log("Postlink1 should start "+ window.location.origin);

                                /*setTimeout(function () {
                                    var orederNumParam = 'orderNumber=' + payInfo.orderNumber;//+'&backRef='+window.location.href;
                                    var paymentConfirm = viewport.changeView('paymentconfirm');
                                    var form2 = paymentConfirm.down('form').getForm();
                                    form2.findField('Signed_Order_B64').setValue(payInfo.signedOrder);
                                    form2.findField('appendix').setValue(payInfo.info);
                                    form2.findField('person_id').setValue(portalUserUID);
                                    form2.findField('paySumm').setValue(payInfo.paySumm);
                                    form2.findField('email').setValue(payInfo.userEmail);
                                    form2.findField('orderNumber').setValue(payInfo.orderNumber);
                                    form2.findField('BackLink').setValue(window.location.origin + basePath + 'rest/payments/completePayment?' + orederNumParam);
                                    form2.findField('FailureBackLink').setValue(window.location.origin + basePath + 'rest/payments/cancelPayment?' + orederNumParam + '&reason=payment%20cancelled');
                                    form2.findField('PostLink').setValue(window.location.origin + basePath + 'rest/payments/paypost/kkb');
                                    console.log("Postlink2 is "+ form2.findField('PostLink').getValue());

                                }, 10);*/

                                payViaHalykBank(me, payInfo, 'en-Us');
                            }
                        } else {
                            Ext.Msg.alert('Error', 'You do not have any current account. Please contact our support – helpdesk@nu.edu.kz. ');
                        }
                    } else {
                        paymentRequest["agreementNumber"] = json.data.agreementNumber;
                        console.log("It will be finishesd soon: " + json.data.agreementNumber);
                        Ext.widget({
                            xtype:'agreement',
                            paymentRequest: paymentRequest,
                            agreementType: 'acceptServiceTerms'
                        });
                        console.log('agreement initialized. code - ' + paymentRequest.serviceCode);
                    }
                } else {
                    Ext.Msg.alert('Error', 'Error on payment preparing: '+json.errorMessage+' Please contact our support – helpdesk@nu.edu.kz');
                }
            },
            failure: function () {
                Ext.MessageBox.hide();
                Ext.Msg.alert('Внимание','error!');
            }
        });
    },

    cancelPaymentConfirm:function(button){
        console.log('cancelPaymentConfirm');
        var form = button.up('form').getForm();
        var orderNumber = form.findField('orderNumber').getValue();
        console.log('orderNumber='+orderNumber);
        window.location.href = form.findField('FailureBackLink').getValue();
    },

    testCompletePaymentConfirm:function(button){
        console.log('testCompletePaymentConfirm');
        var form = button.up('form').getForm();
        var orderNumber = form.findField('orderNumber').getValue();
        console.log('orderNumber='+orderNumber);
        localStorage.setItem("payment", "paid");
        window.location.href = form.findField('BackLink').getValue();
        window.location.href = window.location.origin+basePath+'rest/payments/completePaymentTest?orderNumber='+orderNumber; //form.findField('BackLink').getValue();
    },

    togglePanel:function(panelId){
        var panel = Ext.get('list-'+panelId);
        var icon = Ext.get('item-arrow-'+panelId);
        if(panel.isVisible()){
            panel.slideOut('t',{easing: 'easeOut', duration: 200, useDisplay: true});
            icon.addCls('list-close').removeCls('list-open');
        } else {
            panel.slideIn('t',{easing: 'easeOut', duration: 200});
            icon.addCls('list-open').removeCls('list-close');
        }
    },

    //todo использовать вместо togglePanel() в случае необходимости использования меню в стиле аккордеон
    accordeonPanel:function(panelId){
        var panels = Ext.select('.service-list');
        panels.slideOut('t',{easing: 'easeOut', duration: 0, useDisplay: true});
        var panel = Ext.get('list-'+panelId);
        var icon = Ext.get('item-arrow-'+panelId);
        if(panel.isVisible()){
            panel.slideOut('t',{easing: 'easeOut', duration: 0, useDisplay: true});
            icon.addCls('list-close').removeCls('list-open');
        } else {
            panel.slideIn('t',{easing: 'easeOut', duration: 0});
            icon.addCls('list-open').removeCls('list-close');
        }
    },

    markNotificationAsReaded:function(notification){
        console.log('markNotificationAsReaded');
        notification.data.closed = true;
        Ext.Ajax.request({
            url: basePath+'rest/services/notification/markreaded',
            scope: this,
            jsonData: Ext.encode(notification.data),
            success: function(conn, response, options, eOpts) {
                console.log('notification read mark set result: '+conn.responseText);
                var result = JSON.parse(conn.responseText);
                if (result.success==false){
                    console.log('error on notification mark setting');
                }
            },
            failure: function(conn, response, options, eOpts) {
                console.log('error on notification mark setting');
            }
        });
    },

    onPreviewPanelAfterRender: function(component, eOpts) {
        var parent = component.up('panel');
        component.update('<embed src="https://my.nu.edu.kz/my-main-web/rest/export/invPrev?type=pdf&invoiceNumber='+parent.data.data.invoiceNumber+'" width="800px" height="2100px"/>');
    }
});