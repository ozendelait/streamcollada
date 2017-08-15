"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = require("three");
var ColladaStream = (function () {
    function ColladaStream() {
        this.scene = new THREE.Scene();
        this.loader = new THREE.ColladaLoader();
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 0, 5);
    }
    ColladaStream.prototype.loadFile = function (file) {
        this.loader.load(file, function (collada) {
            this.scene.add(collada.scene);
        }, function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        });
    };
    ColladaStream.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    return ColladaStream;
}());
exports.ColladaStream = ColladaStream;
