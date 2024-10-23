let time = 0;
let N = 100; // Number of leaf blades per row
let rows = 5; // Number of rows of grass
let randomAngles = []; // Fixed leaf angles
let C = []; // Leaf colors
let X = []; // Leaf x-position

let wheels = [];
let acceleration = 0.01; // Reduced acceleration for new wheels
let colorArray = ['#FF31F5', "#EFEAE8", "#C9A463", "#15AD68", "#5454D6", "#2B2B2B", "#FDFBA4"];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Sample random angles and colors for leaves
  for (let k = 0; k < N * rows; k++) {
    X[k] = -300 + (width + 600) / N * (k % N) + random(-10, 10);
    randomAngles[k] = random(-1.0, 1.0);
    C[k] = color(random(0, 30), random(80, 130), random(0, 10));
  }

  // Initialize a few wheels with random positions and rotations
  for (let i = 0; i < 3; i++) {
    let randomX = random(width);
    let randomY = random(height);
    let randomR = round(random(1, 9));
    wheels.push({ r: randomR, x: randomX, y: randomY, speed: 0.5 }); // Initial slower speed
  }
}

function draw() {
  background(0);
  let yL = 0.8 * height;

  // Draw multiple rows of leaves with animation, bottom row last
  for (let row = rows - 1; row >= 0; row--) {
    for (let k = 0; k < N; k++) {
      let index = row * N + k;
      let x = X[index];
      let angle = noiseAngle(x, time);
      let y = yL - row * 30; // Adjust the vertical spacing between rows
      drawLeaf(x, y, angle, C[index]);
    }
  }
  fill(0.3 * 139, 0.3 * 69, 0.3 * 19); // "saddlebrown"
  rect(0, yL - 30, width, height);

  // Draw wheels
  for (let wheel of wheels) {
    displayFlower(wheel.r, wheel.x, wheel.y, wheel.speed);
    wheel.speed = min(wheel.speed + acceleration, 1); // Limit speed to prevent excessive rotation
  }

  // Increment time for animation
  time += deltaTime / 1000;
}

function drawLeaf(x, y, angle, clr) {
  push();
  fill(clr); // "darkgreen"
  translate(x, y);
  rotate(angle);
  translate(0, -150);
  ellipse(0, 0, 20, 300);
  pop();
}

function noiseAngle(x, t) {
  let K = 0.01; // Noise scale (can remain the same)
  let c = 0.5; // Increased speed of the noise progression
  let n = 2.0 * noise(K * x + 0.4123, c * t) - 1.0;
  return n * 1.5; // Increased sway amplitude
}

function mouseClicked() {
  let r = round(random(1, 9));
  let xLoc = mouseX;
  let yLoc = mouseY;
  wheels.push({ r: r, x: xLoc, y: yLoc, speed: 0.5 }); // New wheel starts with a slower speed
}

function displayFlower(r, x, y, speed = 1) {
  let flowerSize = height / 7;
  if (r == 1) {
    coloredWheel(x, y, flowerSize, [colorArray[0], colorArray[1], colorArray[6]], 9, speed, [1, 2, 4]);
  } else if (r == 2) {
    coloredWheel(x, y, flowerSize, [colorArray[4], colorArray[3], colorArray[5]], 9, speed, [1, 1, 1]);
  } else if (r == 3) {
    layeredWheel(x, y, flowerSize, [
      [colorArray[5], colorArray[1]]
    ], 10, 4, [3, 5, 7, 9].map(s => s * speed));
  } else if (r == 4) {
    doubleWheel(x, y, flowerSize, [
      [colorArray[0], colorArray[2]],
      [colorArray[0], colorArray[1]]
    ], 10, [3, 5].map(s => s * speed));
  } else if (r == 5) {
    flowerWheel(x, y, flowerSize, [colorArray[1], colorArray[4]], colorArray[6], [7, 4], [-2, 5].map(s => s * speed), [1]);
  } else if (r == 6) {
    circularCloudRays(x, y, flowerSize, 8, 10, [colorArray[5], colorArray[3], colorArray[2]], [10, -20].map(s => s * speed));
  } else if (r == 7) {
    starredFlower(x, y, flowerSize, 10, 20, [colorArray[0], colorArray[1], colorArray[4], colorArray[2]], [7, -4, 5].map(s => s * speed));
  } else if (r == 8) {
    flowerWheel(x, y, flowerSize, [colorArray[2], colorArray[4]], colorArray[6], [7, 4], [-2, 5].map(s => s * speed), [1]);
  } else if (r == 9) {
    leafStarredWheel(x, y, flowerSize / 2, 8, 35, [colorArray[0], colorArray[4]], [4, -50, 10].map(s => s * speed));
  }
}

// Wheel functions
function coloredWheel(posX, posY, size, colors, number, speed, succ) {
  push();
  translate(posX, posY);
  angleMode(DEGREES);
  noStroke();
  let numPeices = 0;
  for (let i = 0; i < 2 * number; i++) {
    numPeices += succ[i % succ.length];
  }
  let unitAngle = 360 / numPeices;
  let diffAngle = millis() * speed / 360;
  let angle = -90 + diffAngle;
  for (let i = 0; i < 2 * number; i++) {
    fill(colors[i % colors.length]);
    arc(0, 0, size, size, angle, angle + succ[i % succ.length] * unitAngle, PIE);
    angle += unitAngle * succ[i % succ.length];
  }
  pop();
}

