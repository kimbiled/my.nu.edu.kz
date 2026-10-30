Ext.namespace('Utils');


Utils.messages = function () {
    var msgCt;

    function createBox(t, s) {
        return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }

    return {
        msg: function (title, format) {
            if (!msgCt) {
                msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('b');//
            m.ghost("t", {delay: 3000, remove: true});
        },

        init: function () {
            if (!msgCt) {
                // It's better to create the msg-div here in order to avoid re-layouts 
                // later that could interfere with the HtmlEditor and reset its iFrame.
                msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
            }
        }
    };
}();
	
Utils.cloneObject = function(obj) {
		if(!o || 'object' !== typeof o) {
        return o;
    }
    if('function' === typeof o.clone) {
        return o.clone();
    }
    var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
    var p, v;
    for(p in o) {
        if(o.hasOwnProperty(p)) {
            v = o[p];
            if(v && 'object' === typeof v) {
                c[p] = Utils.cloneObject(v);
            }
            else {
                c[p] = v;
            }
        }
    }
    return c;
};

Utils.padLeft = function(str, count) {
    if (str!=null){
        while(str.length < count){
            str = '0'+str;
        }
    }
    return str;
};
    
Utils.timeConverter = function(a){
    var year = a.getFullYear();
    var padDigit = function(i) {
        return (i < 10) ? "0" + i : "" + i;
    };
    var month = padDigit(a.getMonth()+1);
    var date = padDigit(a.getDate());
    var time = date+''+month+''+year;
    return time;
};


Utils.joinList = function(list, field, delimiter){
    var res = '', del = '';
    list.each(function(rec){
        res = res + del + rec.get(field);
        del = delimiter;
    });
    return res;
};

Utils.selectService = function(groupId, serviceId){
    MyMain.app.getController('Main').onServiceSelected(groupId, serviceId);
};

Utils.addSelected = function(label){
    Ext.select('.service-list .label').each(function(el){
        el.removeCls('visited');
    });
    Ext.get(label).addCls('visited');
};