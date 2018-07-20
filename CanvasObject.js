// Canvas object object
function CanvasObject(_src, _props, _cb){
	
	//internal reference
	var c = this;

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
	this.scaleX = 1;
	this.scaleY = 1;
	this.alpha = 1;
	this.rotation = 0;
	this.shadowBlur;
	this.shadowColor;
	this.shadowOffsetX;
	this.shadowOffsetY;

	//image clipping or something
	this.clip;

	//a buffer canvas
	//currently only used to solve for chrome shadowBlur + rotation hack
	this.buff_can;
	this.buff_ctx;

	//chrome check
	//currently only used to solve for chrome shadowBlur + rotation hack
	var chromeCheck = !!window.chrome && !!window.chrome.webstore;

	//store inital props, set after load
	var props = _props

	//allow to manipulation of width & height
	Object.defineProperty(this, 'width', {
	    get: function() {
	        return this.clip[2] * this.scaleX;
	    },
	    set: function(val) {
	        this.scaleX = val / this.clip[2];
	    }
	});

	Object.defineProperty(this, 'height', {
	    get: function() {
	        return this.clip[3] * this.scaleY;
	    },
	    set: function(val) {
	        this.scaleY = val / this.clip[3];
	    }
	});

	//bitmap load handler
	function loadHandler(e){
		//mark as loaded
		c.loaded = true;

		//set additional props passed
		for (var prop in props) {
			c[prop] = props[prop];
		}

		if (c.clip == null){
			c.clip = [0, 0, c.img.naturalWidth, c.img.naturalHeight];
		}

		//inital buffer on chrome
		//currently only used to solve for chrome shadowBlur + rotation hack
		if (chromeCheck) c.initBuffer();

		//callback
		if(cb) cb('complete', c);
	}

	this.initBuffer = function(){
		this.buff_can = document.createElement('canvas');
		this.buff_ctx = this.buff_can.getContext("2d");
	}
	
	this.drawToCanvas = function(ctx){
		if (this.alpha != 0){
			
			//NASTY work around to solve for shadowBlur + rotation on chrome
			if (chromeCheck && this.rotation != 0 && this.shadowBlur != null) {
				console.log('gross buffer hack');

				//change the width & height of canvas clears it
				this.buff_can.width = ctx.canvas.width;
				this.buff_can.height = ctx.canvas.height;

				this.buff_ctx.save();

				this.buff_ctx.globalAlpha = this.alpha;

				this.buff_ctx.translate(this.x, this.y);

				this.buff_ctx.rotate(-this.rotation*Math.PI/180);

				this.buff_ctx.scale(this.scaleX, this.scaleY);

				this.buff_ctx.drawImage(this.img, this.clip[0], this.clip[1], this.clip[2], this.clip[3],
										this.clip[2]*-.5, this.clip[3]*-.5, this.clip[2], this.clip[3]);
				
				this.buff_ctx.restore();
				
				ctx.shadowBlur = this.shadowBlur;
	   			ctx.shadowColor = this.shadowColor;
	   			ctx.shadowOffsetX = this.shadowOffsetX;
	   			ctx.shadowOffsetY = this.shadowOffsetY;

	   			ctx.drawImage(this.buff_can, 0, 0);

	   			ctx.shadowBlur = null;
	   			ctx.shadowColor = null;
	   			ctx.shadowOffsetX = null;
	   			ctx.shadowOffsetY = null;

			} else {

				ctx.save();

				ctx.globalAlpha = this.alpha;

				ctx.translate(this.x, this.y);

				ctx.rotate(-this.rotation*Math.PI/180);

				ctx.scale(this.scaleX, this.scaleY);

				ctx.shadowBlur = this.shadowBlur;
	   			ctx.shadowColor = this.shadowColor;
	   			ctx.shadowOffsetX = this.shadowOffsetX;
	   			ctx.shadowOffsetY = this.shadowOffsetY;

				ctx.drawImage(this.img, this.clip[0], this.clip[1], this.clip[2], this.clip[3],
										this.clip[2]*-.5, this.clip[3]*-.5, this.clip[2], this.clip[3]);
				
				ctx.restore();
			}			
		}
	}
}