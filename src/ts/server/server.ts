import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";

const formidable  = require("express-formidable");
const lessMiddleware = require("less-middleware");
const multer = require("multer");
const PATHS = require( path.join(process.cwd(), "config", "paths") );

const DEBUG = true;
const PORT = 8080;

let app = express();
console.log("So far so good");

// Template/ View Engine
app.set("views", PATHS.VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Static/ Public Folder ("www")
app.use(express.static(PATHS.PUBLIC_DIR));

// Form Parser
app.use(formidable({
    uploadDir: PATHS.RES_DIR,
    keepExtensions: true
}));

// Listen
app.set("port", process.env.PORT || PORT);
app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});

// Routes
let data:any = {
    title: "StreamCollada",
    css: [path.join("css", "main.css")],
    js: [path.join("js", "bundle.js")]  // ["three.min.js", "index.js", "collada_stream.js"]
};


let upload = multer({
   dest: PATHS.RES_DIR
});
app.get("/", (req, res) => {
    data["nth"]= Math.round(Math.random()*100);
    res.render("index", data);
}).post("/", upload.any() ,(req, res) => {
    data["nth"]= Math.round(Math.random()*100);
    console.log(Object.keys(req));
    console.log(req.files)
    res.render("index", data);
});
