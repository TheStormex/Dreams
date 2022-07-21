class Enemy {
  constructor(name, maxHp, size, contactDamage, abilities, images, talents, talentRate) {
    this.name = name;
    this.type = "enemy";
    this.hp = maxHp;
    this.maxHp = maxHp;
    this.speed = width/400+height/400;
    this.stun = false;
    this.x = width/2;
    this.y = height/4;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.offenseChange = 0;
    this.defenseChange = 0;
    this.bulletSpeed = 100;
    this.contactDamage = contactDamage;
    this.size = size;
    this.abilities = abilities;
    this.talents = talents;
    this.talentRate = talentRate;
    this.talentUsed = false;
    this.talentUsedName = "";
    this.currentAbility;
    this.currentAggro = "none";
    // names of all alive player characters
    this.aggroList = [];
    // amount of aggro for each character in order
    this.aggroAmount = [];
    this.images = images;
    this.currentImage;
    this.alive = true;
    this.status = ["none"];
  }
  draw() {
    push();
    fill(0);
    noStroke();
    imageMode(CENTER);
    image(this.currentImage, this.x, this.y, this.size, this.size);
    pop();
  }
  move() {
    // if not stunned, move
    if (this.stun === false) {
      let moveType = this.currentAbility.moves;
      if (moveType === "noise")  {
        this.angle += random(-0.2, 0.2);
      }
      else if (moveType === "line") {
      }
      this.vx = this.speed * cos(this.angle);
      this.vy = this.speed * sin(this.angle);
      this.x += this.vx;
      this.y += this.vy;
    }
  }
  // how this enemy move after touching a wall when moving
  wrap() {
    let wrapType = this.currentAbility.wrap;
    if (wrapType === "walls") {
      // prevent going outside of walls
      if (this.x-this.size/2 <= 0) {
        this.x = this.size/2;
        this.angle = random(-30, 30);
      }
      if (this.x+this.size/2 > width) {
        this.x = width-this.size/2;
        this.angle = random(-30, 30);
      }
      if (this.y-this.size/2 < 0) {
        this.y = this.size/2;
        this.angle = random(-30, 30);
      }
      if (this.y+this.size/2 > height-height/3) {
        this.y = height-height/3-this.size/2;
        this.angle = random(-30, 30);
      }
    }
    else if (wrapType === "through") {
      this.angle += random(-0.2, 0.2);
      // reappear on the other side
      if (this.x-this.size/2 <= 0) {
        this.x += width;
      }
      if (this.x+this.size/2 > width) {
        this.x -= width;
      }
      if (this.y-this.size/2 < 0) {
        this.y += (height-height/3);
      }
      if (this.y+this.size/2 > height-height/3) {
        this.y -= (height-height/3);
      }
    }
  }
  // if touch player
  contact() {
    let d = dist(this.x, this.y, frontline.x, frontline.y);
    if (d < this.size) {
      if (frontline.invincible === false) {
          frontline.hp -= round((this.contactDamage*(1+this.offenseChange/100)/(1+frontline.defenseChange/100)));
          frontline.hp = constrain(frontline.hp, 0, frontline.maxHp);
          if (frontline.tankUltActive === true) {
            console.log("touch enemy");
            frontline.ultCharge += frontline.tankUltAmount;
            frontline.ultCharge = constrain(frontline.ultCharge, 0, 100);
          }
          A_HIT_PLAYER.play();
          frontline.invincible = true;
          setTimeout(function() {frontline.invincible = false}, 100);
      }
    }
  }
  // shoot bullets of this ability
  shoot() {

  }
  // if this is still alive
  checkAlive() {
    // if dead, remove it and the frontline gains ult charge
    if (this.hp <= 0) {
      this.alive = false;
      frontline.ultCharge += 20;
      frontline.ultCharge = constrain(frontline.ultCharge, 0, 100);
    }
  }
}
