console.log("init collada_stream.ts");

import * as THREE from 'three';

this.scene = new THREE.Scene();
this.loader = new THREE.ColladaLoader();

console.log("end collada_steam.ts");

export class ColladaStream{
/*
    protected scene: THREE.Scene;
    protected camera: THREE.Camera;
    protected renderer: THREE.WebGLRenderer;
    protected loader: THREE.ColladaLoader;

    constructor(){
        this.scene = new THREE.Scene();
        this.loader = new THREE.ColladaLoader();
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000 );
        this.camera.position.set(0, 0, 5);
    }

    public loadFile(file: string) : void{
        this.loader.load(
            file,   // resource URL
            function ( collada ) {  // Function when resource is loaded
                this.scene.add( collada.scene );
            },
            function ( xhr ) {  // Function when resource is loaded
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            }
        );
    }

    protected render() : void{
        this.renderer.render(this.scene, this.camera);
    }
 */
}
