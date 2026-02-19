const hexR = 40;

const TILE_DEFS = {
  A: [1],
  B: [1, 2],
  C: [1, 3],
  D: [1, 4],
  E: [1, 2, 3],
  F: [1, 2, 4],
  G: [1, 3, 5],
  H: [1, 2, 3, 4],
  I: [1, 3, 4, 5],
  J: [1, 2, 4, 5],
  K: [1, 2, 3, 4, 5],
  L: [],
  M: [1, 2, 3, 4, 5, 6],
};

const TILE_NAMES = Object.keys(TILE_DEFS);

function setup() {
  createCanvas(960, 1600);
  pixelDensity(1);
  noLoop();
}

function draw() {
  background(255);

  const colW = hexR * 1.5;
  const rowH = hexR * sqrt(3);
  const cols = ceil(width / colW) + 2;
  const rows = ceil(height / rowH) + 2;

  for (let q = -1; q < cols; q++) {
    for (let r = -1; r < rows; r++) {
      const x = q * colW;
      const y = r * rowH + ((q & 1) ? rowH / 2 : 0);

      push();
      translate(x, y);
      rotate((floor(random(6)) * PI) / 3);
      drawHexTile(hexR, TILE_DEFS[random(TILE_NAMES)]);
      pop();
    }
  }
}

function drawHexTile(s, activeSides) {
  const h = (s * sqrt(3)) / 2;
  const vx = [s, s / 2, -s / 2, -s, -s / 2, s / 2];
  const vy = [0, h, h, 0, -h, -h];
  const sides = [
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
    [0, 1],
    [1, 2],
  ];

  // White hex fill
  fill(255);
  noStroke();
  beginShape();
  for (let i = 0; i < 6; i++) vertex(vx[i], vy[i]);
  endShape(CLOSE);

  // Black inward squares
  fill(0);
  for (const sn of activeSides) {
    const [a, b] = sides[sn - 1];
    const dx = vx[b] - vx[a];
    const dy = vy[b] - vy[a];
    beginShape();
    vertex(vx[a], vy[a]);
    vertex(vx[b], vy[b]);
    vertex(vx[b] - dy, vy[b] + dx);
    vertex(vx[a] - dy, vy[a] + dx);
    endShape(CLOSE);
  }

  // Hex outline
  noFill();
  stroke(0);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < 6; i++) vertex(vx[i], vy[i]);
  endShape(CLOSE);
}

function keyPressed() {
  if (key === "r" || key === "R") redraw();
  if (key === "s" || key === "S") saveCanvas("hex_random", "png");
}
