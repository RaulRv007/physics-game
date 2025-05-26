// Matter.js aliases
let Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Runner = Matter.Runner,
	Constraint = Matter.Constraint,
	Composite = Matter.Composite;

let engine;
let world;
let runner;

let ground;
let numPlayers = 2;
let players = [];

let boundaries = [];
let constraints = [];

let WIDTH;
let HEIGHT;
let dungeon;

let gameState = {
	MAIN_MENU : 0,
	ON_GAME: 1,
	WINNING: 2,
	PAUSE: 3,


}
let actualState = gameState.MAIN_MENU

let piece
let mapGen

let chunkNum = 3

let hasWon = false

let sliders = []

let city
let platfoms = []
let player_graphics = []
let coin
let endzone

let font

let timer

let jump_sound
let background_music
let winning

let startTime = 0
let winTimeSaved = false

function setup() {
	// Set the canvas size
	WIDTH = windowWidth - 50;
	HEIGHT = windowHeight - 50;
	createCanvas(WIDTH, HEIGHT);
	engine = Engine.create();
	world = engine.world;
	textAlign(CENTER, CENTER)
	textSize(32);
	textFont(font)
	timer = new DigitalTimer(WIDTH / 2, HEIGHT / 2 -100);
}

function chunkSquence(numChunks){
	let chunkChain = ['flat']
	for(let i = 0; i<= chunkNum; i++){
		if(i == 0){
			chunkChain.push(random(['flat', 'stairs-up', 'pit-platforms', 'swing']))
		}
		if(chunkChain[chunkChain.length - 1] == 'flat' || chunkChain[chunkChain.length - 1] == 'stairs-up' || chunkChain[chunkChain.length - 1] == 'pit-platfoms' ){
			chunkChain.push(random(['climb', 'stairs-down', 'pit-platforms', /*'swing'*/]))
		}
		chunkChain.push(random(['climb', 'stairs-up', 'pit-platforms', /*'swing'*/]))

	}
	chunkChain.push('end')
	return chunkChain
}

function preload(){
	city = loadImage('assets/city.png')
	platfoms.push(loadImage('assets/basic-platform.png'))
	platfoms.push(loadImage('assets/beam-platform.png'))
	platfoms.push(loadImage('assets/beam2-platform.png'))
	platfoms.push(loadImage('assets/comp-platform.png'))
	platfoms.push(loadImage('assets/future-platform.png'))
	player_graphics.push(loadImage('assets/player1.png'))
	player_graphics.push(loadImage('assets/player2.png'))
	player_graphics.push(loadImage('assets/player3.png'))
	player_graphics.push(loadImage('assets/player4.png'))
	coin = loadImage('assets/coin.png')
	font = loadFont('assets/neon.ttf')
	endzone = loadImage('assets/endzone.png')
	jump_sound = loadSound('assets/sound/jump.wav')
	background_music = loadSound('assets/sound/bg_music.mp3')

}

