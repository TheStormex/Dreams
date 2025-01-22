class EnemyTalent {
  // start of turn talents, random choose 1, choose 1 target character,
  constructor(name, targets, effects, amount, triggerType, targetType) {
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
    // possible, other char (not) used X, other char (not) affected by X
    this.triggerType = triggerType;
    this.isTriggered = false;
    // l / h hp, specific, aggro
    // not all talents have effects that target both sides
    this.targetType = targetType;
    // ID for tracking
    this.id = 0;
  }

  // for each triggerType element, check if that has happened
  // if all 4 are true, this talent can happen
  enemyTalentTriggerCheck() {
    let triggerCheckGroup = [];
    let triggerCheckGroupSpecific = [];
    let triggerCheckInOutList = [];
    let triggerCheckEffectType;
    let triggerCheckEffectSource;
    switch (this.triggerType[0]) {
      case "enemies":
        triggerCheckGroup = enemiesList;
        break;
      case "players":
        triggerCheckGroup = playersList;
        break;
      default:
    }
    switch (this.triggerType[1]) {
      case "any":
        for (let i = 0; i < triggerCheckGroup.length; i++) {
          triggerCheckGroupSpecific.push(triggerCheckGroup[i]);
        }
        break;
      case "frontline":
        triggerCheckGroupSpecific.push(frontline);
        break;
      case "not_frontline":
        for (let i = 0; i < playersList.length; i++) {
          if (playersList[i].name !== frontline.name) {
            triggerCheckGroupSpecific.push(playersList[i]);
          }
        }
        break;
      default:
    }
    switch (this.triggerType[2]) {
      // copy the used / affected list of the character(s)
      case "used":
      // for each character, add all of their used/affected list items
      // to the triggerCheckInOutList
        for (let i = 0; i < triggerCheckGroupSpecific.length; i++) {
          // for each used type of effect
          for (let i2 = 0; i2 < triggerCheckGroupSpecific[i].usedList.length; i2++) {
            triggerCheckInOutList.push([triggerCheckGroupSpecific[i].usedList[i2][0], triggerCheckGroupSpecific[i].usedList[i2][1]]);
          }
        }
        break;
      case "affected":
      // for each character, add all of their used/affected list items
      // to the triggerCheckInOutList
        for (let i = 0; i < triggerCheckGroupSpecific.length; i++) {
          // for each type of effect that affected this character
          for (let i2 = 0; i2 < triggerCheckGroupSpecific[i].affectedList.length; i2++) {
            triggerCheckInOutList.push([triggerCheckGroupSpecific[i].affectedList[i2][0], triggerCheckGroupSpecific[i].affectedList[i2][1]]);
          }
        }
        break;
      default:
    }
    // check if the trigger's type of effect is present in the used/affected list
    // if it can be found, isTriggered becomes true for this talent
    // for each item in the in out list
    for (let i = 0; i < triggerCheckInOutList.length; i++) {
      // if the triggered ability (Heal) is present and was from the right type of source (Player)
      // then this talent would trigger.
      if (triggerCheckInOutList[i][0] === this.triggerType[3]) {
        if (this.triggerType[4] === triggerCheckInOutList[i][1]) {
           this.isTriggered = true;
        }
      }
    }
    // switch (this.triggerType[3]) {
    // // if this type is on that/those character(s)'s used/affected effects list
    // // if it can be found, isTriggered becomes true for this talent
    //   case "damage":
    //
    //     break;
    //   case "heal":
    //
    //     break;
    //   case "defense_up":
    //
    //     break;
    //   case "defense_down":
    //
    //     break;
    //   case "ultimate":
    //
    //     break;
    //   default:
    //
    // }
  }
  // which enemy / player exactly will this affect
  enemyTalentTargetChoice() {
    let groupList = [];
    let statToCheck = [];
    let targetsIndexes = [];
    switch (this.targets) {
      case "enemies":
        groupList = enemiesList;
        break;
      case "players":
        groupList = playersList;
        break;
      default:
    }
    // specific one or stat-based
    switch (this.targetType[0]) {
      // a specific character to
      // use this talent on regardless
      // of situation
      case "specific":
        switch (this.targetType[1]) {
          case "self":
            this.chosenTarget = this.user;
            break;
          case "frontline":
            this.chosenTarget = frontline;
            break;
          case "name":
            for (let i = 0; i < groupList.length; i++) {
              if (this.targetType[2] === groupList[i].name) {
                this.chosenTarget = groupList[i];
              }
            }
            break;
          default:
        }
        break;
      case "stats":
        // which stat to look for
        // to organize the lists
        // how to rank based on names from top to bottom
        switch (this.targetType[1]) {
          case "hp":
            for (let i = 0; i < groupList.length; i++) {
              statToCheck.push(groupList[i].hp);
            }
            break;
          case "energy":
            for (let i = 0; i < groupList.length; i++) {
              statToCheck.push(groupList[i].energy);
            }
            break;
          default:
        }
        // reorder
        // find the highest and lowest numbers
        // first set the highest and lowest to the first
        // then change by comparing
        // example: [Nuts, 1000]
        let highestValue = [groupList[0], statToCheck[0]];
        let lowestValue = [groupList[0], statToCheck[0]];
        // find highest one from all of the group characters
        for (let i = 0; i < groupList.length; i++) {
          if (statToCheck[i] > highestValue[1]) {
            highestValue = [groupList[i], statToCheck[i]];
          }
          if (statToCheck[i] < lowestValue[1]) {
            lowestValue = [groupList[i], statToCheck[i]];
          }
        }
        // depending on the chosen target, add it as chosen target
        switch (this.targetType[2]) {
          case "highest":
            this.chosenTarget = highestValue[0];
            break;
          case "lowest":
            this.chosenTarget = lowestValue[0];
            break;
          default: console.log('error');
        }
        break;
      default:
    }
  }

  enemyTalentHappens() {
    // for each effect, apply
    for (let i = 0; i < this.effects.length; i++) {
      let theEffect = this.effects[i];
      addUsedAffected(this.user, "used", theEffect, "Enemy");
      addUsedAffected(this.chosenTarget, "affected", theEffect, "Enemy");
      switch (theEffect) {
        case "Heal":
          let targetOldHp = this.chosenTarget.hp;
          this.chosenTarget.hp += this.amount[i];
          this.chosenTarget.hp = constrain(this.chosenTarget.hp, 0, this.chosenTarget.maxHp);
          break;
        case "Offense Change":
          this.chosenTarget.offenseChange += this.amount[i];
          if (this.amount[i] > 0) {
            this.chosenTarget.offenseBuff += this.amount[i];
          }
          if (this.amount[i] <= 0) {
            this.chosenTarget.offenseDebuff += this.amount[i];
          }
          break;
        case "Defense Change":
          this.chosenTarget.defenseChange += this.amount[i];
          if (this.amount[i] > 0) {
            this.chosenTarget.defenseBuff += this.amount[i];
          }
          if (this.amount[i] <= 0) {
            this.chosenTarget.defenseDebuff += this.amount[i];
          }
          break;
        case "Stun":
          this.chosenTarget.status.push("stun");
          break;
        case "Energy Change":
          this.chosenTarget.energy += this.amount[i];
          this.chosenTarget.energy = constrain(this.chosenTarget.energy, 0, this.chosenTarget.maxEnergy);
          break;
        case "Cost Change":
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
