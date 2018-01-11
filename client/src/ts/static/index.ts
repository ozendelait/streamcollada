import CSTREAM = require("./collada_stream");


const REFRESH_MS = 300;

function refresh(){
    stream.loadZip("http://localhost:7070/", "post");
}

let stream = new CSTREAM.ColladaStream(document.body);
stream.onLoaded = () : void =>{
    stream.removeCurrent();
    stream.addLoaded();
    setTimeout(refresh, REFRESH_MS);
}
refresh();
