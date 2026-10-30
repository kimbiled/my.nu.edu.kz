/* (C) Copyright IBM Corp. 2007  All Rights Reserved.                */
/**
 * This is the JS file for the common semantic tagging service
 */


 












 






 



 
var SemTagSvcPortalGlobal = {
	debug: false,
	trace: false,
	lang: "en",
	bidi: "ltr",
	service: "",
	ifConnUrlExists: "false",
	connUrl: "null",
	isconnServerNew:false,
    contextUrl: "/wps_semanticTag",
	wpsBaseURL: "/wps",
	ptTimeout: 1500,
	preferredImIds: ["X-imn","email","uid","fn"],
	externalServiceEntries:"",
	// for c2a
	c2a_click_for_actions:"Click for Actions",
	// for semtagmenu
	"hover_label_menu": "Click for options",
	"a11y_hover": "more information",
	"a11y_photo": "photo",
	"a11y_close": "close",
	"ally_expandImage" : "Click to hide information",
	"ally_collapsedImage" : "Click to display more information",
	"ally_showMore" : "Show More",
	"ally_showLess" : "Show Less",
	"ally_buisnessCardLabel" : "Business Card",
	"ally_moreAction": "More Actions",
	// For Person card
    "start_chat": "Chat",
    "add_to_contact": "Add as Sametime Contact",
    "send_email": "Send Mail",
    "view_person": "Profile",
    "hover_label_person": "Click for Person Card",
    "work_location": "person.adr.locality+', '+person.adr.region+' '+person.adr.countryname",
    "specify_email_if_connection": "When Portal is integrated with Connections, Connection Business Card appears only if email is specified",
	// this is for buffering html for atttributes for businesscard
	expandedItems : "ibm-primaryEmail,street,stateOrProvinceName,postalCode,countryName",
	collapsedItems : "ibm-jobTitle,telephoneNumber",
	showDetailsFlag : true,
	isDynamicLoading : false,
	isC2AHandlerRequired : true,
	isPersonCardHandlerRequired : true,
	isActionHandlerRequired : true,
	newSametimeCommunityServer:true,	
	getPersonResolverUrl: function(){
		return "?uri=personrecord%3ATOBEREPLACED";
	}
	
};

SemTagSvcPortalGlobal.service={"entries":[{"id":"com.ibm.portal.action","test":"(globalTestNode.className.match(SemTagSvcPortal.actionRE))","js":"","classnames":[".com\\.ibm\\.portal\\.action"]},{"id":"hcard","test":"(globalTestNode.className.match(SemTagSvcPortal.hcardRE))","js":"/javascript/semanticTagPerson.js","classnames":[".vcard"]},{"id":"sametime","test":"id:hcard","js":"/javascript/semanticTagAwareness.js","classnames":[]},{"id":"c2a","test":"(globalTestNode.className.match(/(^|\\s)c2a:(source|target)(\\s|$)/)) ","js":"/javascript/semanticTagC2A.js","classnames":[".c2a\\:source",".c2a\\:target"]}]};
var externalEntries=new Array();
try{
externalEntries=eval(SemTagSvcPortalGlobal.externalServiceEntries);
if(SemTagSvcPortalGlobal.debug){
console.log("SemTagSvcPortalGlobal.service.entries is:"+SemTagSvcPortalGlobal.service.entries+": before merge"+":"+externalEntries+":"+SemTagSvcPortalGlobal.externalServiceEntries+":");
}
SemTagSvcPortalGlobal.service.entries.concat(externalEntries);
if(SemTagSvcPortalGlobal.debug){
console.log("SemTagSvcPortalGlobal.service.entries is:"+SemTagSvcPortalGlobal.service.entries+": after merge");
}
}
catch(e){
if(SemTagSvcPortalGlobal.debug){
console.error("Error occured doing eval on:"+SemTagSvcPortalGlobal.externalServiceEntries);
}
}


var SemTagSvcPortal={debug:SemTagSvcPortalGlobal.debug,trace:SemTagSvcPortalGlobal.trace,version:"1.0",lang:SemTagSvcPortalGlobal.lang,bidi:SemTagSvcPortalGlobal.bidi,tagScope:["*"],service:SemTagSvcPortalGlobal.service,scripts:new Array(),actionRegistry:null,refcntAttr:"semtag_refcnt",hoverIdPrefix:"semtag_hover_",hoverIdx:0,liveElemPrefix:"semtag_live_",reMap:new Array(),actionRE:new RegExp("(^|\\s)com.ibm.portal.action(\\s|$)"),hcardRE:new RegExp("(^|\\s)vcard(\\s|$)"),specialMenuProviders:new Array(),parseElem:null,availAttribStr:"",ifConnUrlExists:SemTagSvcPortalGlobal.ifConnUrlExists,connUrl:SemTagSvcPortalGlobal.connUrl,isconnServerNew:SemTagSvcPortalGlobal.isconnServerNew,sametimeSTProxy:(typeof (stproxy)!=="undefined"),sametimeSTLinks:((typeof (stproxy)==="undefined")&&(typeof (prepareSametimeLink)!=="undefined")),sametimeNotIntegrated:((typeof (stproxy)==="undefined")&&(typeof (prepareSametimeLink)==="undefined")),DELAY:10,init:function(_1){
var _2=SemTagSvcPortal.DELAY;
if(SemTagSvcPortal.debug){
console.log("inside init of SemtagSvc:");
}
if(((window.ibmCfg==null||window.ibmCfg==="undefined")||(window.ibmCfg.enablerConfig==null||window.ibmCfg.enablerConfig==="undefined"))||(com.ibm.mashups==null||com.ibm.mashups==="undefined")){
if(SemTagSvcPortal.debug){
console.log("inside init of SemtagSvc for non csa2.theme");
}
SemTagSvcPortal.parseElem=SemTagSvcPortal.getElementFromEvent(_1);
window.setTimeout(SemTagSvcPortal.parseDom,SemTagSvcPortal.DELAY);
}else{
if(SemTagSvcPortal.debug){
console.log("inside init of SemtagSvc for csa2.theme");
}
var _3=SemTagSvcPortal.service.entries;
if(SemTagSvcPortal.debug){
console.log("In case of csa2.theme"+(_3?_3.length:0));
}
if(SemTagSvcPortalGlobal.isDynamicLoading){
for(var k=0;k<_3.length;k++){
var _4=_3[k];
if(SemTagSvcPortal.debug){
console.log("Calling SemTagSvcPortal.loadScript for:"+_4.js+":"+_4.id);
}
if(_4.id=="hcard"){
SemTagSvcPortal.loadScript("/javascript/attributes.js");
SemTagSvcPortal.loadScript("/javascript/semanticTagMenu.js");
}
SemTagSvcPortal.loadScript(_4.js);
}
}
}
if(SemTagSvcPortalGlobal.isActionHandlerRequired){
SemTagSvcPortal.setCallback("com.ibm.portal.action",SemTagSvcPortal.processActions);
}
if(!SemTagSvcPortalGlobal.isDynamicLoading&&SemTagSvcPortalGlobal.isPersonCardHandlerRequired){
window.setTimeout(SemTagMenu.init,_2);
}
},loadConnScript:function(){
var _5=document.createElement("script");
var _6=SemTagSvcPortal.connUrl;
var _7=_6;
_7=_6+"/profiles/portalJS/portalBizCard.js";
_7+=(_7.indexOf("?")==-1)?"?":"&";
_7+="lang="+SemTagSvcPortal.lang;
_5.src=_7;
try{
document.body.insertBefore(_5,document.body.firstChild);
}
catch(e){
alert("Svc.loadConnScript caught: "+e);
}
},watchEvent:function(_8,_9,_a,_b){
try{
if(_8.addEventListener){
_8.addEventListener(_9,_a,_b);
}else{
if(_8.attachEvent){
_8.attachEvent("on"+_9,_a);
}
}
}
catch(e){
if(SemTagSvcPortal.debug){
alert("Svc.watchEvent caught: "+e);
}
}
},clearEventWatch:function(_c,_d,_e,_f){
try{
if(_c.removeEventListener){
_c.removeEventListener(_d,_e,_f);
}else{
if(_c.detachEvent){
_c.detachEvent("on"+_d,_e);
}
}
}
catch(e){
if(SemTagSvcPortal.debug){
alert("Svc.clearEventWatch caught: "+e);
}
}
},parseDomUsingMashupHandlerSingleNode:function(_10,_11){
if(SemTagSvcPortal.debug){
console.log("Inside parseDomUsingMashupHandlerSingleNode :"+_10+":"+_11);
}
var _12=SemTagSvcPortal.getService(_11);
if(!_12.nodes){
_12.nodes=new Array();
}else{
for(var k=0;k<_12.nodes.length;k++){
_12.nodes.pop();
}
}
_12.nodes.push(_10);
if(SemTagSvcPortal.debug){
console.log("parseDomUsingMashupHandlerSingleNode entry.callback got is:"+_12.callback+":"+_12.id+":"+_12.nodes.length+":"+(_12.id=="hcard"));
}
if(_12.callback){
_12.callback.call(this);
}
if(_12.id=="hcard"){
var _13=SemTagSvcPortal.getService("sametime");
if(SemTagSvcPortal.debug){
console.log("Entry for sametime got is:"+_13);
}
_13.callback.call(this);
}
},parseDomUsingMashupHandler:function(_14,_15){
if(SemTagSvcPortal.debug){
console.log("Inside parseDomUsingMashupHandler :"+_14+":"+_15);
}
var _16=SemTagSvcPortal.getService(_15);
if(_15==="com.ibm.portal.action"){
SemTagSvcPortal.setCallback(_15,SemTagSvcPortal.processActions);
}
if(!_16.nodes){
_16.nodes=new Array();
}
for(var len=0;len<_14.length;len++){
_16.nodes.push(_14[len]);
}
if(SemTagSvcPortal.debug){
console.log("parseDomUsingMashupHandler entry.callback got is:"+_16.callback+":"+_16.id+":"+_16.nodes.length+":"+(_16.id=="hcard"));
}
if(_16.callback){
_16.callback.call(this);
}
SemTagSvcPortal.loadScript(_16.js);
try{
var _17=SemTagSvcPortal.service.entries;
for(var k=0;k<_17.length;k++){
var _18=_17[k];
if(SemTagSvcPortal.debug){
console.log("entryTemp.callback got is:"+_18.id+":"+_18.nodes+":"+_18.js+":And original entry id is:"+_16.id);
}
var _19=false;
if(_18.id===_16.id){
continue;
}
if(_18.test.match(/^id:/)){
var _1a=_18.test.substr(3);
if(_1a!=_16.id){
continue;
}
if(SemTagSvcPortal.debug){
console.log("svcName got is:"+_1a);
}
var _14=SemTagSvcPortal.getNodes(_1a);
if(SemTagSvcPortal.debug){
console.log("nodes for "+_1a+" got is:"+_14+":"+_14.length);
}
if(_14&&0<_14.length){
_19=true;
}
}
if(_19){
if(SemTagSvcPortalGlobal.isDynamicLoading){
SemTagSvcPortal.loadScript(_18.js);
}
}
if(_18.callback){
_18.callback.call(this);
}
}
}
catch(e){
if(SemTagSvcPortal.debug){
console.error("Exception occured while doing match of services in SemTagSvcPortal.parseDonMashup"+e);
}
}
},parseDom:function(_1b,_1c){
if(SemTagSvcPortal.debug){
console.log("inside parseDom of SemtagSvc");
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("parseDom("+_1b+","+_1c+")");
}
if(!_1c&&_1b){
_1c=SemTagSvcPortal.getElementFromEvent(_1b);
}
if(!_1c&&SemTagSvcPortal.parseElem){
_1c=SemTagSvcPortal.parseElem;
}else{
if(!_1c){
_1c=document;
}else{
if(typeof _1c=="string"){
_1c=document.getElementById(_1c);
}
}
}
var _1d=SemTagSvcPortal.service.entries;
for(var j=0;j<_1d.length;j++){
var _1e=_1d[j];
if(!_1e.nodes){
_1e.nodes=new Array();
}else{
if(_1c==document){
while(0<_1e.nodes.length){
_1e.nodes.pop();
}
}
}
}
SemTagSvcPortal.traverseNodes(_1c);
for(var k=0;k<_1d.length;k++){
var _1e=_1d[k];
var _1f=false;
if(0<_1e.nodes.length){
_1f=true;
}else{
if(_1e.test.match(/^id:/)){
var _20=_1e.test.substr(3);
var _21=SemTagSvcPortal.getNodes(_20);
if(_21&&0<_21.length){
_1f=true;
}
}
}
if(_1f){
if(SemTagSvcPortalGlobal.isDynamicLoading){
if(_1e.id=="hcard"){
SemTagSvcPortal.loadScript("/javascript/attributes.js");
SemTagSvcPortal.loadScript("/javascript/semanticTagMenu.js");
}
SemTagSvcPortal.loadScript(_1e.js);
}
}
if(SemTagSvcPortal.debug){
console.log("entry.callback got is:"+_1e.id+":"+_1e.nodes);
}
if(_1e.callback){
_1e.callback.call(this);
}
}
SemTagSvcPortal.parseElem=null;
},traverseNodes:function(_22){
SemTagSvcPortal.traverse_children(_22);
},traverse_tagscope:function(_23){
var _24=SemTagSvcPortal.service.entries;
var _25=_23.getElementsByTagName(SemTagSvcPortal.tagScope);
for(var i=0;i<_25.length;i++){
var _23=_25[i];
for(var j=0;j<_24.length;j++){
var _26=_24[j];
if(!_26.nodes){
_26.nodes=new Array();
}
if(eval(_26.test)){
_26.nodes.push(_23);
}
}
}
},traverse_children:function(_27){
SemTagSvcPortal.testNode(_27);
var _28=(_27&&_27.childNodes)?_27.childNodes:null;
if(SemTagSvcPortalGlobal.isPersonCardHandlerRequired&&_27&&_27.tagName&&_27.tagName=="IFRAME"){
try{
if(typeof ActiveXObject!="undefined"){
var _29=document.frames[_27.id].document;
if(_29){
_28=_29.childNodes;
}
}else{
if(_27.contentDocument&&_27.contentDocument.childNodes){
_28=_27.contentDocument.childNodes;
}
}
}
catch(e){
_28=null;
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("IFRAME(id="+_27.id+",children="+(_28?_28.length:"is null")+")");
}
if(_28&&0<_28.length){
var _2a=SemTagMenu.includeCSS(_28[0].parentNode);
if(_2a){
SemTagSvcPortal.watchEvent(_27,"load",SemTagSvcPortal.parseDom,false);
SemTagMenu.registerMenuEventHandlers(_28[0].parentNode);
}
}
}
if(_28==null||_28=="undefined"){
return;
}
for(var i=0;i<_28.length;i++){
SemTagSvcPortal.traverse_children(_28[i]);
}
},testNode:function(_2b){
globalTestNode=_2b;
if(_2b==null||_2b.className==null||_2b.className=="undefined"||_2b.tagName==null||_2b.tagName=="undefined"){
return;
}
var _2c=SemTagSvcPortal.service.entries;
for(var j=0;j<_2c.length;j++){
var _2d=_2c[j];
if(!_2d.test.match(/^id:/)&&eval(_2d.test)){
if(!_2b.alreadyadded){
_2b.alreadyadded=true;
_2d.nodes.push(_2b);
}
}
}
},getService:function(_2e){
var _2f=SemTagSvcPortal.service.entries;
for(var i=0;i<_2f.length;i++){
var _30=_2f[i];
if(_30.id==_2e){
return _30;
}
}
},setSemanticTagValue:function(_31,_32,_33){
if(!_32.semTagValues){
_32.semTagValues={};
}
_32.semTagValues[_31]=_33;
},getSemanticTagValues:function(_34){
return _34.semTagValues;
},getNodes:function(_35){
var _36=SemTagSvcPortal.getService(_35);
if(SemTagSvcPortal.debug){
console.log("Inside SemTagSvcPortal.getNodes for:"+_35);
}
if(_36&&_36.test.match(/^id:/)){
_36=SemTagSvcPortal.getService(_36.test.substr(3));
}
if(SemTagSvcPortal.debug){
console.log("Inside SemTagSvcPortal.getNodes for:"+_35+"and service  is:"+_36);
}
if(_36){
if(SemTagSvcPortal.debug){
console.log("Inside SemTagSvcPortal.getNodes for:"+_35+"and service.nodes  is:"+_36.nodes);
}
}
return _36?_36.nodes:null;
},setCallback:function(_37,_38){
var _39=SemTagSvcPortal.getService(_37);
if(_39){
_39.callback=_38;
if(SemTagSvcPortal.debug){
console.log("Callback setting for :"+_37);
}
if(SemTagSvcPortal.debug){
console.log("Callback set for :"+_39.id);
}
}else{
if(SemTagSvcPortal.debug){
console.log("Did not get service for :"+_37);
}
}
},loadScript:function(_3a,_3b){
if(!_3a||_3a==""){
return;
}
if(_3b=="undefined"||_3b==null){
_3b=false;
}
if(!SemTagSvcPortal.scripts[_3a]){
SemTagSvcPortal.scripts[_3a]=true;
var _3c=document.createElement("script");
var url=_3a.match(/^http/)?_3a:SemTagSvcPortalGlobal.contextUrl+_3a;
url+=(url.indexOf("?")==-1)?"?":"&";
url+="language="+SemTagSvcPortal.lang;
_3c.src=url;
if(SemTagSvcPortal.debug){
console.log("URL in LOADSCRIPT GOT IS :"+url);
}
if(SemTagSvcPortalGlobal.isDynamicLoading||_3b){
document.body.insertBefore(_3c,document.body.firstChild);
}
}
},setSpecialMenuProvider:function(_3d){
SemTagSvcPortal.specialMenuProviders.push(_3d);
},getElementsByClassName:function(_3e,_3f,_40,_41){
if(!_3f){
_3f=document.body;
}
if(!_40){
limit=0;
}
if(!_41){
_41=["*"];
}
var _42=SemTagSvcPortal.getRegExp(_3e);
if(_3f&&_3f.className&&_3f.className.match(_42)){
return new Array(_3f);
}
var _43=new Array();
for(var t=0;t<_41.length;t++){
var _44=_3f.getElementsByTagName(_41[t]);
for(var i=0;i<_44.length;i++){
var _45=_44[i];
if(_45.className&&_45.className.match(_42)){
_43.push(_45);
}
if(0<_40&&_40==_43.length){
break;
}
}
}
return _43;
},getParentByClassName:function(_46,_47){
if(!_47){
return null;
}
var _48=SemTagSvcPortal.getRegExp(_46);
if(_47.className&&_47.className.match(_48)){
return _47;
}
while(_47.parentNode){
_47=_47.parentNode;
if(_47.className&&_47.className.match(_48)){
return _47;
}
}
return null;
},addHover:function(_49,_4a,_4b,_4c){
while(typeof SemTagMenu==undefined){
alert("waiting...");
}
var _4d=_49.getAttribute(SemTagSvcPortal.refcntAttr);
if(SemTagSvcPortal.debug){
console.log("Refcount got is:"+_4d+":"+SemTagMenu.staticHover+":"+(_4a!==null)+":"+_4b);
}
if(_4d){
_49.setAttribute(SemTagSvcPortal.refcntAttr,parseInt(Number(_4d)+1));
if(SemTagMenu.staticHover){
var img=SemTagMenu.findHoverFromLiveElement(_49);
if(img){
SemTagSvcPortal.watchEvent(img,"click",_4b,false);
img.setAttribute("href","javascript:SemTagMenu.a11y()");
}else{
if(SemTagSvcPortal.debug){
alert("couldn't find the hover for this element!");
}
}
}else{
SemTagSvcPortal.watchEvent(_49,"mouseover",_4a,false);
}
}else{
_49.setAttribute(SemTagSvcPortal.refcntAttr,"1");
SemTagSvcPortal.hoverIdx++;
_49.setAttribute(SemTagSvcPortal.liveElemPrefix+"id",SemTagSvcPortal.hoverIdx);
if(SemTagMenu.staticHover){
var img=SemTagSvcPortal.createHoverImage(_4c);
SemTagSvcPortal.watchEvent(img,"click",_4b,false);
SemTagSvcPortal.watchEvent(img,"keydown",SemTagMenu.a11y,false);
img.setAttribute("href","javascript:void()");
var _4e=_49.nextSibling;
if(_4e){
_4e.parentNode.insertBefore(img,_4e);
}else{
_49.parentNode.appendChild(img);
}
_49.setAttribute(SemTagSvcPortal.hoverIdPrefix+"idx",parseInt(SemTagSvcPortal.hoverIdx));
_49.id=SemTagSvcPortal.liveElemPrefix+SemTagSvcPortal.hoverIdx;
}else{
var _4f=SemTagUtil.getNodeClassValue(_49);
if(_4f&&0<_4f.length){
_4f+=" hasHover";
}else{
_4f="hasHover";
}
SemTagUtil.setNodeClassValue(_49,_4f);
SemTagSvcPortal.watchEvent(_49,"mouseover",_4a,false);
_49.setAttribute("tabIndex","0");
SemTagSvcPortal.watchEvent(_49,"focus",_4a,false);
SemTagSvcPortal.watchEvent(_49,"blur",SemTagMenu.mouseout,false);
_49.setAttribute("title",_4c);
}
}
},removeHover:function(_50,_51,_52){
var _53=_50.getAttribute(SemTagSvcPortal.refcntAttr);
if(_53){
var _54=Number(_53)-1;
if(_54<0&&SemTagSvcPortal.debug){
alert("SemTagSvcPortal.removeHover called on an element with refcnt="+_53);
}
if(SemTagMenu.staticHover){
var _55=SemTagSvcPortal.getHoverElement(_50);
SemTagSvcPortal.clearEventWatch(_55,"click",_52,false);
if(_54==0){
_55.parentNode.removeChild(_55);
}
}else{
SemTagSvcPortal.clearEventWatch(_50,"mouseover",_51,false);
SemTagSvcPortal.clearEventWatch(_50,"focus",_51,false);
_50.setAttribute(SemTagSvcPortal.refcntAttr,_54);
if(_54==0){
var _56=SemTagUtil.getNodeClassValue(_50);
var _57=_56.replace(/hasHover/,"");
SemTagUtil.setNodeClassValue(_50,_57);
_50.removeAttribute(SemTagSvcPortal.refcntAttr);
_50.removeAttribute("tabIndex");
}
}
}
},createHoverImage:function(_58){
var img=document.createElement("img");
img.id=SemTagSvcPortal.hoverIdPrefix+SemTagSvcPortal.hoverIdx;
img.className=SemTagMenu.iconName;
img.setAttribute("src",SemTagSvcPortalGlobal.contextUrl+"/ui/menu_selected.gif");
img.setAttribute("border","0");
img.setAttribute("alt",_58);
var _59=document.createElement("a");
SemTagSvcPortal.watchEvent(_59,"mouseover",SemTagMenu.activateHover,false);
SemTagSvcPortal.watchEvent(_59,"mouseout",SemTagMenu.deactivateHover,false);
_59.appendChild(img);
return _59;
},getHoverElement:function(_5a){
if(!_5a){
return null;
}
if(SemTagMenu.staticHover){
var idx=_5a.getAttribute(SemTagSvcPortal.hoverIdPrefix+"idx");
var img=document.getElementById(SemTagSvcPortal.hoverIdPrefix+idx);
if(img){
return img.parentNode;
}
}else{
var _5b=SemTagUtil.getNodeClassValue(_5a);
if(_5b.match(/hasHover/)){
return _5a;
}
}
return null;
},showHover:function(_5c,_5d,_5e){
SemTagMenu.showHover(_5c,_5d,_5e);
},setMenuData:function(_5f,_60,_61,_62,_63){
SemTagMenu.setMenuData(_5f,_60,_61,_62,_63);
},getMenuItemJson:function(_64,_65,_66,_67){
var o=_66?_66:0;
var i=_67?_67:"";
return {"label":_64,"href":_65,"order":o,"icon":i};
},getMenuHeaderJson:function(_68,_69,_6a){
if(_69!="text/html"){
return null;
}
if(_68&&0<_68.length){
return {"markup":_68,"order":_6a};
}else{
null;
}
},getMenuFooterJson:function(_6b,_6c,_6d){
if(_6c!="text/html"){
return null;
}
if(_6b&&0<_6b.length){
return {"markup":_6b,"order":_6d};
}else{
null;
}
},getElementFromEvent:function(_6e){
var _6f=_6e.target?_6e.target:_6e.srcElement;
if(_6f==window){
_6f=_6f.document;
}
return _6f;
},getLiveElementFromEvent:function(_70){
return SemTagMenu.findLiveElementFromEventSource(SemTagSvcPortal.getElementFromEvent(_70));
},getEventAbsoluteX:function(e){
var x=0;
if(e.pageX){
x=e.pageX;
}else{
if(e.clientX){
if(document.body.scrollLeft>document.documentElement.scrollLeft){
x=e.clientX+document.body.scrollLeft;
}else{
x=e.clientX+document.documentElement.scrollLeft;
}
}
}
return x;
},getEventAbsoluteY:function(e){
var y=0;
if(e.pageY){
y=e.pageY;
}else{
if(e.clientY){
if(document.body.scrollTop>document.documentElement.scrollTop){
y=e.clientY+document.body.scrollTop;
}else{
y=e.clientY+document.documentElement.scrollTop;
}
}
}
return y;
},findPosition:function(obj,_71){
var _72=0,_73=0,_74=0;
var _75=obj.offsetWidth;
if(obj.offsetParent){
if(_71){
_73+=(SemTagSvcPortal.bidi=="rtl")?0:_75;
}
_74+=obj.offsetHeight;
while(obj!=null){
_73+=obj.offsetLeft;
_74+=obj.offsetTop;
obj=obj.offsetParent;
_72++;
}
return [_73+(SemTagSvcPortal.bidi=="rtl"?_75:0),_74];
}else{
return [obj.x+(SemTagSvcPortal.bidi=="rtl"?_75:0),obj.y];
}
},createGroupJson:function(ctx,_76){
return {"context":ctx,"extenders":_76};
},createActionJson:function(id,js,ctx,_77,_78,_79,url,_7a){
var i=(id&&0<id.length)?id[0].innerHTML:null;
var j=(js&&0<js.length)?js[0].innerHTML:null;
var c=(ctx&&0<ctx.length)?ctx[0].innerHTML:null;
var l=(_77&&0<_77.length)?_77[0].innerHTML:null;
var d=(_78&&0<_78.length)?_78[0].innerHTML:null;
var s=(_79&&0<_79.length)?_79[0].innerHTML:null;
var u=(url&&0<url.length)?url[0].innerHTML:null;
var o=(_7a&&0<_7a.length)?parseInt(_7a[0].innerHTML):0;
return {"id":i,"impl":j,"context":c,"label":l,"description":d,"showif":s,"url":u,"order":o};
},parseOrder:function(_7b){
if(_7b==null||_7b.length==0){
return 0;
}
if(_7b.charAt(0)=="-"){
return parseInt(_7b.substr(1))*-1;
}else{
return parseInt(_7b);
}
},getActions:function(_7c){
if(!SemTagSvcPortal.actionRegistry){
SemTagSvcPortal.processActions();
}
for(var i=0;i<SemTagSvcPortal.actionRegistry.length;i++){
if(SemTagSvcPortal.actionRegistry[i].context==_7c){
return SemTagSvcPortal.actionRegistry[i].extenders;
}
}
return SemTagSvcPortal.actionRegistry[0].extenders;
},processActions:function(){
if(SemTagSvcPortal.debug){
console.log("inside processActions of SemtagSvcPortal");
}
if(!SemTagSvcPortal.actionRegistry){
SemTagSvcPortal.actionRegistry=new Array();
SemTagSvcPortal.actionRegistry[0]=SemTagSvcPortal.createGroupJson("dummy",new Array());
}
var i;
var _7d=SemTagSvcPortal.getNodes("com.ibm.portal.action");
if(SemTagSvcPortal.debug){
console.log("Nodes got for com.ibm.portal.action is:"+_7d);
}
while(_7d&&0<_7d.length){
if(SemTagSvcPortal.debug){
console.log("Inside while loop of actions");
}
var _7e=_7d.pop();
var id=SemTagSvcPortal.getElementsByClassName("action-id",_7e);
var _7f=SemTagSvcPortal.getElementsByClassName("action-impl",_7e);
var ctx=SemTagSvcPortal.getElementsByClassName("action-context",_7e);
var _80=SemTagSvcPortal.getElementsByClassName("action-label",_7e);
var _81=SemTagSvcPortal.getElementsByClassName("action-description",_7e);
var _82=SemTagSvcPortal.getElementsByClassName("action-showif",_7e);
var url=SemTagSvcPortal.getElementsByClassName("action-url",_7e);
var _83=SemTagSvcPortal.getElementsByClassName("action-order",_7e);
var _84=SemTagSvcPortal.createActionJson(id,_7f,ctx,_80,_81,_82,url,_83);
for(i=1;i<SemTagSvcPortal.actionRegistry.length;i++){
if(SemTagSvcPortal.actionRegistry[i].context==_84.context){
var cnt=SemTagSvcPortal.actionRegistry[i].extenders.length;
for(var j=0;j<cnt;j++){
if(_84.id==SemTagSvcPortal.actionRegistry[i].extenders[j].id){
break;
}
}
if(j==cnt){
SemTagSvcPortal.actionRegistry[i].extenders.push(_84);
}
break;
}
}
if(i==SemTagSvcPortal.actionRegistry.length){
SemTagSvcPortal.actionRegistry[i]=SemTagSvcPortal.createGroupJson(ctx[0].innerHTML,new Array());
SemTagSvcPortal.actionRegistry[i].extenders.push(_84);
}
if(SemTagSvcPortal.debug){
console.log("Action.impl got is:"+_84.impl);
}
if(_84.impl){
SemTagSvcPortal.loadScript(_84.impl,true);
}
}
for(i=0;i<SemTagSvcPortal.actionRegistry.length;i++){
SemTagSvcPortal.actionRegistry[i].extenders.sort(SemTagSvcPortal.sortByOrder);
}
},sortByOrder:function(a,b){
if(a.order>b.order){
return 1;
}else{
if(a.order<b.order){
return -1;
}else{
return 0;
}
}
},getTextValue:function(_85){
if(!_85){
return "";
}
return _85.innerHTML.replace(/<[a-zA-Z\/][^>]*>/gi,"");
},getTypedValue:function(_86,_87){
if(!_87){
_87="def";
}
var _88=new Array();
var _89=SemTagSvcPortal.getElementsByClassName("type",_86);
var _8a=SemTagSvcPortal.getElementsByClassName("value",_86);
var _8b="";
if(_8a.length<1){
_8b=SemTagSvcPortal.getTextValue(_86);
}
for(var i=0;i<_8a.length;i++){
_8b+=SemTagSvcPortal.getTextValue(_8a[i]);
}
if(_89.length<1){
_88[_87]=_8b;
}else{
for(var j=0;j<_89.length;j++){
var _8c=_89[j];
var _8d=_8c.tagName.match(/^abbr$/i)?_8c.getAttribute("title"):SemTagSvcPortal.getTextValue(_8c);
_88[_8d.toLowerCase()]=_8b;
}
}
return _88;
},findNameElementInHcard:function(_8e){
if(_8e.className!="vcard"){
_8e=SemTagSvcPortal.getParentByClassName("vcard",_8e);
}
var _8f=SemTagSvcPortal.getElementsByClassName("fn",_8e)[0];
if(!_8f){
_8f=SemTagSvcPortal.getElementsByClassName("n",_8e)[0];
}
return _8f;
},getEmailFromHcard:function(_90){
if(!_90){
return "";
}
if(_90.className!="vcard"){
_90=SemTagSvcPortal.getParentByClassName("vcard",_90);
}
var _91="";
if(_90){
var _92=SemTagSvcPortal.getElementsByClassName("email",_90)[0];
var _93=SemTagSvcPortal.getTypedValue(_92,"internet");
_91=_93.internet;
}
return _91;
},findElementByNameInHcard:function(_94,_95){
if(_94.className!="vcard"){
_94=SemTagSvcPortal.getParentByClassName("vcard",_94);
}
return SemTagSvcPortal.getElementsByClassName(_95,_94)[0];
},getRegExp:function(str){
var _96=SemTagSvcPortal.reMap[str];
if(!_96){
_96=new RegExp("(^|\\s)"+str+"(\\s|$)");
SemTagSvcPortal.reMap[str]=_96;
}
return _96;
}};
var SemTagSvcConfig=null;
if((SemTagSvcPortal.ifConnUrlExists=="true")&&(SemTagSvcPortal.isconnServerNew===true)){
SemTagSvcConfig={isPortal:true,baseUrl:SemTagSvcPortal.connUrl+"/profiles",loadCssFiles:true,isBidiRTL:false};
}
SemTagSvcPortal.watchEvent(window,"load",SemTagSvcPortal.init,false);
var SemTagSvc=SemTagSvcPortal;


