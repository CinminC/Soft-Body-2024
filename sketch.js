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
let bodyAngle, bodyTopN;
let bodySpringStrength = 0.002; //0.0002, 0.00005

let id

let colors = ["#D0B75A", "#7AB1D0", "#83A87D", "#924349", "#F7B5B9"]
// let colors1 = ["#D0B75A", "#7AB1D0", "#83A87D", "#924349", "#F7B5B9"]
var colors1 = "7b91e9-17c3b2-f5b800-ecf238-fa5a62".split("-").map(a => "#" + a)
var colors2 = "0081af-ff2244-00abe7-eaba6b-2dc7ff-ead2ac".split("-").map(a => "#" + a)
var colors3 = "c1a5a9-1d1a31-f08cae-4d2d52-9a4c95".split("-").map(a => "#" + a)
var colors4 = "083d77-fa664a-ebebd3-f95738-f4d35e-ee964b".split("-").map(a => "#" + a)
//new colors
// var colors5 = "#6C8C8C-#8C6D46-#D9AE79-#F2E8DF-#4a7a8c".split("-")
var colors5 = "388c8c-8c591b-d9933f-f2dac4-2a728c".split("-").map(a => "#" + a)
// var colors6 = "#9FBFAD-#517354-#CFD982-#F2EBDC-#594432".split("-")
var colors6 = "a3d6b9-3b693e-ccd968-f2e6cb-594432".split("-").map(a => "#" + a)
var colors7 = "#154659-#32A69A-#BAD9C8-#F26A1B-#A63B32".split("-")
// var colors8 = "#245473-#142F40-#8C6645-#D9B6A3-#A6877C".split("-")
var colors8 = "26597a-0D4466-946032-ebbea7-bf835e".split("-").map(a => "#" + a)
// var colors9 = "#268C8C-#9EA663-#F2D8A7-#8C2F0D-#F2785C".split("-")
var colors9 = "2da8a8-9aa63d-f2d296-a1350e-f2785c".split("-").map(a => "#" + a)
var colors10 = "#3A5939-#F2ECD8-#D9A13B-#BF3F34-#732D2D".split("-")
var colors11 = "ff4e00-8ea604-f5bb00-ec9f05-bf3100".split("-").map(a => "#" + a)
var colors12 = "ffbe0b-fb5607-ff006e-8338ec-3a86ff-eee".split("-").map(a => "#" + a)
var colors13 = "181717-B4B7BF-D0D3D9-59554D-262626".split("-").map(a => "#" + a)
var allColorsArr = [colors1]
var bgClr
// var allColorsArr = [colors1, colors2, colors3, colors4, colors5, colors6, colors7, colors8, colors9, colors10, colors11, colors12, colors13]


let faceColor1, faceColor2, colliderColor1, colliderColor2, colliderColor3
let eyesType = ['Ellipse', 'Circle', 'Squint', 'Half', 'HalfStare', 'Bright', 'Shiny'] //7
let mouthType = ['Thick', 'Calm', 'Compressed', 'Cute', 'Smile', 'Unhappy', 'Monster']  //7
let headwear = ['PropellerHat', 'Fruit', 'Stack', 'Beret', 'Curly', 'Tomato', 'BowTie', 'Leaf', 'OneCurly', 'Puffy', 'Bangs', 'Cat'] //11
let accessories = ['TShirt', 'Shirt', 'Belt', 'SlingBag', 'LittleBag', 'Ring', 'Ear']  //6
let bodySize = ['Small', 'Medium', 'Large']
let shape = ['Circle', 'HorizontalEllipse', 'VerticalEllipse', 'Heart', 'Square', 'Diamond']
let bgStyle = ['Lines', 'Mountain', 'Grid', 'Frame', 'Spiral', 'Wavy']
let theShader;
let webGLCanvas
let originalGraphics

let obj
let finalBackground;
let bgRandom

let mousePressedPos
let moveP
let showSprings = false;

