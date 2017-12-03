const path = require("path");

const BASE_DIR = "."; //path.resolve(".")

const SRC_DIR = path.join(BASE_DIR, "src");
const VIEWS_DIR =  path.join(SRC_DIR, "ejs");
const LESS_DIR = path.join(SRC_DIR, "less");
const SERVER_TS_DIR = path.join(SRC_DIR, "ts", "server");
const PUBLIC_TS_DIR = path.join(SRC_DIR, "ts", "static");

const CONFIG_DIR = path.join(SRC_DIR, "config");

const BUILD_DIR = path.join(BASE_DIR, "dist");
const DEFINITIONS_DIR = path.join(BUILD_DIR, "definitions");
const PUBLIC_DIR = path.join(BUILD_DIR, "static");
const SERVER_DIR = path.join(BUILD_DIR, "server");
const SERVER_JS_DIR = SERVER_DIR;
const RES_DIR = path.join(PUBLIC_DIR, "res");
const CSS_DIR = path.join(PUBLIC_DIR, "css");
const PUBLIC_JS_DIR = path.join(PUBLIC_DIR, "js");



module.exports = {
    SRC_DIR: SRC_DIR,
    VIEWS_DIR: VIEWS_DIR,
    LESS_DIR: LESS_DIR,
    SERVER_TS_DIR: SERVER_TS_DIR,
    PUBLIC_TS_DIR: PUBLIC_TS_DIR,

    CONFIG_DIR: CONFIG_DIR,

    BUILD_DIR: BUILD_DIR,
    DEFINITIONS_DIR: DEFINITIONS_DIR,
    PUBLIC_DIR: PUBLIC_DIR,
    SERVER_DIR: SERVER_DIR,
    SERVER_JS_DIR: SERVER_JS_DIR,
    RES_DIR: RES_DIR,
    CSS_DIR: CSS_DIR,
    PUBLIC_JS_DIR: PUBLIC_JS_DIR
}