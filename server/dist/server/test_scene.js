"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");
function zipToDisk(files, dest, base_dir = "") {
    let zip = new JSZip();
    let options = { binary: true };
    files.forEach((el) => {
        options.binary = (el.match(/\.(jpg|jpeg|png)$/) !== null);
        zip.file(el, fs.readFileSync(path.join(base_dir, el)), options);
    });
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: false })
        .pipe(fs.createWriteStream(path.join(base_dir, dest)));
}
exports.zipToDisk = zipToDisk;
class SceneOptions {
    constructor(base_dir = "", static_list = []) {
        this.base_dir = base_dir;
        this.static_list = static_list;
    }
}
exports.SceneOptions = SceneOptions;
;
;
class Scene {
    constructor(path_list, options = new SceneOptions()) {
        this.path_list = path_list;
        this.options = options;
        this.counter = 0;
    }
    replaceExtWithZip(str) {
        return (str.substr(0, str.lastIndexOf('.')) || str) + ".zip";
    }
    zipAll(callback = () => { }) {
        let that = this;
        let counter = 0;
        this.path_list.forEach((_path) => {
            if (_path.substr(-(".zip".length)) !== ".zip") {
                let path_zip = that.replaceExtWithZip(_path);
                let full_path_zip = path.join(that.options.base_dir, path_zip);
                if (!fs.existsSync(full_path_zip)) {
                    let files = that.options.static_list.concat([_path]);
                    zipToDisk(files, path_zip, that.options.base_dir);
                    if (counter >= that.path_list.length) {
                        callback();
                        return;
                    }
                    counter++;
                }
            }
        });
        callback();
    }
    getNext() {
        this.counter++;
        if (this.counter >= this.path_list.length)
            this.counter = 0;
        return this.replaceExtWithZip(this.path_list[this.counter]);
    }
}
exports.Scene = Scene;
