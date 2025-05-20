class Chunk {
    constructor(type, x, y, chunkWidth) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.chunkWidth = chunkWidth;
        this.bodies = this.#createBodies();
    }

    #createBodies() {
        switch (this.type) {
            case 'flat':
                return [Matter.Bodies.rectangle(this.x + this.chunkWidth / 2, this.y, this.chunkWidth, 40, { isStatic: true })];
            case 'gap':
                return [];
            case 'platform':
                return [
                    Matter.Bodies.rectangle(this.x + this.chunkWidth * 0.3, this.y - 50, 100, 20, { isStatic: true }),
                    Matter.Bodies.rectangle(this.x + this.chunkWidth * 0.7, this.y, 100, 20, { isStatic: true })
                ];
            case 'climb':
                return [
                    Matter.Bodies.rectangle(this.x + this.chunkWidth * 0.3, this.y, 40, 100, { isStatic: true }),
                    Matter.Bodies.rectangle(this.x + this.chunkWidth * 0.7, this.y - 100, 40, 100, { isStatic: true })
                ];
            case 'stairs-up':
                return this.#createStairChunk(true);
            case 'stairs-down':
                return this.#createStairChunk(false);
            case 'pit-platforms':
                return this.#createPitPlatformChunk();
            case 'swing':
                return this.#createSwingChunk();
            case 'end':
                return [
                    Matter.Bodies.rectangle(this.x + this.chunkWidth / 2, this.y, this.chunkWidth, 40, { isStatic: true }),
                    Matter.Bodies.circle(this.x + this.chunkWidth / 2, this.y - 50, 20, {
                        isStatic: true,
                        label: 'artifact',
                        render: { fillStyle: 'gold' }
                    })
                ];
            default:
                return [];
        }
    }

    #createStairChunk(up = true) {
        const steps = 10;
        const stepWidth = this.chunkWidth / steps;
        const stepHeight = 30;
        const bodies = [];

        for (let i = 0; i < steps; i++) {
            const stepX = this.x + i * stepWidth + stepWidth / 2;
            const stepY = this.y - (up ? i : steps - i - 1) * stepHeight;
            bodies.push(Matter.Bodies.rectangle(stepX, stepY, stepWidth, 20, { isStatic: true }));
        }

        return bodies;
    }

    #createPitPlatformChunk() {
        const steps = 3;
        const stepWidth = this.chunkWidth / 6;
        const gap = this.chunkWidth / (steps + 1);
        const bodies = [];

        for (let i = 1; i <= steps + 1; i++) {
            bodies.push(
                Matter.Bodies.rectangle(this.x + i * gap - stepWidth, this.y + 20, stepWidth, 20, { isStatic: true , friction: 1})
            );
        }

        return bodies;
    }

    #createSwingChunk() {
        const bodies = [];
        bodies.push(Matter.Bodies.rectangle(this.x + this.chunkWidth / 2, this.y, this.chunkWidth / 2, 20, { isStatic: true, friction: 0.5 }));
        const anchor = Matter.Bodies.circle(this.x + this.chunkWidth / 2, this.y - 150, 5, {
            isStatic: true,
            label: 'anchor'
        });
        bodies.push(anchor);
        return bodies;
    }

    addToWorld(world) {
        for (let body of this.bodies) {
            Matter.World.add(world, body);
        }
    }
}
