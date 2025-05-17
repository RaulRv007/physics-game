class Ground{
    constructor(x, y, width, height, angle){
        this.angle = angle;
        var options = {
            isStatic: true,
            restitution: 0.5,
            friction: 0.5,
            angle: this.angle,

        }
        this.body = Bodies.rectangle(x, y, width, height, options);
        this.width = width;
        this.height = height;

        World.add(world, this.body);
        this.show = function() {
            let pos = this.body.position;
            let angle = this.body.angle;
            push();
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            fill(255);
            rect(0, 0, this.width, this.height );
            pop();
        }
    }

}