function keyPressed() {
  if (key == ' ') {
    showSprings = !showSprings;
  }
}

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

      shuffledColors: colors1,
      removeBodyColors: colors1,
      bodyColor: "#fff",
      bodyColor2: "#fff",
      hairColor: "#fff",
      decoColor: "#fff",
      decoColor2: "#fff",

      startPos: createVector(width / 2, 0),
      radius: 100,
      actualW: 100,
      actualH: 100,

      segment: 40,
      particles: [],
      bodyP: [],
      innerP: [],
      eyesP: [],
      springs: [],
      shape: 'Square',
      faceColor1: "#000",
      faceColor2: "#000",
      eyesDist: 10,
      eyesType: "Half",
      mouthType: "Monster",
      headwear: "Beret",
      accessories: 'Ring',
      bodySize: 'Medium',
      bodySizeRandom: 1,
      eyeAngleLerp: 0,
      eyeSizeRandom: 1,
      eyeSizeRandom2: 1,
      mouthSizeRandom: 1,
      hairSizeRandom: 1,
      isDouble: 0,

    }
    Object.assign(def, args)
    Object.assign(this, def)
  }
  init() {
    this.actualW = this.radius
    this.actualH = this.radius
    if (this.bodySize == "Small") {
      let sMultiply = map(this.bodySizeRandom, 0, 1, 0.85, 0.9)
      this.actualW = this.radius * sMultiply
      this.actualH = this.radius * sMultiply
    } else if (this.bodySize == "Medium") {
      let sMultiply = map(this.bodySizeRandom, 0, 1, 1, 1.05)
      this.actualW = this.radius * sMultiply
      this.actualH = this.radius * sMultiply
    } else if (this.bodySize == "Large") {
      let sMultiply = map(this.bodySizeRandom, 0, 1, 1.3, 1.35)
      this.actualW = this.radius * sMultiply
      this.actualH = this.radius * sMultiply
    }

    //setup body points
    if (this.shape == "Circle") {
      this.bodyP.push(new Particle(this.startPos.x, this.startPos.y));
      for (let t = 0; t < (TAU); t += TAU / this.segment) {
        let fluctuation = noise(t * 120, t * 50) * 8;

        let xx = this.startPos.x + (this.actualW + fluctuation) * cos(t),
          yy = this.startPos.y + (this.actualH + fluctuation) * sin(t),
          p = new Particle(xx, yy);
        this.bodyP.push(p);
        // originalGraphics.fill(map(t, 0, TAU, 0, 255))
        // originalGraphics.ellipse(xx, yy, 20)

      }

    } else if (this.shape == "HorizontalEllipse") {
      this.bodyP.push(new Particle(this.startPos.x, this.startPos.y));
      let sMultiply = map(this.bodySizeRandom, 0, 1, 1.2, 1.25)
      for (let t = 0; t < (TAU); t += TAU / this.segment) {
        let fluctuation = noise(t * 120, t * 50) * 8;

        let xx = this.startPos.x + (this.actualW + fluctuation) * sMultiply * cos(t),
          yy = this.startPos.y + (this.actualH + fluctuation) * sin(t),
          p = new Particle(xx, yy);
        this.bodyP.push(p);
        // originalGraphics.fill(map(t, 0, TAU, 0, 255))
        // originalGraphics.ellipse(xx, yy, 20)

      }

    } else if (this.shape == "VerticalEllipse") {
      this.bodyP.push(new Particle(this.startPos.x, this.startPos.y));
      let sMultiply = map(this.bodySizeRandom, 0, 1, 1.15, 1.2)
      for (let t = 0; t < (TAU); t += TAU / this.segment) {
        let fluctuation = noise(t * 120, t * 50) * 8;

        let xx = this.startPos.x + (this.actualW + fluctuation) * cos(t),
          yy = this.startPos.y + (this.actualH + fluctuation) * sMultiply * sin(t),
          p = new Particle(xx, yy);
        this.bodyP.push(p);
        // originalGraphics.fill(map(t, 0, TAU, 0, 255))
        // originalGraphics.ellipse(xx, yy, 20)

      }

    } else if (this.shape == "Heart") {
      this.bodyP.push(new Particle(this.startPos.x, this.startPos.y - this.actualH));
      for (let a = 0; a < TAU; a += TAU / this.segment) {
        let r = height / 10;
        let r2 = r * (1 - sin(a))
        let xx = this.startPos.x + (this.actualW * (1 - sin(a))) * cos(a);
        let yy = this.startPos.y + (this.actualH * (1 - sin(a))) * sin(a);
        // vertex(xx,yy);
        this.bodyP.push(new Particle(xx, yy));
      }
    } else if (this.shape == "Square") {
      this.bodyP.push(new Particle(this.startPos.x, this.startPos.y));
      let r = this.actualW
      for (let i = 0; i < 8; i++) {
        // ellipse(i,-r,10)
        this.bodyP.push(new Particle(this.startPos.x + (-r + i * (r * 2 / 8)), this.startPos.y - r))
      }
      for (let i = 0; i < 8; i++) {
        fill(255, 0, 0)
        // ellipse(r,i,10)
        this.bodyP.push(new Particle(this.startPos.x + r, this.startPos.y + (-r + i * (r * 2 / 8))))

      }
      for (let i = 0; i < 8; i++) {
        fill(0, 255, 0)
        // ellipse(i,r,10)
        this.bodyP.push(new Particle(this.startPos.x + (r - i * (r * 2 / 8)), this.startPos.y + r))

      }
      for (let i = 0; i < 8; i++) {
        fill(0, 0, 255)
        // ellipse(-r,i,10)
        this.bodyP.push(new Particle(this.startPos.x - r, this.startPos.y + (r - i * (r * 2 / 8))))

      }
    } else if (this.shape == "Diamond") {
      this.bodyP.push(new Particle(this.startPos.x, this.startPos.y - this.actualH));
      let na = 2 / 1.31;

      for (let a = 0; a < TAU; a += TAU / this.segment) {
        let r = height / 10;
        let r2 = r * (1 - sin(a))
        let xx = this.startPos.x + pow(abs(cos(a)), na) * this.actualW * sgn(cos(a));
        let yy = this.startPos.y + pow(abs(sin(a)), na) * this.actualH * sgn(sin(a));
        // vertex(xx,yy);
        this.bodyP.push(new Particle(xx, yy));
      }
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
    this.eyesP.push(new Particle(this.startPos.x - this.eyesDist, this.startPos.y - this.actualH / 3));
    this.eyesP.push(new Particle(this.startPos.x + this.eyesDist, this.startPos.y - this.actualH / 3));

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
    let bodyRight, bodyCenter, bodyLeft, bodyTop, bodyLowerRight, eyeMid, lfAverage
    if (this.shape == "Circle" || this.shape == "HorizontalEllipse" || this.shape == "VerticalEllipse") {
      bodyRight = createVector(this.bodyP[1].x, this.bodyP[1].y);
      bodyCenter = createVector(this.bodyP[0].x, this.bodyP[0].y);
      bodyLeft = createVector(
        this.bodyP[int(this.bodyP.length / 2) + 1].x,
        this.bodyP[int(this.bodyP.length / 2) + 1].y
      );
      bodyTop = createVector(
        this.bodyP[int(this.bodyP.length * 3 / 4) + 1].x,
        this.bodyP[int(this.bodyP.length * 3 / 4) + 1].y
      );
      bodyLowerRight = createVector(
        this.bodyP[int(this.bodyP.length / 8) + 1].x,
        this.bodyP[int(this.bodyP.length / 8) + 1].y
      );
      eyeMid = createVector((this.eyesP[0].x + this.eyesP[1].x) / 2, (this.eyesP[0].y + this.eyesP[1].y) / 2)
      lfAverage = createVector((bodyLeft.x + bodyRight.x) / 2, (bodyLeft.y + bodyRight.y) / 2)

      bodyTopN = int(this.bodyP.length * 3 / 4) + 1

      bodyAngle = atan2(bodyRight.y - bodyLeft.y, bodyRight.x - bodyLeft.x);

      //important pos
      // graphics.fill(255, 0, 0)
      // graphics.ellipse(bodyRight.x, bodyRight.y, 40)
      // graphics.fill(0, 255, 0)
      // graphics.ellipse(bodyTop.x, bodyTop.y, 40)
      // graphics.fill(0, 0, 255)
      // graphics.ellipse(bodyLeft.x, bodyLeft.y, 40)
    } else if (this.shape == "Heart") {

      bodyRight = createVector(this.bodyP[26].x, this.bodyP[26].y);
      bodyCenter = createVector(this.bodyP[0].x, this.bodyP[0].y);
      bodyLeft = createVector(
        this.bodyP[17].x,
        this.bodyP[17].y
      );
      bodyTopN = 7
      bodyTop = createVector(
        this.bodyP[bodyTopN].x,
        this.bodyP[bodyTopN].y
      );
      bodyLowerRight = createVector(
        this.bodyP[25].x,
        this.bodyP[25].y
      );
      eyeMid = createVector((this.eyesP[0].x + this.eyesP[1].x) / 2, (this.eyesP[0].y + this.eyesP[1].y) / 2)
      lfAverage = createVector((bodyLeft.x + bodyRight.x) / 2, (bodyLeft.y + bodyRight.y) / 2)



      bodyAngle = atan2(bodyRight.y - bodyLeft.y, bodyRight.x - bodyLeft.x);

      //important pos
      // graphics.fill(255, 0, 0)
      // graphics.ellipse(bodyRight.x, bodyRight.y, 40)
      // graphics.ellipse(bodyLowerRight.x, bodyLowerRight.y, 40)
      // graphics.fill(0, 255, 0)
      // graphics.ellipse(bodyTop.x, bodyTop.y, 40)
      // graphics.fill(0, 0, 255)
      // graphics.ellipse(bodyLeft.x, bodyLeft.y, 40)
    } else if (this.shape == "Square") {

      bodyRight = createVector(this.bodyP[13].x, this.bodyP[13].y);
      bodyCenter = createVector(this.bodyP[0].x, this.bodyP[0].y);
      bodyLeft = createVector(
        this.bodyP[28].x,
        this.bodyP[28].y
      );
      bodyTopN = 4
      bodyTop = createVector(
        this.bodyP[bodyTopN].x,
        this.bodyP[bodyTopN].y
      );
      bodyLowerRight = createVector(
        this.bodyP[16].x,
        this.bodyP[16].y
      );
      eyeMid = createVector((this.eyesP[0].x + this.eyesP[1].x) / 2, (this.eyesP[0].y + this.eyesP[1].y) / 2)
      lfAverage = createVector((bodyLeft.x + bodyRight.x) / 2, (bodyLeft.y + bodyRight.y) / 2)



      bodyAngle = atan2(bodyRight.y - bodyLeft.y, bodyRight.x - bodyLeft.x);

      //important pos
      // graphics.fill(255, 0, 0)
      // graphics.ellipse(bodyRight.x, bodyRight.y, 40)
      // graphics.ellipse(bodyLowerRight.x, bodyLowerRight.y, 40)
      // graphics.fill(0, 255, 0)
      // graphics.ellipse(bodyTop.x, bodyTop.y, 40)
      // graphics.fill(0, 0, 255)
      // graphics.ellipse(bodyLeft.x, bodyLeft.y, 40)
    } else if (this.shape == "Diamond") {

      bodyRight = createVector(this.bodyP[1].x, this.bodyP[1].y);
      bodyCenter = createVector(this.bodyP[0].x, this.bodyP[0].y);
      bodyLeft = createVector(
        this.bodyP[15].x,
        this.bodyP[15].y
      );
      bodyTopN = 22
      bodyTop = createVector(
        this.bodyP[bodyTopN].x,
        this.bodyP[bodyTopN].y
      );
      bodyLowerRight = createVector(
        this.bodyP[5].x,
        this.bodyP[5].y
      );
      eyeMid = createVector((this.eyesP[0].x + this.eyesP[1].x) / 2, (this.eyesP[0].y + this.eyesP[1].y) / 2)
      lfAverage = createVector((bodyLeft.x + bodyRight.x) / 2, (bodyLeft.y + bodyRight.y) / 2)
      bodyAngle = atan2(bodyRight.y - bodyLeft.y, bodyRight.x - bodyLeft.x);

      //important pos
      // graphics.fill(255, 0, 0)
      // graphics.ellipse(bodyRight.x, bodyRight.y, 40)
      // graphics.ellipse(bodyLowerRight.x, bodyLowerRight.y, 40)
      // graphics.fill(0, 255, 0)
      // graphics.ellipse(bodyTop.x, bodyTop.y, 40)
      // graphics.fill(0, 0, 255)
      // graphics.ellipse(bodyLeft.x, bodyLeft.y, 40)
    }



    graphics.stroke("#282828");
    graphics.strokeWeight(this.radius / 30);
    graphics.strokeJoin(ROUND);
    if (this.accessories == "Ear") {
      let clr1 = lerpColor(color(this.bodyColor), color(0), 0.1)
      let clr2 = lerpColor(color(this.bodyColor), color(0), 0.4)
      graphics.fill(clr1)
      graphics.ellipse(bodyRight.x, bodyRight.y, this.actualW * 0.4)
      graphics.ellipse(bodyLeft.x, bodyLeft.y, this.actualW * 0.4)
      graphics.fill(clr2)
      graphics.ellipse(bodyRight.x, bodyRight.y, this.actualW * 0.2)
      graphics.ellipse(bodyLeft.x, bodyLeft.y, this.actualW * 0.2)

    }

    //---draw body
    //with clipping
    graphics.push();
    graphics.clip(() => {
      graphics.beginShape();
      for (var i = 1; i < this.bodyP.length; i++) {
        if (i == bodyTopN) {
          graphics.curveVertex(
            (this.bodyP[bodyTopN - 1].x + this.bodyP[bodyTopN + 1].x) / 2,
            lerp((this.bodyP[bodyTopN - 1].y + this.bodyP[bodyTopN + 1].y) / 2, this.bodyP[i].y, 0.5));
        } else {
          graphics.curveVertex(this.bodyP[i].x, this.bodyP[i].y);
        }
      }
      for (let i = 1; i < 4; i++) {
        graphics.curveVertex(this.bodyP[i].x, this.bodyP[i].y)
      }
      graphics.endShape();
    });
    let clr = color(this.bodyColor2)
    clr.setAlpha(150)
    graphics.fill(this.bodyColor);
    graphics.ellipse(lfAverage.x, lfAverage.y, max(this.actualW, this.actualH) * 2.5)

    //inner circle
    if (this.isDouble) {
      graphics.push()
      graphics.translate(lfAverage.x, lfAverage.y)
      graphics.rotate(bodyAngle)
      graphics.fill(this.bodyColor2)
      graphics.beginShape();
      for (let t = 0; t < (TAU); t += TAU / this.segment) {
        let fluctuation = noise(t * 150, t * 110) * 4;

        let xx = (this.actualW * 0.55 + fluctuation) * cos(t),
          yy = (this.actualH * 0.55 + fluctuation) * sin(t);
        graphics.curveVertex(xx, yy);

      }
      for (let t = 0; t < (TAU) / 5; t += TAU / this.segment) {
        let fluctuation = noise(t * 150, t * 110) * 4;

        let xx = (this.actualW * 0.55 + fluctuation) * cos(t),
          yy = (this.actualH * 0.55 + fluctuation) * sin(t)
        graphics.curveVertex(xx, yy)
      }
      graphics.endShape();
      graphics.pop()
    }


    if (this.accessories == "TShirt") {
      let shirtClr = lerpColor(color(this.decoColor), color("#ffffff"), 0.5)  //if double
      graphics.translate(lfAverage.x, lfAverage.y)
      graphics.rotate(bodyAngle)
      graphics.fill(shirtClr)
      graphics.rect(-this.actualW, this.actualH / 5, this.actualW * 2, this.actualH * 2)

      graphics.noStroke()
      graphics.fill((this.isDouble) ? color(this.bodyColor2) : color(this.bodyColor)) //if double
      graphics.ellipse(0, this.actualH / 5, this.radius / 3, this.radius / 6)

      graphics.stroke("#282828")
      graphics.noFill()
      graphics.strokeWeight(this.radius / 50)
      graphics.arc(0, this.actualH / 5, this.radius / 2, this.radius / 3, 0, PI, OPEN)
      graphics.strokeWeight(this.radius / 30)
      graphics.arc(0, this.actualH / 5, this.radius / 3, this.radius / 6, 0, PI, OPEN)
      // graphics.noFill()
      // graphics.strokeWeight(this.radius / 50)
      // graphics.rect(this.actualW / 3, this.actualW / 3, this.actualW / 5, this.actualW / 4, 0, 0, this.actualW / 15, this.actualW / 15)

    } if (this.accessories == "Shirt") {
      let s = this.radius / 15
      let shirtClr = lerpColor(color(this.decoColor), color("#ffffff"), 0.8)  //if double

      graphics.translate(lfAverage.x, lfAverage.y)
      graphics.rotate(bodyAngle)

      graphics.fill(shirtClr)
      graphics.rect(-this.actualW, this.actualH / 5, this.actualW * 2, this.actualH * 2)
      graphics.translate(0, this.actualH / 5)
      graphics.strokeWeight(this.radius / 50)
      graphics.line(0, 0, 0, this.actualH * 2)
      graphics.rotate(-PI / 2)
      graphics.strokeWeight(this.radius / 30)
      graphics.quad(0, 0, s, -s * 4, 0, -s * 4, -s * 1.5, -s)
      graphics.quad(0, 0, s, s * 4, 0, s * 4, -s * 1.5, s)
    } if (this.accessories == "Belt") {
      let s = dist(bodyLeft.x, bodyLeft.y, bodyRight.x, bodyRight.y)
      let beltClr = lerpColor((this.isDouble) ? color(this.bodyColor2) : color(this.bodyColor), color("#AF724E"), 0.8)  //if double
      graphics.translate(lfAverage.x, lfAverage.y)
      graphics.rotate(bodyAngle)

      graphics.fill(beltClr)
      graphics.rectMode(CENTER)
      graphics.rect(0, this.actualH / 4, this.actualW * 2, this.actualH * 0.1)
      graphics.fill(this.decoColor)
      graphics.rect(0, this.actualH / 4, this.actualW * 0.3, this.actualH * 0.2)
      graphics.fill(beltClr)
      graphics.rect(0, this.actualH / 4, this.actualW * 0.15, this.actualH * 0.1)
    } if (this.accessories == "SlingBag") {
      let s = dist(bodyLeft.x, bodyLeft.y, bodyRight.x, bodyRight.y)
      let r = atan2(bodyLowerRight.x - bodyLeft.x, bodyLowerRight.y, bodyLeft.y)
      let bagClr = lerpColor(color(this.decoColor), (this.isDouble) ? color(this.bodyColor2) : color(this.bodyColor), 0.5)  //if double

      graphics.translate(lfAverage.x, lfAverage.y)

      graphics.rotate(bodyAngle + PI / 8)
      graphics.translate(0, this.actualH / 4)

      graphics.fill(bagClr)
      graphics.rectMode(CENTER)
      // graphics.rotate(r)
      graphics.rect(0, 0, this.actualW * 2, this.actualH * 0.07)

      // graphics.line(bodyLeft.x, bodyLeft.y, bodyLowerRight.x, bodyLowerRight.y)
      graphics.arc(0, 0, this.actualW / 2, this.actualH / 2.5, 0, PI)
      graphics.fill(this.decoColor)
      graphics.arc(0, 0, this.actualW / 2, this.actualH / 4, 0, PI)
      graphics.arc(0, 0, this.actualW / 2, this.actualH / 6, PI, 0)
    } if (this.accessories == "LittleBag") {
      let s = dist(bodyLeft.x, bodyLeft.y, bodyRight.x, bodyRight.y)
      let r = atan2(bodyLowerRight.x - bodyLeft.x, bodyLowerRight.y, bodyLeft.y)
      let bagClr = lerpColor(color(this.decoColor), (this.isDouble) ? color(this.bodyColor2) : color(this.bodyColor), 0.5)  //if double

      graphics.translate(lfAverage.x, lfAverage.y)
      graphics.rotate(bodyAngle + PI / 8)
      graphics.rectMode(CENTER)
      graphics.noFill()
      graphics.strokeWeight(this.actualH * 0.03 + this.radius / 15)
      graphics.arc(0, 0, this.actualW * 2, this.actualH * 0.8, 0, PI)
      graphics.stroke(bagClr)
      graphics.strokeWeight(this.actualH * 0.03)
      graphics.arc(0, 0, this.actualW * 2, this.actualH * 0.8, 0, PI)
    } if (this.accessories == "Ring") {
      // let s = dist(bodyLeft.x, bodyLeft.y, bodyRight.x, bodyRight.y)
      // let beltClr = lerpColor(color(this.bodyColor), color("#AF724E"), 0.8)  //if double
      graphics.translate(lfAverage.x, lfAverage.y)
      graphics.rotate(bodyAngle)

      graphics.noFill()
      graphics.strokeWeight(this.actualH * 0.01 + this.radius / 15)
      graphics.arc(0, this.actualH / 2.5, this.actualW * 0.45, this.actualH * 0.16, PI / 8, PI * 7 / 8)
      graphics.stroke(this.decoColor)
      graphics.strokeWeight(this.actualH * 0.01)
      graphics.arc(0, this.actualH / 2.5, this.actualW * 0.45, this.actualH * 0.16, PI / 8, PI * 7 / 8)

      graphics.stroke("#282828")
      graphics.strokeWeight(this.radius / 30)
      graphics.fill("#F7D826")
      graphics.ellipse(0, this.actualH / 1.9, this.actualW * 0.18, this.actualH * 0.18)
      graphics.strokeWeight(this.radius / 50)
      graphics.line(-this.actualW * 0.09, this.actualH / 1.9, this.actualW * 0.09, this.actualH / 1.9)
      graphics.point(0, this.actualH / 1.75)
      // graphics.fill(beltClr)
      // graphics.rect(0, this.actualH / 4, this.actualW * 0.15, this.actualH * 0.1)
    }

    graphics.pop();

    //outline
    graphics.push();
    graphics.noFill();

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
        // graphics.stroke(map(i, 1, this.bodyP.length, 0, 255))
        // graphics.ellipse(this.bodyP[i].x, this.bodyP[i].y, 10)
        // graphics.stroke(map(i, 1, this.bodyP.length, 0, 255))
        // graphics.strokeWeight(1)
        // graphics.text(i, this.bodyP[i].x, this.bodyP[i].y)
      }
    }

    // graphics.fill(255)
    // graphics.ellipse(this.bodyP[0].x, this.bodyP[0].y, 10)

    for (let i = 1; i < 4; i++) {
      graphics.curveVertex(this.bodyP[i].x, this.bodyP[i].y)
    }
    graphics.endShape();
    graphics.pop();

    if (this.accessories == "LittleBag") {
      let bagClr = lerpColor(color(this.decoColor), (this.isDouble) ? color(this.bodyColor2) : color(this.bodyColor), 0.3)  //if double

      graphics.push();
      if (this.shape == "Square") {
        graphics.translate(bodyLowerRight.x, bodyLowerRight.y)
      } else {
        graphics.translate(bodyLowerRight.x, bodyLowerRight.y + this.actualW / 12)
      }
      graphics.fill(this.decoColor)
      graphics.rectMode(CENTER)
      graphics.rect(0, 0, this.actualW / 5, this.actualW / 4, 0, 0, this.actualW / 20, this.actualW / 20)
      graphics.fill(bagClr)
      graphics.strokeWeight(this.radius / 50)
      graphics.triangle(0, 0, this.actualW / 10, -this.actualW / 8, -this.actualW / 10, -this.actualW / 8)
      graphics.ellipse(0, 0, this.actualW / 20)
      graphics.pop();
    }


    //---draw eyes
    let eyeBase = this.radius / 4
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
      graphics.translate(lfAverage.x, lfAverage.y)
      graphics.rotate(bodyAngle)
      let yTemp = map(this.actualH, this.radius * 0.85, this.radius * 1.35, s * 6.5, s * 8.8)
      graphics.translate(0, -this.actualH + yTemp)
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
      // graphics.fill("#bd9557")
      graphics.fill(this.hairColor)
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

      graphics.fill(this.hairColor)  //headwear clr
      graphics.ellipse(0, 0, s * 3, s * 1.1)
      graphics.arc(0, 0, s * 3, s * 1.8, PI, 0)
      graphics.rect(0, -s * 1.2, s * 0.2, s * 0.7, s * 0.1)
      graphics.pop()
    } else if (this.headwear == "Curly") {
      let r = this.radius / 5
      let angle = map(sin(bodyTop.y / 50), 0, 1, -PI / 18, -PI / 9)
      graphics.push()

      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle)
      graphics.strokeWeight(this.radius / 30)
      graphics.fill(this.hairColor)

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
      graphics.fill(this.hairColor)  //headwear clr
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
      graphics.fill(this.hairColor)  //headwear clr
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
      graphics.fill(this.hairColor)  //headwear clr
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
      graphics.strokeJoin(ROUND);

      graphics.push()

      graphics.fill(this.decoColor2)  //headwear clr2
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

        graphics.fill(this.hairColor)  //headwear clr
        graphics.circle(i.x, i.y, i.rs)

        graphics.pop()
      }

      graphics.pop()
    } else if (this.headwear == "Bangs") {
      let s = this.actualW / 3
      let r = map(sin(bodyTop.y / 50), 0, 1, 0, -PI / 20)
      let y = lerp(eyeMid.y, bodyTop.y, 0.1)
      graphics.push()
      graphics.translate(bodyTop.x, bodyTop.y)
      graphics.rotate(bodyAngle + r)

      // graphics.translate(0, - dist(eyeMid.x, eyeMid.y, bodyTop.x, bodyTop.y))
      graphics.fill(this.hairColor)  //headwear clr
      graphics.rectMode(CENTER)
      graphics.arc(s * 0.9, s * 0.4, s * 2.2, s * 1.8, -PI / 2, PI / 2, CHORD)
      graphics.arc(-s * 0.9, s * 0.4, s * 2.2, s * 1.8, PI / 2, PI * 3 / 2, CHORD)
      // graphics.arc(0, s * 0.4, s * 4, s * 2.5, PI, 0 / 2, CHORD)
      graphics.arc(s, s * 0.4, s * 2, s * 2.5, PI, 0 / 2, CHORD)
      graphics.arc(-s, s * 0.4, s * 2, s * 2.5, PI, 0 / 2, CHORD)

      graphics.noStroke()
      graphics.arc(s * 0.9 + this.radius / 60, s * 0.4, s * 2.2 - this.radius / 15, s * 1.8 - this.radius / 15, -PI / 2, PI / 2, CHORD)  //erase stroke note
      graphics.arc(-s * 0.9 - this.radius / 60, s * 0.4, s * 2.2 - this.radius / 15, s * 1.8 - this.radius / 15, PI / 2, PI * 3 / 2, CHORD)
      graphics.pop()
    } else if (this.headwear == "Cat") {
      let s = this.actualW / 3
      let h = this.actualW / 3 * map(sin(bodyTop.y / 40 + bodyTop.y / 30), 0, 1, 0.8, 0.9)

      let clr = lerpColor(color(this.hairColor), color(0), 0.2)

      graphics.push()
      graphics.translate(bodyTop.x, bodyTop.y + this.radius / 10)

      graphics.rotate(bodyAngle)

      graphics.fill(this.hairColor)  //headwear clr
      graphics.triangle(0, 0, -s, 0, -s / 2, -h)
      graphics.triangle(0, 0, s, 0, s / 2, -h)
      graphics.fill(clr)  //headwear clr
      graphics.triangle(-s * 0.25, 0, -s * 0.75, 0, -s * 0.5, -h * 0.5)
      graphics.triangle(s * 0.25, 0, s * 0.75, 0, s * 0.5, -h * 0.5)
      graphics.pop()
    }

    if (showSprings) {
      for (let spring of this.springs) {
        spring.show(graphics);
      }
    }
    // for (let spring of this.springs) {
    //   // spring.show(graphics);
    // }

  }
  mouse(moveP) {
    if (mouseIsPressed) {
      let movePos = this.particles[0]
      if (moveP == "Top") {
        movePos = this.particles[bodyTopN]
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
  let topPointDist = dist(mouseX, mouseY, obj.bodyP[bodyTopN].x,
    obj.bodyP[bodyTopN].y)
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

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);
  physics.setDrag(0.05);

  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.2)));

  faceColor1 = random(colors1)
  faceColor2 = random(colors1)
  while (faceColor1 == faceColor2) faceColor2 = random(colors1)
  colliderColor1 = random(colors1)
  colliderColor2 = random(colors1)
  colliderColor3 = random(colors1)

  let size = width * 0.31
  let shuffledColors = random(allColorsArr).slice().sort((a, b) => random() - 0.5);
  let removeBodyColors = shuffledColors.slice(2);

  let shuffledColors2 = random(allColorsArr).slice().sort((a, b) => random() - 0.5);
  bgClr = shuffledColors2.slice(0, 3);

  obj = new SoftBody({
    shuffledColors: shuffledColors,
    removeBodyColors: removeBodyColors,
    bodyColor: shuffledColors[0],
    bodyColor2: shuffledColors[1],
    hairColor: shuffledColors[2],
    decoColor: shuffledColors[3],
    decoColor2: shuffledColors[4],
    // decoColor2: removeBodyColors[int(random(0, removeBodyColors.length))],

    startPos: createVector(width / 2, height / 2 - 220),
    radius: size,
    segment: 28,
    faceColor1: faceColor1,
    faceColor2: faceColor2,
    bodySizeRandom: random(1),
    eyesDist: random(size / 4.3, size / 3),
    eyeSizeRandom: random(1),
    eyeSizeRandom2: random(1),
    mouthSizeRandom: random(1),
    hairSizeRandom: random(1),
    isDouble: random([0, 1]),
    eyesType: random(eyesType),
    mouthType: random(mouthType),
    headwear: random(headwear),
    shape: random(shape),
    // headwear: "N",
    // accessories: "LittleBag",
    accessories: random(accessories),
    bodySize: random(bodySize)
  })
  obj.init()

  finalBackground = "Wavy"
  bgRandom = random(1)
  id = random(10000000)
  // finalBackground=random(bgStyle)
}


