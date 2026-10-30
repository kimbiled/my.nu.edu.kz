/*
    author: Sulemenov.A
    date: 29.10.2017
 */
function payViaSberbank(me, payInfo, lang) {
    var urlPlace = 'My_Account';
    var receipt = {
        "Items": [
            {
                "label": payInfo.serviceName,
                "price": Number(payInfo.paySumm),
                "quantity": 1.00,
                "amount": Number(payInfo.paySumm),
                "vat": (payInfo.serviceName !== 'Dormitory fee' ? 16 : null ), //ставка НДС
                "method": 4,
                "object": 4,
                "measurementUnit": "услуга"
            }
        ],
        "calculationPlace": (running_mode == 'prod' ? urlPlace : running_mode),
        "email": payInfo.userEmail,
        "isBso": false,
        "amounts":
            {
                "electronic": Number(payInfo.paySumm)
            }
    };
    var jsonFiscalize = {
        "CloudPayments": {
            "CustomerReceipt": receipt,
        }
    };
    console.log("json - " + jsonFiscalize);

    var widget = new cp.CloudPayments({startWithButton: false, language: lang});
    var pubId = '';
    if (payInfo.groupName == 'Laundry') {
        pubId = (running_mode == 'prod' ? 'pk_f4083c8d1eff9f44630adb46dd9fa' : 'pk_e969429194e0a0647b7d0bb468fed');
    } else if(payInfo.groupName == 'Dormitory') {
        pubId = (running_mode == 'prod' ? 'pk_9a5a9fac065709e0a9e0100f034f0' : 'pk_7e35bf973f238ef40c190877b7e34');
    } else {
        pubId = (running_mode == 'prod' ? 'pk_563e21d1ef929c0e9aabc0fdd807f' : 'pk_c67be80430430a6b9ac3636f45da2');
    }
    widget.charge({
            publicId: pubId,
            description: payInfo.serviceCode + '_' + payInfo.serviceName + '_' + payInfo.groupName,
            amount: Number(payInfo.paySumm),
            currency: 'KZT',
            invoiceId: payInfo.orderNumber,
            email: payInfo.userEmail,
            accountId: payInfo.payerId +'_'+ payInfo.payerFio,
            requireEmail: true,
            data: jsonFiscalize
        },
        function (options) {
            localStorage.setItem("payment", "paid");
            var store = me.getStore('main.Notifications');
            store.load({
                callback: function (records, operation, success) {
                    if (success == true) me.onNotificationsLoaded(store);
                }
            });
            console.log('Payment complated: ' + options);
        },
        function (reason, options) {
            $.ajax({
                url: window.location.origin + basePath + 'rest/payments/cancelPayment',
                cache: false,
                crossDomain: true,
                type: "GET",
                data: {orderNumber: payInfo.orderNumber, reason: reason},
                success: function (html) {
                    console.log('successful cancelPayment');
                    var store = me.getStore('main.Notifications');
                    store.load({
                        callback: function (records, operation, success) {
                            if (success == true) me.onNotificationsLoaded(store);
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Error cancelPayment: ' + errorThrown);
                }
            });
            console.log('Payment not complated: ' + reason);
        });
};