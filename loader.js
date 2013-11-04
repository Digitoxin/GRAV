var assets = {};

var loadImage = function(imgsrc){
    assets[imgsrc] = {};
    assets[imgsrc].loaded = false;

    THREE.ImageUtils.loadTexture(imgsrc, {}, function(img){
        assets[imgsrc].data = img;
        assets[imgsrc].loaded = true;
    });
};

var loader = new THREE.JSONLoader();
var loadModel = function(mdlsrc){
    loader.load(mdlsrc, function(geo, mat){
    
    });
}
