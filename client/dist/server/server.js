"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const http = require("http");
const PATHS = require(path.join(process.cwd(), "config", "paths"));
const DEBUG = true;
const PORT = 8080;
const STREAMING_SERVER = {
    host: "http://localhost",
    path: "",
    port: 7070,
    method: "GET",
    headers: {}
};
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
app.get("/", (req, app_response) => {
    let options = Object.assign({}, STREAMING_SERVER, {
        path: "/scenes",
        headers: { 'Content-Type': 'application/json' },
        json: true
    });
    let sserver_req = http.get("http://localhost:7070/scenes", function (res) {
        res.setEncoding('utf8');
        var raw_body_data = "";
        res.on('data', function (chunk) {
            raw_body_data += chunk;
        }).on('end', function () {
            try {
                const body_data = JSON.parse(raw_body_data);
                data["navigation"] = {
                    scenes: body_data.scenes
                };
                app_response.render("index", data);
            }
            catch (e) {
                console.log('ERROR: ' + e.message);
                app_response.status(505).send("Error<br/>" + JSON.stringify(e));
            }
            return;
        });
    }).on('error', function (e) {
        console.log('ERROR: ' + e.message);
        app_response.status(505).send("Error<br/>" + JSON.stringify(e));
        return;
    });
});
