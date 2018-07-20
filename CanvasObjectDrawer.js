
function CanvasObjectDrawer(_can){

    //canvas can ctx
    this.can = _can;
    this.ctx = this.can.getContext("2d");

    Object.defineProperty(this, 'mode', {
        get: function() {
            return this.ctx.globalCompositeOperation;
        },
        set: function(val) {
            this.ctx.globalCompositeOperation = val;
        }
    });

    var rAFid;
    var drawcb;

    this.clear = function(){
        this.ctx.clearRect(0, 0, this.can.width, this.can.height);
        this.mode = "source-over";
    }

    this.startDraw = function(_drawcb){
        drawcb = _drawcb;
        rAFid = requestAnimationFrame(draw);
    }

    function draw(){
        drawcb();
        rAFid = requestAnimationFrame(draw);
    }

    this.stopDraw = function(){
        cancelAnimationFrame(rAFid);
    }

    this.drawImage = function(ass){
        ass.drawToCanvas(this.ctx);
    }
}
