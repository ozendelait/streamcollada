"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const PATHS = require(path.join(process.cwd(), "config", "paths"));
const DEBUG = true;
const PORT = 8080;
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
app.get("/", (req, res) => {
    res.render("index", data);
});
//# sourceMappingURL=server.js.map