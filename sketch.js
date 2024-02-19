const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;

const { GravityBehavior, AttractionBehavior } = toxi.physics2d.behaviors;

const { Vec2D, Rect } = toxi.geom;

let physics;

let font;
let particles = [];
let particles2 = [];
let particles3 = [];
let springs = [];
let springs2 = [];
let eyes = [];
let bodyAngle;
let bodySpringStrength = 0.0003; //0.0002, 0.00005

let colors = ["#D0B75A", "#7AB1D0", "#83A87D", "#924349", "#F7B5B9"]
let faceColor1, faceColor2, colliderColor1, colliderColor2, colliderColor3
let emotion

let theShader;
let webGLCanvas
let originalGraphics

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
  // font = loadFont("AvenirNextLTPro-Demi.otf");
  theShader = new p5.Shader(this.renderer, vert, frag)

}

function setup() {
  // createCanvas(600, 960);
  createCanvas(360, 640);
  // frameRate(8)

  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, (height * 2) / 4);
  let bounds2 = new Rect(width / 2, height / 2 + 150, 600, 200);
  physics.setWorldBounds(bounds);
  // physics.setWorldBounds(bounds2);
  physics.setDrag(0.05);

  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.2)));
  new_ball(width / 2, height / 2 - 220);
  faceColor1 = random(colors)
  faceColor2 = random(colors)
  while (faceColor1 == faceColor2) faceColor2 = random(colors)
  colliderColor1 = random(colors)
  colliderColor2 = random(colors)
  colliderColor3 = random(colors)
  // new_rec(width/2,height/2-150)
  // new_rec(width/2,height/2)
  //   particles.push(new Particle(200, 100));
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
  // particles.push(new Particle(0, 0));

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

  particles.push(new Particle(xx, yy, "body"));
  particlesTemp.push(new Particle(xx, yy, "body"));
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

  eyes.push(new Particle(xx - r / 8, yy, "eyes"));
  eyes.push(new Particle(xx + r / 8, yy, "eyes"));
  eyes.push(new Particle(xx - r / 8, yy - r / 16, "eyeBrow"));
  eyes.push(new Particle(xx + r / 8, yy - r / 16, "eyeBrow"));
  eyes.push(new Particle(xx, yy + r / 16, "mouth"));

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

  particles2.push(new Particle(xx, yy, "body"));
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
  //   	webGLCanvas.shader(theShader)
  // 	theShader.setUniform('u_resolution',[width/1000,height/1000])
  // 	theShader.setUniform('u_time',millis()/1000)
  // 	theShader.setUniform('u_mouse',[mouseX/width,mouseY/height])
  // 	theShader.setUniform('u_tex',originalGraphics)

  // 	webGLCanvas.clear()

  // 	webGLCanvas.rect(-width/2,-height/2,width,height)

  //   fill(127);
  //   stroke(0);
  //   strokeWeight(4);
  //   beginShape();
  //   for (let particle of particles) {
  //     vertex(particle.x, particle.y);
  //   }
  //   endShape(CLOSE);

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
  // let span=5
  // for(let i=0;i<width;i+=span){
  //   originalGraphics.line(i,0,i,height)
  // }

  originalGraphics.push();
  originalGraphics.strokeWeight(4);
  originalGraphics.stroke("#282828");
  // originalGraphics.noStroke()
  originalGraphics.fill(colliderColor1);
  // noStroke();
  originalGraphics.rect(70, height / 2, 220, height);
  originalGraphics.fill(colliderColor2);
  originalGraphics.ellipse(width / 2, height / 2 + 10, width * 0.8, 100);
  originalGraphics.fill(colliderColor3);
  originalGraphics.ellipse(width / 2, height / 2, width * 0.8, 100);
  originalGraphics.pop();
  // strokeWeight(4);
  // beginShape();
  // stroke(112, 50, 126);
  // fill(240, 99, 164);
  // for (let particle of particles) {
  //   curveVertex(particle.x, particle.y);
  // }
  // endShape(CLOSE);

  originalGraphics.fill(faceColor1);
  originalGraphics.stroke("#282828");
  originalGraphics.strokeWeight(4);
  // for (var i = 0; i < particles.length; i+=vertices_amount) {
  //   beginShape();
  //     for(var j= i; j<(i+vertices_amount);j++){
  //       curveVertex(particles[j].x, particles[j].y);
  //     }
  //   endShape(CLOSE);
  // }
  originalGraphics.beginShape();
  for (var i = 1; i < particles.length; i++) {
    originalGraphics.curveVertex(particles[i].x, particles[i].y);
  }
  originalGraphics.endShape();

  originalGraphics.push();
  originalGraphics.strokeWeight(4);
  originalGraphics.noFill();
  originalGraphics.fill(faceColor2);

  // for(let p of particles2) p.lock()
  // for(let p of particles3) p.lock()

  originalGraphics.beginShape();
  for (var i = 1; i < particles2.length; i++) {
    originalGraphics.curveVertex(particles2[i].x, particles2[i].y);
  }
  originalGraphics.endShape();
  originalGraphics.beginShape();
  for (var i = 1; i < particles3.length; i++) {
    originalGraphics.curveVertex(particles3[i].x, particles3[i].y);
  }
  originalGraphics.endShape();
  originalGraphics.pop();

  for (var i = 0; i < particles.length; i++) {
    // particles[i].show();
  }
  let bodyStart = createVector(particles[1].x, particles[1].y);
  let bodyEnd = createVector(
    particles[int(particles.length / 2)].x,
    particles[int(particles.length / 2)].y
  );
  particles[1].show();
  particles[int(particles.length / 2)].show();
  bodyAngle = atan2(bodyStart.y - bodyEnd.y, bodyStart.x - bodyEnd.x);

  //draw hat
  originalGraphics.push();
  originalGraphics.translate(bodyStart.x, bodyStart.y);
  originalGraphics.rotate(bodyAngle + PI / 2);
  originalGraphics.stroke("#282828");
  originalGraphics.strokeWeight(4);

  originalGraphics.fill(random(colors));
  originalGraphics.arc(0, 0, 50, 50, PI, 0);
  originalGraphics.fill(random(colors));
  originalGraphics.arc(0, 0, 30, 50, PI, 0);
  originalGraphics.fill(random(colors));
  originalGraphics.arc(0, 0, 10, 50, PI, 0);

  originalGraphics.strokeCap(ROUND);
  originalGraphics.fill(random(colors));
  originalGraphics.strokeWeight(6);
  originalGraphics.line(-25, 0, 25, 0);
  originalGraphics.strokeWeight(4);
  originalGraphics.line(0, -25, 0, -35);

  originalGraphics.translate(0, -35)
  originalGraphics.rotate(PI / 2)
  originalGraphics.fill(random(colors));

  originalGraphics.beginShape();
  originalGraphics.strokeWeight(1);
  originalGraphics.vertex(0, 0);
  originalGraphics.quadraticVertex(6, 10, 0, 12);
  originalGraphics.quadraticVertex(-6, 10, 0, 0);
  originalGraphics.endShape(CLOSE);

  originalGraphics.beginShape();
  originalGraphics.strokeWeight(1);
  originalGraphics.vertex(0, 0);
  originalGraphics.quadraticVertex(6, -10, 0, -12);
  originalGraphics.quadraticVertex(-6, -10, 0, 0);
  originalGraphics.endShape(CLOSE);
  originalGraphics.pop();
  for (var i = 0; i < eyes.length; i++) {
    eyes[i].show();
  }

  for (var i = 0; i < springs.length; i++) {
    springs[i].show();
  }

  //   if (mouseIsPressed) {
  //    print( particles[0])
  //   }

  if (mouseIsPressed) {
    // particles[0].lock();
    particles[0].x = mouseX;
    particles[0].y = mouseY;
    particles[0].unlock();
    //     particles2[0].x = mouseX;
    // particles2[0].y = mouseY;
    // particles2[0].unlock();
  }
  // strokeWeight(1)
  // noFill()
  // scribblePureEllipse(width/2,height/2,200,200)

  image(originalGraphics, 0, 0, width, height)

}



// function mouseClicked() {
//   new_ball(mouseX,mouseY)
// }
