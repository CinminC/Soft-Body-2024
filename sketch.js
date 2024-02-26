const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior, AttractionBehavior } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;

let particles = [];
let particles2 = [];
let particles3 = [];
let springs = [];
let springs2 = [];
let eyes = [];
let bodyAngle;
let bodySpringStrength = 0.003; //0.0002, 0.00005

let colors = ["#D0B75A", "#7AB1D0", "#83A87D", "#924349", "#F7B5B9"]
let faceColor1, faceColor2, colliderColor1, colliderColor2, colliderColor3
let eyesType = ['Ellipse', 'Circle', 'Squint', 'Half', 'HalfStare', 'Bright', 'Shiny']

let theShader;
let webGLCanvas
let originalGraphics

let obj

var w = window.innerWidth,
  h = window.innerHeight;
var r = w < h ? w / 10 : h / 10; // radius is a third of the smaller screen dimension
var x_off = 200,
  y_off = 200,
  z_off = 200;
var vertices_amount = 22;

var px_offset = r / 2; // amplitudevar NOISE_SCALE = 260;  // the higher the softer
var NOISE_SCALE = 20; // the higher the softer
var angy = 0;

function preload() {
  theShader = new p5.Shader(this.renderer, vert, frag)
}

class SoftBody {
  constructor(args) {
    let def = {
      startPos: createVector(width / 2, 0),
      radius: 100,
      segment: 40,
      particles: [],
      bodyP: [],
      innerP: [],
      eyesP: [],
      springs: [],
      faceColor1: "#000",
      faceColor2: "#000",
      eyesDist: 10,
      eyesType: "Shiny",
      eyeAngleLerp: 0,
      eyeSizeRandom: 1,
      eyeSizeRandom2: 1
    }
    Object.assign(def, args)
    Object.assign(this, def)
  }
  init() {
    //setup body points
    this.bodyP.push(new Particle(this.startPos.x, this.startPos.y));
    for (let t = 0; t < (TAU); t += TAU / this.segment) {
      let fluctuation = noise(t * 120, t * 50) * 10;

      let xx = this.startPos.x + (this.radius + fluctuation) * cos(t),
        yy = this.startPos.y + (this.radius + fluctuation) * sin(t),
        p = new Particle(xx, yy);
      this.bodyP.push(p);

    }

    //set up body springs (top drag)
    // for (let i = 1; i < 4; i++) {

    //   // if (random(1) < 0.9) {
    //   let a = this.bodyP[0];
    //   let b = this.bodyP[i];
    //   // let b = particles[(i + 1) % particles.length];
    //   this.springs.push(new Spring(a, b, 0.04));
    //   // }
    //   // }

    // }

    // for (let i = this.bodyP.length - 4; i < this.bodyP.length; i++) {

    //   // if (random(1) < 0.9) {
    //   let a = this.bodyP[0];
    //   let b = this.bodyP[i];
    //   // let b = particles[(i + 1) % particles.length];
    //   this.springs.push(new Spring(a, b, 0.04));
    //   // }
    //   // }
    // }

    //set up body springs 
    for (let i = 1; i < this.bodyP.length; i++) {
      //center & every
      let a = this.bodyP[0];
      let b = this.bodyP[i];
      this.springs.push(new Spring(a, b, bodySpringStrength));

      //except center
      for (let j = i + 1; j < this.bodyP.length; j++) {
        if (i !== j) {
          if (random(1) < 0.9) {
            let a1 = this.bodyP[i];
            let b1 = this.bodyP[j];
            // let b = particles[(i + 1) % particles.length];
            this.springs.push(new Spring(a1, b1, bodySpringStrength));
          }
        }
      }
    }


    for (let i of this.bodyP) this.particles.push(i);


    //setup eyes points
    this.eyesP.push(new Particle(this.startPos.x - this.eyesDist, this.startPos.y));
    this.eyesP.push(new Particle(this.startPos.x + this.eyesDist, this.startPos.y));

    //set up eyes springs
    this.springs.push(new Spring(this.eyesP[0], this.eyesP[1], bodySpringStrength));
    for (let i of this.bodyP) {
      this.springs.push(new Spring(i, this.eyesP[0], bodySpringStrength));
      this.springs.push(new Spring(i, this.eyesP[1], bodySpringStrength));
    }



    // this.segment = int(this.segment / 2);
    // for (let d = 0; d < TAU; d += TAU / this.segment) {
    //   let tempX = this.startPos.x + (this.radius / 2) * cos(d),
    //     tempY = this.startPos.y + (this.radius / 2) * sin(d),
    //     p2 = new Particle(tempX, tempY);
    //   this.innerP.push(p2);
    // }
    // for (let i of this.innerP) this.particles.push(i);


    // for (let i = 0; i < this.innerP.length; i++) {
    //   let aa = this.innerP[i];
    //   let bb = this.bodyP[i];
    //   this.springs.push(new Spring(aa, bb, 2));

    //   for (let j = i + 1; j < this.innerP.length; j++) {
    //     if (i !== j) {
    //       if (random(1) < 0.9) {
    //         let a = this.innerP[i];
    //         let b = this.innerP[j];
    //         // let b = particles[(i + 1) % particles.length];
    //         this.springs.push(new Spring(a, b, bodySpringStrength));
    //       }
    //     }
    //   }
    // }
    // for (let j = 0; j < 5; j++) {
    //   for (let f = 0; f < this.innerP.length; f++) {

    //     let innerSpring1 = this.innerP[f],
    //       innerSpring2 = this.innerP[(f + j) % this.innerP.length];
    //     this.springs.push(
    //       new Spring(innerSpring1, innerSpring2, 0.3)
    //     );
    //   }
    // }

    // for (let v = 0; v < this.bodyP.length; v++) {
    //   let bp = this.bodyP[v],
    //     ip = this.innerP[v];
    //   this.springs.push(
    //     new Spring(bp, ip, 200)
    //   );
    // }
  }
  display(graphics) {
    let bodyStart = createVector(this.bodyP[1].x, this.bodyP[1].y);
    let bodyEnd = createVector(
      this.bodyP[int(this.bodyP.length / 2) + 1].x,
      this.bodyP[int(this.bodyP.length / 2) + 1].y
    );
    bodyAngle = atan2(bodyStart.y - bodyEnd.y, bodyStart.x - bodyEnd.x);

    graphics.fill(255, 0, 0)
    graphics.ellipse(bodyStart.x, bodyStart.y, 15)
    graphics.fill(0, 255, 0)
    graphics.ellipse(bodyEnd.x, bodyEnd.y, 10)

    graphics.stroke("#282828");
    graphics.strokeWeight(this.radius / 30);

    //---draw body
    graphics.push();
    graphics.fill(this.faceColor1);

    graphics.beginShape();
    for (var i = 1; i < this.bodyP.length; i++) {
      graphics.curveVertex(this.bodyP[i].x, this.bodyP[i].y);
      // graphics.ellipse(this.bodyP[i].x, this.bodyP[i].y, 50)

    }
    // graphics.fill(255)
    // graphics.ellipse(this.bodyP[0].x, this.bodyP[0].y, 10)

    for (let i = 1; i < 4; i++) {
      graphics.curveVertex(this.bodyP[i].x, this.bodyP[i].y)
    }
    graphics.endShape();
    graphics.pop();

    //---draw eyes
    let eyeBase = this.radius / 4
    let eyeMid = createVector((this.eyesP[0].x + this.eyesP[1].x) / 2, this.eyesP[0].y)
    let eyeAngle = 0;
    let eyeMove = map(dist(mouseX, mouseY, width / 2, height / 2),
      0, width / 2, 0, this.eyesDist * 0.285)
    if (dist(mouseX, mouseY, width / 2, height / 2) > width / 4) {
      eyeAngle = atan2(mouseY - eyeMid.y, mouseX - eyeMid.x);
    } else {
      eyeAngle = 0
    }
    let blinkScale = ((frameCount) % 150 < 5 || (frameCount) % 455 < 5) ? 0.1 : 1
    this.eyeAngleLerp = lerp(this.eyeAngleLerp, eyeAngle, 0.05)

    if (this.eyesType == "Ellipse") {
      graphics.push();
      graphics.translate(this.eyesP[0].x, this.eyesP[0].y)
      graphics.rotate(bodyAngle)
      // graphics.fill(255)
      // graphics.ellipse(0, 0, this.eyesDist * 1.5, this.eyesDist * 1.8)

      // graphics.fill("#282828")
      // graphics.rotate(-(bodyAngle))
      // graphics.rotate(eyeAngle)
      // graphics.translate(this.eyesDist * 0.25, 0)
      // graphics.ellipse(0, 0, this.eyesDist * 1, this.eyesDist * 1)
      // graphics.pop();
      graphics.push();
      graphics.clip(() => {
        graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.8)
      });
      graphics.fill(255)
      graphics.ellipse(0, 0, eyeBase * 1.8, eyeBase * 1.8)
      graphics.fill("#282828")
      graphics.noStroke()
      graphics.rotate(-(bodyAngle))
      graphics.rotate(this.eyeAngleLerp)
      graphics.translate(eyeMove, 0)
      graphics.ellipse(0, 0, eyeBase * 1.1, eyeBase * 1.2)
      graphics.pop();
      graphics.noFill()
      graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.8)
      graphics.pop();

