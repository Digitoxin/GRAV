var sidebar, sidebarWidth = 200;
var FOV = 45,
    WIDTH = window.innerWidth - sidebarWidth,
    HEIGHT = window.innerHeight,
    RATIO = WIDTH/HEIGHT,
    NEAR = 1,
    FAR = 10000;

var yLevel = 0;

var cameraSpeed = 25;

var container, stats;
var camera, scene, renderer;
var projector, plane;
var mouse2D, mouse3D, raycaster,
rollOveredFace, isShiftDown = false,
theta = 45 * 0.5, isCtrlDown = false;

var cameraPos = new THREE.Vector3(0, 1000, -500);
var cameraOffset = 1;

var centerPos = new THREE.Vector3(0,0,0);

var rollOverMesh, rollOverMaterial, rollOverGeo;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var i, intersector;


var leftmouse = false, rightmouse = false, midmouse = false;

var leftKeyDown = false, rightKeyDown = false, upKeyDown = false, downKeyDown = false;

var controls;
var cubes = [];

var blockKeys = Object.keys(blocktypes);
blockKeys.sort();
var curBlockIndex = 0;
var curBlock = blocktypes[blockKeys[curBlockIndex]];

var camAngle = 0;

init();
animate();

function clamp(mi, n, ma){
    if (n < mi){
        return mi;
    }
    if (n > ma){
        return ma;
    }

    return n;
}

function setCurrentBlockByIndex(n){
    curBlockIndex = clamp(0, n, blockKeys.length-1);
    setCurrentBlockByName(blockKeys[curBlockIndex]);
}

function resetRollOverMaterial(){
    rollOverMaterial = curBlock.material.clone();
    rollOverMaterial.opacity = 0.4;
    rollOverMaterial.transparent = true;
}

function setCurrentBlockByName(blockname){
    if (!!blocktypes[blockname]){
        curBlock = blocktypes[blockname];

        scene.remove(rollOverMesh);

        updateCurBlockElem();

        rollOverMesh = null;

        resetRollOverMaterial();
        
        rollOverMesh = new THREE.Mesh( geoms[curBlock.geometry], rollOverMaterial );
        
        scene.add(rollOverMesh);

    } else {
        console.error("Error! No block by name of " + blockname);
    }
}

function init() {
    setupSidebar();

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '0px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - voxel painter - webgl<br><strong>left click</strong>: add voxel, <strong>right click</strong>: remove voxel, <strong>middle click</strong>: rotate';
    container.appendChild( info );

    camera = new THREE.PerspectiveCamera( FOV, RATIO, NEAR, FAR );
    camera.position.y = cameraPos.y;
    camera.position.z = cameraPos.z;

    centerPos.x = cameraPos.x + 300;
    centerPos.z = cameraPos.z + 300;

    scene = new THREE.Scene();

    camera.lookAt(scene.position);

    // roll-over helpers

    rollOverGeo = new THREE.CubeGeometry(50, 10, 50);
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.2, transparent: true } );

    resetRollOverMaterial();

    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    scene.add( rollOverMesh );

    // picking

    projector = new THREE.Projector();

    // grid

    var size = 1000, gridWidth = 50*8, step = 50;

    var geometry = new THREE.Geometry();

    for ( var i = -size/2; i <= size/2; i += step ) {
        geometry.vertices.push( new THREE.Vector3( - gridWidth/2, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   gridWidth/2, 0, i ) );
    }

    for (var j = -gridWidth/2; j <= gridWidth/2; j += step){
        geometry.vertices.push( new THREE.Vector3( j, 0, - size/2 ) );
        geometry.vertices.push( new THREE.Vector3( j, 0,   size/2 ) );
    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

    var line = new THREE.Line( geometry, material );
    line.type = THREE.LinePieces;
    scene.add( line );

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), new THREE.MeshBasicMaterial({wireframe:true, color:0xff0000}) );
    plane.rotation.x = - Math.PI / 2;
    plane.position.z = 2500;
    plane.visible = false;
    scene.add( plane );

    mouse2D = new THREE.Vector3( 0, 10000, 0.5 );

    // Lights

    var ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );

    renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    renderer.setSize( window.innerWidth - sidebarWidth, window.innerHeight );

    renderer.domElement.style.width = "" + WIDTH + "px";

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );
    document.addEventListener('contextmenu', function(ev){ev.preventDefault();}, false);
    
    // FIXME: proper checking for browser specific stuff
    window.onmousewheel = document.onmousewheel = onDocumentMouseScroll;
    document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false );

    window.addEventListener( 'resize', onWindowResize, false );
    
}

