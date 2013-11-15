"use strict"

// TODO: figure out level format?
// - level segments
// - special objects

var Level = function(){
    this.objs = new THREE.Object3D();
    this.loaded = false;

};

Level.prototype.load = function(lurl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", lurl, false );
    xmlHttp.send( null );
    
    var lText = xmlHttp.responseText;
    var ldata = JSON.parse(lText);
    
    for (var i = 0; i < ldata.length; ++i){
        var type = blocktypes[ldata[i].blockName];
        var cube = new THREE.Mesh( geoms[type.geo], type.mat );
        cube.position.x = ldata[i].position.x;
        cube.position.y = ldata[i].position.y;
        cube.position.z = ldata[i].position.z;

        cube.blockName = ldata[i].blockName;

        cube.matrixAutoUpdate = false;
        cube.updateMatrix();
        cube.removable = true;

        this.objs.add(cube);
        cube.index = this.objs.children.length - 1;
    }
    
    this.loaded = true;
}

Level.prototype.update = function(){
    this.objs.position.z += 1.5;
};
