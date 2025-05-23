class Player{
    constructor(x, y, w, h, angle, points, body_ant, id, jump, stamina, force, sprite){
        this.angle = angle;
        this.points = points;
        var options = {
            isStatic: false,
            restitution: 0,
            friction: 1,
            angle: this.angle,
            density: 0.005,
            mass: 1.5,
        }
        this.stamina = stamina;
        this.jump = jump
        this.force = force
        this.image = sprite

        this.w = w;
        this.h = h;
        this.id = id;
        this.body = Bodies.rectangle(x, y, this.w, this.h,options);
        this.body_ant = body_ant
        this.color = color(random(255), random(255), random(255));
				this.staminaRemove = 20

        World.add(world, this.body);
        this.show = function() {
            let pos = this.body.position;
            let angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            fill(this.color);
            //rect(0, 0, this.w, this.h);
            image(this.image, -this.w/2, -this.h/2, this.w, this.h);
            pop();
            if (this.body_ant) {
                let pos_ant = this.body_ant.position;
                stroke(255);
                line(pos.x, pos.y, pos_ant.x, pos_ant.y);
            }
        }
        this.isOnGround = function() {
            let pos = this.body.position;
            let angle = this.body.angle;
            let height =  HEIGHT - 100 - 20 - this.h - 100;
            if (pos.y >= height - this.h / 2) {
                return true;
            }
            return false;
        }
        this.handleControls = function(){
            switch (this.id) {
                case 0:
                    this.handleControlsPlayer1();
                    break;
                case 1:
                    this.handleControlsPlayer2();
                    break;
                case 2:
                    this.handleControlsPlayer3();
                    break;
                case 3:
                    this.handleControlsPlayer4();
                    break;
            }

        }
        this.handleControlsPlayer1 = function() {
            if(this.stamina >= 20){
                if (keyIsDown(87)) {
                    Matter.Body.applyForce(this.body, this.body.position, {x: 0, y: this.jump});
                    this.removeStamina()
                }else{
                    this.staminaRemoved = false
                }
            }
            if (keyIsDown(81)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: -this.force, y: 0});
            }
            if (keyIsDown(69)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: this.force, y: 0});
            }
        }
        this.handleControlsPlayer2 = function() {
            if(this.stamina >= 20){

                if (keyIsDown(88)) {
                    Matter.Body.applyForce(this.body, this.body.position, {x: 0, y: this.jump});
                     this.removeStamina()
                }else{
                    this.staminaRemoved = false
                }
            }
            if (keyIsDown(90)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: -this.force, y: 0});
            }
            if (keyIsDown(67)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: this.force, y: 0});
            }
        }
        this.handleControlsPlayer3 = function() {
            if(this.stamina >= 20){

                if (keyIsDown(79)) {
                    Matter.Body.applyForce(this.body, this.body.position, {x: 0, y: this.jump});
                     this.removeStamina()
                }else{
                    this.staminaRemoved = false
                }
            }
            if (keyIsDown(73)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: -this.force, y: 0});
            }
            if (keyIsDown(80)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: this.force, y: 0});
            }
        }
        this.handleControlsPlayer4 = function() {
            if(this.stamina >= 20){

                if (keyIsDown(78)) {
                    Matter.Body.applyForce(this.body, this.body.position, {x: 0, y: this.jump});
                     this.removeStamina()
                }else{
                    this.staminaRemoved = false
                }
            }
            if (keyIsDown(66)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: -this.force, y: 0});
            }
            if (keyIsDown(77)) {
                Matter.Body.applyForce(this.body, this.body.position, {x: this.force, y: 0});
            }
        }
        this.removeStamina = function(){
            if (!this.staminaRemoved) {
                this.stamina -= this.staminaRemove;
                this.staminaRemoved = true;
            }
        }
        this.recover = function(){
            if (this.stamina <= 50 && !this.recovering) {
                this.recovering = true;
                const recoverAmount = 100; // assuming max stamina is 100
                const duration = 4000; // 5 seconds
                const interval = 50;
                const increment = recoverAmount / (duration / interval);
                const recoverInterval = setInterval(() => {
                    this.stamina += increment;
                    if (this.stamina >= recoverAmount) {
                        this.stamina = recoverAmount;
                        clearInterval(recoverInterval);
                        this.recovering = false;
                    }
                }, interval);
            }
        }
    }
}