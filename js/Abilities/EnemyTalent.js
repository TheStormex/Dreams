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
  }

  // for each triggerType element, check if that has happened
  // if all 4 are true, this talent can happen
  enemyTalentTriggerCheck() {
    let triggerCheckGroup;
    let triggerCheckGroupSpecific = [];
    let triggerCheckInOutList = [];
    let triggerCheckEffectType;
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
            triggerCheckInOutList.push(triggerCheckGroupSpecific[i2]);
          }
        }
        break;
      case "affected":
      // for each character, add all of their used/affected list items
      // to the triggerCheckInOutList
        for (let i = 0; i < triggerCheckGroupSpecific.length; i++) {
          // for each type of effect that affected this character
          for (let i2 = 0; i2 < triggerCheckGroupSpecific[i].affectedList.length; i2++) {
            triggerCheckInOutList.push(triggerCheckGroupSpecific[i2]);
          }
        }
        break;
      default:
    }
    // check if the trigger's type of effect is present in the used/affected list
    // if it can be found, isTriggered becomes true for this talent
    // for each item in the in out list
    for (let i = 0; i < triggerCheckInOutList.length; i++) {
      if (triggerCheckInOutList[i] === this.triggerType[3]) {
        this.isTriggered = true;
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
    let targetCharacter;
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
            targetCharacter = this.user;
            break;
          case "frontline":
            targetCharacter = frontline;
            break;
          case "name":
            for (let i = 0; i < groupList.length; i++) {
              if (this.targetType[2] === groupList[i].name) {
                targetCharacter = groupList[i];
              }
            }
            break;
          default:
        }
        break;
      case "stats":
        // which stat to look for
        switch (this.targetType[1]) {
          case "hp":
            for (let i = 0; i < groupList.length; i++) {
              statToCheck.push(groupList[i].hp);
            }
            break;
          case "energy":

            break;
          default:
        }
        // how to rank based on this stat?
        switch (this.targetType[2]) {
          case "highest":

            break;
          case "lowest":

            break;
          default:
        }
        break;
      default:
    }
    return targetCharacter;
  }

  enemyTalentHappens() {
    // for each effect, apply
    for (let i = 0; i < this.effects.length; i++) {
      let theEffect = this.effects[i];
      addUsedAffected(this.user, "used", theEffect);
      addUsedAffected(this.chosenTarget, "affected", theEffect);
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
