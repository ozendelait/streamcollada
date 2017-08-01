"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var formidable = require("express-formidable");
var lessMiddleware = require("less-middleware");
var DEBUG = true;
var PORT = 8080;
var VIEWS_DIR = path.join(__dirname, "views");
var PUBLIC_DIR = path.join(__dirname, "../public");
var CSS_DIR = path.join(PUBLIC_DIR, "/css");
var LESS_DIR = path.join(PUBLIC_DIR, "/less");
var app = express();
// Template/ View Engine
app.set("views", VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
// Less
app.use(lessMiddleware(LESS_DIR, {
    dest: CSS_DIR,
    compress: true,
    debug: DEBUG
}));
// Static/ Public Folder ("www")
app.use(express.static(PUBLIC_DIR));
// Body Parser
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
// Form Parser
app.use(formidable({
    uploadDir: "public/images",
    keepExtensions: true
}));
// Listen
app.set("port", process.env.PORT || PORT);
app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});
// Routes
var data = {
    title: "StreamCollada",
    css: ["main.css"],
    js: ["three.min.js", "index.js", "collada_stream.js"]
};
app.get("/", function (req, res) {
    data["nth"] = Math.round(Math.random() * 100);
    res.render("index", data);
}).post("/", function (req, res) {
    data["nth"] = Math.round(Math.random() * 100);
    console.log("FILE UPLOAD: ", req.fields, req.files);
    res.render("index", data);
});
