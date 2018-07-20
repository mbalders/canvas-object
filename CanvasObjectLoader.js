
function CanvasObjectLoader(_assets, _loadcb){
    //internal reference
    var c = this;

    //assets and load call back
    var assets = _assets;
    var loadcb = _loadcb;

    //called when an asset is loaded
    //if all assets are loaded, run the callback
    function assetLoaded(e, e2){
        if (checkLoad()) loadcb();
    }

    //loops through all the assets and checks load state
    function checkLoad(){
        for (var key in assets) {
            if (!c[key].loaded) return false;
        }
        return true;
    }

    //creates a CanvasObject for each asset 
    for (var key in assets) {
        this[key] = new CanvasObject(assets[key].src, assets[key], assetLoaded);
    }
}