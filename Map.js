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

    for (let type of this.chunkSequence) {
      const chunk = new Chunk(type, currentX, this.startY, this.chunkWidth);
      chunk.addToWorld(this.world);
      this.chunks.push(chunk);
      currentX += this.chunkWidth;
    }

    const endChunk = new Chunk('end', currentX, this.startY, this.chunkWidth);
    endChunk.addToWorld(this.world);
    this.chunks.push(endChunk);
  }
}
