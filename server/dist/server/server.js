"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var lessMiddleware = require("less-middleware");
var fs = require("fs");
var PATHS = require(path.join(process.cwd(), "config", "paths"));
var DEBUG = true;
var PORT = 7070;
var app = express();
app.set("views", PATHS.VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(PATHS.PUBLIC_DIR));
app.set("port", process.env.PORT || PORT);
app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});
var data = {
    title: "StreamCollada",
    css: [path.join("css", "main.css")],
    js: [path.join("js", "bundle.js")]
};
app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Cache-Control");
    next();
});
var options = {
    root: PATHS.RES_DIR,
    headers: {
        "connection": "keep-alive",
        "Content-Type": "multipart/form-data"
    }
};
app.get("/", function (req, res) {
    res.render("index", data);
}).post("/", function (req, res) {
    console.log("Post request");
    res.sendFile("sphere.zip", options, function (err) {
        console.log("sent file");
    });
});
