console.log("init collada_stream.ts");

import * as THREE from 'three';
import {OrbitControls} from "three-orbitcontrols-ts";
const ColladaLoader = require('three-collada-loader');


export class ColladaStream{

    protected scene: THREE.Scene;
    protected camera: THREE.Camera;
    protected orbit: OrbitControls;
    protected renderer: THREE.WebGLRenderer;
    protected loader: THREE.ColladaLoader;
    protected container: HTMLElement;

    protected obj : THREE.Object3D;

    constructor(container: HTMLElement){
        this.container = container;

        this.scene = new THREE.Scene();

        this.loader = new ColladaLoader();
        this.loader.options.convertUpAxis = true;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 10000 );
        this.camera.position.z = 1000;

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


        // Add some lights to the scene
        var directionalLight = new THREE.DirectionalLight(0xeeeeee , 1.0);
        directionalLight.position.x = 1;
        directionalLight.position.y = 0;
        directionalLight.position.z = 0;
        this.scene.add( directionalLight );

        var directionalLight2 = new THREE.DirectionalLight(0xeeeeee, 2.0);
        // A different way to specify the position:
        directionalLight2.position.set(-1, 0, 1);
        this.scene.add( directionalLight2 );



        this.render();
    }

    public loadFile(file: string) : void{
        this.loader.load(
            file,   // resource URL
            (collada: THREE.ColladaModel) => {  // Function when resource is loaded
                this.obj = collada.scene;
                this.obj.up = new THREE.Vector3(0, 0, 0);
                this.obj.scale.x = this.obj.scale.y = this.obj.scale.z = 150;
                this.obj.updateMatrix();
                console.log(this.obj)
                this.scene.add(this.obj);
            },
            (xhr: any) => {  // Function when resource is loaded
                let percent = xhr.loaded / xhr.total * 100;
                console.log(percent + '% loaded');
            }
        );
    }

    protected render = () : void => {
        //if(this.obj){
        //    this.obj.rotateX(1);
        //    this.obj.rotateY(1);
        //}
        this.orbit.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    }
}


console.log("end collada_steam.ts");