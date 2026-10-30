Ext.define('MyMain.view.main.FilterPanel', {
    extend: 'Ext.form.Panel',
    xtype: 'filterpanel',
	cls:'noborder',
	layout: 'hbox',
	padding: '12 0 12 12',
	width: 800,
    initComponent:function(){
        this.items = [
			{
			    xtype: 'fieldset',
			    defaultType: 'checkbox',
		        layout:'hbox',
		        border: false,
		        padding: '6 0 0 0',
                width: 122,
		        items: [
		            { 
		            	fieldLabel: 'Invoices', 
		            	name: 'invoices',  
		            	checked: false,
		            	labelWidth: 64,
		            	padding: '0 10 0 0'
		            }
		        ]
	    	},{
			    xtype: 'combobox',
			    name: 'type',
			    fieldLabel: 'Type',
			    displayField: 'serviceName',
			    valueField: 'serviceCode',
			    emptyText: 'All',
			    margin: '0 6 0 0',
			    store: 'main.AvailableServices',
			    labelWidth: 35,
			    width: 200,
			    cls:'x-border-box, x-border-box',
			    allowBlank: false,
			    forceSelection: true
			},{
			    xtype: 'datefield',
			    fieldLabel: 'Date',
			    format: 'd.m.Y',
			    margin: '0 6 0 0',
			    labelWidth: 35,
			    cls:'x-border-box, x-border-box',
			    width: 157,
			    name: 'dateFrom'
			},{
				xtype: 'label',
				text: '-',
				padding: '5 0 0 0',
				width: 10
			},{
			    xtype: 'datefield',
			    format: 'd.m.Y',
			    cls:'x-border-box, x-border-box',
			    labelWidth: 10,
			    width: 122,
			    margin: '0 10 0 0',
			    name: 'dateTo'
			},{
			    xtype: 'button',
			    margin: '3 6 0 0',
			    text: 'Clear',
			    action:'clearFilterForm',
				style : {
			    	'height':'20px',
                    'width':'100px'
				}
			} 
        ];  
        this.callParent();  
    }
});