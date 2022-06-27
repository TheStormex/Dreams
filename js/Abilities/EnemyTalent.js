class EnemyTalent {
  // start of turn talents, random choose 1, choose 1 target character,
  constructor(name, targets, effects, amount) {
    this.name = name;
    // possible targets group (self, players, enemies)
    this.targets = targets;
    // the chosen target
    this.chosenTarget;
    // the user
    this.user;
    // effects
    this.effects = effects;
    // how much the effect happens (if appiicable)
    this.amount = amount;
  }
  enemyTalentHappens() {
    // who can this talent affect
    
    // who does htis ability affect

    // for each effect, apply
    for (let i = 0; i < this.effects.length; i++) {
      let theEffect = this.effects[i];
      switch (this.effects[i].type) {
        case "heal":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            let targetOldHp = theEffect.targets[i2].hp;
            theEffect.targets[i2].hp += theEffect.amount;
            theEffect.targets[i2].hp = constrain(theEffect.targets[i2].hp, 0, theEffect.targets[i2].maxHp);
          }
          break;
        case "offense_change":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i].offenseChange += theEffect.amount;
          }
          break;
        case "defense_change":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i].defenseChange += theEffect.amount;
          }
          break;
        case "stun":
          for (let i2 = 0; i2 < theEffect.targets.length; i2++) {
            theEffect.targets[i].stun = true;
          }
          break;
        default: console.log("error");
      }
    }
  }
}
