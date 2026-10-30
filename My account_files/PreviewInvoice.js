Ext.define('MyMain.view.main.PreviewInvoice', {
    extend: 'Ext.form.Panel',
    xtype: 'previewinvoice',
    cls:'noborder',
    data: null,
    alias: 'widget.previewinvoice',
    requires: [
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.panel.Panel'
    ],

    controller: 'previewinvoice',
    viewModel: {
        type: 'previewinvoice'
    },
    height: 500,
    itemId: 'previewinvoice',
    width: 817,
    items: [
        {
            xtype: 'panel',
            height: 490,
            itemId: 'previewPanel',
            scrollable: true,
            width: 800,
            title: ''
        }
    ],
});