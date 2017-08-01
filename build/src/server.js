"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var lessMiddleware = require("less-middleware");
var index_1 = require("./routes/index");
var DEBUG = true;
var PORT = 8080;
var VIEWS_DIR = path.join(__dirname, "views");
var PUBLIC_DIR = path.join(__dirname, "../public");
var CSS_DIR = path.join(PUBLIC_DIR, "/css");
var LESS_DIR = path.join(PUBLIC_DIR, "/less");
var app = express();
app.set("views", VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(lessMiddleware(LESS_DIR, {
    dest: CSS_DIR,
    compress: true,
    debug: DEBUG
}));
app.use(express.static(PUBLIC_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", index_1.default);
app.set("port", process.env.PORT || PORT);
app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});
