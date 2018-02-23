import * as THREE from "three";
const OrbitControls = require('three-orbit-controls')(THREE);


export interface ISceneStream{
    load(scene: THREE.Object3D) : void;
}

export type ColladaObjects = THREE.Scene | THREE.ColladaModel | THREE.Object3D | THREE.Group;

export class SceneStream implements ISceneStream{

    protected scene: THREE.Scene;
    protected camera: THREE.Camera;
    protected orbit: any;
    protected renderer: THREE.WebGLRenderer;
    protected container: HTMLElement;

    protected loaded_scene : ColladaObjects;
    protected current_scene : ColladaObjects;


    constructor(container: HTMLElement){
        this.container = container;

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

    public onLoaded() : void{}

    public load(scene : ColladaObjects) : void{
        this.loaded_scene = scene;
        this.loaded_scene.up = new THREE.Vector3(0, 0, 0);
        this.loaded_scene.scale.x = this.loaded_scene.scale.y = this.loaded_scene.scale.z = 150;
        this.loaded_scene.updateMatrix();
        this.onLoaded();
    }

    public addLoaded() : void{
        this.current_scene = this.loaded_scene;
        this.scene.add(this.loaded_scene);
    }

    public removeCurrent() : void{
        this.removeThreeObject(this.current_scene);
        this.current_scene = undefined;
    }

    public clearScene() : void{
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


    protected removeThreeObject(obj : THREE.Object3D, parent?: THREE.Object3D | THREE.Scene) : void{
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
