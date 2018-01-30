import {ISceneStream, ColladaObjects} from "./scene_stream";
const ajax = require("pajax");
const JSZip= require("jszip");


export interface IStreamLoader{
    stream: ISceneStream;
    MODEL_EXT: RegExp;

    loadZipFile(file: string, method: string) : void;
    loadZip(zip: any) : void;
    loadZipModel(zip: any) : void;
    loadFile(file: string, method: string) : void;
    loadModelString(content: string) : void;
    loadModelObject(model: THREE.Object3D) : void;
}

export abstract class BaseStreamLoader implements IStreamLoader{
    public stream: ISceneStream;
    public ajax_options: object;
    public ajax_data : object;
    public TEXTURE_EXT: RegExp;
    public MODEL_EXT: RegExp;
    static AXAJ_OPTIONS = {
        responseType : "blob", //"uint8array"
        headers : {
            cache: false
        }
    };
    static STREAM_LOADERS: Array<IStreamLoader> = [];

    static getStreamLoaderFromFile(stream: ISceneStream, file: string): IStreamLoader|null{
        let stream_loader: BaseStreamLoader = null;
        BaseStreamLoader.STREAM_LOADERS.forEach((sloader: any)=>{
            if(file.match(sloader.MODEL_EXT).index > 0){
                stream_loader = new sloader(stream);
            }
        });
        return stream_loader;
    }
    static getStreamLoaderFromZipFile(stream: ISceneStream, file: string, method: string, done_cb:any): void{
        let that = this;
        ajax[method](file, null, BaseStreamLoader.AXAJ_OPTIONS).then(
            (response: any) => {
                JSZip.loadAsync(response).then((zip: any)=>{
                    done_cb(BaseStreamLoader.getStreamLoaderFromZip(stream, zip));
                })
            }, (response: any) => {
                console.log("Error: ", response);
            }
        );
    }
    static getStreamLoaderFromZip(stream: ISceneStream, zip: any): IStreamLoader|null{
        let stream_loader: BaseStreamLoader = null;
        BaseStreamLoader.STREAM_LOADERS.forEach((sloader: any)=>{
            if(zip.file(sloader.MODEL_EXT).length > 0){
                stream_loader = new sloader(stream);
            }
        });
        return stream_loader;
    }

    constructor(stream : ISceneStream){
        this.stream =  stream;
        this.ajax_options = BaseStreamLoader.AXAJ_OPTIONS;
        this.ajax_data = null;
        this.TEXTURE_EXT = /\.(jpg|jpeg|png)$/;
        this.MODEL_EXT = /\.$/;
    }

    public loadZipFile(file: string, method: string){
        let that = this;
        ajax[method](file, this.ajax_data, this.ajax_options).then(
            (response: any) => {
                JSZip.loadAsync(response).then((zip: any)=>{that.loadZip(zip)})
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
                that.loadModelString(data.target.result);
            });
            reader.readAsText(response);

        });
    }
    public loadModelObject(model: ColladaObjects){
        this.stream.load(model);
    }
    public abstract loadModelString(content: string) : void;


    public loadTextureImage(name: string, image: any, callback: any){
        if(callback !== null)
            callback();
    }
    public loadTextureBuffer(name: string, arr: Uint8Array, callback: any){
        let that = this;

        let ext = name.substring(name.lastIndexOf('.')+1);
        let blob = new Blob([arr], {type: 'image/' + ext});

        let image = new Image();
        image.src = URL.createObjectURL(blob);
        image.onload = (event) => {
            that.loadTextureImage(name, image, callback)
        };
    }
    public loadZipTextures(zip: any, callback: any){
        let that = this;
        let counter = 0;
        let cb;
        let zipped_textures = zip.file(this.TEXTURE_EXT);
        zipped_textures.forEach((zipobj: any) => {
            zipobj.async("uint8array").then( (arr: any) => {
                counter++;
                cb = ((counter == zipped_textures.length) ? callback : null);
                that.loadTextureBuffer(zipobj.name, arr, cb);
            });
        });
        if(zipped_textures.length == 0 && callback)
            callback()
    }
    public loadZipModel(zip: any){
        let that = this;
        zip.file(this.MODEL_EXT).forEach((zipobj: any)=>{
            zipobj.async("text").then((text: string)=>{
                that.loadModelString(text);
            });
        });
    }
    public loadZip(zip: any){
        let that = this;
        this.loadZipTextures(zip, ()=>{
            that.loadZipModel(zip);
        });
    }
}