function onWindowResize() {
    WIDTH = window.innerWidth - sidebarWidth;
    HEIGHT = window.innerHeight;
    RATIO = WIDTH / HEIGHT;

    camera.aspect = RATIO;
    camera.updateProjectionMatrix();

    renderer.setSize( WIDTH, HEIGHT );
}

function cubes2JSON(){
    //TODO: remember to reset position offsets and ylevel!
    jsobj = [];
    for (var i = 0; i < cubes.length; ++i){
        var cube = {};
        cube.blockName = cubes[i].blockName;

        cube.position = {};
        cube.position.x = cubes[i].position.x;
        cube.position.y = cubes[i].position.y;
        cube.position.z = cubes[i].position.z;

        jsobj.push(cube);
    }
    var out = JSON.stringify(jsobj);

    var dataUri	= "data:application/json;charset=utf-8,"+out;
	window.open( dataUri, 'mywindow' );
}

function handleFileLoad(evt){
    f = evt.target.files[0];
    if (f){
        var r = new FileReader();
        r.onload = function(e){
            var contents = e.target.result;
            loadJSON(contents);
        } 
        r.readAsText(f);
    }
}

function loadJSON(f){
    for (var j = 0; j < cubes.length; ++j){
        scene.remove(cubes[j]);
    }
    cubes = [];

    var clist = JSON.parse(f);

    for (var i = 0; i < clist.length; ++i){
        var type = blocktypes[clist[i].blockName];
        var cube = new THREE.Mesh( geoms[type.geometry], type.material );
        cube.position.x = clist[i].position.x;
        cube.position.y = clist[i].position.y;
        cube.position.z = clist[i].position.z;

        cube.blockName = clist[i].blockName;

        cube.matrixAutoUpdate = false;
        cube.updateMatrix();
        cube.removable = true;

        scene.add( cube );

        cubes.push( cube );
        cube.index = cubes.length - 1;
    }
}

function getRealIntersector( intersects ) {
    for( i = 0; i < intersects.length; i++ ) {
        intersector = intersects[ i ];
        
        if ( intersector.object != rollOverMesh ) {
            return intersector;
        }
    }

    return null;
}

function setVoxelPosition( intersector ) {
    if (intersector && intersector.face){
        normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
        tmpVec.copy( intersector.face.normal );
        tmpVec.applyMatrix3( normalMatrix ).normalize();

        voxelPosition.addVectors( intersector.point, tmpVec );

        voxelPosition.x = Math.floor( voxelPosition.x / 50 ) * 50 + geoms[curBlock.geometry].width / 2;
        voxelPosition.y = Math.floor( voxelPosition.y / 50 ) * 50 + geoms[curBlock.geometry].height / 2;
        voxelPosition.z = Math.floor( voxelPosition.z / 50 ) * 50 + geoms[curBlock.geometry].depth / 2;
    }
}

function isMouseInViewport( event ){
    if (event.clientX < WIDTH){
        return true;
    }
    return false;
}

function onDocumentMouseMove( event ) {
    event.preventDefault();

    mouse2D.x = ( event.clientX / WIDTH ) * 2 - 1;
    mouse2D.y = - ( event.clientY / HEIGHT ) * 2 + 1;

}

function onDocumentMouseDown( event ) {
    event.preventDefault();

    if (!isMouseInViewport(event)){
        return;
    }

    if (event.button === 0){
        leftmouse = true;
    }

    if (event.button === 1){
        midmouse = true;
    }

    if (event.button === 2){
        rightmouse = true;
    }

    if (event.button === 0 || event.button === 2){
        var intersects = raycaster.intersectObjects( scene.children, true );
        if ( intersects.length > 0 ) {
            intersector = getRealIntersector( intersects );
            if ( event.button === 2 ) {
                onRemoveBlock();
            } else {
                onPlaceBlock(intersects);
            }

        }
    }
}

function onDocumentMouseUp( event ){
    if (event.button === 0){
        leftmouse = false;
    }

    if (event.button == 1){
        midmouse = false;
    }

    if (event.button == 2){
        rightmouse = false;
    }

}

function onDocumentMouseScroll( event ){
    var delta = 0;
    if (!event)
        event = window.event;
    if (event.wheelDelta){
        delta = event.wheelDelta/120;
    } else {
        delta = -event.detail/3;
    }

    cameraOffset += -delta*0.1;
}

