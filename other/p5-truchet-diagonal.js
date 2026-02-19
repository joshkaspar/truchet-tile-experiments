const tileSize = 48;
const lightCol = "#f2f2f2";
const darkCol = "#1f1f1f";
const lineCol = "#222";

function setup() {
  createCanvas(720, 720);
  noLoop();
}

function draw() {
  background("#d9d9d9");

  const cols = floor(width / tileSize);
  const rows = floor(height / tileSize);

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x = gx * tileSize + tileSize / 2;
      const y = gy * tileSize + tileSize / 2;
      const rot = floor(random(4)); // 4 possible rotations

      push();
      translate(x, y);
      rotate(rot * HALF_PI);
      drawDiagonalTile(tileSize);
      pop();
    }
  }
}

function drawDiagonalTile(s) {
  const h = s / 2;

  stroke(lineCol);
  strokeWeight(1);

  // Two triangles split by a diagonal
  fill(lightCol);
  triangle(-h, -h, h, -h, -h, h);

  fill(darkCol);
  triangle(h, h, h, -h, -h, h);

  // Optional border to emphasize tile edges
  noFill();
  rectMode(CENTER);
  rect(0, 0, s, s);
}

function keyPressed() {
  if (key === "r" || key === "R") redraw(); // regenerate
  if (key === "s" || key === "S") saveCanvas("truchet", "png");
}
