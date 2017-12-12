const JSZip= require("jszip");
const fs = require("fs");
import * as path from "path";


export function zipToDisk(files: Array<string>, dest: string, base_dir: string=""){
    let zip = new JSZip();
    let options = {binary: true};
    files.forEach((el:string)=>{
        options.binary = (el.match(/\.(jpg|jpeg|png)$/) !== null);
        zip.file(el, fs.readFileSync(path.join(base_dir, el)), options);
    });
    zip.generateNodeStream({type:'nodebuffer', streamFiles: false})
        .pipe(fs.createWriteStream(path.join(base_dir, dest)));
}



export class SceneOptions implements ISceneOptions{
    constructor(base_dir: string = "", static_list: Array<string> = []){
        this.base_dir = base_dir;
        this.static_list = static_list;
    }
    base_dir: string;
    static_list: Array<string>;
};

export interface ISceneOptions{
    base_dir: string;
    static_list: Array<string>;
};

export class Scene{
    protected path_list : Array<string>;
    protected counter: number;
    public options: ISceneOptions;

    constructor(path_list: Array<string>, options:ISceneOptions=new SceneOptions()){
        this.path_list = path_list;
        this.options = options;
        this.counter = 0;
    }

    protected replaceExtWithZip(str: string) : string {
        return (str.substr(0, str.lastIndexOf('.')) || str) + ".zip";
    }

    public zipAll(callback=()=>{}){
        let that = this;
        let counter = 0;

        this.path_list.forEach((_path: string) => {
            if(_path.substr(-(".zip".length)) !== ".zip"){
                let path_zip = that.replaceExtWithZip(_path);
                let full_path_zip = path.join(that.options.base_dir, path_zip);

                if(!fs.existsSync(full_path_zip)){
                    let files = that.options.static_list.concat([_path]);
                    zipToDisk(files, path_zip, that.options.base_dir);
                    if(counter >= that.path_list.length){
                        callback();
                        return;
                    }
                    counter++;

                }
            }
        })
        callback();

    }

    public getNext() : string {
        this.counter++;
        if (this.counter >= this.path_list.length)
            this.counter = 0;
        return this.replaceExtWithZip(this.path_list[this.counter]);
    }
}