function onRemoveBlock(){
    if ( intersector.object.removable ) {
        scene.remove( intersector.object );

        var removedInd = intersector.object.index;
        
        console.log("removed block index " + removedInd + ", id " + intersector.object.id);
        
        cubes.splice( intersector.object.index, 1);

        for (var i = removedInd; i < cubes.length; ++i){
            cubes[i].index -= 1;
        }

    }
}

function onPlaceBlock(intersects){
    intersector = getRealIntersector( intersects );
    setVoxelPosition( intersector );

    var cube = new THREE.Mesh( geoms[curBlock.geometry], curBlock.material );
    cube.position.copy( voxelPosition );

    cube.blockName = blockKeys[curBlockIndex];

    cube.matrixAutoUpdate = false;
    cube.updateMatrix();
    cube.removable = true;

    scene.add( cube );

    cubes.push( cube );
    cube.index = cubes.length - 1;

    console.log("added block " + cube.index);
}

function setYLevel(n){
    var difLevels = n - yLevel;
    yLevel = n;

    for (var i = 0; i < cubes.length; ++i){
            cubes[i].position.y += difLevels * 50;
            cubes[i].updateMatrix();
    }
}

function onDocumentKeyDown( event ) {
    event.preventDefault();

    switch( event.keyCode ) {

        case 16: isShiftDown = true; break;
        case 17: isCtrlDown = true; break;

        case 37: leftKeyDown = true; break;
        case 38: upKeyDown = true; break;
        case 39: rightKeyDown = true; break;
        case 40: downKeyDown = true; break;
        

    }

}

function onDocumentKeyUp( event ) {
    event.preventDefault();

    switch ( event.keyCode ) {

        case 16: isShiftDown = false; break;
        case 17: isCtrlDown = false; break;

        case 37: leftKeyDown = false; break;
        case 38: upKeyDown = false; break;
        case 39: rightKeyDown = false; break;
        case 40: downKeyDown = false; break;
        
        case 74: setYLevel(yLevel-1); updateYLevElem(); break;
        case 75: setYLevel(yLevel+1); updateYLevElem(); break;

        case 79: setCurrentBlockByIndex(curBlockIndex - 1); break;
        case 80: setCurrentBlockByIndex(curBlockIndex + 1); break;
    }

}

function updateControls(){
    if (leftKeyDown){
        camAngle += 0.05;
        //cameraPos.x += cameraSpeed;
        //plane.position.x += cameraSpeed;
    }
    if (rightKeyDown){
        camAngle -= 0.05;
        //cameraPos.x -= cameraSpeed;
        //plane.position.x -= cameraSpeed;
    }
    if (downKeyDown){
        cameraPos.z += cameraSpeed * Math.cos(camAngle);
        plane.position.z += cameraSpeed * Math.cos(camAngle);
        centerPos.z += cameraSpeed * Math.cos(camAngle);

        cameraPos.x += cameraSpeed * Math.sin(camAngle);
        plane.position.x += cameraSpeed * Math.sin(camAngle);
        centerPos.x += cameraSpeed * Math.sin(camAngle);

    }
    if (upKeyDown){
        cameraPos.z -= cameraSpeed * Math.cos(camAngle);
        plane.position.z -= cameraSpeed * Math.cos(camAngle);
        centerPos.z -= cameraSpeed * Math.cos(camAngle);
        
        cameraPos.x -= cameraSpeed * Math.sin(camAngle);
        plane.position.x -= cameraSpeed * Math.sin(camAngle);
        centerPos.x -= cameraSpeed * Math.sin(camAngle);
    }
}

function animate() {
    requestAnimationFrame( animate );

    render();
    stats.update();
}

function render() {
    updateControls();

    raycaster = projector.pickingRay( mouse2D.clone(), camera );

    var intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects.length > 0 ) {

        intersector = getRealIntersector( intersects );
        if ( intersector ) {
            setVoxelPosition( intersector );
            rollOverMesh.position = voxelPosition;
        }
    }

    camera.position.x = 1000 * Math.sin(camAngle) + cameraPos.x;
    camera.position.y = cameraPos.y * cameraOffset;
    camera.position.z = 1000 * Math.cos(camAngle) + cameraPos.z;

    camera.lookAt(centerPos);

    updateCurPosElem();
    updateCurBlockAmountElem();

    renderer.render( scene, camera );

}
