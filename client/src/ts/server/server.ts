import * as express from "express";
//import * as bodyParser from "body-parser";
import * as path from "path";

//const formidable  = require("express-formidable");
const lessMiddleware = require("less-middleware");
//const multer = require("multer");
const PATHS = require( path.join(process.cwd(), "config", "paths") );

const DEBUG = true;
const PORT = 8080;

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
    js: [path.join("js", "bundle.js")]  // ["three.min.js", "index.js", "collada_stream.js"]
};

/*
let storage_mem = multer.memoryStorage();
let storage_disk =   multer.diskStorage({
    destination: function (req:any, file:string, cb:any) {
        cb(null, "dist/static/res/")
    },
    filename: function (req:any, file:string, cb:any) {
        cb(null, "test.zip")//file.originalname)
    }
});
let up = multer({
    storage: storage_disk

}).any();

app.get("/", (req:any, res:any) => {
    data["nth"]= Math.round(Math.random()*100);
    res.render("index", data);
}).post("/", up,(req:any, res:any) => {
    console.log("Multer");
    //req.files.forEach((key:any)=>{
    //   console.log(key);
    //});
    res.send({"I said": "well done"})
    //console.log(req.file, req.files, req.fields, req.body)
}).post("/", (req:any, res:any)=>{
    console.log("Some post request");
    console.log(req.file, req.files, req.fields, req.body)
});
*/

app.get("/", (req:any, res:any) => {
    res.render("index", data);
})