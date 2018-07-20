// Canvas object object
function CanvasObject(_src, _props, _cb){
	
	//internal reference
	var co = this;

	//bitmap
	this.img = new Image();
	this.img.src = _src;
	
	//loading
	this.img.onload = loadHandler;
	this.loaded = false;

	//load complete cb
	var cb = _cb;

	//handle init props
	this.x = 0;
	this.y = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.alpha = 1;
	this.rotation = 0;

	//store inital props, set after load
	var props = _props

	//allow to manipulation of width & height
	Object.defineProperty(this, 'width', {
	    get: function() {
	        return this.img.naturalWidth * this.scaleX;
	    },
	    set: function(val) {
	        this.scaleX = val / this.img.naturalWidth;
	    }
	});

	Object.defineProperty(this, 'height', {
	    get: function() {
	        return this.img.naturalHeight * this.scaleY;
	    },
	    set: function(val) {
	        this.scaleY = val / this.img.naturalHeight;
	    }
	});

	//bitmap load handler
	function loadHandler(e){
		//mark as loaded
		co.loaded = true;

		//set additional props passed
		for (var prop in props) {
			co[prop] = props[prop];
		}

		//callback
		if(cb) cb('complete', co);
	}
	
	//draw self to passed canvas
	this.drawToCanvas = function(ctx){
		if (this.alpha != 0){
			if (this.alpha != 1) ctx.globalAlpha = this.alpha;
			if (this.scaleX < 0) {
				ctx.save();
				ctx.scale(-1,1);
			}
			
			ctx.drawImage(this.img, -this.offsetX, -this.offsetY, this.img.naturalWidth, this.img.naturalHeight, this.x, this.y, this.img.naturalWidth*this.scaleX, this.img.naturalHeight*this.scaleY);
			
			if (this.scaleX < 0) {
				//ctx.scale(1,1);
				ctx.restore();
			}
			if (ctx.globalAlpha != 1) ctx.globalAlpha = 1;
		}
	}

	this.drawToCanvasRotation = function(ctx){
		
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation*Math.PI/180);
		ctx.drawImage(this.img, 0, 0, this.img.naturalWidth, this.img.naturalHeight, -(this.img.naturalWidth*this.scaleX)/2, -(this.img.naturalHeight*this.scaleY)/2, this.img.naturalWidth*this.scaleX, this.img.naturalHeight*this.scaleY);
		ctx.restore();

		
	}
}