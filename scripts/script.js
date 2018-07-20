window.onload = function() {
	if (!EB.isInitialized()){
      EB.addEventListener(EBG.EventName.EB_INITIALIZED, initAd, this);

    } else {
      initAd();
    }
};

function initAd(){
	//load all our asstes
	for (var key in assets) {
		window[key] = new CanvasObject(assets[key].src, assets[key], assetLoaded);
	}
}

//request Animation Frame
var rAFid;

//cleaner weiner canvas
var dogs_can = document.getElementById('dogs_can');
var dogs_ctx = dogs_can.getContext("2d");

//cleaner weiner canvas
var cleaner_can = document.getElementById('cleaner_can');
var cleaner_ctx = cleaner_can.getContext("2d");

//our assets to load for canvas
var assets = {
	dog_white: {src: "images/cleaner-dog.jpg" },
	copy: {src: "images/cleaner-simple.png", y:750},
	minidog: {src: "images/dog.png"}
};

//load handling
function assetLoaded(e, e2){ if (checkLoad()) startAnimation(); }
function checkLoad(){ for (var key in assets) { if (!this[key].loaded) return false; } return true; }

//stop request animation frame
function stopDraw(){ cancelAnimationFrame(rAFid); }

//ammount of head shake
var amt = 0;

//shake and repeat
function shake(dir){
  TweenLite.to(head, 0.05, {x:"+="+amt*dir, onComplete:shake, onCompleteParams:[-dir]});
}

//stop the head shake tweens and hide the head
function removeHead(){
	TweenLite.killTweensOf(head);
	TweenLite.to(head, 0, {top:250});
}

//dogsplosion dogs
var dogs = [];
var numDogs = 30;

//init the dogsplosion
function dogplosion(){
	for (var i=0; i<numDogs; i++){
		//new dogs, that copy minidog
		var newDog = {};
		for (var p in minidog){
			newDog[p] = minidog[p];
		}

		//rando that shit
		newDog.x = 150 + Math.random() * (300 - 143);
		newDog.y = 225 + Math.random() * 275;
		newDog.scaleX = newDog.scaleY = 0.5 + Math.random()* 0.75;
		endX = 100+Math.random()*400;
		endY = 950-Math.random()*(300*newDog.scaleX);

		//tween it
		var dogtween = TweenLite.to(newDog, 4*newDog.scaleX, {delay:Math.random()*0.05, bezier:[{x:newDog.x, y:newDog.y}, {x:newDog.x+(endX-newDog.x)*0.5, y:Math.random()*(-500*newDog.scaleX)}, {x:endX, y:endY}], ease:Circ.easeOut});

		if (Math.random() > 0.75){
			newDog.tween = TweenLite.to(newDog, 4*newDog.scaleX, {rotation:180+Math.random()*180, ease:Linear.easeNone});
		} else {
			newDog.tween = TweenLite.to(newDog, 0.5, {rotation:-30+Math.random()*60, ease:Quad.easeInOut, onCompleteScope:newDog, onComplete:function(){ this.tween.reverse(); }, onReverseCompleteScope:newDog, onReverseComplete:function(){ this.tween.restart(); }});
		}

		//store it
		dogs.push(newDog);
	}

	//start animation frame
	AFid = requestAnimationFrame(drawDogs);

	//stop animation frame when needed
	TweenLite.delayedCall(3.75, stopDraw);
}

//draw dogsplosion to canvas
function drawDogs(timeArg){
	console.log('drawDogs');

	//reset
	dogs_ctx.clearRect(0, 0, dogs_can.width, dogs_can.height);

	//draw all dogs
	for (i=0; i<dogs.length; i++){
		dogs[i].drawToCanvasRotation(dogs_ctx);
	}

	//continure animation frame
	rAFid = requestAnimationFrame(drawDogs);
}

//draw the cleaner weiner dog to canvas
function drawCleaner(timeArg, singleDraw){
	console.log('drawCleaner');

	//reset
	cleaner_ctx.globalCompositeOperation = "source-over";
	cleaner_ctx.clearRect(0, 0, cleaner_can.width, cleaner_can.height);

	//draw white dog
	dog_white.drawToCanvas(cleaner_ctx);

	//cut out white dog
	cleaner_ctx.globalCompositeOperation = "destination-in";
	cleaner_ctx.drawImage(copy.img, -600, 0);

	//punch hole in dog with copy
	cleaner_ctx.globalCompositeOperation = "destination-out";
	copy.drawToCanvas(cleaner_ctx);

	//continure animation frame
	if (!singleDraw) rAFid = requestAnimationFrame(drawCleaner);
}

