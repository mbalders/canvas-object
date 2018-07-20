var mini;
var cleaner;
var ass;

//assets for canvas drawing
var assets = {
    dog_white: 	{src: "images/cleaner-dog.jpg", x:300, y:250},
    copy: 		{src: "images/cleaner-simple.png", clip:[0,0,600,500], x:300, y:250},
    dog_mask: 	{src: "images/cleaner-simple.png", clip:[600,0,600,500], x:300, y:250},
    minidog: 	{src: "images/dog.png", x:300, y:250}
};


window.onload = function() {
    //init canvas animators
    cleaner = new CanvasObjectDrawer(document.getElementById('cleaner_can'));
    mini = new CanvasObjectDrawer(document.getElementById('mini_can'));
    bomb = new CanvasObjectDrawer(document.getElementById('bomb_can'));
    
    //init asstes
    ass = new CanvasObjectLoader(assets, startAnimation);
}



function startAnimation(){

	//composite complex image
	cleaner.drawImage(ass.dog_white);

	//cut out dog
	cleaner.mode = "destination-in";
	cleaner.drawImage(ass.dog_mask);

	ass.dog_mask.shadowBlur = 15;
   	ass.dog_mask.shadowColor = "rgba(0,0,0,0.5)";
   	ass.dog_mask.shadowOffsetX = 5;
   	ass.dog_mask.shadowOffsetY = 5;

	cleaner.mode = "destination-over";
	cleaner.drawImage(ass.dog_mask);

	//cut out copy
	cleaner.mode = "destination-out";
	cleaner.drawImage(ass.copy);




	TweenLite.from(cleaner_can, 1, { y:500, ease:Back.easeOut });


	//simple animations
	TweenLite.from(ass.minidog, 1, { delay:1.5, ease:Quad.easeOut, alpha:0, y:100, scaleX:-3, scaleY:3, /*rotation:180,*/
		
		onStart:function(){ mini.startDraw(drawMiniDog); },
		
		onComplete:function(){
			mini.stopDraw();
		}
	});

	//complex animations
	TweenLite.delayedCall(3, dogplosion);
	
}


function drawMiniDog(){
	mini.clear();

    ass.minidog.shadowBlur = 50;
   	ass.minidog.shadowColor = "rgba(0,255,0,1)";

    mini.drawImage(ass.minidog);
}



//dogsplosion dogs
var dogs = [];
var numDogs = 30;

//init the dogsplosion
function dogplosion(){
	for (var i=0; i<numDogs; i++){
		//new dogs, that copy minidog
		var newDog = {};

		for (var p in ass.minidog){
			//console.log(ass.minidog, ass.minidog[p]);
			newDog[p] = ass.minidog[p];
		}


   		newDog.shadowColor = getRandomColor();

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

	//bomb.ctx.shadowBlur = 50;
    //bomb.ctx.shadowColor = "rgba(0,255,0,1)";

	//mini.mode = "destination-over";
	//mini.drawImage(ass.minidog);

	bomb.startDraw(drawDogs);

	//stop animation frame when needed
	TweenLite.delayedCall(4, bomb.stopDraw);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//draw dogsplosion to canvas
function drawDogs(timeArg){

	//reset
	bomb.clear();

	//draw all dogs
	for (i=0; i<dogs.length; i++){
		bomb.drawImage(dogs[i]);
	}
}