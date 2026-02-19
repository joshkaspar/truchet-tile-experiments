const cols = 20;
const rows = 20;
const tileSize = 32;
const seed = 12345;

const lightColor = "#f2efe6";
const darkColor = "#2f3b52";
const bgColor = "#111111";

function setup() {
  createCanvas(cols * tileSize, rows * tileSize);
  noLoop();
}

function draw() {
  background(bgColor);
  randomSeed(seed);

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const x = gx * tileSize;
      const y = gy * tileSize;
      const rot = floor(random(4)); // 0,1,2,3 => 4 rotations
      drawDiagonalTile(x, y, tileSize, rot);
    }
  }
}

function drawDiagonalTile(x, y, s, rot) {
  push();
  translate(x + s / 2, y + s / 2);
  rotate(HALF_PI * rot);
  translate(-s / 2, -s / 2);

  noStroke();

  // Base square (dark)
  fill(darkColor);
  rect(0, 0, s, s);

  // Light half above the main diagonal (top-left to bottom-right)
  fill(lightColor);
  triangle(0, 0, s, 0, 0, s);

  pop();
}
