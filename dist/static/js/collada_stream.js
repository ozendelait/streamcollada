"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("init collada_stream.ts");
var THREE = require("three");
this.scene = new THREE.Scene();
this.loader = new THREE.ColladaLoader();
console.log("end collada_steam.ts");
var ColladaStream = (function () {
    function ColladaStream() {
    }
    return ColladaStream;
}());
exports.ColladaStream = ColladaStream;