      graphics.push();
      graphics.translate(this.eyesP[1].x, this.eyesP[1].y)
      graphics.rotate(bodyAngle)

      graphics.push();
      graphics.clip(() => {
        graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.8)
      });
      graphics.fill(255)
      graphics.ellipse(0, 0, eyeBase * 1.8, eyeBase * 1.8)
      graphics.fill("#282828")
      graphics.noStroke()
      graphics.rotate(-(bodyAngle))
      graphics.rotate(this.eyeAngleLerp)
      graphics.translate(eyeMove, 0)
      graphics.ellipse(0, 0, eyeBase * 1.1, eyeBase * 1.2)
      graphics.pop();
      graphics.noFill()
      graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.8)
      graphics.pop();

    } else if (this.eyesType == "Circle") {
      let eyeSize = map(this.eyeSizeRandom, 0, 1, eyeBase * 0.8, eyeBase * 1.1)
      for (let i = 0; i < 2; i++) {
        graphics.push();
        graphics.translate(this.eyesP[i].x, this.eyesP[i].y)
        // graphics.translate(this.eyesP[0].x - eyeBase / 2, this.eyesP[0].y - eyeBase / 3)
        graphics.rotate(bodyAngle)
        graphics.push();
        graphics.clip(() => {
          graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.5)
        });
        graphics.fill(255)
        graphics.ellipse(0, 0, eyeBase * 1.8, eyeBase * 1.8)
        graphics.fill("#282828")
        graphics.noStroke()
        graphics.rotate(-(bodyAngle))
        graphics.rotate(this.eyeAngleLerp)
        graphics.translate(eyeMove, 0)
        graphics.ellipse(0, 0, eyeSize, eyeSize * 1.09)
        graphics.pop();
        //outline
        graphics.noFill()
        graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.5)
        graphics.pop();
      }
    } else if (this.eyesType == "Squint") {
      let eyeSize = map(this.eyeSizeRandom, 0, 1, eyeBase * 0.7, eyeBase * 1.05)
      let eyeY = map(this.eyeSizeRandom2, 0, 1, eyeBase * 0.4, eyeBase * 0.7)
      for (let i = 0; i < 2; i++) {
        graphics.push();
        graphics.translate(this.eyesP[i].x, this.eyesP[i].y)
        // graphics.translate(this.eyesP[0].x - eyeBase / 2, this.eyesP[0].y - eyeBase / 3)
        graphics.rotate(bodyAngle)
        graphics.push();
        graphics.clip(() => {
          graphics.ellipse(0, 0, eyeBase * 1.5, eyeY)
        });
        graphics.fill(255)
        graphics.ellipse(0, 0, eyeBase * 1.8, eyeBase * 1.8)
        graphics.fill("#282828")
        graphics.noStroke()
        graphics.rotate(-(bodyAngle))
        graphics.rotate(this.eyeAngleLerp)
        graphics.translate(eyeMove, 0)
        graphics.ellipse(0, 0, eyeSize, eyeSize * 1.09)
        graphics.pop();
        //outline
        graphics.noFill()
        graphics.ellipse(0, 0, eyeBase * 1.5, eyeY)
        graphics.pop();
      }
    } else if (this.eyesType == "Half") {
      let eyeSize = map(this.eyeSizeRandom, 0, 1, eyeBase * 0.8, eyeBase * 1.1)
      for (let i = 0; i < 2; i++) {
        graphics.push();
        graphics.translate(this.eyesP[i].x, this.eyesP[i].y)
        // graphics.translate(this.eyesP[0].x - eyeBase / 2, this.eyesP[0].y - eyeBase / 3)
        graphics.rotate(bodyAngle)
        graphics.push();
        graphics.clip(() => {
          graphics.arc(0, 0, eyeBase * 1.5, eyeBase * 1.5, PI - PI / 8, PI / 8)
        });
        graphics.fill(255)
        graphics.ellipse(0, 0, eyeBase * 1.8, eyeBase * 1.8)
        graphics.fill("#282828")
        graphics.noStroke()
        graphics.rotate(-(bodyAngle))
        graphics.rotate(this.eyeAngleLerp)
        graphics.translate(eyeMove, 0)
        graphics.ellipse(0, 0, eyeSize, eyeSize * 1.09)
        graphics.pop();
        //outline
        graphics.noFill()
        graphics.arc(0, 0, eyeBase * 1.5, eyeBase * 1.5, PI - PI / 8, PI / 8, CHORD)
        graphics.pop();
      }
    } else if (this.eyesType == "HalfStare") {
      let eyeSize = map(this.eyeSizeRandom, 0, 1, eyeBase * 0.8, eyeBase * 1.1)
      for (let i = 0; i < 2; i++) {
        graphics.push();
        graphics.translate(this.eyesP[i].x, this.eyesP[i].y)
        // graphics.translate(this.eyesP[0].x - eyeBase / 2, this.eyesP[0].y - eyeBase / 3)
        graphics.rotate(bodyAngle)
        graphics.push();
        graphics.clip(() => {
          graphics.arc(0, 0, eyeBase * 1.5, eyeBase * 1.5, -PI / 8, PI + PI / 8)
        });
        graphics.fill(255)
        graphics.ellipse(0, 0, eyeBase * 1.8, eyeBase * 1.8)
        graphics.fill("#282828")
        graphics.noStroke()
        graphics.rotate(-(bodyAngle))
        graphics.rotate(this.eyeAngleLerp)
        graphics.translate(eyeMove, 0)
        graphics.ellipse(0, 0, eyeSize, eyeSize * 1.09)
        graphics.pop();
        //outline
        graphics.noFill()
        graphics.arc(0, 0, eyeBase * 1.5, eyeBase * 1.5, -PI / 8, PI + PI / 8, CHORD)
        graphics.pop();
      }
    } else if (this.eyesType == "Bright") {
      let eyeSize = map(this.eyeSizeRandom, 0, 1, eyeBase * 0.8, eyeBase * 1.1)

      for (let i = 0; i < 2; i++) {
        let eyeSize = eyeBase * map(this.eyeSizeRandom, 0, 1, 0.75, 1)
        graphics.push();
        graphics.translate(this.eyesP[i].x, this.eyesP[i].y)
        // graphics.translate(this.eyesP[0].x - eyeBase / 2, this.eyesP[0].y - eyeBase / 3)
        graphics.rotate(bodyAngle)
        graphics.push();
        graphics.clip(() => {
          graphics.ellipse(0, 0, eyeSize * 1, eyeSize * 1.1)
        });
        graphics.fill(255)
        graphics.ellipse(0, 0, eyeSize * 1.8, eyeSize * 1.8)
        graphics.stroke("#282828")
        graphics.strokeWeight(this.radius * 0.05)
        graphics.noFill()
        graphics.rotate(-(bodyAngle))
        graphics.rotate(this.eyeAngleLerp + PI / 2)
        graphics.ellipse(0, -eyeSize * 0.15, eyeSize * 1, eyeSize * 0.8)
        graphics.pop();
        //outline
        graphics.strokeWeight(this.radius * 0.04)
        graphics.noFill()
        graphics.ellipse(0, 0, eyeSize * 1.1, eyeSize * 1.1)
        graphics.pop();
      }
    } else if (this.eyesType == "Shiny") {
      let eyeSize = map(this.eyeSizeRandom, 0, 1, eyeBase * 1.15, eyeBase * 1.3)
      eyeMove = eyeBase * 0.1

      for (let i = 0; i < 2; i++) {
        graphics.push();
        graphics.translate(this.eyesP[i].x, this.eyesP[i].y)
        // graphics.translate(this.eyesP[0].x - eyeBase / 2, this.eyesP[0].y - eyeBase / 3)
        graphics.rotate(bodyAngle)
        graphics.scale(1, blinkScale)
        graphics.push();
        graphics.clip(() => {
          graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.5)
        });
        graphics.fill(255)
        graphics.ellipse(0, 0, eyeBase * 1.8, eyeBase * 1.8)
        graphics.fill("#282828")
        graphics.noStroke()
        // graphics.rotate(-(bodyAngle))
        // graphics.rotate(this.eyeAngleLerp)
        graphics.translate(eyeMove * cos(this.eyeAngleLerp), eyeMove * sin(this.eyeAngleLerp))
        graphics.ellipse(0, 0, eyeSize, eyeSize)

        //shiny
        graphics.fill(255)
        graphics.ellipse(eyeSize * 0.15 * cos(PI * 5 / 4), eyeSize * 0.15 * sin(PI * 5 / 4), eyeSize * 0.45, eyeSize * 0.45)
        graphics.ellipse(eyeSize * 0.25 * cos(PI / 8), eyeSize * 0.25 * sin(PI / 8), eyeSize * 0.15, eyeSize * 0.15)
        graphics.ellipse(eyeSize * 0.25 * cos(PI * 3 / 8), eyeSize * 0.25 * sin(PI * 3 / 8), eyeSize * 0.15, eyeSize * 0.15)

        graphics.pop();
        //outline
        graphics.noFill()
        graphics.ellipse(0, 0, eyeBase * 1.5, eyeBase * 1.5)
        graphics.pop();
      }
    }



    for (let spring of this.springs) {
      // spring.show(graphics);
    }

  }
  mouse() {
    if (mouseIsPressed) {
      // let dTop = dist(this.particles[0].x, this.particles[0].y, mouseX, mouseY)
      // let dBottom = dist(this.particles[int(this.particles.length / 2)].x, this.particles[int(this.particles.length / 2)].y, mouseX, mouseY)
      // let moveP = this.particles[0]
      // if (dTop > dBottom) {
      //   moveP = this.particles[0]
      // } else if (dTop < dBottom) {
      //   moveP = this.particles[int(this.particles.length / 2)]
      // }
      // particles[0].lock();
      this.particles[0].x = mouseX;
      this.particles[0].y = mouseY;
      this.particles[0].unlock();
      //     particles2[0].x = mouseX;
      // particles2[0].y = mouseY;
      // particles2[0].unlock();
    }
  }
}

