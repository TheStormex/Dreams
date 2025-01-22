class Enemy {
  constructor(name, maxHp, size, contactDamage, abilities, images, talents, talentsTriggers, combatDialogue, combatDialogueTriggers, aggroType) {
    this.name = name;
    this.type = "Enemy";
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
    this.talentsTriggers = talentsTriggers;
    this.talentUsed = false;
    this.talentUsedName = "";
    this.currentAbility;
    this.currentAggro = "none";
    // aggro type (calculated before tactics phase, who is aggro)
    this.aggroType = aggroType;
    this.images = images;
    this.currentImage;
    this.alive = true;
    this.status = ["none"];
    // capabilities
    this.canMove = true;
    this.canShoot = true;
    this.canAbility = true;
    // boolean stats for if things happened
    // to check for triggers
    this.damaged = false;
    // combat dialogues and their trigger event
    this.combatDialogueThisTurn;
    this.combatDialogue = combatDialogue;
    this.combatDialogueTriggers = combatDialogueTriggers;
    // list of effects that were used by / on this character
    this.usedList = [];
    this.affectedList = [];
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
      if (frontline.invincible === false && frontline.immune === false) {
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
        // add the used for the damage to the player
        addUsedAffected(this, "used", "Damage", "Enemy");
        addUsedAffected(frontline, "affected", "Damage", "Enemy");
        A_HIT_PLAYER.play();
        frontline.invincible = true;
        setTimeout(function() {
          frontline.invincible = false
        }, 100);
        // look for the enemy's current aggro target player, then deal the other half damage to that player
        let aggroedPlayerTarget;
        for (let i = 0; i < playersList.length; i++) {
          if (this.currentAggro === playersList[i]) {
            aggroedPlayerTarget = playersList[i];
          }
        }
        // the aggroed player takes other half of the damage
        addUsedAffected(aggroedPlayerTarget, "affected", "Damage", "Enemy");
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
  // based on the aggro type, choose who to target
  // if many have same stats, randomly choose one of them
  chooseAggroTarget() {
    let variableToCheck = [];
    for (let i = 0; i < playersList.length; i++) {
      switch (this.aggroType[0]) {
        case "hp":
          variableToCheck.push(playersList[i].hp);
          break;
        case "ultCharge":
          variableToCheck.push(playersList[i].ultCharge);
          break;
        default:
      }
    }
    let chosenTargetsIndexes = [];
    let finalChosenTargetIndex;
    switch (this.aggroType[1]) {
      case "highest":
        let highestValue;
        for (let i = 0; i < variableToCheck.length; i++) {
          if (i > 0) {
            if (variableToCheck[i] > highestValue) {
              highestValue = variableToCheck[i];
              chosenTargetsIndexes = [i];
            } else if (variableToCheck[i] === highestValue) {
              chosenTargetsIndexes.push(i);
            }
          } else {
            highestValue = variableToCheck[i];
            chosenTargetsIndexes = [i];
          }
        }
        break;
      case "lowest":
        let lowestValue;
        for (let i = 0; i < variableToCheck.length; i++) {
          if (i > 0) {
            if (variableToCheck[i] > lowestValue) {
              lowestValue = variableToCheck[i];
              chosenTargetsIndexes = [i];
            } else if (variableToCheck[i] === lowestValue) {
              chosenTargetsIndexes.push(i);
            }
          } else {
            lowestValue = variableToCheck[i];
            chosenTargetsIndexes = [i];
          }
        }
        break;
      default:
    }
    finalChosenTargetIndex = random(chosenTargetsIndexes);
    this.currentAggro = playersList[finalChosenTargetIndex];
  }

  // chooseDialogue() {
  //   // check each from lowest index to highest with
  //   // highest being the one with priority to be chosen
  //   // as the final choice if many are available
  //   let chosenDialogue;
  //   for (let i = 0; i < this.combatDialogueTriggers.length; i++) {
  //     switch (this.combatDialogueTriggers[i]) {
  //       case "base":
  //         // start with the base dialogue
  //         chosenDialogue = this.combatDialogue[i];
  //         break;
  //       // if this enemy has been hit by an ally and
  //       // took damage from it
  //       case "damaged":
  //         if (this.harmed === true) {
  //           chosenDialogue = this.combatDialogue[i];
  //         }
  //         break;
  //       default:
  //     }
  //   }
  //   this.combatDialogueThisTurn = chosenDialogue;
  //   // console.log(this.name + ": " + this.combatDialogueThisTurn);
  // }
}
