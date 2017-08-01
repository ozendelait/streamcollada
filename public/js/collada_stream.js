"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var ColladaStream = (function () {
    function ColladaStream() {
        this.loader = new THREE.ColladaLoader();
        this.loader.load('models/collada/monster/monster.dae', function (collada) {
            scene.add(collada.scene);
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        });
    }
    return ColladaStream;
}());
exports.ColladaStream = ColladaStream;
