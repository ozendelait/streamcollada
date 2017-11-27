import CSTREAM = require("./collada_stream");


function refresh(){
    stream.clearScene();
    stream.loadZip("res/test.zip");
}

let stream = new CSTREAM.ColladaStream(document.body);
//1Rwindow.setInterval(refresh, 200);