import * as THREE from "three";
import {BaseStreamLoader} from "./stream_loader";
import {ISceneStream} from "./scene_stream";
const TextureColladaLoader = require("./texture_collada_loader");


export class ColladaStreamLoader extends BaseStreamLoader{
    public cloader: THREE.ColladaLoader;
    public mixer: THREE.AnimationMixer | null;
    public stream: ISceneStream;
    static MODEL_EXT = /\.(dae)$/;

    constructor(stream : ISceneStream){
        super(stream);
        this.stream = stream;
        this.cloader = TextureColladaLoader();
        this.cloader.options.convertUpAxis = true;
        this.mixer = null;
        this.MODEL_EXT = ColladaStreamLoader.MODEL_EXT;
    }

    public loadModelString(content: string){
        this.loadModelObject(this.cloader.parse(content));
    }
    public loadModelObject(model: THREE.ColladaModel){
        console.log(model);
        this.stream.load(model.scene);
        if(model.animations.length > 0){

            //this.mixer = new THREE.AnimationMixer(model.scene.children[0]);
            //console.log(this.mixer)
            //let clip : THREE.AnimationAction = this.mixer.clipAction(model.animations[0]);
            //clip.play();
        }
    }

    public loadTextureBuffer(name: string, arr: Uint8Array, callback: any){
        name = name.split('/').pop();
        // "Cache"
        if(this.cloader.options.url_texture_map.hasOwnProperty(name) && callback !== null){
            callback();
            return;
        }
        super.loadTextureBuffer(name, arr, callback);

    }
    public loadTextureImage(name: string, image: any, callback: any){
        this.cloader.options.url_texture_map[name] = image;
        super.loadTextureImage(name, image, callback);
    }
}