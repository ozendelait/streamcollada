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

var SCENES : {[name: string] : testscene.Scene};


function init(): void{
    SCENES = {
        "collada_ball" : collada_scene,
        "collada_path" : collada_path_scene,
        "obj_ball" : obj_scene,
        "collada_bones" : bones_scene,
        "collada_sink" : sink_scene
    };

    app.get("/", (req:any, res:any) => {
        res.render("index", data);
    }).get("/scenes", (req:any, res:any) => {
        res.json({
            "scenes" : Object.keys(SCENES)
        });
    });

    for(let scene_name in SCENES){
        app.post("/" + scene_name, (req:any, res:any) => {
            let scene : testscene.Scene = SCENES[scene_name];
            let next_file : string = scene.getNext();
            res.sendFile(next_file, res_options, (err:any)=>{
                console.log("sent '" + next_file + "'");
            });
        });
    }
}


function groupElementsByNumber(ar: Array<string>):Array<Array<string>>{
    let grouped_array: Array<Array<string>> = [];
    let number_map: {[key:string]:Array<string>} = {};

    ar.forEach((el:string)=>{
        let numbers: string = String(parseInt(el.replace( /^\D+/g, '')));
        if(!number_map.hasOwnProperty(numbers))
            number_map[numbers] = [];
        number_map[numbers].push(el);
    });
    let keys = Object.keys(number_map);
    keys.sort((a: string, b: string)=>{return parseInt(a)-parseInt(b)});
    keys.forEach((el: string)=>{
        grouped_array.push(number_map[el]);
    });

    return grouped_array;
}

var collada_scene = (function(){
    let base_dir = path.join(PATHS.RES_DIR);
    let subfolder = "ball_textured";

    let frame_list: Array<string> = fs.readdirSync(path.join(base_dir, subfolder))
        .filter((el:string)=>{
            return (el.substr(-(".dae".length)) === ".dae");
        }).map((el:string)=>{
            return path.join(subfolder , el);
        });
    let grouped_frame_list: Array<Array<string>> = groupElementsByNumber(frame_list);

    let static_list: Array<string> = ["texture_1.jpg", "texture_2.jpg"]
        .map((el:string)=>{
            return path.join(subfolder , el);
        });

    let scene_options = new testscene.SceneOptions(base_dir, static_list);
    let scene = new testscene.Scene(grouped_frame_list, scene_options);
    scene.zipAll();

    return scene;
})();

var collada_path_scene = (function(){
    let base_dir = path.join(PATHS.RES_DIR);
    let subfolder = "ball_path";

    let frame_list: Array<Array<string>> = fs.readdirSync(path.join(base_dir, subfolder))
        .filter((el:string)=>{
            return (el.substr(-(".dae".length)) === ".dae");
        }).map((el:string)=>{
            return [path.join(subfolder , el)];
        });

    let static_list: Array<string> = ["texture_2.jpg"]
        .map((el:string)=>{
            return path.join(subfolder , el);
        });

    let scene_options = new testscene.SceneOptions(base_dir, static_list);
    let scene = new testscene.Scene(frame_list, scene_options);
    scene.zipAll();

    return scene;
})();


var obj_scene = (function(){
    let base_dir = path.join(PATHS.RES_DIR);
    let subfolder = "ball_obj";

    let frame_list: Array<string> = fs.readdirSync(path.join(base_dir, subfolder))
        .filter((el:string)=>{
            return (el.substr(-(".obj".length)) === ".obj") || (el.substr(-(".mtl".length)) === ".mtl");
        }).map((el:string)=>{
            return path.join(subfolder , el);
        });
    let grouped_frame_list: Array<Array<string>> = groupElementsByNumber(frame_list);

    let static_list: Array<string> = ["SoilBeach0087_11_S.jpg", "sor_tischdecke_720x480.jpg"]
        .map((el:string)=>{
            return path.join(subfolder , el);
        });

    let scene_options = new testscene.SceneOptions(base_dir, static_list);
    let scene = new testscene.Scene(grouped_frame_list, scene_options);
    scene.zipAll();

    return scene;
})();

var bones_scene = (function(){
    let base_dir = path.join(PATHS.RES_DIR);
    let subfolder = "bones";

    let frame_list: Array<string> = fs.readdirSync(path.join(base_dir, subfolder))
        .filter((el:string)=>{
            return el.substr(-(".dae".length)) === ".dae";
        }).map((el:string)=>{
            return path.join(subfolder , el);
        });
    let grouped_frame_list: Array<Array<string>> = groupElementsByNumber(frame_list);

    let static_list: Array<string> = ["wildtextures_short-grass-field-seamless-texture.jpg"]
        .map((el:string)=>{
            return path.join(subfolder , el);
        });

    let scene_options = new testscene.SceneOptions(base_dir, static_list);
    let scene = new testscene.Scene(grouped_frame_list, scene_options);
    scene.zipAll();

    return scene;
})();

var sink_scene = (function(){
    let base_dir = path.join(PATHS.RES_DIR);
    let subfolder = "sink";

    let frame_list: Array<string> = fs.readdirSync(path.join(base_dir, subfolder))
        .filter((el:string)=>{
            return el.substr(-(".dae".length)) === ".dae";
        }).map((el:string)=>{
            return path.join(subfolder , el);
        });
    let grouped_frame_list: Array<Array<string>> = groupElementsByNumber(frame_list);

    let static_list: Array<string> = ["floor.jpg", "granite.jpg", "wall.jpg"]
        .map((el:string)=>{
            return path.join(subfolder , el);
        });

    let scene_options = new testscene.SceneOptions(base_dir, static_list);
    let scene = new testscene.Scene(grouped_frame_list, scene_options);
    scene.zipAll();

    return scene;
})();


init();