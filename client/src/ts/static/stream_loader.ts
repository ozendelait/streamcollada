import TextureColladaLoader = require("./texture_collada_loader");
import SceneStream = require("./collada_stream");
import {OBJLoader2} from "three";
import {strictEqual} from "assert";
const ajax = require("pajax");
const JSZip= require("jszip");

export interface IStreamLoader{
    loadZip(file: string, method: string) : void;
    loadFile(file: string, method: string) : void;
    loadText(content: string) : void;
    loadModel(model: THREE.Object3D) : void;
}

export abstract class BaseStreamLoader implements IStreamLoader{
    public stream: SceneStream.ISceneStream;
    public ajax_options: object;
    public ajax_data : object;
    public TEXTURE_EXT: RegExp;
    public MODEL_EXT: RegExp;

    constructor(stream : SceneStream.ISceneStream){
        this.stream =  stream;
        this.ajax_options = {
            responseType : "blob", //"uint8array"
            headers : {
                cache: false
            }
        }
        this.ajax_data = null;
        this.TEXTURE_EXT = /\.(jpg|jpeg|png)$/;
        this.MODEL_EXT = /\.$/;
    }

    protected onUnzipLoadTexture(name: string, image: any, callback: any){
        if(callback !== null)
            callback();
    }
    protected onUnzipTexture(name: string, arr: Uint8Array, callback: any){
        let that = this;

        let ext = name.substring(name.lastIndexOf('.')+1);
        let blob = new Blob([arr], {type: 'image/' + ext});

        let image = new Image();
        image.src = URL.createObjectURL(blob);
        image.onload = (event) => {
            that.onUnzipLoadTexture(name, image, callback)
        };
    }
    protected onUnzipModel(model: string){
        this.loadText(model);
    }
    loadZip(file: string, method: string){
        let that = this;
        function unzip(zip: any){
            function unzipTextures(zip: any, callback: any){
                let counter = 0;
                let cb;
                let zipped_textures = zip.file(that.TEXTURE_EXT);
                zipped_textures.forEach((zipobj: any) => {
                    zipobj.async("uint8array").then( (arr: any) => {
                        counter++;
                        cb = ((counter == zipped_textures.length) ? callback : null);
                        that.onUnzipTexture(zipobj.name, arr, cb);
                    });
                });
                if(zipped_textures.length == 0)
                    callback()
            }
            function unzipColladas(zip: any){
                zip.file(that.MODEL_EXT).forEach((zipobj: any)=>{
                    zipobj.async("text").then((text: string)=>{
                        that.onUnzipModel(text);
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
    loadFile(file: string, method: string){
        let that = this;
        ajax[method](file, that.ajax_data, that.ajax_options).then((response: any) => {
            let reader = new FileReader();
            reader.addEventListener("load", (data: any) => {
                that.loadText(data.target.result);
            });
            reader.readAsText(response);

        });
    }
    loadModel(model: THREE.Object3D){
        this.stream.load(model);
    }
    abstract loadText(content: string) : void;
}

export class ColladaStreamLoader extends BaseStreamLoader{
    protected cloader: any;

    constructor(stream : SceneStream.ISceneStream){
        super(stream);
        this.cloader = TextureColladaLoader();
        this.cloader.options.convertUpAxis = true;
        this.MODEL_EXT = /\.(dae)$/;
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
    loadText(content: string){
        this.loadModel(this.cloader.parse(content));
    }
    loadModel(model: THREE.Object3D){
        this.stream.load(model.scene);
    }
}

export class ObjStreamLoader extends BaseStreamLoader{
    protected objloader: any;
    protected texture_map : any;

    constructor(stream : SceneStream.ISceneStream){
        super(stream);
        this.objloader = OBJLoader2();
        this.MODEL_TXT = /\.(obj|mtl)$/;
        this.texture_map = {};
    }

    protected onUnzipTexture(name: string, arr: Uint8Array, callback: any){
        name = name.split('/').pop();
        // "Cache"
        if(this.texture_map.hasOwnProperty(name) && callback !== null){
            callback();
            return;
        }
        super.onUnzipTexture(name, arr, callback);

    }
    protected onUnzipLoadTexture(name: string, image: any, callback: any){
        this.texture_map[name] = image;
        super.onUnzipLoadTexture(name, image, callback);
    }
    loadText(content: string){
        this.loadModel(this.objloader.parse(content));
    }
    loadModel(model: THREE.Object3D){
        console.log("loadModel", model);
        //this.stream.load(model);
    }
}