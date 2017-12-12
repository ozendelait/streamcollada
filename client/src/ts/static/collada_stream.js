"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const THREE = require("three");
const OrbitControls = require('three-orbit-controls')(THREE);
const TextureColladaLoader = require("./texture_collada_loader");
const JSZip = require("jszip");
const ajax = require("pajax");
class ColladaStream {
    constructor(container) {
        this.ajax_options = {
            responseType: "blob",
            headers: {
                cache: false
            }
        };
        this.ajax_data = null;
        this.onLoaded = () => { };
        this.loadZip = (file, method = "get") => {
            let that = this;
            function unzip(zip) {
                function unzipTextures(zip, callback) {
                    let counter = 0;
                    let zipped_textures = zip.file(/\.(jpg|jpeg|png)$/);
                    zipped_textures.forEach((zipobj) => {
                        zipobj.async("uint8array").then((arr) => {
                            let name = zipobj.name.split('/').pop();
                            if (that.cloader.options.url_texture_map.hasOwnProperty(name)) {
                                counter++;
                                if (counter == zipped_textures.length) {
                                    callback();
                                }
                                return;
                            }
                            let ext = name.substring(name.lastIndexOf('.') + 1);
                            let blob = new Blob([arr], { type: 'image/' + ext });
                            var image = new Image();
                            image.src = URL.createObjectURL(blob);
                            image.onload = (event) => {
                                that.cloader.options.url_texture_map[name] = image;
                                counter++;
                                if (counter == zipped_textures.length) {
                                    callback();
                                }
                            };
                        });
                    });
                    if (zipped_textures.length == 0)
                        callback();
                }
                function unzipColladas(zip) {
                    zip.file(/\.(dae)$/).forEach((zipobj) => {
                        zipobj.async("text").then((text) => {
                            that.loadText(text);
                        });
                    });
                }
                unzipTextures(zip, () => {
                    unzipColladas(zip);
                });
            }
            ajax[method](file, that.ajax_data, that.ajax_options).then((response) => {
                JSZip.loadAsync(response).then(unzip);
            }, (response) => {
                console.log("Error: ", response);
            });
        };
        this.loadFile = (file, method = "get") => {
            let that = this;
            ajax[method](file, that.ajax_data, that.ajax_options).then((response) => {
                let reader = new FileReader();
                reader.addEventListener("load", (data) => {
                    that.loadText(data.target.result);
                });
                reader.readAsText(response);
            });
        };
        this.loadText = (content) => {
            let result = this.cloader.parse(content);
            this.loadColladaModel(result);
        };
        this.loadColladaModel = (model) => {
            this.loaded_obj = model.scene;
            this.loaded_obj.up = new THREE.Vector3(0, 0, 0);
            this.loaded_obj.scale.x = this.loaded_obj.scale.y = this.loaded_obj.scale.z = 150;
            this.loaded_obj.updateMatrix();
            this.onLoaded();
        };
        this.addLoaded = () => {
            this.obj = this.loaded_obj;
            this.scene.add(this.obj);
        };
        this.removeLoaded = () => {
            if (this.obj)
                this.scene.remove(this.obj);
        };
        this.clearScene = () => {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
        };
        this.addLights = () => {
            let directionalLight = new THREE.DirectionalLight(0xeeeeee, 1.0);
            directionalLight.position.x = 1;
            directionalLight.position.y = 0;
            directionalLight.position.z = 0;
            this.scene.add(directionalLight);
            let directionalLight2 = new THREE.DirectionalLight(0xeeeeee, 2.0);
            directionalLight2.position.set(-1, 0, 1);
            this.scene.add(directionalLight2);
        };
        this.render = () => {
            this.orbit.update();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.render);
        };
        this.container = container;
        this.scene = new THREE.Scene();
        this.cloader = TextureColladaLoader();
        this.cloader.options.convertUpAxis = true;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 10000);
        this.camera.position.z = 2500;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.minPolarAngle = 0;
        this.orbit.maxPolarAngle = Math.PI;
        this.orbit.minDistance = 0;
        this.orbit.maxDistance = Infinity;
        this.orbit.enableZoom = true;
        this.orbit.zoomSpeed = 1.0;
        this.orbit.enablePan = true;
        this.container.appendChild(this.renderer.domElement);
        this.addLights();
        this.render();
    }
}
exports.ColladaStream = ColladaStream;
//# sourceMappingURL=collada_stream.js.map