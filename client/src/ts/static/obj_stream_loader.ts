import * as THREE from "three";
import {BaseStreamLoader} from "./stream_loader";
import {ISceneStream} from "./scene_stream";
const OBJLoader = require("three-obj-loader")(THREE);
const TextureMtlLoader = require("./texture_mtl_loader");


export class ObjStreamLoader extends BaseStreamLoader{
    public objloader: THREE.OBJLoader;
    public mtlloader: any;
    public MTL_EXT: RegExp;
    public stream: ISceneStream;
    static MODEL_EXT = /\.obj$/;
    static MTL_EXT = /\.mtl$/;

    constructor(stream : ISceneStream){
        super(stream);
        this.objloader = new THREE.OBJLoader();
        this.mtlloader = new TextureMtlLoader();
        this.MODEL_EXT = ObjStreamLoader.MODEL_EXT;
        this.MTL_EXT = ObjStreamLoader.MTL_EXT;
    }

    public loadModelString(content: string){
        let model = this.objloader.parse(content);
        this.loadModelObject(model);
    }
    public loadModelObject(model: THREE.Group){
        this.stream.load(model);
    }

    public loadTextureBuffer(name: string, arr: Uint8Array, callback: any){
        name = name.split('/').pop();
        // "Cache"
        if(this.mtlloader.options.url_texture_map.hasOwnProperty(name) && callback !== null){
            callback();
            return;
        }
        super.loadTextureBuffer(name, arr, callback);

    }
    public loadTextureImage(name: string, image: any, callback: any){
        this.mtlloader.options.url_texture_map[name] = image;
        super.loadTextureImage(name, image, callback);
    }


    public loadMtlString(name: string, mtl: string, callback: any){
        let materials = this.mtlloader.parse(mtl);
        materials.preload();
        this.objloader.setMaterials(materials);
        if(callback !== null)
            callback();
    }
    public loadZipMtl(zip: any, callback: any){
        let that = this;
        zip.file(this.MTL_EXT).forEach((zipobj: any)=>{
            zipobj.async("text").then((text: string)=>{
                that.loadMtlString(zipobj.name, text, callback);
            });
        });
    }
    public loadZip(zip: any){
        let that = this;

        this.loadZipTextures(zip, ()=>{
            that.loadZipMtl(zip, ()=>{
                that.loadZipModel(zip);
            })
        });
    }
}