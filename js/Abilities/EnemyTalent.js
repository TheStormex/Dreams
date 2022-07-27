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
    // who can this talent affect, then chose target from that list
    switch (this.targets) {
      case "self":
        this.chosenTarget = this.user;
        break;
      case "enemies":
        this.chosenTarget = random(enemiesList);
        break;
      case "players":
        for (let i = 0; i < playersList.length; i++) {
          if (playersList[i].name === this.user.currentAggro) {
            this.chosenTarget = playersList[i];
          }
        }
        break;
      case "frontline":
        this.chosenTarget = frontline;
        break;
      default:
      console.log("error");
    }
    // for each effect, apply
    for (let i = 0; i < this.effects.length; i++) {
      let theEffect = this.effects[i];
      switch (theEffect) {
        case "Heal":
          let targetOldHp = this.chosenTarget.hp;
          this.chosenTarget.hp += this.amount[i];
          this.chosenTarget.hp = constrain(this.chosenTarget.hp, 0, this.chosenTarget.maxHp);
          break;
        case "Offense Change":
          this.chosenTarget.offenseChange += this.amount[i];
          this.chosenTarget.offenseDebuff += this.amount[i];
          break;
        case "Defense Change":
          this.chosenTarget.defenseChange += this.amount[i];
          this.chosenTarget.defenseDebuff += this.amount[i];
          break;
        case "Stun":
          this.chosenTarget.status.push("stun");
          break;
        case "Drain Energy":
          this.chosenTarget.energy -= this.amount[i];
          this.chosenTarget.energy = constrain(this.chosenTarget.energy, 0, this.chosenTarget.maxEnergy);
          break;
        case "Tax":
          this.chosenTarget.abilityDiscount += this.amount[i];
          this.chosenTarget.costDebuff += this.amount[i];
          break;
        // make a diff char frontline
        case "Change Frontline":
          while (this.chosenTarget.name === frontline.name) {
            this.chosenTarget = random(playersList);
          }
          frontline = this.chosenTarget;
          break;
        default: console.log("error");
      }
    }
  }
}
