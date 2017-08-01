"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var data = {
    title: "StreamCollada",
    css: ["main.css"],
    js: ["three.min.js", "index.js", "collada_stream.js"]
};
var router = express_1.Router();
router.get("/", function (req, res, next) {
    data["nth"] = Math.round(Math.random() * 100);
    res.render("index", data);
}).post("/", function (req, res, next) {
    data["nth"] = Math.round(Math.random() * 100);
    console.log("FILE UPLOAD: ", req.fields, req.files);
    res.render("index", data);
});
exports.default = router;
