console.log("init index.ts");

import CSTREAM = require("./collada_stream");

let stream = new CSTREAM.ColladaStream(document.body);
stream.loadFile("res/sphere.dae");


console.log("end index.ts");