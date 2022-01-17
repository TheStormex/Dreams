class Player {
  constructor(name, maxHp, energyTurn, maxEnergy, abilities, basicBullet, images) {
    this.name = name;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.stun = false;
    this.baseSpeed = width/200+height/200;
    this.currentSpeed = this.baseSpeed;
    this.x = width/2;
    this.y = height/2;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
    this.size = width/50+height/50;
    this.energy = 0;
    this.maxEnergy = maxEnergy;
    // bonus energy gained if not move last turn, char is refreshed this turn
    this.refreshed = false;
    this.energyBoost = 0;
    // stat changes
    this.offenseChange = 0;
    this.defenseChange = 0;
    this.bulletSpeed = 100;
    this.ultCharge = 0;
    this.frontlineTurns = 0;
    // if this char is tired (frontline for more than 2 turns)
    this.tired = false;
    this.energyTurn = energyTurn;
    // if this char used an ability this turn
    this.acted = false;
    // this character's basic bullet and if is on cooldown
    this.basicBullet = basicBullet;
    this.basicBulletCooldown = false;
    // this is image
    this.images = images;
    this.currentImage;
    // this char's abilities, [support, support], [support ult], [combat, combat], [combat ult]]
    this.abilities = abilities;
    // after taking a hit, the player is invincible for 0.25 seconds
    this.invincible = false;
    // current status
    this.status = ["none"];
  }
  move() {
    // if this char is not stunned
    if (this.stun === false) {
      // apply tired penalty if tired
      if (this.tired === true) {
        this.currentSpeed = this.baseSpeed/2;
      } else if (this.tired === false) {
        this.currentSpeed = this.baseSpeed;
      }
      this.vx = 0;
      this.vy = 0;
      if (keyIsDown(87)) {
        this.vy = -this.currentSpeed;
      }
      if (keyIsDown(65)) {
        this.vx = -this.currentSpeed;
      }
      if (keyIsDown(83)) {
        this.vy = this.currentSpeed;
      }
      if (keyIsDown(68)) {
        this.vx = this.currentSpeed;
      }
      this.x += this.vx;
      this.y += this.vy;
      // prevent going outside of walls
      if (this.x-this.size/2 <= 0) {
        this.x = this.size/2;
      }
      if (this.x+this.size/2 > width) {
        this.x = width-this.size/2;
      }
      if (this.y-this.size/2 < 0) {
        this.y = this.size/2;
      }
      if (this.y+this.size/2 > height-height/3) {
        this.y = height-height/3-this.size/2;
      }
    }
  }
}
