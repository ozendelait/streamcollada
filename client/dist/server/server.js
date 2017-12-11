"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var PATHS = require(path.join(process.cwd(), "config", "paths"));
var DEBUG = true;
var PORT = 8080;
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
app.get("/", function (req, res) {
    res.render("index", data);
});
