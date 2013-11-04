"use strict"

// TODO:
//
//
// Ship:
//  - implement simple ship controls. Left, right movement and jumping
//      - raycasting for collision
//  - Model 3D ship, flame effects and glow.
//
// Levels:
//  - level class, loading level from JSON
//  - JSON level editor (flat blocks, 1 ship length)
//      - interchangable file between JSON editor and game that initializes the necessary materials, meshes and properties
//  - How to rotate ship to match the surface?
//      - Angle between two raycaster points
//      - Physics engine
//      - (bizzare hackery?)
//
// Menu and Game system
// - Switching in and out of game cleanly, changing levels through menu

// NOTES/THOUGHTS:
// - Level should be parented to an Object3D, to allow easy rotation.
// - Premature optimization:
//      - Should level geometry be merged? Would this optimize things, or would raycaster shit itself on massive merged geometry?
//      - Can merged geometry be culled?

// IDEAS:
// - Speed controls are automated. NO BRAKES ON THIS BABY
// - Rolling log level. (as in rotating around z-axis)
// - Level suddenly shoots up in a 90-degree rotation. Ship caught in gravitational field while level rotates.
// - Gravity changes. Ship suddenly falls upwards or to the side
//      - GOTCHA: need to rotate raycaster with ship! Just parent the raycaster to the ship? Is it even an Object3D?
// - Moving parts?
// - Magnetized platforms to transport between different parts of a level. Flashy, twisting animation as it moves
// - Energized launch pad at the end of the level. On hitting it, the ship charges up with particles, flies off the end of the stage and then rises into the air

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

window.onload = function(){
    init();
    animate();
};

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

    light = new THREE.PointLight(0xffffff, 1, 100);
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
