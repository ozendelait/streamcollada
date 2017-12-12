"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CSTREAM = require("./collada_stream");
const REFRESH_MS = 500;
function refresh() {
    stream.loadZip("http://localhost:7070/", "post");
}
let stream = new CSTREAM.ColladaStream(document.body);
stream.onLoaded = () => {
    stream.removeLoaded();
    stream.addLoaded();
    setTimeout(refresh, REFRESH_MS);
};
refresh();
//# sourceMappingURL=index.js.map