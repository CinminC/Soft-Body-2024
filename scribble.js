  let bowing = 1;
  let roughness = 1;
  let maxOffset = 2;
  let numEllipseSteps = 22;
  let ellipseInc = (Math.PI*2)/numEllipseSteps;
function getOffset( minVal, maxVal ) {
    return roughness*(random()*(maxVal-minVal)+minVal);
  }

function buildEllipse( cx, cy, rx, ry, offset, overlap,particles ) {
    var radialOffset = getOffset( -0.5, 0.5 )-Math.PI/2;

    beginShape();
    curveVertex( getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset-ellipseInc ),
        getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset-ellipseInc ) );
    particles.push(new Particle( getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset-ellipseInc ),
        getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset-ellipseInc ),"body"));
    for ( var theta = radialOffset; theta < Math.PI*2+radialOffset-0.01; theta+=ellipseInc ) {
      curveVertex( getOffset( -offset, offset )+cx+rx*Math.cos( theta ),
          getOffset( -offset, offset )+cy+ry*Math.sin( theta ) );
          particles.push(new Particle( getOffset( -offset, offset )+cx+rx*Math.cos( theta ),
          getOffset( -offset, offset )+cy+ry*Math.sin( theta ) ,"body"));
    }

    curveVertex( getOffset( -offset, offset )+cx+rx*Math.cos( radialOffset+Math.PI*2+overlap*0.5 ),
        getOffset( -offset, offset )+cy+ry*Math.sin( radialOffset+Math.PI*2+overlap*0.5 ) );
particles.push(new Particle( getOffset( -offset, offset )+cx+rx*Math.cos( radialOffset+Math.PI*2+overlap*0.5 ),
        getOffset( -offset, offset )+cy+ry*Math.sin( radialOffset+Math.PI*2+overlap*0.5 ) ,"body"));
    curveVertex( getOffset( -offset, offset )+cx+0.98*rx*Math.cos( radialOffset+overlap ),
        getOffset( -offset, offset )+cy+0.98*ry*Math.sin( radialOffset+overlap ) );
particles.push(new Particle( getOffset( -offset, offset )+cx+0.98*rx*Math.cos( radialOffset+overlap ),
        getOffset( -offset, offset )+cy+0.98*ry*Math.sin( radialOffset+overlap ) ,"body"));
    curveVertex( getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset+overlap*0.5 ),
        getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset+overlap*0.5 ) );
  particles.push(new Particle(  getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset+overlap*0.5 ),
        getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset+overlap*0.5 )  ,"body"));
    endShape();
  }

function scribbleEllipse( x, y, w, h,particles ) {
    var rx = Math.abs(w/2);
    var ry = Math.abs(h/2);

    rx += getOffset( -rx*0.05, rx*0.05 );
    ry += getOffset( -ry*0.05, ry*0.05 );

    buildEllipse( x, y, rx, ry, 1, ellipseInc*getOffset( 0.1, getOffset( 0.4, 1 ) ) ,particles);
    // buildEllipse( x, y, rx, ry, 1.5, 0 ,particles);
  }



function buildPureEllipse( cx, cy, rx, ry, offset, overlap ) {
    var radialOffset = getOffset( -0.5, 0.5 )-Math.PI/2;

    beginShape();
    curveVertex( getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset-ellipseInc ),
        getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset-ellipseInc ) );
    
    for ( var theta = radialOffset; theta < Math.PI*2+radialOffset-0.01; theta+=ellipseInc ) {
      curveVertex( getOffset( -offset, offset )+cx+rx*Math.cos( theta ),
          getOffset( -offset, offset )+cy+ry*Math.sin( theta ) );
    }

    curveVertex( getOffset( -offset, offset )+cx+rx*Math.cos( radialOffset+Math.PI*2+overlap*0.5 ),
        getOffset( -offset, offset )+cy+ry*Math.sin( radialOffset+Math.PI*2+overlap*0.5 ) );

    curveVertex( getOffset( -offset, offset )+cx+0.98*rx*Math.cos( radialOffset+overlap ),
        getOffset( -offset, offset )+cy+0.98*ry*Math.sin( radialOffset+overlap ) );

    curveVertex( getOffset( -offset, offset )+cx+0.9*rx*Math.cos( radialOffset+overlap*0.5 ),
        getOffset( -offset, offset )+cy+0.9*ry*Math.sin( radialOffset+overlap*0.5 ) );
 
    endShape();
  }

function scribblePureEllipse( x, y, w, h ) {
    var rx = Math.abs(w/2);
    var ry = Math.abs(h/2);

    rx += getOffset( -rx*0.05, rx*0.05 );
    ry += getOffset( -ry*0.05, ry*0.05 );

    // buildEllipse( x, y, rx, ry, 1, ellipseInc*getOffset( 0.1, getOffset( 0.4, 1 ) ) );
    buildPureEllipse( x, y, rx, ry, 1.5, 0);
  }

function drawHeart(x,y,size){
  push()
  translate(x,y)
   beginShape();
  for (let a = 0; a < TWO_PI; a += 0.4) {
    const r = size/2;
    const x = r * size*1.6 * pow(sin(a), 3);
    const y = -r * (size*1.3 * cos(a) - size*0.5 * cos(2 * a) - size*0.2 * cos(3 * a) - cos(4 * a));

    vertex(x, y);
    particles.push(new Particle(x,y))
  }
  endShape();
  pop()
}

