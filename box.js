class Box{
    constructor(x, y, w, h) {
        this.options = {
            restitution: 0.8,
            friction: 0.5,
            density: 1.0,
            force: { x: 0, y: -30},
        }
        this.body = Bodies.rectangle(x, y, w, h, this.options);
        this.w = w;
        this.h = h;
        World.add(world, this.body);

        this.show = function() {
            let pos = this.body.position;
            let angle = this.body.angle;

            push();
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            fill(255);
            rect(0, 0, this.w, this.h);
            pop();
        }
    }
}