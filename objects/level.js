"use strict"

// TODO: figure out level format?
// - switching level segments

var Level = function(){
    this.objs = new THREE.Object3D();
    this.loaded = false;
    this.furthest = 0;
	this.name = "";
	this.curSeg = 0;
    
    this.STARTSPEED = 0.1;
    this.MAXSPEED = 2;
    this.SPEEDFAC = 0.01;
    this.curSpeed = this.STARTSPEED;
};

Level.prototype.startSegment = function(s){
	var seg = this.segments[s];
	
	this.furthest = seg[0].pos.z;
    
    for (var i = 0; i < seg.length; ++i){
        var type = blocktypes[seg[i].b];
        var cube = new THREE.Mesh( geoms[type.geo], type.mat );
        cube.position.x = seg[i].pos.x;
        cube.position.y = seg[i].pos.y;
        cube.position.z = seg[i].pos.z;

        cube.blockName = seg[i].b;

        cube.matrixAutoUpdate = false;
        cube.updateMatrix();
        cube.removable = true;

        if (seg[i].pos.z < this.furthest){
            this.furthest = seg[i].pos.z;
        }

        this.objs.add(cube);
        cube.index = this.objs.children.length - 1;
    }
	
}

Level.prototype.load = function(lurl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", lurl, false );
    xmlHttp.send( null );
    
    var lText = xmlHttp.responseText;
    var ldata = JSON.parse(lText);
	
	this.name = ldata.name;
	this.segments = ldata.segments;

	this.startSegment(this.curSeg);
    
    this.loaded = true;
};

Level.prototype.update = function(){
    this.objs.position.z += this.curSpeed;
    this.curSpeed += (this.MAXSPEED - this.curSpeed)*this.SPEEDFAC;

    if (this.objs.position.z > -this.furthest){
        this.onSegmentEnd();
    }
};

Level.prototype.resetLevel = function(){
	this.objs.position.set(0,0,0);
    this.curSpeed = this.STARTSPEED;
}

Level.prototype.onSegmentEnd = function(){
    this.curSeg += 1;
	if (this.curSeg > this.segments.length){
		console.log("you win");
	} else {
	
	}
	
	this.resetLevel();
};
