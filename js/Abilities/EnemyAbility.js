class EnemyAbility {
  // both combat routines and start of turn talents
  constructor(moves, effects, loopRate, wrap, timer, user) {
    // how the enemy moves during this ability (noise, straight line, direction)
    this.moves = moves;
    // what effects the ability does for / to the enemy
    this.effects = effects;
    // how long between each abiilty's repeat
    this.loopRate = loopRate;
    // what happens if enemy touches wall (bounce, other side, random)
    this.wrap = wrap;
    // timer for going back
    this.timer = timer;
    // the user
    this.user = user;
  }
  enemyEffectHappens() {
    // for each effect, apply
    for (let i = 0; i < this.effects.length; i++) {
      let theEffect = this.effects[i];
      switch (this.effects[i].type) {
        case "damage":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i2].hp -= round(theEffect.amount * (1+this.user.offenseChange*0.01) * (1+theEffect.targets[i2].defenseChange*0.01));
            theEffect.targets[i2].hp = constrain(theEffect.targets[i2].hp, 0, theEffect.targets[i2].maxHp);
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
        case "ramp":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i2].energy += theEffect.amount;
            theEffect.targets[i2].energy = constrain(theEffect.targets[i2].energy, 0, theEffect.targets[i2].maxEnergy);
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
        default: console.log("error");
      }
    }
  }
}
