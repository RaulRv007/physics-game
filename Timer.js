class DigitalTimer {
  constructor(x, y, fontSize = 48) {
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.totalSeconds = 120; // 2 minutes
    this.startTime = millis();
    this.finished = false;
  }

  update() {
    let elapsed = floor((millis() - this.startTime) / 1000);
    let remaining = this.totalSeconds - elapsed;
    if (remaining <= 0) {
      remaining = 0;
      this.finished = true;
    }

    this.minutes = floor(remaining / 60);
    this.seconds = remaining % 60;
  }

  display() {
    this.update();

    let timerStr = nf(this.minutes, 2) + ":" + nf(this.seconds, 2);

    push();
    textAlign(CENTER, CENTER);
    textSize(this.fontSize);
    fill(0, 255, 0); // green digital clock color

    text(timerStr, this.x, this.y);
    pop();
  }

  isFinished() {
    return this.finished;
  }
}
