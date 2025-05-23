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
let actualState = gameState.MAIN_MENU;

let piece
let mapGen;

let chunkNum = 1

let hasWon = false

let sliders = []

function setup() {
	// Set the canvas size
	WIDTH = windowWidth - 50;
	HEIGHT = windowHeight - 50;
	createCanvas(WIDTH, HEIGHT);
	engine = Engine.create();
	world = engine.world;
	textAlign(CENTER, CENTER)
}

function chunkSquence(numChunks){
	let chunkChain = ['flat']
	for(let i = 0; i<= chunkNum; i++){
		if(chunkChain[chunkChain.length - 1] == 'flat' || chunkChain[chunkChain.length - 1] == 'stairs-up', chunkChain[chunkChain.length - 1] == 'pit-`platfoms' ){
			chunkChain.push(random(['climb', 'stairs-down', 'pit-platforms', 'swing']))
		}
		chunkChain.push(random(['climb', 'stairs-up', 'pit-platforms', 'swing']))

	}
	chunkChain.push('end')
	return chunkChain
}

function draw() {
	print(actualState)
	background(50);
	switch (actualState) {
		case gameState.MAIN_MENU:
			textSize(32);
			fill(255);
			text('Press ENTER to start', WIDTH / 2 - 100, HEIGHT / 2);
			if (keyIsDown(ENTER)) {
				actualState = gameState.ON_GAME;
			}
			break;
		case gameState.ON_GAME:
			//my start
			if (!mapGen) {

				mapGen = new MapGenerator(world, chunkSquence(chunkNum), 0, HEIGHT - 100, 1000);
				mapGen.generate();
				//ground = new Ground(WIDTH / 2, HEIGHT + 150 , WIDTH*200, 300, 0);

				piece = new Piece(200, 200, 10, 5);
				/*
				chunk = new Chunk(WIDTH/2, HEIGHT, '');
				chunk.generate();*/

				for (let i = 0; i < numPlayers; i++) {
					let player = new Player(200 + i * 60, 200, 20, 20, 0, 5, null, i, -0.01, 100);
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
			
			for (let i = 0; i < players.length; i++) {
				sliders[i].value = players[i].stamina;
				sliders[i].show();
				print(`stamina: ${players[i].stamina}`);
				print(`slider: ${sliders[i].value}`);
			}
			print(`slider important: ${sliders[1].value}`);
			
			//Show
			let offsetX = width / 2 - players[0].body.position.x -300;
			let offsetY = (height / 2 - players[0].body.position.y)/2;
			push();
			translate(offsetX, offsetY);
			piece.show();
			//ground.show();
			for (let chunk of mapGen.chunks) {
				fill(255, 0, 0);
				rect(chunk.endX[0], chunk.endY[0], chunk.endX[1] - chunk.endX[0], chunk.endY[1] - chunk.endY[0]);
				fill(0, 255, 0);
				for (let body of chunk.bodies) {
				if (body.circleRadius) {
					ellipse(body.position.x, body.position.y, body.circleRadius * 2);
				} else {
					const vertices = body.vertices;
					beginShape();
					for (let v of vertices) {
					vertex(v.x, v.y);
					}
					endShape(CLOSE);
				}
				}
			}
			for (let i = 0; i < players.length; i++) {
				players[i].show();
			}

			pop();
			//show ending

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
			text('you won', WIDTH / 2 - 100, HEIGHT / 2);
			go_main = new Button('GO BACK', 100, 100, 200, 100)
			go_main.draw()
			if (go_main.isPressed() && mouseIsPressed) {
				actualState = gameState.MAIN_MENU;
				players = []
				piece = []
				piece = new Piece(200, 200, 10, 5);
				for (let i = 0; i < numPlayers; i++) {
					let player = new Player(200 + i * 60, 200, 20, 20, 0, 5, null, i, -0.003, 100);
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
				}
			}	
			break
			
	}

	

}/*
function keyPressed() {
	if (keyCode === 83) {
		Matter.Body.applyForce(players[0].body, players[0].body.position, {
			x: 0,
			y: -0.05,
		});
		players[0].removeStamina()
	}
	switch (keyCode) {
		//qwe
		case 87:
			// Move up
			Matter.Body.applyForce(players[0].body, players[0].body.position, {
				x: 0,
				y: -0.05,
			});
			break;
		case 81:
			// Move left
			Matter.Body.applyForce(players[0].body, players[0].body.position, {
				x: -0.05,
				y: 0,
			});
			break;
		case 69:
			// Move right
			Matter.Body.applyForce(players[0].body, players[0].body.position, {
				x: 0.05,
				y: 0,
			});
			break;
		//zxc
		case 88:
			// Move up
			Matter.Body.applyForce(players[1].body, players[1].body.position, {
				x: 0,
				y: -0.05,
			});
			break;
		case 90:
			// Move left
			Matter.Body.applyForce(players[1].body, players[1].body.position, {
				x: -0.05,
				y: 0,
			});
			break;
		case 67:
			// Move right
			Matter.Body.applyForce(players[1].body, players[1].body.position, {
				x: 0.05,
				y: 0,
			});
			break;

		//IOP
		case 79:
			// Move up
			Matter.Body.applyForce(players[2].body, players[2].body.position, {
				x: 0,
				y: -0.05,
			});
			break;
		case 73:
			// Move left
			Matter.Body.applyForce(players[2].body, players[2].body.position, {
				x: -0.05,
				y: 0,
			});
			break;
		case 80:
			// Move right
			Matter.Body.applyForce(players[2].body, players[2].body.position, {
				x: 0.05,
				y: 0,
			});
			break;
		//bnm
		case 78:
			// Move up
			Matter.Body.applyForce(players[3].body, players[3].body.position, {
				x: 0,
				y: -0.05,
			});
			break;
		case 66:
			// Move left
			Matter.Body.applyForce(players[3].body, players[3].body.position, {
				x: -0.05,
				y: 0,
			});
			break;
		case 77:
			// Move right
			Matter.Body.applyForce(players[3].body, players[3].body.position, {
				x: 0.05,
				y: 0,
			});
			break;

	}
}
	*/
