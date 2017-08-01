import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";

const formidable  = require("express-formidable");
const lessMiddleware = require("less-middleware");


const DEBUG = true;
const PORT = 8080;
const VIEWS_DIR =  path.join(__dirname, "views");
const PUBLIC_DIR = path.join(__dirname, "../public");
const CSS_DIR = path.join(PUBLIC_DIR, "/css");
const LESS_DIR = path.join(PUBLIC_DIR, "/less");


let app = express();

// Template/ View Engine
app.set("views", VIEWS_DIR);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Less
app.use(lessMiddleware(LESS_DIR, {
    dest: CSS_DIR,
    compress : true,
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
app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});


// Routes

let data:any = {
    title: "StreamCollada",
    css: ["main.css"],
    js: ["three.min.js", "index.js", "collada_stream.js"]
};

app.get("/", (req, res) => {
    data["nth"]= Math.round(Math.random()*100);
    res.render("index", data);
}).post("/", (req, res) => {
    data["nth"]= Math.round(Math.random()*100);
    console.log("FILE UPLOAD: ", req.fields, req.files);
    res.render("index", data);
});
