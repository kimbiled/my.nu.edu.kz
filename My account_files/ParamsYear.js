Ext.define('MyMain.view.main.params.ParamsYear', {
    extend: 'Ext.panel.Panel',
    xtype: 'paramsyear',
    cls:'noborder',
    itemId:'params',

    yearPlanInfo:{
        beginDate: null,
        yearCount: 1,
        year: null
    },
    originalCost:0,
    fullCost:0,


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

        this.yearPlanInfo.year = new Date().getYear();
       // this.yearPlanInfo.beginDate =Ext.Date.format(new Date(),'d.m.Y') ;
        this.yearPlanInfo.beginDate =new Date() ;

        var mainController = MyMain.app.getController('Main');
        this.originalCost =  mainController.currentService.data.cost;
        this.fullCost =  mainController.currentService.data.cost;

        console.log('this.yearPlanInfo.beginDate');
        console.log(this.yearPlanInfo.beginDate);

        var info =
            '<div style="font-weight: bolder">Pay for the year</div>';
            this.down('#paramsDetails').update(info);

    },
        
    getParams:function(){
        return {type:'Year', yearPlanInfo: this.yearPlanInfo, originalCost:this.originalCost, fullCost: this.fullCost };
    }
});