const THREE = require("three");

export class ColladaStream{
    protected loader: THREE.ColladaLoader;

    constructor(){
        this.loader = new THREE.ColladaLoader();

        this.loader.load(
            // resource URL
            'models/collada/monster/monster.dae',
            // Function when resource is loaded
            function ( collada ) {
                scene.add( collada.scene );
            },
            // Function called when download progresses
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            }
        );
    }
}