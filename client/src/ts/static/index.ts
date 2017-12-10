import CSTREAM = require("./collada_stream");


function refresh(){
    stream.loadZip("http://localhost:7070/", "post");
    //stream.loadFile("http://localhost:7070/", "post");
}

let stream = new CSTREAM.ColladaStream(document.body);
stream.onLoaded = () : void =>{
    stream.removeLoaded();
    stream.addLoaded();
    //setTimeout(refresh, 1000);
}
refresh();
