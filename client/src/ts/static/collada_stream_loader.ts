import {BaseStreamLoader} from "./stream_loader";
import {ISceneStream} from "./scene_stream";
const TextureColladaLoader = require("./texture_collada_loader");


export class ColladaStreamLoader extends BaseStreamLoader{
    protected cloader: any;

    constructor(stream : ISceneStream){
        super(stream);
        this.cloader = TextureColladaLoader();
        this.cloader.options.convertUpAxis = true;
        this.MODEL_EXT = /\.(dae)$/;
    }

    public loadText(content: string){
        this.loadModel(this.cloader.parse(content));
    }
    public loadModel(model: THREE.Object3D){
        console.log(model.scene);
        this.stream.load(model.scene);
    }


    protected onUnzipTexture(name: string, arr: Uint8Array, callback: any){
        name = name.split('/').pop();
        // "Cache"
        if(this.cloader.options.url_texture_map.hasOwnProperty(name) && callback !== null){
            callback();
            return;
        }
        super.onUnzipTexture(name, arr, callback);

    }
    protected onUnzipLoadTexture(name: string, image: any, callback: any){
        this.cloader.options.url_texture_map[name] = image;
        super.onUnzipLoadTexture(name, image, callback);
    }
}