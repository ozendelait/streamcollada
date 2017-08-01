"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var data = {
    title: "StreamCollada",
    css: ["main.css"],
    js: ["three.min.js"]
};
var router = express_1.Router();
router.get("/", function (req, res, next) {
    data["nth"] = Math.round(Math.random() * 100);
    res.render("index", data);
});
exports.default = router;
