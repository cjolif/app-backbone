var http = require("http");
var path = require("path");
var express = require("express");
var service = require("./server/service");

var app = express();

app.configure(function(){
	app.use(express.bodyParser()),
	app.use(express.static(path.join(__dirname, 'client')));
});

app.get("/items", service.fetch);
app.get("/items/:id", service.get);
app.post("/items", service.add);
app.put("/items/:id", service.put);
app.delete("/items/:id", service.remove);

http.createServer(app).listen(3000, function(){
	console.log("Express server listening");
});
