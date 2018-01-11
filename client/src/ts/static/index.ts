import SceneStream = require("./scene_stream");
import StreamLoader = require("./stream_loader");

const REFRESH_MS = 300;

function refresh(){
    collada_loader.loadZip("http://localhost:7070/", "post");
}

let stream = new SceneStream.SceneStream(document.body);
let collada_loader = new StreamLoader.ColladaStreamLoader(stream);
let obj_loader = new StreamLoader.ObjStreamLoader(stream);

stream.onLoaded = () : void =>{
    stream.removeCurrent();
    stream.addLoaded();
    setTimeout(refresh, REFRESH_MS);
}

refresh();
