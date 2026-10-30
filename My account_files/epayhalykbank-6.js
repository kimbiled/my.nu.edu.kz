/*
    author: Akhmet.Sulemenov
    date: 27.05.2023
 */
function payViaHalykBank(me, payInfo, lang) {
    var jsonData = {
        "statement": {
            "email": payInfo.userEmail,
            "invoiceID": payInfo.orderNumber
        }
    };
    var createPaymentObject = function(payInfo) {
        //debugger
        var terminalId = (running_mode == 'prod' ? "65dd50c8-7bf2-4e33-ab6c-9ea3063748a0" : "67e34d63-102f-4bd1-898e-370781d0074d");
        var paymentObject = {
            invoiceId: payInfo.orderNumber,
            backLink: payInfo.backLink,
            failureBackLink: payInfo.failureBackLink,
            postLink: payInfo.postLink,
            failurePostLink: payInfo.failurePostLink,
            language: lang,
            description: "Оплата в интернет",
            accountId: payInfo.portalUserUID,
            terminal: terminalId,
            amount: payInfo.paySumm,
            currency: "KZT",
            data: jsonData,
            cardSave: true,  //Параметр должен передаваться как Boolean
            email: payInfo.userEmail
        };
        var dataJson  = JSON.parse(payInfo.auth).model;
        var value = JSON.parse(JSON.stringify(dataJson)).value;
        console.log(value)
        paymentObject.auth = JSON.parse(value);
        console.log(paymentObject);
        return paymentObject;
    };
    var callBk = function (result) {
        if (result.success === true) {
            console.log("payment recieved");
        } else {
            console.log("payment discarded");
            var store = me.getStore('main.Notifications');
            store.load({
                callback: function (records, operation, success) {
                    if (success == true) me.onNotificationsLoaded(store);
                }
            });
        }
    };
    halyk.showPaymentWidget(createPaymentObject(payInfo), callBk);


}