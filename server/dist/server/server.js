"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var fs = require("fs");
var PATHS = require(path.join(process.cwd(), "config", "paths"));
var JSZip = require("jszip");
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
    var next = dummyscene.getNext();
    res.sendFile(next, options, function (err) {
        console.log("sent '" + next + "'");
    });
});
var Scene = (function () {
    function Scene(path_list, base_dir) {
        if (base_dir === void 0) { base_dir = ""; }
        this.path_list = path_list;
        this.base_dir = base_dir;
        this.counter = 0;
    }
    Scene.prototype.replaceExtWithZip = function (str) {
        return (str.substr(0, str.lastIndexOf('.')) || str) + ".zip";
    };
    Scene.prototype.zipAll = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        var that = this;
        var counter = 0;
        this.path_list.forEach(function (_path) {
            if (_path.substr(-(".zip".length)) !== ".zip") {
                var path_zip = that.replaceExtWithZip(_path);
                var full_path_zip = path.join(that.base_dir, path_zip);
                if (!fs.existsSync(full_path_zip)) {
                    var zip = new JSZip();
                    var full_path = path.join(that.base_dir, _path);
                    zip.file(_path, fs.readFileSync(full_path));
                    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: false })
                        .pipe(fs.createWriteStream(full_path_zip))
                        .on('finish', function () {
                        console.log("Zipped '" + _path + "'");
                    });
                    if (counter >= that.path_list.length) {
                        callback();
                        return;
                    }
                    counter++;
                }
            }
        });
        callback();
    };
    Scene.prototype.getNext = function () {
        this.counter++;
        if (this.counter >= this.path_list.length)
            this.counter = 0;
        return this.replaceExtWithZip(this.path_list[this.counter]);
    };
    return Scene;
}());
var base_dir = path.join(PATHS.RES_DIR);
var ball_frames = fs.readdirSync(path.join(base_dir, "ball_frames_textured"))
    .filter(function (el) {
    return (el.substr(-(".zip".length)) === ".dae");
}).map(function (el) {
    return path.join("ball_frames_textured", el);
}).sort();
var dummyscene = new Scene(ball_frames, base_dir);
dummyscene.zipAll();
