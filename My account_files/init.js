/** Licensed Materials - Property of IBM, 5724-U69, (C) Copyright IBM Corp. 2009, 2010 - All Rights reserved.  **/

if(!dojo._hasResource["com.ibm.themes.PageBuilder2.init"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["com.ibm.themes.PageBuilder2.init"] = true;
dojo.provide("com.ibm.themes.PageBuilder2.init");

// initialization script that is run for the PageBuilder2 theme
// this is built into the layer, and discarded and it won't end up in a driver as
// a single file
com.ibm.themes.PageBuilder2.init = function() {
	var lgr = com.ibm.mashups.enabler.logging.Logger.getLogger("com.ibm.themes.PageBuilder2.init"),
		mname = "onload";
	lgr.entering(mname);
	
	/* Register context menus for theme components */
	lgr.trace(mname, "Registering context menus");
	var menuDefinitionsModule = "com.ibm.themes.PageBuilder2.menuDefinitions";
	var ctxMenusObj = dojo.getObject("ibmCfg.themeConfig.contextMenus", true);
	var bannerLinksMenu = new com.ibm.pb.contextMenu.JsonContextMenuLoader({url:dojo.moduleUrl(menuDefinitionsModule,"bannerLinks.json"), data: ctxMenusObj.bannerLinks});
	var userActionsMenu = new com.ibm.pb.contextMenu.JsonContextMenuLoader({url:dojo.moduleUrl(menuDefinitionsModule,"userActions.json"), data: ctxMenusObj.userActions});
	var pageActionsMenu = new com.ibm.pb.contextMenu.JsonContextMenuLoader({url:dojo.moduleUrl(menuDefinitionsModule,"pageActions.json"), data: ctxMenusObj.pageActions});
	var widgetActionsMenu = new com.ibm.pb.contextMenu.JsonContextMenuLoader({url:dojo.moduleUrl(menuDefinitionsModule,"widgetActions.json"), data: ctxMenusObj.widgetActions});
	
	var cmm = com.ibm.mashups.builder.model.Factory.getContextMenuModel();
	cmm.registerContextMenu("bannerLinks", bannerLinksMenu);
	cmm.registerContextMenu("userActions", userActionsMenu);
	cmm.registerContextMenu("pageActions", pageActionsMenu);
	cmm.registerContextMenu("widgetActions", widgetActionsMenu);
	
	/* Add listener to update the pageActionsMenu on the page mode change event */
	var evtSvc = com.ibm.mashups.iwidget.services.ServiceManager.getService("eventService");
	evtSvc.subscribeEvent("com.ibm.mashups.builder.changePageMode", pageActionsMenu, pageActionsMenu.onChange);
	

	lgr.trace(mname, "Checking a11y");
	/* Detect high contrast mode, if enabled, places class on body element to hide images that blend in with background.
	 	 Alt text is displayed in place of image */
	var bodyElem = document.getElementsByTagName("body")[0];
	if (dojo.hasClass(bodyElem, "dijit_a11y")) {            
	   dojo.addClass(bodyElem, "lotusImagesOff");
	}

	/* setup the statusbar */
	var themeBundle = dojo.i18n.getLocalization("com.ibm.bundles", "Theme");
	var v3themeProperties = { 
		"clear": themeBundle["statusbar_clear"], 
		"print": themeBundle["statusbar_print"],
		"showDetails": themeBundle["statusbar_show_details"],
		"hideDetails": themeBundle["statusbar_hide_details"],
		"warning": themeBundle["statusbar_warning"],
		"error": themeBundle["statusbar_error"],
		"info": themeBundle["statusbar_info"],
		"statusError": themeBundle["statusbar_status_error"],
		"messagesAvailable": themeBundle["statusbar_messages_available"],
		"itemsAvailable": themeBundle["statusbar_items_available"]
	};
	dojo._loadedModules["com.ibm.portal.nls.v3theme"] = {"ROOT": v3themeProperties, "${wp.preferredLocale}": v3themeProperties };
	var statusBar = new com.ibm.widgets.StatusBar({
		uid: "ibmStatusBox",
		locale: ibmCfg.portalConfig.locale,
		errorGifPath: ibmCfg.themeConfig.themeRootURI+"/images/statusBar/error.gif",
		warningGifPath: ibmCfg.themeConfig.themeRootURI+"/images/statusBar/warning.gif",
		infoGifPath: ibmCfg.themeConfig.themeRootURI+"/images/statusBar/info.gif",
        multipleMessagesGifPath: ibmCfg.themeConfig.themeRootURI+"/images/statusBar/info.gif"
	},"ibmStatusBarContainer");
	statusBar.startup();
	
	lgr.trace(mname, "Parsing search widget");
	/* Parse the search widget container */
	dojo.parser.parse("themeSearchBoxContainer");
	
	lgr.trace(mname, "Adding live text config entries for decorations and semantic tagging");
	/* Add live text service configuration entries for layout control decorations and semantic tagging */
	var livetextEntryAdded = "/com/ibm/mashups/livetext/configentryadded";
	var decorationsEntry = new com.ibm.mashups.livetext.ConfigEntry("*.component-control", true, "com.ibm.pb.decorations", ibmConfig["com.ibm.mashups.contextroot.builder"]+"/js/com/ibm/pb/decorations","com.ibm.pb.decorations.DecorationManager", true);
	var configEntryAction = new com.ibm.mashups.livetext.ConfigEntry(".com\\.ibm\\.portal\\.action", false, "portallof",        "/wps_semanticTag/javascript",  "portallof.vcard",  false, "com.ibm.portal.action");
    var configEntryVCard = new com.ibm.mashups.livetext.ConfigEntry(".vcard", false, "portallof","/wps_semanticTag/javascript",  "portallof.vcard",  false, "hcard");
    var configEntryC2aSourceTarget = new com.ibm.mashups.livetext.ConfigEntry(".c2a\\:source,.c2a\\:target", false, "portallof", "/wps_semanticTag/javascript", "portallof.vcard", false, "c2a");

	dojo.publish(livetextEntryAdded,[decorationsEntry]);
    dojo.publish(livetextEntryAdded,[configEntryAction]);
    dojo.publish(livetextEntryAdded,[configEntryVCard]);
    dojo.publish(livetextEntryAdded,[configEntryC2aSourceTarget]);
    
    /* Subscribe the status bar to topic */
    dojo.subscribe("/portal/status/theme", dojo.global, function(type, message, details){
		var statusMessage = new com.ibm.widgets.StatusMessage(type, message, details);
		dojo.publish("/portal/status", [{message: statusMessage, uid: 'ibmStatusBox'}]);
	});
    
    /* Fix dijit unloading in IE */
    if ( dojo.isIE ) {
		dojo.addOnWindowUnload( function () {
			dijit.registry.forEach(function(widget){
				// Avoid double destroy of widgets like Menu that are attached to <body>
				// even though they are logically children of other widgets.
				if(!widget._destroyed){
					if(widget.destroyRecursive){
						widget.destroyRecursive();
					}else if(widget.destroy){
						widget.destroy();
					}
				}
			});
		});	
	}
	
	//if no edit mode javascript url is provided, assume that all the javascript is already loaded.
	if ( !ibmCfg.themeConfig.editModeJSURL ) {
		com.ibm.themes.PageBuilder2.initEditMode();
	}

	lgr.exiting(mname);
}

com.ibm.themes.PageBuilder2.initEditMode = function () {
	try {
		/* Load the edit_mode CSS style sheets at this point */
		dojo.query("link[rel~=edit_mode]").forEach(function(elem) { 
			dojo.attr(elem, "rel", "stylesheet"); 
		});
	} catch(err) {}
	var cmm = com.ibm.mashups.builder.model.Factory.getContextMenuModel();
	
	/* Add a menu contribution to the widgetActions that provides support for directional move operations */
	var moveControls = new com.ibm.pb.decorations.LayoutDirectionalMoveControls();
	cmm.addContribution("widgetActions", moveControls);
	
	var evtSvc = com.ibm.mashups.iwidget.services.ServiceManager.getService("eventService");
	
	/* Add listener to update the moveControls contribution on certain widget events */
	dojo.forEach(["com.ibm.mashups.builder.hideWidget","com.ibm.mashups.builder.displayWidget"], function(evt) {
		evtSvc.subscribeEvent(evt, moveControls, moveControls.onChange);
	}, this);

	dojo.require("com.ibm.utilities");
	dojo.require("com.ibm.pb.contextMenu.JsonContextMenuLoader");
	dojo.require("com.ibm.pb.decorations.LayoutDirectionalMoveControls");
	
	dojo.require("com.ibm.pb.customize.enabler.TabbedController");
	dojo.require("com.ibm.pb.customize.enabler.AddContentController");
	dojo.require("com.ibm.pb.customize.enabler.ChangeStyleController");
	dojo.require("com.ibm.pb.customize.enabler.ChangeLayoutController");
	
	dojo.require("com.ibm.customize.AddContentPaletteContainer");
	dojo.require("com.ibm.customize.ChangeStylePaletteContainer");
	dojo.require("com.ibm.customize.ChangeLayoutPaletteContainer");
	
	/* Extend the PaletteContainer modules to use the corresponding Controllers */
	var containerBase = com.ibm.customize, controllerBase = com.ibm.pb.customize.enabler;
	dojo.extend(containerBase.AddContentPaletteContainer, controllerBase.AddContentController);
	dojo.extend(containerBase.ChangeStylePaletteContainer, controllerBase.ChangeStyleController);
	dojo.extend(containerBase.ChangeLayoutPaletteContainer, controllerBase.ChangeLayoutController);
};

livetextService = com.ibm.mashups.services.ServiceManager.getService(com.ibm.mashups.livetext.ServiceModel.SERVICE_NAME);
TagService = SemTagSvc = livetextService;
(function(){
	var onTagContentChanged = livetextService.onTagContentChanged,
		onTagChanged = livetextService.onTagChanged;
	
	livetextService.onTagChanged = function() {
	   var mp = com.ibm.mashups.enabler.io.XHRMultipartFactory.create();
	   mp.startTransaction();
	   onTagChanged.apply(this, arguments);
	   mp.endTransactionDeferred(true).start();
	};
	
	livetextService.onTagContentChanged = function() {
	   var mp = com.ibm.mashups.enabler.io.XHRMultipartFactory.create();
	   mp.startTransaction();
	   onTagContentChanged.apply(this, arguments);
	   mp.endTransactionDeferred(true).start();
	};
})();

}
ibmPortalConfig.resolver = com.ibm.data.Resolver.getStore({
	url: ibmPortalConfig.contentHandlerURI,
	namespaces: { 
		"ext": "http://www.ibm.com/xmlns/prod/websphere/portal/v6.0.1/portal-model", 
		"creationcontext": "http://www.ibm.com/xmlns/prod/websphere/portal/v6.1.0/portal-creation-context", 
		"base": "http://www.ibm.com/xmlns/prod/websphere/portal/v6.0/ibm-portal-composite-base", 
		"model": "http://www.ibm.com/xmlns/prod/websphere/portal/v6.0.1/portal-model-elements" 
	},
	tunnel: ibmConfig["tunnel.mode"],
	isAuthenticated: !ibmConfig.anonymousUser
});

dojo.addOnLoad(function(){
	/* Add context menu contributions for Tagging and Rating */
	var cmm = com.ibm.mashups.builder.model.Factory.getContextMenuModel();
	var pageActionsContribution = new com.ibm.cp.TRContextMenuLoader(true);
	cmm.addContribution("pageActions", pageActionsContribution, 60);
		
	var widgetActionsContribution = new com.ibm.cp.TRContextMenuLoader(false);
	cmm.addContribution("widgetActions", widgetActionsContribution, 80);
});

(function(){
	var portalOp = dojo.declare("com.ibm.portal.PortalOperation", [com.ibm.mashups.enabler.ac.operation.Operation], {
		allowed: false,
		constructor: function(allowed, finished) {
			this.allowed = allowed;
			if(finished) {
				finished(this);
			}
		},
		isAllowed: function(context){
			return this.allowed;
		}
	});
	
	var enabler = com.ibm.mashups.enabler,
		allowedOpsModel = enabler.ac.operation.AllowedOperationsModelFactory.getAllowedOperationsModel();
	
	allowedOpsModel.setOperation(com.ibm.pb.extension.Operations.PAGE_ACTIONS, function(opName, jsonContext, sync, finished) {
		var isAllowed = enabler.model.Factory.getUserModel().getAnonymousMode() != enabler.user.AnonymousMode.ANONYMOUS;
		if(!isAllowed) {
			var cp = ibmPortalCPConfig, node = jsonContext && jsonContext.contentNode;
			isAllowed = (cp!=null && cp.isTaggingEnabled && cp.contextMenu.isTaggingEnabled && cp.operations.canViewTags && ((node && node.getMetaData) ? 
					node.getMetaData("com.ibm.portal.cp.tagging.isTaggingDisabled") !== "true" : true)) ||
						(cp!=null && cp.isRatingEnabled && cp.contextMenu.isRatingEnabled && cp.operations.canViewRatings && ((node && node.getMetaData) ? 
					node.getMetaData("com.ibm.portal.cp.rating.isRatingDisabled") !== "true" : true));
		}
		
		new portalOp(isAllowed, finished);
	});
		
})();