function layeredWheel(posX, posY, size, colors, number, layers, speeds) {
  for (let i = 0; i < layers; i++) {
    coloredWheel(posX, posY, size - i * size / layers, colors[i % colors.length], number, speeds[i], [1]);
  }
}

function doubleWheel(posX, posY, size, colors, number, speeds) {
  for (let i = 0; i < 2; i++) {
    coloredWheel(posX, posY, size - i * size / 3, colors[i % colors.length], number, speeds[i], [1]);
  }
}

function flowerWheel(posX, posY, size, colors, color, numbers, speeds, succ) {
  coloredWheel(posX, posY, size, colors, numbers[0], speeds[0], succ);
  flower(posX, posY, size, color, 6, 15, speeds[1]);
}

function flowerPart(posX, posY, size, color, angle) {
  push();
  translate(posX, posY);
  angleMode(DEGREES);
  noStroke();
  fill(color);
  push();
  rotate(-angle / 2);
  let x = 0.75;
  bezier(0, -x, size / 6, size / 40 - x, size / 2, size / 30 - x, size / 2, 0);
  bezier(0, +x, size / 6, -size / 20 + x, size / 2, -size / 20 + x, size / 2, 0);
  pop();
  push();
  rotate(angle / 2);
  bezier(0, -x, size / 6, size / 40 - x, size / 2, size / 30 - x, size / 2, 0);
  bezier(0, +x, size / 6, -size / 20 + x, size / 2, -size / 20 + x, size / 2, 0);
  pop();
  pop();
}

function flower(posX, posY, size, color, number, angle, speed) {
  push();
  translate(posX, posY);
  rotate(millis() * speed / 360);
  for (let i = 0; i < number; i++) {
    rotate(360 / number);
    flowerPart(0, 0, size, color, angle);
  }
  pop();
}

function circularCloudRays(posX, posY, size, number, angle, colors, speeds) {
  push();
  noStroke();
  fill(colors[0]);
  circle(posX, posY, size);
  circularClouds(posX, posY, 2 * size / 3, number, angle, colors[1], speeds[0]);
  rays(posX, posY, size / 3, number, angle, colors[2], speeds[1]);
  pop();
}

function circularClouds(posX, posY, size, number, angle, color, speed) {
  push();
  translate(posX, posY);
  angleMode(DEGREES);
  noStroke();
  fill(color);
  rotate(speed * millis() / 360);
  circle(0, 0, size);
  rays(0, 0, size / 2, number, 2 * angle, color);
  pop();
}

function rays(posX, posY, size, number, angle, color, speed) {
  push();
  translate(posX, posY);
  angleMode(DEGREES);
  noStroke();
  fill(color);
  rotate(speed * millis() / 1000);
  for (let i = 0; i < number; i++) {
    triangle(0, 0, size, size * tan(angle), size, -size * tan(angle));
    circle(size, 0, 2 * size * tan(angle));
    rotate(360 / number);
  }
  pop();
}

function leafStarredWheel(posX, posY, radius, number, size, colors, speeds) {
  push();
  noStroke();
  fill(colors[0]);
  circle(posX, posY, 2 * radius);
  pop();
  rectangularClouds(posX, posY, 1.35 * radius, number, 180 / number, colorArray[4], speeds[0]);
  star(posX, posY, 0.75 * radius, 3 * number, 45 / number, [colorArray[1], colorArray[4]], speeds[1]);
  leafs(posX, posY, radius / 2, size, number, colorArray[5], speeds[2]);
}

function leafs(posX, posY, radius, size, number, color, speed) {
  push();
  angleMode(DEGREES);
  translate(posX, posY);
  rotate(speed * millis() / 360 + 180 / number);
  for (let i = 0; i < number; i++) {
    leaf(radius, 0, size, color);
    rotate(360 / number);
  }
  pop();
}

function leaf(posX, posY, size, color) {
  push();
  fill(color);
  noStroke();
  translate(posX, posY, size);
  let x = 0.35;
  bezier(-size / 2, -x, -size / 5, size / 3, size / 5, size / 3, size / 2, -x);
  bezier(-size / 2, x, -size / 5, -size / 3, size / 5, -size / 3, size / 2, x);
  pop();
}

function rectangularClouds(posX, posY, size, number, angle, color, speed) {
  push();
  translate(posX, posY);
  angleMode(DEGREES);
  rectMode(CENTER);
  noStroke();
  fill(color);
  rotate(speed * millis() / 360);
  circle(0, 0, size);
  for (let i = 0; i < number; i++) {
    rect(size / 5, 0, size, size * tan(angle), 15);
    rotate(360 / number);
  }
  pop();
}

function star(posX, posY, size, number, angle, colors, speed) {
  push();
  translate(posX, posY);
  angleMode(DEGREES);
  noStroke();
  fill(colors[0]);
  rotate(speed * millis() / 360);
  circle(0, 0, size);
  fill(colors[1]);
  for (let i = 0; i < number; i++) {
    circle(size / 2, 0, 2 * size * tan(angle / 1.1));
    rotate(360 / number);
  }
  pop();
}

function starredFlower(posX, posY, size, number, angle, colors, speeds) {
  // Placeholder logic for starredFlower
  push();
  noStroke();
  fill(colors[0]);
  circle(posX, posY, size);
  // Add more drawing logic here as needed
  pop();
}
