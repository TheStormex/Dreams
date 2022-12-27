class Player {
  constructor(name, maxHp, energyTurn, maxEnergy, abilities, basicBullet, images) {
    this.name = name;
    this.type = "player";
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.baseSpeed = width / 200 + height / 200;
    this.currentSpeed = this.baseSpeed;
    this.speedMultiplier = 0;
    this.x = width / 2;
    this.y = height / 3;
    this.angle = 0;
    this.vx = 0;
    this.vy = 0;
    this.size = width / 50 + height / 50;
    this.energy = 0;
    this.maxEnergy = maxEnergy;
    // bonus energy gained if not move last turn, char is refreshed this turn
    this.refreshed = false;
    this.energyBoost = 0;
    // stat changes
    this.offenseChange = 0;
    this.defenseChange = 0;
    // discount to abilities if applicable
    this.abilityDiscount = 0;
    // negative changes
    this.offenseDebuff = 0;
    this.defenseDebuff = 0;
    this.costDebuff = 0;
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
    // immune cannot be affected by enemies
    this.immune = false;
    // current status (root, )
    this.status = ["none"];
    // bottle stats
    // used this turn?
    this.bottleUsed = false;
    // charges left
    this.bottleCharges = 3;
    // base restore of health
    this.bottleBase = 40;
    // bonus restores and gains
    this.bottleBonuses = [];
    // If have the tank buff active
    this.tankUltActive = false;
    this.tankUltAmount = 0;
    // capabilities
    this.canMove = true;
    this.canShoot = true;
    this.canAbility = true;
    // have taken damage from an enemy source in battle?
    this.harmed = false;
    this.wasFrontline = false;
    // list of effects that were used by / on this character 
    this.usedList = [];
    this.affectedList = [];
  }
  move() {
    if (this.canMove === true) {
      // apply tired penalty if tired
      if (this.tired === true) {
        this.currentSpeed = this.baseSpeed / 2;
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
      if (this.x - this.size / 2 <= 0) {
        this.x = this.size / 2;
      }
      if (this.x + this.size / 2 > width) {
        this.x = width - this.size / 2;
      }
      if (this.y - this.size / 2 < 0) {
        this.y = this.size / 2;
      }
      if (this.y + this.size / 2 > height - height / 3) {
        this.y = height - height / 3 - this.size / 2;
      }
    }
  }
  // for every bottle's bonus effects, make the text appear
  // bottleEffectText() {
  //   let effectText = "";
  //   for (let i = 0; i < this.bottleBonuses.length; i++) {
  //     switch (this.bottleBonuses) {
  //       case expression:
  //
  //         break;
  //       default:
  //
  //     }
  //   }
  //   return effectText;
  // }
}
