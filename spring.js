class Spring extends VerletSpring2D {
  constructor(a, b, strength) {
    let length = dist(a.x, a.y, b.x, b.y) * 0.8;
    super(a, b, length * 1, strength);
    physics.addSpring(this);
  }

  show(graphics) {
    graphics.stroke(0);
    graphics.strokeWeight(0.5);
    graphics.line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
