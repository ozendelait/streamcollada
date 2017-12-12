import * as express from "express";
import * as path from "path";
import * as testscene from "./test_scene";
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

let res_options = {
    root: PATHS.RES_DIR,
    headers: {
        "connection": "keep-alive",
        "Content-Type": "multipart/form-data"
    }
};

app.get("/", (req:any, res:any) => {
    res.render("index", data);
}).post("/", (req:any, res:any) => {
    let next = dummyscene.getNext();
    res.sendFile(next, res_options, (err:any)=>{
        console.log("sent '" + next + "'");
    })
});


let base_dir = path.join(PATHS.RES_DIR);
let subfolder = "ball_textured";

let frame_list: Array<string> = fs.readdirSync(path.join(base_dir, subfolder))
    .filter((el:string)=>{
        return (el.substr(-(".zip".length)) === ".dae");
    }).map((el:string)=>{
        return path.join(subfolder , el);
    }).sort();

let static_list: Array<string> = ["texture_1.jpg", "texture_2.jpg"]
    .map((el:string)=>{
        return path.join(subfolder , el);
    });

let scene_options = new testscene.SceneOptions(base_dir, static_list);
let dummyscene = new testscene.Scene(frame_list, scene_options);
dummyscene.zipAll();