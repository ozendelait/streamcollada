"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CSTREAM = require("./collada_stream");
var stream = new CSTREAM.ColladaStream();
stream.loadFile("res/duck.dae");
