let seperator;
let p1;
let ball;
let my_green = [0, 128, 0];
let my_red = [255, 0, 0];
let my_yellow = [255, 255, 0];

function setup() {
  createCanvas(800, 500);
  seperator = new Seperator(12, 15, my_green);
  p1 = new Player();
  ball = new Ball()
}


function draw() {
  background(64);
  
  seperator.show(floor(width / 2) - floor(seperator.width / 2), 0);
  
  p1.move();
  p1.show();
  
  ball.move();
  ball.show();
}

function keyPressed() {
  console.log(keyCode);
  if(keyCode == UP_ARROW) {
    p1.up();
  } else if (keyCode == DOWN_ARROW) {
    p1.down();
  }
}

function keyReleased() {
  if(keyCode == UP_ARROW || keyCode == DOWN_ARROW) {
    p1.stop();
  }
}

function mouseClicked() {
  // ball.x = width / 2;
  // ball.y = random(0, height);
  ball.x = mouseX;
  ball.y = mouseY;
  ball.dx = -3;
  // ball.dy = random(-2, 2);
  ball.dy = -2;

}

class Player {
  constructor() {
    this.y = 10;
    this.acc = 0;
    this.x = 10;
    this.width = 20;
    this.height = 80;
  }
  show() {
    rect(this.x, this.y, this.width, this.height);
  }
  down() {
    this.acc = 2;
  }
  up() {
    this.acc = -2;
  }
  stop() {
    this.acc = 0;
  }
  move() {
    this.y = constrain(this.y + this.acc, 0, height - 80);
    this.acc = constrain(this.acc * 1.07, -9, 9);
  }
}

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = 100;
    this.dx = -3;
    this.dy = 2;
    this.size = 12;
  }
  show() {
    rect(this.x, this.y, this.size)
  }
  move() {
    this.x += this.dx;
    this.y += this.dy;
    let hitP1Face = collideLineRect(
        p1.x + p1.width,
        p1.y,
        p1.x + p1.width,
        p1.y + p1.height,
        this.x,
        this.y,
        this.size,
        this.size,
    )
    if (hitP1Face) {
        this.dx *= -1;
    }
    let hitP1Top = collideLineRect(
        p1.x,
        p1.y,
        p1.x + p1.width,
        p1.y,
        this.x,
        this.y,
        this.size,
        this.size,
    )
    let hitP1Bottom = collideLineRect(
        p1.x,
        p1.y + p1.height,
        p1.x + p1.width,
        p1.y + p1.height,
        this.x,
        this.y,
        this.size,
        this.size,
    )
    if (hitP1Top || hitP1Bottom) {
        this.dy *= -1;
    }
    if((this.y + this.size) >= height || this.y <= 0) {
      this.dy *= -1;
    }
  }
}

class Seperator {
  constructor(num, size, dot_color) {
    this.width = size;
    this.buffer = createGraphics(size, height);
    
    let dot_coords = []

    // vertical space occupied by dots
    let total_dot_size = num * size;
    // vertical space occupied by void/space
    let total_space_size = height - total_dot_size;
    // allow for an offset the size of a dot on
    // top and bottom so a dot isn't too close
    let offset = size;
    // calculate spacing between dots
    let spacing = floor((total_space_size - (offset * 2)) / (num - 1))
    // push x and y coordinates
    for(let i = 0; i < num; i++){
      dot_coords.push(offset + i * (size + spacing));
    }
    this.buffer.noStroke();
    this.buffer.fill(128);
    this.buffer.rect(floor(size / 2), 0, 1, height);
    this.buffer.noStroke();
    this.buffer.fill(...dot_color);
    dot_coords.forEach(y => this.buffer.rect(0, y, size));
  }
  
  show(x, y) {
    image(this.buffer, x, y);
  }
}
