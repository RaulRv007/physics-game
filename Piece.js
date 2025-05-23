class Piece{
    constructor(x, y, r, value, sprite) {
        this.options = {
            restitution: 0.5,
            friction: 0,
            density: 0.005,
            mass: 0.3,

        }
        this.body = Bodies.circle(x, y, r, this.options);
        World.add(world, this.body);
        this.r = r;
        this.hasRope = false;
        this.sprite = sprite

        this.show = function() {
            let pos = this.body.position;
            let angle = this.body.angle;

            push();
            translate(pos.x, pos.y);
            rectMode(CENTER);
            fill(255);
            circle(0, 0, this.r * 2);
            image(this.sprite, -this.r * 2, -this.r * 2, this.r * 4, this.r * 4);
            pop();
            if (this.hasRope) {
                let pos_ant = players[players.length - 1].body.position;
                stroke(255);
                line(this.body.position.x, this.body.position.y, pos_ant.x, pos_ant.y);
            }

        }
        this.addConstraint = function(body) {
            let constraint = Constraint.create({
            bodyA: body,
            bodyB: this.body,
            length: 40,
            stiffness: 0.002, // Lower stiffness for more flexibility
            damping: 0.001  // Lower damping for less resistance
            });
            World.add(world, constraint);
        }

    }
}