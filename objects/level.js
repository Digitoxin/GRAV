"use strict"

// TODO: figure out level format?
// - level segments
// - special objects

var Level = function(){
    this.objs = new THREE.Object3D();
    this.loaded = false;
    this.furthest = 0;
    
    this.STARTSPEED = 0.1;
    this.MAXSPEED = 2;
    this.SPEEDFAC = 0.01;
    this.curSpeed = this.STARTSPEED;
};

Level.prototype.load = function(lurl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", lurl, false );
    xmlHttp.send( null );
    
    var lText = xmlHttp.responseText;
    var ldata = JSON.parse(lText);

    this.furthest = ldata[0].pos.z;
    
    for (var i = 0; i < ldata.length; ++i){
        var type = blocktypes[ldata[i].b];
        var cube = new THREE.Mesh( geoms[type.geo], type.mat );
        cube.position.x = ldata[i].pos.x;
        cube.position.y = ldata[i].pos.y;
        cube.position.z = ldata[i].pos.z;

        cube.blockName = ldata[i].b;

        cube.matrixAutoUpdate = false;
        cube.updateMatrix();
        cube.removable = true;

        if (ldata[i].pos.z < this.furthest){
            this.furthest = ldata[i].pos.z;
        }

        this.objs.add(cube);
        cube.index = this.objs.children.length - 1;
    }
    
    this.loaded = true;
};

Level.prototype.update = function(){
    this.objs.position.z += this.curSpeed;
    this.curSpeed += (this.MAXSPEED - this.curSpeed)*this.SPEEDFAC;

    if (this.objs.position.z > -this.furthest){
        this.onSegmentEnd();
    }
};

Level.prototype.onSegmentEnd = function(){
    ship.mesh.position.set(0,10,0);
    this.objs.position.set(0,0,0);
    this.curSpeed = this.STARTSPEED;
};