var SemTagUtil={isGecko:(document.all?false:true),getNodeClassValue:function(_1){
var rv;
if(SemTagUtil.isGecko){
rv=(typeof (_1.getAttribute)!="undefined")?_1.getAttribute("class"):"";
}else{
rv=_1.className;
}
return (typeof (rv)!="undefined"&&rv!=null)?rv:"";
},setNodeClassValue:function(_2,_3){
if(SemTagUtil.isGecko){
_2.setAttribute("class",_3);
}else{
_2.className=_3;
}
},fireEvent:function(_4,_5){
try{
if(_4.fireEvent){
_4.fireEvent(_5);
}else{
if(_4.dispatchEvent){
_4.dispatchEvent(_5);
}
}
}
catch(e){
if(SemTagSvcPortal.debug){
alert("Svc.fireEvent caught: "+e);
}
}
},getOwnerDocument:function(_6){
if(!_6){
return null;
}
if(SemTagUtil.isGecko){
return _6.ownerDocument;
}else{
var _7=_6;
while(_7.parentNode){
_7=_7.parentNode;
}
return _7;
}
},getFrameElement:function(_8){
if(SemTagUtil.isGecko){
var oD=_8.ownerDocument;
return oD.defaultView.frameElement;
}else{
var _9=_8;
while(_9.parentNode){
_9=_9.parentNode;
}
return _9.parentWindow.frameElement;
}
},getHcardAttributeValue:function(_a,_b){
switch(_a){
case ("email"):
return SemTagUtil.getHcardTypedAttribute(_b,_a,"internet");
case ("tel"):
return SemTagUtil.getHcardTypedAttribute(_b,_a,"voice");
case ("adr"):
return SemTagUtil.getHcardTypedAttribute(_b,_a,"intl");
}
var _c=SemTagSvcPortal.getParentByClassName("vcard",_b);
var _d=SemTagSvcPortal.getElementsByClassName(_a,_c,1);
if(_d.length>0&&_d[0].tagName.match(/^abbr$/i)){
return _d[0].getAttribute("title");
}
switch(_a){
case ("X-person-display-inline"):
if(_d.length>0){
return true;
}else{
return false;
}
case ("fn"):
var fn=SemTagUtil.getSinglePropertyValue(_d[0]);
if(fn){
return fn;
}else{
return SemTagUtil.getHcardAttributeValue("n",_b);
}
break;
case ("X-person-header-only"):
case ("X-person-inside-inline"):
return (_d&&0<_d.length);
case ("X-sametime-resolve"):
var _e=_d[0];
return (typeof (_e)!="undefined"&&_e!=null);
case ("n"):
if(_d.length>0){
var _f=_d[0];
var _10="";
var _11=["honorific-prefix","given-name","additional-name","family-name","honorific-suffix"];
for(var i=0;i<5;i++){
var n=SemTagUtil.getSinglePropertyValue(SemTagSvcPortal.getElementsByClassName(_11[i],_f,1)[0]);
if(n){
_10+=n+" ";
}
}
return _10;
}
return "";
break;
case ("photo"):
var _12=_d[0];
if(_12){
return _12.getAttribute("src");
}else{
return;
}
break;
case ("X-sametime-status"):
var _13=_d[0];
if(!_13){
return "";
}
var _14=_13.getAttribute("value");
if(_14){
return _14;
}else{
return SemTagUtil.getSinglePropertyValue(_13);
}
break;
case ("street-address"):
case ("post-office-box"):
case ("extended-address"):
case ("locality"):
case ("region"):
case ("postal-code"):
case ("country-name"):
case ("title"):
case ("role"):
case ("org"):
default:
return SemTagUtil.getSinglePropertyValue(_d[0]);
break;
}
},getHcardTypedAttribute:function(_15,_16,_17){
var _18=new Object();
var _19=SemTagSvcPortal.getParentByClassName("vcard",_15);
var _1a=SemTagSvcPortal.getElementsByClassName(_16,_19);
for(var i=0;i<_1a.length;i++){
var _1b=_1a[i];
if(_16=="email"&&_1b.nodeName.toLowerCase()=="a"&&_1b.href.match(/^mailto:/)){
var _1c=_1b.href.indexOf("?");
if(_1c>-1){
_18[_17]=_1b.href.slice(7,_1c);
}else{
_18[_17]=_1b.href.slice(7);
}
continue;
}
_18=SemTagSvcPortal.getTypedValue(_1b,_17);
}
return _18;
},getSinglePropertyValue:function(_1d){
if(!_1d){
return false;
}
var _1e=_1d.innerHTML.replace(/<[a-zA-Z\/][^>]*>/gi,"");
return _1e;
},crossDomainRequest:function(){
var _1f=new Array();
var _20=new Array();
var _21=this;
createTimeoutFunction=function(_22){
return function(){
_21.cancelRequest(_22);
};
};
this.getScriptId=function(id){
return "_JVLN_"+id;
};
this.getScriptObject=function(id){
var _23=SemTagUtil.isGecko?this.getScriptId(id):this.$_getScriptId(id);
return document.getElementById(_23);
};
this.request=function(url,_24,_25,_26,_27){
var _28=this.getScriptId(_27);
if(_25){
_1f[_27]=_25;
}
if(_26){
_20[_27]=_26;
}
var _29=document.createElement("script");
_29.id=_28;
try{
_29.src=url;
}
catch(e){
if(SemTagSvcPortal.debug){
alert("crossDomainRequest.request: "+e);
}
return false;
}
document.body.insertBefore(_29,document.body.firstChild);
if(_24){
var _2a=this;
window.setTimeout(createTimeoutFunction(_27),_24);
}
};
this.cancelRequest=function(id){
if(SemTagSvcPortal.debug){
window.status="crossDomainRequest.cancelRequest";
}
var _2b=_1f[id];
_1f[id]=null;
var _2c=_20[id];
_20[id]=null;
if(_2b){
try{
if(_2b){
var evt={"target":_2c};
_2b.call(this,false,null,evt);
}
var _2d=this.getScriptObject(id);
if(_2d){
document.body.removeChild(_2d);
}
}
catch(e){
if(SemTagSvcPortal.trace){
SemTagUtil.log("crossDomainRequest.cancelRequest caught: "+e+"(callback="+_2b+")");
}
}
}
};
this.dispatch=function(id,_2e){
if(!id){
return;
}
try{
var _2f=_1f[id];
if(SemTagSvcPortal.debug&&!_2f){
alert("dispatch got null callback for: "+id);
}
if(_2f){
var evt={"target":_20[id]};
_2f.call(this,true,_2e,evt);
_1f[id]=null;
_20[id]=null;
var _30=this.getScriptObject(id);
if(_30){
document.body.removeChild(_30);
}
}
}
catch(e){
if(SemTagSvcPortal.trace){
SemTagUtil.log("crossDomainRequest.dispatch caught: "+e);
}
}
};
},log:function(msg){
var _31=document.getElementById("javlin.logger");
if(_31){
var txt=document.createTextNode(msg+"..... ");
_31.appendChild(txt);
}
}};



