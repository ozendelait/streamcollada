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
var storage_mem = multer.memoryStorage();
var storage_disk = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "dist/static/res/");
    },
    filename: function (req, file, cb) {
        cb(null, "test.zip");
    }
});
var up = multer({
    storage: storage_disk
}).any();
app.get("/", function (req, res) {
    data["nth"] = Math.round(Math.random() * 100);
    res.render("index", data);
}).post("/", up, function (req, res) {
    console.log("Multer");
    res.send({ "I said": "well done" });
}).post("/", function (req, res) {
    console.log("Some post request");
    console.log(req.file, req.files, req.fields, req.body);
});
