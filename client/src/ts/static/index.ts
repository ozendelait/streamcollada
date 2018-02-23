import {SceneStream} from "./scene_stream";
import {BaseStreamLoader, IStreamLoader} from "./stream_loader";
import {ColladaStreamLoader} from "./collada_stream_loader";
import {ObjStreamLoader} from "./obj_stream_loader";


let REFRESH_MS = 200;
const BASE_URL = "http://localhost:7070/";
const CANVAS_CONTAINER : HTMLElement = document.body;

let current_url: string = "";
BaseStreamLoader.STREAM_LOADERS = [ObjStreamLoader, ColladaStreamLoader];


class Navigation{
    public static NAV_CONTAINER: HTMLElement = document.getElementById("navigation-box");

    constructor(){
        this.bindEvents();
    }

    protected bindEvents() : void{
        let that = this;
        let table_el : HTMLTableElement = this.NAV_CONTAINER.getElementsByTagName("table")[0];
        let row_count=0;
        let row : HTMLTableRowElement;

        while(row = table_el.rows[row_count++]){
            // Checkbox | Label | UpdateStep
            let checkbox_el : HTMLInputElement = row.cells[0].getElementsByTagName("input")[0];
            let label_el : HTMLInputElement = row.cells[0].getElementsByTagName("input")[0];
            let update_el : HTMLInputElement = row.cells[2].getElementsByTagName("input")[0];

            checkbox_el.addEventListener("click", (event)=>{
                that.onClick(label_el.innerText, checkbox_el.checked, parseInt(update_el.value));
            });
            update_el.addEventListener("change", (event)=>{
                that.onUpdate(label_el.innerText, checkbox_el.checked, parseInt(update_el.value));
            })
        }
    }
    public onClick(name: string, active: boolean, update_milli: number) : void{

    }
    public onUpdate(name: string, active: boolean, update_milli: number) : void{

    }
}


function refresh(){
    //collada_loader.loadZip("http://localhost:7070/collada", "post");
    //obj_loader.loadZipFile("http://localhost:7070/obj", "post");
    loader.loadZipFile(current_url, "post");
}
function streamOnLoaded(){
    stream.removeCurrent();
    stream.addLoaded();
    setTimeout(refresh, REFRESH_MS);
}
function receivedStreamLoader(sloader: BaseStreamLoader){
    stream.onLoaded = streamOnLoaded;
    loader = sloader;
    refresh();
}
function setStreamLoader(url_hash: string){
    current_url = BASE_URL+url_hash;
    BaseStreamLoader.getStreamLoaderFromZipFile(stream, current_url, "post", receivedStreamLoader);
}

window.onhashchange = function(e) {
    setStreamLoader(window.location.hash.substring(1));
}


let stream = new SceneStream(CANVAS_CONTAINER);
stream.onLoaded = streamOnLoaded;
let loader: IStreamLoader;
setStreamLoader(window.location.hash.substring(1));
window.addEventListener("resize", (event) =>{
    stream.resize(CANVAS_CONTAINER.clientWidth, CANVAS_CONTAINER.clientHeight);
});


let navigation = new Navigation();

navigation.onClick = function(name: string, active: boolean, update_milli: number){
    REFRESH_MS = update_milli;
    BaseStreamLoader.getStreamLoaderFromZipFile(stream, name, "post", receivedStreamLoader);
}
navigation.onUpdate = function(name: string, active: boolean, update_milli: number){
    REFRESH_MS = update_milli;
}