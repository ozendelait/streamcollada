import * as THREE from "three";
const OrbitControls = require('three-orbit-controls')(THREE);


export type ThreeObject = THREE.Object3D

export interface ISceneStream{
    load(scene_name: string, scene: THREE.Object3D) : void;
}

interface ILabeledScene{
    scene: ThreeObject;
    name: string;
}



export class SceneStream implements ISceneStream{

    protected scene: THREE.Scene;
    protected camera: THREE.Camera;
    protected orbit: any;
    protected renderer: THREE.WebGLRenderer;
    protected container: HTMLElement;

    protected loaded_scene : ILabeledScene | null;
    public scenes : Array<ILabeledScene>;

    constructor(container: HTMLElement){
        this.container = container;
        this.scenes = [];
        this.loaded_scene = null;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 10000 );
        this.camera.position.z = 2500;

        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        // How far you can orbit vertically, upper and lower limits.
        this.orbit.minPolarAngle = 0;
        this.orbit.maxPolarAngle = Math.PI;
        // How far you can dolly in and out ( PerspectiveCamera only )
        this.orbit.minDistance = 0;
        this.orbit.maxDistance = Infinity;
        this.orbit.enableZoom = true; // Set to false to disable zooming
        this.orbit.zoomSpeed = 1.0;
        this.orbit.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations)

        this.container.appendChild(this.renderer.domElement);

        this.addLights();

        this.render();
    }

    public resize(width: number, height: number) : void{
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    public getSceneIdByName(scene_name: string) : number{
        return this.scenes.findIndex((lscene: ILabeledScene)=>{
            return lscene.name == scene_name;
        });
    }
    public onLoaded(scene_name: string) : void{}

    public load(scene_name: string, scene : ThreeObject) : void{
        scene.up = new THREE.Vector3(0, 0, 0);
        scene.scale.x = scene.scale.y = scene.scale.z = 150;
        scene.updateMatrix();
        this.loaded_scene = {
            scene : scene,
            name : scene_name
        };

        this.onLoaded(scene_name);
    }

    public addLoaded() : void{
        let scene_id :number = this.getSceneIdByName(this.loaded_scene.name);
        if(scene_id === -1){
            this.scenes.push(this.loaded_scene);
        }else{
            this.clearScene(this.scenes[scene_id].name);
            this.scenes[scene_id] = this.loaded_scene;
        }
        this.scene.add(this.loaded_scene.scene);

    }

    public clearScene(scene_name?: string) : void{
        console.log("ClearScene", scene_name)
        if(scene_name){
            let scene_id :number = this.getSceneIdByName(this.loaded_scene.name);
            if(scene_id === -1)
                return;
            this.removeThreeObject(this.scenes[scene_id].scene);
            return;
        }

        while(this.scene.children.length > 0){
            this.removeThreeObject(this.scene.children[0]);
        }
    }

    public addLights() : void{
        // Add some lights to the scene
        let directionalLight = new THREE.DirectionalLight(0xeeeeee , 1.0);
        directionalLight.position.x = 1;
        directionalLight.position.y = 0;
        directionalLight.position.z = 0;
        this.scene.add( directionalLight );

        let directionalLight2 = new THREE.DirectionalLight(0xeeeeee, 2.0);
        // A different way to specify the position:
        directionalLight2.position.set(-1, 0, 1);
        this.scene.add( directionalLight2 );
    }


    protected removeThreeObject(obj : ThreeObject, parent?: ThreeObject) : void{
        if(obj){
            if(obj.children){
                while(obj.children.length > 0){
                    this.removeThreeObject(obj.children[0], obj);
                }
            }
            if(obj.geometry){
                obj.geometry.dispose();
                obj.geometry = undefined;
            }
            if(obj.mesh){
                obj.mesh.dispose();
                obj.mesh = undefined;
            }
            if(obj.material){
                if(obj.material.map){
                    obj.material.map.dispose();
                    obj.material.map = undefined
                }
                obj.material.dispose();
                obj.material = undefined;
            }
            if(obj.texture){
                obj.texture.dispose();
                obj.texture = undefined;
            }
            (parent || this.scene).remove(obj);
            if(obj.dispose)
                obj.dispose();
            obj = undefined;
        }
    }

    protected render() : void{
        this.orbit.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(()=>{this.render()});
    }
}
