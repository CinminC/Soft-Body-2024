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
let bodySpringStrength = 0.002; //0.0002, 0.00005

let colors = ["#D0B75A", "#7AB1D0", "#83A87D", "#924349", "#F7B5B9"]
let faceColor1, faceColor2, colliderColor1, colliderColor2, colliderColor3
let eyesType = ['Ellipse', 'Circle', 'Squint', 'Half', 'HalfStare', 'Bright', 'Shiny']
let mouthType = ['Thick', 'Calm', 'Compressed', 'Cute', 'Smile', 'Unhappy', 'Monster']
let headwear = ['PropellerHat', 'Fruit', 'Stack', 'Beret', 'Curly', 'Tomato', 'BowTie', 'Leaf', 'OneCurly', 'Puffy']

let theShader;
let webGLCanvas
let originalGraphics

let obj

let mousePressedPos
let moveP


let GLOBAL = {
  "size": {
    "width": 800,
    "height": 800,
    "ratioFixed": true
  },
  "pixelDensity": 2
}

function fitCanvasSize() {
  //given canvas width and height and window with height, fit canvas to window
  if (GLOBAL.size.ratioFixed) {

    let windowRatio = window.innerWidth / window.innerHeight
    let canvasRatio = GLOBAL.size.width / GLOBAL.size.height


    if (windowRatio > canvasRatio) {
      // window is wider than canvas
      let minH = window.innerHeight
      let minW = minH * canvasRatio
      //set canvas size
      canvas.style.width = minW + "px"
      canvas.style.height = minH + "px"
    } else {
      // window is taller than canvas
      let minW = window.innerWidth
      let minH = minW / canvasRatio
      //set canvas size
      canvas.style.width = minW + "px"
      canvas.style.height = minH + "px"
    }

  }

}

