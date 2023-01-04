class Bullet {
  constructor(origin, x, y, speed, angle, moveType, targets, effects, size, changes, images, sounds, wall, ifHit, timer) {
    // who shot this bullet
    this.origin = origin;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = angle;
    this.vx = 0;
    this.vy = 0;
    this.moveType = moveType;
    // what char can this bullet hit?
    this.targets = targets;
    // what effects this bullet has when hit a target
    this.effects = effects;
    // how larget is this bullet
    this.size = size;
    // if this changes size, damage, who it affecs, speed, etc.
    // check which ones this have and apply those changes every draw
    this.changes = changes;
    // the imames of this bullet
    this.images = images;
    // the sounds of this bullet
    this.sounds = sounds;
    // if this touches a wall, what to do
    this.wall = wall;
    // if this hits a target what to do 0 = if disappear, 1 = others
    this.ifHit = ifHit;
    // start a timer when this bullet is spawned, when the timer reaches
    this.timer = timer;
    // if this bullet should be destroyed in the next frame
    this.isDestroyed = false;
  }
  move() {
    // how will this bullet move
    switch (this.moveType) {
      case "straight":
        this.vx = this.speed*this.origin.bulletSpeed/100 * cos(this.angle);
        this.vy = this.speed*this.origin.bulletSpeed/100 * sin(this.angle);
        this.x += this.vx;
        this.y += this.vy;
        break;
      case "stay":
        // not move
        break;
      default:
    }
  }
  contact() {
    if (this.targets === "enemies") {
      for (let i = 0; i < enemiesList.length; i++) {
        let d = dist(this.x, this.y, enemiesList[i].x, enemiesList[i].y);
        if (d < enemiesList[i].size/2 + this.size/2) {
          this.effectHappens(enemiesList[i]);
          A_HIT_ENEMY.play();
        }
      }
    }
    else if (this.targets === "players" && frontline.immune === false && frontline.invincible === false) {
      let d = dist(this.x, this.y, frontline.x, frontline.y);
      if (d < frontline.size/2 + this.size/2) {
        this.effectHappens(frontline);
        frontline.harmed = true;
        A_HIT_PLAYER.play();
      }
    }
  }

  wrap() {
    switch (this.wall) {
      case "done":
        // prevent going outside of walls
        if (this.x <= 0) {
          let index = projectilesList.indexOf(this);
          projectilesList.splice(index, 1);
        }
        if (this.x > width) {
          let index = projectilesList.indexOf(this);
          projectilesList.splice(index, 1);
        }
        if (this.y < 0) {
          let index = projectilesList.indexOf(this);
          projectilesList.splice(index, 1);
        }
        if (this.y > height-height/3) {
          let index = projectilesList.indexOf(this);
          projectilesList.splice(index, 1);
        }
        break;
      case "through":
        break;
      default:
    }
  }
  draw() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angle+PI/2);
    image(this.images, 0, 0, this.size, this.size);
    pop();
  }
  effectHappens(target) {
    for (let i2 = 0; i2 < this.effects.length; i2++) {
      switch (this.effects[i2][0]) {
        case "Damage":
        addUsedAffected(target, "affected", "damage");
        // if this is a player's bullet:
          if (this.origin.type === "player") {
            target.hp -= round((this.effects[i2][1]*(1+this.origin.offenseChange/100)/(1+target.defenseChange/100)));
            target.hp = constrain(target.hp, 0, target.maxHp);
            // if this hit an enemy, that enemy is harmed
            // if (target.type === "enemy") {
              target.harmed = true;
            // }
          } else if (this.origin.type === "enemy") {

          // if this is an enemy's bullet:
            if (target.immune === false) {
              target.hp -= round(((this.effects[i2][1]*(1+this.origin.offenseChange/100)/(1+target.defenseChange/100)))*0.5);
              target.hp = constrain(target.hp, 0, target.maxHp);
              // look for the enemy's current aggro target player, then deal the other half damage to that player
              let aggroedPlayerTarget;
              for (let i = 0; i < playersList.length; i++) {
                if (this.origin.currentAggro === playersList[i]) {
                  aggroedPlayerTarget = playersList[i];
                }
              }
              // the aggroed player takes other half of the damage
              aggroedPlayerTarget.hp -= round(((this.effects[i2][1]*(1+this.origin.offenseChange/100)/(1+target.defenseChange/100)))*0.5);
              aggroedPlayerTarget.hp = constrain(aggroedPlayerTarget.hp, 0, aggroedPlayerTarget.maxHp);
              // if the damaged character has activated tank ult ability
              if (target.tankUltActive === true) {
                target.ultCharge += target.tankUltAmount;
                target.ultCharge = constrain(target.ultCharge, 0, 100);
              }
            }
          }
          break;
        // spawn more bullets
        case "Spawn":
          break;
        // give characters ult charge (players)
        case "Ult Charge":
          this.origin.ultCharge += this.effects[i2][1];
          this.origin.ultCharge = constrain(this.origin.ultCharge, 0, 100);
          break;
        // stun the target (cannot use abilities or attack)
        case "Stun":
          target.status.push("stun");
          let stunTimer = setInterval(() => {
            // if the target is still stunned when timer runs out, remove it
            if (target.status.includes("stun")) {
              let index = target.status.indexOf("stun");
              target.status.splice(index, 1);
            }
            clearInterval(stunTimer)
          }, this.effects[i2][1]);
          intervalsList.push(stunTimer);
          break;
        // root the target (cannot move)
        case "Root":
          target.status.push("root");
          let rootTimer = setInterval(() => {
            // if the target is still stunned when timer runs out, remove it
            if (target.status.includes("root")) {
              let index = target.status.indexOf("root");
              target.status.splice(index, 1);
            }
            clearInterval(rootTimer)
          }, this.effects[i2][1]);
          intervalsList.push(rootTimer);
          break;
        // heal a character, either the user or the receiver
        case "Heal":
          if (this.effects[i2][1] === "self") {
            this.origin.health += this.effects[i2][2];
          } else if (this.effects[i2][1] === "receiver") {
            target.health += this.effects[i2][2];
          }
          break;
        // knock back
        case "Knockback":
          let knockbackCounter = this.effects[i2][1];
          let thisBulletAngle = this.angle;
          let knockbackAmount = this.effects[i2][2] * (width/200+height/300);
          let knockbackInterval = setInterval(() => {
            target.vx = knockbackAmount * cos(thisBulletAngle);
            target.vy = knockbackAmount * sin(thisBulletAngle);
            target.x += target.vx;
            target.y += target.vy;
            knockbackCounter--;
            if (knockbackCounter <= 0) {
              clearInterval(knockbackInterval);
            }
          }, 1);
          intervalsList.push(knockbackInterval);
          break;
        // change the speed of user or receiver
        case "Speed Change":
          let speedChangeAmount = this.effects[i2][2];
          if (this.effects[i2][1] === "self") {
            this.origin.speedMultiplier += speedChangeAmount;
            this.origin.speedMultiplier = constrain(this.origin.speedMultiplier, 0, 3);
            if (this.effects[i2][2] < 1) {
              this.origin.status.push("slow");
            }
          } else if (this.effects[i2][1] === "receiver") {
            target.speedMultiplier += speedChangeAmount;
            target.speedMultiplier = constrain(target.speedMultiplier, 0, 3);
            if (speedChangeAmount < 1) {
              target.status.push("slow");
            }
          }
          let speedChangeTimer = setInterval(() => {
            target.speedMultiplier -= speedChangeAmount;
            clearInterval(speedChangeTimer)
          }, this.effects[i2][3]);
          intervalsList.push(speedChangeTimer);
          break;
        default:
      }
    }
    switch (this.ifHit[0]) {
      case "done":
          let index = projectilesList.indexOf(this);
          projectilesList.splice(index, 1);
      //  this.isDestroyed = true;
        break;
      case "through":
        // nothing
        break;
      default:
    }
    switch (this.ifHit[1]) {
      case "spawn":
        // create new bullets
        break;
      case "nothing":
        // nothing
        break;
      default:
    }
  }
}
