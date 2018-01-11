import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
//const ColladaLoader = require('three-collada-loader');
import TextureColladaLoader = require("./texture_collada_loader");
const JSZip= require("jszip");
const ajax = require("pajax");


export class ColladaStream{

    protected scene: THREE.Scene;
    protected camera: THREE.Camera;
    protected orbit: any;
    protected renderer: THREE.WebGLRenderer;
    protected cloader: any;
    protected container: HTMLElement;

    protected loaded_scene : THREE.Scene;
    protected current_scene : THREE.Scene;

    public ajax_options = {
        responseType : "blob", //"uint8array"
        headers : {
            cache: false
        }
    }
    public ajax_data : object = null;

    constructor(container: HTMLElement){
        this.container = container;

        this.scene = new THREE.Scene();

        this.cloader = TextureColladaLoader();
        this.cloader.options.convertUpAxis = true;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 10000 );
        this.camera.position.z = 2500;

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // How far you can orbit vertically, upper and lower limits.
        this.orbit.minPolarAngle = 0;
        this.orbit.maxPolarAngle = Math.PI;
        // How far you can dolly in and out ( PerspectiveCamera only )
        this.orbit.minDistance = 0;
        this.orbit.maxDistance = Infinity;
        this.orbit.enableZoom = true; // Set to false to disable zooming
        this.orbit.zoomSpeed = 1.0;
        this.orbit.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations)

        this.container.appendChild(this.renderer.domElement);

        this.addLights();

        this.render();
    }

    public onLoaded = () : void => {}

    public loadZip = (file: string, method="get") : void => {
        let that = this;
        function unzip(zip: any){
            function unzipTextures(zip: any, callback: any){
                let counter = 0;
                let zipped_textures = zip.file(/\.(jpg|jpeg|png)$/);
                zipped_textures.forEach((zipobj: any) => {
                    zipobj.async("uint8array").then( (arr: any) => {
                        let name = zipobj.name.split('/').pop();

                        // "Cache"
                        if(that.cloader.options.url_texture_map.hasOwnProperty(name)){
                            counter++;
                            if(counter == zipped_textures.length){
                                callback();
                            }
                            return;
                        }
                        let ext = name.substring(name.lastIndexOf('.')+1);
                        let blob = new Blob([arr], {type: 'image/' + ext});


                        var image = new Image();
                        image.src = URL.createObjectURL(blob);
                        image.onload = (event) => {
                            that.cloader.options.url_texture_map[name] = image;
                            counter++;
                            if(counter == zipped_textures.length){
                                callback();
                            }
                        };
                    });
                });
                if(zipped_textures.length == 0)
                    callback()
            }
            function unzipColladas(zip: any){
                zip.file(/\.(dae)$/).forEach((zipobj: any)=>{
                    zipobj.async("text").then((text: string)=>{
                        that.loadText(text);
                    });
                });
            }

            unzipTextures(zip, ()=>{
                unzipColladas(zip);
            });
        }

        ajax[method](file, that.ajax_data, that.ajax_options).then(
            (response: any) => {
                JSZip.loadAsync(response).then(unzip)
            }, (response: any) => {
                console.log("Error: ", response);
            }
        );
    }

    public loadFile = (file: string, method="get") : void => {
        let that = this;

        ajax[method](file, that.ajax_data, that.ajax_options).then((response: any) => {
            let reader = new FileReader();
            reader.addEventListener("load", (data: any) => {
                that.loadText(data.target.result);
            });
            reader.readAsText(response);

        });
    }

    public loadText = (content: string) : void => {
        let result = this.cloader.parse(content);
        this.loadColladaModel(result);
    }

    public loadColladaModel = (model: THREE.ColladaModel) : void => {
        this.loaded_scene = model.scene;
        this.loaded_scene.up = new THREE.Vector3(0, 0, 0);
        this.loaded_scene.scale.x = this.loaded_scene.scale.y = this.loaded_scene.scale.z = 150;
        this.loaded_scene.updateMatrix();
        this.onLoaded();
    }

    public addLoaded = () : void => {
        this.current_scene = this.loaded_scene;
        this.scene.add(this.loaded_scene);
    }

    public removeCurrent = () : void => {
        this.removeThreeObject(this.current_scene);
        this.current_scene = undefined;
    }

    public clearScene = () : void =>{
        while(this.scene.children.length > 0){
            this.removeThreeObject(this.scene.children[0]);
        }
    }

    public addLights = () : void => {
        // Add some lights to the scene
        let directionalLight = new THREE.DirectionalLight(0xeeeeee , 1.0);
        directionalLight.position.x = 1;
        directionalLight.position.y = 0;
        directionalLight.position.z = 0;
        this.scene.add( directionalLight );

        let directionalLight2 = new THREE.DirectionalLight(0xeeeeee, 2.0);
        // A different way to specify the position:
        directionalLight2.position.set(-1, 0, 1);
        this.scene.add( directionalLight2 );
    }


    protected removeThreeObject = (obj : THREE.Object3D, parent?: THREE.Object3D | THREE.Scene) : void => {
        if(obj){
            if(obj.children){
                while(obj.children.length > 0){
                    this.removeThreeObject(obj.children[0], obj);
                }
            }
            if(obj.geometry){
                obj.geometry.dispose();
                obj.geometry = undefined;
            }
            if(obj.mesh){
                obj.mesh.dispose();
                obj.mesh = undefined;
            }
            if(obj.material){
                if(obj.material.map){
                    obj.material.map.dispose();
                    obj.material.map = undefined
                }
                obj.material.dispose();
                obj.material = undefined;
            }
            if(obj.texture){
                obj.texture.dispose();
                obj.texture = undefined;
            }
            (parent || this.scene).remove(obj);
            if(obj.dispose)
                obj.dispose();
            obj = undefined;
        }
    }

    protected render = () : void => {
        this.orbit.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }
}
