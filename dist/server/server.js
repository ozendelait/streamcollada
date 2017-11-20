"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var formidable = require("express-formidable");
var lessMiddleware = require("less-middleware");
var multer = require("multer");
var PATHS = require(path.join(process.cwd(), "config", "paths"));
var DEBUG = true;
var PORT = 8080;
var app = express();
console.log("So far so good");
app.set("views", PATHS.VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(PATHS.PUBLIC_DIR));
app.use(formidable({
    uploadDir: PATHS.RES_DIR,
    keepExtensions: true
}));
app.set("port", process.env.PORT || PORT);
app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});
var data = {
    title: "StreamCollada",
    css: [path.join("css", "main.css")],
    js: [path.join("js", "bundle.js")]
};
var upload = multer({
    dest: PATHS.RES_DIR
});
app.get("/", function (req, res) {
    data["nth"] = Math.round(Math.random() * 100);
    res.render("index", data);
}).post("/", upload.any(), function (req, res) {
    data["nth"] = Math.round(Math.random() * 100);
    console.log(Object.keys(req));
    console.log(req.files);
    res.render("index", data);
});
