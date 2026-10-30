//Ext.Loader.setPath('Ext.ux', 'js/extjs-ux');

Ext.Loader.addClassPathMappings({
  "MyMain": basePath+"js-app",
  "MyMain.controller.Base": basePath+"js-app/common/BaseController.js",
  "MyMain.controller.StandaloneCrudHandler": basePath+"js-app/common/StandaloneCrudHandler.js"
});
