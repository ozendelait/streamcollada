import * as express from "express";
import * as path from "path";

const fs = require("fs");
const PATHS = require( path.join(process.cwd(), "config", "paths") );
const JSZip= require("jszip");

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
    let next = dummyscene.getNext()
    res.sendFile(next, options, (err:any)=>{
        console.log("sent '" + next + "'");
    })
});

class Scene{
    protected path_list : Array<string>;
    protected counter: number;
    public base_dir: string;

    constructor(path_list: Array<string>, base_dir=""){
        this.path_list = path_list;
        this.base_dir = base_dir;
        this.counter = 0;
    }

    protected replaceExtWithZip(str: string) : string {
        return (str.substr(0, str.lastIndexOf('.')) || str) + ".zip";
    }

    public zipAll(callback=()=>{}){
        let that = this;
        let counter = 0;
        this.path_list.forEach((_path: string) => {
            if(_path.substr(-(".zip".length)) !== ".zip"){
                let path_zip = that.replaceExtWithZip(_path);
                let full_path_zip = path.join(that.base_dir, path_zip);
                if(!fs.existsSync(full_path_zip)){
                    let zip = new JSZip();
                    let full_path = path.join(that.base_dir, _path)
                    zip.file(_path , fs.readFileSync(full_path));
                    zip.generateNodeStream({type:'nodebuffer', streamFiles: false})
                        .pipe(fs.createWriteStream(full_path_zip))
                        .on('finish', function () {
                            console.log("Zipped '" + _path + "'");
                        });
                    if(counter >= that.path_list.length){
                        callback();
                        return;
                    }
                    counter++;

                }
            }
        })
        callback();

    }

    public getNext() : string {
        this.counter++;
        if (this.counter >= this.path_list.length)
            this.counter = 0;
        return this.replaceExtWithZip(this.path_list[this.counter]);
    }
}

let base_dir = path.join(PATHS.RES_DIR);
let ball_frames :Array<string> = fs.readdirSync(path.join(base_dir, "ball_frames_textured"))
    .filter((el:string)=>{
        return (el.substr(-(".zip".length)) === ".dae");
}).map((el:string)=>{
    return path.join("ball_frames_textured", el);
}).sort();

let dummyscene = new Scene(ball_frames, base_dir);
dummyscene.zipAll();
