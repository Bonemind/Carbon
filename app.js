var app = require("app");
var BrowserWindow = require("browser-window");
var ipc = require("ipc");


app.on("window-all-closed", function() {
	app.quit();
});

app.on("ready", function() {
	var win = new BrowserWindow({ width: 800, height: 600, show: false });
	win.loadUrl("file://" + __dirname + "/index.html");
	win.show();

	win.on("closed", function() {
		win = null;
	});

	win.webContents.on("did-finish-load", function() {
	});
});

