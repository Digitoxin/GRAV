"use strict"

// TODO:
// Ship:
//  - implement simple ship controls. Left, right movement and jumping
//      - raycasting for collision
//  - Model 3D ship, flame effects and glow.
//  - collisions
//
// Levels:
//  - level class, loading level from JSON
//  - JSON level editor (flat blocks, 1 ship length)
//      - interchangable file between JSON editor and game that initializes the necessary materials, meshes and properties

// IDEAS:
// - horizontal, and vertical rotations
// - rolling log?
// - Gravity changes. Ship suddenly falls upwards or to the side

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    RATIO = WIDTH / HEIGHT,
    VIEW_ANGLE = 45,
    NEAR = 1,
    FAR = 10000;

var camera, scene, clock, controls, renderer, stats, container;
var ground;

var keyboard = new THREEx.KeyboardState();
var ship;
var level;

var light;

var UPDATESPERSECOND = 60;
var FRAMETIME = 1 / UPDATESPERSECOND;

// perform n seconds of updates at most
var MAXTIME = FRAMETIME * 60;

function init(){
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor( 0x00 );
    container.appendChild( renderer.domElement );

    clock = new THREE.Clock();
    clock.start();

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, RATIO, NEAR, FAR);
    camera.position.z = -20.0;
	camera.position.y = 10;

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
    
    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];

    scene = new THREE.Scene();
    scene.add(camera);
    
    ship = new Ship();
    ship.mesh.position.set(0,5,0);
	
	scene.add(new THREE.AmbientLight(0x120000));
    light = new THREE.PointLight(0xffffff, 1, 200);
    scene.add(light);

    ground = new THREE.Mesh(new THREE.CubeGeometry(20,1,20), new THREE.MeshPhongMaterial({color:0xff0000}));
    ground.position.y = -5;

    var g2 = new THREE.Mesh(new THREE.CubeGeometry(10,1,20), new THREE.MeshPhongMaterial({color:0x00ff00}));
    g2.position.x = 3;

    level = new Level();
    level.objs.add(ground);
    level.objs.add(g2);
    scene.add(level.objs);

    window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    RATIO = WIDTH/HEIGHT;

    camera.aspect = RATIO;
    camera.updateProjectionMatrix();

    renderer.setSize(WIDTH,HEIGHT);
}

var curDelta = 0, curTime = 0;
var counter = 0;

function animate(){
    requestAnimationFrame(animate);

    curDelta = clock.getDelta();
    curTime += curDelta;
    
    counter += curDelta;
    counter = Math.min(counter, MAXTIME);
    while (counter > FRAMETIME){
        update();
        counter -= FRAMETIME;
    }

    render();
    
    stats.update();
}

function update(){
    controls.update();

    light.position.copy(ship.mesh.position);
    light.position.y += 1;

    ship.update();
}

function render(){
    renderer.render(scene, camera);
}