function draw() {
  //texture shader 
  webGLCanvas.shader(theShader)
  theShader.setUniform('u_resolution', [width / 1000, height / 1000])
  theShader.setUniform('u_time', millis() / 1000)
  theShader.setUniform('u_mouse', [mouseX / width, mouseY / height])
  theShader.setUniform('u_tex', originalGraphics)
  webGLCanvas.clear()
  webGLCanvas.rect(-width / 2, -height / 2, width, height)

  //physics
  physics.update();

  //background
  let bgClr1 = color(bgClr[0])
  let bgClr2 = color(bgClr[1])
  let bgClr3 = color(bgClr[2])

  if (finalBackground == 'Lines') {
    // originalGraphics.background("#EAE7D6");
    // originalGraphics.stroke(200)
    // originalGraphics.strokeWeight(0.5)
    // let span = 15
    // for (let i = 0; i < width; i += span) {
    //   originalGraphics.line(i, 0, i, height)
    // }
    originalGraphics.push()
    bgClr1 = lerpColor(bgClr1, color(245), 0.6)
    originalGraphics.background(bgClr1);
    bgClr2.setAlpha(200)
    originalGraphics.stroke(bgClr2)
    originalGraphics.strokeWeight(map(bgRandom, 0, 1, 2, 30))
    let span = map(bgRandom, 0, 1, 15, 45)
    // 2,15,30,45
    for (let i = 0; i < width * 1.1; i += span) {
      originalGraphics.line(i, 0, i, height)
    }
    originalGraphics.pop()
  } else if (finalBackground == 'Mountain') {
    originalGraphics.push()

    bgClr1 = lerpColor(bgClr1, color(255), 0.9)

    originalGraphics.background(bgClr1);

    originalGraphics.noStroke()
    let bgClr2Alpha = color(bgClr[1])
    bgClr2Alpha.setAlpha(50)

    drawWave(1213, 10, 100, -height / 1.5, 0, bgClr2Alpha, originalGraphics)
    drawWave(435, 10, 150, -height / 2, -PI / 12, lerpColor(bgClr2, color(255), 0.5), originalGraphics)
    drawWave(655, 30, 100, -height / 3, PI / 20, lerpColor(bgClr2, color(255), 0.2), originalGraphics)
    bgClr3.setAlpha(200)
    drawWave(454, 8, 20, -height / 4, 0, bgClr3, originalGraphics)
    originalGraphics.pop()
  } else if (finalBackground == 'Grid') {
    originalGraphics.push()
    bgClr1 = lerpColor(bgClr1, color(250), 0.9)
    originalGraphics.background(bgClr1);
    bgClr2.setAlpha(80)
    originalGraphics.fill(bgClr2)
    originalGraphics.noStroke()

    // originalGraphics.strokeWeight(map(bgRandom, 0, 1, 2, 30))
    let w = 60
    // 2,15,30,45
    for (let i = 0; i < width; i += width / 13 * 2) {
      originalGraphics.rect(i, 0, width / 13, height)
    }
    for (let i = 0; i < height; i += height / 13 * 2) {
      originalGraphics.rect(0, i, width, height / 13)
    }
    originalGraphics.pop()
  } else if (finalBackground == 'Spiral') {
    originalGraphics.push()
    bgClr1 = lerpColor(bgClr1, color(245), 0.6)
    originalGraphics.background(bgClr1);
    bgClr2 = lerpColor(bgClr1, color(255), 0.8)
    originalGraphics.stroke(bgClr2)
    originalGraphics.strokeWeight(10)
    originalGraphics.noFill()
    let w = 50
    let h = 60
    let xx = width / 2
    let yy = height / 2
    for (let j = h * 2; j <= height - h * 2; j += (height - h * 4) / 3) {
      originalGraphics.beginShape()
      originalGraphics.curveVertex(0, j + h / 2 * 1.25)
      originalGraphics.curveVertex(0, j + h / 2 * 1.25)

      for (let i = width / 8; i <= width - width / 8; i += (width - width / 8 * 2) / 5) {
        drawSpiral(i, j, (width - width / 8 * 2) / 15, h, originalGraphics)
      }
      originalGraphics.curveVertex(width, j + h / 2 * 1.25)
      originalGraphics.curveVertex(width, j + h / 2 * 1.25)
      originalGraphics.endShape()
    }

    originalGraphics.pop()
  } else if (finalBackground == 'Frame') {
    originalGraphics.push()
    bgClr1 = lerpColor(bgClr1, color(255), 0.2)
    originalGraphics.background(bgClr1);
    bgClr2 = lerpColor(bgClr2, color(255), 0.85)
    originalGraphics.fill(bgClr2)
    originalGraphics.noStroke()

    originalGraphics.translate(width / 2, height / 2)
    originalGraphics.rectMode(CENTER)
    originalGraphics.rect(0, 0, width / 1.3, height / 1.5)
    let bgClr1Temp = lerpColor(bgClr1, color(0), 0.6)
    bgClr1.setAlpha(100)
    originalGraphics.stroke(bgClr1Temp)
    originalGraphics.fill(bgClr1)
    originalGraphics.rect(0, 0, width / 1.3 - width / 15, height / 1.5 - width / 15)

    originalGraphics.pop()
  } else if (finalBackground == 'Wavy') {
    originalGraphics.push()
    originalGraphics.scale(1.5)
    let angle = map(bgRandom, 0, 1, -PI / 8, PI / 8)
    bgClr1 = lerpColor(bgClr1, color(255), 0.3)
    bgClr2 = lerpColor(bgClr2, color(255), 0.3)
    bgClr3 = lerpColor(bgClr3, color(255), 0.3)
    originalGraphics.stroke(bgClr3)
    originalGraphics.strokeWeight(10)
    originalGraphics.background(bgClr3);

    for (let y = -height * 1.2; y < height * 0.2; y += height / 10) {
      let ratio = map(y, 0, -height, 0, 1)
      // let clrTemp = lerpColor(bgClr1, bgClr2, ratio)
      if (noise(y * 4100, y * 5700) <= 0.25) {
        clrTemp = bgClr1
      } else if (noise(y * 4100, y * 5700) > 0.25 && (noise(y * 4100, y * 5700) <= 0.5)) {
        clrTemp = bgClr2
      } else if (noise(y * 4100, y * 5700) > 0.5) {
        clrTemp = bgClr3
      }
      drawWave(y * 10, 10, 100, y, angle, clrTemp, originalGraphics)

    }

    originalGraphics.pop()
  }

  //character
  obj.display(originalGraphics)
  obj.mouse(moveP)

  image(webGLCanvas, 0, 0, width, height)

}


