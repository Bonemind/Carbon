//Dependencies
var fs = require("fs");
var _ = require("underscore");

function Carbon() {
	//Declarations
	this.currentModule = undefined;
	this.availableModules = {};
	this.moduleFolder = __dirname + "/modules";
	this.renderTarget = "#content";
	//Load any passed config options
	return;
	for (var prop in config) {
		if (this.hasOwnProperty(prop)) {
			this[prop] = config[prop];
		}
	}
}

//Loads all Carbon modules located in this.moduleFolder
Carbon.prototype.loadModules = function() {
	//Read all files in module folder, then filter the list to valid modules only
	var moduleFolderContents = fs.readdirSync(this.moduleFolder);
	var moduleFolders = _.filter(moduleFolderContents, function(fileObject) {
		return fs.lstatSync(this.moduleFolder + "/" + fileObject).isDirectory() && 
			fs.lstatSync(this.moduleFolder + "/" + fileObject + "/module.json").isFile();
	}, this);

	_.each(moduleFolders, function(module) {
		//Read config
		var configData = fs.readFileSync(this.moduleFolder + "/" + module + "/module.json");
		var config = JSON.parse(configData);

		//Instantiate
		var mod = require(this.moduleFolder + "/" + module + "/" + config.main_file);
		var instance = new mod("#content");

		//Add to available module
		this.availableModules[config.internalName] = { module: instance, properties: config };
	}, this);
}

Carbon.prototype.getModules = function() {
	return this.availableModules;
}

Carbon.prototype.activeModule = function() {
	return this.currentModule;
}

Carbon.prototype.activateModule = function(module) {
	if (this.currentModule !== undefined) {
		this.currentModule.module.emit("deactivate");
	}
	if (!this.availableModules[module]) {
		console.log("Module " + module + " not found");
		return;
	}
	this.currentModule = this.availableModules[module];
	this.currentModule.module.emit("activate");
}

module.exports = Carbon;
