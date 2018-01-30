import {ISceneStream} from "./scene_stream";
const ajax = require("pajax");
const JSZip= require("jszip");


export interface IStreamLoader{
    loadZip(file: string, method: string) : void;
    loadFile(file: string, method: string) : void;
    loadText(content: string) : void;
    loadModel(model: THREE.Object3D) : void;
}

export abstract class BaseStreamLoader implements IStreamLoader{
    public stream: ISceneStream;
    public ajax_options: object;
    public ajax_data : object;
    public TEXTURE_EXT: RegExp;
    protected MODEL_EXT: RegExp;

    constructor(stream : ISceneStream){
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

    public loadZip(file: string, method: string){
        let that = this;
        ajax[method](file, this.ajax_data, this.ajax_options).then(
            (response: any) => {
                JSZip.loadAsync(response).then((zip: any)=>{that.unzip(zip)})
            }, (response: any) => {
                console.log("Error: ", response);
            }
        );
    }
    public loadFile(file: string, method: string){
        let that = this;
        ajax[method](file, that.ajax_data, that.ajax_options).then((response: any) => {
            let reader = new FileReader();
            reader.addEventListener("load", (data: any) => {
                that.loadText(data.target.result);
            });
            reader.readAsText(response);

        });
    }
    public loadModel(model: THREE.Object3D){
        this.stream.load(model);
    }
    public abstract loadText(content: string) : void;


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
    protected unzipTextures(zip: any, callback: any){
        let that = this;
        let counter = 0;
        let cb;
        let zipped_textures = zip.file(this.TEXTURE_EXT);
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
    protected unzipModel(zip: any){
        let that = this;
        zip.file(this.MODEL_EXT).forEach((zipobj: any)=>{
            zipobj.async("text").then((text: string)=>{
                that.onUnzipModel(text);
            });
        });
    }
    protected unzip(zip: any){
        let that = this;
        this.unzipTextures(zip, ()=>{
            that.unzipModel(zip);
        });
    }
}