function sgn(val) {
  if (val == 0) {
    return 0;
  }
  return val / abs(val);
}

function drawWave(id, seg, amp, yPos, angle, clr, graphics) {
  graphics.push()
  graphics.fill(clr)
  graphics.translate(width / 2, height)
  graphics.rotate(angle)
  graphics.beginShape()
  graphics.curveVertex(-width, 0)
  graphics.curveVertex(-width, 0)
  for (let x = -width; x < width; x += width / seg) {
    graphics.curveVertex(x,
      yPos - noise(x / 100, id + x / 200) * amp)
  }
  graphics.curveVertex(width, 0)
  graphics.curveVertex(-width, 0)
  graphics.endShape()
  graphics.pop()
}

function drawSpiral(xx, yy, w, h, graphics) {
  // curveVertex(xx+-w*1.25,yy+h/2*1.45)

  // curveVertex(xx+-w,yy+h/2*1.25)
  graphics.curveVertex(xx + -w, yy + h / 2 * 1.25)
  graphics.curveVertex(xx, yy + h / 2)
  graphics.curveVertex(xx + w / 2 * cos(PI / 4), yy + h / 2 * sin(PI / 4))

  graphics.curveVertex(xx + w / 2, yy)
  graphics.curveVertex(xx + w / 2 * cos(-PI / 4), yy + h / 2 * sin(-PI / 4))

  graphics.curveVertex(xx, yy + -h / 2)
  graphics.curveVertex(xx + w / 2 * cos(-PI * 3 / 4), yy + h / 2 * sin(-PI * 3 / 4))

  graphics.curveVertex(xx - w / 2, yy)
  graphics.curveVertex(xx + w / 2 * cos(PI * 3 / 4), yy + h / 2 * sin(PI * 3 / 4))

  graphics.curveVertex(xx, yy + h / 2)

  graphics.curveVertex(xx + w, yy + h / 2 * 1.25)



}

function drawHint(xx, yy, w, h) {
  push()
  stroke(255, 100)
  point(xx + -w, yy + h / 2 * 1.25)
  point(xx + -w, yy + h / 2 * 1.25)
  point(xx, yy + h / 2)
  point(xx + w / 2 * cos(PI / 4), yy + h / 2 * sin(PI / 4))

  point(xx + w / 2, yy)
  point(xx + w / 2 * cos(-PI / 4), yy + h / 2 * sin(-PI / 4))
  ellipse(xx + w / 2 * cos(-PI / 4), yy + h / 2 * sin(-PI / 4), 5)

  point(xx, yy + -h / 2)
  point(xx + w / 2 * cos(-PI * 3 / 4), yy + h / 2 * sin(-PI * 3 / 4))

  point(xx - w / 2, yy)
  point(xx + w / 2 * cos(PI * 3 / 4), yy + h / 2 * sin(PI * 3 / 4))

  point(xx, yy + h / 2)

  point(xx + w, yy + h / 2 * 1.25)
  point(xx + w, yy + h / 2 * 1.25)
  pop()
}