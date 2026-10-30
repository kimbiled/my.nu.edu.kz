Ext.define('MyMain.view.main.UserPayments', {
    extend: 'Ext.grid.Panel',
    xtype: 'userpaymentlist',
	cls:'noborder',
    store: 'main.Payments',
    disableSelection: true,
    scroll : false,
	width: 800,
    initComponent:function(){
    	this.viewConfig = {
	        stripeRows: true,
	        getRowClass: function(record) {
	        	if(record.get('isRefunded')>0){
	        		'refunded';
                }
	        	else{
	        		return record.get('invoiceNumber') != null && (record.get('rpb_id') == 0 || record.get('rpb_id') == null) ? 'unpaid' : record.get('status') == 0 ? 'paid' : 'cancelled';
                }
	        } 
	    };
        this.columns = [
	        {
	            xtype: 'rownumberer',
	            text: '#',
	            width: 35
	        },{
                xtype: 'actioncolumn',
                itemId: 'viewBill',
                iconCls: 'view-icon',
                menuDisabled: true,
                sortable: false,
                width: 20/*,
	            isDisabled: function(view, rowIndex, colIndex, item, record) {
	                return !(record.get('serviceCode') == '401' || record.get('serviceCode') == '601' || record.get('serviceCode') == '604' || record.get('serviceCode') == '602' ||   record.get('serviceCode') == '402' || record.get('serviceCode') == '403');
	            }*/
            },{
                xtype: 'actioncolumn',
                menuDisabled: true,
                itemId: 'pay',
                iconCls: 'pay-icon',
                sortable: false,
                width: 20,
                isDisabled: function(view, rowIndex, colIndex, item, record) {
                    //var disabled = !(record.get('type') == 1 && (record.get('paymentDocNumber') == null || record.get('status') >= 1) && record.get('rpb_id') == 0);
                    var disabled = (record.get('rpb_id') > 0 || record.get('serviceCode') == '604');
                    console.log(record);
                    console.log("record.get('rpb_id') > 0 || record.get('serviceCode') == '604' " + (record.get('rpb_id') > 0 || record.get('serviceCode') == '604'));
                    return  disabled;

                }
            },{
	            text: "Service",
	            dataIndex: 'serviceName',
	            width: 135,
	            menuDisabled: true,
                sortable: false
	        },{
	            text: "Due date",
	            dataIndex: 'paymentDeadline',
	            width: 76,
	            menuDisabled: true,
	            sortable: false,
	            renderer: function(value){
	            	return value == null ? '' : Ext.util.Format.date(new Date(value), 'd.m.Y');
	            }
	        },{
	            text: "Invoice Num",
	            dataIndex: 'invoiceNumber',
	            width: 70,
	            menuDisabled: true,
	            sortable: false
	        },{
                text: "Invoice Semester",
                dataIndex: 'invoiceSemester',
                width: 95,
                menuDisabled: true,
                sortable: false
            },{
	            text: "Invoice Sum",
	            dataIndex: 'sum',
	            width: 68,
	            menuDisabled: true,
	            sortable: false
	        },{
				text: "Status",
				dataIndex: 'status',
				width: 55,
				menuDisabled: true,
				sortable: false,
				renderer: function(val, meta, record, rowIndex) {
                    if(record.get('isRefunded')>0){
                        return 'Refunded';
                    } else {
                        return record.get('invoiceNumber') != null && (record.get('rpb_id') == 0 || record.get('rpb_id') == null) ? 'Unpaid' : record.get('status') == 0 ? 'Paid' : 'Cancelled';
					}
				}
			},{
	            text: "Payment Date",
	            dataIndex: 'paymentDate',
	            width: 79,
	            menuDisabled: true,
	            sortable: false,
	            renderer: function(value){
	            	return value == null ? '' : Ext.util.Format.date(new Date(value), 'd.m.Y');
	            }
	        },{
	            text: "Payment Number",
	            dataIndex: 'paymentDocNumber',
	            width: 97,
	            menuDisabled: true,
	            sortable: false
	        },{
	            text: "Paid",
	            dataIndex: 'paymentAmount',
	            width: 50,
	            menuDisabled: true,
	            sortable: false
	        }
        ];  
		this.bbar = [ 
	        {
				xtype : 'pagingtoolbar',
				store : 'main.Payments',
				cls : 'nopaddingbar noborder pagingtoolbar',
				displayInfo : true
			}, 
			{
				xtype : 'tbspacer',
				flex : 1
			}, 
			{
				xtype : 'button',
				text : 'Excel',
				margin : '3 6 0 0',
				action : 'exportPaymentListToExcel'
			}, 
			{
				xtype : 'button',
				text : 'PDF',
				margin : '3 0 0 0',
				action : 'exportPaymentListToPdf'
			} 
		];
		this.callParent();  
    }
});