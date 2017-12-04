import * as express from "express";
import * as path from "path";

const lessMiddleware = require("less-middleware");
const fs = require("fs");
const PATHS = require( path.join(process.cwd(), "config", "paths") );

const DEBUG = true;
const PORT = 7070;

let app = express();

// Template/ View Engine
app.set("views", PATHS.VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Static/ Public Folder ("www")
app.use(express.static(PATHS.PUBLIC_DIR));

// Listen
app.set("port", process.env.PORT || PORT);
app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

// Routes
let data:any = {
    title: "StreamCollada",
    css: [path.join("css", "main.css")],
    js: [path.join("js", "bundle.js")]
};

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Cache-Control");
    next();
});

let options = {
    root: PATHS.RES_DIR,
    headers: {
        "connection": "keep-alive",
        "Content-Type": "multipart/form-data"
    }
};

app.get("/", (req:any, res:any) => {
    res.render("index", data);
}).post("/", (req:any, res:any) => {
    console.log("Post request");
    res.sendFile("ball.zip", options, (err:any)=>{
        console.log("sent file");
    })
});
