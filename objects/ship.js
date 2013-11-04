"use strict"

var shipGeo = loader.load("models/ship.3geo");
var shipMat = THREE.ImageUtils.loadImage("textures/texture.png");

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
    this.mesh = new THREE.Mesh(shipGeo, new THREE.MeshBasicMaterial());
    scene.add(this.mesh);
    this.curUpdate = this.gameUpdate;

    this.rPos = new THREE.Vector3(0,0,0);
    this.lPos = new THREE.Vector3(0,0,0);
    this.fPos = new THREE.Vector3(0,0,0);
    this.frontDir = new THREE.Vector3(0,0,-1);
    this.downDir = new THREE.Vector3(0,-1,0);
    this.caster = new THREE.Raycaster();

    this.xVel = 0;
    this.horAccel = 0.07;
    this.maxXvel = 3;

    this.yVel = 0;
    this.maxYVel = 2;
    this.gravity = -0.004;
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

Ship.prototype.gameUpdate = function(){
    var pos = this.mesh.position.clone();
    // set mesh position to new position
    if (keyboard.pressed("left")){
        this.xVel = clamp(-this.maxXvel, this.xVel+this.horAccel, this.maxXvel);
    }

    if (keyboard.pressed("right")){
        this.xVel = clamp(-this.maxXvel, this.xVel-this.horAccel, this.maxXvel);
    }

    this.xVel -= this.xVel*0.15;

    pos.x = clamp(-20, pos.x+this.xVel, 20);

    if (keyboard.pressed("space") && this.onGround){
        this.yVel = 0.3;
        pos.y += this.yVel;
    }
    
    
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
    }*/

    // raycast from current position at direction between mesh position and pos
    
    var tDir = new THREE.Vector3();
    tDir.sub(this.mesh.position);
    tDir.add(pos);
    tDir.normalize();

    this.caster.set(this.mesh.position, tDir);

    var intersects = this.caster.intersectObject(level.objs, true);
    if (intersects.length > 0 && intersects[0].distance < pos.distanceTo(this.mesh.position)){    
        console.log("colliding!");
        console.log(intersects);
        this.onGround = true;
        pos.copy(intersects[0].point);
        this.yVel = 0;
    } else {
        console.log("not colliding");
        this.onGround = false;
        this.yVel = clamp(-this.maxYVel, this.yVel+this.gravity, this.maxYVel);
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
