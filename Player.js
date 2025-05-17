class Player{
    constructor(x, y, r, angle, points, body_ant){
        this.angle = angle;
        this.points = points;
        var options = {
            isStatic: false,
            restitution: 0.5,
            friction: 0.5,
            angle: this.angle,
        }
        this.r = r;
        this.body = Bodies.circle(x, y, this.r,options);
        this.body_ant = body_ant

        World.add(world, this.body);
        this.show = function() {
            let pos = this.body.position;
            let angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            fill('red');
            circle(0, 0, this.r * 2);
            pop();
            if (this.body_ant) {
                let pos_ant = this.body_ant.position;
                stroke(255);
                line(pos.x, pos.y, pos_ant.x, pos_ant.y);
            }
        }
    }
}