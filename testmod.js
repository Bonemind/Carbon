var events = require("events");
var testmod = function(renderTarget) {
	this.on("activate", this.onActivate);
	this.on("deactivate", this.onDeactivate);
	this.renderTarget = renderTarget;
}
testmod.prototype.__proto__ = events.EventEmitter.prototype;

testmod.prototype.renderTemplate = function() {
	$(this.renderTarget).load("webcomp.html");
}

testmod.prototype.onActivate = function() {
	console.log("activate");
	this.renderTemplate();
}

testmod.prototype.onDeactivate = function() {
	console.log("deactivate");
}

 module.exports = testmod;
