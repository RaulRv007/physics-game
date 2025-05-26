class Player {
    constructor(x, y, w, h, angle, points, body_ant, id, jump, stamina, force, sprite) {
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
        this.jump = jump;
        this.force = force;
        this.image = sprite;
        this.w = w;
        this.h = h;
        this.id = id;
        this.body = Bodies.rectangle(x, y, this.w, this.h, options);
        this.body_ant = body_ant;
        this.color = color(random(255), random(255), random(255));
        this.staminaRemove = 20;

        World.add(world, this.body);

        // Track whether key is already handled to simulate keyPressed behavior
        this.keyHandled = {};

        this.show = function () {
            let pos = this.body.position;
            let angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            fill(this.color);
            image(this.image, -this.w / 2, -this.h / 2, this.w, this.h);
            pop();
            if (this.body_ant) {
                let pos_ant = this.body_ant.position;
                stroke(255);
                line(pos.x, pos.y, pos_ant.x, pos_ant.y);
            }
        }

        this.isOnGround = function () {
            let pos = this.body.position;
            let height = HEIGHT - 100 - 20 - this.h - 100;
            return pos.y >= height - this.h / 2;
        }

        this.handleControls = function () {
            switch (this.id) {
                case 0:
                    this.handleControlsPlayer([87, 81, 69]); // W, Q, E
                    break;
                case 1:
                    this.handleControlsPlayer([88, 90, 67]); // X, Z, C
                    break;
                case 2:
                    this.handleControlsPlayer([79, 73, 80]); // O, I, P
                    break;
                case 3:
                    this.handleControlsPlayer([78, 66, 77]); // N, B, M
                    break;
            }
        }

        this.handleControlsPlayer = function (keys) {
            let [jumpKey, leftKey, rightKey] = keys;

            // Jump
            if (this.stamina >= 20) {
                if (keyIsDown(jumpKey) && !this.keyHandled[jumpKey]) {
                    Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: this.jump });
                    this.removeStamina();
                    jump_sound.play();
                    this.keyHandled[jumpKey] = true;
                } else if (!keyIsDown(jumpKey)) {
                    this.keyHandled[jumpKey] = false;
                }
            }

            // Left
            if (keyIsDown(leftKey) && !this.keyHandled[leftKey]) {
                Matter.Body.applyForce(this.body, this.body.position, { x: -this.force, y: 0 });
                this.keyHandled[leftKey] = true;
            } else if (!keyIsDown(leftKey)) {
                this.keyHandled[leftKey] = false;
            }

            // Right
            if (keyIsDown(rightKey) && !this.keyHandled[rightKey]) {
                Matter.Body.applyForce(this.body, this.body.position, { x: this.force, y: 0 });
                this.keyHandled[rightKey] = true;
            } else if (!keyIsDown(rightKey)) {
                this.keyHandled[rightKey] = false;
            }
        }

        this.removeStamina = function () {
            this.stamina -= this.staminaRemove;
        }

        this.recover = function () {
            if (this.stamina <= 50 && !this.recovering) {
                this.recovering = true;
                const recoverAmount = 100;
                const duration = 8000;
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
