"use strict"

// var shipGeo = loader.load("models/ship.3geo");
// var shipMat = THREE.ImageUtils.loadImage("textures/texture.png");

var Ship = function(){
    // this.mesh = new THREE.Mesh();
    this.curUpdate = this.gameUpdate;

    this.caster = new THREE.Raycaster();
    this.rPos = new THREE.Vector3();
    this.lPos = new THREE.Vector3();
    this.fPos = new THREE.Vector3();
    this.frontDir = new THREE.Vector3(0,0,-1);
    this.downDir = new THREE.Vector3(0,-1,0);
};

Ship.prototype.update = function(){
    this.curUpdate();
};

Ship.prototype.setCast = function(offset, dir){
    //  this.caster.position.copy(this.mesh.position);
    //  this.caster.position.add(offset);
    //  this.caster.direction.copy(dir);
};

Ship.prototype.gameUpdate = function(){
    var pos = this.mesh.position.clone();
    // set mesh position to new position
    if (keyboard.pressed("left")){
    
    }

    if (keyboard.pressed("right")){
    
    }

    if (keyboard.pressed("space")){

    }

    // // move raycaster/set direction, or have seperate ones
    
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
