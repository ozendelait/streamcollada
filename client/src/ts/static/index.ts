import {SceneStream} from "./scene_stream";
import {BaseStreamLoader, IStreamLoader} from "./stream_loader";
import {ColladaStreamLoader} from "./collada_stream_loader";
import {ObjStreamLoader} from "./obj_stream_loader";


const REFRESH_MS = 200;
BaseStreamLoader.STREAM_LOADERS = [ObjStreamLoader, ColladaStreamLoader];
const BASE_URL = "http://localhost:7070/"
let current_url: string = "";

function refresh(){
    //collada_loader.loadZip("http://localhost:7070/collada", "post");
    //obj_loader.loadZipFile("http://localhost:7070/obj", "post");
    loader.loadZipFile(current_url, "post");
}
function streamOnLoaded(){
    stream.removeCurrent();
    stream.addLoaded();
    setTimeout(refresh, REFRESH_MS);
}
function receivedStreamLoader(sloader: BaseStreamLoader){
    stream.onLoaded = streamOnLoaded;
    loader = sloader;
    refresh();
}
function setStreamLoader(url_hash: string){
    current_url = BASE_URL+url_hash;
    BaseStreamLoader.getStreamLoaderFromZipFile(stream, current_url, "post", receivedStreamLoader);
}

window.onhashchange = function(e) {
    setStreamLoader(window.location.hash.substring(1));
}


let stream = new SceneStream(document.body);
stream.onLoaded = streamOnLoaded;
let loader: IStreamLoader;
setStreamLoader(window.location.hash.substring(1));
//let collada_loader = new ColladaStreamLoader(stream);
//let obj_loader = new ObjStreamLoader(stream);