function startAnimation(){

	//draw the two weiners initally
	drawCleaner(null, true);

	TweenLite.to(head, 0.25, 	{delay:0.25, top:4, ease:Quint.easeOut});
	TweenLite.to(copy1, 0.25, 	{delay:0.25, opacity:1, ease:Quint.easeOut});
	TweenLite.to(copy1, 0.25, 	{delay:2.5, opacity:0, ease:Quint.easeIn});

	TweenLite.to(eyes, 0, {delay:1.5, css:{'background-position':'-900px 0'}});
	TweenLite.to(eyes, 0, {delay:1.6, css:{'background-position':'-600px 0'}});

	TweenLite.to(brows, 0.25, {delay:3.25, top:8, ease:Quad.easeOut});
	TweenLite.to(brows, 0.25, {delay:3.75, top:6, ease:Quad.easeOut});
	TweenLite.to(brows, 0.25, {delay:4.25, top:4, ease:Quad.easeOut});
	TweenLite.to(brows, 0.25, {delay:4.75, top:2, ease:Quad.easeOut});

	TweenLite.to(head, 0.25, {delay:3.25, top:3, ease:Quad.easeOut});
	TweenLite.to(head, 0.25, {delay:3.75, top:2, ease:Quad.easeOut});
	TweenLite.to(head, 0.25, {delay:4.25, top:1, ease:Quad.easeOut});
	TweenLite.to(head, 0.25, {delay:4.75, top:0, ease:Quad.easeOut});

	TweenLite.to(copy2ra, 0.25, 	{delay:3.25, opacity:1, ease:Quint.easeOut});
	TweenLite.to(copy2rb, 0.25, 	{delay:3.75, opacity:1, ease:Quint.easeOut});
	TweenLite.to(copy2rc, 0.25, 	{delay:4.25, opacity:1, ease:Quint.easeOut});
	TweenLite.to(copy2rd, 0.25, 	{delay:4.75, opacity:1, ease:Quint.easeOut});

	TweenLite.delayedCall(4.0, shake, [1]);
	TweenLite.to(this, 3.0, {delay:4.0, amt:25, ease:Quint.easeIn});
	
	TweenLite.to(brows, 0.15, {delay:6.0, top:10, ease:Quad.easeOut});
	TweenLite.to(eyes, 0, {delay:6.0, css:{'background-position':'-900px 0'}});

	TweenLite.to(copy2ra, 0.25, 	{delay:6.75, opacity:0, ease:Quint.easeIn});
	TweenLite.to(copy2rb, 0.25, 	{delay:6.75, opacity:0, ease:Quint.easeIn});
	TweenLite.to(copy2rc, 0.25, 	{delay:6.75, opacity:0, ease:Quint.easeIn});
	TweenLite.to(copy2rd, 0.25, 	{delay:6.75, opacity:0, ease:Quint.easeIn});

	TweenLite.delayedCall(7, removeHead);
	TweenLite.delayedCall(7, dogplosion);

	TweenLite.to(copy2, 0.25, {delay:8.75, opacity:1, ease:Quint.easeOut});
	TweenLite.to(copy2b, 0.25, {delay:9.75, opacity:1, ease:Quint.easeOut});
	TweenLite.to(copy2, 0.25, {delay:11.25, opacity:0, ease:Quint.easeIn});
	TweenLite.to(copy2b, 0.25, {delay:11.25, opacity:0, ease:Quint.easeIn});

	TweenLite.to(copy3, 0.25, {delay:11.5, opacity:1, ease:Quint.easeOut});
	TweenLite.to(copy3, 0.25, {delay:13, opacity:0, ease:Quint.easeIn});

	TweenLite.from(cleaner, 0.75, {delay:13.25, y:-250, ease:Quint.easeOut});
	TweenLite.to(copy, 0.75, 	 {delay:13.35, y:0, ease:Quint.easeOut, onStart:function(){ rAFid = requestAnimationFrame(drawCleaner); }, onComplete:function(){ setTimeout(stopDraw, 100); }});

	TweenLite.to(copy4, 0.5, {delay:13.75, opacity:1, ease:Quint.easeOut});

	TweenLite.to(cta, 0.5, {delay:14.5, opacity:1, ease:Quint.easeOut});
}