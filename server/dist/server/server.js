"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const testscene = require("./test_scene");
const fs = require("fs");
const PATHS = require(path.join(process.cwd(), "config", "paths"));
const DEBUG = true;
const PORT = 7070;
let app = express();
app.set("views", PATHS.VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(PATHS.PUBLIC_DIR));
app.set("port", process.env.PORT || PORT);
app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
let data = {
    title: "StreamCollada",
    css: [path.join("css", "main.css")],
    js: [path.join("js", "bundle.js")]
};
app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Cache-Control");
    next();
});
let res_options = {
    root: PATHS.RES_DIR,
    headers: {
        "connection": "keep-alive",
        "Content-Type": "multipart/form-data"
    }
};
app.get("/", (req, res) => {
    res.render("index", data);
}).post("/", (req, res) => {
    let next = dummyscene.getNext();
    res.sendFile(next, res_options, (err) => {
        console.log("sent '" + next + "'");
    });
});
let base_dir = path.join(PATHS.RES_DIR);
let subfolder = "ball_textured";
let frame_list = fs.readdirSync(path.join(base_dir, subfolder))
    .filter((el) => {
    return (el.substr(-(".dae".length)) === ".dae");
}).map((el) => {
    return path.join(subfolder, el);
}).sort();
let static_list = ["texture_1.jpg", "texture_2.jpg"]
    .map((el) => {
    return path.join(subfolder, el);
});
let scene_options = new testscene.SceneOptions(base_dir, static_list);
let dummyscene = new testscene.Scene(frame_list, scene_options);
dummyscene.zipAll();