var availAttrib={availAttribUrl:SemTagSvcPortalGlobal.wpsBaseURL+"/um/secure/attributes/users",req:"",userAttributesRetrieved:false,retrieveAttribute:function(){
if(availAttrib.userAttributesRetrieved){
return;
}
if(SemTagSvcPortal.availAttribStr!=""){
return;
}
availAttrib.req=ibm.portal.xml.getXmlHttpRequest();
availAttrib.req.onreadystatechange=availAttrib.processStateChange;
try{
availAttrib.req.open("GET",availAttrib.availAttribUrl,true);
}
catch(e){
alert(e);
}
availAttrib.req.send(null);
availAttrib.userAttributesRetrieved=true;
},getAttributesFromTags:function(_1,_2,_3){
if(typeof ActiveXObject!="undefined"){
return _1.getElementsByTagName(_3+":"+_2);
}
return _1.getElementsByTagNameNS("*",_2);
},processStateChange:function(){
if(availAttrib.req.readyState==4){
if(availAttrib.req.status==200){
var _4=availAttrib.req.responseText;
if(_4.length>1){
var _5=ibm.portal.xml.loadXmlString(_4);
var _6=availAttrib.getAttributesFromTags(_5.documentElement,"title","atom");
var i;
for(i=1;i<_6.length;i++){
if((SemTagSvcPortal.availAttribStr=="")){
if((_6[i].firstChild.nodeValue!=null)){
SemTagSvcPortal.availAttribStr=_6[i].firstChild.nodeValue;
}
}else{
if((_6[i].firstChild.nodeValue!=null)){
SemTagSvcPortal.availAttribStr=_6[i].firstChild.nodeValue+","+SemTagSvcPortal.availAttribStr;
}
}
}
}
}else{
if(SemTagSvcPortal.debug){
console.log(availAttrib.req.statusText);
}
}
}
}};



