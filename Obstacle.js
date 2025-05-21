class Obstacle{
    constructor(type, x, y, w, h){
        this.options = {
            restitution: 0.5,
            friction: 0,
            density: 0.005,
            mass: 0.3,

        }
        this.type = type
        this.body = Bodies.circle(x, y, r, this.options);
        //World.add(world, this.body);
        this.w = w;
        this.h = h;

        this.show = function() {
            let pos = this.body.position;
            let angle = this.body.angle;

            push();
            translate(pos.x, pos.y);
            rectMode(CENTER);
            fill(255);
            rect(0, 0, this.w, this.h);
            pop();

        }
    }

}