import {BaseStreamLoader} from "./stream_loader";
import {ISceneStream} from "./scene_stream";
import * as THREE from "three";
const OBJLoader = require("three-obj-loader")(THREE);
const TextureMtlLoader = require("./texture_mtl_loader");


export class ObjStreamLoader extends BaseStreamLoader{
    protected objloader: THREE.OBJLoader;
    protected mtlloader: any;
    protected texture_map : any;
    protected MTL_EXT: RegExp;

    constructor(stream : ISceneStream){
        super(stream);
        this.objloader = new THREE.OBJLoader();
        this.mtlloader = new TextureMtlLoader();
        this.MODEL_EXT = /\.obj$/;
        this.MTL_EXT = /\.mtl$/;
        this.texture_map = {};
    }

    public loadText(content: string){
        let model = this.objloader.parse(content);
        this.loadModel(model);
    }
    public loadModel(model: THREE.Object3D){
        console.log(model);
        this.stream.load(model);
    }

    protected onUnzipTexture(name: string, arr: Uint8Array, callback: any){
        name = name.split('/').pop();
        // "Cache"
        if(this.mtlloader.options.url_texture_map.hasOwnProperty(name) && callback !== null){
            callback();
            return;
        }
        super.onUnzipTexture(name, arr, callback);

    }
    protected onUnzipLoadTexture(name: string, image: any, callback: any){
        this.mtlloader.options.url_texture_map[name] = image;
        super.onUnzipLoadTexture(name, image, callback);
    }


    protected onUnzipMtl(name: string, mtl: string, callback: any){
        let materials = this.mtlloader.parse(mtl);
        materials.preload();
        this.objloader.setMaterials(materials);
        if(callback !== null)
            callback();
    }
    protected unzipMtl(zip: any, callback: any){
        let that = this;
        zip.file(this.MTL_EXT).forEach((zipobj: any)=>{
            zipobj.async("text").then((text: string)=>{
                that.onUnzipMtl(zipobj.name, text, callback);
            });
        });
    }
    protected unzip(zip: any){
        let that = this;

        this.unzipTextures(zip, ()=>{

            that.unzipMtl(zip, ()=>{
                that.unzipModel(zip);
            })
        });
    }
}