function draw() {

	print(actualState)
	background('#262a31');

	if (!background_music.isPlaying()) {
		//background_music.loop();
		background_music.setVolume(0.1);
	}

	switch (actualState) {
		case gameState.MAIN_MENU:

			city.resize(WIDTH, HEIGHT);
			image(city, 0, 0);
			
			const playerButtons = [
				{ label: '1 Player', x: WIDTH / 2 - 250, y: HEIGHT / 2 + 100 },
				{ label: '2 Player', x: WIDTH / 2 + 100, y: HEIGHT / 2 + 100 },
				{ label: '3 Player', x: WIDTH / 2 - 250, y: HEIGHT / 2 + 200 },
				{ label: '4 Player', x: WIDTH / 2 + 100, y: HEIGHT / 2 + 200 }
			];
			
			playerButtons.forEach(btn => {
				let button = new Button(btn.label, btn.x, btn.y, 200, 100, platfoms[0]);
				button.draw();
				if (button.isPressed() && mouseIsPressed) {
					numPlayers = parseInt(btn.label.split(' ')[0]);
					actualState = gameState.ON_GAME;
				}
			});
			
			text('Select the number of players to start', WIDTH / 2, HEIGHT / 2 - 200);
			
			break;
		case gameState.ON_GAME:
			//my start
			if (!mapGen) {
				startTime = millis();

				mapGen = new MapGenerator(world, chunkSquence(chunkNum), 0, HEIGHT - 100, 1000);
				mapGen.generate();

				piece = new Piece(200, 200, 10, 5, coin);

				for (let i = 0; i < numPlayers; i++) {
					let player = new Player(200 + i * 60, 200, 30, 40, 0, 5, null, i, -0.04, 100, 0.05, player_graphics[i]);
					players.push(player);

					if (i > 0) {
						player.body_ant = players[i - 1].body;
						let constraint = Constraint.create({
						bodyA: players[i - 1].body,
						bodyB: players[i].body,
						length: 60,         
						stiffness: 0.002,   
						damping: 0.001      
						});

						constraints.push(constraint);
						World.add(world, constraint);
					}
					sliders.push(new JumpTimer(200 * i, 50, 100, 20, 100))
				}
			}
			Engine.update(engine);
			

			
			//Show
			let offsetX = width / 2 - players[0].body.position.x -300;
			let offsetY = (height / 2 - players[0].body.position.y)/2;
			push();
			translate(offsetX, offsetY);
			//ground.show();
			for (let chunk of mapGen.chunks) {
				city.resize(chunk.chunkWidth , chunk.chunkWidth);
				image(city, chunk.x + 20, 0);
			}
			for (let chunk of mapGen.chunks) {
				fill(255, 0, 0);
				//rect(chunk.endX[0], chunk.endY[0], chunk.endX[1] - chunk.endX[0], chunk.endY[1] - chunk.endY[0]);
				if(chunk.type == 'end'){
					image(endzone, chunk.endX[0], chunk.endY[0] - 400, chunk.chunkWidth/2, chunk.chunkWidth/2);
				}
				fill(0, 255, 0);
				
				for (let body of chunk.bodies) {
					if (body.circleRadius) {
						ellipse(body.position.x, body.position.y, body.circleRadius * 2);
					} else {
						const vertices = body.vertices;
						// Draw the image within the polygon defined by vertices
						push();
						let minX = Math.min(...vertices.map(v => v.x));
						let minY = Math.min(...vertices.map(v => v.y));
						let maxX = Math.max(...vertices.map(v => v.x));
						let maxY = Math.max(...vertices.map(v => v.y));
						let w = maxX - minX;
						let h = maxY - minY;
						if (!body.platformIndex && body.platformIndex !== 0) {
							body.platformIndex = floor(random(platfoms.length));
						}
						image(platfoms[body.platformIndex], minX, minY, w, h);
						pop();
						print(body);
						
					}
				}
			}
			for (let i = 0; i < players.length; i++) {
				players[i].show();
			}
			piece.show();

			pop();
			//show ending

			for (let i = 0; i < players.length; i++) {
				sliders[i].value = players[i].stamina;
				sliders[i].show();
			}
			timer.display()
			if(timer.isFinished()){
				actualState = gameState.MAIN_MENU;
			}

			for(let i = 0; i < mapGen.chunks.length; i++){
				let chunk = mapGen.chunks[i];
				if(piece.body.position.x >= chunk.endX[0] && piece.body.position.x <= chunk.endX[1]&& piece.body.position.y >= chunk.endY[0] && piece.body.position.y <= chunk.endY[1]){
					actualState = gameState.WINNING;
				}
			}

			for (let i = 0; i < players.length; i++) {
				print(`id: ${players[i].id}`)
				players[i].handleControls();
				players[i].recover()
				print(mapGen.chunks)
				if (dist(players[i].body.position.x, players[i].body.position.y, piece.body.position.x, piece.body.position.y) < 50 && keyIsDown(32)) {
					piece.addConstraint(players[players.length - 1].body);
					piece.hasRope = true;
				}
				if(players[i].body.position.y > HEIGHT + 500){
					actualState = gameState.MAIN_MENU;
					for (let j = 0; j < players.length; j++) {
						Matter.World.remove(world, players[j].body);
						if (j > 0) {
							Matter.World.remove(world, constraints[constraints.length - 1]);
							Matter.World.clear(world, false);
							Matter.Engine.clear(engine);
							constraints.pop();
						}
					}
					players = [];
					constraints = [];
					mapGen = null;
				}

			}

			if(piece.hasRope){
				if (keyIsDown(32) && !piece.ropeForceApplied) {
					Matter.Body.applyForce(piece.body, piece.body.position, {
						x: 0,
						y: -0.01,
					});
					piece.ropeForceApplied = true;
				}
				if (!keyIsDown(32)) {
					piece.ropeForceApplied = false;
				}
				if(keyIsDown(27)){
					Matter.world.remove(world, constraints[constraints.length - 1]);
					piece.hasRope = false;
				}
			}
			break

			case gameState.WINNING:
				city.resize(WIDTH, HEIGHT);
				image(city, 0, 0);
				text('you won', WIDTH / 2 - 100, HEIGHT / 2);
				text(`HIGH SCORE: ${parseFloat(localStorage.getItem('winnerTime')).toFixed(2)} seconds`, WIDTH / 2 - 100, HEIGHT / 2 - 75);

				// Save win time once
				if (!winTimeSaved) {
					let endTime = millis();
					let totalTime = (endTime - startTime) / 1000;
					// Use preventDefault() to stop any potential form submission
					winTimeSaved = true; // Set this first to prevent multiple calls
					sendWinTimeToServer(totalTime);
				}

				go_main = new Button('GO BACK TO MENU', WIDTH/2 - 550, HEIGHT/2 +100, 300, 100, platfoms[0]);
				go_main.draw();

				if (go_main.isPressed() && mouseIsPressed) {
					// Clean up without reload
					World.clear(world, false);
					Engine.clear(engine);
					mapGen = null;
					actualState = gameState.MAIN_MENU;
					players = [];
					piece = [];
					winTimeSaved = false; // Reset for next game
					return false; // Prevent default behavior
				}
				break;


		case gameState.PAUSE:
			city.resize(WIDTH, HEIGHT);
			image(city, 0, 0);
			text('PAUSE', WIDTH / 2 - 100, HEIGHT / 2);
			
			text('carry the coin to the endzone', WIDTH / 2 - 100, HEIGHT / 2 - 75);
			text('collaboration is your greatest tool', WIDTH / 2 - 100, HEIGHT / 2 - 150);
			text('press ctrl to continue the game', WIDTH / 2 - 100, HEIGHT / 2 - 225);
			go_main = new Button('GO BACK TO MENU', WIDTH/2 - 550, HEIGHT/2 +100, 300, 100, platfoms[0]);
			go_main.draw()
			if (go_main.isPressed() && mouseIsPressed) {
				mapGen = null;
				actualState = gameState.MAIN_MENU;
				players = []
				piece = []
				const allBodies = Composite.allBodies(engine.world);
				for (const body of allBodies) {
					World.remove(engine.world, body);
				}


			}	
			break
			
	}
}

function keyPressed() {
	if (keyCode === 17) {
		if(actualState == gameState.ON_GAME){
			actualState = gameState.PAUSE;	
		}else if(actualState == gameState.PAUSE){
			actualState = gameState.ON_GAME;
		}
	}
}

function playerWins() {
  if (!gameWon) {
    let endTime = millis();
    let totalTime = (endTime - startTime) / 1000; // in seconds
    saveTimeToFile(totalTime);
    gameWon = true;
  }
}
function saveTimeToFile(timeInSeconds) {
  let content = `Player won in ${timeInSeconds.toFixed(2)} seconds.`;
  saveStrings([content], 'winner_time.txt');
}
function sendWinTimeToServer(winnerTime) {
	if(localStorage.getItem('winnerTime') > winnerTime){
		localStorage.setItem('winnerTime', winnerTime);
	}
}