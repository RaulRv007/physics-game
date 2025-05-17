// Matter.js aliases
let Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Runner = Matter.Runner,
	Constraint = Matter.Constraint,
	Composite = Matter.Composite;

let engine;
let world;

let boxes;
let runner;
let ground;
let numPlayers = 4;
let players = [];

let boundaries = [];
let constraints = [];

let WIDTH;
let HEIGHT;
let dungeon;

let gameState = {
	MAIN_MENU : 0,
	ON_GAME: 1,
}
let actualState = gameState.MAIN_MENU;

function setup() {
	// Set the canvas size
	WIDTH = windowWidth;
	HEIGHT = windowHeight;
	createCanvas(WIDTH, HEIGHT);
	engine = Engine.create();
	world = engine.world;

	boxes = [];

}


function draw() {
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
			if (!ground) {
				ground = new Ground(WIDTH / 2, HEIGHT - 100, WIDTH, 20, 0);
				boundaries.push(new Ground(0, HEIGHT / 2, 20, HEIGHT, 0));
				boundaries.push(new Ground(WIDTH, HEIGHT / 2, 20, HEIGHT, 0));
				boundaries.push(new Ground(WIDTH / 2, 0, WIDTH, 20, 0));
				boundaries.push(new Ground(WIDTH / 2, HEIGHT, WIDTH, 20, 0));

				for (let i = 0; i < numPlayers; i++) {
					let player = new Player(200 + i * 60, 200, 20, 5, null);
					players.push(player);

					if (i > 0) {
						player.body_ant = players[i - 1].body;
						let constraint = Constraint.create({
							bodyA: players[i - 1].body,
							bodyB: players[i].body,
							length: 80,
							stiffness: 0.001,
							damping: 0.001
						});
						constraints.push(constraint);
						World.add(world, constraint);
					}
				}
			}
			Engine.update(engine);

			for (let i = 0; i < boxes.length; i++) {
				boxes[i].show();
			}
			for (let i = 0; i < boundaries.length; i++) {
				boundaries[i].show();
			}
			ground.show();
			for (let i = 0; i < players.length; i++) {
				players[i].show();
			}

			

	}
	

}
function keyPressed() {
	if (keyCode === 83) {
		Matter.Body.applyForce(players[0].body, players[0].body.position, {
			x: 0,
			y: -0.05,
		});
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
			Matter.Body.applyForce(players[2].body, players[2].body.position, {
				x: 0,
				y: -0.05,
			});
			break;
		case 66:
			// Move left
			Matter.Body.applyForce(players[2].body, players[2].body.position, {
				x: -0.05,
				y: 0,
			});
			break;
		case 77:
			// Move right
			Matter.Body.applyForce(players[2].body, players[2].body.position, {
				x: 0.05,
				y: 0,
			});
			break;

	}
}
