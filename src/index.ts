const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 500;
const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
const DISTANCE = 2;
const CUBE_SIZE = 0.5;
const PRECISION = 1000000;

interface Vector2d {
  x: number;
  y: number;
}

interface Vector3d extends Vector2d {
  z: number;
}

function drawPoint(position: Vector2d, size: number, color: string) {
  (<any>window).context.fillStyle = `#${color}`;
  (<any>window).context.beginPath();
  (<any>window).context.arc(position.x, position.y, size, 0, 2*Math.PI);
  (<any>window).context.stroke();
  (<any>window).context.fill();
}

function drawLine(p1: Vector2d, p2: Vector2d, color: string) {
  (<any>window).context.beginPath();
  (<any>window).context.strokeStyle = `#${color}`;
  (<any>window).context.moveTo(p1.x, p1.y);
  (<any>window).context.lineTo(p2.x, p2.y);
  (<any>window).context.stroke();
  (<any>window).context.fill();
}

function createCanvas(h: number, w: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.style.margin = '100px auto';
  canvas.style.display = 'block';
  canvas.style['box-shadow'] = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 10px 25px 0 rgba(0, 0, 0, 0.19)';
  document.body.style.background = '#f0f0f0';
  document.body.appendChild(canvas);
  (<any>window).context = canvas.getContext('2d');
  (<any>window).canvas = canvas;
  (<any>window).context.clearRect(0, 0, (<any>window).canvas.width, (<any>window).canvas.height);
}

function rotateX(v: Vector3d, alpha: number): Vector3d {
  return {
    x : v.x,
    y : v.y * Math.cos(alpha) + v.z * -Math.sin(alpha),
    z : v.y * Math.sin(alpha) + v.z * Math.cos(alpha),
  };
}

function rotateY(v: Vector3d, alpha: number): Vector3d {
  return {
    x : v.x * Math.cos(alpha) + v.z * Math.sin(alpha),
    y : v.y,
    z : v.x * -Math.sin(alpha) + v.z * Math.cos(alpha),
  };
}

function rotateZ(v: Vector3d, alpha: number): Vector3d {
  return {
    x : v.x * Math.cos(alpha) + v.y * -Math.sin(alpha),
    y : v.x * Math.sin(alpha) + v.y * Math.cos(alpha),
    z : v.z,
  };
}

function mul(v: Vector3d, k: number): Vector3d {
  return {
    x : v.x * k,
    y : v.y * k,
    z : v.z * k,
  };
}

function mul2d(v: Vector2d, k: number): Vector2d {
  return {
    x : v.x * k,
    y : v.y * k,
  };
}

function perspective(v: Vector3d): Vector2d {
  return {
    x : v.x * 1 / (DISTANCE - v.z),
    y : v.y * 1 / (DISTANCE - v.z),
  };
}

function transformations(v: Vector3d): Vector3d {
  v = rotateZ(v, alpha * Math.PI / 180);
  v = rotateY(v, alpha * Math.PI / 180);
  return v;
}


function draw() {
  (<any>window).context.clearRect(0, 0, (<any>window).canvas.width, (<any>window).canvas.height);
  objects.forEach(object => drawPoint(projection(object), 2, '000'));
  for( let i = 0; i < 4; i++) {
    drawLine(projection(objects[i]), projection(objects[(i+1)%4]), '000');
    drawLine(projection(objects[i+4]), projection(objects[(i+1)%4+4]), '000');
    drawLine(projection(objects[i]), projection(objects[(i+4)]), '000');
  }
}

function projection(v: Vector3d): Vector2d {
  v = transformations(v);
  let v2d = perspective(v);
  v2d = mul2d(v2d, 100);
  return {
    x: CANVAS_CENTER_X + v2d.x,
    y: CANVAS_CENTER_Y + v2d.y,
  };
}

function update() {
  alpha += 2;
}

let alpha = 0;

let then = Date.now();

function animate() {
  requestAnimationFrame(animate);
  let now = Date.now();
  let elapsed = now - then;
  if (elapsed > 20) {
    then = now - (elapsed % 20);
    update();
    draw();
  }
}

const objects = [
  {x: -CUBE_SIZE, y: -CUBE_SIZE, z:-CUBE_SIZE},
  {x: CUBE_SIZE, y: -CUBE_SIZE, z:-CUBE_SIZE},
  {x: CUBE_SIZE, y: CUBE_SIZE, z:-CUBE_SIZE},
  {x: -CUBE_SIZE, y: CUBE_SIZE, z:-CUBE_SIZE},
  {x: -CUBE_SIZE, y: -CUBE_SIZE, z:CUBE_SIZE},
  {x: CUBE_SIZE, y: -CUBE_SIZE, z:CUBE_SIZE},
  {x: CUBE_SIZE, y: CUBE_SIZE, z:CUBE_SIZE},
  {x: -CUBE_SIZE, y: CUBE_SIZE, z:CUBE_SIZE},
];

function main() {
  createCanvas(CANVAS_HEIGHT, CANVAS_WIDTH);
  animate();
}

main();