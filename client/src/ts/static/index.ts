import CSTREAM = require("./collada_stream");


function refresh(){
    stream.loadZip("localhost:7070");
}

let stream = new CSTREAM.ColladaStream(document.body);
stream.onLoaded = () : void =>{
    stream.removeLoaded();
    stream.addLoaded();
    setTimeout(refresh, 1000);
}
refresh();