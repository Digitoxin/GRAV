"use strict"

// TODO: Implement collisions
//      - Front raycaster for collisions
//      - Implement double ray caster angle between ship and plane

var clamp = function(mi, n, ma){
    if (n < mi){
        return mi;
    }
    else if (n > ma){
        return ma;
    }
    return n;
};

var Ship = function(){
    var shipGeo = assets["models/ship/ship.3geo"].data.geo;
    var shipMat = new THREE.MeshBasicMaterial({map : assets["models/ship/tex.png"].data});

    this.mesh = new THREE.Mesh(shipGeo, shipMat);
    this.mesh.rotation.y = Math.PI;
    scene.add(this.mesh);
    this.curUpdate = this.gameUpdate;

    this.tPos = new THREE.Vector3();

    this.rPos = new THREE.Vector3(-2,0,0);
    this.lPos = new THREE.Vector3(2,0,0);
    this.fPos = new THREE.Vector3(0,0,0);
    this.frontDir = new THREE.Vector3(0,0,-1);
    this.downDir = new THREE.Vector3(0,-1,0);
    this.caster = new THREE.Raycaster();

    this.xVel = 0;
    this.horAccel = 0.09;
    this.maxXvel = 1;
	this.friction = 0.11;
    
    
    this.VTHRUSTMAX = 30;
    this.vThrust = this.VTHRUSTMAX;

    this.yVel = 0;
    this.maxYVel = 2;
    this.gravity = -0.008;
    this.onGround = 0;
};

Ship.prototype.update = function(){
    this.curUpdate();
};

Ship.prototype.setCast = function(offset, dir){
    var p = new THREE.Vector3();
    p.copy(this.mesh.position);
    p.add(offset);
    this.caster.set(p, dir);
};

Ship.prototype.intersect = function(caster){

};

Ship.prototype.gameUpdate = function(){
    this.tPos = this.mesh.position.clone();
    // set mesh position to new position
    if (keyboard.pressed("right")){
        this.xVel = clamp(-this.maxXvel, this.xVel+this.horAccel, this.maxXvel);
    }

    if (keyboard.pressed("left")){
        this.xVel = clamp(-this.maxXvel, this.xVel-this.horAccel, this.maxXvel);
    }

    this.xVel -= this.xVel*this.friction;

    this.tPos.x = clamp(-20, this.tPos.x+this.xVel, 20);
	
    this.yVel = clamp(-this.maxYVel, this.yVel+this.gravity, this.maxYVel);
	this.tPos.y += this.yVel;
	
    this.downCollide();
    
    if (keyboard.pressed("space") && this.onGround){
        this.yVel = 0.2;
        this.tPos.y += this.yVel;
    }
    
    if (this.vThrust > 0 && keyboard.pressed("space")){
        this.yVel += 0.01;
        this.vThrust -= 1;
    }


    this.mesh.position.copy(this.tPos);
    
    this.mesh.rotation.x = this.yVel;
    this.mesh.rotation.z = this.xVel*0.3;

};

Ship.prototype.frontCollide = function(){

};

Ship.prototype.downCollide = function(){
    var down = new THREE.Vector3();
	down.y = -1;
    down.normalize();
    
    this.setCast(this.rPos, down);
    var rIntersects = this.caster.intersectObjects(level.objs.children, false);

    if (rIntersects.length > 0 && rIntersects[0].distance < 0.5){    
		this.onGround = true;
		this.tPos.y -= this.yVel;
        this.vThrust = this.VTHRUSTMAX;
		this.yVel = 0;
    } else {
        this.onGround = false;
    }
    
    

    this.setCast(this.lPos, down);
    var lIntersects = this.caster.intersectObjects(level.objs.children, false);

    if (lIntersects.length > 0 && lIntersects[0].distance < 0.5){    
		this.onGround = true;
		this.tPos.y -= this.yVel;
		this.yVel = 0;
    } else {
        this.onGround = false;
    }
};
