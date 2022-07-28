class PlayerAbility {
  constructor(name, cost, effects, description, button, image, ultimate, chargeGive, cooldown) {
    this.name = name;
    // how much energy this costs to activate
    this.cost = cost;
    // the current cost of the ability
    this.costCurrent = this.cost;
    // what this ability does
    this.effects = effects;
    // how this ability is descibed to the player
    this.description = description;
    // what button to click to use this ability
    this.button = button;
    this.image = image;
    // if this is an ultimate ability
    this.ultimate = ultimate;
    // how much ult charge this gives upon use
    this.chargeGive = chargeGive;
    // wait time before this ability can be used again (combat player only)
    this.cooldown = cooldown;
    // the cooldown number shown to the player
    this.cooldownLeft = 0;
    // if this ability is on cooldown
    this.onCooldown = false;
    // the character that is using this ability
    this.user;
    // if this ability has been used this turn so it cannot be used again
    this.used = false;
    // which step is currently happening
    this.currentStep = 1;
    // which effect is currently happening
    this.currentEffect = 0;
    // how many steps this ability has before it is finished
    this.steps = 0;
  }
  // when this ability happens, do its effects (spawn bullets or if is support ability, instant effect)
  happens() {
    // check if the ability did what it needs to give ult charge
    let hitTarget = false;
    let healed = false;
    // remove the energy this costs and set the player's acted to yes
    this.costCurrent = this.cost - this.user.abilityDiscount;
    this.user.energy -= this.costCurrent;
    this.user.acted = true;
    if (this.ultimate === true) {
        this.user.ultCharge -= 100;
    }
    // for each effect, apply
    for (let i = 0; i < this.effects.length; i++) {
      let theEffect = this.effects[i];
      console.log(i);
      console.log(theEffect.targets);
      switch (this.effects[i].type) {
        case "damage":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i].hp -= round(theEffect.amount * (1+this.user.offenseChange*0.01) * (1+theEffect.targets[i].defenseChange*0.01));
            theEffect.targets[i].hp = constrain(theEffect.targets[i].hp, 0, theEffect.targets[i].maxHp);
          }
          break;
        case "heal":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            let targetOldHp = theEffect.targets[i2].hp;
            theEffect.targets[i2].hp += theEffect.amount;
            theEffect.targets[i2].hp = constrain(theEffect.targets[i2].hp, 0, theEffect.targets[i2].maxHp);
            // if the target's health went up after being healed, then give heal ult charge
            if (targetOldHp < theEffect.targets[i2].maxHp && theEffect.targets[i2].hp > targetOldHp) {
              healed = true;
            }
          }
          break;
        case "immune":
          this.user.immune = true;
          let immuneInterval = setInterval(() => {
            this.user.immune = false;
          }, theEffect.amount);
          intervalsList.push(immuneInterval);
          break;
        case "offense_change":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i2].offenseChange += theEffect.amount;
          }
          break;
        case "defense_change":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i2].defenseChange += theEffect.amount;
          }
          break;
        case "ultCharge_change":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i].ultCharge += theEffect.amount;
            theEffect.targets[i2].ultCharge = constrain(theEffect.targets[i2].ultCharge, 0, 100);
          }
          break;
        case "ramp":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i2].energy += theEffect.amount;
            theEffect.targets[i2].energy = constrain(theEffect.targets[i2].energy, 0, theEffect.targets[i2].maxEnergy);
          }
          break;
        case "cleanse":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            // remove negative status
            theEffect.targets[i2].status = [];
            let negatedOffenseDebuff = abs(theEffect.targets[i2].offenseDebuff);
            let negatedDefenseDebuff = abs(theEffect.targets[i2].defenseDebuff);
            let negatedCostDebuff = abs(theEffect.targets[i2].costDebuff);
            theEffect.targets[i2].offenseChange += negatedOffenseDebuff;
            theEffect.targets[i2].defenseChange += negatedDefenseDebuff;
            theEffect.targets[i2].abilityDiscount += negatedCostDebuff;
            theEffect.targets[i2].offenseDebuff = 0;
            theEffect.targets[i2].defenseDebuff = 0;
            theEffect.targets[i2].costDebuff = 0;
          }
          break;
        case "abilityRenew":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            for (let i3 = 0; i3 < theEffect.targets[i2].abilities[0].length; i3++) {
              theEffect.targets[i2].abilities[0][i3].used = false;
            }
          }
          break;
        case "bulletSpeed_change":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i2].bulletSpeed += theEffect.amount;
          }
          break;
        case "discount":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i2].abilityDiscount += theEffect.amount;
          }
          break;
        // combat only effects
        case "bullet":
          shootBullets(theEffect, this);
          break;
        // move the user towards the mouse angle direction
        case "dash":
          let dashCounter = 10;
          let currentUserAngle = this.user.angle;
          let dashInterval = setInterval(() => {
            this.user.vx = this.user.currentSpeed * theEffect.amount * cos(currentUserAngle);
            this.user.vy = this.user.currentSpeed * theEffect.amount * sin(currentUserAngle);
            this.user.x += this.user.vx;
            this.user.y += this.user.vy;
            dashCounter--;
            if (dashCounter <= 0) {
              clearInterval(dashInterval);
            }
          }, 10);
          break;
        case "tank_ult":
          this.user.tankUltAmount = theEffect.amount;
          this.user.tankUltActive = true;
          let duration = theEffect.perDelay;
          let buffInterval = setInterval(() => {
            this.user.tankUltActive = false;
          }, duration);
          break;
        default: console.log("error");
      }
      for (let i4 = 0; i4 < this.chargeGive.length; i4++) {
        switch (this.chargeGive[i4][1]) {
          case "use":
            this.user.ultCharge += this.chargeGive[i4][0];
            this.user.ultCharge = constrain(this.user.ultCharge, 0, 100);
            break;
          case "heal":
            if (healed === true) {
              this.user.ultCharge += this.chargeGive[i4][0];
              this.user.ultCharge = constrain(this.user.ultCharge, 0, 100);
            }
            break;
          default:
        }
      }
      // this ability is now used this turn
      this.used = true;
      // if this is a combat ability with a cooldown, then after use, set the timer
      if (this.cooldown !== 0 && this.onCooldown === false) {
        this.onCooldown = true;
        this.cooldownLeft = this.cooldown;
        let cooldownTimer = setInterval(() => {
          this.cooldownLeft -= 1;
          if (this.cooldownLeft <= 0) {
            this.onCooldown = false;
            this.cooldownLeft = 0;
            clearInterval(cooldownTimer);
          }
        }, 1000);
      //  intervalsList.push(this.cooldownTimer);
      }
      // remove all targets from the ability effect since ability effect is finished
      theEffect.targets = [];
    }
  }
}

// effects: damage, heal,
