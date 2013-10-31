var geoms = {
    blockGeo: new THREE.CubeGeometry( 50, 10, 50 ),
    largeBlock: new THREE.CubeGeometry( 100, 20, 100 ),
    wallBlockGeo: new THREE.CubeGeometry( 50, 200, 50 ),
};

var loader = new THREE.JSONLoader();

/*loader.load("cube.js", function(geo){
    geo.dynamic = true;

    for (var i = 0; i < geo.vertices.length; ++i){
        geo.vertices[i].multiplyScalar(50);
    }
    
    geo.verticesNeedUpdate = true;
    geo.elementsNeedUpdate = true;
    geo.morphTargetsNeedUpdate = true;
    geo.uvsNeedUpdate = true;
    geo.normalsNeedUpdate = true;
    geo.colorsNeedUpdate = true;
    geo.tangentsNeedUpdate = true;

    
    geo.width = 100;
    geo.height = 100;
    geo.depth = 100;
    
    geoms.importedGeo = geo;
});*/

var blockTex = THREE.ImageUtils.loadTexture("textures/square-outline-textured.png");

var blocktypes = {
    /*"defaultBlock":{
        "rollovergeo": "importedGeo",
        "geometry": "importedGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0xfeb74c,
            ambient: 0xfeb74c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },*/

    "blueBlock":{
        "rollovergeo": "blockGeo",
        "geometry": "blockGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0x4ca8fe,
            ambient: 0x4ca8fe,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },

    "redBlock":{
        "rollovergeo": "blockGeo",
        "geometry": "blockGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0xfe4c65,
            ambient: 0xfe4c65,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },
    
    "greenBlock":{
        "rollovergeo": "blockGeo",
        "geometry": "blockGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },
    
    "largeBlock":{
        "rollovergeo": "largeBlock",
        "geometry": "largeBlock",

        "material": new THREE.MeshLambertMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },

    "wallBlock":{
        "rollovergeo": "wallBlockGeo",
        "geometry": "wallBlockGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    }

};
