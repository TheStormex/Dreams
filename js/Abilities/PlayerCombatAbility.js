class PlayerCombatAbility {
  constructor(name, cost, effects, description, button, image, ultimate, chargeGive, cooldown) {
    this.name = name;
    // how much energy this costs to activate
    this.cost = cost;
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
    // wait time before this ability can be used again
    this.cooldown = cooldown;
  }
  // when this ability happens, do its effects (spawn bullets or if is support ability, instant effect)
  happens() {
      // remove the energy this costs
      frontline.energy -= this.cost;
      // spawn the bullet(s) this ability makes
      // for each effect this ability has, do them
      for (var i = 0; i < this.effects.length; i++) {
        switch (this.effects[i][0]) {
          case "damage":
            for (var i = 0; i < this.effects[i].targets.length; i++) {
              this.targets[i].hp -= this.effects[i][1];
            }
            break;
          case "dash":
            // move the user in the current / last direction by the amount
            break;
          case "offense_up":
            break;
          case "offense_down":
            break;
          case "defense_up":
            break;
          case "defense_down":
            break;
          case "bullet":
            for (var i = 0; i < this.effects[i].amount; i++) {
              // make each bullet
              // this.effects[i].bullet
              console.log(this.effects[i].bullet);
              // if the bullet has a / multiple timers, set a new timeout for each
            }
            break;
          default:
        }
        this.effects[i]
      }
    }
  }
// effects: damage, heal,