var mytest=null;
var liveNameElementId=null;
var SemTagMenu={needCss:true,staticHover:false,id:"semtagmenu",hideDelay:SemTagSvcPortalGlobal.ptTimeout,timeouts:[],iconName:"menu_drop_icon",showing:false,currentElem:null,currentHoverLabel:null,refCount:-1,a11yMode:false,svcHandlers:[],items:[],headers:[],footers:[],moreActionImgUrl:SemTagSvcPortalGlobal.contextUrl+"/ui/ShowActions.gif",verticalRulerUrl:SemTagSvcPortalGlobal.contextUrl+"/ui/Line_Tree.gif",hoverIdRE:new RegExp(SemTagSvcPortal.hoverIdPrefix),iconNameRE:new RegExp("(^|\\s)menu_drop_icon(\\s|$)"),sftflag:false,init:function(){
SemTagMenu.includeCSS(document);
},includeCSS:function(_1){
var _2=false;
if(typeof (_1._JAVLIN_STYLE_)=="undefined"){
_2=true;
if(SemTagMenu.needCss){
var _3=_1.createElement("link");
_3.rel="stylesheet";
_3.href=SemTagSvcPortalGlobal.contextUrl+"/ui/"+(SemTagSvcPortal.bidi=="rtl"?"styles_rtl.css":"styles.css");
_3.type="text/css";
var _4=_1.getElementsByTagName("head");
if((_4&&_4[0])){
_4[0].appendChild(_3);
}
}
_1._JAVLIN_STYLE_="loaded";
}
return _2;
},registerMenuEventHandlers:function(_5){
SemTagSvcPortal.watchEvent(_5,"click",SemTagMenu.click,false);
SemTagSvcPortal.watchEvent(_5,"keydown",SemTagMenu.catchEscape,false);
SemTagSvcPortal.watchEvent(_5,"keyup",SemTagMenu.catchKeyup,false);
},unregisterMenuEventHandlers:function(_6){
SemTagSvcPortal.clearEventWatch(_6,"click",SemTagMenu.click,false);
SemTagSvcPortal.clearEventWatch(_6,"keydown",SemTagMenu.catchEscape,false);
SemTagSvcPortal.clearEventWatch(_6,"keyup",SemTagMenu.catchKeyup,false);
},nls:{"hover_label":SemTagSvcPortalGlobal.hover_label_menu,"a11y_hover":SemTagSvcPortalGlobal.a11y_hover,"a11y_photo":SemTagSvcPortalGlobal.a11y_photo,"a11y_close":SemTagSvcPortalGlobal.a11y_close,"ally_expandImage":SemTagSvcPortalGlobal.ally_expandImage,"ally_collapsedImage":SemTagSvcPortalGlobal.ally_collapsedImage,"ally_showMore":SemTagSvcPortalGlobal.ally_showMore,"ally_showLess":SemTagSvcPortalGlobal.ally_showLess,"ally_buisnessCardLabel":SemTagSvcPortalGlobal.ally_buisnessCardLabel,"ally_moreAction":SemTagSvcPortalGlobal.ally_moreAction},hoverDimension:[14,14],hoverOffset:[15,-1],menuOffset:[15,-1],writeHover:function(_7,_8,_9){
_7.write("<div class='"+SemTagMenu.iconName+"' style='cursor:pointer;'>"+_9+"</div>");
},startMenu:function(_a,_b){
_a.write("<div class='personMenu' id='personMenuID'><ul style='padding:0px;margin:0px;list-style-type:none;float:left;'title='Person card dialog' alt='Person card dialog'><li tabindex=0 onkeydown=\"SemTagMenu.catchEscape();\" onkeyup=\"SemTagMenu.catchKeyup();\"></li></ul>");
},writeHeader:function(_c,_d,_e){
_c.write("<div class='semtag_header'>"+_d.markup+"</div>");
},startActionSection:function(_f,_10,_11,_12){
if(!_11){
_11="personMenuActions";
}
_f.write("<div id='lessItem' style='display:block'><table class='personMenuActions' id='menuItemID' dir='"+_10+"'><tr >");
if(0<SemTagMenu.items.length){
tempitem=SemTagMenu.items.shift();
_f.write("<td style='width:10'><a href='#' onClick='"+tempitem.href+";return false;"+"' style='color:#105ec1;padding-top:5px;padding-bottom:5px;font-size:1.0em;'> "+tempitem.label+"</a></td>");
}
if(_12.length>=1){
_f.write("<td style='width:1'><img src= '"+SemTagMenu.verticalRulerUrl+"' /> </td> ");
_f.write("<td ><a href='#' style='color:#105ec1;padding-top:5px;padding-bottom:5px;font-size:1.0em;width:90;'onClick=\"SemTagMenu.shtest();return false;\" onKeydown=\" if (event.keyCode==13){SemTagMenu.shtest();return false; }\"><label id='actionMore'>"+SemTagMenu.nls.ally_moreAction+"</label><span style='position: absolute; top: -9000px;'>Press Enter for more actions items and tab to move the focus on items</span><img style='border:none;' src='"+SemTagMenu.moreActionImgUrl+"' title='"+SemTagMenu.nls.ally_collapsedImage+" ' /></a></td>");
}
_f.write("</tr></table></div>");
_f.write("<div id='moreItem' style='display:none'><table id='moreActionItems' class='"+_11+"' dir='"+_10+"'>");
while(0<SemTagMenu.items.length){
_12=SemTagMenu.items.shift();
if(_12.href&&_12.href.indexOf("mailto:")>-1){
_f.write("<tr ><td><a href='"+_12.href+"'>"+_12.label+"</a></td></tr>");
}else{
_f.write("<tr ><td><a  onclick='"+_12.href+";return false;"+"' href='javascript;'>"+_12.label+"</a></td></tr>");
}
}
_f.write("</table></div>");
},writeFooter:function(out,_13,_14){
out.write("<div class='semtag_footer'>"+_13.markup+"</div>");
},endMenu:function(out,_15){
out.write("<a style='width:0px; height:0px;' onblur=\"SemTagMenu.exitCard();\" onclick='return false;' href='exit from person card' title='exit from person card'></a></div>");
},out:function(){
this.buffer="";
this.write=function(str){
this.buffer+=str;
};
},activateHover:function(_16){
var _17=SemTagSvcPortal.getElementFromEvent(_16);
if(_17){
_17.src=SemTagSvcPortalGlobal.contextUrl+"/ui/menu_selected_hover.gif";
}
SemTagMenu.setCurrentElement(SemTagMenu.findLiveElementFromEventSource(_17));
},deactivateHover:function(_18){
var _19=SemTagSvcPortal.getElementFromEvent(_18);
if(_19){
_19.src=SemTagSvcPortalGlobal.contextUrl+"/ui/menu_selected.gif";
}
},showHover:function(_1a,_1b,_1c){
if(SemTagMenu.staticHover){
return;
}
var tag=SemTagMenu.getMenuTag();
if(SemTagMenu.showing&&tag.style.display!="none"){
return;
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.showHover");
}
var _1d=SemTagSvcPortal.getElementFromEvent(_1a);
if(SemTagSvcPortal.trace){
SemTagUtil.log("currentElem="+SemTagMenu.currentElem);
}
var _1e=0;
if(_1d&&_1d!=SemTagMenu.currentElem){
SemTagMenu.clearAllSvcHandlers(tag);
_1e=_1d.getAttribute(SemTagSvcPortal.refcntAttr);
if(SemTagSvcPortal.trace){
SemTagUtil.log("refcnt="+_1e);
}
if(_1e){
SemTagMenu.setCurrentElement(_1d);
}else{
if(SemTagSvcPortal.debug){
alert("SemTagMenu.showHover called for a DOM element with no refcnt attribute!");
}
SemTagMenu.setCurrentElement(null);
return;
}
}
SemTagMenu.addSvcHandler(tag,_1b);
if(_1c&&0<_1c.length){
SemTagMenu.currentHoverLabel=_1c;
}
SemTagMenu.refCount--;
if(0<SemTagMenu.refCount){
return;
}
SemTagMenu.setRefCount((0<_1e)?_1e:Number(_1d.getAttribute(SemTagSvcPortal.refcntAttr)));
SemTagMenu.showing=false;
if(_1a.type=="focus"){
SemTagMenu.a11yMode=true;
SemTagSvcPortal.watchEvent(_1d,"keydown",SemTagMenu.a11y,false);
}
var out=new SemTagMenu.out();
var _1c=SemTagMenu.currentHoverLabel?SemTagMenu.currentHoverLabel:SemTagMenu.nls.hover_label;
SemTagMenu.writeHover(out,SemTagSvcPortal.bidi,_1c);
if(SemTagSvcPortalGlobal.isPersonCardHandlerRequired){
availAttrib.retrieveAttribute();
}
SemTagMenu.offScreen(tag);
tag.innerHTML=out.buffer;
var pos=SemTagSvcPortal.findPosition(SemTagMenu.currentElem,false);
var _1f=(SemTagSvcPortal.bidi=="rtl")?0-SemTagMenu.hoverOffset[0]:SemTagMenu.hoverOffset[0];
SemTagMenu.show(SemTagMenu.id,_1a,pos[0]+_1f,pos[1]+SemTagMenu.hoverOffset[1],tag.offsetWidth,tag.offsetHeight);
},addSvcHandler:function(tag,_20){
SemTagMenu.svcHandlers.push(_20);
SemTagSvcPortal.watchEvent(tag,"click",_20,false);
},clearAllSvcHandlers:function(tag){
while(0<SemTagMenu.svcHandlers.length){
var _21=SemTagMenu.svcHandlers.pop();
if(_21){
SemTagSvcPortal.clearEventWatch(tag,"click",_21,false);
}
}
},setCurrentElement:function(_22){
SemTagMenu.currentElem=_22;
SemTagMenu.setRefCount(_22?Number(_22.getAttribute(SemTagSvcPortal.refcntAttr)):0);
SemTagMenu.currentHoverLabel=null;
while(0<SemTagMenu.headers.length){
SemTagMenu.headers.pop();
}
while(0<SemTagMenu.items.length){
SemTagMenu.items.pop();
}
while(0<SemTagMenu.footers.length){
SemTagMenu.footers.pop();
}
},setRefCount:function(cnt){
SemTagMenu.refCount=cnt;
},setMenuData:function(_23,_24,_25,_26,_27){
if(SemTagSvcPortal.debug){
window.status="Menu.setMenuData: items.length="+(_24?_24.length:0);
}
if(!SemTagMenu.staticHover&&SemTagMenu.refCount<0){
if(SemTagSvcPortal.debug){
alert("setMenuData called when refCount="+SemTagMenu.refCount);
}
return;
}
var _28=SemTagMenu.findLiveElementFromEventSource(SemTagSvcPortal.getElementFromEvent(_23));
if(!_28){
if(SemTagSvcPortal.debug){
alert("setMenuData called on a null live element");
}
return;
}
if(SemTagMenu.staticHover&&(_28!=SemTagMenu.currentElem||SemTagMenu.showing)){
SemTagMenu.setCurrentElement(_28);
}
if(_24){
for(var i=0;i<_24.length;i++){
SemTagMenu.items.push(_24[i]);
}
}
if(_25){
SemTagMenu.currentMenuCss=_25;
}
if(_26){
SemTagMenu.headers.push(_26);
}
if(_27){
SemTagMenu.footers.push(_27);
}
SemTagMenu.refCount--;
if(0<SemTagMenu.refCount){
return;
}
SemTagMenu.stopEvent(_23);
for(var j=0;j<SemTagSvcPortal.specialMenuProviders.length;j++){
var _29=SemTagSvcPortal.specialMenuProviders[j];
var _2a=_29.call(_23,SemTagMenu.currentElem);
if(_2a&&0<_2a.length){
for(var k=0;k<_2a.length;k++){
SemTagMenu.items.push(_2a[k]);
}
}
}
SemTagMenu.showMenu(_23);
},getCurrentElement:function(){
return SemTagMenu.currentElem;
},showMenu:function(_2b){
if(0==SemTagMenu.headers.length+SemTagMenu.items.length+SemTagMenu.footers.length){
SemTagMenu.hide();
return;
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.showMenu");
}
SemTagMenu.items.sort(SemTagSvcPortal.sortByOrder);
if(1<SemTagMenu.headers.length){
SemTagMenu.headers.sort(SemTagSvcPortal.sortByOrder);
}
if(1<SemTagMenu.footers.length){
SemTagMenu.footers.sort(SemTagSvcPortal.sortByOrder);
}
var out=new SemTagMenu.out();
SemTagMenu.startMenu(out,SemTagSvcPortal.bidi);
if(0<SemTagMenu.headers.length){
SemTagMenu.writeHeader(out,SemTagMenu.headers[0],SemTagSvcPortal.bidi);
}
SemTagMenu.startActionSection(out,SemTagSvcPortal.bidi,SemTagMenu.currentMenuCss,SemTagMenu.items);
if(0<SemTagMenu.footers.length){
SemTagMenu.writeFooter(out,SemTagMenu.footers[0],SemTagSvcPortal.bidi);
}
SemTagMenu.endMenu(out,SemTagSvcPortal.bidi);
var tag=SemTagMenu.getMenuTag();
SemTagMenu.clearAllSvcHandlers(tag);
SemTagMenu.offScreen(tag);
tag.innerHTML=out.buffer;
SemTagMenu.showing=true;
SemTagMenu.defaultCursor();
if(SemTagMenu.a11yMode){
if(SemTagUtil.isGecko){
var _2c=tag.getElementsByTagName("li");
if(0<_2c.length){
_2c[0].focus();
}
}else{
tag.focus();
}
}
SemTagMenu.registerMenuEventHandlers(document);
var pos=SemTagSvcPortal.findPosition(SemTagMenu.currentElem,false);
var _2d=(SemTagSvcPortal.bidi=="rtl")?0-SemTagMenu.menuOffset[0]:SemTagMenu.menuOffset[0];
SemTagMenu.show(SemTagMenu.id,_2b,pos[0]+_2d,pos[1]+SemTagMenu.menuOffset[1],tag.offsetWidth,tag.offsetHeight);
},getMenuTag:function(){
var tag=document.getElementById(SemTagMenu.id);
if(!tag){
tag=document.createElement("div");
tag.setAttribute("id",SemTagMenu.id);
tag.style.position="absolute";
tag.style.display="none";
tag.style.zIndex="99999";
SemTagSvcPortal.watchEvent(tag,"mouseout",SemTagMenu.mouseout,false);
SemTagSvcPortal.watchEvent(tag,"mouseover",SemTagMenu.mouseover,false);
document.body.insertBefore(tag,document.body.firstChild);
}
return tag;
},show:function(_2e,e,_2f,_30,_31,_32){
if(SemTagSvcPortal.trace){
SemTagUtil.log("SemTagUtil.show");
}
var _33;
var _34;
SemTagMenu.clearTimeouts();
var _35=document.getElementById(_2e);
if(_31==null){
_31=0;
}
if(_32==null){
_32=0;
}
var top,_36;
if(_2f!=null&&_30!=null){
var top=_30;
var _36=_2f-(SemTagSvcPortal.bidi=="rtl"?_31:0);
}else{
var top=SemTagSvcPortal.getEventAbsoluteY(e);
var _36=SemTagSvcPortal.getEventAbsoluteX(e);
}
var _37=SemTagMenu.currentElem;
mytest=_37.parentNode;
var _38,_39,d=document;
if(typeof window.innerWidth!="undefined"){
_38=window.innerWidth;
_39=window.innerHeight;
}else{
if(d.documentElement&&typeof d.documentElement.clientWidth!="undefined"&&d.documentElement.clientWidth!=0){
_38=d.documentElement.clientWidth;
_39=d.documentElement.clientHeight;
}else{
if(d.body&&typeof d.body.clientWidth!="undefined"){
_38=d.body.clientWidth;
_39=d.body.clientHeight;
}
}
}
var _3a=(document.body.scrollLeft>document.documentElement.scrollLeft)?document.body.scrollLeft:document.documentElement.scrollLeft;
if((_36+_31)>(_38+_3a)){
var _3b=(_36+_31)-_38-_3a;
_36-=_3b;
}
var _3c=(document.body.scrollTop>document.documentElement.scrollTop)?document.body.scrollTop:document.documentElement.scrollTop;
if((top+_32)>(_39+_3c)){
var _3b=(top+_32)-_39-_3c;
top-=_3b;
}
if(SemTagSvcPortal.bidi=="rtl"&&_36<0){
_36=0;
}
var od=SemTagUtil.getOwnerDocument(_37);
if(od.location!=document.location){
var f=SemTagUtil.getFrameElement(_37);
if(f){
var el=f.offsetParent;
var x=0,y=0;
while(el){
x+=el.offsetLeft;
y+=el.offsetTop;
el=el.offsetParent;
}
var lof=_37.offsetParent;
var xx=0,yy=0;
while(lof){
xx+=lof.offsetLeft;
yy+=lof.offsetTop;
lof=lof.offsetParent;
}
if(f.id=="wpsFLY_flyoutIFrame"){
top=y+yy+_37.offsetHeight;
_36=x+xx+_37.offsetWidth;
}else{
top+=f.offsetTop;
_36+=f.offsetLeft;
}
if(SemTagUtil.isGecko&&f.id=="wpsFLY_flyoutIFrame"){
_34=f.contentWindow.pageXOffset;
_33=f.contentWindow.pageYOffset;
}
if(!SemTagUtil.isGecko&&f.id=="wpsFLY_flyoutIFrame"){
_34=f.contentWindow.document.body.parentNode.scrollLeft;
_33=f.contentWindow.document.body.parentNode.scrollTop;
}
top-=_33;
_36-=_34;
}
}
_35.style.top=top+"px";
_35.style.left=_36+"px";
_35.style.display="block";
SemTagMenu.startHideTimer(_2e);
},hide:function(_3d,e){
SemTagMenu.unregisterMenuEventHandlers(document);
var tag=SemTagMenu.getMenuTag();
if(!tag){
return false;
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.hide");
}
if(tag.style.display!="block"){
return false;
}
tag.style.display="none";
SemTagMenu.showing=false;
try{
var _3e=SemTagMenu.getNextEle(mytest);
}
catch(e){
}
SemTagMenu.setCurrentElement(null);
SemTagMenu.currentHoverLabel=null;
SemTagMenu.clearAllSvcHandlers(tag);
SemTagMenu.a11yMode=false;
SemTagMenu.defaultCursor();
return true;
},getNextEle:function(ele){
var par=ele.parentNode;
while(true){
if(par==null||par=="undefined"){
return false;
}else{
if(par.nodeName=="BODY"){
return par;
}else{
var _3f=par.nextSibling;
if(_3f!=null){
return _3f;
}
par=par.parentNode;
}
}
}
return false;
},offScreen:function(_40){
_40.style.top="-1000px";
_40.style.left="-1000px";
_40.style.display="block";
},findLiveElementFromEventSource:function(_41){
if(SemTagMenu.staticHover){
var id=_41.id;
if(!id.match(SemTagMenu.hoverIdRE)){
var _42=_41.getElementsByTagName("img");
for(var i=0;i<_42.length;i++){
if(_42[i].id&&_42[i].id.match(SemTagMenu.hoverIdRE)){
id=_42[i].id;
break;
}
}
}
if(id&&0<id.length){
var idx=id.substr(SemTagSvcPortal.hoverIdPrefix.length);
return document.getElementById(SemTagSvcPortal.liveElemPrefix+idx);
}else{
return _41;
}
}else{
var _43=SemTagMenu.getCurrentElement();
return _43?_43:_41;
}
},findHoverFromLiveElement:function(_44){
var idx=_44.getAttribute(SemTagSvcPortal.hoverIdPrefix+"idx");
return document.getElementById(SemTagSvcPortal.hoverIdPrefix+idx);
},inMenu:function(_45,_46,_47,_48){
if(!_45){
return false;
}
if(!SemTagMenu.showing){
return false;
}
if(!_47){
_47=0;
}
if(!_48){
_48=0;
}
var _49=SemTagSvcPortal.getEventAbsoluteX(_46);
var _4a=SemTagSvcPortal.getEventAbsoluteY(_46);
var _4b=_45.style.left.replace(/px$/,"");
var _4c=_45.style.top.replace(/px$/,"");
var _4d=parseInt(_4b)+parseInt(_45.clientWidth);
var _4e=parseInt(_4c)+parseInt(_45.clientHeight);
if((_49-1<=(_4b-_47))||(_4a-1<=(_4c-_48))||(_49>=(_4d+_47))||(_4a>=(_4e+_48))){
return false;
}else{
return true;
}
},mouseout:function(_4f){
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.mouseout");
}
if(_4f.type=="blur"){
var _50=SemTagSvcPortal.getElementFromEvent(_4f);
if(SemTagMenu.currentElem){
if(SemTagSvcPortal.trace){
SemTagUtil.log("clearEventWatch");
}
SemTagSvcPortal.clearEventWatch(SemTagMenu.currentElem,"keydown",SemTagMenu.a11y,false);
}
if(!SemTagMenu.showing){
if(SemTagSvcPortal.trace){
SemTagUtil.log("dismissing hover");
}
if(!_50.className.match(SemTagMenu.iconNameRE)){
SemTagMenu.hide();
}
}
}else{
var _51=SemTagMenu.id;
menuElem=document.getElementById(_51);
if(SemTagMenu.inMenu(menuElem,_4f)){
}else{
SemTagMenu.startHideTimer(_51);
}
}
},mouseover:function(_52){
SemTagMenu.clearTimeouts();
},click:function(_53){
if(!_53){
return;
}
var _54=SemTagSvcPortal.getElementFromEvent(_53);
var _55=SemTagSvcPortal.getParentByClassName("semtag_header",_54);
var _56=SemTagSvcPortal.getParentByClassName("personMenuActions",_54);
if(!_55&&!_56){
SemTagMenu.hide(SemTagMenu.id);
}
},catchKeyup:function(_57){
var _58;
var _59=false;
if(_57){
if(_57.which){
_58=_57.which;
}else{
_58=_57.keyCode;
}
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.catchKeyup:key="+_58);
}
var _5a=document.activeElement.className;
if(_5a.indexOf("lotusui")>-1){
_59=true;
}
if(_58==16&&_59&&SemTagMenu.sftflag){
SemTagMenu.exitCard();
}
SemTagMenu.sftflag=false;
},catchEscape:function(_5b){
var key;
if(_5b){
if(_5b.which){
key=_5b.which;
}else{
key=_5b.keyCode;
}
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.catchEscape:key="+key);
}
if(key==16){
SemTagMenu.sftflag=true;
}
if(key==27){
var _5c=null;
if(SemTagMenu.showing){
var _5d=SemTagMenu.getCurrentElement();
if(_5d){
_5c=SemTagSvcPortal.getHoverElement(_5d);
}
}
SemTagMenu.hide();
if(_5c){
_5c.focus();
}
}
},a11y:function(_5e){
if(_5e){
var key;
if(_5e.which){
key=_5e.which;
}else{
key=_5e.keyCode;
}
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.a11y:key="+key);
}
if(key==13){
var _5f=SemTagSvcPortal.getElementFromEvent(_5e);
if(_5f){
SemTagMenu.a11yMode=true;
var _60=(SemTagMenu.staticHover?_5f:SemTagMenu.getMenuTag());
if(SemTagUtil.isGecko){
var evt=document.createEvent("MouseEvents");
evt.initEvent("click",true,true);
SemTagUtil.fireEvent(_60,evt);
}else{
_60.click();
}
SemTagMenu.stopEvent(_5e);
}
}
}else{
var _5f=SemTagMenu.currentElem;
if(_5f){
SemTagMenu.a11yMode=true;
var _60=(SemTagMenu.staticHover?_5f:SemTagMenu.getMenuTag());
if(SemTagUtil.isGecko){
var _61=document.createEvent("MouseEvents");
_61.initEvent("click",true,true);
SemTagUtil.fireEvent(_60,_61);
}else{
_60.click();
}
SemTagMenu.stopEvent(evt);
}
}
return true;
},stopEvent:function(_62){
if(!_62){
return;
}
if(SemTagUtil.isGecko){
try{
_62.preventDefault();
_62.stopPropagation();
}
catch(e){
}
}else{
try{
_62.returnValue=false;
_62.cancelBubble=true;
}
catch(e){
if(SemTagSvcPortal.trace){
SemTagUtil.log("stopEvent caught "+e);
}
}
}
},startHideTimer:function(_63){
if(0<SemTagMenu.hideDelay&&!SemTagMenu.a11yMode&&!SemTagSvcPortal.debug){
SemTagMenu.timeouts.push(window.setTimeout("SemTagMenu.endHideTimer(\""+_63+"\")",SemTagMenu.hideDelay));
}
},endHideTimer:function(_64){
if(SemTagSvcPortal.trace){
SemTagUtil.log("Menu.endHideTimer");
}
SemTagMenu.hide(_64);
},clearTimeouts:function(){
var tos=SemTagMenu.timeouts;
for(i=0;i<tos.length;i++){
window.clearTimeout(tos[i]);
}
},defaultCursor:function(){
document.body.style.cursor="default";
},waitCursor:function(){
document.body.style.cursor="progress";
},shtest:function(){
var _65=document.getElementById("lessItem");
var _66=document.getElementById("moreItem");
_65.style.display="none";
_66.style.display="block";
},exitCard:function(){
var _67=null;
if(SemTagMenu.showing){
var _68=SemTagMenu.getCurrentElement();
if(_68){
_67=SemTagSvcPortal.getHoverElement(_68);
}
}
SemTagMenu.hide();
if(_67){
_67.focus();
}
}};
if(SemTagSvcPortalGlobal.isDynamicLoading&&SemTagSvcPortalGlobal.isPersonCardHandlerRequired){
window.setTimeout(SemTagMenu.init,SemTagSvcPortal.DELAY);
}


	
var SemTagPerson={INLINE:"X-person-display-inline",activeElems:new Array(),requestor:new SemTagUtil.crossDomainRequest(),servletUrl:SemTagSvcPortalGlobal.wpsBaseURL+"/um/secure/users/profiles?expandRefs=true&includeAttributes="+"@@@AVAILATTRIBUTES@@@"+"&searchAttributes=@@@QUERY@@@",servletUrlForUID:SemTagSvcPortalGlobal.wpsBaseURL+"/um/secure/users/profiles?"+"@@@QUERY@@@"+"&includeAttributes="+"@@@AVAILATTRIBUTES@@@",servletUrlForObjectId:SemTagSvcPortalGlobal.wpsBaseURL+"/um/secure/users/profiles/"+"@@@UserObjectID@@@"+"?expandRefs=true&includeAttributes="+"@@@AVAILATTRIBUTES@@@",reqMethod:eval("callUserProfileServlet"),photoUrl:SemTagSvcPortalGlobal.wpsBaseURL+"/um/secure/users/profiles/@@@ObjectID@@@/jpegPhoto?index=0",collapsedImgUrl:SemTagSvcPortalGlobal.contextUrl+"/ui/imgcollapsed.gif",expandedImgUrl:SemTagSvcPortalGlobal.contextUrl+"/ui/imgexpanded.gif",moreActionImgUrl:SemTagSvcPortalGlobal.contextUrl+"/ui/ShowActions.gif",verticalRulerUrl:SemTagSvcPortalGlobal.contextUrl+"/ui/Line_Tree.gif",profileImageUrl:SemTagSvcPortalGlobal.contextUrl+"/ui/Properties.gif",showImage:false,init:function(){
if(SemTagSvcPortal.trace){
console.log("Inside init of SemTagPerson.init()");
}
if(SemTagSvcPortal.ifConnUrlExists=="true"&&SemTagSvcPortal.isconnServerNew==false){
if(eval("document.body != null")==false){
SemTagPerson.processUntilAvailable(SemTagPerson.init,"(document.body != null)",null,null,null,null);
return;
}else{
SemTagPerson.loadScript();
}
}
if(SemTagSvcPortal.ifConnUrlExists=="true"&&SemTagSvcPortal.isconnServerNew==true){
if(eval("document.body != null")==false){
SemTagPerson.processUntilAvailable(SemTagPerson.init,"(document.body != null)",null,null,null,null);
return;
}else{
SemTagSvcPortal.loadConnScript();
}
}
SemTagSvcPortal.setCallback("hcard",SemTagPerson.hcardsAdded);
SemTagSvcPortal.setCallback("mailto",SemTagPerson.mailtosAdded);
SemTagPerson.processHcards(SemTagSvcPortal.getNodes("hcard"));
SemTagPerson.processMailtos(SemTagSvcPortal.getNodes("mailto"));
SemTagSvcPortal.watchEvent(window,"load",SemTagPerson.clearInternalData,false);
},loadScript:function(){
var _1=document.createElement("script");
var _2=SemTagSvcPortal.connUrl;
_2+=(_2.indexOf("?")==-1)?"?":"&";
_2+="lang="+SemTagSvcPortal.lang;
_1.src=_2;
document.body.insertBefore(_1,document.body.firstChild);
},clearInternalData:function(){
var _3=SemTagPerson.activeElems;
while(0<_3.length){
_3.pop();
}
},nls:{"start_chat":SemTagSvcPortalGlobal.start_chat,"add_to_contact":SemTagSvcPortalGlobal.add_to_contact,"send_email":SemTagSvcPortalGlobal.send_email,"view_person":SemTagSvcPortalGlobal.view_person,"hover_label":SemTagSvcPortalGlobal.hover_label_person,"work_location":SemTagSvcPortalGlobal.work_location,"specify_email_if_connection":SemTagSvcPortalGlobal.specify_email_if_connection},getPersonResolverUrl:SemTagSvcPortalGlobal.getPersonResolverUrl,getMarkup:function(_4,_5,_6,_7,_8,_9){
var _a="";
var _b=(typeof (_4.email)!="undefined"&&_4.email.internet)?_4.email.internet:null;
if(!(SemTagSvcPortal.ifConnUrlExists=="true"&&_b!=null)){
if(_4._profileinplace){
var _c=_4.uid.replace(/\\/g,"&perc5C");
_a="javascript:SemTagPerson.executeJSTargetInFrame(\"javascript:doShowProfile(\\\""+_c+"\\\")\")";
}else{
_a="javascript:SemTagPerson.openPersonRecord()";
}
_6.push(SemTagSvcPortal.getMenuItemJson(SemTagPerson.nls.view_person,_a,-100));
}
if(_b){
_6.push(SemTagSvcPortal.getMenuItemJson(SemTagPerson.nls.send_email,"mailto:"+_b,-90));
}
if(SemTagSvcPortal.debug){
console.log("ST Status got in person1.jsp is:"+typeof (SemTagAwrns)!="undefined"&&typeof (_4.X.ststatus)!="undefined");
}
if(SemTagSvcPortal.debug){
console.log(_4.X.ststatus+":"+(_4.X.ststatus=="online"||_4.X.ststatus=="away"));
}
if(SemTagSvcPortal.sametimeSTProxy){
var _d="javascript:SemTagAwrns.openAddToContacts(\""+_4.X.imn+"\")";
_6.push(SemTagSvcPortal.getMenuItemJson(stproxy.uiControl.i18nStrings.contextMenuAddToContacts,_d,-40));
}
if(typeof (SemTagAwrns)!="undefined"&&typeof (_4.X.ststatus)!="undefined"&&(_4.X.ststatus=="online"||_4.X.ststatus=="away")){
var _e="javascript:SemTagAwrns.openChat(\""+_4.X.imn+"\")";
_6.push(SemTagSvcPortal.getMenuItemJson(SemTagPerson.nls.start_chat,_e,-80));
if(SemTagSvcPortal.sametimeSTProxy){
var _f="javascript:SemTagAwrns.openCall(\""+_4.X.imn+"\")";
var _10="javascript:SemTagAwrns.openInstantMeeting(\""+_4.X.imn+"\")";
var _11="javascript:SemTagAwrns.openSendAnnouncement(\""+_4.X.imn+"\")";
_6.push(SemTagSvcPortal.getMenuItemJson(stproxy.uiControl.i18nStrings.contextMenuCall,_f,-70));
_6.push(SemTagSvcPortal.getMenuItemJson(stproxy.uiControl.i18nStrings.contextMenuInstantMeeting,_10,-60));
_6.push(SemTagSvcPortal.getMenuItemJson(stproxy.uiControl.i18nStrings.contextMenuSendAnnouncement,_11,-50));
}
if(SemTagSvcPortal.sametimeSTLinks){
_6.push(SemTagSvcPortal.getMenuItemJson(SemTagPerson.nls.add_to_contact,"javascript:SemTagPerson.addToSametimeList()",-11));
}
}
var _12=SemTagSvcPortal.getActions("person");
if(_12){
for(i=0;i<_12.length;i++){
var _13=_12[i].showif;
var _14=true;
if(_13){
try{
var _15=eval(_13);
_14=_15.call(null,SemTagPerson.currentPerson);
}
catch(e){
try{
var _15=eval(_13);
_14=_15.call(null,SemTagPerson.currentPerson);
}
catch(e2){
_14=false;
}
}
}
if(_14){
var _16=_12[i].label;
if(_16.match(/nls\.[a-z]/)){
_16=eval(_16);
}
if(!(_16.indexOf("Send Instant")>-1)){
var _17=_12[i].url.replace(/@@@ARGS@@@/g,"SemTagPerson.currentPerson");
_6.push(SemTagSvcPortal.getMenuItemJson(_16,_17,_12[i].order));
}
}
}
}
if(!_4._inline){
if(SemTagSvcPortal.ifConnUrlExists=="true"&&(SemTagSvcPortal.isconnServerNew==false)&&(_b!=null)){
_8.write("<div class='popupPersonCard' id='businessCard'>");
_8.write("</div>");
}else{
var _18="";
if(typeof (SemTagAwrns)!="undefined"&&typeof (_4.X.ststatus)!="undefined"&&(_4.X.ststatus=="online"||_4.X.ststatus=="away")){
_18=_4.X.ststatus;
}
var _19=null;
if(_4.photo!=null&&_4.photo!=="undefined"){
_19=_4.photo;
}else{
_19="";
}
_8.write("<div class ='businessCardMenu'>");
_8.write("<span class='photoCard' id ='imageSpan'><div id='imageDiv' style='height:90px; width:90px' >");
if(SemTagPerson.showImage){
_8.write("<img id='personImg' tabindex=0 style='border:1px solid rgb(192,192,192);float:right;padding:10px ; height:50px; width:50px; background-color:white;margin-right:6px' src='"+_19+"' onMouseover='SemTagPerson.imgHoverIn();return false;' alt='"+_4.fn+" "+SemTagMenu.nls.a11y_photo+"' title='"+_4.fn+" "+SemTagMenu.nls.a11y_photo+"'/>");
}
_8.write(" <img id='personImg1' tabindex=0 style='display:none;border:1px solid rgb(192,192,192);float:right;padding:10px ; height:82px; width:82px; background-color:white;margin-right:6px' src='"+_19+"' onMouseout='SemTagPerson.imgHoverOut();return false;' alt='"+_4.fn+" "+SemTagMenu.nls.a11y_photo+"' title='"+_4.fn+" "+SemTagMenu.nls.a11y_photo+"'/></div></span>");
_8.write("<div class='businessCard'><ul dir='"+_5+"'>");
_8.write("<li class='cardName' onkeydown=\"SemTagMenu.catchEscape();\" onkeyup=\"SemTagMenu.catchKeyup();\"><a href='#' style='text-Decoration:none;color:black'>"+_4.fn+"</a></li>");
if(typeof (SemTagAwrns)!="undefined"&&typeof (_4.X.ststatus)!="undefined"&&(_4.X.ststatus=="online"||_4.X.ststatus=="away")){
_8.write("<span id='statusIcon' style='vertical-align:text-top'><a href='#' style='text-Decoration:none;color:black'>"+SemTagAwrns.st+_18+"</a></span>");
}
if(SemTagSvcPortalGlobal.debug){
console.log("person got in getMarkUp method is:"+_4);
}
if(SemTagSvcPortalGlobal.collapsedItems!=null){
_8.write(SemTagPerson.getItemsAsHtml(SemTagSvcPortalGlobal.collapsedItems,"collapsed"));
}
_8.write("</ul></div>");
if(SemTagSvcPortalGlobal.showDetailsFlag){
_8.write("<div class='showMoreDiv'>");
_8.write("<span><img tabIndex=0 id='expCollapImg' src='"+SemTagPerson.collapsedImgUrl+"' title='"+SemTagMenu.nls.ally_collapsedImage+" ' onClick='SemTagPerson.imgClicked();' onKeydown='SemTagPerson.imgClicked();'/><label id='toggleLabel' class='showMoreLabel'>"+SemTagMenu.nls.ally_showMore+"</label></font></span>");
_8.write("</div>");
}
_8.write("<div class='businessCardExtended' id='expandedSection' style='display:none'><ul style='padding-top:5px;align:left;' dir='"+_5+"'>");
if(SemTagSvcPortalGlobal.expandedItems!=null){
_8.write(SemTagPerson.getItemsAsHtml(SemTagSvcPortalGlobal.expandedItems,"expanded"));
}
_8.write("</ul></div>");
_8.write("</div>");
}
}
},getItemsAsHtml:function(_1a,_1b){
var _1c=new String("");
if(_1a!=null){
var _1d=_1a.split(",");
var i=0;
if(SemTagSvcPortal.debug){
console.log("Length of card items got is:"+_1d.length);
}
while(i<_1d.length){
var _1e=_1d[i].replace(/^\s+|\s+$/g,"");
var _1f=new String("");
if(_1e.match("businessCategory")){
_1f=".category";
}else{
if(_1e.match("carLicense")){
_1f=".X.carlicense";
}else{
if(_1e.match("cn")&&_1e.length==2){
_1f=".fn";
}else{
if(_1e.match("countryName")){
_1f=".adr.countryname";
}else{
if(_1e.match("departmentNumber")){
_1f=".X.departmentnumber";
}else{
if(_1e.match("description")){
_1f=".note";
}else{
if(_1e.match("displayName")){
_1f=".fn";
}else{
if(_1e.match("employeeNumber")){
_1f=".X.employeenumber";
}else{
if(_1e.match("employeeType")){
_1f=".X.employeetype";
}else{
if(_1e.match("facsimileTelephoneNumber")){
_1f=".tel.fax";
}else{
if(_1e.match("givenName")){
_1f=".n.givenname";
}else{
if(_1e.match("homePostalAddress")){
_1f=".X.homeaddress";
}else{
if(_1e.match("ibm-gender")){
_1f=".X.gender";
}else{
if(_1e.match("ibm-generationQualifier")){
_1f=".n.honorificsuffix";
}else{
if(_1e.match("ibm-hobby")){
_1f=".X.hobby";
}else{
if(_1e.match("ibm-jobTitle")){
_1f=".title";
}else{
if(_1e.match("ibm-middleName")){
_1f=".n.additionalname";
}else{
if(_1e.match("ibm-otherEmail")){
_1f=".email.X_notes";
}else{
if(_1e.match("ibm-personalTitle")){
_1f=".n.honorificprefix";
}else{
if(_1e.match("ibm-primaryEmail")){
_1f=".email.internet";
}else{
if(_1e.match("mail")&&_1e.length==4){
_1f=".email.internet";
}else{
if(_1e.match("ibm-regionalLocale")){
_1f=".X.locale";
}else{
if(_1e.match("ibm-timeZone")){
_1f=".tz";
}else{
if(_1e.match("initials")){
_1f=".X.initials";
}else{
if(_1e.match("localityName")){
_1f=".adr.locality";
}else{
if(_1e.match("manager")){
_1f=".X.manager";
}else{
if(_1e.match("mobile")){
_1f=".tel.cell";
}else{
if(_1e.match("o")&&_1e.length==1){
_1f=".org.name";
}else{
if(_1e.match("ou")&&_1e.length==2){
_1f=".org.unit";
}else{
if(_1e.match("pager")){
_1f=".tel.pager";
}else{
if(_1e.match("postalAddress")){
_1f=".X.fulladdress";
}else{
if(_1e.match("postalCode")){
_1f=".adr.postalcode";
}else{
if(_1e.match("preferredLanguage")){
_1f=".X.language";
}else{
if(_1e.match("roomNumber")){
_1f=".adr.extendedaddress";
}else{
if(_1e.match("secretary")){
_1f=".X.secretary";
}else{
if(_1e.match("seeAlso")){
_1f=".url";
}else{
if(_1e.match("sn")&&_1e.length==2){
_1f=".n.familyname";
}else{
if(_1e.match("stateOrProvinceName")){
_1f=".adr.region";
}else{
if(_1e.match("street")){
_1f=".adr.streetaddress";
}else{
if(_1e.match("telephoneNumber")){
_1f=".tel.voice";
}else{
if(_1e.match("uid")&&_1e.length==3){
_1f=".uid";
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
if(0<_1f.length){
var _20=new String("");
var pos=_1f.indexOf(".",1);
while(pos!=-1){
if(0<_20.length){
_20+=" && ";
}
_20+="SemTagPerson.currentPerson"+_1f.substring(0,pos);
pos=_1f.indexOf(".",pos+1);
}
if(0<_20.length){
_20+=" && ";
}
_20+="SemTagPerson.currentPerson"+_1f;
var _21=0;
if(_1b.match("expanded")){
_21=0;
}
if(_1b.match("collapsed")){
_21=1;
}
if(SemTagSvcPortal.debug){
console.log(_20.toString());
}
if(SemTagSvcPortal.debug){
console.log(eval(_20.toString()));
}
var _22="<li +tabindex="+_21+" style='padding-bottom:3px'> "+eval(_20.toString())+"</li>";
if(_1e.indexOf("mail")!=-1){
_22="<li><a href='mailto: "+eval(_20.toString())+"'> "+eval(_20.toString())+"</a></li>";
}
if(eval(_20.toString())){
_1c+=_22;
}
}
i++;
}
}
return _1c;
},imgClicked:function(){
var _23=document.getElementById("expCollapImg");
var _24=document.getElementById("toggleLabel");
var _25=document.getElementById("expandedSection");
var _26=navigator.appName;
if(_26=="Netscape"){
_25.style.width="240";
}else{
_25.style.width="378";
}
if(_23.src.indexOf(SemTagPerson.expandedImgUrl)>1){
_23.src=SemTagPerson.collapsedImgUrl;
_23.title=SemTagMenu.nls.ally_collapsedImage;
_24.innerHTML=SemTagMenu.nls.ally_showMore;
}else{
_23.src=SemTagPerson.expandedImgUrl;
_23.title=SemTagMenu.nls.ally_expandImage;
_24.innerHTML=SemTagMenu.nls.ally_showLess;
}
var _27=document.getElementById("expandedSection");
_27.style.display=(_27.style.display!="none"?"none":"");
},imgHoverIn:function(){
var _28=document.getElementById("personImg");
var _29=document.getElementById("personImg1");
_28.style.display="none";
_29.style.display="";
},imgHoverOut:function(){
var _2a=document.getElementById("personImg");
var _2b=document.getElementById("personImg1");
_2a.style.display="";
_2b.style.display="none";
},getInlineMarkup:function(_2c,_2d,_2e){
var _2f=_2c.email.internet;
_2e.write("<div class='personMenu'>");
_2e.write("<div class='photoCard'><img src='"+_2c.photo+"' alt=''/></div>");
_2e.write("<div class='businessCard' dir='"+_2d+"'>");
var _30=(_2c._headeronly?"class='vcard X-person-inside-inline'":"");
_2e.write("<ul "+_30+" dir='"+_2d+"'>");
_2e.write("<li class='cardName'><span class='fn'>"+_2c.fn+"</span></li>");
_2e.write("<li class='email'><span class'type' style='display:none;'>internet</span><span class='value'>"+_2f+"</span></li>");
if(_2c.title){
_2e.write("<li>"+_2c.title+"</li>");
}
if(_2c.tel&&_2c.tel.voice){
_2e.write("<li>"+_2c.tel.voice+"</li>");
}
_2e.write("</ul>");
_2e.write("</div>");
if(_2c._headeronly){
_2e.write("<div style='clear:both;'>");
}else{
_2e.write("<div class='personMenuActions' dir='"+_2d+"' style='clear:both;'>");
_2e.write("<ul>");
_2e.write("<li><a href='NEEDSWORK"+"'>"+SemTagPerson.nls.view_person+"</a></li>");
_2e.write("<li><a href='mailto:"+_2f+"'>"+SemTagPerson.nls.send_email+"</a></li>");
_2e.write("<li><a href='NEEDSWORK"+"'>"+SemTagPerson.nls.add_to_contact+"</a></li>");
_2e.write("</ul>");
}
_2e.write("</div>");
_2e.write("</div>");
},openPersonRecord:function(){
var _31=SemTagPerson.currentPerson;
var _32=null;
if(_31.uid!="undefined"&&_31.uid.length>0){
_32=_31.uid;
}else{
if((typeof (_31.email)!="undefined"&&typeof (_31.email.internet)!="undefined"&&0<_31.email.internet.length)){
_32=_31.email;
}
}
var _33=encodeURIComponent(_32);
var _34=encodeURIComponent(_33);
if(SemTagSvcPortal.debug){
console.log("userId3is :"+_34+":"+SemTagPerson.currentPerson.fn+":"+SemTagPerson.getPersonResolverUrl()+":");
}
if(SemTagSvcPortal.debug){
console.log("NEWReplaced string is:"+SemTagPerson.getPersonResolverUrl().replace("TOBEREPLACED",_34));
}
window.open(SemTagPerson.getPersonResolverUrl().replace("TOBEREPLACED",_34),null,"height=640,width=512,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no");
},addToSametimeList:function(){
var _35=SemTagPerson.currentPerson.email.internet;
var fn_=encodeURIComponent(SemTagPerson.currentPerson.fn);
var fn=encodeURIComponent(fn_);
window.open(SemTagPerson.getPersonResolverUrl().replace("TOBEREPLACED",_35+"/"+fn),null,"height=640,width=512,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no");
},out:function(){
this.buffer="";
this.write=function(str){
this.buffer+=str;
};
},processHcards:function(_36){
if(SemTagSvcPortal.trace){
console.log("Inside processHcards of SemTagSerson and length of hcards is:"+(_36?_36.length:0));
}
if(!_36||_36.length==0){
return;
}
for(var i=0;i<_36.length;i++){
var _37=_36[i];
var _38=SemTagPerson.getNameElement(_37);
if(!_38){
continue;
}
if(SemTagSvcPortal.ifConnUrlExists=="true"&&!SemTagSvcPortal.isconnServerNew){
var _39=SemTagUtil.getHcardAttributeValue("email",_37);
if(!_39.internet){
var uid=SemTagUtil.getHcardAttributeValue("uid",_37);
if(!uid){
continue;
}
}
}
var _3a=_38.getAttribute(SemTagSvcPortal.liveElemPrefix+"id");
if(_3a&&SemTagSvcPortal.ifConnUrlExists=="false"){
if(SemTagPerson.activeElems[_3a]){
continue;
}else{
if(SemTagSvcPortal.trace){
SemTagUtil.log("Person.leid="+_3a+" being processed again!");
}
continue;
}
}
if(SemTagSvcPortal.ifConnUrlExists=="true"&&!SemTagSvcPortal.isconnServerNew){
var _3b=SemTagSvcPortal.getElementsByClassName("email",_37);
_3b=_3b||null;
if((_3b==null||_3b.length==0)&&SemTagSvcPortal.ifConnUrlExists=="true"&&SemTagSvcPortal.isconnServerNew===false){
console.info(SemTagPerson.nls.specify_email_if_connection+"Email is for user:"+uid);
}
}
if(SemTagSvcPortal.ifConnUrlExists=="true"&&SemTagSvcPortal.isconnServerNew){
if(SemTagSvcPortal.debug){
console.log("Beofore calling lconn.profiles.bizCard.bizCard.processTag");
}
try{
var _3c=SemTagSvcPortal.getElementsByClassName("userObjectId",_37);
if(SemTagSvcPortal.debug){
console.log("userObjectid element got is:"+_3c);
}
if(eval("window.lconn != null")==false||(lconn.profiles==null||lconn.profiles=="undefined")){
SemTagPerson.processUntilAvailable(SemTagPerson.processHcards,"window.lconn != null && !(lconn.profiles == null || lconn.profiles == 'undefined')",null,null,null,_36);
}else{
lconn.profiles.bizCard.bizCard.processTag(_38);
}
}
catch(e){
console.log("Connection server is probably down please check following resource is up:"+SemTagSvcPortalGlobal.connUrl+"/profiles/portalJS/portalBizCard.js");
console.log("Actual Error occured is:"+e);
return;
}
}
if(SemTagPerson.isInline(_37)){
var _3d={"target":_38};
SemTagPerson.requestPersonInfo(_3d);
}else{
var _3e=SemTagSvcPortal.getTextValue(_38);
var _3f=_3e.indexOf("click");
var _40=_3e.substring(0,_3f)+SemTagPerson.nls.hover_label+" "+SemTagMenu.nls.a11y_hover;
if(SemTagSvcPortal.ifConnUrlExists=="false"||(SemTagSvcPortal.ifConnUrlExists=="true"&&SemTagSvcPortal.isconnServerNew==false)){
if(SemTagSvcPortal.debug){
console.log("Adding hover for old business card case or no business card");
}
SemTagSvcPortal.addHover(_38,SemTagPerson.showHover,SemTagPerson.showMenu,_40);
}else{
if(SemTagSvcPortal.debug){
console.log("Inside  ifConnURLExistsnew"+SemTagSvcPortal.ifConnUrlExists+":"+SemTagSvcPortal.isconnServerNew);
}
var _41=_38.getAttribute(SemTagSvcPortal.refcntAttr);
if(_41){
_38.setAttribute(SemTagSvcPortal.refcntAttr,parseInt(Number(_41)+1));
}else{
_38.setAttribute(SemTagSvcPortal.refcntAttr,"1");
SemTagSvcPortal.hoverIdx++;
_38.setAttribute(SemTagSvcPortal.liveElemPrefix+"id",SemTagSvcPortal.hoverIdx);
}
}
_3a=_38.getAttribute(SemTagSvcPortal.liveElemPrefix+"id");
if(SemTagSvcPortal.debug){
console.log("in semtagperson leid got is:"+_3a);
}
if(_3a){
SemTagPerson.activeElems[_3a]=true;
}
}
}
},processUntilAvailable:function(_42,_43,_44,_45,_46,_47){
if(typeof (_42)!="function"){
return;
}
var _48=500;
var _49=20;
var _4a=true;
if(typeof (_45)=="number"){
_48=_45;
}
if(typeof (_46)=="number"){
_49=_46;
}
if(typeof (_44)=="boolean"){
_4a=_44;
}
var _4b="";
var _4c=0;
console.log("eval(test) is :"+eval(_43));
var _4d=Array.prototype.slice.call(arguments);
var _4e=_4d.shift();
var _4f=_4d.shift();
var _50=_4d.shift();
var _51=_4d.shift();
var _52=_4d.shift();
if(SemTagSvcPortal.trace){
console.log("shifted args length is:"+_4d.length+":"+_4d);
}
if(eval(_43)){
if(_47!=null){
_42.apply(null,Array.prototype.slice.call(_4d));
}else{
_42();
}
return;
}
if(SemTagSvcPortal.trace){
console.log("inside processUntilAvailable for time :"+_4c+":"+eval(_43)+":"+"clearing intervalid:"+_4b);
}
_4b=window.setInterval(function(){
_4c++;
if(SemTagSvcPortal.trace){
console.log("inside processUntilAvailable for time :"+_4c+":"+eval(_43)+":"+"clearing intervalid:"+_4b);
}
if(eval(_43)){
window.clearInterval(_4b);
if(_47!=null){
_42.apply(null,Array.prototype.slice.call(_4d));
}else{
_42();
}
}else{
if(_4c>=_49){
window.clearInterval(_4b);
if(_4a){
throw new Error("processUntilAvailable: test was never met: "+_43);
}
}
}
},_48);
},isInline:function(_53){
return SemTagUtil.getHcardAttributeValue(SemTagPerson.INLINE,_53);
},processMailtos:function(_54){
if(!_54||_54.length==0){
return;
}
while(_54.length>0){
var _55=_54.pop();
SemTagSvcPortal.watchEvent(_55,"mouseover",SemTagPerson.tagMouseover,false);
}
},hcardsAdded:function(_56){
if(SemTagSvcPortal.trace){
SemTagUtil.log("hcardsAdded");
}
if(SemTagSvcPortal.trace){
console.log("INside hcardsAdded length of nodes got it:"+SemTagSvcPortal.getNodes("hcard").length+":"+_56);
}
if(_56&&_56.length>0){
SemTagPerson.processHcards(_56);
}else{
SemTagPerson.processHcards(SemTagSvcPortal.getNodes("hcard"));
}
},hcardsAdded:function(){
if(SemTagSvcPortal.trace){
SemTagUtil.log("hcardsAdded");
}
if(SemTagSvcPortal.trace){
console.log("INside hcardsAdded length of nodes got it:"+SemTagSvcPortal.getNodes("hcard").length);
}
SemTagPerson.processHcards(SemTagSvcPortal.getNodes("hcard"));
},mailtosAdded:function(){
SemTagPerson.processMailtos(SemTagSvcPortal.getNodes("mailto"));
},showHover:function(_57){
if(SemTagSvcPortal.trace){
SemTagUtil.log("Person.showHover");
}
var _58=SemTagUtil.getHcardAttributeValue("X-person-inside-inline",SemTagSvcPortal.getLiveElementFromEvent(_57));
var _59=_58?null:SemTagPerson.nls.hover_label;
SemTagSvcPortal.showHover(_57,SemTagPerson.showMenu,_59);
return false;
},showMenu:function(_5a){
if(SemTagSvcPortal.trace){
SemTagUtil.log("Person.showMenu");
}
SemTagMenu.waitCursor();
SemTagMenu.stopEvent(_5a);
SemTagPerson.requestPersonInfo(_5a);
return false;
},renderCard:function(_5b){
var _5c=new BusinessCard.out();
BusinessCard.getMenuData(_5b,null,null,null,_5c);
if(SemTagSvcPortal.trace){
console.log("Inside renderCard"+_5c.buffer+":"+document.getElementById("businessCard"));
}
document.getElementById("businessCard").innerHTML=_5c.buffer;
},requestPersonInfo:function(_5d){
SemTagPerson.reqMethod.call(SemTagPerson,_5d);
},dispatch:function(_5e){
var _5f=(_5e.email&&_5e.email.internet)?_5e.email.internet:null;
if(_5f){
SemTagPerson.requestor.dispatch(_5f.toLowerCase(),_5e);
}
},requestReturn:function(_60,_61,_62){
if(SemTagSvcPortal.trace){
SemTagUtil.log("Person.requestReturn: "+_61+" ("+(_60?"success":"fail")+")");
}
var _63=_60?_61:SemTagPerson.emptyPerson();
if(_63){
var _64=SemTagSvcPortal.getLiveElementFromEvent(_62);
SemTagPerson.fillPersonJsonMoreFromDom(_63,_64);
SemTagPerson.update(_63,_64,_62);
}else{
SemTagMenu.defaultCursor();
}
},fillPersonJsonMoreFromDom:function(_65,_66){
if(SemTagSvcPortal.debug){
window.status="Person.fillPersonJsonMoreFromDom";
}
var _67=SemTagSvcPortal.findNameElementInHcard(_66);
if(_67){
var _68=SemTagSvcPortal.getTextValue(_67);
var _69=_68.indexOf("click");
if(_69>0){
_65.fn=_68.substring(0,_69);
}else{
_65.fn=SemTagSvcPortal.getTextValue(_67);
}
}
var _6a=SemTagPerson.getElementEmail(_66);
if(_6a){
_65.email={"internet":_6a};
}
var uid=SemTagUtil.getHcardAttributeValue("uid",_66);
if(uid){
_65.uid=uid;
}
var _6b=SemTagUtil.getHcardAttributeValue("userObjectId",_66);
if(SemTagSvcPortal.debug&&_65){
console.log("person.photo got is:"+_65.photoURL+(_65.photo&&_65.photo.length>0?"not null":"is not available"));
}
if(_65&&_65.photo&&_65.photo.length>0){
_65.photo=_65.photoURL;
SemTagPerson.showImage=true;
}else{
SemTagPerson.showImage=false;
}
if(!_65.tel||!_65.tel.voice){
var _6c=SemTagSvcPortal.findElementByNameInHcard(_66,"tel");
if(_6c){
var _6d=SemTagSvcPortal.getTypedValue(_6c,"voice");
_65.tel={"voice":_6d["voice"]};
}
}
var _6e=SemTagSvcPortal.findElementByNameInHcard(_66,"adr");
var _6f={};
if(_6e){
_6f=SemTagPerson.getAddressJson(_6e);
_65.adr=_6f;
}
if(typeof (_65.adr)!="undefined"&&(_65.adr.locality||_65.adr.countryname||_65.adr.region)){
if(!_65.X){
_65.X={};
}
var _70=_65.adr.locality+", "+_65.adr.region+" "+_65.adr.countryname;
_65.X.worklocation=_70.replace(/undefined/g,"");
}
if(typeof (SemTagAwrns)!="undefined"){
if(!_65.X){
_65.X={};
}
_65.X.imn=SemTagAwrns.getSametimeId(_66);
_65.X.ststatus=_67.getAttribute("semtag_ststatus");
}
},emptyPerson:function(){
return {"fn":"","email":{"internet":""}};
},update:function(_71,_72,_73){
if(SemTagSvcPortal.trace){
SemTagUtil.log("Person.update");
}
SemTagPerson.currentPerson=_71;
var _74=SemTagSvcPortal.getParentByClassName("vcard",_72);
var _75=SemTagUtil.getHcardAttributeValue("X-person-header-only",_74);
if(_75){
_71._headeronly=true;
}
SemTagPerson.readHcardContext(_74,_71);
SemTagSvcPortal.setSemanticTagValue("hcard",_72,_71);
if(SemTagPerson.isInline(_74)){
var out=new SemTagPerson.out();
SemTagPerson.getInlineMarkup(_71,SemTagSvcPortal.bidi,out);
_74.innerHTML=out.buffer;
var _76=SemTagUtil.getNodeClassValue(_74);
SemTagUtil.setNodeClassValue(_74,_76.replace(/vcard/,"vcard-done"));
if(_75){
var _77=SemTagSvcPortal.getElementsByClassName("vcard",_74,1);
if(_77){
SemTagPerson.processHcards(_77);
}
}
}else{
var _78=new Array();
var _79="personMenuActions";
var _7a=new SemTagPerson.out();
var _7b=new SemTagPerson.out();
SemTagPerson.getMarkup(_71,SemTagSvcPortal.bidi,_78,_79,_7a,_7b);
var _7c=(typeof (_71.email)!="undefined"&&_71.email.internet)?_71.email.internet:null;
SemTagSvcPortal.setMenuData(_73,_78,_79,SemTagSvcPortal.getMenuHeaderJson(_7a.buffer,"text/html",-100),SemTagSvcPortal.getMenuFooterJson(_7b.buffer,"text/html",-100));
if(SemTagSvcPortal.trace){
console.log("values are in update of semtagperson:"+SemTagSvcPortal.ifConnUrlExists+":"+(SemTagSvcPortal.isconnServerNew===false));
}
if(SemTagSvcPortal.ifConnUrlExists=="true"&&(SemTagSvcPortal.isconnServerNew===false)&&_7c!=null){
if(eval("window.BusinessCard != null")==false){
SemTagPerson.processUntilAvailable(BusinessCard.getProfileInfo,"(window.BusinessCard != null)",null,null,null,true,"SemTagPerson.renderCard",_7c);
}else{
BusinessCard.getProfileInfo(true,"SemTagPerson.renderCard",_7c);
}
}
}
},readHcardContext:function(_7d,_7e){
var _7f=SemTagUtil.getHcardAttributeValue("X-person-inside-inline",_7d);
if(_7f){
_7e._inline=true;
}
var _80=SemTagUtil.getHcardAttributeValue("X-person-inside-profile",_7d);
if(_80){
_7e._inprofile=true;
}
var _81=SemTagUtil.getHcardAttributeValue("X-person-profile-inplace",_7d);
if(_81){
_7e._profileinplace=true;
}
},getElementEmail:function(_82){
if(!_82){
alert("getElementEmail called with: "+_82);
}
var _83;
var _84=SemTagSvcPortal.getParentByClassName("vcard",_82);
if(_84){
_83=SemTagUtil.getHcardAttributeValue("email",_84);
_83=_83.internet;
}else{
if(_82.tagName=="A"&&_82.href.match(/^mailto:/)){
_83=_82.href.replace(/^mailto:/,"");
}
}
return _83;
},getNameElement:function(_85){
try{
if(_85.className!="vcard"){
_85=SemTagSvcPortal.getParentByClassName("vcard",_85);
}
var _86=SemTagSvcPortal.getElementsByClassName("fn",_85,1)[0];
if(!_86){
_86=SemTagSvcPortal.getElementsByClassName("n",_85,1)[0];
}
return _86;
}
catch(e){
if(SemTagSvcPortal.debug){
alert(e);
}
}
return null;
},getAddressJson:function(_87){
var _88={"postofficebox":"","streetaddress":"","locality":"","region":"","postalcode":"","countryname":""};
var _89=_87;
if(_89.className!="adr"){
_89=SemTagSvcPortal.getParentByClassName("adr",_87);
}
if(_89){
var _8a=_89.childNodes;
for(var i=0;i<_8a.length;i++){
SemTagPerson.readAddressInfo(_8a[i],_88);
}
}else{
_88.streetaddress="5 Technology Park Drive";
_88.locality="Westford";
_88.region="MA";
_88.postalcode="01886";
_88.countryname="USA";
}
return _88;
},readAddressInfo:function(_8b,_8c){
var _8d=_8b.childNodes;
if(_8d){
for(var i=0;i<_8d.length;i++){
SemTagPerson.readAddressInfo(_8d[i],_8c);
}
}
if(_8b.className!=null){
var cn=_8b.className;
if(cn.match(/(^|\s)post-office-box(\s|$)/i)){
_8c.postofficebox=SemTagSvcPortal.getTextValue(_8b);
}else{
if(cn.match(/(^|\s)extenodeed-address(\s|$)/i)){
_8c.extenodeedaddress=SemTagSvcPortal.getTextValue(_8b);
}else{
if(cn.match(/(^|\s)street-address(\s|$)/i)){
_8c.streetaddress=SemTagSvcPortal.getTextValue(_8b);
}else{
if(cn.match(/(^|\s)locality(\s|$)/i)){
_8c.locality=SemTagSvcPortal.getTextValue(_8b);
}else{
if(cn.match(/(^|\s)region(\s|$)/i)){
_8c.region=SemTagSvcPortal.getTextValue(_8b);
}else{
if(cn.match(/(^|\s)postal-code(\s|$)/i)){
_8c.postalcode=SemTagSvcPortal.getTextValue(_8b);
}else{
if(cn.match(/(^|\s)country-name(\s|$)/i)){
_8c.countryname=SemTagSvcPortal.getTextValue(_8b);
}
}
}
}
}
}
}
}
},existsInObject:function(_8e,_8f){
var _90=_8f.split(".");
var _91=_8e;
var _92=true;
for(var i=0;i<_90.length;i++){
var _93;
if(_90[i].indexOf("(")>-1){
_93=_90[i].substr(0,_90[i].indexOf("("));
}else{
_93=_90[i];
}
if(_91[_93]){
_91=_91[_93];
}else{
_92=false;
break;
}
}
return _92;
},executeJSTargetInFrame:function(_94){
if(_94.indexOf("javascript:")>-1){
var _95=_94.substr(("javascript:".length));
var _96=window;
if(!SemTagPerson.existsInObject(window,_95)){
for(var i=0;i<parent.frames.length;i++){
if(SemTagPerson.existsInObject(parent.frames[i],_95)){
_96=parent.frames[i];
break;
}
}
}else{
}
_96.eval(_94);
}else{
}
}};
function getTagFromServer(_97){
var _98=SemTagSvcPortal.getLiveElementFromEvent(_97);
var _99=SemTagPerson.getElementEmail(_98);
if(_99){
_99=_99.toLowerCase();
var src=SemTagPerson.servletUrl.replace(/@@@EMAIL@@@/,_99);
if(SemTagSvcPortal.debug){
window.status="Person.getTagFromServer sending request for: "+_99+")";
}
SemTagPerson.requestor.request(src,6000,SemTagPerson.requestReturn,_98,_99);
}else{
if(SemTagSvcPortal.debug){
alert("getTagFromServer couldn't find the e-mail");
}
var evt={"target":_98};
SemTagPerson.requestReturn(false,null,evt);
}
};
function callUserProfileServlet(_9a){
if(SemTagSvcPortal.trace){
SemTagUtil.log("callUserProfileServlet");
}
var _9b="";
var _9c=SemTagSvcPortal.getLiveElementFromEvent(_9a);
var _9d="";
var _9e=SemTagPerson.getElementEmail(_9c);
if(_9e){
_9d="ibm-primaryEmail="+_9e;
}
var uid=SemTagUtil.getHcardAttributeValue("uid",_9c);
if(uid){
_9d="identifier="+uid;
}
_9b=SemTagUtil.getHcardAttributeValue("userObjectId",_9c);
var xml=null;
try{
if(0<_9b.length){
SemTagPerson.servletUrlForObjectId=SemTagPerson.servletUrlForObjectId.replace("@@@AVAILATTRIBUTES@@@",SemTagSvcPortal.availAttribStr);
xml=ibm.portal.xml.loadXml(SemTagPerson.servletUrlForObjectId.replace(/@@@UserObjectID@@@/,_9b));
}else{
if(uid&&uid.length>0){
SemTagPerson.servletUrlForUID=SemTagPerson.servletUrlForUID.replace("@@@AVAILATTRIBUTES@@@",SemTagSvcPortal.availAttribStr);
try{
xml=ibm.portal.xml.loadXml(SemTagPerson.servletUrlForUID.replace("@@@QUERY@@@",_9d));
}
catch(er){
if(SemTagSvcPortal.debug){
console.info("Person.callUserProfileServlet Error caught is: "+er);
}
if(uid.indexOf("uid=")==0){
_9d=uid;
}else{
_9d="uid="+uid;
}
SemTagPerson.servletUrl=SemTagPerson.servletUrl.replace("@@@AVAILATTRIBUTES@@@",SemTagSvcPortal.availAttribStr);
xml=ibm.portal.xml.loadXml(SemTagPerson.servletUrl.replace(/@@@QUERY@@@/,_9d));
}
}else{
SemTagPerson.servletUrl=SemTagPerson.servletUrl.replace("@@@AVAILATTRIBUTES@@@",SemTagSvcPortal.availAttribStr);
xml=ibm.portal.xml.loadXml(SemTagPerson.servletUrl.replace(/@@@QUERY@@@/,_9d));
}
}
}
catch(e){
if(SemTagSvcPortal.debug){
console.info("Person.callUserProfileServlet caught: "+e);
}
}
if(xml){
if(0<_9b.length){
var xsl=ibm.portal.xml.loadXsl(SemTagSvcPortalGlobal.contextUrl+"/xsl/UserAtomByIdToPersonJson.xsl");
}else{
var xsl=ibm.portal.xml.loadXsl(SemTagSvcPortalGlobal.contextUrl+"/xsl/UserAtomToPersonJson.xsl");
}
var _9f=ibm.portal.xml.transform(xml,xsl,null,null,true);
if(SemTagSvcPortal.trace){
SemTagUtil.log(_9f);
}
var _a0=eval(_9f)[0];
if(SemTagSvcPortal.trace){
console.log("Person got is:"+_a0);
}
if(!_a0&&!_a0.fn){
_a0=SemTagPerson.emptyPerson();
}
if(SemTagSvcPortal.trace){
console.log("person.photo is:"+_a0.photo);
}
SemTagPerson.fillPersonJsonMoreFromDom(_a0,_9c);
SemTagPerson.update(_a0,_9c,_9a);
return;
}else{
if(SemTagSvcPortal.trace){
SemTagUtil.log("bad XML");
}
}
var evt={"target":_9c};
SemTagPerson.requestReturn(false,null,evt);
};
SemTagPerson.init();


var SemTagAwrns={SVCNAME:"sametime",hcards:new Array(),activeElems:[],hasApplet:false,imIds:SemTagSvcPortalGlobal.preferredImIds,st:"",samtimeIconRequired:false,init:function(){
SemTagSvcPortal.setCallback(SemTagAwrns.SVCNAME,SemTagAwrns.hcardsAdded);
SemTagAwrns.processHcards(SemTagSvcPortal.getNodes(SemTagAwrns.SVCNAME));
},hcardsAdded:function(){
SemTagAwrns.processHcards(SemTagSvcPortal.getNodes(SemTagAwrns.SVCNAME));
},processHcards:function(_1){
_1=_1||null;
if(SemTagSvcPortal.debug){
console.log("in processHcards hcards got is"+_1);
}
if(_1==null){
return;
}
SemTagSvcPortal.sametimeSTProxy=(typeof (stproxy)!=="undefined");
SemTagSvcPortal.sametimeSTLinks=((typeof (stproxy)==="undefined")&&(typeof (prepareSametimeLink)!=="undefined"));
SemTagSvcPortal.sametimeNotIntegrated=((typeof (stproxy)==="undefined")&&(typeof (prepareSametimeLink)==="undefined"));
if(SemTagSvcPortal.debug){
console.log("Inside processHCards SemTagSvcPortal.sametimeSTProxy:"+SemTagSvcPortal.sametimeSTProxy+":"+SemTagSvcPortal.sametimeNotIntegrated+":"+SemTagSvcPortal.sametimeSTLinks);
}
if(SemTagSvcPortal.debug){
console.log("Inside processHCards SemTagSvcPortal.sametimeSTProxy:"+(typeof (stproxy)!=="undefined")+":"+((typeof (stproxy)==="undefined")&&(typeof (prepareSametimeLink)!=="undefined"))+":"+((typeof (stproxy)==="undefined")&&(typeof (prepareSametimeLink)==="undefined")));
}
if(!SemTagSvcPortal.sametimeSTProxy&&!SemTagSvcPortal.sametimeSTLinks){
if(SemTagSvcPortal.debug){
console.info("stproxy and stlinks both are not available,person awareness will not be available");
}
return;
}else{
if(SemTagSvcPortal.debug){
console.info("Sametime is connected to Portal");
}
}
SemTagAwrns.hcards=[];
SemTagAwrns.hcards=_1;
if(SemTagSvcPortal.sametimeSTProxy){
stproxy.addOnLoad(function(){
var _2=SemTagAwrns.hcards;
if(SemTagSvcPortal.debug){
console.log("Hcards got is:"+_2);
}
for(var i=0;i<_2.length;i++){
var _3=_2[i];
if(SemTagAwrns.disabled(_3)){
continue;
}
var _4=SemTagSvcPortal.findNameElementInHcard(_3);
if(SemTagSvcPortal.debug){
console.log("fnElem got is:"+_4);
}
if(!_4){
continue;
}
var _5=_4.getAttribute(SemTagSvcPortal.liveElemPrefix+"id");
if(SemTagSvcPortal.debug){
console.log("leid got is:"+_5+":"+SemTagAwrns.activeElems[_5]);
}
if(_5==null){
continue;
}
if(_5&&SemTagAwrns.activeElems[_5]){
continue;
}
var _6=SemTagAwrns.getSametimeId(_3);
var _7=SemTagUtil.getHcardAttributeValue("X-sametime-resolve",_3);
if(!_7){
if(SemTagSvcPortal.debug){
console.log("resolve is "+_7+" so continuing");
}
continue;
}
var _8=document.createElement("span");
var _9=SemTagUtil.getHcardAttributeValue("x-sametime-no-icon",_3);
SemTagAwrns.samtimeIconRequired=false;
if(_9){
SemTagAwrns.samtimeIconRequired=true;
}
var _a=stproxy.getLiveNameModel(_6,{"isInBuddyList":false,"forceWatchlist":true});
_a.portalId=_6;
if(SemTagSvcPortal.debug){
console.log("Model got for id:"+_6+": is :"+_a);
}
var _b=SemTagAwrns.getStatus(_a.status);
if(_4){
_4.setAttribute("semtag_ststatus",_b);
}
if(SemTagSvcPortal.debug){
console.log("semtag_ststatus variable set to :"+_b);
}
if(!(SemTagAwrns.samtimeIconRequired)){
var _c=document.createElement("img");
_c.id=i;
_c.imgId=_a.id;
SemTagAwrns.setSametimeIconSrc(_a,_c,stproxy);
_8.appendChild(_c);
_8.setAttribute("class","sametimeawarenessicon");
_8.className+=" sametimeawarenessicon";
_4.parentNode.insertBefore(_8,_4);
}
if(stproxy.hitch&&stproxy.hitch.connect){
if(SemTagSvcPortal.debug){
console.log("Inside stproxy.hitch way:");
}
stproxy.hitch.connect(_a,"onUpdate",SemTagAwrns.updateSTProxy);
}else{
if(SemTagSvcPortal.debug){
console.log("Inside non stproxy.hitch way:");
}
_a.onUpdate=SemTagAwrns.updateSTProxy;
}
if(_5){
SemTagAwrns.activeElems[_5]=true;
}
}
});
}
if(SemTagSvcPortal.sametimeSTLinks){
if(SemTagSvcPortal.debug){
console.log("Hcards got is:"+_1);
}
for(var i=0;i<_1.length;i++){
var _d=_1[i];
if(SemTagAwrns.disabled(_d)){
continue;
}
SemTagAwrns.hcards=[];
SemTagAwrns.hcards.push(_d);
var _e=SemTagSvcPortal.findNameElementInHcard(_d);
if(SemTagSvcPortal.debug){
console.log("fnElem got is:"+_e);
}
if(!_e){
continue;
}
var _f=_e.getAttribute(SemTagSvcPortal.liveElemPrefix+"id");
if(SemTagSvcPortal.debug){
console.log("leid got is:"+_f+":"+SemTagAwrns.activeElems[_f]);
}
if(_f==null){
continue;
}
if(_f&&SemTagAwrns.activeElems[_f]){
continue;
}
var _10=SemTagAwrns.getSametimeId(_d);
var _11=SemTagUtil.getHcardAttributeValue("X-sametime-resolve",_d);
if(_11){
var _12=document.createElement("span");
}
if(SemTagSvcPortal.sametimeSTLinks&&_11){
var od=SemTagUtil.getOwnerDocument(_d);
if(od.location!=document.location){
var f=SemTagUtil.getFrameElement(_d);
if(f){
if(f.id=="wpsFLY_flyoutIFrame"){
continue;
}
}
}
_12.style.verticalAlign="text-top";
}
if(SemTagSvcPortal.sametimeSTLinks&&_11){
st=prepareSametimeLink(_10,"",_11,"text:no;");
if(SemTagSvcPortal.debug){
console.log("ST got is:"+st);
}
_12.innerHTML=st;
_e.parentNode.insertBefore(_12,_e);
}
if(_f){
SemTagAwrns.activeElems[_f]=true;
}
}
}
},setSametimeIconSrc:function(_13,_14,_15){
if(_13.status>=_15.awareness.OFFLINE&&_13.status<=_15.awareness.IN_MEETING_MOBILE){
switch(_13.status){
case 0:
_14.src=_15.uiControl.iconPaths.iconOffline;
break;
case 1:
_14.src=_15.uiControl.iconPaths.iconAvailable;
_14.onclick=function(){
SemTagAwrns.openChat(_14.imgId,_13);
};
break;
case 4:
case 2:
_14.src=_15.uiControl.iconPaths.iconAway;
_14.onclick=function(){
SemTagAwrns.openChat(_14.imgId,_13);
};
break;
case 3:
_14.src=_15.uiControl.iconPaths.iconDnd;
break;
case 5:
_14.src=_15.uiControl.iconPaths.iconInMeeting;
_14.onclick=function(){
SemTagAwrns.openChat(_14.imgId,_13);
};
break;
case 6:
_14.src=_15.uiControl.iconPaths.iconAvailableMobile;
_14.onclick=function(){
SemTagAwrns.openChat(_14.imgId,_13);
};
break;
case 7:
_14.src=_15.uiControl.iconPaths.iconAwayMobile;
_14.onclick=function(){
SemTagAwrns.openChat(_14.imgId,_13);
};
break;
case 8:
_14.src=_15.uiControl.iconPaths.iconDndMobile;
break;
case 9:
_14.src=_15.uiControl.iconPaths.iconAwayMobile;
_14.onclick=function(){
SemTagAwrns.openChat(_14.imgId,_13);
};
break;
case 10:
_14.src=_15.uiControl.iconPaths.iconInMeetingMobile;
_14.onclick=function(){
SemTagAwrns.openChat(_14.imgId,_13);
};
break;
default:
_14.src=_15.NOT_USING;
break;
}
_14.title=_13.statusMessage;
_14.alt=_13.statusMessage;
}
},disabled:function(_16){
return SemTagUtil.getHcardAttributeValue("X-no-awareness",_16);
},getSametimeId:function(_17){
var _18=null;
for(var i=0;i<SemTagAwrns.imIds.length;i++){
var _19=SemTagSvcPortal.findElementByNameInHcard(_17,SemTagAwrns.imIds[i]);
if(_19){
_18=SemTagSvcPortal.getTextValue(_19);
if(0<_18.length){
break;
}
}
}
return _18;
},updateST:function(_1a){
var _1b=_1a.split(";");
var _1c=_1b[0];
var _1d=_1b[1];
if(SemTagSvcPortal.debug){
console.log("INside updateST"+_1a);
}
for(var i=0;i<SemTagAwrns.hcards.length;i++){
var vc=SemTagAwrns.hcards[i];
var _1e=SemTagAwrns.getSametimeId(vc);
if(_1e==_1c){
var _1f=SemTagSvcPortal.findNameElementInHcard(vc);
if(_1f){
_1f.setAttribute("semtag_ststatus",_1d);
}
}
}
},updateSTProxy:function(){
if(SemTagSvcPortal.debug){
console.log("Update getting called for :stid"+this.id+":portalid:"+this.portalId+":status:"+this.status);
}
var _20=SemTagAwrns.getStatus(this.status);
for(var i=0;i<SemTagAwrns.hcards.length;i++){
var vc=SemTagAwrns.hcards[i];
var _21=SemTagAwrns.getSametimeId(vc);
if(_21.toLowerCase()==this.portalId.toLowerCase()){
if(SemTagSvcPortal.debug){
console.log("Doing Update for :stid"+this.id+":portalid:"+this.portalId+":status:"+this.status);
}
var _22=SemTagSvcPortal.findNameElementInHcard(vc);
if(_22){
_22.setAttribute("semtag_ststatus",_20);
}
var _23=SemTagUtil.getHcardAttributeValue("x-sametime-no-icon",vc);
SemTagAwrns.samtimeIconRequired=false;
if(_23){
SemTagAwrns.samtimeIconRequired=true;
}
if(!(SemTagAwrns.samtimeIconRequired)){
var _24=SemTagSvcPortal.getElementsByClassName("sametimeawarenessicon",vc);
var _25=_24!=null||_24.length>0?_24[0]:null;
if(_25){
icon=_25.firstChild;
SemTagAwrns.setSametimeIconSrc(this,icon,stproxy);
}else{
if(SemTagSvcPortal.debug){
console.log("Awareness span does not exist should not be possible"+vc+":"+this.id);
}
}
}
}
}
},getStatus:function(_26){
var val="";
switch(_26){
case 0:
val="offline";
break;
case 1:
val="online";
break;
case 2:
val="away";
break;
case 3:
val="donotdisturb";
break;
case 4:
val="away";
break;
case 5:
val="meeting";
break;
default:
val="offline";
break;
}
return val;
},openCall:function(_27){
if(stproxy.policies.get(stproxy.policies.TCSPI)){
stproxy.call.byId(_27);
}
},openInstantMeeting:function(_28){
if(stproxy.policies.get(stproxy.policies.DISABLE_MEETING_INVITATION)){
stproxy.createMeeting(_28);
}
},openSendAnnouncement:function(_29){
if(stproxy.policies.get(stproxy.policies.ALLOW_ANNOUNCEMENT)){
stproxy.createAnnouncement(_29);
}
},openAddToContacts:function(_2a){
stproxy.createAdder(_2a);
},openChat:function(_2b,_2c){
if(SemTagSvcPortal.debug){
console.info("Opening chat with: "+_2b+":"+SemTagSvcPortal.sametimeSTLinks+":"+SemTagSvcPortal.sametimeSTProxy);
}
if(SemTagSvcPortal.sametimeSTLinks){
STLinksCreateIM(_2b);
}
if(SemTagSvcPortal.sametimeSTProxy){
if(_2c==null){
_2c=stproxy.getLiveNameModel(_2b,{"isInBuddyList":false,"forceWatchlist":true});
}
if(SemTagSvcPortal.debug){
console.info("Opening chat with: imId,modelid"+_2b+":"+_2c.id);
}
stproxy.openChat(_2c.id);
}
}};
if(typeof wps_userStatusFuncs=="undefined"){
wps_userStatusFuncs=new Object();
}
wps_userStatusFuncs["STLinksUserStatusChanged_SA"]=0;
if(typeof wps_loggedInFuncs=="undefined"){
wps_loggedInFuncs=new Object();
}
wps_loggedInFuncs["STLinksLoggedIn_SA"]=0;
if(typeof wps_appletStartedFuncs=="undefined"){
wps_appletStartedFuncs=new Object();
}
wps_appletStartedFuncs["STLinksAppletStarted_SA"]=0;
function STLinksUserStatusChanged_SA(_2d,_2e,_2f,_30,_31){
var val="";
if(SemTagSvcPortal.debug){
console.log("STLinksUserStatusChanged_SA status got is : "+_2d+";"+_2f+":"+(typeof _2f));
}
switch(_2f){
case 32:
val="online";
break;
case 64:
val="away";
break;
case 554:
val="online";
break;
case 96:
val="away";
break;
case 608:
val="away";
break;
case 128:
val="donotdisturb";
break;
default:
val="offline";
break;
}
var arg=_2d+";"+val;
if(SemTagSvcPortal.debug){
console.log("STLinksUserStatusChanged_SA status got is Final : "+arg);
}
if(SemTagSvcPortal.sametimeSTLinks){
SemTagAwrns.updateST(arg);
}
};
function STLinksAppletStarted_SA(){
if(SemTagSvcPortal.debug){
alert("Applet Started!");
}
SemTagAwrns.hasApplet=true;
};
function STLinksLoggedIn_SA(id,_32){
if(SemTagSvcPortal.debug){
alert("Logged In: "+id+", "+_32);
}
};
window.setTimeout(SemTagAwrns.init,SemTagSvcPortal.DELAY);


	
var SemTagC2A={serviceId:"c2a",sourceTagName:"c2a:source",typeNameTagName:"c2a:typename",valueTagName:"c2a:value",displayTagName:"c2a:display",anchorTagName:"c2a:anchor",targetTagName:"c2a:target",menulabelTagName:"c2a:action-label",paramTagName:"c2a:action-param",defaultNameSpaceStr:"IBM_C2A_DEFAULT_NAMESPACE",namespaceSep:"#",liveObjectNamespace:"http://www.ibm.com/xmlns/prod/websphere/portal/v6.1/livetext",targetsAvail:null,targetNodeIDs:new Object(),sourceNodeIDs:new Object(),currentValue:"",currentValArray:null,IDctr:0,c2aIdBaseStr:"IBMC2ASRVC_",c2aSourceIdBase:"IBMC2ASRVC_Source_",c2aTargetIdBase:"IBMC2ASRVC_Target_",nls:{"c2a_click_for_actions":SemTagSvcPortalGlobal.c2a_click_for_actions},init:function(){
if(!window.ibm){
window.ibm=new Object();
}
if(!window.ibm.portal){
window.ibm.portal=new Object();
}
window.ibm.portal.c2a=new Object();
for(var i=0;i<parent.frames.length;i++){
if(SemTagC2A.canAccessFrameContent(parent.frames[i])){
if(!parent.frames[i].ibm){
parent.frames[i].ibm=new Object();
}
if(!parent.frames[i].ibm.portal){
parent.frames[i].ibm.portal=new Object();
}
parent.frames[i].ibm.portal.c2a=new Object();
}
}
SemTagC2A.defineRegExpressions();
SemTagSvcPortal.setCallback(SemTagC2A.serviceId,SemTagC2A.parseDOM);
SemTagSvcPortal.setSpecialMenuProvider(SemTagC2A.getSpecialC2AMenuItems);
SemTagC2A.parseDOM();
},getSpecialC2AMenuItems:function(_1){
var _2=null;
try{
var _3=_1;
var _4=_1.parentNode;
var _5=SemTagSvcPortal.getSemanticTagValues(_1);
for(var _6 in _5){
var _7=_5[_6];
if(!_7){
continue;
}
_2=SemTagC2A.getTargetMenuItems(SemTagC2A.getSpecialC2ASourceInfo(_6,_7));
}
}
catch(e){
if(SemTagSvcPortal.trace){
SemTagUtil.log("error getting special c2a menu items, exception is "+e);
}
}
return _2;
},showHover:function(_8){
SemTagSvcPortal.showHover(_8,SemTagC2A.handleClick,SemTagC2A.nls.c2a_click_for_actions);
},canAccessFrameContent:function(_9){
var _a=false;
try{
if(window.location.host==_9.location.host&&window.location.protocol==_9.location.protocol){
_a=true;
}
}
catch(err){
}
return _a;
},findElementInWindowScope:function(_b){
var _c;
_c=document.getElementById(_b);
if(_c==null){
for(var i=0;i<parent.frames.length;i++){
if(SemTagC2A.canAccessFrameContent(parent.frames[i])){
_c=frames[i].document.getElementById(_b);
if(_c!=null){
break;
}
}
}
}
return _c;
},handleClick:function(_d){
if(!window.ibm){
window.ibm=new Object();
}
if(!window.ibm.portal){
window.ibm.portal=new Object();
}
window.ibm.portal.c2a=new Object();
for(var i=0;i<parent.frames.length;i++){
if(SemTagC2A.canAccessFrameContent(parent.frames[i])){
if(!parent.frames[i].ibm){
parent.frames[i].ibm=new Object();
}
if(!parent.frames[i].ibm.portal){
parent.frames[i].ibm.portal=new Object();
}
parent.frames[i].ibm.portal.c2a=new Object();
}
}
var _e=SemTagSvcPortal.getLiveElementFromEvent(_d);
if(!SemTagC2A.isSource(_e)){
var _f=SemTagSvcPortal.getParentByClassName(SemTagC2A.sourceTagName,_e);
}
SemTagC2A.generateMenuContents(_d,_f);
},parseDOM:function(){
SemTagC2A.processDomNodes(SemTagSvcPortal.getNodes(SemTagC2A.serviceId));
SemTagC2A.processSources(SemTagC2A.sourceNodeIDs);
},processDomNodes:function(_10){
for(var _11 in SemTagC2A.sourceNodeIDs){
if(!SemTagC2A.findElementInWindowScope(_11)){
delete SemTagC2A.sourceNodeIDs[_11];
}
}
for(var _11 in SemTagC2A.targetNodeIDs){
if(!SemTagC2A.findElementInWindowScope(_11)){
delete SemTagC2A.targetNodeIDs[_11];
}
}
while(_10&&_10.length>0){
var _12=_10.pop();
var _13=_12.id;
if(_13!=null&&(SemTagC2A.exists(SemTagC2A.sourceNodeIDs,_13)||SemTagC2A.exists(SemTagC2A.targetNodeIDs,_13))){
continue;
}
if(SemTagC2A.isSource(_12)){
if(_12.id==null||_12.id==""){
_12.id=SemTagC2A.c2aSourceIdBase+SemTagC2A.IDctr;
SemTagC2A.IDctr++;
}
SemTagC2A.sourceNodeIDs[_12.id]="true";
}else{
if(SemTagC2A.isTarget(_12)){
if(_12.id==null||_12.id==""){
_12.id=SemTagC2A.c2aTargetIdBase+SemTagC2A.IDctr;
SemTagC2A.IDctr++;
}
SemTagC2A.targetNodeIDs[_12.id]="true";
}
}
}
SemTagC2A.updateAvailableTargets();
},exists:function(_14,_15){
if(_14[_15]&&_14[_15]=="true"){
return true;
}
return false;
},processSources:function(_16){
for(var _17 in _16){
var _18=SemTagC2A.findElementInWindowScope(_17);
var _19=SemTagC2A.getSourceInfo(_18);
var _1a=SemTagC2A.isTargetDefined(_19);
if(_19.value==null||_19.value==""){
if(SemTagSvcPortal.trace){
SemTagUtil.log("Click-to-Action error: Missing c2a:value tag");
}
break;
}
var _1b=_19.anchorNode.getAttribute("hasHover");
if(_1a||_19.display!=""){
if(_1b==null||_1b=="false"){
SemTagSvcPortal.addHover(_19.anchorNode,SemTagC2A.showHover,SemTagC2A.handleClick);
_19.anchorNode.setAttribute("hasHover","true");
}
}else{
if(_1b=="true"){
SemTagSvcPortal.removeHover(_19.anchorNode,SemTagC2A.showHover,SemTagC2A.handleClick);
}
_19.anchorNode.setAttribute("hasHover","false");
}
}
},defineRegExpressions:function(){
SemTagC2A.sourceRegExp=new RegExp("(^|\\s)"+SemTagC2A.sourceTagName+"(\\s|$)");
SemTagC2A.typeNameRegExp=new RegExp("(^|\\s)"+SemTagC2A.typeNameTagName+"(\\s|$)");
SemTagC2A.valueRegExp=new RegExp("(^|\\s)"+SemTagC2A.valueTagName+"(\\s|$)");
SemTagC2A.displayRegExp=new RegExp("(^|\\s)"+SemTagC2A.displayTagName+"(\\s|$)");
SemTagC2A.anchorRegExp=new RegExp("(^|\\s)"+SemTagC2A.anchorTagName+"(\\s|$)");
SemTagC2A.targetRegExp=new RegExp("(^|\\s)"+SemTagC2A.targetTagName+"(\\s|$)"),SemTagC2A.menulabelRegExp=new RegExp("(^|\\s)"+SemTagC2A.menulabelTagName+"(\\s|$)");
SemTagC2A.paramRegExp=new RegExp("(^|\\s)"+SemTagC2A.paramTagName+"(\\s|$)");
},isTarget:function(_1c){
if(_1c.tagName=="FORM"){
return (SemTagUtil.getNodeClassValue(_1c).match(SemTagC2A.targetRegExp));
}else{
return false;
}
},isSource:function(_1d){
if(_1d.tagName=="SPAN"||_1d.tagName=="DIV"){
return (SemTagUtil.getNodeClassValue(_1d).match(SemTagC2A.sourceRegExp));
}else{
return false;
}
},updateAvailableTargets:function(){
SemTagC2A.targetsAvail=null;
SemTagC2A.targetsAvail=new Array();
for(var _1e in SemTagC2A.targetNodeIDs){
var _1f=SemTagC2A.findElementInWindowScope(_1e);
var _20=_1f.childNodes;
var _21=null;
var _22=null;
for(var i=0;i<_20.length;i++){
var _23=_20[i];
var _24=SemTagUtil.getNodeClassValue(_23);
if(_24==""){
continue;
}
if(_24.match(SemTagC2A.typeNameRegExp)){
var _25=SemTagC2A.getElementValue(_23);
var _26=SemTagC2A.parseTypeName(_25);
_21=_26.namespace;
_22=_26.type;
if(_22!=null){
if(_21==null){
_21=SemTagC2A.defaultNameSpaceStr;
}
if(typeof (SemTagC2A.targetsAvail[_21])=="undefined"){
SemTagC2A.targetsAvail[_21]=new Array();
}
SemTagC2A.targetsAvail[_21][_22]=true;
}
}
}
}
},parseTypeName:function(_27){
var _28=null;
var _29=null;
var _2a=_27.indexOf(SemTagC2A.namespaceSep);
if(_2a<0){
_28=SemTagC2A.defaultNameSpaceStr;
_29=_27;
}else{
_28=_27.substring(0,_2a);
_29=_27.substring(_2a+1);
}
if(_28==SemTagC2A.liveObjectNamespace){
var _2b=_29.indexOf(".");
if(_2b>0){
var _2c=_29.substring(_2b+1);
_29=_29.substring(0,_2b);
return {"namespace":_28,"type":_29,"selector":_2c};
}
}
return {"namespace":_28,"type":_29};
},isTargetDefined:function(_2d){
var _2e=false;
for(var i=0;i<_2d.typenames.length;i++){
if(!_2d.typenames[i].namespace||_2d.typenames[i].namespace==""){
_2d.typenames[i].namespace=SemTagC2A.defaultNameSpaceStr;
}
if(typeof (SemTagC2A.targetsAvail[_2d.typenames[i].namespace])!="undefined"){
var _2f=SemTagC2A.targetsAvail[_2d.typenames[i].namespace][_2d.typenames[i].type];
_2e=(typeof (_2f)!="undefined"&&_2f?true:false);
}
if(_2e==true){
return _2e;
}
}
return false;
},isTargetSourceMatch:function(_30,_31){
var _32;
var _33;
for(var i=0;i<_30.typenames.length;i++){
_32=_30.typenames[i];
for(var j=0;j<_31.typenames.length;j++){
_33=_31.typenames[j];
if(_32.namespace==_33.namespace){
if(_32.namespace==SemTagC2A.liveObjectNamespace){
var _34;
if(_33.selector){
_34=SemTagC2A.selectSubField(_30.value,_31.selector);
}else{
_34=_30.value;
}
if(_34&&_34!=null&&_34!=""){
return true;
}
}else{
if(_32.type==_33.type){
return true;
}
}
}
}
}
return false;
},getElementValue:function(_35){
var _36;
if(SemTagUtil.getNodeClassValue(_35).match(SemTagC2A.displayRegExp)){
_36=_35.innerHTML;
}else{
_36=_35.firstChild.nodeValue;
}
return (_36==null?"":_36.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1"));
},fillC2AInfo:function(_37,_38){
var _39=_37.childNodes;
for(var i=0;i<_39.length;i++){
var _3a=_39[i];
var _3b=SemTagUtil.getNodeClassValue(_3a);
if(_3b==null||_3b==""){
if(_3a.childNodes.length>0){
SemTagC2A.fillC2AInfo(_3a,_38);
}
}else{
if(_3b.match(SemTagC2A.typeNameRegExp)){
var _3c=SemTagC2A.getElementValue(_3a);
var _3d=SemTagC2A.parseTypeName(_3c);
_38.typenames.push({namespace:_3d.namespace,type:_3d.type});
if(_3d.selector){
_38.selector=_3d.selector;
}
}else{
if(_3b.match(SemTagC2A.valueRegExp)&&_38.value==""){
_38.value=SemTagC2A.getElementValue(_3a);
if(!_38.anchorNode||_38.anchorNode==""){
_38.anchorNode=_3a;
}
}else{
if(_3b.match(SemTagC2A.displayRegExp)&&_38.display==""){
_38.display=SemTagC2A.getElementValue(_3a);
}else{
if(_3b.match(SemTagC2A.menulabelRegExp)&&_38.menuLabel==""){
_38.menuLabel=SemTagC2A.getElementValue(_3a);
}else{
if(_3b.match(SemTagC2A.anchorRegExp)){
_38.anchorNode=_3a;
}else{
if(!_3b.match(SemTagC2A.sourceRegExp)&&!_3b.match(SemTagC2A.targetRegExp)){
if(_3a.childNodes.length>0){
SemTagC2A.fillC2AInfo(_3a,_38);
}
}
}
}
}
}
}
}
}
},getSpecialC2ASourceInfo:function(_3e,_3f){
var _40={"typenames":new Array(),"value":_3f,"display":"","anchorNode":""};
_40.typenames.push({namespace:SemTagC2A.liveObjectNamespace,type:_3e});
return _40;
},getSourceInfo:function(_41){
var _42={"typenames":new Array(),"value":"","display":"","anchorNode":""};
SemTagC2A.fillC2AInfo(_41,_42);
return _42;
},getTargetInfo:function(_43){
var _44={"typenames":new Array(),"menuLabel":""};
SemTagC2A.fillC2AInfo(_43,_44);
return _44;
},generateMenuContents:function(_45,_46){
var _47=null;
var _48=null;
var _49=SemTagC2A.getSourceInfo(_46);
if(SemTagC2A.isTargetDefined(_49)==true){
_47=SemTagC2A.getTargetMenuItems(_49);
}
if(_49.display!=""){
_48=SemTagSvcPortal.getMenuHeaderJson(_49.display,"text/html",-100);
}
if(_47!=null||_49.display!=""){
SemTagSvcPortal.setMenuData(_45,_47,"",_48,"");
}
},getTargetMenuItems:function(_4a){
var _4b=new Array();
var _4c=new Array();
for(var _4d in SemTagC2A.targetNodeIDs){
var _4e=SemTagC2A.findElementInWindowScope(_4d);
var _4f=SemTagC2A.getTargetInfo(_4e);
var _50=_4f.menuLabel;
var _51=_4c[_50];
if(_51!=null){
_4c[_50]=_51++;
}else{
_4c[_50]=1;
_51=1;
}
if(_51>1){
_50+=" ("+_51+")";
}
if(SemTagC2A.isTargetSourceMatch(_4a,_4f)==true){
_4b.push(SemTagSvcPortal.getMenuItemJson(_50,"javascript:SemTagC2A.executeMenuAction(\""+_4d+"\");"));
}
}
if(_4b.length>0){
SemTagC2A.currentValue=_4a.value;
}
return _4b;
},executeMenuAction:function(_52){
var _53={};
var _54=SemTagC2A.findElementInWindowScope(_52);
if(_54&&_54.tagName=="FORM"){
var _55=SemTagC2A.currentValue;
var _56=SemTagC2A.getTargetInfo(_54);
if(_56.selector){
_55=SemTagC2A.selectSubField(_55,_56.selector);
}
var _57=SemTagSvcPortal.getElementsByClassName(SemTagC2A.paramTagName,_54,0,["INPUT"]);
for(var j=0;j<_57.length;j++){
_57[j].value=SemTagC2A.getStringValue(_55);
}
window.ibm.portal.c2a.event={value:_55};
for(var i=0;i<parent.frames.length;i++){
if(SemTagC2A.canAccessFrameContent(parent.frames[i])){
if(!parent.frames[i].ibm){
parent.frames[i].ibm=new Object();
}
if(!parent.frames[i].ibm.portal){
parent.frames[i].ibm.portal=new Object();
}
parent.frames[i].ibm.portal.c2a=new Object();
parent.frames[i].ibm.portal.c2a.event={value:_55};
}
}
if(_54.onsubmit){
if(SemTagUtil.isGecko){
var _58=new Object();
_54.onsubmit(_58);
}else{
_54.fireEvent("onsubmit");
}
}
_54.submit();
}else{
if(SemTagSvcPortal.trace){
SemTagUtil.log("no target node can be found for id "+_52);
}
}
},selectSubField:function(obj,_59){
var _5a=_59.split(".");
var x=obj;
for(var i=0;i<_5a.length;i++){
if(typeof (x)=="object"&&x[_5a[i]]){
x=x[_5a[i]];
}else{
if(SemTagSvcPortal.trace){
SemTagUtil.log("cannot select "+_59+" from "+obj);
}
x=null;
break;
}
}
return x;
},getStringValue:function(x){
if(typeof x=="string"){
return x;
}else{
return SemTagC2A.getJSON(x);
}
},getJSON:function(x){
if(x==null){
return "null";
}
switch(typeof x){
case "string":
return "\""+x+"\"";
case "number":
case "boolean":
return String(x);
case "object":
if(x instanceof Array){
return SemTagC2A.getArrayJSON(x);
}else{
if(x){
return SemTagC2A.getObjectJSON(x);
}
}
}
},getObjectJSON:function(o){
var a=[];
for(k in o){
if(o.hasOwnProperty(k)){
a.push("\""+k+"\":"+SemTagC2A.getJSON(o[k]));
}
}
return "{"+a.join(",")+"}";
},getArrayJSON:function(o){
var a=[];
for(var k=0;k<o.length;k++){
a.push(SemTagC2A.getJSON(o[k]));
}
return "["+a.join(",")+"]";
},triggerCSRAction:function(_5b){
var _5c=SemTagC2A.findElementInWindowScope(_5b);
var _5d=SemTagC2A.getC2ATargetPageID(_5c);
var _5e=SemTagC2A.getC2ATargetPortletWindowID(_5c);
var _5f=SemTagC2A.getC2ACommTargetName(_5c);
var _60=SemTagC2A.currentValue;
var _61=SemTagC2A.getTargetActionParams(_5c);
},triggerCSREvent:function(_62){
var _63=SemTagC2A.findElementInWindowScope(_62);
var _64=SemTagC2A.getC2ATargetPageID(_63);
var _65=SemTagC2A.getC2ATargetPortletWindowID(_63);
var _66=SemTagC2A.getC2ACommTargetQName(_63);
var _67=SemTagC2A.currentValue;
var _68=com.ibm.mashups.services.ServiceManager.getService(com.ibm.mashups.iwidget.services.EventService.SERVICE_NAME);
_68.fireEvent(_65,_66,_67,"{http://www.w3.org/2001/XMLSchema}string");
},getC2ATargetPageID:function(_69){
var _6a=dojo.query("input[name=\"com.ibm.wps.propertybroker.standard.c2a.pageid\"]",_69);
var _6b=(_6a!=null&&_6a.length==1)?_6a[0].value:"undefined";
return _6b;
},getC2ATargetPortletWindowID:function(_6c){
var _6d=dojo.query("input[name=\"com.ibm.wps.propertybroker.standard.c2a.portletwindowid\"]",_6c);
var _6e=(_6d!=null&&_6d.length==1)?_6d[0].value:"undefined";
return _6e;
},getC2ACommTargetName:function(_6f){
var _70=dojo.query("input[name=\"com.ibm.wps.propertybroker.standard.c2a.commtargetname\"]",_6f);
var _71=(_70!=null&&_70.length==1)?_70[0].value:"undefined";
return _71;
},getC2ACommTargetQName:function(_72){
var _73=dojo.query("input[name=\"com.ibm.wps.propertybroker.standard.c2a.commtargetqname\"]",_72);
var _74=(_73!=null&&_73.length==1)?_73[0].value:"undefined";
return _74;
},getC2ATargetActionParams:function(_75){
var _76=dojo.query("input[type=\"text\"]",_75);
dojo.forEach(_76,function(_77){
});
}};
SemTagC2A.init();


 // end of jspscriptlet
if(typeof (ibm)=="undefined"){
ibm={};
}
if(typeof (ibm.portal)=="undefined"){
ibm.portal={};
}
if(typeof (ibm.portal.xml)=="undefined"){
ibm.portal.xml={};
}
if(typeof (ibm.portal.xml)=="undefined"){
ibm.portal.xml={};
}
ibm.portal.util={};
ibm.portal.util.cloneObject=function(_1){
var _2={};
for(i in _1){
_2[i]=_1[i];
}
return _2;
};
ibm.portal.resource={};
ibm.portal.resource.str={};
ibm.portal.resource.getString=function(_3,_4){
s=_3[_4];
s=(s==null)?_4:s;
if(arguments.length>=2){
i=1;
do{
s=s.replace("%"+i,arguments[i]);
i=i+1;
}while(i<arguments.length);
}
return s;
};
if(typeof (ibm.portal.xml)=="undefined"){
ibm.portal.xml={};
}
ibm.portal.xml.ie={};
ibm.portal.xml.gecko={};
ibm.portal.xml.getXmlHttpRequest=function(){
var _5=null;
if(typeof ActiveXObject!="undefined"){
_5=new ActiveXObject("Microsoft.XMLHTTP");
}else{
_5=new XMLHttpRequest();
}
return _5;
};
ibm.portal.xml.loadXml=function(_6){
if(typeof ActiveXObject!="undefined"){
return ibm.portal.xml.ie.loadXml(_6);
}else{
return ibm.portal.xml.gecko.loadXml(_6);
}
};
ibm.portal.xml.loadXmlString=function(_7){
if(typeof ActiveXObject!="undefined"){
return ibm.portal.xml.ie.loadXmlString(_7);
}else{
return ibm.portal.xml.gecko.loadXmlString(_7);
}
};
ibm.portal.xml.loadXsl=function(_8){
if(typeof ActiveXObject!="undefined"){
return ibm.portal.xml.ie.loadXsl(_8);
}else{
return ibm.portal.xml.gecko.loadXsl(_8);
}
};
ibm.portal.xml.transform=function(_9,_a,_b,_c,_d){
if(typeof ActiveXObject!="undefined"){
return ibm.portal.xml.ie.transform(_9,_a,_b,_c,_d);
}else{
return ibm.portal.xml.gecko.transform(_9,_a,_b,_c,_d);
}
};
ibm.portal.xml.update=function(_e,_f,xsl,_10,_11){
if(typeof ActiveXObject!="undefined"){
var _12=ibm.portal.xml.ie.transform(_f,xsl,_10,_11,true);
ibm.portal.debug.text("XSLT result: "+_12);
_e.innerHTML+=_12;
}else{
_12=ibm.portal.xml.gecko.transform(_f,xsl,_10,_11,false);
_e.appendChild(_12.documentElement);
}
};
ibm.portal.xml.ie.loadXml=function(_13){
var _14=new ActiveXObject("MSXML2.DOMDocument");
_14.async=0;
_14.resolveExternals=0;
if(!_14.load(_13)){
throw new Error("Error loading xml file "+_13);
}
return _14;
};
ibm.portal.xml.ie.loadXmlString=function(_15){
var _16=new ActiveXObject("MSXML2.DOMDocument");
_16.async=0;
_16.resolveExternals=0;
if(!_16.loadXML(_15)){
throw new Error("Error loading xml string "+_15);
}
return _16;
};
ibm.portal.xml.ie.loadXsl=function(_17){
var _18=new ActiveXObject("MSXML2.FreeThreadedDOMDocument");
_18.async=0;
_18.resolveExternals=0;
if(!_18.load(_17)){
throw new Error("Error loading xsl file "+_17);
}
return _18;
};
ibm.portal.xml.ie.transform=function(_19,xsl,_1a,_1b,_1c){
var _1d=_19;
var _1e=xsl;
try{
if(!_1e.documentElement){
_1e=this.loadXsl(xsl);
}
}
catch(e){
var _1f=e.message;
throw new Error(""+_1f,""+_1f);
}
var _20=new ActiveXObject("Msxml2.XSLTemplate");
_20.stylesheet=_1e;
var _21=_20.createProcessor();
_21.input=_1d;
if(_1b){
for(var p in _1b){
_21.addParameter(p,_1b[p]);
}
}
if(_1a){
_21.addParameter("mode",_1a);
}
if(_1c){
if(!_21.transform()){
throw new Error("Error transforming xml doc "+_1d);
}
return _21.output;
}else{
var _22=new ActiveXObject("MSXML2.DOMDocument");
_22.async=0;
_22.validateOnParse=1;
_1d.transformNodeToObject(_1e,_22);
return _22;
}
};
ibm.portal.xml.gecko.loadXml=function(_23){
var _24=document.implementation.createDocument("","",null);
var xhr=new XMLHttpRequest();
xhr.open("GET",_23,false);
xhr.send(null);
if(xhr.status==200){
_24=xhr.responseXML;
}
return _24;
};
ibm.portal.xml.gecko.loadXmlString=function(_25){
var _26=new DOMParser();
try{
oXmlDoc=_26.parseFromString(_25,"text/xml");
}
catch(exc){
throw new Error("Error loading xml string "+_25);
}
return oXmlDoc;
};
ibm.portal.xml.gecko.loadXsl=function(_27){
var _28=document.implementation.createDocument("","",null);
var xhr=new XMLHttpRequest();
xhr.open("GET",_27,false);
xhr.send(null);
if(xhr.status==200){
_28=xhr.responseXML;
}
return _28;
};
ibm.portal.xml.gecko.transform=function(_29,xsl,_2a,_2b,_2c){
try{
var _2d=xsl;
if(!_2d.documentElement){
alert("xslDoc is not a Document, loading it...");
_2d=this.loadXsl(xsl);
}
var _2e=new XSLTProcessor();
_2e.importStylesheet(_2d);
if(_2b){
for(var p in _2b){
_2e.setParameter(null,p,_2b[p]);
}
}
if(_2a){
_2e.setParameter(null,"mode",_2a);
}
var _2f=_2e.transformToDocument(_29);
if(!_2c){
return _2f;
}
resultStr=_2f.documentElement.textContent;
}
catch(exc){
throw new Error("Error transforming xml doc "+exc);
}
return resultStr;
};
ibm.portal.xml.setLayerContentByXml=function(_30,xml,xsl,_31,_32){
var _33=ibm.portal.xml.transform(xml,xsl,null,_31,_32);
if(_30.innerHTML){
_30.innerHTML=_33;
}else{
var obj=document.getElementById(_30);
obj.innerHTML=_33;
}
};
ibm.portal.io={};
ibm.portal.io.sAcceptLanguage="";
ibm.portal.io.getResponseHeader=function(_34,_35){
var _36;
try{
_36=_34.getResponseHeader(_35);
}
catch(exc){
_36=null;
}
return _36;
};
ibm.portal.io.checkForError=function(_37){
var _38=null;
var _39=ibm.portal.io.getResponseHeader(_37,"X-IBM-REST-Error");
if(_39){
var _38="",_3a=ibm.portal.io.getResponseHeader(_37,"X-IBM-REST-MsgArg1");
if(_3a){
_38=ibm.portal.resource.getString(_39,window.decodeURIComponent(_3a));
}else{
_38=ibm.portal.resource.getString(_39);
}
}
return _38;
};
ibm.portal.io.asyncRequest=function(_3b,_3c,_3d,_3e){
try{
ibm.portal.io.setAsync(_3b,_3c,_3d,_3e,true);
}
catch(e){
ibm.portal.io.setAsync(_3b,_3c,_3d,_3e,false);
}
};
ibm.portal.io.setAsync=function(_3f,_40,_41,_42,_43){
var _44=ibm.portal.xml.getXmlHttpRequest();
_44.open(_3f,_40,true);
if(!_43){
_44.setRequestHeader("Accept-language","*");
}
try{
_44.onreadystatechange=function(){
if(_44.readyState==4){
_42.startUpdate();
sError=ibm.portal.io.checkForError(_44);
if(sError){
_42.handleError(""+ibm.portal.resource.getString(sError));
}else{
var _45=_44.responseText;
_42.handleData(_45);
}
}
};
_44.send(_41);
}
catch(e){
throw new Error("","");
}
};


