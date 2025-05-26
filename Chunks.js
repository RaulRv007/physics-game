class Chunk {
    constructor(type, x, y, chunkWidth, isStairs, hasObstacles) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.chunkWidth = chunkWidth;
        this.isStairs = isStairs;
        this.bodies = this.#createBodies();
        if(this.type == 'end'){
            this.endX = [x + chunkWidth/3, x + 4*chunkWidth/3]
            this.endY = [y - 100, y + 150]
        }else{
            this.endX = [0, 0]
            this.endY = [0, 0]
        }
    }

    #createBodies() {
        switch (this.type) {
            case 'flat':
                return [Matter.Bodies.rectangle(this.x + this.chunkWidth / 2, this.y, this.chunkWidth, 40, { isStatic: true })];
            case 'gap':
                return [];
            case 'climb':
                print('climb')
                return this.#createClimbing()
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
                        label: 'artifact'
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
    #createClimbing(){
        const steps = 10;
        const stepWidth = this.chunkWidth / steps;
        const stepHeight = 30;
        const bodies = [];
        let random_number = floor(random(0, 5))

        let stepY = this.y
        let stepY_ant = this.y
        for (let i = 0; i < steps; i++) {

            const stepX = this.x + i * stepWidth + stepWidth / 2;
            if(i == 0){
                stepY = this.y
            }

            
            if(this.isStairs){

                if(i > steps - 6){
                    stepY = stepY - stepHeight - (stepHeight/2)
                }else{
                    stepY = this.y * (random(noise(50))/3) + HEIGHT/2.5 + 200

                }
            }else{
                stepY = this.y * (random(noise(50))/3) + HEIGHT/2.5 + 200

                if(abs(stepY - stepY_ant) >= 30){
                    this.y * (random(noise(50))/4) + HEIGHT/2.5 + 200
                }
                
            }

            bodies.push(Matter.Bodies.rectangle(stepX, stepY, stepWidth, 20, { isStatic: true }));
            stepY_ant = stepY
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
