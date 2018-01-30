import {SceneStream} from "./scene_stream";
import {ColladaStreamLoader} from "./collada_stream_loader";
import {ObjStreamLoader} from "./obj_stream_loader";

const REFRESH_MS = 300;

function refresh(){
    //collada_loader.loadZip("http://localhost:7070/collada", "post");
    obj_loader.loadZip("http://localhost:7070/obj", "post");
}

let stream = new SceneStream(document.body);
let collada_loader = new ColladaStreamLoader(stream);
let obj_loader = new ObjStreamLoader(stream);

stream.onLoaded = () : void =>{
    stream.removeCurrent();
    stream.addLoaded();
    setTimeout(refresh, REFRESH_MS);
}

refresh();
