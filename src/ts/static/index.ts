import CSTREAM = require("./collada_stream");


function refresh(){
    stream.loadZip("res/test.zip");
}

let stream = new CSTREAM.ColladaStream(document.body);
stream.onLoaded = () : void =>{
    stream.removeLoaded();
    stream.addLoaded();
    setTimeout(refresh, 1000);
}
refresh();