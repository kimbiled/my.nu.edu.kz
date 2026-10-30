Ext.define('MyMain.view.main.params.ParamsMealPlan', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsmealplan',
    cls:'noborder',
    itemId:'params',
    semestrInfo:null,
    originalCost:0,
    fullCost:0,
    monthes:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],


    initComponent: function () {
        this.items = [
            {
                xtype:'panel',
                cls:'noborder',
                itemId:'paramsDetails',
                html:''
            }
        ];
        this.callParent(arguments);
    },
    
    initParams:function(params){
        Ext.MessageBox.show({
            msg: 'service info retrieving',
            progressText: 'service info retrieving',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        var me = this;
        Ext.Ajax.request({
            url: basePath+'rest/services/info/mealplan',
            method: 'GET',
            scope: this,
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    me.mealPlanInfo(json.data);
                } else {
                    Ext.Msg.alert('Error', 'Error on service info retrieving: '+json.errorMessage+'. Please contact our support – helpdesk@nu.edu.kz');
                }
            },
            failure: function () {
                Ext.MessageBox.hide();
                Ext.Msg.alert('Error','Error on service info retrieving'); 
            }
        });
    },
    
    mealPlanInfo:function(mealPlanInfo){
        this.mealPlanInfo = mealPlanInfo;
        var mainController = MyMain.app.getController('Main');
        if (!mealPlanInfo.allowed){
            //Ext.Msg.alert('Warning','No valid meal plan information found. Please contact our support – helpdesk@nu.edu.kz');
            Ext.Msg.show({
                title      : 'Warning',
                msg        : 'No valid meal plan information found. Please contact our support – helpdesk@nu.edu.kz',
                width      : 300,
                buttons    : Ext.MessageBox.OK
            });
            mainController.getServiceDetails().disablePayButton();
            return;
        }
        const beginMonth = new Date(mealPlanInfo.beginDate).getMonth();
        const beginDate = new Date(mealPlanInfo.beginDate).getDate();
        const endMonth = new Date(mealPlanInfo.endDate).getMonth();
        const endDate = new Date(mealPlanInfo.endDate).getDate();

        var info =
        '<div>Month <b>'+this.monthes[mealPlanInfo.month-1]+' '+mealPlanInfo.year+' </b></div>'+
        '<div>Payment during <b>'+ this.monthes[beginMonth] + ' ' + beginDate + ' to ' + this.monthes[endMonth] + ' ' + endDate + '</b></div>';
        this.down('#paramsDetails').update(info);
        mainController.currentService.raw.cost = mealPlanInfo.cost;

        this.originalCost = mealPlanInfo.cost;
        this.fullCost =  mealPlanInfo.cost;
        mainController.getServiceDetails().setPaySumm(mealPlanInfo.cost);
        this.hasMealplanDebt();
    },
    
    getParams:function(){
        return {type:'MealPlan', originalCost:this.originalCost, fullCost: this.fullCost, mealPlanInfo:this.mealPlanInfo};
    },

    isPaid:function(){
        console.log(' Month of Mealplan::: '+this.mealPlanInfo.month);
        Ext.Ajax.request({
            url: basePath+'rest/payments/canPayMealplan?month=' + this.mealPlanInfo.month,
            method: 'GET',
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    const canPayMealplan = json.data;
                    if(!canPayMealplan) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'This service fee has already been paid. Please contact our support – helpdesk@nu.edu.kz');
                    }
                } else {
                    Ext.Msg.alert('Error', 'Error on service info retrieving: '+json.errorMessage+'. Please contact our support – helpdesk@nu.edu.kz');
                }
            },
            failure: function() {
                Ext.Msg.alert('Error','Error on checking paid MealPlan payments. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    },

    hasMealplanDebt:function(){
        var me = this;
        Ext.Ajax.request({
            url: basePath+'rest/payments/hasMealplanDebt',
            method: 'GET',
            success: function (response) {
                Ext.MessageBox.hide();
                var json = JSON.parse(response.responseText);
                if (json.success==true){
                    const hasMealplanDebt = json.data;
                    if (hasMealplanDebt) {
                        MyMain.app.getController('Main').getServiceDetails().showMsgDisableBtn('Warning', 'Please pay the bill for meal plan in section "My payments"');
                    } else {
                        me.isPaid();
                    }
                } else {
                    Ext.Msg.alert('Error', 'Error on service info retrieving: '+json.errorMessage+'. Please contact our support – helpdesk@nu.edu.kz');
                }
            },
            failure: function() {
                Ext.Msg.alert('Error','Error on checking paid MealPlan payments. Please contact our support – helpdesk@nu.edu.kz');
            }
        });
    }
});