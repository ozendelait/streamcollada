import {SceneStream} from "./scene_stream";
import {BaseStreamLoader, IStreamLoader} from "./stream_loader";
import {ColladaStreamLoader} from "./collada_stream_loader";
import {ObjStreamLoader} from "./obj_stream_loader";
import {isBoolean} from "util";
import Timer = NodeJS.Timer;


const BASE_URL = "http://localhost:7070/";
const CANVAS_CONTAINER : HTMLElement = document.body;

BaseStreamLoader.STREAM_LOADERS = [ObjStreamLoader, ColladaStreamLoader];


class Navigation{
    public static NAV_CONTAINER: HTMLElement = document.getElementById("navigation-box");

    constructor(){
        this.bindEvents();
    }

    protected bindEvents() : void{
        let that = this;
        let table_el : HTMLTableElement = Navigation.NAV_CONTAINER.getElementsByTagName("table")[0];
        let row_count=0;
        let row : HTMLTableRowElement;

        while(row = table_el.rows[row_count++]){
            // Checkbox | Label | UpdateStep

            let checkbox_el : HTMLInputElement = row.cells[0].getElementsByTagName("input")[0];
            let update_el : HTMLInputElement = row.cells[2].getElementsByTagName("input")[0];

            checkbox_el.addEventListener("click", (event)=>{
                let trow : HTMLTableRowElement = event.target.parentNode.parentNode;
                let checked : boolean = trow.cells[0].getElementsByTagName("input")[0].checked;
                let label : string = trow.cells[1].getElementsByTagName("label")[0].innerText;
                let update_step :number = parseInt(trow.cells[2].getElementsByTagName("input")[0].value);

                that.onClick(label, checked, update_step);
            });
            update_el.addEventListener("input", (event)=>{
                let trow : HTMLTableRowElement = event.target.parentNode.parentNode;
                let checked : boolean = trow.cells[0].getElementsByTagName("input")[0].checked;
                let label : string = trow.cells[1].getElementsByTagName("label")[0].innerText;
                let update_step :number = parseInt(trow.cells[2].getElementsByTagName("input")[0].value);

                that.onUpdate(label, checked, update_step);
            })
        }
    }
    public onClick(name: string, active: boolean, update_milli: number) : void{

    }
    public onUpdate(name: string, active: boolean, update_milli: number) : void{

    }
}

interface ISceneContainer{
    loader: IStreamLoader | null;
    path: string;
    refresh_milli: number;
    timeout_id: number;
}

class StreamDisplay{
    public stream : SceneStream;
    public loader : IStreamLoader;
    public navigation : Navigation;
    public scenes: {[name: string] : ISceneContainer};

    constructor(){
        let that = this;
        this.scenes = {};
        this.stream = new SceneStream(CANVAS_CONTAINER);
        this.stream.onLoaded = this.streamOnLoaded;
        this.navigation = new Navigation();

        this.navigation.onClick = function(name: string, active: boolean, update_milli: number){
            if(!active){
                that.cancelRefresh(name);
                that.stream.clearScene(name);
                delete that.scenes[name];
                return;
            }
            if(!(name in that.scenes)){
                that.scenes[name] = {
                    loader: null,
                    path: name,
                    refresh_milli: update_milli,
                    timeout_id: 0
                }
            }
            that.cancelRefresh(name);
            that.setRefresh(name, update_milli);
            that.setStreamLoader(name);
        }
        this.navigation.onUpdate = function(name: string, active: boolean, update_milli: number){
            if(!active)
                return;
            that.cancelRefresh(name);
            that.setRefresh(name, update_milli);
            that.refresh(name);
        }

        window.addEventListener("resize", (event) =>{
            that.stream.resize(CANVAS_CONTAINER.clientWidth, CANVAS_CONTAINER.clientHeight);
        });
    }

    public refresh(scene_name: string) : void{
        console.log("REFRESH", scene_name)
        let scenecon : ISceneContainer = this.scenes[scene_name];
        scenecon.loader.setSceneName(scenecon.path);
        scenecon.loader.loadZipFile(BASE_URL + scenecon.path, "post")
    }
    public cancelRefresh(scene_name: string) : void{
        let t_id = this.scenes[scene_name].timeout_id;
        if(t_id != 0)
            window.clearTimeout(t_id);
    }
    public setRefresh(scene_name: string, refresh_milli: number) : void{
        this.scenes[scene_name].refresh_milli = refresh_milli;
    }
    public streamOnLoaded(scene_name: string){
        let that = this;
        this.stream.addLoaded();
        let refresh_milli : number = this.scenes[scene_name].refresh_milli;
        if(refresh_milli > 0){
            this.cancelRefresh(scene_name);
            this.scenes[scene_name].timeout_id = window.setTimeout(()=>{
                that.refresh(scene_name);
            }, refresh_milli);
        }
    }
    public setStreamLoader(scene_name: string){
        let that = this;
        let current_url = BASE_URL + this.scenes[scene_name].path;
        BaseStreamLoader.getStreamLoaderFromZipFile(this.stream, current_url, "post", (sloader: BaseStreamLoader)=>{
            that.stream.onLoaded = that.streamOnLoaded.bind(that);
            this.scenes[scene_name].loader = sloader;
            that.refresh(scene_name);
        });
    }
}


var stream_display = new StreamDisplay();