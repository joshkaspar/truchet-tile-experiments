const hexR = 40;

// Edge signatures (0-indexed sides: 0=LL 1=UL 2=T 3=UR 4=LR 5=B)
const SIGS = {
  D: [1, 0, 0, 1, 0, 0],
  F: [1, 1, 0, 1, 0, 0],
  G: [1, 0, 1, 0, 1, 0],
  H: [1, 1, 1, 1, 0, 0],
  I: [1, 0, 1, 1, 1, 0],
  J: [1, 1, 0, 1, 1, 0],
  K: [1, 1, 1, 1, 1, 0],
};
const DRAW = {
  D: [1, 4],
  F: [1, 2, 4],
  G: [1, 3, 5],
  H: [1, 2, 3, 4],
  I: [1, 3, 4, 5],
  J: [1, 2, 4, 5],
  K: [1, 2, 3, 4, 5],
};

// All 42 (type x 6 rotations) with world-frame signatures
const OPTS = [];
for (const [t, sig] of Object.entries(SIGS)) {
  for (let k = 0; k < 6; k++) {
    OPTS.push({ t, k, sig: sig.map((_, i) => sig[((i - k) % 6 + 6) % 6]) });
  }
}

// Neighbor offsets [even-q][side], [odd-q][side]
const NBR = [
  [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [0, 1],
  ],
  [
    [-1, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
    [1, 1],
    [0, 1],
  ],
];

let grid, nC, nR, cw, rh;

function setup() {
  createCanvas(960, 1600);
  pixelDensity(1);
  noLoop();
}

function draw() {
  background(255);
  cw = hexR * 1.5;
  rh = hexR * sqrt(3);
  nC = ceil(width / cw) + 2;
  nR = ceil(height / rh) + 2;

  buildGrid();

  noStroke();
  fill(0);
  for (let q = 0; q < nC; q++) {
    for (let r = 0; r < nR; r++) {
      push();
      translate(q * cw, r * rh + ((q & 1) ? rh / 2 : 0));
      rotate((grid[q][r].k * PI) / 3);
      drawSquares(hexR, DRAW[grid[q][r].t]);
      pop();
    }
  }
}

function buildGrid() {
  grid = Array.from({ length: nC }, () => Array(nR).fill(null));
  let misses = 0;

  for (let r = 0; r < nR; r++) {
    for (let q = 0; q < nC; q++) {
      const off = NBR[q & 1];
      const req = Array(6).fill(-1);
      for (let s = 0; s < 6; s++) {
        const nq = q + off[s][0];
        const nr = r + off[s][1];
        if (nq >= 0 && nq < nC && nr >= 0 && nr < nR && grid[nq][nr]) {
          req[s] = grid[nq][nr].sig[(s + 3) % 6];
        }
      }

      let pool = OPTS.filter((o) => req.every((v, i) => v < 0 || v === o.sig[i]));

      if (!pool.length) {
        misses++;
        let best = 7;
        for (const o of OPTS) {
          const v = req.reduce((n, val, i) => n + (val >= 0 && val !== o.sig[i] ? 1 : 0), 0);
          if (v < best) {
            best = v;
            pool = [o];
          } else if (v === best) {
            pool.push(o);
          }
        }
      }
      grid[q][r] = pool[floor(random(pool.length))];
    }
  }
  console.log(`Constraint misses: ${misses} / ${nC * nR}`);
}

function drawSquares(s, sides) {
  const h = (s * sqrt(3)) / 2;
  const vx = [s, s / 2, -s / 2, -s, -s / 2, s / 2];
  const vy = [0, h, h, 0, -h, -h];
  const sv = [
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
    [0, 1],
    [1, 2],
  ];
  for (const sn of sides) {
    const [a, b] = sv[sn - 1];
    const dx = vx[b] - vx[a];
    const dy = vy[b] - vy[a];
    beginShape();
    vertex(vx[a], vy[a]);
    vertex(vx[b], vy[b]);
    vertex(vx[b] - dy, vy[b] + dx);
    vertex(vx[a] - dy, vy[a] + dx);
    endShape(CLOSE);
  }
}

function keyPressed() {
  if (key === "r" || key === "R") redraw();
  if (key === "s" || key === "S") saveCanvas("hex_match", "png");
}
