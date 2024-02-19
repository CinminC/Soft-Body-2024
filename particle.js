class Particle extends VerletParticle2D {
  constructor(x, y, facialFeatures) {
    super(x, y);
    this.r = 2;
    physics.addParticle(this);
    this.facialFeatures=facialFeatures
    physics.addBehavior(new AttractionBehavior(this, 1, -1, 0.00));
  }

  show() {

    if(this.facialFeatures=="eyeBrow"){
      originalGraphics.push()
      originalGraphics.translate(this.x,this.y)
      originalGraphics.rotate(bodyAngle+PI/2)
      originalGraphics.rectMode(CENTER)
      originalGraphics.noStroke()
      originalGraphics.fill(20)
      originalGraphics.rect(0,0,r/8,r/32)
      originalGraphics.pop()
    }else if(this.facialFeatures=="mouth"){
      originalGraphics.push()
      originalGraphics.translate(this.x,this.y)
      originalGraphics.rotate(bodyAngle+PI/2)
      originalGraphics.rectMode(CENTER)
      originalGraphics.noStroke()
      originalGraphics.fill(20)
      originalGraphics.rect(0,0,r/8,r/32)
      originalGraphics.noFill()
      originalGraphics.strokeWeight(1)
      originalGraphics.stroke(255)
      // scribblePureEllipse(0,0,150,150)  
      
      originalGraphics.pop()
    
     }else if(this.facialFeatures=="eyes"){
          originalGraphics.strokeWeight(5);
    originalGraphics.stroke(5);
    originalGraphics.strokeWeight(this.r * 2);
    originalGraphics.point(this.x, this.y);
    }else{
       originalGraphics.strokeWeight(5);
    originalGraphics.stroke(5);
    originalGraphics.strokeWeight(this.r * 2);
    originalGraphics.point(this.x, this.y);
    }
  }
}
