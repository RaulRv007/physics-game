class MapGenerator {
  constructor(world, chunkSequence, startX = 0, startY = 500, chunkWidth) {
    this.world = world;
    this.chunkSequence = chunkSequence;
    this.startX = startX;
    this.startY = startY;
    this.chunkWidth = chunkWidth;
    this.chunks = [];
  }

  generate() {
    let currentX = this.startX;
    for (let i = 0; i < this.chunkSequence.length; i++) {
      let chunk =  new Chunk(this.chunkSequence[i], currentX, this.startY, this.chunkWidth, false);
      if(i <= this.chunkSequence.length - 2){
        if(this.chunkSequence[i+1] == 'stairs-down'){

          chunk = new Chunk(this.chunkSequence[i], currentX, this.startY, this.chunkWidth, true);

          
        }else{

          chunk = new Chunk(this.chunkSequence[i], currentX, this.startY, this.chunkWidth, false);

        }
      }

      chunk.addToWorld(this.world);
      this.chunks.push(chunk);
      currentX += this.chunkWidth;
    }

    const endChunk = new Chunk('end', currentX, this.startY, this.chunkWidth);
    endChunk.addToWorld(this.world);
    this.chunks.push(endChunk);
  }
  
}