function windowResized() {
  fitCanvasSize()
}



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
      eyesType: "Half",
      mouthType: "Monster",
      headwear: "Puffy",
      eyeAngleLerp: 0,
      eyeSizeRandom: 1,
      eyeSizeRandom2: 1,
      mouthSizeRandom: 1,
      hairSizeRandom: 1
    }
    Object.assign(def, args)
    Object.assign(this, def)
  }
  init() {
    //setup body points
    this.bodyP.push(new Particle(this.startPos.x, this.startPos.y));
    for (let t = 0; t < (TAU); t += TAU / this.segment) {
      let fluctuation = noise(t * 120, t * 50) * 8;

      let xx = this.startPos.x + (this.radius + fluctuation) * cos(t),
        yy = this.startPos.y + (this.radius + fluctuation) * sin(t),
        p = new Particle(xx, yy);
      this.bodyP.push(p);
      // originalGraphics.fill(map(t, 0, TAU, 0, 255))
      // originalGraphics.ellipse(xx, yy, 20)

    }

    // // set up body springs (top drag)
    // let bodyTopN = int(this.bodyP.length * 3 / 4) + 1
    // for (let i = bodyTopN; i < bodyTopN + 5; i++) {

    //   // if (random(1) < 0.9) {
    //   let a = this.bodyP[bodyTopN];
    //   let b = this.bodyP[i];
    //   // let b = particles[(i + 1) % particles.length];
    //   this.springs.push(new Spring(a, b, bodySpringStrength * 5));
    //   // }
    //   // }

    // }

    // for (let i = bodyTopN - 5; i < bodyTopN; i++) {

    //   // if (random(1) < 0.9) {
    //   let a = this.bodyP[bodyTopN];
    //   let b = this.bodyP[i];
    //   // let b = particles[(i + 1) % particles.length];
    //   this.springs.push(new Spring(a, b, bodySpringStrength * 5));
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
      // if (i != bodyTopN) {
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
      // }

    }


    for (let i of this.bodyP) this.particles.push(i);


    //setup eyes points
    this.eyesP.push(new Particle(this.startPos.x - this.eyesDist, this.startPos.y - this.radius / 3));
    this.eyesP.push(new Particle(this.startPos.x + this.eyesDist, this.startPos.y - this.radius / 3));

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
    let bodyCenter = createVector(this.bodyP[0].x, this.bodyP[0].y);
    let bodyEnd = createVector(
      this.bodyP[int(this.bodyP.length / 2) + 1].x,
      this.bodyP[int(this.bodyP.length / 2) + 1].y
    );
    let bodyTop = createVector(
      this.bodyP[int(this.bodyP.length * 3 / 4) + 1].x,
      this.bodyP[int(this.bodyP.length * 3 / 4) + 1].y
    );
    let bodyTopN = int(this.bodyP.length * 3 / 4) + 1

    bodyAngle = atan2(bodyStart.y - bodyEnd.y, bodyStart.x - bodyEnd.x);

    graphics.fill(255, 0, 0)
    graphics.ellipse(bodyStart.x, bodyStart.y, 40)
    graphics.fill(0, 255, 0)
    graphics.ellipse(bodyTop.x, bodyTop.y, 40)
    graphics.fill(0, 0, 255)
    graphics.ellipse(bodyEnd.x, bodyEnd.y, 40)

    graphics.stroke("#282828");
    graphics.strokeWeight(this.radius / 30);

    //---draw body
    graphics.push();
    graphics.fill(this.faceColor1);

    graphics.beginShape();
    for (var i = 1; i < this.bodyP.length; i++) {
      if (i == bodyTopN) {
        graphics.curveVertex(
          (this.bodyP[bodyTopN - 1].x + this.bodyP[bodyTopN + 1].x) / 2,
          lerp((this.bodyP[bodyTopN - 1].y + this.bodyP[bodyTopN + 1].y) / 2, this.bodyP[i].y, 0.5));

        // graphics.fill(50)

        // graphics.ellipse(
        //   (this.bodyP[bodyTopN - 1].x + this.bodyP[bodyTopN + 1].x) / 2,
        //   lerp((this.bodyP[bodyTopN - 1].y + this.bodyP[bodyTopN - +1].y) / 2, this.bodyP[i].y, 0.5), 50)
        // graphics.fill(255)
        // graphics.ellipse(this.bodyP[bodyTopN - 1].x, this.bodyP[bodyTopN - 1].y, 50)
        // graphics.ellipse(this.bodyP[bodyTopN + 1].x, this.bodyP[bodyTopN + 1].y, 50)
      } else {
        graphics.curveVertex(this.bodyP[i].x, this.bodyP[i].y);
        // graphics.fill(map(i, 1, this.bodyP.length, 0, 255))
        // graphics.ellipse(this.bodyP[i].x, this.bodyP[i].y, 20)

      }

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
    let eyeMid = createVector((this.eyesP[0].x + this.eyesP[1].x) / 2, (this.eyesP[0].y + this.eyesP[1].y) / 2)
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

    //---draw mouth
    graphics.push()
    graphics.translate(eyeMid.x, eyeMid.y)
    graphics.rotate(bodyAngle)
    graphics.translate(0, this.radius / 4)
    if (this.mouthType == "Thick") {
      graphics.push()
      graphics.rotate(sin(bodyTop.y / 30 + PI / 2) / 5)
      let size = this.radius * 0.045
      let hh = map(sin(bodyTop.y / 50 + bodyTop.x / 50), -1, 1, size * 1.5, size * 3.5)

      graphics.translate(0, this.radius / 20)
      graphics.strokeCap(ROUND);
      graphics.strokeWeight(size * 1.6)
      graphics.stroke("#9F5F42")
      graphics.noFill()
      graphics.arc(0, -size / 2, size * 10, hh, PI / 16 + PI, PI * 15 / 16 + PI)
      graphics.arc(0, size / 2, size * 10, hh, PI / 16 + PI, PI * 15 / 16 + PI)
      graphics.strokeWeight(size * 0.2)
      graphics.stroke(20)
      graphics.arc(0, 0, size * 10, hh, PI / 16 + PI, PI * 15 / 16 + PI)
      graphics.pop()
    } else if (this.mouthType == "Calm") {
      let size = this.radius * map(this.mouthSizeRandom, 0, 1, 0.045, 0.17)
      graphics.rotate(sin(bodyTop.y / 30 + PI / 2) / 5)
      graphics.line(-size, 0, size, 0)
    } else if (this.mouthType == "Compressed") {
      let size = this.radius * 0.15

      graphics.noFill()
      graphics.translate(0, (this.eyeType == 'Ellipse') ? 0 : -size * 0.75)  //move up

      let mouthWidth = size * 0.5 * sin(bodyTop.y / 50) + size * 1.5
      graphics.arc(0, size, mouthWidth, size * 0.6, PI, PI * 2)
      graphics.line(-mouthWidth / 2, size, -mouthWidth / 2, size - size / 3)
      graphics.line(mouthWidth / 2, size, mouthWidth / 2, size - size / 3)
    } else if (this.mouthType == "Cute") {
      let size = this.radius * 0.1
      let w = map(sin(bodyTop.y / 50), 0, 1, 0.7, 1)
      graphics.translate(0, -size * 2)
      graphics.noFill()
      graphics.arc(-size * 1.5 * w, size * 1.5, size * (3 * w), size * 1.5, 0, PI * 3 / 4)
      graphics.arc(size * 1.5 * w, size * 1.5, size * (3 * w), size * 1.5, PI / 4, PI)
    } else if (this.mouthType == "Smile") {
      let size = this.radius * 0.05
      graphics.rotate(sin(bodyTop.y / 20) / 6)
      graphics.translate(0, size)
      graphics.line(-size * 2, -size, 0, 0)
      graphics.line(0, 0, size * 2, -size)
    } else if (this.mouthType == "Unhappy") {
      let size = this.radius * 0.05
      graphics.rotate(sin(bodyTop.y / 20) / 6)
      graphics.translate(0, size)
      graphics.line(-size * 2, 0, 0, -size)
      graphics.line(0, -size, size * 2, 0)
    } else if (this.mouthType == "Monster") {
      let size = this.radius * 0.05
      let w = map(sin(bodyTop.y / 50), 0, 1, 0.5, 1)
      let teethH = map(sin(bodyTop.y / 50), 0, 1, size * 0.7, size * 1.1)

      graphics.rotate(sin(bodyTop.y / 40) / 3)
      graphics.line(-size * 3, -size * 0.25, size * 3, -size * 0.25)
      graphics.fill(255)

      graphics.push()
      graphics.strokeWeight(this.radius / 80)
      graphics.translate(-size * 1.5, 0)
      graphics.triangle(-size / 2, 0, size / 2, 0, 0, teethH)
      graphics.pop()

      graphics.push()
      graphics.strokeWeight(this.radius / 80)
      graphics.translate(size * 1.5, 0)
      graphics.triangle(-size / 2, 0, size / 2, 0, 0, teethH)
      graphics.pop()
    }
    graphics.pop()


    if (this.headwear == "PropellerHat") {
      let s = this.radius / 10
      let r = map(sin(bodyTop.y / 10), 0, 1, 0, PI * 2)

      graphics.push()
      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.translate(0, this.radius / 15);
      // graphics.rotate(bodyAngle);
      graphics.stroke("#282828");
      graphics.strokeWeight(this.radius / 30);

      graphics.fill(random(colors));
      graphics.arc(0, 0, s * 5, s * 5, PI, 0);
      graphics.fill(random(colors));
      graphics.arc(0, 0, s * 3, s * 5, PI, 0);
      graphics.fill(random(colors));
      graphics.arc(0, 0, s, s * 5, PI, 0);

      graphics.strokeCap(ROUND);
      graphics.fill(random(colors));
      // graphics.strokeWeight(6);
      graphics.rectMode(CENTER)
      graphics.rect(0, s * 0.3, s * 6, s * 0.6, s * 0.3)
      graphics.strokeWeight(this.radius / 20);

      graphics.line(0, -s * 2.5, 0, -s * 3.5);

      graphics.translate(0, -s * 3.5)
      graphics.rotate(PI / 2 + r)
      graphics.fill(random(colors));
      graphics.strokeWeight(this.radius / 50);

      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.quadraticVertex(s * 0.6, s, 0, s * 1.2);
      graphics.quadraticVertex(-s * 0.6, s, 0, 0);
      graphics.endShape(CLOSE);

      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.quadraticVertex(s * 0.6, -s, 0, -s * 1.2);
      graphics.quadraticVertex(-s * 0.6, -s, 0, 0);
      graphics.endShape(CLOSE);
      graphics.pop()
    } else if (this.headwear == "Fruit") {
      // let baseY = lerp((this.bodyP[bodyTopN - 1].y + this.bodyP[bodyTopN - +1].y) / 2, this.bodyP[i].y, 0.2);
      let baseY = (this.bodyP[bodyTopN - 1].y + this.bodyP[bodyTopN - +1].y) / 2;
      let s = this.radius / 20
      let r = map(sin(bodyTop.y / 50), 0, 1, -PI / 8, -PI / 4)
      graphics.push()

      graphics.strokeWeight(this.radius / 30)

      graphics.push()
      graphics.translate(eyeMid.x, eyeMid.y)
      graphics.rotate(bodyAngle)
      graphics.translate(0, - this.radius * 2 / 3 + s * 5.5)
      graphics.noFill()
      graphics.arc(0, 0, s * 6, s * 2, 0, PI)
      graphics.pop()

      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.rectMode(CENTER)
      graphics.fill("#9F633E")
      graphics.rect(0, 0, s, s * 8, s / 2)
      graphics.translate(0, -s)
      graphics.rotate(r)
      graphics.fill("#94D06C")
      graphics.ellipse(s * 1.8, 0, s * 3, s)
      graphics.pop()

    } else if (this.headwear == "Stack") {
      let s = this.radius / 5
      let r = map(sin(bodyTop.x / 20 + bodyTop.y / 50), 0, 1, 0, PI / 20)
      graphics.push()
      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle + r)
      graphics.translate(0, this.radius / 15);
      graphics.fill("#bd9557")
      graphics.ellipse(0, 0, s * 3, s * 1.1)
      graphics.ellipse(0, -this.radius / 9, s * 2.2, s * 2.4 / 3)
      graphics.ellipse(0, -this.radius / 9 * 2, s * 1.5, s * 2 / 3)
      graphics.pop()
    } else if (this.headwear == "Beret") {
      let s = this.radius / 5
      let r = map(sin(bodyTop.y / 50), 0, 1, -PI / 12, -PI / 8)
      let y = lerp(eyeMid.y, bodyTop.y, 0.1)
      graphics.push()
      graphics.translate(eyeMid.x, eyeMid.y)
      graphics.rotate(bodyAngle + r)
      graphics.translate(0, - dist(eyeMid.x, eyeMid.y, bodyTop.x, bodyTop.y))

      graphics.fill(faceColor2)  //headwear clr
      graphics.ellipse(0, 0, s * 3, s * 1.3)
      graphics.rect(0, -s, s * 0.2, s * 0.7, s * 0.1)
      graphics.pop()
    } else if (this.headwear == "Curly") {
      let r = this.radius / 5
      let angle = map(sin(bodyTop.y / 50), 0, 1, -PI / 18, -PI / 9)
      graphics.push()

      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.strokeWeight(this.radius / 30)
      graphics.fill(60)

      graphics.push()
      graphics.rotate(angle)
      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.bezierVertex(0, 0, r * 0.5, -r, r, 0);
      graphics.bezierVertex(r, 0, r * 1.5, r, r * 2, 0);
      graphics.bezierVertex(r * 2, 0, r * 2.1, r * 1.3, r, r * 0.9);
      graphics.bezierVertex(r, r * 0.9, r * 0.2, r * 0.6, 0, 0);
      graphics.vertex(0, 0);
      graphics.endShape();
      graphics.pop()

      graphics.push()
      graphics.rotate(-angle)
      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.bezierVertex(0, 0, -r * 0.5, -r, -r, 0);
      graphics.bezierVertex(-r, 0, -r * 1.5, r, -r * 2, 0);
      graphics.bezierVertex(-r * 2, 0, -r * 2.1, r * 1.3, -r, r * 0.9);
      graphics.bezierVertex(-r, r * 0.9, -r * 0.2, r * 0.6, 0, 0);
      graphics.vertex(0, 0);
      graphics.endShape();
      graphics.pop()

      graphics.pop()
    } else if (this.headwear == "Tomato") {
      let r = this.radius / 6
      let angle = PI / 5
      // let angle = map(sin(bodyTop.y / 50), 0, 1, -PI / 18, -PI / 9)
      graphics.push()
      graphics.translate(bodyTop.x, bodyTop.y + this.radius / 15)
      graphics.rotate(bodyAngle)
      graphics.fill("#038800")
      graphics.rectMode(CENTER)
      graphics.rect(0, 0 - r * 0.5, r * 0.5, r * 1, r * 0.2)

      //right half(bottom)
      graphics.push()
      graphics.rotate(angle * 0.1)
      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.push()
      graphics.pop()
      graphics.bezierVertex(0, 0, r * 0.5, -r, r, 0);
      graphics.bezierVertex(r, 0, r * 1.5, r, r * 1.8, r);
      graphics.bezierVertex(r * 1.8, r, r * 2.1, r * 1.3, r, r * 0.9);
      graphics.bezierVertex(r, r * 0.9, r * 0.2, r * 0.6, 0, 0);
      graphics.vertex(0, 0);
      graphics.endShape();
      graphics.pop()

      //left half(bottom)
      graphics.push()
      graphics.rotate(-angle * 0.1)
      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.bezierVertex(0, 0, -r * 0.5, -r, -r, 0);
      graphics.bezierVertex(-r, 0, -r * 1.5, r, -r * 1.8, r);
      graphics.bezierVertex(-r * 1.8, r, -r * 2.1, r * 1.3, -r, r * 0.9);
      graphics.bezierVertex(-r, r * 0.9, -r * 0.2, r * 0.6, 0, 0);
      graphics.vertex(0, 0);
      graphics.endShape();
      graphics.pop()

      //right half(top)
      graphics.push()
      graphics.rotate(angle)
      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.push()
      graphics.pop()
      graphics.bezierVertex(0, 0, r * 0.5, -r, r, 0);
      graphics.bezierVertex(r, 0, r * 1.5, r, r * 1.8, r);
      graphics.bezierVertex(r * 1.8, r, r * 2.1, r * 1.3, r, r * 0.9);
      graphics.bezierVertex(r, r * 0.9, r * 0.2, r * 0.6, 0, 0);
      graphics.vertex(0, 0);
      graphics.endShape();
      graphics.pop()


      //left half
      graphics.push()
      graphics.rotate(-angle)
      graphics.beginShape();
      graphics.vertex(0, 0);
      graphics.bezierVertex(0, 0, -r * 0.5, -r, -r, 0);
      graphics.bezierVertex(-r, 0, -r * 1.5, r, -r * 1.8, r);
      graphics.bezierVertex(-r * 1.8, r, -r * 2.1, r * 1.3, -r, r * 0.9);
      graphics.bezierVertex(-r, r * 0.9, -r * 0.2, r * 0.6, 0, 0);
      graphics.vertex(0, 0);
      graphics.endShape();
      graphics.pop()


      graphics.pop()
    } else if (this.headwear == "BowTie") {
      let r = this.radius / 5
      let angle = map(sin(bodyTop.y / 50 + bodyTop.x / 40), 0, 1, -PI / 18, -PI / 9)
      let h = map(this.hairSizeRandom, 0, 1, r / 2, r)
      graphics.push()

      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.strokeWeight(this.radius / 30)
      graphics.fill(faceColor2)  //headwear clr
      graphics.strokeJoin(ROUND);

      graphics.push()
      graphics.rotate(angle)
      graphics.triangle(0, 0, r, h, r, -h)
      graphics.pop()

      graphics.push()
      graphics.rotate(-angle)
      graphics.triangle(0, 0, -r, h, -r, -h)
      graphics.pop()

      graphics.ellipse(0, 0, r / 2)
      graphics.pop()
    } else if (this.headwear == "Leaf") {
      let r = this.radius / 20
      let angle = map(sin(bodyTop.y / 50), 0, 1, -PI / 18, -PI / 9)
      let angle2 = map(sin(bodyTop.y / 50 + bodyTop.x / 40), 0, 1, 0, PI * 1 / 4)
      let h = map(this.hairSizeRandom, 0, 1, r / 2, r)
      graphics.push()

      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.strokeWeight(this.radius / 30)
      graphics.fill(faceColor2)  //headwear clr
      graphics.strokeJoin(ROUND);

      // graphics.arc(0, 0, r, r * 4, PI / 2, -PI / 2)
      graphics.rotate(angle)
      graphics.noFill()
      graphics.beginShape()
      graphics.curveVertex(0, 0)
      graphics.curveVertex(0, 0)
      graphics.curveVertex(-r * 0.7, -r * 2)
      graphics.curveVertex(0, -r * 4)
      graphics.curveVertex(0, -r * 4)
      graphics.endShape()

      graphics.translate(0, -r * 4)
      graphics.push()
      graphics.rotate(angle2)
      graphics.ellipse(-r * 3 / 2, 0, r * 3, r)
      graphics.pop()

      graphics.push()
      graphics.rotate(-angle2)
      graphics.ellipse(r * 3 / 2, 0, r * 3, r)
      graphics.pop()

      // graphics.ellipse(0, 0, r / 2)
      graphics.pop()
    } else if (this.headwear == "OneCurly") {
      let r = this.radius / 20
      let angle = map(sin(bodyTop.y / 30 + bodyTop.x / 20), 0, 1, -PI / 18, -PI / 9)
      let h = map(this.hairSizeRandom, 0, 1, r / 2, r)
      graphics.push()

      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.strokeWeight(this.radius / 30)
      graphics.fill(faceColor2)  //headwear clr
      graphics.strokeJoin(ROUND);

      // graphics.arc(0, 0, r, r * 4, PI / 2, -PI / 2)
      graphics.rotate(angle)
      graphics.noFill()
      graphics.beginShape()
      graphics.curveVertex(0, 0)
      graphics.curveVertex(0, 0)
      graphics.curveVertex(-r * 0.7, -r * 2)
      graphics.curveVertex(0, -r * 4)
      graphics.curveVertex(0, -r * 4)
      graphics.endShape()

      graphics.translate(0, -r * 4)
      graphics.ellipse(r / 2, 0, r * 1.2, r * 1.2)

      graphics.beginShape()
      graphics.curveVertex(0, 0)
      graphics.curveVertex(0, 0)
      graphics.curveVertex(-r * 0.7, -r * 2)
      graphics.curveVertex(0, -r * 4)
      graphics.curveVertex(0, -r * 4)
      graphics.endShape()

      // graphics.ellipse(0, 0, r / 2)
      graphics.pop()
    } else if (this.headwear == "Puffy") {
      let r = this.radius / 20
      let angle = map(sin(bodyTop.y / 30 + bodyTop.x / 20), 0, 1, -PI / 18, -PI / 9)
      let h = map(this.hairSizeRandom, 0, 1, r / 2, r)
      graphics.push()

      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.strokeWeight(this.radius / 30)
      graphics.fill(faceColor2)  //headwear clr
      graphics.strokeJoin(ROUND);

      graphics.push()
      graphics.fill(random(colors
      ))  //headwear clr2
      graphics.translate(0, -this.radius / 10)
      graphics.triangle(-r * 2, 0, r * 2, 0, 0, -r * 3 * 2)
      graphics.pop()


      // hair
      let arr = [];
      graphics.noStroke()
      graphics.fill("#282828")
      for (let j = 0; j < 50; j++) {
        graphics.push()
        graphics.strokeWeight(map(noise(j * 5, 90 + j * 3), 0, 1, this.radius / 50, this.radius / 130))

        let x = map(noise(j, 50 + j * 5), 0, 1, -100, 100) + map(noise(j + bodyTop.x / 50, 15 + bodyTop.y / 50), 0, 1, -10, 10)
        let y = map(noise(j * 2, 30 + j * 2), 0, 1, -60, 60) + map(noise(j + bodyTop.x / 50, 40 + bodyTop.y / 50), 0, 1, -5, 5)
        let rs = map(noise(j * 5, 90 + j * 3), 0, 1, 25, 45)
        graphics.circle(x, y, rs + this.radius / 15)
        graphics.pop()
        arr.push({ x: x, y: y, rs: rs })
      }

      for (i of arr) {
        graphics.push()
        graphics.noStroke()

        graphics.fill(faceColor2)  //headwear clr
        graphics.circle(i.x, i.y, i.rs)

        graphics.pop()
      }

      graphics.pop()
    }



    for (let spring of this.springs) {
      // spring.show(graphics);
    }

  }
  mouse(moveP) {
    if (mouseIsPressed) {
      let movePos = this.particles[0]
      if (moveP == "Top") {
        movePos = this.particles[int(this.bodyP.length * 3 / 4) + 1]
      } else if (moveP == "Center") {
        movePos = this.particles[0]
      }
      movePos.x = mouseX;
      movePos.y = mouseY;
      movePos.unlock();
      //     particles2[0].x = mouseX;
      // particles2[0].y = mouseY;
      // particles2[0].unlock();
    }
  }
}
function mousePressed() {
  mousePressedPos = createVector(mouseX, mouseY)
  let topPointDist = dist(mouseX, mouseY, obj.bodyP[int(obj.bodyP.length * 3 / 4) + 1].x,
    obj.bodyP[int(obj.bodyP.length * 3 / 4) + 1].y)
  if (topPointDist < obj.radius / 4) {
    moveP = "Top"
  } else {
    moveP = "Center"
  }
  print(moveP)
}

function setup() {
  pixelDensity(1)
  createCanvas(800, 800)
  fitCanvasSize()
  webGLCanvas = createGraphics(width, height, WEBGL)
  originalGraphics = createGraphics(width, height)
  // randomSeed(569999999999999)
  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, (height * 3) / 4);
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
    eyeSizeRandom2: random(1),
    mouthSizeRandom: random(1),
    hairSizeRandom: random(1),
    eyesType: random(eyesType),
    mouthType: random(mouthType)
    // headwear: random(headwear)
  })
  obj.init()


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
  obj.mouse(moveP)

  image(webGLCanvas, 0, 0, width, height)

}
