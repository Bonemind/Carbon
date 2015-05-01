var events = require("events");
var fs = require("fs");
var remote = require("remote");
var hotkeys = remote.require("global-shortcut");
var Stopwatch = require("timer-stopwatch");

var RiftModule = function(renderTarget) {
		this.on("activate", this.onActivate);
		this.on("deactivate", this.onDeactivate);
		this.active = false;
		this.renderTarget = renderTarget;
		this.stopwatchRunning = false;
		this.stopwatch = new Stopwatch();
		this.html = fs.readFileSync(__dirname + "/index.html").toString();
		self = this;

		hotkeys.register("F10", function() {
				self.startTimer();
		});

		hotkeys.register("F11", function() {
				self.stopTimer();
		});

		hotkeys.register("F9", function() {
				self.resetTimer();
		});
		this.stopwatch.on("time", function(time) {
			$("#timer").text(RiftModule.msToTime(time.ms));
		});
}
RiftModule.prototype.__proto__ = events.EventEmitter.prototype;

RiftModule.prototype.renderTemplate = function() {
		$(self.renderTarget).html(self.html);
}.bind(this);

RiftModule.prototype.onActivate = function() {
		this.active = true;
		this.renderTemplate();
}

RiftModule.prototype.onDeactivate = function() {
		this.active = false;
}

RiftModule.prototype.startTimer = function() {
		if (self.stopwatchRunning) {
				self.stopTimer();
				return;
		}
		self.stopwatchRunning = true;
		carbon.activateModule("riftMod");
		self.stopwatch.start();
}.bind(this);

RiftModule.prototype.stopTimer = function() {
		self.stopwatchRunning = false;
		self.stopwatch.stop();
}.bind(this);

RiftModule.prototype.resetTimer = function() {
		self.stopwatch.reset();
		self.stopwatchRunning = false;
}.bind(this);

//src = http://stackoverflow.com/questions/9763441/milliseconds-to-time-in-javascript
RiftModule.msToTime = function(s) {
		function addZ(n) {
				return (n<10? '0':'') + n;
		}

		var ms = s % 1000;
		s = (s - ms) / 1000;
		var secs = s % 60;
		s = (s - secs) / 60;
		var mins = s % 60;
		var hrs = (s - mins) / 60;

		return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs) + '.' + ms;
}

module.exports = RiftModule;
