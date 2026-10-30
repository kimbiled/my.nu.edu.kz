/*
	Copyright (c) 2004-2013, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


var OpenAjax=OpenAjax||{};
if(!OpenAjax.hub){
OpenAjax.hub=function(){
var _1={};
var _2="org.openajax.hub.";
return {implementer:"http://openajax.org",implVersion:"2.0.6",specVersion:"2.0",implExtraData:{},libraries:_1,registerLibrary:function(_3,_4,_5,_6){
_1[_3]={prefix:_3,namespaceURI:_4,version:_5,extraData:_6};
this.publish(_2+"registerLibrary",_1[_3]);
},unregisterLibrary:function(_7){
this.publish(_2+"unregisterLibrary",_1[_7]);
delete _1[_7];
}};
}();
OpenAjax.hub.Error={BadParameters:"OpenAjax.hub.Error.BadParameters",Disconnected:"OpenAjax.hub.Error.Disconnected",Duplicate:"OpenAjax.hub.Error.Duplicate",NoContainer:"OpenAjax.hub.Error.NoContainer",NoSubscription:"OpenAjax.hub.Error.NoSubscription",NotAllowed:"OpenAjax.hub.Error.NotAllowed",WrongProtocol:"OpenAjax.hub.Error.WrongProtocol",IncompatBrowser:"OpenAjax.hub.Error.IncompatBrowser"};
OpenAjax.hub.SecurityAlert={LoadTimeout:"OpenAjax.hub.SecurityAlert.LoadTimeout",FramePhish:"OpenAjax.hub.SecurityAlert.FramePhish",ForgedMsg:"OpenAjax.hub.SecurityAlert.ForgedMsg"};
OpenAjax.hub._debugger=function(){
};
OpenAjax.hub.ManagedHub=function(_8){
if(!_8||!_8.onPublish||!_8.onSubscribe){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
this._p=_8;
this._onUnsubscribe=_8.onUnsubscribe?_8.onUnsubscribe:null;
this._scope=_8.scope||window;
if(_8.log){
var _9=this;
this._log=function(_a){
try{
_8.log.call(_9._scope,"ManagedHub: "+_a);
}
catch(e){
OpenAjax.hub._debugger();
}
};
}else{
this._log=function(){
};
}
this._subscriptions={c:{},s:null};
this._containers={};
this._seq=0;
this._active=true;
this._isPublishing=false;
this._pubQ=[];
};
OpenAjax.hub.ManagedHub.prototype.subscribeForClient=function(_b,_c,_d){
this._assertConn();
if(this._invokeOnSubscribe(_c,_b)){
return this._subscribe(_c,this._sendToClient,this,{c:_b,sid:_d});
}
throw new Error(OpenAjax.hub.Error.NotAllowed);
};
OpenAjax.hub.ManagedHub.prototype.unsubscribeForClient=function(_e,_f){
this._unsubscribe(_f);
this._invokeOnUnsubscribe(_e,_f);
};
OpenAjax.hub.ManagedHub.prototype.publishForClient=function(_10,_11,_12){
this._assertConn();
this._publish(_11,_12,_10);
};
OpenAjax.hub.ManagedHub.prototype.disconnect=function(){
this._active=false;
for(var c in this._containers){
this.removeContainer(this._containers[c]);
}
};
OpenAjax.hub.ManagedHub.prototype.getContainer=function(_13){
var _14=this._containers[_13];
return _14?_14:null;
};
OpenAjax.hub.ManagedHub.prototype.listContainers=function(){
var res=[];
for(var c in this._containers){
res.push(this._containers[c]);
}
return res;
};
OpenAjax.hub.ManagedHub.prototype.addContainer=function(_15){
this._assertConn();
var _16=_15.getClientID();
if(this._containers[_16]){
throw new Error(OpenAjax.hub.Error.Duplicate);
}
this._containers[_16]=_15;
};
OpenAjax.hub.ManagedHub.prototype.removeContainer=function(_17){
var _18=_17.getClientID();
if(!this._containers[_18]){
throw new Error(OpenAjax.hub.Error.NoContainer);
}
_17.remove();
delete this._containers[_18];
};
OpenAjax.hub.ManagedHub.prototype.subscribe=function(_19,_1a,_1b,_1c,_1d){
this._assertConn();
this._assertSubTopic(_19);
if(!_1a){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
_1b=_1b||window;
if(!this._invokeOnSubscribe(_19,null)){
this._invokeOnComplete(_1c,_1b,null,false,OpenAjax.hub.Error.NotAllowed);
return;
}
var _1e=this;
function _1f(_20,_21,sd,_22){
if(_1e._invokeOnPublish(_20,_21,_22,null)){
try{
_1a.call(_1b,_20,_21,_1d);
}
catch(e){
OpenAjax.hub._debugger();
_1e._log("caught error from onData callback to Hub.subscribe(): "+e.message);
}
}
};
var _23=this._subscribe(_19,_1f,_1b,_1d);
this._invokeOnComplete(_1c,_1b,_23,true);
return _23;
};
OpenAjax.hub.ManagedHub.prototype.publish=function(_24,_25){
this._assertConn();
this._assertPubTopic(_24);
this._publish(_24,_25,null);
};
OpenAjax.hub.ManagedHub.prototype.unsubscribe=function(_26,_27,_28){
this._assertConn();
if(!_26){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
this._unsubscribe(_26);
this._invokeOnUnsubscribe(null,_26);
this._invokeOnComplete(_27,_28,_26,true);
};
OpenAjax.hub.ManagedHub.prototype.isConnected=function(){
return this._active;
};
OpenAjax.hub.ManagedHub.prototype.getScope=function(){
return this._scope;
};
OpenAjax.hub.ManagedHub.prototype.getSubscriberData=function(_29){
this._assertConn();
var _2a=_29.split(".");
var sid=_2a.pop();
var sub=this._getSubscriptionObject(this._subscriptions,_2a,0,sid);
if(sub){
return sub.data;
}
throw new Error(OpenAjax.hub.Error.NoSubscription);
};
OpenAjax.hub.ManagedHub.prototype.getSubscriberScope=function(_2b){
this._assertConn();
var _2c=_2b.split(".");
var sid=_2c.pop();
var sub=this._getSubscriptionObject(this._subscriptions,_2c,0,sid);
if(sub){
return sub.scope;
}
throw new Error(OpenAjax.hub.Error.NoSubscription);
};
OpenAjax.hub.ManagedHub.prototype.getParameters=function(){
return this._p;
};
OpenAjax.hub.ManagedHub.prototype._sendToClient=function(_2d,_2e,sd,_2f){
if(!this.isConnected()){
return;
}
if(this._invokeOnPublish(_2d,_2e,_2f,sd.c)){
sd.c.sendToClient(_2d,_2e,sd.sid);
}
};
OpenAjax.hub.ManagedHub.prototype._assertConn=function(){
if(!this.isConnected()){
throw new Error(OpenAjax.hub.Error.Disconnected);
}
};
OpenAjax.hub.ManagedHub.prototype._assertPubTopic=function(_30){
if(!_30||_30===""||(_30.indexOf("*")!=-1)||(_30.indexOf("..")!=-1)||(_30.charAt(0)==".")||(_30.charAt(_30.length-1)==".")){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
};
OpenAjax.hub.ManagedHub.prototype._assertSubTopic=function(_31){
if(!_31){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var _32=_31.split(".");
var len=_32.length;
for(var i=0;i<len;i++){
var p=_32[i];
if((p==="")||((p.indexOf("*")!=-1)&&(p!="*")&&(p!="**"))){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
if((p=="**")&&(i<len-1)){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
}
};
OpenAjax.hub.ManagedHub.prototype._invokeOnComplete=function(_33,_34,_35,_36,_37){
if(_33){
try{
_34=_34||window;
_33.call(_34,_35,_36,_37);
}
catch(e){
OpenAjax.hub._debugger();
this._log("caught error from onComplete callback: "+e.message);
}
}
};
OpenAjax.hub.ManagedHub.prototype._invokeOnPublish=function(_38,_39,_3a,_3b){
try{
return this._p.onPublish.call(this._scope,_38,_39,_3a,_3b);
}
catch(e){
OpenAjax.hub._debugger();
this._log("caught error from onPublish callback to constructor: "+e.message);
}
return false;
};
OpenAjax.hub.ManagedHub.prototype._invokeOnSubscribe=function(_3c,_3d){
try{
return this._p.onSubscribe.call(this._scope,_3c,_3d);
}
catch(e){
OpenAjax.hub._debugger();
this._log("caught error from onSubscribe callback to constructor: "+e.message);
}
return false;
};
OpenAjax.hub.ManagedHub.prototype._invokeOnUnsubscribe=function(_3e,_3f){
if(this._onUnsubscribe){
var _40=_3f.slice(0,_3f.lastIndexOf("."));
try{
this._onUnsubscribe.call(this._scope,_40,_3e);
}
catch(e){
OpenAjax.hub._debugger();
this._log("caught error from onUnsubscribe callback to constructor: "+e.message);
}
}
};
OpenAjax.hub.ManagedHub.prototype._subscribe=function(_41,_42,_43,_44){
var _45=_41+"."+this._seq;
var sub={scope:_43,cb:_42,data:_44,sid:this._seq++};
var _46=_41.split(".");
this._recursiveSubscribe(this._subscriptions,_46,0,sub);
return _45;
};
OpenAjax.hub.ManagedHub.prototype._recursiveSubscribe=function(_47,_48,_49,sub){
var _4a=_48[_49];
if(_49==_48.length){
sub.next=_47.s;
_47.s=sub;
}else{
if(typeof _47.c=="undefined"){
_47.c={};
}
if(typeof _47.c[_4a]=="undefined"){
_47.c[_4a]={c:{},s:null};
this._recursiveSubscribe(_47.c[_4a],_48,_49+1,sub);
}else{
this._recursiveSubscribe(_47.c[_4a],_48,_49+1,sub);
}
}
};
OpenAjax.hub.ManagedHub.prototype._publish=function(_4b,_4c,_4d){
if(this._isPublishing){
this._pubQ.push({t:_4b,d:_4c,p:_4d});
return;
}
this._safePublish(_4b,_4c,_4d);
while(this._pubQ.length>0){
var pub=this._pubQ.shift();
this._safePublish(pub.t,pub.d,pub.p);
}
};
OpenAjax.hub.ManagedHub.prototype._safePublish=function(_4e,_4f,_50){
this._isPublishing=true;
var _51=_4e.split(".");
this._recursivePublish(this._subscriptions,_51,0,_4e,_4f,_50);
this._isPublishing=false;
};
OpenAjax.hub.ManagedHub.prototype._recursivePublish=function(_52,_53,_54,_55,msg,_56){
if(typeof _52!="undefined"){
var _57;
if(_54==_53.length){
_57=_52;
}else{
this._recursivePublish(_52.c[_53[_54]],_53,_54+1,_55,msg,_56);
this._recursivePublish(_52.c["*"],_53,_54+1,_55,msg,_56);
_57=_52.c["**"];
}
if(typeof _57!="undefined"){
var sub=_57.s;
while(sub){
var sc=sub.scope;
var cb=sub.cb;
var d=sub.data;
if(typeof cb=="string"){
cb=sc[cb];
}
cb.call(sc,_55,msg,d,_56);
sub=sub.next;
}
}
}
};
OpenAjax.hub.ManagedHub.prototype._unsubscribe=function(_58){
var _59=_58.split(".");
var sid=_59.pop();
if(!this._recursiveUnsubscribe(this._subscriptions,_59,0,sid)){
throw new Error(OpenAjax.hub.Error.NoSubscription);
}
};
OpenAjax.hub.ManagedHub.prototype._recursiveUnsubscribe=function(_5a,_5b,_5c,sid){
if(typeof _5a=="undefined"){
return false;
}
if(_5c<_5b.length){
var _5d=_5a.c[_5b[_5c]];
if(!_5d){
return false;
}
this._recursiveUnsubscribe(_5d,_5b,_5c+1,sid);
if(!_5d.s){
for(var x in _5d.c){
return true;
}
delete _5a.c[_5b[_5c]];
}
}else{
var sub=_5a.s;
var _5e=null;
var _5f=false;
while(sub){
if(sid==sub.sid){
_5f=true;
if(sub==_5a.s){
_5a.s=sub.next;
}else{
_5e.next=sub.next;
}
break;
}
_5e=sub;
sub=sub.next;
}
if(!_5f){
return false;
}
}
return true;
};
OpenAjax.hub.ManagedHub.prototype._getSubscriptionObject=function(_60,_61,_62,sid){
if(typeof _60!="undefined"){
if(_62<_61.length){
var _63=_60.c[_61[_62]];
return this._getSubscriptionObject(_63,_61,_62+1,sid);
}
var sub=_60.s;
while(sub){
if(sid==sub.sid){
return sub;
}
sub=sub.next;
}
}
return null;
};
OpenAjax.hub._hub=new OpenAjax.hub.ManagedHub({onSubscribe:function(_64,_65){
return true;
},onPublish:function(_66,_67,_68,_69){
return true;
}});
OpenAjax.hub.subscribe=function(_6a,_6b,_6c,_6d){
if(typeof _6b==="string"){
_6c=_6c||window;
_6b=_6c[_6b]||null;
}
return OpenAjax.hub._hub.subscribe(_6a,_6b,_6c,null,_6d);
};
OpenAjax.hub.unsubscribe=function(_6e){
return OpenAjax.hub._hub.unsubscribe(_6e);
};
OpenAjax.hub.publish=function(_6f,_70){
OpenAjax.hub._hub.publish(_6f,_70);
};
OpenAjax.hub.registerLibrary("OpenAjax","http://openajax.org/hub","2.0",{});
}
OpenAjax.hub.InlineContainer=function(hub,_71,_72){
if(!hub||!_71||!_72||!_72.Container||!_72.Container.onSecurityAlert){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var _73=_72.Container.scope||window;
var _74=false;
var _75=[];
var _76=0;
var _77=null;
if(_72.Container.log){
var log=function(msg){
try{
_72.Container.log.call(_73,"InlineContainer::"+_71+": "+msg);
}
catch(e){
OpenAjax.hub._debugger();
}
};
}else{
log=function(){
};
}
this._init=function(){
hub.addContainer(this);
};
this.getHub=function(){
return hub;
};
this.sendToClient=function(_78,_79,_7a){
if(_74){
var sub=_75[_7a];
try{
sub.cb.call(sub.sc,_78,_79,sub.d);
}
catch(e){
OpenAjax.hub._debugger();
_77._log("caught error from onData callback to HubClient.subscribe(): "+e.message);
}
}
};
this.remove=function(){
if(_74){
_7b();
}
};
this.isConnected=function(){
return _74;
};
this.getClientID=function(){
return _71;
};
this.getPartnerOrigin=function(){
if(_74){
return window.location.protocol+"//"+window.location.hostname;
}
return null;
};
this.getParameters=function(){
return _72;
};
this.connect=function(_7c,_7d,_7e){
if(_74){
throw new Error(OpenAjax.hub.Error.Duplicate);
}
_74=true;
_77=_7c;
if(_72.Container.onConnect){
try{
_72.Container.onConnect.call(_73,this);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onConnect callback to constructor: "+e.message);
}
}
_7f(_7d,_7e,_7c,true);
};
this.disconnect=function(_80,_81,_82){
if(!_74){
throw new Error(OpenAjax.hub.Error.Disconnected);
}
_7b();
if(_72.Container.onDisconnect){
try{
_72.Container.onDisconnect.call(_73,this);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onDisconnect callback to constructor: "+e.message);
}
}
_7f(_81,_82,_80,true);
};
this.subscribe=function(_83,_84,_85,_86,_87){
_88();
_89(_83);
if(!_84){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var _8a=""+_76++;
var _8b=false;
var msg=null;
try{
var _8c=hub.subscribeForClient(this,_83,_8a);
_8b=true;
}
catch(e){
_8a=null;
msg=e.message;
}
_85=_85||window;
if(_8b){
_75[_8a]={h:_8c,cb:_84,sc:_85,d:_87};
}
_7f(_86,_85,_8a,_8b,msg);
return _8a;
};
this.publish=function(_8d,_8e){
_88();
_8f(_8d);
hub.publishForClient(this,_8d,_8e);
};
this.unsubscribe=function(_90,_91,_92){
_88();
if(typeof _90==="undefined"||_90===null){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var sub=_75[_90];
if(!sub){
throw new Error(OpenAjax.hub.Error.NoSubscription);
}
hub.unsubscribeForClient(this,sub.h);
delete _75[_90];
_7f(_91,_92,_90,true);
};
this.getSubscriberData=function(_93){
_88();
return _94(_93).d;
};
this.getSubscriberScope=function(_95){
_88();
return _94(_95).sc;
};
function _7f(_96,_97,_98,_99,_9a){
if(_96){
try{
_97=_97||window;
_96.call(_97,_98,_99,_9a);
}
catch(e){
OpenAjax.hub._debugger();
_77._log("caught error from onComplete callback: "+e.message);
}
}
};
function _7b(){
for(var _9b in _75){
hub.unsubscribeForClient(this,_75[_9b].h);
}
_75=[];
_76=0;
_74=false;
};
function _88(){
if(!_74){
throw new Error(OpenAjax.hub.Error.Disconnected);
}
};
function _8f(_9c){
if((_9c==null)||(_9c==="")||(_9c.indexOf("*")!=-1)||(_9c.indexOf("..")!=-1)||(_9c.charAt(0)==".")||(_9c.charAt(_9c.length-1)==".")){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
};
function _89(_9d){
if(!_9d){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var _9e=_9d.split(".");
var len=_9e.length;
for(var i=0;i<len;i++){
var p=_9e[i];
if((p==="")||((p.indexOf("*")!=-1)&&(p!="*")&&(p!="**"))){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
if((p=="**")&&(i<len-1)){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
}
};
function _94(_9f){
var sub=_75[_9f];
if(sub){
return sub;
}
throw new Error(OpenAjax.hub.Error.NoSubscription);
};
this._init();
};
OpenAjax.hub.InlineHubClient=function(_a0){
if(!_a0||!_a0.HubClient||!_a0.HubClient.onSecurityAlert||!_a0.InlineHubClient||!_a0.InlineHubClient.container){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var _a1=_a0.InlineHubClient.container;
var _a2=_a0.HubClient.scope||window;
if(_a0.HubClient.log){
var log=function(msg){
try{
_a0.HubClient.log.call(_a2,"InlineHubClient::"+_a1.getClientID()+": "+msg);
}
catch(e){
OpenAjax.hub._debugger();
}
};
}else{
log=function(){
};
}
this._log=log;
this.connect=function(_a3,_a4){
_a1.connect(this,_a3,_a4);
};
this.disconnect=function(_a5,_a6){
_a1.disconnect(this,_a5,_a6);
};
this.getPartnerOrigin=function(){
return _a1.getPartnerOrigin();
};
this.getClientID=function(){
return _a1.getClientID();
};
this.subscribe=function(_a7,_a8,_a9,_aa,_ab){
return _a1.subscribe(_a7,_a8,_a9,_aa,_ab);
};
this.publish=function(_ac,_ad){
_a1.publish(_ac,_ad);
};
this.unsubscribe=function(_ae,_af,_b0){
_a1.unsubscribe(_ae,_af,_b0);
};
this.isConnected=function(){
return _a1.isConnected();
};
this.getScope=function(){
return _a2;
};
this.getSubscriberData=function(_b1){
return _a1.getSubscriberData(_b1);
};
this.getSubscriberScope=function(_b2){
return _a1.getSubscriberScope(_b2);
};
this.getParameters=function(){
return _a0;
};
};
var OpenAjax=OpenAjax||{};
OpenAjax.hub=OpenAjax.hub||{};
OpenAjax.gadgets=typeof OpenAjax.gadgets==="object"?OpenAjax.gadgets:typeof gadgets==="object"?gadgets:{};
OpenAjax.gadgets.rpctx=OpenAjax.gadgets.rpctx||{};
(function(){
if(typeof gadgets==="undefined"){
if(typeof oaaConfig==="undefined"){
var _b3=document.getElementsByTagName("script");
var _b4=/openajax(?:managedhub-(?:all|core).*|-mashup)\.js$/i;
for(var i=_b3.length-1;i>=0;i--){
var src=_b3[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_b4);
if(m){
var _b5=_b3[i].getAttribute("oaaConfig");
if(_b5){
try{
oaaConfig=eval("({ "+_b5+" })");
}
catch(e){
}
}
break;
}
}
}
if(typeof oaaConfig!=="undefined"&&oaaConfig.gadgetsGlobal){
gadgets=OpenAjax.gadgets;
}
}
})();
if(!OpenAjax.hub.IframeContainer){
(function(){
OpenAjax.hub.IframeContainer=function(hub,_b6,_b7){
_b8(arguments);
var _b9=this;
var _ba=_b7.Container.scope||window;
var _bb=false;
var _bc={};
var _bd;
var _be;
var _bf=_b7.IframeContainer.timeout||15000;
var _c0;
if(_b7.Container.log){
var log=function(msg){
try{
_b7.Container.log.call(_ba,"IframeContainer::"+_b6+": "+msg);
}
catch(e){
OpenAjax.hub._debugger();
}
};
}else{
log=function(){
};
}
this._init=function(){
hub.addContainer(this);
_be=OpenAjax.hub.IframeContainer._rpcRouter.add(_b6,this);
_bd=_114(_b7,_ba,log);
var _c1=_b7.IframeContainer.clientRelay;
var _c2=OpenAjax.gadgets.rpc.getRelayChannel();
if(_b7.IframeContainer.tunnelURI){
if(_c2!=="wpm"&&_c2!=="ifpc"){
throw new Error(OpenAjax.hub.Error.IncompatBrowser);
}
}else{
log("WARNING: Parameter 'IframeContaienr.tunnelURI' not specified. Connection will not be fully secure.");
if(_c2==="rmr"&&!_c1){
_c1=OpenAjax.gadgets.rpc.getOrigin(_b7.IframeContainer.uri)+"/robots.txt";
}
}
_c3();
OpenAjax.gadgets.rpc.setupReceiver(_be,_c1);
_c4();
};
this.sendToClient=function(_c5,_c6,_c7){
OpenAjax.gadgets.rpc.call(_be,"openajax.pubsub",null,"pub",_c5,_c6,_c7);
};
this.remove=function(){
_c8();
clearTimeout(_c0);
OpenAjax.gadgets.rpc.removeReceiver(_be);
var _c9=document.getElementById(_be);
_c9.parentNode.removeChild(_c9);
OpenAjax.hub.IframeContainer._rpcRouter.remove(_be);
};
this.isConnected=function(){
return _bb;
};
this.getClientID=function(){
return _b6;
};
this.getPartnerOrigin=function(){
if(_bb){
var _ca=OpenAjax.gadgets.rpc.getReceiverOrigin(_be);
if(_ca){
return (/^([a-zA-Z]+:\/\/[^:]+).*/.exec(_ca)[1]);
}
}
return null;
};
this.getParameters=function(){
return _b7;
};
this.getHub=function(){
return hub;
};
this.getIframe=function(){
return document.getElementById(_be);
};
function _b8(_cb){
var hub=_cb[0],_b6=_cb[1],_b7=_cb[2];
if(!hub||!_b6||!_b7||!_b7.Container||!_b7.Container.onSecurityAlert||!_b7.IframeContainer||!_b7.IframeContainer.parent||!_b7.IframeContainer.uri){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
};
this._handleIncomingRPC=function(_cc,_cd,_ce){
switch(_cc){
case "pub":
hub.publishForClient(_b9,_cd,_ce);
break;
case "sub":
var _cf="";
try{
_bc[_ce]=hub.subscribeForClient(_b9,_cd,_ce);
}
catch(e){
_cf=e.message;
}
return _cf;
case "uns":
var _d0=_bc[_ce];
hub.unsubscribeForClient(_b9,_d0);
delete _bc[_ce];
return _ce;
case "con":
_d1();
return true;
case "dis":
_c4();
_c8();
if(_b7.Container.onDisconnect){
try{
_b7.Container.onDisconnect.call(_ba,_b9);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onDisconnect callback to constructor: "+e.message);
}
}
return true;
}
};
this._onSecurityAlert=function(_d2){
_d3(_113[_d2]);
};
function _c3(){
var _d4=document.createElement("span");
_b7.IframeContainer.parent.appendChild(_d4);
var _d5="<iframe id=\""+_be+"\" name=\""+_be+"\" src=\"javascript:'<html></html>'\"";
var _d6="";
var _d7=_b7.IframeContainer.iframeAttrs;
if(_d7){
for(var _d8 in _d7){
switch(_d8){
case "style":
for(var _d9 in _d7.style){
_d6+=_d9+":"+_d7.style[_d9]+";";
}
break;
case "className":
_d5+=" class=\""+_d7[_d8]+"\"";
break;
default:
_d5+=" "+_d8+"=\""+_d7[_d8]+"\"";
}
}
}
_d6+="visibility:hidden;";
_d5+=" style=\""+_d6+"\"></iframe>";
_d4.innerHTML=_d5;
var _da;
if(_b7.IframeContainer.tunnelURI){
_da="&parent="+encodeURIComponent(_b7.IframeContainer.tunnelURI)+"&forcesecure=true";
}else{
_da="&oahParent="+encodeURIComponent(OpenAjax.gadgets.rpc.getOrigin(window.location.href));
}
var _db="";
if(_be!==_b6){
_db="&oahId="+_be.substring(_be.lastIndexOf("_")+1);
}
document.getElementById(_be).src=_b7.IframeContainer.uri+"#rpctoken="+_bd+_da+_db;
};
function _d1(){
function _dc(_dd){
if(_dd){
_bb=true;
clearTimeout(_c0);
document.getElementById(_be).style.visibility="visible";
if(_b7.Container.onConnect){
try{
_b7.Container.onConnect.call(_ba,_b9);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onConnect callback to constructor: "+e.message);
}
}
}
};
OpenAjax.gadgets.rpc.call(_be,"openajax.pubsub",_dc,"cmd","con");
};
function _c8(){
if(_bb){
_bb=false;
document.getElementById(_be).style.visibility="hidden";
for(var s in _bc){
hub.unsubscribeForClient(_b9,_bc[s]);
}
_bc={};
}
};
function _d3(_de){
try{
_b7.Container.onSecurityAlert.call(_ba,_b9,_de);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onSecurityAlert callback to constructor: "+e.message);
}
};
function _c4(){
_c0=setTimeout(function(){
_d3(OpenAjax.hub.SecurityAlert.LoadTimeout);
_b9._handleIncomingRPC=function(){
};
},_bf);
};
this._init();
};
OpenAjax.hub.IframeHubClient=function(_df){
if(!_df||!_df.HubClient||!_df.HubClient.onSecurityAlert){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var _e0=this;
var _e1=_df.HubClient.scope||window;
var _e2=false;
var _e3={};
var _e4=0;
var _e5;
if(_df.HubClient.log){
var log=function(msg){
try{
_df.HubClient.log.call(_e1,"IframeHubClient::"+_e5+": "+msg);
}
catch(e){
OpenAjax.hub._debugger();
}
};
}else{
log=function(){
};
}
this._init=function(){
var _e6=OpenAjax.gadgets.util.getUrlParameters();
if(!_e6.parent){
var _e7=_e6.oahParent+"/robots.txt";
OpenAjax.gadgets.rpc.setupReceiver("..",_e7);
}
if(_df.IframeHubClient&&_df.IframeHubClient.requireParentVerifiable&&OpenAjax.gadgets.rpc.getReceiverOrigin("..")===null){
OpenAjax.gadgets.rpc.removeReceiver("..");
throw new Error(OpenAjax.hub.Error.IncompatBrowser);
}
OpenAjax.hub.IframeContainer._rpcRouter.add("..",this);
_e5=OpenAjax.gadgets.rpc.RPC_ID;
if(_e6.oahId){
_e5=_e5.substring(0,_e5.lastIndexOf("_"));
}
};
this.connect=function(_e8,_e9){
if(_e2){
throw new Error(OpenAjax.hub.Error.Duplicate);
}
function _ea(_eb){
if(_eb){
_e2=true;
if(_e8){
try{
_e8.call(_e9||window,_e0,true);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onComplete callback to connect(): "+e.message);
}
}
}
};
OpenAjax.gadgets.rpc.call("..","openajax.pubsub",_ea,"con");
};
this.disconnect=function(_ec,_ed){
if(!_e2){
throw new Error(OpenAjax.hub.Error.Disconnected);
}
_e2=false;
var _ee=null;
if(_ec){
_ee=function(_ef){
try{
_ec.call(_ed||window,_e0,true);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onComplete callback to disconnect(): "+e.message);
}
};
}
OpenAjax.gadgets.rpc.call("..","openajax.pubsub",_ee,"dis");
};
this.getPartnerOrigin=function(){
if(_e2){
var _f0=OpenAjax.gadgets.rpc.getReceiverOrigin("..");
if(_f0){
return (/^([a-zA-Z]+:\/\/[^:]+).*/.exec(_f0)[1]);
}
}
return null;
};
this.getClientID=function(){
return _e5;
};
this.subscribe=function(_f1,_f2,_f3,_f4,_f5){
_f6();
_f7(_f1);
if(!_f2){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
_f3=_f3||window;
var _f8=""+_e4++;
_e3[_f8]={cb:_f2,sc:_f3,d:_f5};
function _f9(_fa){
if(_fa!==""){
delete _e3[_f8];
}
if(_f4){
try{
_f4.call(_f3,_f8,_fa==="",_fa);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onComplete callback to subscribe(): "+e.message);
}
}
};
OpenAjax.gadgets.rpc.call("..","openajax.pubsub",_f9,"sub",_f1,_f8);
return _f8;
};
this.publish=function(_fb,_fc){
_f6();
_fd(_fb);
OpenAjax.gadgets.rpc.call("..","openajax.pubsub",null,"pub",_fb,_fc);
};
this.unsubscribe=function(_fe,_ff,_100){
_f6();
if(!_fe){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
if(!_e3[_fe]||_e3[_fe].uns){
throw new Error(OpenAjax.hub.Error.NoSubscription);
}
_e3[_fe].uns=true;
function _101(_102){
delete _e3[_fe];
if(_ff){
try{
_ff.call(_100||window,_fe,true);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onComplete callback to unsubscribe(): "+e.message);
}
}
};
OpenAjax.gadgets.rpc.call("..","openajax.pubsub",_101,"uns",null,_fe);
};
this.isConnected=function(){
return _e2;
};
this.getScope=function(){
return _e1;
};
this.getSubscriberData=function(_103){
_f6();
if(_e3[_103]){
return _e3[_103].d;
}
throw new Error(OpenAjax.hub.Error.NoSubscription);
};
this.getSubscriberScope=function(_104){
_f6();
if(_e3[_104]){
return _e3[_104].sc;
}
throw new Error(OpenAjax.hub.Error.NoSubscription);
};
this.getParameters=function(){
return _df;
};
this._handleIncomingRPC=function(_105,_106,data,_107){
if(_105==="pub"){
if(_e3[_107]&&!_e3[_107].uns){
try{
_e3[_107].cb.call(_e3[_107].sc,_106,data,_e3[_107].d);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from onData callback to subscribe(): "+e.message);
}
}
}
if(_106==="con"){
return true;
}
return false;
};
function _f6(){
if(!_e2){
throw new Error(OpenAjax.hub.Error.Disconnected);
}
};
function _f7(_108){
if(!_108){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
var path=_108.split(".");
var len=path.length;
for(var i=0;i<len;i++){
var p=path[i];
if((p==="")||((p.indexOf("*")!=-1)&&(p!="*")&&(p!="**"))){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
if((p=="**")&&(i<len-1)){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
}
};
function _fd(_109){
if(!_109||_109===""||(_109.indexOf("*")!=-1)||(_109.indexOf("..")!=-1)||(_109.charAt(0)==".")||(_109.charAt(_109.length-1)==".")){
throw new Error(OpenAjax.hub.Error.BadParameters);
}
};
this._init();
};
OpenAjax.hub.IframeContainer._rpcRouter=function(){
var _10a={};
function _10b(){
var r=_10a[this.f];
if(r){
return r._handleIncomingRPC.apply(r,arguments);
}
};
function _10c(_10d,_10e){
var r=_10a[_10d];
if(r){
r._onSecurityAlert.call(r,_10e);
}
};
return {add:function(id,_10f){
function _110(id,_111){
if(id===".."){
if(!_10a[".."]){
_10a[".."]=_111;
}
return;
}
var _112=id;
while(document.getElementById(_112)){
_112=id+"_"+((32767*Math.random())|0).toString(16);
}
_10a[_112]=_111;
return _112;
};
OpenAjax.gadgets.rpc.register("openajax.pubsub",_10b);
OpenAjax.gadgets.rpc.config({securityCallback:_10c});
_113[OpenAjax.gadgets.rpc.SEC_ERROR_LOAD_TIMEOUT]=OpenAjax.hub.SecurityAlert.LoadTimeout;
_113[OpenAjax.gadgets.rpc.SEC_ERROR_FRAME_PHISH]=OpenAjax.hub.SecurityAlert.FramePhish;
_113[OpenAjax.gadgets.rpc.SEC_ERROR_FORGED_MSG]=OpenAjax.hub.SecurityAlert.ForgedMsg;
this.add=_110;
return _110(id,_10f);
},remove:function(id){
delete _10a[id];
}};
}();
var _113={};
function _114(_115,_116,log){
if(!OpenAjax.hub.IframeContainer._prng){
var seed=new Date().getTime()+Math.random()+document.cookie;
OpenAjax.hub.IframeContainer._prng=OpenAjax._smash.crypto.newPRNG(seed);
}
var p=_115.IframeContainer||_115.IframeHubClient;
if(p&&p.seed){
try{
var _117=p.seed.call(_116);
OpenAjax.hub.IframeContainer._prng.addSeed(_117);
}
catch(e){
OpenAjax.hub._debugger();
log("caught error from 'seed' callback: "+e.message);
}
}
var _118=(p&&p.tokenLength)||6;
return OpenAjax.hub.IframeContainer._prng.nextRandomB64Str(_118);
};
})();
}
if(typeof OpenAjax._smash=="undefined"){
OpenAjax._smash={};
}
OpenAjax._smash.crypto={"strToWA":function(str,_119){
var bin=Array();
var mask=(1<<_119)-1;
for(var i=0;i<str.length*_119;i+=_119){
bin[i>>5]|=(str.charCodeAt(i/_119)&mask)<<(32-_119-i%32);
}
return bin;
},"hmac_sha1":function(_11a,_11b,_11c){
var ipad=Array(16),opad=Array(16);
for(var i=0;i<16;i++){
ipad[i]=_11a[i]^909522486;
opad[i]=_11a[i]^1549556828;
}
var hash=this.sha1(ipad.concat(this.strToWA(_11b,_11c)),512+_11b.length*_11c);
return this.sha1(opad.concat(hash),512+160);
},"newPRNG":function(_11d){
var that=this;
if((typeof _11d!="string")||(_11d.length<12)){
alert("WARNING: Seed length too short ...");
}
var _11e=[43417,15926,18182,33130,9585,30800,49772,40144,47678,55453,4659,38181,65340,6787,54417,65301];
var _11f=[];
var _120=0;
function _121(_122){
return that.hmac_sha1(_11e,_122,8);
};
function _123(_124){
var _125=_121(_124);
for(var i=0;i<5;i++){
_11f[i]^=_125[i];
}
};
_123(_11d);
return {"addSeed":function(seed){
_123(seed);
},"nextRandomOctets":function(len){
var _126=[];
while(len>0){
_120+=1;
var _127=that.hmac_sha1(_11f,(_120).toString(16),8);
for(i=0;(i<20)&(len>0);i++,len--){
_126.push((_127[i>>2]>>(i%4))%256);
}
}
return _126;
},"nextRandomB64Str":function(len){
var _128="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
var _129=this.nextRandomOctets(len);
var _12a="";
for(var i=0;i<len;i++){
_12a+=_128.charAt(_129[i]&63);
}
return _12a;
}};
},"sha1":function(){
var _12b=function(x,y){
var lsw=(x&65535)+(y&65535);
var msw=(x>>16)+(y>>16)+(lsw>>16);
return (msw<<16)|(lsw&65535);
};
var rol=function(num,cnt){
return (num<<cnt)|(num>>>(32-cnt));
};
function _12c(t,b,c,d){
if(t<20){
return (b&c)|((~b)&d);
}
if(t<40){
return b^c^d;
}
if(t<60){
return (b&c)|(b&d)|(c&d);
}
return b^c^d;
};
function _12d(t){
return (t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514;
};
return function(_12e,_12f){
_12e[_12f>>5]|=128<<(24-_12f%32);
_12e[((_12f+64>>9)<<4)+15]=_12f;
var W=Array(80);
var H0=1732584193;
var H1=-271733879;
var H2=-1732584194;
var H3=271733878;
var H4=-1009589776;
for(var i=0;i<_12e.length;i+=16){
var a=H0;
var b=H1;
var c=H2;
var d=H3;
var e=H4;
for(var j=0;j<80;j++){
W[j]=((j<16)?_12e[i+j]:rol(W[j-3]^W[j-8]^W[j-14]^W[j-16],1));
var T=_12b(_12b(rol(a,5),_12c(j,b,c,d)),_12b(_12b(e,W[j]),_12d(j)));
e=d;
d=c;
c=rol(b,30);
b=a;
a=T;
}
H0=_12b(a,H0);
H1=_12b(b,H1);
H2=_12b(c,H2);
H3=_12b(d,H3);
H4=_12b(e,H4);
}
return Array(H0,H1,H2,H3,H4);
};
}()};
if(!this.JSON){
JSON={};
}
(function(){
function f(n){
return n<10?"0"+n:n;
};
if(typeof Date.prototype.toJSON!=="function"){
Date.prototype.toJSON=function(key){
return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z";
};
String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){
return this.valueOf();
};
}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_130=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,_131,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _132(_133){
_130.lastIndex=0;
return _130.test(_133)?"\""+_133.replace(_130,function(a){
var c=meta[a];
return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
})+"\"":"\""+_133+"\"";
};
function str(key,_134){
var i,k,v,_135,mind=gap,_136,_137=_134[key];
if(_137&&typeof _137==="object"&&typeof _137.toJSON==="function"){
_137=_137.toJSON(key);
}
if(typeof rep==="function"){
_137=rep.call(_134,key,_137);
}
switch(typeof _137){
case "string":
return _132(_137);
case "number":
return isFinite(_137)?String(_137):"null";
case "boolean":
case "null":
return String(_137);
case "object":
if(!_137){
return "null";
}
gap+=_131;
_136=[];
if(Object.prototype.toString.apply(_137)==="[object Array]"){
_135=_137.length;
for(i=0;i<_135;i+=1){
_136[i]=str(i,_137)||"null";
}
v=_136.length===0?"[]":gap?"[\n"+gap+_136.join(",\n"+gap)+"\n"+mind+"]":"["+_136.join(",")+"]";
gap=mind;
return v;
}
if(rep&&typeof rep==="object"){
_135=rep.length;
for(i=0;i<_135;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_137);
if(v){
_136.push(_132(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _137){
if(Object.hasOwnProperty.call(_137,k)){
v=str(k,_137);
if(v){
_136.push(_132(k)+(gap?": ":":")+v);
}
}
}
}
v=_136.length===0?"{}":gap?"{\n"+gap+_136.join(",\n"+gap)+"\n"+mind+"}":"{"+_136.join(",")+"}";
gap=mind;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_138,_139,_13a){
var i;
gap="";
_131="";
if(typeof _13a==="number"){
for(i=0;i<_13a;i+=1){
_131+=" ";
}
}else{
if(typeof _13a==="string"){
_131=_13a;
}
}
rep=_139;
if(_139&&typeof _139!=="function"&&(typeof _139!=="object"||typeof _139.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_138});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(text,_13b){
var j;
function walk(_13c,key){
var k,v,_13d=_13c[key];
if(_13d&&typeof _13d==="object"){
for(k in _13d){
if(Object.hasOwnProperty.call(_13d,k)){
v=walk(_13d,k);
if(v!==undefined){
_13d[k]=v;
}else{
delete _13d[k];
}
}
}
}
return _13b.call(_13c,key,_13d);
};
cx.lastIndex=0;
if(cx.test(text)){
text=text.replace(cx,function(a){
return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+text+")");
return typeof _13b==="function"?walk({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
})();
OpenAjax.gadgets.util=function(){
function _13e(url){
var _13f;
var _140=url.indexOf("?");
var _141=url.indexOf("#");
if(_141===-1){
_13f=url.substr(_140+1);
}else{
_13f=[url.substr(_140+1,_141-_140-1),"&",url.substr(_141+1)].join("");
}
return _13f.split("&");
};
var _142=null;
var _143=[];
return {getUrlParameters:function(_144){
if(_142!==null&&typeof _144==="undefined"){
return _142;
}
var _145={};
var _146=_13e(_144||document.location.href);
var _147=window.decodeURIComponent?decodeURIComponent:unescape;
for(var i=0,j=_146.length;i<j;++i){
var pos=_146[i].indexOf("=");
if(pos===-1){
continue;
}
var _148=_146[i].substring(0,pos);
var _149=_146[i].substring(pos+1);
_149=_149.replace(/\+/g," ");
_145[_148]=_147(_149);
}
if(typeof _144==="undefined"){
_142=_145;
}
return _145;
},registerOnLoadHandler:function(_14a){
_143.push(_14a);
},runOnLoadHandlers:function(){
for(var i=0,j=_143.length;i<j;++i){
_143[i]();
}
},"attachBrowserEvent":function(elem,_14b,_14c,_14d){
if(elem.addEventListener){
elem.addEventListener(_14b,_14c,_14d);
}else{
if(elem.attachEvent){
elem.attachEvent("on"+_14b,_14c);
}
}
},"removeBrowserEvent":function(elem,_14e,_14f,_150){
if(elem.removeEventListener){
elem.removeEventListener(_14e,_14f,_150);
}else{
if(elem.detachEvent){
elem.detachEvent("on"+_14e,_14f);
}
}
}};
}();
OpenAjax.gadgets.util.getUrlParameters();
OpenAjax.gadgets.json=OpenAjax.gadgets.json||{};
if(!OpenAjax.gadgets.json.stringify){
OpenAjax.gadgets.json={parse:function(str){
try{
return window.JSON.parse(str);
}
catch(e){
return false;
}
},stringify:function(obj){
try{
return window.JSON.stringify(obj);
}
catch(e){
return null;
}
}};
}
OpenAjax.gadgets.log=function(_151){
OpenAjax.gadgets.log.logAtLevel(OpenAjax.gadgets.log.INFO,_151);
};
OpenAjax.gadgets.warn=function(_152){
OpenAjax.gadgets.log.logAtLevel(OpenAjax.gadgets.log.WARNING,_152);
};
OpenAjax.gadgets.error=function(_153){
OpenAjax.gadgets.log.logAtLevel(OpenAjax.gadgets.log.ERROR,_153);
};
OpenAjax.gadgets.setLogLevel=function(_154){
OpenAjax.gadgets.log.logLevelThreshold_=_154;
};
OpenAjax.gadgets.log.logAtLevel=function(_155,_156){
if(_155<OpenAjax.gadgets.log.logLevelThreshold_||!OpenAjax.gadgets.log._console){
return;
}
var _157;
var _158=OpenAjax.gadgets.log._console;
if(_155==OpenAjax.gadgets.log.WARNING&&_158.warn){
_158.warn(_156);
}else{
if(_155==OpenAjax.gadgets.log.ERROR&&_158.error){
_158.error(_156);
}else{
if(_158.log){
_158.log(_156);
}
}
}
};
OpenAjax.gadgets.log.INFO=1;
OpenAjax.gadgets.log.WARNING=2;
OpenAjax.gadgets.log.ERROR=3;
OpenAjax.gadgets.log.NONE=4;
OpenAjax.gadgets.log.logLevelThreshold_=OpenAjax.gadgets.log.INFO;
OpenAjax.gadgets.log._console=window.console?window.console:window.opera?window.opera.postError:undefined;
(function(){
if(!window.__isgadget){
var _159=false;
function _15a(){
if(!_159){
_159=true;
OpenAjax.gadgets.util.runOnLoadHandlers();
OpenAjax.gadgets.util.registerOnLoadHandler=function(_15b){
setTimeout(_15b,0);
};
if(window.detachEvent){
window.detachEvent("onload",_15a);
}
}
};
if(window.addEventListener){
document.addEventListener("DOMContentLoaded",_15a,false);
window.addEventListener("load",_15a,false);
}else{
if(window.attachEvent){
window.attachEvent("onload",_15a);
}
}
}
})();
OpenAjax.gadgets.rpctx=OpenAjax.gadgets.rpctx||{};
if(!OpenAjax.gadgets.rpctx.frameElement){
OpenAjax.gadgets.rpctx.frameElement=function(){
var _15c="__g2c_rpc";
var _15d="__c2g_rpc";
var _15e;
var _15f;
function _160(_161,from,rpc){
try{
if(from!==".."){
var fe=window.frameElement;
if(typeof fe[_15c]==="function"){
if(typeof fe[_15c][_15d]!=="function"){
fe[_15c][_15d]=function(args){
_15e(OpenAjax.gadgets.json.parse(args));
};
}
fe[_15c](OpenAjax.gadgets.json.stringify(rpc));
return;
}
}else{
var _162=document.getElementById(_161);
if(typeof _162[_15c]==="function"&&typeof _162[_15c][_15d]==="function"){
_162[_15c][_15d](OpenAjax.gadgets.json.stringify(rpc));
return;
}
}
}
catch(e){
}
return true;
};
return {getCode:function(){
return "fe";
},isParentVerifiable:function(){
return false;
},init:function(_163,_164){
_15e=_163;
_15f=_164;
return true;
},setup:function(_165,_166){
if(_165!==".."){
try{
var _167=document.getElementById(_165);
_167[_15c]=function(args){
_15e(OpenAjax.gadgets.json.parse(args));
};
}
catch(e){
return false;
}
}
if(_165===".."){
_15f("..",true);
var _168=function(){
window.setTimeout(function(){
OpenAjax.gadgets.rpc.call(_165,OpenAjax.gadgets.rpc.ACK);
},500);
};
OpenAjax.gadgets.util.registerOnLoadHandler(_168);
}
return true;
},call:function(_169,from,rpc){
_160(_169,from,rpc);
}};
}();
}
OpenAjax.gadgets.rpctx=OpenAjax.gadgets.rpctx||{};
if(!OpenAjax.gadgets.rpctx.ifpc){
OpenAjax.gadgets.rpctx.ifpc=function(){
var _16a=[];
var _16b=0;
var _16c;
function _16d(args){
var _16e=[];
for(var i=0,j=args.length;i<j;++i){
_16e.push(encodeURIComponent(OpenAjax.gadgets.json.stringify(args[i])));
}
return _16e.join("&");
};
function _16f(src){
var _170;
for(var i=_16a.length-1;i>=0;--i){
var ifr=_16a[i];
try{
if(ifr&&(ifr.recyclable||ifr.readyState==="complete")){
ifr.parentNode.removeChild(ifr);
if(window.ActiveXObject){
_16a[i]=ifr=null;
_16a.splice(i,1);
}else{
ifr.recyclable=false;
_170=ifr;
break;
}
}
}
catch(e){
}
}
if(!_170){
_170=document.createElement("iframe");
_170.style.border=_170.style.width=_170.style.height="0px";
_170.style.visibility="hidden";
_170.style.position="absolute";
_170.onload=function(){
this.recyclable=true;
};
_16a.push(_170);
}
_170.src=src;
window.setTimeout(function(){
document.body.appendChild(_170);
},0);
};
return {getCode:function(){
return "ifpc";
},isParentVerifiable:function(){
return true;
},init:function(_171,_172){
_16c=_172;
_16c("..",true);
return true;
},setup:function(_173,_174){
_16c(_173,true);
return true;
},call:function(_175,from,rpc){
var _176=OpenAjax.gadgets.rpc.getRelayUrl(_175);
++_16b;
if(!_176){
OpenAjax.gadgets.warn("No relay file assigned for IFPC");
return;
}
var src=null;
if(rpc.l){
var _177=rpc.a;
src=[_176,"#",_16d([from,_16b,1,0,_16d([from,rpc.s,"","",from].concat(_177))])].join("");
}else{
src=[_176,"#",_175,"&",from,"@",_16b,"&1&0&",encodeURIComponent(OpenAjax.gadgets.json.stringify(rpc))].join("");
}
_16f(src);
return true;
}};
}();
}
OpenAjax.gadgets.rpctx=OpenAjax.gadgets.rpctx||{};
if(!OpenAjax.gadgets.rpctx.rmr){
OpenAjax.gadgets.rpctx.rmr=function(){
var _178=500;
var _179=10;
var _17a={};
var _17b;
var _17c;
function _17d(_17e,_17f,data,_180){
var _181=function(){
document.body.appendChild(_17e);
_17e.src="about:blank";
if(_180){
_17e.onload=function(){
_196(_180);
};
}
_17e.src=_17f+"#"+data;
};
if(document.body){
_181();
}else{
OpenAjax.gadgets.util.registerOnLoadHandler(function(){
_181();
});
}
};
function _182(_183){
if(typeof _17a[_183]==="object"){
return;
}
var _184=document.createElement("iframe");
var _185=_184.style;
_185.position="absolute";
_185.top="0px";
_185.border="0";
_185.opacity="0";
_185.width="10px";
_185.height="1px";
_184.id="rmrtransport-"+_183;
_184.name=_184.id;
var _186=OpenAjax.gadgets.rpc.getRelayUrl(_183);
if(!_186){
_186=OpenAjax.gadgets.rpc.getOrigin(OpenAjax.gadgets.util.getUrlParameters()["parent"])+"/robots.txt";
}
_17a[_183]={frame:_184,receiveWindow:null,relayUri:_186,searchCounter:0,width:10,waiting:true,queue:[],sendId:0,recvId:0};
if(_183!==".."){
_17d(_184,_186,_187(_183));
}
_188(_183);
};
function _188(_189){
var _18a=null;
_17a[_189].searchCounter++;
try{
var _18b=OpenAjax.gadgets.rpc._getTargetWin(_189);
if(_189===".."){
_18a=_18b.frames["rmrtransport-"+OpenAjax.gadgets.rpc.RPC_ID];
}else{
_18a=_18b.frames["rmrtransport-.."];
}
}
catch(e){
}
var _18c=false;
if(_18a){
_18c=_18d(_189,_18a);
}
if(!_18c){
if(_17a[_189].searchCounter>_179){
return;
}
window.setTimeout(function(){
_188(_189);
},_178);
}
};
function _18e(_18f,_190,from,rpc){
var _191=null;
if(from!==".."){
_191=_17a[".."];
}else{
_191=_17a[_18f];
}
if(_191){
if(_190!==OpenAjax.gadgets.rpc.ACK){
_191.queue.push(rpc);
}
if(_191.waiting||(_191.queue.length===0&&!(_190===OpenAjax.gadgets.rpc.ACK&&rpc&&rpc.ackAlone===true))){
return true;
}
if(_191.queue.length>0){
_191.waiting=true;
}
var url=_191.relayUri+"#"+_187(_18f);
try{
_191.frame.contentWindow.location=url;
var _192=_191.width==10?20:10;
_191.frame.style.width=_192+"px";
_191.width=_192;
}
catch(e){
return false;
}
}
return true;
};
function _187(_193){
var _194=_17a[_193];
var _195={id:_194.sendId};
if(_194){
_195.d=Array.prototype.slice.call(_194.queue,0);
_195.d.push({s:OpenAjax.gadgets.rpc.ACK,id:_194.recvId});
}
return OpenAjax.gadgets.json.stringify(_195);
};
function _196(_197){
var _198=_17a[_197];
var data=_198.receiveWindow.location.hash.substring(1);
var _199=OpenAjax.gadgets.json.parse(decodeURIComponent(data))||{};
var _19a=_199.d||[];
var _19b=false;
var _19c=false;
var _19d=0;
var _19e=(_198.recvId-_199.id);
for(var i=0;i<_19a.length;++i){
var rpc=_19a[i];
if(rpc.s===OpenAjax.gadgets.rpc.ACK){
_17c(_197,true);
if(_198.waiting){
_19c=true;
}
_198.waiting=false;
var _19f=Math.max(0,rpc.id-_198.sendId);
_198.queue.splice(0,_19f);
_198.sendId=Math.max(_198.sendId,rpc.id||0);
continue;
}
_19b=true;
if(++_19d<=_19e){
continue;
}
++_198.recvId;
_17b(rpc);
}
if(_19b||(_19c&&_198.queue.length>0)){
var from=(_197==="..")?OpenAjax.gadgets.rpc.RPC_ID:"..";
_18e(_197,OpenAjax.gadgets.rpc.ACK,from,{ackAlone:_19b});
}
};
function _18d(_1a0,_1a1){
var _1a2=_17a[_1a0];
try{
var _1a3=false;
_1a3="document" in _1a1;
if(!_1a3){
return false;
}
_1a3=typeof _1a1["document"]=="object";
if(!_1a3){
return false;
}
var loc=_1a1.location.href;
if(loc==="about:blank"){
return false;
}
}
catch(ex){
return false;
}
_1a2.receiveWindow=_1a1;
function _1a4(){
_196(_1a0);
};
if(typeof _1a1.attachEvent==="undefined"){
_1a1.onresize=_1a4;
}else{
_1a1.attachEvent("onresize",_1a4);
}
if(_1a0===".."){
_17d(_1a2.frame,_1a2.relayUri,_187(_1a0),_1a0);
}else{
_196(_1a0);
}
return true;
};
return {getCode:function(){
return "rmr";
},isParentVerifiable:function(){
return true;
},init:function(_1a5,_1a6){
_17b=_1a5;
_17c=_1a6;
return true;
},setup:function(_1a7,_1a8){
try{
_182(_1a7);
}
catch(e){
OpenAjax.gadgets.warn("Caught exception setting up RMR: "+e);
return false;
}
return true;
},call:function(_1a9,from,rpc){
return _18e(_1a9,rpc.s,from,rpc);
}};
}();
}
OpenAjax.gadgets.rpctx=OpenAjax.gadgets.rpctx||{};
if(!OpenAjax.gadgets.rpctx.wpm){
OpenAjax.gadgets.rpctx.wpm=function(){
var _1aa,_1ab;
var _1ac;
var _1ad=false;
var _1ae=false;
function _1af(){
var hit=false;
function _1b0(_1b1){
if(_1b1.data=="postmessage.test"){
hit=true;
if(typeof _1b1.origin==="undefined"){
_1ae=true;
}
}
};
OpenAjax.gadgets.util.attachBrowserEvent(window,"message",_1b0,false);
window.postMessage("postmessage.test","*");
if(hit){
_1ad=true;
}
OpenAjax.gadgets.util.removeBrowserEvent(window,"message",_1b0,false);
};
function _1b2(_1b3){
var rpc=OpenAjax.gadgets.json.parse(_1b3.data);
if(!rpc||!rpc.f){
return;
}
var _1b4=OpenAjax.gadgets.rpc.getRelayUrl(rpc.f)||OpenAjax.gadgets.util.getUrlParameters()["parent"];
var _1b5=OpenAjax.gadgets.rpc.getOrigin(_1b4);
if(!_1ae?_1b3.origin!==_1b5:_1b3.domain!==/^.+:\/\/([^:]+).*/.exec(_1b5)[1]){
return;
}
_1aa(rpc);
};
return {getCode:function(){
return "wpm";
},isParentVerifiable:function(){
return true;
},init:function(_1b6,_1b7){
_1aa=_1b6;
_1ab=_1b7;
_1af();
if(!_1ad){
_1ac=function(win,msg,_1b8){
win.postMessage(msg,_1b8);
};
}else{
_1ac=function(win,msg,_1b9){
window.setTimeout(function(){
win.postMessage(msg,_1b9);
},0);
};
}
OpenAjax.gadgets.util.attachBrowserEvent(window,"message",_1b2,false);
_1ab("..",true);
return true;
},setup:function(_1ba,_1bb,_1bc){
if(_1ba===".."){
if(_1bc){
OpenAjax.gadgets.rpc._createRelayIframe(_1bb);
}else{
OpenAjax.gadgets.rpc.call(_1ba,OpenAjax.gadgets.rpc.ACK);
}
}
return true;
},call:function(_1bd,from,rpc){
var _1be=OpenAjax.gadgets.rpc._getTargetWin(_1bd);
var _1bf=OpenAjax.gadgets.rpc.getRelayUrl(_1bd)||OpenAjax.gadgets.util.getUrlParameters()["parent"];
var _1c0=OpenAjax.gadgets.rpc.getOrigin(_1bf);
if(_1c0){
_1ac(_1be,OpenAjax.gadgets.json.stringify(rpc),_1c0);
}else{
OpenAjax.gadgets.error("No relay set (used as window.postMessage targetOrigin)"+", cannot send cross-domain message");
}
return true;
},relayOnload:function(_1c1,data){
_1ab(_1c1,true);
}};
}();
}
if(!OpenAjax.gadgets.rpc){
OpenAjax.gadgets.rpc=function(){
var _1c2="__cb";
var _1c3="";
var ACK="__ack";
var _1c4=500;
var _1c5=10;
var _1c6={};
var _1c7={};
var _1c8={};
var _1c9={};
var _1ca=0;
var _1cb={};
var _1cc={};
var _1cd={};
var _1ce={};
var _1cf={};
var _1d0={};
var _1d1=(window.top!==window.self);
var _1d2=window.name;
var _1d3=function(){
};
var _1d4=0;
var _1d5=1;
var _1d6=2;
var _1d7=(function(){
function _1d8(name){
return function(){
OpenAjax.gadgets.log("gadgets.rpc."+name+"("+OpenAjax.gadgets.json.stringify(Array.prototype.slice.call(arguments))+"): call ignored. [caller: "+document.location+", isChild: "+_1d1+"]");
};
};
return {getCode:function(){
return "noop";
},isParentVerifiable:function(){
return true;
},init:_1d8("init"),setup:_1d8("setup"),call:_1d8("call")};
})();
if(OpenAjax.gadgets.util){
_1ce=OpenAjax.gadgets.util.getUrlParameters();
}
function _1d9(){
return typeof window.postMessage==="function"?OpenAjax.gadgets.rpctx.wpm:typeof window.postMessage==="object"?OpenAjax.gadgets.rpctx.wpm:navigator.userAgent.indexOf("WebKit")>0?OpenAjax.gadgets.rpctx.rmr:navigator.product==="Gecko"?OpenAjax.gadgets.rpctx.frameElement:OpenAjax.gadgets.rpctx.ifpc;
};
function _1da(_1db,_1dc){
var tx=_1dd;
if(!_1dc){
tx=_1d7;
}
_1cf[_1db]=tx;
var _1de=_1d0[_1db]||[];
for(var i=0;i<_1de.length;++i){
var rpc=_1de[i];
rpc.t=_1df(_1db);
tx.call(_1db,rpc.f,rpc);
}
_1d0[_1db]=[];
};
var _1e0=false,_1e1=false;
function _1e2(){
if(_1e1){
return;
}
function _1e3(){
_1e0=true;
};
OpenAjax.gadgets.util.attachBrowserEvent(window,"unload",_1e3,false);
_1e1=true;
};
function _1e4(_1e5,_1e6,_1e7,data,_1e8){
if(!_1c9[_1e6]||_1c9[_1e6]!==_1e7){
OpenAjax.gadgets.error("Invalid auth token. "+_1c9[_1e6]+" vs "+_1e7);
_1d3(_1e6,_1d6);
}
_1e8.onunload=function(){
if(_1cc[_1e6]&&!_1e0){
_1d3(_1e6,_1d5);
OpenAjax.gadgets.rpc.removeReceiver(_1e6);
}
};
_1e2();
data=OpenAjax.gadgets.json.parse(decodeURIComponent(data));
_1dd.relayOnload(_1e6,data);
};
function _1e9(rpc){
if(rpc&&typeof rpc.s==="string"&&typeof rpc.f==="string"&&rpc.a instanceof Array){
if(_1c9[rpc.f]){
if(_1c9[rpc.f]!==rpc.t){
OpenAjax.gadgets.error("Invalid auth token. "+_1c9[rpc.f]+" vs "+rpc.t);
_1d3(rpc.f,_1d6);
}
}
if(rpc.s===ACK){
window.setTimeout(function(){
_1da(rpc.f,true);
},0);
return;
}
if(rpc.c){
rpc.callback=function(_1ea){
OpenAjax.gadgets.rpc.call(rpc.f,_1c2,null,rpc.c,_1ea);
};
}
var _1eb=(_1c6[rpc.s]||_1c6[_1c3]).apply(rpc,rpc.a);
if(rpc.c&&typeof _1eb!=="undefined"){
OpenAjax.gadgets.rpc.call(rpc.f,_1c2,null,rpc.c,_1eb);
}
}
};
function _1ec(url){
if(!url){
return "";
}
url=url.toLowerCase();
if(url.indexOf("//")==0){
url=window.location.protocol+url;
}
if(url.indexOf("://")==-1){
url=window.location.protocol+"//"+url;
}
var host=url.substring(url.indexOf("://")+3);
var _1ed=host.indexOf("/");
if(_1ed!=-1){
host=host.substring(0,_1ed);
}
var _1ee=url.substring(0,url.indexOf("://"));
var _1ef="";
var _1f0=host.indexOf(":");
if(_1f0!=-1){
var port=host.substring(_1f0+1);
host=host.substring(0,_1f0);
if((_1ee==="http"&&port!=="80")||(_1ee==="https"&&port!=="443")){
_1ef=":"+port;
}
}
return _1ee+"://"+host+_1ef;
};
function _1f1(id){
if(typeof id==="undefined"||id===".."){
return window.parent;
}
id=String(id);
var _1f2=window.frames[id];
if(_1f2){
return _1f2;
}
_1f2=document.getElementById(id);
if(_1f2&&_1f2.contentWindow){
return _1f2.contentWindow;
}
return null;
};
var _1dd=_1d9();
_1c6[_1c3]=function(){
OpenAjax.gadgets.warn("Unknown RPC service: "+this.s);
};
_1c6[_1c2]=function(_1f3,_1f4){
var _1f5=_1cb[_1f3];
if(_1f5){
delete _1cb[_1f3];
_1f5(_1f4);
}
};
function _1f6(_1f7,_1f8,_1f9){
if(_1cc[_1f7]===true){
return;
}
if(typeof _1cc[_1f7]==="undefined"){
_1cc[_1f7]=0;
}
var _1fa=document.getElementById(_1f7);
if(_1f7===".."||_1fa!=null){
if(_1dd.setup(_1f7,_1f8,_1f9)===true){
_1cc[_1f7]=true;
return;
}
}
if(_1cc[_1f7]!==true&&_1cc[_1f7]++<_1c5){
window.setTimeout(function(){
_1f6(_1f7,_1f8,_1f9);
},_1c4);
}else{
_1cf[_1f7]=_1d7;
_1cc[_1f7]=true;
}
};
function _1fb(_1fc,rpc){
if(typeof _1cd[_1fc]==="undefined"){
_1cd[_1fc]=false;
var _1fd=OpenAjax.gadgets.rpc.getRelayUrl(_1fc);
if(_1ec(_1fd)!==_1ec(window.location.href)){
return false;
}
var _1fe=_1f1(_1fc);
try{
_1cd[_1fc]=_1fe.OpenAjax.gadgets.rpc.receiveSameDomain;
}
catch(e){
OpenAjax.gadgets.error("Same domain call failed: parent= incorrectly set.");
}
}
if(typeof _1cd[_1fc]==="function"){
_1cd[_1fc](rpc);
return true;
}
return false;
};
function _1ff(_200,url,_201){
if(!/http(s)?:\/\/.+/.test(url)){
if(url.indexOf("//")==0){
url=window.location.protocol+url;
}else{
if(url.charAt(0)=="/"){
url=window.location.protocol+"//"+window.location.host+url;
}else{
if(url.indexOf("://")==-1){
url=window.location.protocol+"//"+url;
}
}
}
}
_1c7[_200]=url;
_1c8[_200]=!!_201;
};
function _1df(_202){
return _1c9[_202];
};
function _203(_204,_205,_206){
_205=_205||"";
_1c9[_204]=String(_205);
_1f6(_204,_205,_206);
};
function _207(_208,_209){
function init(_20a){
var _20b=_20a?_20a.rpc:{};
var _20c=_20b.parentRelayUrl;
if(_20c.substring(0,7)!=="http://"&&_20c.substring(0,8)!=="https://"&&_20c.substring(0,2)!=="//"){
if(typeof _1ce.parent==="string"&&_1ce.parent!==""){
if(_20c.substring(0,1)!=="/"){
var _20d=_1ce.parent.lastIndexOf("/");
_20c=_1ce.parent.substring(0,_20d+1)+_20c;
}else{
_20c=_1ec(_1ce.parent)+_20c;
}
}
}
var _20e=!!_20b.useLegacyProtocol;
_1ff("..",_20c,_20e);
if(_20e){
_1dd=OpenAjax.gadgets.rpctx.ifpc;
_1dd.init(_1e9,_1da);
}
var _20f=_209||_1ce.forcesecure||false;
_203("..",_208,_20f);
};
var _210={parentRelayUrl:OpenAjax.gadgets.config.NonEmptyStringValidator};
OpenAjax.gadgets.config.register("rpc",_210,init);
};
function _211(_212,_213,_214){
var _215=_214||_1ce.forcesecure||false;
var _216=_213||_1ce.parent;
if(_216){
_1ff("..",_216);
_203("..",_212,_215);
}
};
function _217(_218,_219,_21a,_21b){
if(!OpenAjax.gadgets.util){
return;
}
var _21c=document.getElementById(_218);
if(!_21c){
throw new Error("Cannot set up gadgets.rpc receiver with ID: "+_218+", element not found.");
}
var _21d=_219||_21c.src;
_1ff(_218,_21d);
var _21e=OpenAjax.gadgets.util.getUrlParameters(_21c.src);
var _21f=_21a||_21e.rpctoken;
var _220=_21b||_21e.forcesecure;
_203(_218,_21f,_220);
};
function _221(_222,_223,_224,_225){
if(_222===".."){
var _226=_224||_1ce.rpctoken||_1ce.ifpctok||"";
if(window["__isgadget"]===true){
_207(_226,_225);
}else{
_211(_226,_223,_225);
}
}else{
_217(_222,_223,_224,_225);
}
};
return {config:function(_227){
if(typeof _227.securityCallback==="function"){
_1d3=_227.securityCallback;
}
},register:function(_228,_229){
if(_228===_1c2||_228===ACK){
throw new Error("Cannot overwrite callback/ack service");
}
if(_228===_1c3){
throw new Error("Cannot overwrite default service:"+" use registerDefault");
}
_1c6[_228]=_229;
},unregister:function(_22a){
if(_22a===_1c2||_22a===ACK){
throw new Error("Cannot delete callback/ack service");
}
if(_22a===_1c3){
throw new Error("Cannot delete default service:"+" use unregisterDefault");
}
delete _1c6[_22a];
},registerDefault:function(_22b){
_1c6[_1c3]=_22b;
},unregisterDefault:function(){
delete _1c6[_1c3];
},forceParentVerifiable:function(){
if(!_1dd.isParentVerifiable()){
_1dd=OpenAjax.gadgets.rpctx.ifpc;
}
},call:function(_22c,_22d,_22e,_22f){
_22c=_22c||"..";
var from="..";
if(_22c===".."){
from=_1d2;
}
++_1ca;
if(_22e){
_1cb[_1ca]=_22e;
}
var rpc={s:_22d,f:from,c:_22e?_1ca:0,a:Array.prototype.slice.call(arguments,3),t:_1c9[_22c],l:_1c8[_22c]};
if(_22c!==".."&&!document.getElementById(_22c)){
OpenAjax.gadgets.log("WARNING: attempted send to nonexistent frame: "+_22c);
return;
}
if(_1fb(_22c,rpc)){
return;
}
var _230=_1cf[_22c];
if(!_230){
if(!_1d0[_22c]){
_1d0[_22c]=[rpc];
}else{
_1d0[_22c].push(rpc);
}
return;
}
if(_1c8[_22c]){
_230=OpenAjax.gadgets.rpctx.ifpc;
}
if(_230.call(_22c,from,rpc)===false){
_1cf[_22c]=_1d7;
_1dd.call(_22c,from,rpc);
}
},getRelayUrl:function(_231){
var url=_1c7[_231];
if(url&&url.substring(0,1)==="/"){
if(url.substring(1,2)==="/"){
url=document.location.protocol+url;
}else{
url=document.location.protocol+"//"+document.location.host+url;
}
}
return url;
},setRelayUrl:_1ff,setAuthToken:_203,setupReceiver:_221,getAuthToken:_1df,removeReceiver:function(_232){
delete _1c7[_232];
delete _1c8[_232];
delete _1c9[_232];
delete _1cc[_232];
delete _1cd[_232];
delete _1cf[_232];
},getRelayChannel:function(){
return _1dd.getCode();
},receive:function(_233,_234){
if(_233.length>4){
_1e9(OpenAjax.gadgets.json.parse(decodeURIComponent(_233[_233.length-1])));
}else{
_1e4.apply(null,_233.concat(_234));
}
},receiveSameDomain:function(rpc){
rpc.a=Array.prototype.slice.call(rpc.a);
window.setTimeout(function(){
_1e9(rpc);
},0);
},getOrigin:_1ec,getReceiverOrigin:function(_235){
var _236=_1cf[_235];
if(!_236){
return null;
}
if(!_236.isParentVerifiable(_235)){
return null;
}
var _237=OpenAjax.gadgets.rpc.getRelayUrl(_235)||OpenAjax.gadgets.util.getUrlParameters().parent;
return OpenAjax.gadgets.rpc.getOrigin(_237);
},init:function(){
if(_1dd.init(_1e9,_1da)===false){
_1dd=_1d7;
}
if(_1d1){
_221("..");
}
},_getTargetWin:_1f1,_createRelayIframe:function(_238,data){
var _239=OpenAjax.gadgets.rpc.getRelayUrl("..");
if(!_239){
return;
}
var src=_239+"#..&"+_1d2+"&"+_238+"&"+encodeURIComponent(OpenAjax.gadgets.json.stringify(data));
var _23a=document.createElement("iframe");
_23a.style.border=_23a.style.width=_23a.style.height="0px";
_23a.style.visibility="hidden";
_23a.style.position="absolute";
function _23b(){
document.body.appendChild(_23a);
_23a.src="javascript:\"<html></html>\"";
_23a.src=src;
};
if(document.body){
_23b();
}else{
OpenAjax.gadgets.util.registerOnLoadHandler(function(){
_23b();
});
}
return _23a;
},ACK:ACK,RPC_ID:_1d2,SEC_ERROR_LOAD_TIMEOUT:_1d4,SEC_ERROR_FRAME_PHISH:_1d5,SEC_ERROR_FORGED_MSG:_1d6};
}();
OpenAjax.gadgets.rpc.init();
}

