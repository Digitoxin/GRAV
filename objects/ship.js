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
    scene.add(this.mesh);
    this.curUpdate = this.gameUpdate;

    this.rPos = new THREE.Vector3(-1,0,0);
    this.lPos = new THREE.Vector3(1,0,0);
    this.fPos = new THREE.Vector3(0,0,0);
    this.frontDir = new THREE.Vector3(0,0,-1);
    this.downDir = new THREE.Vector3(0,-1,0);
    this.caster = new THREE.Raycaster();

    this.xVel = 0;
    this.horAccel = 0.09;
    this.maxXvel = 1;
	this.friction = 0.11;

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

}

Ship.prototype.gameUpdate = function(){
    var pos = this.mesh.position.clone();
    // set mesh position to new position
    if (keyboard.pressed("left")){
        this.xVel = clamp(-this.maxXvel, this.xVel+this.horAccel, this.maxXvel);
    }

    if (keyboard.pressed("right")){
        this.xVel = clamp(-this.maxXvel, this.xVel-this.horAccel, this.maxXvel);
    }

    this.xVel -= this.xVel*this.friction;

    pos.x = clamp(-20, pos.x+this.xVel, 20);

    
    
    
    /*
    this.setCast(this.rPos, this.downDir);
    var intersects = this.caster.intersectObject(level.objs, true);
    if (intersects.length > 0){
        if (intersects[0].distance < 0.5){
            this.yVel = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
            pos.y += this.yVel;
        }
    }
	*/

    // raycast from current position at direction between mesh position and pos
    
	this.yVel = clamp(-this.maxYVel, this.yVel+this.gravity, this.maxYVel);
	pos.y += this.yVel;
	
    var tDir = new THREE.Vector3();
    tDir.add(this.mesh.position);
    tDir.sub(pos);
	tDir.y = -1;
    tDir.normalize();
    
    this.caster.set(this.mesh.position, tDir);
	
    var intersects = this.caster.intersectObjects(level.objs.children, false);
    if (intersects.length > 0 && intersects[0].distance < pos.distanceTo(this.mesh.position)){    
		this.onGround = true;
		pos.y -= this.yVel;
		this.yVel = 0;
		
    } else {
        //console.log("not colliding");
        this.onGround = false;
    }
	
	if (keyboard.pressed("space") && this.onGround){
        this.yVel = 0.3;
        pos.y += this.yVel;
    }
	this.mesh.position.copy(pos);

    //  this.setCast(this.rPos, this.downDir);
    //  var leftRes = this.caster.intersectObjects()
    //  
    //  this.setCast(this.lPos, this.downDir);
    //  var rightRes = this.caster.intersectObjects();
    //
    //  if(leftRes && rightRes){
    //      rotation = angle(leftRes[0].position, rightRes[0].position)
    //  }
    //  
    //  this.setCast(this.fPos, this.frontDir);
    //  frontRes = frontRaycast()
    //  if (frontRes.length > 0){
    //      // check if it's a wall, and if so...
    //      crash();
    //  }


        
    // var pos = calculate new pos
    //
    // raycast with collidable objects from new pos
    // - raycaster.intersectObjects(Array objs, bool recursive);
    //
    // if bottom raycaster, fix y of new pos to ground plane
    //
    // if front raycaster, this.crash()
    //
    // else this.mesh.pos = pos
};
