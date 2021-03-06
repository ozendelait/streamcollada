import * as THREE from "three";
import {BaseStreamLoader} from "./stream_loader";
import {ISceneStream, ThreeObject} from "./scene_stream";
import {ColladaModel} from "three";
const TextureColladaLoader = require("./texture_collada_loader");


export class ColladaStreamLoader extends BaseStreamLoader{
    public cloader: THREE.ColladaLoader;
    public mixer: THREE.AnimationMixer | null;
    public stream: ISceneStream;
    static MODEL_EXT = /\.(dae)$/;

    constructor(stream : ISceneStream){
        super(stream);
        this.stream = stream;
        this.cloader = TextureColladaLoader();
        this.cloader.options.convertUpAxis = true;
        this.mixer = null;
        this.MODEL_EXT = ColladaStreamLoader.MODEL_EXT;
    }

    public loadModelString(content: string){
        let model : ColladaModel = this.cloader.parse(content);

        if(model.skins.length > 0){
            console.log("Animations are not supported");
            /*
            var child = model.skins[0];
            console.log("yes 1");
            var animation = new THREE.Animation(child, child.geometry.animation);
            console.log("yes 2");
            animation.play();
            console.log("yes 3");
            */
        }
        if(model.animations.length > 0){
            console.log("Animations are not supported");
            /*
            var animations = model.animations;
            var avatar = model.scene;
            var mixer = new THREE.AnimationMixer( avatar );
            var action = mixer.clipAction( animations[ 0 ] ).play();
            */

            /*
            // Get object animation
            var sceneAnimationClip = model.animations[0];

            // Create animation mixer and pass object to it
            var mixer = new THREE.AnimationMixer(model);

            // Create animation action and start it
            var sceneAnimation = mixer.clipAction(sceneAnimationClip);
            sceneAnimation.play();
            */

            /*
            console.log("yes 1");
            let mixer = new THREE.AnimationMixer( model.scene ); // create global mixer
            console.log("yes 2");
            let x = model.animations[ 0 ];
            mixer.clipAction( x ).play(); // play first animation clip
            console.log("yes 3");
            */
            /*
            console.log("yes 1");
            var mixer = new THREE.AnimationMixer(model);
            console.log("yes 2", model.animations[0].name);
            var clip = THREE.AnimationClip.findByName(model.animations[0], model.animations[0].name);
            console.log("yes 3");
            var action = mixer.clipAction( clip );
            console.log("yes 4");
            action.play();
            console.log("yes 5");

            model.animations.forEach( function ( clip ) {
                mixer.clipAction( clip ).play();
                console.log("yes 6");
            } );
            */

            //this.mixer = new THREE.AnimationMixer(model.scene.children[0]);
            //console.log(this.mixer)
            //let clip : THREE.AnimationAction = this.mixer.clipAction(model.animations[0]);
            //clip.play();
        }
        this.loadModelObject(model.scene);
    }

    public loadTextureBuffer(name: string, arr: Uint8Array, callback: any){
        name = name.split('/').pop();
        // "Cache"
        if(this.cloader.options.url_texture_map.hasOwnProperty(name) && callback !== null){
            callback();
            return;
        }
        super.loadTextureBuffer(name, arr, callback);

    }
    public loadTextureImage(name: string, image: any, callback: any){
        this.cloader.options.url_texture_map[name] = image;
        super.loadTextureImage(name, image, callback);
    }
}