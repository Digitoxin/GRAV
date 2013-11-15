var voxSizeX = 10;
var voxSizeY = 1;
var voxSizeZ = 10;

var geoms = {
    blockGeo: new THREE.CubeGeometry( voxSizeX, voxSizeY, voxSizeZ*5 ),
    largeBlock: new THREE.CubeGeometry( voxSizeX, voxSizeY*4, voxSizeZ*5 ),
    wallBlockGeo: new THREE.CubeGeometry( voxSizeX, voxSizeY*10, voxSizeZ ),
};

var blockTex = THREE.ImageUtils.loadTexture("textures/square-outline-textured.png");

var blocktypes = {
    blueBlock:{
        "geo": "blockGeo",

        "mat": new THREE.MeshPhongMaterial({
            color: 0x4ca8fe,
            ambient: 0x4ca8fe,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },

    redBlock:{
        "geo": "blockGeo",

        "mat": new THREE.MeshPhongMaterial({
            color: 0xfe4c65,
            ambient: 0xfe4c65,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },
    
    greenBlock:{
        "geo": "blockGeo",

        "mat": new THREE.MeshPhongMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },
    
    largeBlock:{
        "geo": "largeBlock",

        "mat": new THREE.MeshPhongMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    },

    wallBlock:{
        "geo": "wallBlockGeo",

        "mat": new THREE.MeshPhongMaterial({
            color: 0x93fe4c,
            ambient: 0x93fe4c,
            shading: THREE.FlatShading,
            map: blockTex
        })

    }

};
