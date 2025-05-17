class Platform {
  constructor(x, y, w, h) {
    var options = {
        isStatic: true,
        restitution: 0.5,
        friction: 0.5,

    }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.body = Bodies.rectangle(x, y, w, h, options);
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

class DungeonGenerator {
  constructor(levels = 3) {
    this.levels = levels;
    this.levelSpacing = 80;
    this.platforms = [];
    this.segmentWidth = 80;
  }

  generate() {
    this.platforms = [];

    for (let lvl = 0; lvl < this.levels; lvl++) {
      let baseY = 100 + lvl * this.levelSpacing;
      let xOffset = random(1000); // unique curve for each level

      for (let x = 100; x < width - 100; x += this.segmentWidth) {
        let noiseVal = noise(xOffset);
        let y = baseY + map(noiseVal, 0, 0.25, -40, 30); // curved platform heights
        this.platforms.push(new Platform(x, y, 60, 20));
        xOffset += 0.1; // move through Perlin noise space
      }
    // Add left edge platform for this level
    this.platforms.push(new Platform(100- this.platforms[0].w/2, baseY +50, 5, 80));
    // Add right edge platform for this level
    this.platforms.push(new Platform(width - 100 - this.platforms[0].w/2, baseY + 50, 5, 80));
    }
  }
  display() {
    print("Platforms: ", this.platforms);
    for (let p of this.platforms) {
      p.show();
    }
  }
}