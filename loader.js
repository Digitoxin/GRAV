var assets = {};

var loadImage = function(imgsrc){
    THREE.ImageUtils.loadTexture(imgsrc, {}, function(img){
        assets[imgsrc].data = img;
        assets[imgsrc].loaded = true;
        startIfReady();
    });
};

var loader = new THREE.JSONLoader();
var loadModel = function(mdlsrc){
    loader.load(mdlsrc, function(geo, mat){
        assets[mdlsrc].data = {};
        assets[mdlsrc].data.geo = geo;
        assets[mdlsrc].data.mat = mat;
        assets[mdlsrc].loaded = true;
        startIfReady();
    });
};

var startIfReady = function(){
    var keys = Object.keys(assets);

    for (var i = 0; i < keys.length; i++){
        if (!assets[keys[i]].loaded){
            return false;
        }
    }

    init();
    animate();
    return true;
};

(function(){
    // these could be moved to a JSON file
    var images = ["models/ship/tex.png", "textures/flare.png"];
    var models = ["models/ship/ship.3geo"];

    for (var i = 0; i < images.length; ++i){
        assets[ images[i] ] = {};
        assets[ images[i] ].loaded = false;
    }

    for (var m = 0; m < models.length; ++m){
        assets[ models[m] ] = {};
        assets[ models[m] ].loaded = false;
    }
    
    for (var ii = 0; ii < images.length; ++ii){
        loadImage( images[ii] );
    }
    for (var mm = 0; mm < models.length; ++mm){
        loadModel( models[mm] );
    }
})();