function setup() {
  createCanvas(windowHeight, windowHeight);

  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, (height * 2) / 3);
  // let bounds2 = new Rect(width / 2, height / 2 + 150, 600, 200);
  physics.setWorldBounds(bounds);
  // physics.setWorldBounds(bounds2);
  physics.setDrag(0.05);

  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.2)));
  // new_ball(width / 2, height / 2 - 220);

  faceColor1 = random(colors)
  faceColor2 = random(colors)
  while (faceColor1 == faceColor2) faceColor2 = random(colors)
  colliderColor1 = random(colors)
  colliderColor2 = random(colors)
  colliderColor3 = random(colors)

  let size = width * 0.31
  obj = new SoftBody({
    startPos: createVector(width / 2, height / 2 - 220),
    radius: size,
    segment: 28,
    faceColor1: faceColor1,
    faceColor2: faceColor2,
    eyesDist: random(size / 4.3, size / 3),
    eyeSizeRandom: random(1),
    eyeSizeRandom2: random(1)
  })
  obj.init()

  webGLCanvas = createGraphics(width, height, WEBGL)
  originalGraphics = createGraphics(width, height)
}

function new_ball(xx, yy) {
  // physics.clear();
  // physics = new VerletPhysics2D();
  // particles = [];
  // springs = [];
  let particlesTemp = [];
  // physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.5)));

  // let bounds = new Rect(0, 0, width, height);
  // physics.setWorldBounds(bounds);
  // var points = font.textToPoints(key, width / 2 - 90, 180, 360, {
  //   sampleFactor: 0.05,
  // });

  // particles.push(new Particle(200, 100));
  //   particles.push(new Particle(400, 100));
  //   particles.push(new Particle(350, 200));
  //   particles.push(new Particle(400, 300));
  //   particles.push(new Particle(200, 300));
  //   particles.push(new Particle(250, 200));

  //   springs.push(new Spring(particles[0], particles[1], 0.01));
  //   springs.push(new Spring(particles[1], particles[2], 0.01));
  //   springs.push(new Spring(particles[2], particles[3], 0.01));
  //   springs.push(new Spring(particles[3], particles[4], 0.01));
  //   springs.push(new Spring(particles[4], particles[5], 0.01));
  //   springs.push(new Spring(particles[5], particles[0], 0.01));
  //   springs.push(new Spring(particles[5], particles[2], 1));
  //   springs.push(new Spring(particles[0], particles[3], 0.01));
  //   springs.push(new Spring(particles[1], particles[4], 0.01));

  particles.push(new Particle(xx, yy));
  // drawHeart(xx,yy,10)
  scribbleEllipse(xx, yy, 200, 200, particles);
  //   for (var a=0; a<TWO_PI;a+=TWO_PI/vertices_amount) {
  //     var x = xx+r*sin(a);
  //     var y = yy+r*cos(a);

  //     var new_x = x + (
  //                 noise(
  //         ((x_off+x)/NOISE_SCALE),
  //         ((y_off+y)/NOISE_SCALE),
  //                z_off) * px_offset * sin(a));

  //     var new_y = y + (
  //                 noise(
  //         ((x_off+x)/NOISE_SCALE),
  //         ((y_off+y)/NOISE_SCALE),
  //                z_off) * px_offset * cos(a))

  //         let particle = new Particle(new_x,new_y,"body");
  //     particles.push(particle);
  //     particlesTemp.push(particle);
  //   }


  eyes.push(new Particle(xx - r / 8, yy));
  eyes.push(new Particle(xx + r / 8, yy));
  eyes.push(new Particle(xx - r / 8, yy - r / 16));
  eyes.push(new Particle(xx + r / 8, yy - r / 16));
  eyes.push(new Particle(xx, yy + r / 16));

  // for (var i = 0; i < points.length; i++) {
  //   let pt = points[i];
  //   let particle = new Particle(pt.x, pt.y);
  //   particles.push(particle);
  // }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (i !== j) {
        if (random(1) < 0.9) {
          let a = particles[i];
          let b = particles[j];
          // let b = particles[(i + 1) % particles.length];
          springs.push(new Spring(a, b, bodySpringStrength));
        }
      }
    }
  }



  for (let particle of particles) {
    springs.push(new Spring(particle, eyes[0], bodySpringStrength));
    springs.push(new Spring(particle, eyes[1], bodySpringStrength));
    springs.push(new Spring(particle, eyes[2], bodySpringStrength));
    springs.push(new Spring(particle, eyes[3], bodySpringStrength));
    springs.push(new Spring(particle, eyes[4], bodySpringStrength));
  }
  for (let i = 0; i < eyes.length; i++) {
    for (let j = i + 1; j < eyes.length; j++) {
      if (i !== j) {
        if (random(1) < 0.9) {
          let a = eyes[i];
          let b = eyes[j];
          // let b = particles[(i + 1) % particles.length];
          springs.push(new Spring(a, b, bodySpringStrength));
        }
      }
    }
  }

  particles2.push(new Particle(xx, yy));
  stroke(0);
  scribbleEllipse(xx, yy, 120, 120, particles2);
  for (let i = 0; i < particles2.length; i++) {
    let aa = particles2[i];
    let bb = particles[i];
    springs.push(new Spring(aa, bb, 2));

    for (let j = i + 1; j < particles2.length; j++) {
      if (i !== j) {
        if (random(1) < 0.9) {
          let a = particles2[i];
          let b = particles2[j];
          // let b = particles[(i + 1) % particles.length];
          springs.push(new Spring(a, b, bodySpringStrength));
        }
      }
    }
  }
}
function new_rec(x, y) {
  let colour = [random() * 255, random() * 255, random() * 255];

  // 1st box
  let p1 = new Particle(x, y);
  let p2 = new Particle(x + 50, y);
  let p3 = new Particle(x + 100, y);
  let p4 = new Particle(x + 100, y + 50);
  let p5 = new Particle(x + 50, y + 50);
  let p6 = new Particle(x, y + 50);

  particles3.push(p1);
  particles3.push(p2);
  particles3.push(p3);
  particles3.push(p4);
  particles3.push(p5);
  particles3.push(p6);

  springs.push(new Spring(p1, p2, 2));
  springs.push(new Spring(p2, p3, 2));
  springs.push(new Spring(p3, p4, 2));
  springs.push(new Spring(p4, p5, 2));
  springs.push(new Spring(p5, p6, 2));
  springs.push(new Spring(p6, p1, 2));

  // diagonals of 1st box
  springs.push(new Spring(p1, p4, 4));
  springs.push(new Spring(p3, p6, 4));
  //springs.push(new Spring(p1, p5, 0, 0.9, true))
  //springs.push(new Spring(p3, p6, 0, 0.5, true))
  //springs.push(new Spring(p2, p4, 100, 1.0, true))
}

