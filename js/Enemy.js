class Enemy {
  constructor(name, maxHp, size, contactDamage, abilities, images, talents, talentRate, combatDialogue, combatDialogueTriggers) {
    this.name = name;
    this.type = "enemy";
    this.hp = maxHp;
    this.maxHp = maxHp;
    this.baseSpeed = width / 400 + height / 400;
    this.speed = this.baseSpeed;
    this.speedMultiplier = 1;
    this.x = 0;
    this.y = 0;
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
    // capabilities
    this.canMove = true;
    this.canShoot = true;
    this.canAbility = true;
    // how it chooses aggro targets

    // how it chooses support targets

    // combat dialogues and their trigger event
    this.combatDialogue = combatDialogue;
    this.combatDialogueTriggers = combatDialogueTriggers;
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
    if (this.canMove === true) {
      let moveType = this.currentAbility.moves;
      if (moveType === "noise") {
        this.angle += random(-0.2, 0.2);
      } else if (moveType === "line") {}
      this.speed = this.baseSpeed * this.speedMultiplier;
      if (this.speed !== this.baseSpeed) {
      //  console.log(this.baseSpeed + " " + this.speedMultiplier + " " + this.speed);
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
      if (this.x - this.size / 2 <= 0) {
        this.x = this.size / 2;
        this.angle = random(-30, 30);
      }
      if (this.x + this.size / 2 > width) {
        this.x = width - this.size / 2;
        this.angle = random(-30, 30);
      }
      if (this.y - this.size / 2 < 0) {
        this.y = this.size / 2;
        this.angle = random(-30, 30);
      }
      if (this.y + this.size / 2 > height - height / 3) {
        this.y = height - height / 3 - this.size / 2;
        this.angle = random(-30, 30);
      }
    } else if (wrapType === "through") {
      this.angle += random(-0.2, 0.2);
      // reappear on the other side
      if (this.x - this.size / 2 <= 0) {
        this.x += width;
      }
      if (this.x + this.size / 2 > width) {
        this.x -= width;
      }
      if (this.y - this.size / 2 < 0) {
        this.y += (height - height / 3);
      }
      if (this.y + this.size / 2 > height - height / 3) {
        this.y -= (height - height / 3);
      }
    }
  }
  // if touch player
  contact() {
    let d = dist(this.x, this.y, frontline.x, frontline.y);
    if (d < this.size) {
      if (frontline.invincible === false) {
        // if the damaged character has activated tank ult ability
        if (frontline.tankUltActive === true) {
          frontline.ultCharge += frontline.tankUltAmount;
          frontline.ultCharge = constrain(frontline.ultCharge, 0, 100);
        }
        frontline.hp -= round(((this.contactDamage * (1 + this.offenseChange / 100) / (1 + frontline.defenseChange / 100))) * 0.5);
        frontline.harmed = true;
        frontline.hp = constrain(frontline.hp, 0, frontline.maxHp);
        if (frontline.tankUltActive === true) {
          frontline.ultCharge += frontline.tankUltAmount;
          frontline.ultCharge = constrain(frontline.ultCharge, 0, 100);
        }
        A_HIT_PLAYER.play();
        frontline.invincible = true;
        setTimeout(function() {
          frontline.invincible = false
        }, 100);
        // look for the enemy's current aggro target player, then deal the other half damage to that player
        let aggroedPlayerTarget;
        for (let i = 0; i < playersList.length; i++) {
          if (this.currentAggro === playersList[i].name) {
            aggroedPlayerTarget = playersList[i];
          }
        }
        // the aggroed player takes other half of the damage
        aggroedPlayerTarget.hp -= round(((this.contactDamage * (1 + this.offenseChange / 100) / (1 + aggroedPlayerTarget.defenseChange / 100))) * 0.5);
        aggroedPlayerTarget.hp = constrain(aggroedPlayerTarget.hp, 0, aggroedPlayerTarget.maxHp);
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
  // enemies choose aggro targets: if a player's aggro level is 1 or more above all others, it is
  // the target. If 2 or more have same highest amount, choose randomly between them
  // the current highest aggro amount
  chooseAggroTarget() {
    let highestAggro = 0;
    // how many players have the highest amount together
    let manyHighestAggro = [];
    // for each living player character that can be aggroed
    enemiesList.aggroList = playersList;
    for (let i2 = 0; i2 < this.aggroList.length; i2++) {
      // record their aggro amount and compare it to the highest
      let currentPlayerAggro = this.aggroAmount[i2];
      if (currentPlayerAggro > highestAggro) {
        highestAggro = currentPlayerAggro;
        // in case of a tie later, clean the array and add this one
        // also clear since if it was currently filled with past lower numbers
        manyHighestAggro = [];
        append(manyHighestAggro, i2);
        // if many are same highest, note down their index
        // ex: bolt, nuts, screws, robot = 0, 1, 2, 3
        // if bolt and screws are the highest together (3), then the manyHighestAggro
        // array becomes (0, 2)
      } else if (currentPlayerAggro === highestAggro) {
        append(manyHighestAggro, i2);
      }
    }
    // if there are many that are highest, randomly choose one between them
    // if there is only one highest, random choice only returns the same one
    // then the current enemy's chosen target name is selected
    let chosenRandomPlayer = random(manyHighestAggro);
    this.currentAggro = playersList[chosenRandomPlayer].name;;
    // reset the aggro for each enemy to be equal to each player
    // so new player actions will grab their attention again
    // from scratch
    for (let i2 = 0; i2 < this.aggroList.length; i2++) {
      this.aggroAmount[i2] = 1;
    }
  }
}
