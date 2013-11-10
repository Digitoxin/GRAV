var voxSizeX = 10;
var voxSizeY = 1;
var voxSizeZ = 10;

var geoms = {
    blockGeo: new THREE.CubeGeometry( voxSizeX, voxSizeY, voxSizeZ*5 ),
    largeBlock: new THREE.CubeGeometry( 100, 20, 100 ),
    wallBlockGeo: new THREE.CubeGeometry( 50, 200, 50 ),
};

var blockTex = THREE.ImageUtils.loadTexture("textures/square-outline-textured.png");

var blocktypes = {
    blueBlock:{
        "rollovergeo": "blockGeo",
        "geometry": "blockGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0x4ca8fe,
            ambient: 0x4ca8fe,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },

    redBlock:{
        "rollovergeo":"blockGeo",
        "geometry": "blockGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0xfe4c65,
            ambient: 0xfe4c65,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },
    
    greenBlock:{
        "rollovergeo": "blockGeo",
        "geometry": "blockGeo",

        "material": new THREE.MeshLambertMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },
    
    largeBlock:{
        "rollovergeo": "largeBlock",
        "geometry": "largeBlock",

        "material": new THREE.MeshLambertMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },

    wallBlock:{
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