function draw() {
  webGLCanvas.shader(theShader)
  theShader.setUniform('u_resolution', [width / 1000, height / 1000])
  theShader.setUniform('u_time', millis() / 1000)
  theShader.setUniform('u_mouse', [mouseX / width, mouseY / height])
  theShader.setUniform('u_tex', originalGraphics)
  webGLCanvas.clear()
  webGLCanvas.rect(-width / 2, -height / 2, width, height)

  //   for (let particle of particles) {
  //     particle.show();
  //   }

  // for (let spring of springs) {
  //   spring.show();
  // }
  physics.update();

  originalGraphics.background("#EAE7D6");
  originalGraphics.stroke(200)
  originalGraphics.strokeWeight(0.5)
  let span = 5
  for (let i = 0; i < width; i += span) {
    originalGraphics.line(i, 0, i, height)
  }

  originalGraphics.push();
  originalGraphics.strokeWeight(4);
  originalGraphics.stroke("#282828");
  originalGraphics.fill(colliderColor1);
  originalGraphics.rect(width / 2 - 200, height * 2 / 3, 400, height);
  originalGraphics.fill(colliderColor2);
  originalGraphics.ellipse(width / 2, height * 2 / 3 + 10, width * 0.8, 100);
  originalGraphics.fill(colliderColor3);
  originalGraphics.ellipse(width / 2, height * 2 / 3, width * 0.8, 100);
  originalGraphics.pop();



  obj.display(originalGraphics)
  obj.mouse()


  // let bodyStart = createVector(particles[1].x, particles[1].y);
  // let bodyEnd = createVector(
  //   particles[int(particles.length / 2)].x,
  //   particles[int(particles.length / 2)].y
  // );
  // particles[1].show();
  // particles[int(particles.length / 2)].show();
  // bodyAngle = atan2(bodyStart.y - bodyEnd.y, bodyStart.x - bodyEnd.x);

  //draw hat
  // originalGraphics.push();
  // originalGraphics.translate(bodyStart.x, bodyStart.y);
  // originalGraphics.rotate(bodyAngle);
  // originalGraphics.stroke("#282828");
  // originalGraphics.strokeWeight(4);

  // originalGraphics.fill(random(colors));
  // originalGraphics.arc(0, 0, 50, 50, PI, 0);
  // originalGraphics.fill(random(colors));
  // originalGraphics.arc(0, 0, 30, 50, PI, 0);
  // originalGraphics.fill(random(colors));
  // originalGraphics.arc(0, 0, 10, 50, PI, 0);

  // originalGraphics.strokeCap(ROUND);
  // originalGraphics.fill(random(colors));
  // originalGraphics.strokeWeight(6);
  // originalGraphics.line(-25, 0, 25, 0);
  // originalGraphics.strokeWeight(4);
  // originalGraphics.line(0, -25, 0, -35);

  // originalGraphics.translate(0, -35)
  // originalGraphics.rotate(PI / 2)
  // originalGraphics.fill(random(colors));

  // originalGraphics.beginShape();
  // originalGraphics.strokeWeight(1);
  // originalGraphics.vertex(0, 0);
  // originalGraphics.quadraticVertex(6, 10, 0, 12);
  // originalGraphics.quadraticVertex(-6, 10, 0, 0);
  // originalGraphics.endShape(CLOSE);

  // originalGraphics.beginShape();
  // originalGraphics.strokeWeight(1);
  // originalGraphics.vertex(0, 0);
  // originalGraphics.quadraticVertex(6, -10, 0, -12);
  // originalGraphics.quadraticVertex(-6, -10, 0, 0);
  // originalGraphics.endShape(CLOSE);
  // originalGraphics.pop();
  // for (var i = 0; i < eyes.length; i++) {
  //   eyes[i].show();
  // }

  // for (var i = 0; i < springs.length; i++) {
  //   springs[i].show();
  // }



  // if (mouseIsPressed) {
  //   // particles[0].lock();
  //   particles[0].x = mouseX;
  //   particles[0].y = mouseY;
  //   particles[0].unlock();
  //   //     particles2[0].x = mouseX;
  //   // particles2[0].y = mouseY;
  //   // particles2[0].unlock();
  // }


  image(webGLCanvas, 0, 0, width, height)

}



// function mouseClicked() {
//   new_ball(mouseX,mouseY)
// }
