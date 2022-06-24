class PlanState {
  constructor() {
    // if the mouse is over a player character, get that character's name
    this.situation = "choose";
    this.currentAbilityStepNumber = 0;
  }
  draw() {
    background(100);
    // draw players, enemies, selected player stats on bottom, click on support skills to use it, mouse over to see what it does
    // ult charge, health, energy,
    this.drawChars();
    this.mouseOverPlayer();
    drawCommonUI();
    this.drawPlayerMenu();
    this.drawExtraUI();
    // show dialog
    this.dialogContent();
    if (gameStarted === true) {
      $('#dialogBox').css(`display`, 'block');
      $(`#dialogText`).text(currentDialogText);
    }
  }
  // if the mouse is over an player avatar, that player character becomes the selected character, if not using an ability, then that character becomes the current character
  mouseOverPlayer() {
    mouseOver = 0;
    // draw depending on the situation: choose, ability, happen
    switch (this.situation) {
      case "choose":
        for (let i = 0; i < playersList.length; i++) {
          if (mouseX > width*(i+1)/(playersList.length+1)-width/12 && mouseX < width*(i+1)/(playersList.length+1)-width/12+width/6  && mouseY > height/2-height/6 && mouseY < height/2-height/6+height/3) {
            mouseOver = playersList[i];
            currentChar = playersList[i];
          }
        }
        // if a character is selected, then if mouse over one of their abilities, put it into the mouse over
        if (currentChar !== "none") {
          for (let i = 0; i < currentChar.abilities[0].length; i++) {
            if (mouseX > width/7+(i*width/3.5) && mouseX < width/7+(i*width/3.5)+width/4 && mouseY > height-height/4.5 && mouseY < height-height/4.5+height/6) {
              mouseOver = currentChar.abilities[0][i];
            }
          }
        }
        // if mouseover a character's head, show the passives this character has
        if (currentChar !== "none") {
          if (mouseX > width/18-width/20 && mouseX < width/18-width/20+width/10 && mouseY > height-height/7-height/12 && mouseY < height-height/7-height/12+height/6) {
            console.log("yes");
          }
        }
        // check if mousing over the fight button
        if (mouseX > width-width/10-width/20 && mouseX < width-width/10+width/10-width/20 && mouseY > height/2-height/30-height/6 && mouseY < height/2+height/15-height/30-height/6) {
          mouseOver = "fight"
        }
        break;
      case "ability":
        // check what is being moused over, player or enemy
        for (let i = 0; i < playersList.length; i++) {
          if (mouseX > width*(i+1)/(playersList.length+1)-width/12 && mouseX < width*(i+1)/(playersList.length+1)-width/12+width/6  && mouseY > height/2-height/6 && mouseY < height/2-height/6+height/3) {
            mouseOver = playersList[i];
          }
        }
        for (let i = 0; i < enemiesList.length; i++) {
          if (mouseX > width*(i+1)/(enemiesList.length+1)-width/12 && mouseX < width*(i+1)/(enemiesList.length+1)-width/12+width/6  && mouseY > height/5-height/6 && mouseY < height/5-height/6+height/3) {
            mouseOver = enemiesList[i];
          }
        }
        // check if mousing over the cancel button
        if (mouseX > width-width/10-width/20 && mouseX < width-width/10+width/10-width/20 && mouseY > height/2-height/30-height/6 && mouseY < height/2+height/15-height/30-height/6) {
          mouseOver = "cancel"
        }
        break;
      case "happen":

        break;
      default:
        console.log("error");
    }
  }


  // draw all characters
  drawChars() {
    push();
    noStroke();
    textSize(width/100+height/100);
    textAlign(CENTER, CENTER);
    rectMode(CENTER, CENTER);
    fill(255);
    // check enemy / player amount, for each enemy / player, draw name, sprites and stats
    for (let i = 0; i < playersList.length; i++) {
      textSize(width/200+height/100);
      rectMode(CENTER, CENTER);
      // mark the selected character with a square depending on the situation, if choose, then friendly only (can be selected to act)
      // if ability, then those who can be selected will glow and those moused over will have another square
      if (this.situation === "choose") {
        if (currentChar.name === playersList[i].name) {
          fill(0, 100, 255);
          rect(width*(i+1)/(playersList.length+1), height/2, width/7, height/3);
        }
      } else if (this.situation === "ability") {
        if (currentAbility.currentEffect.canTargetsList.includes(playersList[i])) {
          fill(255, 200, 50);
          rect(width*(i+1)/(playersList.length+1), height/2, width/7, height/3);
        }
      }
      // if this is the frontline character, mark it
      if (frontline.name === playersList[i].name) {
        fill(255, 150, 0);
        rect(width*(i+1)/(playersList.length+1), height/2, width/9, height/3.2);
      }
      // images of the player's front
      imageMode(CENTER);
      image(playersList[i].images.front, width*(i+1)/(playersList.length+1), height/2, width/10, height/7);
      // health bar
      fill(255);
      rect(width*(i+1)/(playersList.length+1), height/2-height/10, width/10, height/40);
      fill(255, 0 ,0);
      rectMode(CORNER);
      rect(width*(i+1)/(playersList.length+1)-width/20, height/2-height/10-height/80, playersList[i].hp*(width/10)/playersList[i].maxHp, height/40);
      // names and hp amount
      fill(255)
      let healthText = playersList[i].hp + " " + "/" + " " + playersList[i].maxHp;
      textAlign(CENTER, CENTER);
      text(playersList[i].name, width*(i+1)/(playersList.length+1), height/2-height/7);
      fill(0);
      text(healthText, width*(i+1)/(playersList.length+1), height/2-height/10);
      // if is frontline, show it, if not, say click to make front line
      if (playersList[i].name === frontline.name) {
        text("Frontline", width*(i+1)/(playersList.length+1), height/2+height/9);
      } else {
        // if has enough energy to become Frontline
        if (playersList[i].energy >= 3) {
          text("Click to make Frontline", width*(i+1)/(playersList.length+1), height/2+height/9);
        } else {
          text("Can't be Frontline", width*(i+1)/(playersList.length+1), height/2+height/9);
          text("Need more Energy", width*(i+1)/(playersList.length+1), height/2+height/7);
        }
      }
      // if this character is tired of being frontline, show it
      if (playersList[i].tired === true) {
        strokeWeight(3);
        stroke(100, 0, 100);
        fill(255, 0, 0);
        text("Tired!", width*(i+1)/(playersList.length+1), height/2+height/7);
        noStroke();
      }  else if (playersList[i].refreshed === true) { // if this character is refreshed by not using any abilities last turn and was not frontline
        strokeWeight(3);
        stroke(0, 150, 0);
        fill(0, 255, 100);
        text("Refreshed!", width*(i+1)/(playersList.length+1), height/2+height/7);
        noStroke();
      }
      // draw the status changes of each character if they are not 0
      rectMode(CENTER);
      if (playersList[i].offenseChange !== 0) {
        fill(255, 0, 0)
        rect(width*(i+1)/(playersList.length+1)+width/12, height/2-height/18, width/20, height/20);
        fill(0);
        textSize(width/80, height/80);
        text("ATK", width*(i+1)/(playersList.length+1)+width/12, height/2-height/18-height/80);
        let offenseText;
        if (playersList[i].offenseChange > 0) {
          offenseText = "+" + playersList[i].offenseChange + "%";
        } else if (playersList[i].offenseChange < 0) {
          offenseText = playersList[i].offenseChange + "%";
        }
        text(offenseText, width*(i+1)/(playersList.length+1)+width/12, height/2-height/23);
      }
      if (playersList[i].defenseChange !== 0) {
        fill(0, 255, 0)
        rect(width*(i+1)/(playersList.length+1)+width/12, height/2, width/20, height/20);
        fill(0);
        textSize(width/80, height/80);
        text("DEF", width*(i+1)/(playersList.length+1)+width/12, height/2-height/80);
        let defenseText;
        if (playersList[i].defenseChange > 0) {
          defenseText = "+" + playersList[i].defenseChange + "%";
        } else if (playersList[i].defenseChange < 0) {
          defenseText = playersList[i].defenseChange + "%";
        }
        text(defenseText, width*(i+1)/(playersList.length+1)+width/12, height/2+height/80);
      }
    }
    // draw the enemy sprites
    for (let i = 0; i < enemiesList.length; i++) {
      textSize(width/100+height/100);
      fill(255);
      rectMode(CENTER, CENTER);
      // if the current ability can select enemies, mark them
      if (this.situation === "ability") {
        if (currentAbility.currentEffect.canTargetsList.includes(enemiesList[i])) {
          fill(255, 200, 50);
          rect(width*(i+1)/(enemiesList.length+1), height/6, width/7, height/3.4);
        }
      }
      fill(255);
      imageMode(CENTER);
      image(enemiesList[i].images.front, width*(i+1)/(enemiesList.length+1), height/5, width/10, height/7);
      // health bar
      fill(255);
      rect(width*(i+1)/(enemiesList.length+1), height/5-height/10, width/10, height/40);
      fill(255, 0 ,0);
      rectMode(CORNER);
      rect(width*(i+1)/(enemiesList.length+1)-width/20, height/5-height/10-height/80, enemiesList[i].hp*(width/10)/enemiesList[i].maxHp, height/40);
      // names and hp amount
      fill(255)
      let healthText = enemiesList[i].hp + " " + "/" + " " + enemiesList[i].maxHp;
      textAlign(CENTER, CENTER);
      text(enemiesList[i].name, width*(i+1)/(enemiesList.length+1), height/5-height/7);
      fill(0);
      text(healthText, width*(i+1)/(enemiesList.length+1), height/5-height/10);
      // draw the status changes of each character if they are not 0
      rectMode(CENTER);
      if (enemiesList[i].offenseChange !== 0) {
        fill(255, 0, 0)
        rect(width*(i+1)/(enemiesList.length+1)+width/12, height/5-height/18, width/20, height/20);
        fill(0);
        textSize(width/80, height/80);
        text("ATK", width*(i+1)/(enemiesList.length+1)+width/12, height/5-height/18-height/80);
        let offenseText2;
        if (enemiesList[i].offenseChange > 0) {
          offenseText2 = "+" + enemiesList[i].offenseChange + "%";
        } else if (enemiesList[i].offenseChange < 0) {
          offenseText2 = enemiesList[i].offenseChange + "%";
        }
        text(offenseText2, width*(i+1)/(enemiesList.length+1)+width/12, height/5-height/18+height/80);
      }
      if (enemiesList[i].defenseChange !== 0) {
        fill(0, 255, 0)
        rect(width*(i+1)/(enemiesList.length+1)+width/12, height/5, width/20, height/20);
        fill(0);
        textSize(width/80, height/80);
        text("DEF", width*(i+1)/(enemiesList.length+1)+width/12, height/5-height/80);
        let defenseText2;
        if (enemiesList[i].defenseChange > 0) {
          defenseText2 = "+" + enemiesList[i].defenseChange + "%";
        } else if (enemiesList[i].defenseChange < 0) {
          defenseText2 = enemiesList[i].defenseChange + "%";
        }
        text(defenseText2, width*(i+1)/(enemiesList.length+1)+width/12, height/5+height/80);
      }
      // draw the enemies' aggro targets
      fill(255, 255, 255);
      rect(width*(i+1)/(enemiesList.length+1)-width/15, height/5-height/10, width/40, height/25);
      imageMode(CENTER);
      let aggroedPlayer = enemiesList[i].currentAggro;
      // check the list of players that are alive to see if a player's name is hte same as the
      // name of the enemy's current aggro to fetch that player's face image
      let aggroedPlayerIndex;
      for (let i2 = 0; i2 < playersList.length; i2++) {
        if (playersList[i2].name === aggroedPlayer) {
          aggroedPlayerIndex = i2;
        }
      }
      image(playersList[aggroedPlayerIndex].images.face, width*(i+1)/(enemiesList.length+1)-width/15, height/5-height/10, width/40, height/25);
    }
    pop();
  }


  // draw the supporting skills the characters can use in the UI box
  drawPlayerMenu() {
    // tell player cost of changing frontline
    push();
    stroke(0);
    fill(255);
    rectMode(CENTER, CENTER);
    rect(width/15, height/3+height/7, width/10, height/10);
    textSize(width/80);
    noStroke();
    fill(0);
    text("Change Frontline", width/50, height/3 + height/8);
    text("Cost = 3 Energy", width/50, height/2);
    pop();
    if (currentChar != "none") {
      push();
      // 2 supporting skills
      for (let i = 0; i < currentChar.abilities[0].length; i++) {
        strokeWeight(3);
        stroke(0);
        // if moused over, it is highlighted
        if (mouseOver.name === currentChar.abilities[0][i].name) {
          fill(0);
        } else {
          fill(255);
        }
        rectMode(CORNER);
        rect(width/7+(i*width/3.5), height-height/4.5, width/4, height/6);
        // name, cost and ability
        noStroke();
        // if moused over, it is highlighted
        if (mouseOver.name === currentChar.abilities[0][i].name) {
          fill(255);
        } else {
          fill(0);
        }
        textAlign(CENTER, CENTER);
        textSize(width/80+height/80);
        text(currentChar.abilities[0][i].name, width/3.75+(i*width/3.5), height-height/6);
        // apply any discounts
        currentChar.abilities[0][i].costCurrent = currentChar.abilities[0][i].cost - currentChar.abilityDiscount;
        currentChar.abilities[0][i].costCurrent = constrain(currentChar.abilities[0][i].costCurrent, 0, 999);
        let abilityCostText = "Cost: "  + currentChar.abilities[0][i].costCurrent + " Energy";
        text(abilityCostText, width/3.75+(i*width/3.5), height-height/8);
        textSize(width/150+height/150);
        text(currentChar.abilities[0][i].description, width/3.75+(i*width/3.5), height-height/12);
        // if this is an ultimate, then let the player know
        if (currentChar.abilities[0][i].ultimate === true) {
          textSize(width/100+height/100);
          if (currentChar.ultCharge === 100) {
            fill(0, 255, 0);
            text("Ultimate Ready!", width/3.75+(i*width/3.5), height-height/5);
          } else {
            fill(255, 0, 0);
            text("Ultimate Charging", width/3.75+(i*width/3.5), height-height/5);
          }
        }
        // if this non-ultimate ability has been used this turn and cannot be used again
        if (currentChar.abilities[0][i].used === true && currentChar.abilities[0][i].ultimate === false) {
          textSize(width/100+height/100);
          fill(255, 0, 0);
          text("Used This Turn", width/3.75+(i*width/3.5), height-height/5);
        }
      }
    pop();
    }
  }

  // draw the buttons for canceling abilities, for going to the fight mode;
  drawExtraUI() {
    // draw the button for canceling ability if an ability is being used if it has not been used partly
    if (this.situation === "ability") {
      if (currentAbility.currentStep === 1) {
        push();
        rectMode(CENTER);
        noStroke();
        // if moused over, it is highlighted
        if (mouseOver === "cancel") {
          fill(0);
        } else {
          fill(255,50,0);
        }
        rect(width-width/15, height/2-height/6, width/10, height/15);
        // if moused over, it is highlighted
        if (mouseOver === "cancel") {
          fill(255, 0, 0);
        } else {
          fill(0);
        }
        textAlign(CENTER, CENTER);
        textSize(width/120+height/120);
        text("Cancel Ability", width-width/15, height/2-height/6);
        pop();
      }
    }
    // draw the button to go to the fight mode
    if (this.situation === "choose") {
      push();
      rectMode(CENTER);
      noStroke();
      // if moused over, it is highlighted
      if (mouseOver === "fight") {
        fill(0);
      } else {
        fill(255,255,0);
      }
      rect(width-width/15, height/2-height/6, width/10, height/15);
      // if moused over, it is highlighted
      if (mouseOver === "fight") {
        fill(255, 255, 0);
      } else {
        fill(0);
      }
      textAlign(CENTER, CENTER);
      textSize(width/80+height/50);
      text("Fight!", width-width/15, height/2-height/6);
      pop();
    }
  }

  // draw the portraits of characters each enemy is targetting
  drawAggro() {

  }

  // if mouse is down and a player character is not using an ability,
  // if the character that mouse is over is not the front line, click to make frontline
  // if a character is using an ability, if over an appropriate target, then ability happens
  mouseDown() {
    if (mouseOver != 0) {
      if (this.situation === "choose") {
        // if the fight button is clicked, go to fight state
        if (mouseOver === "fight") {
          this.goToFight();
        }
        // if a player is moused over, that player character is now the front line
         else if (playersList.includes(mouseOver)) {
           // if would be frontline has 3 or more energy, before frontline, else, no.
           if (mouseOver.energy >= 3) {
             mouseOver.energy-= 3;
             frontline = mouseOver;
           }
          // if a player's ability is moused over, then clicking selects that ability to be used
        } else if (currentChar.abilities[0].includes(mouseOver)) {
          // if this ability is not an ultimate, and if they have enough energy to use it, and it has not been used this turn then it works
          if (mouseOver.ultimate === false && currentChar.energy - mouseOver.cost >= 0 && mouseOver.used === false) {
            this.selectAbility();
          } else if (mouseOver.ultimate === true && currentChar.ultCharge === 100) {
            this.selectAbility();
          } else {
            console.log("not enough");
            console.log(mouseOver.ultimate);
            console.log(currentChar.energy - mouseOver.cost)
            console.log(mouseOver.used);
          }
        }
      }
      if (this.situation === "ability") {
        // for each effect, happens
        for (var i = 0; i < currentAbility.effects.length; i++) {
          if (currentAbility.currentEffect.aoe === false) {
            // if this ability can target this moused over character activate ability
            if (mouseOver !== 0) {
            if (currentAbility.currentEffect.canTargetsList.includes(mouseOver)) {
                currentAbility.currentEffect.targets.push(mouseOver);
                currentAbility.user = currentChar;
                if (currentAbility.ultimate === true) {
                  A_SUPPORT_ULT.play();
                  currentAbility.user.ultCharge -= 100;
                } else {
                  A_SUPPORT.play();
                }
                currentAbility.happens();
                this.situation = "choose";
              // if the cancel button is moused over, cancel the ability
              } else if (mouseOver === "cancel") {
                this.situation = "choose";
              }
            }
          } else if (currentAbility.currentEffect.aoe === true) {
              for (var i2 = 0; i2 < currentAbility.currentEffect.canTargetsList.length; i2++) {
                currentAbility.currentEffect.targets.push(currentAbility.currentEffect.canTargetsList[i2]);
              }
              currentAbility.user = currentChar;
              if (currentAbility.ultimate === true) {
                A_SUPPORT_ULT.play();
                currentAbility.user.ultCharge -= 100;
              } else {
                A_SUPPORT.play();
              }
              currentAbility.happens();
              this.situation = "choose";
          }
        }
      }
    }
  }
  // select this ability
  selectAbility() {
    currentAbility = mouseOver;
    // remove the ability from mouseOver since what will be mousedOver will be a character
    mouseOver = 0;
    currentAbility.currentStep = 1;
    currentAbility.currentEffect = currentAbility.effects[0];
    // if the first effect can target players, then make the canTargetsList into an array of all player characters, same if enemies
    if (currentAbility.currentEffect.canTargets === "players") {
      currentAbility.currentEffect.canTargetsList = playersList;
    } else if (currentAbility.currentEffect.canTargets === "enemies") {
      currentAbility.currentEffect.canTargetsList = enemiesList;
    }
    this.situation = "ability";
  }
  // go to the fight state from here
  goToFight() {
    currentChar = frontline;
    // all characters not frontline has their frontline turns reset
    for (let i = 0; i < playersList.length; i++) {
      if (playersList[i].name !== frontline.name) {
        playersList[i].frontlineTurns = 0;
        playersList[i].tired = false;
      }
    }
    // for each enemy, give them a random moveset for the fight sequence
    let highestTime = 0;
    for (let i = 0; i < enemiesList.length; i++) {
      let moveset = random(enemiesList[i].abilities);
      enemiesList[i].currentAbility = moveset;
      // set the timers for enemy shoot bullets depending on ability

      if (enemiesList[i].currentAbility.timer > highestTime) {
        highestTime = enemiesList[i].currentAbility.timer;
      }
      // if line then set it here
      if (enemiesList[i].currentAbility.moves === "line")  {
        enemiesList[i].angle = random(0, 360);
      }
      let currentAbilityEffects = enemiesList[i].currentAbility.effects;
      for (let i2 = 0; i2 < currentAbilityEffects.length; i2++) {
        let whichEnemy = enemiesList[i];
        let whichEffectNumber = i2;
        let whichAbility = whichEnemy.currentAbility;
        let theLoopRate = whichAbility.loopRate[whichEffectNumber];
        let enemyShootLoop = setInterval(() => {
          if (whichEnemy.hp > 0) {
            shootBullets(whichEnemy.currentAbility.effects[whichEffectNumber], whichAbility);
          } else {
            clearInterval(enemyShootLoop);
          }
        }, theLoopRate);
        intervalsList.push(enemyShootLoop);
      }
    }
    // set timer for both player and enemy sprites moving
    frontline.currentImage = frontline.images.left;
    let playerImageTimer = setInterval(function() {
      if (frontline.currentImage === frontline.images.left) {
        frontline.currentImage = frontline.images.right;
      } else if (frontline.currentImage === frontline.images.right) {
        frontline.currentImage = frontline.images.left;
      }
    }, 500);
    intervalsList.push(playerImageTimer);
    for (var i = 0; i < enemiesList.length; i++) {
      enemiesList[i].currentImage = enemiesList[i].images.left;
      let thisEnemy = enemiesList[i];
      let enemyImageTimer = setInterval(() => {
        if (thisEnemy.currentImage === thisEnemy.images.left) {
          thisEnemy.currentImage = thisEnemy.images.right;
        } else if (thisEnemy.currentImage === thisEnemy.images.right) {
          thisEnemy.currentImage = thisEnemy.images.left;
        }
      }, 500);
      intervalsList.push(enemyImageTimer);
    }
    // set timer for going back to plan state
    fightTime = highestTime;
    currentFightTime = 0;
    fightTimer = setInterval(function() {
      currentFightTime++;
      console.log(currentFightTime);
      if (currentFightTime/100 >= fightTime) {
        console.log("go back");
        fightToPlan();
      }
    }, 10);
    intervalsList.push(fightTimer);
    whichScreen = FIGHT_STATE;
  }
  // what text appears in the dialog, in order of importance (least-most) - ready - enemy almost dead - refreshed - ultimate ready - tired - almost dead
  dialogContent() {
    // if tutorial is no longer active, give dialog based on most important thing player needs to know
    if (tutorial === false) {
      // if chars are ready to act (nothing special happening)
        let allCharsNames = "";
          for (var i = 0; i < playersList.length; i++) {
            if (allCharsNames === "") {
              allCharsNames = allCharsNames.concat(playersList[i].name);
            } else {
              allCharsNames = allCharsNames.concat(" and ", playersList[i].name);
            }
          }
        currentDialogText = allCharsNames + ": I am ready to move!";
      // if an enemy is almost dead
      let lowestHealthEnemy;
      for (var i = 0; i < enemiesList.length; i++) {
          if (enemiesList[i].hp < enemiesList[i].maxHp/5) {
            if (lowestHealthEnemy === undefined) {
              lowestHealthEnemy = enemiesList[i];
            } else {
              if (enemiesList[i].hp < lowestHealthEnemy.hp) {
                lowestHealthEnemy = enemiesList[i];
              }
            }
          currentDialogText = "Nuts: " + lowestHealthEnemy.name + "'s health is low! Press the attack!";
        }
      }
      // if a / many friendly character{s} is / are refreshed
      let refreshedChars = [];
      for (var i = 0; i < playersList.length; i++) {
          if (playersList[i].refreshed === true) {
            refreshedChars.push(playersList[i].name);
          }
        }
      if (refreshedChars.length > 0) {
        let refreshedCharNames = "";
          for (var i = 0; i < refreshedChars.length; i++) {
            if (refreshedCharNames === "") {
              refreshedCharNames = refreshedCharNames.concat(refreshedChars[i]);
            } else {
              refreshedCharNames = refreshedCharNames.concat(" and ", refreshedChars[i]);
            }
          }
        currentDialogText = refreshedCharNames + ": I am energized and refreshed! I will do great this turn!";
      }
      // if a friendly char has their ultimate ready
      let hasUltChars = [];
      for (var i = 0; i < playersList.length; i++) {
          if (playersList[i].ultCharge === 100) {
            hasUltChars.push(playersList[i].name);
          }
        }
      if (hasUltChars.length > 0) {
        let hasUltCharNames = "";
          for (var i = 0; i < hasUltChars.length; i++) {
            if (hasUltCharNames === "") {
              hasUltCharNames = hasUltCharNames.concat(hasUltChars[i]);
            } else {
              hasUltCharNames = hasUltCharNames.concat(" and ", hasUltChars[i]);
            }
          }
        currentDialogText = hasUltCharNames + ": My ultimate ability is ready! Let me unleash true power!";
      }
      // if a friendly char is tired
      let tiredChars = [];
      for (var i = 0; i < playersList.length; i++) {
          if (playersList[i].tired === true) {
            tiredChars.push(playersList[i].name);
          }
        }
      if (tiredChars.length > 0) {
        let tiredCharNames = "";
          for (var i = 0; i < tiredChars.length; i++) {
            if (tiredCharNames === "") {
              tiredCharNames = tiredCharNames.concat(tiredChars[i]);
            } else {
              tiredCharNames = tiredCharNames.concat(" and ", tiredChars[i]);
            }
          }
        currentDialogText = tiredCharNames + ": I am tired! Select another character to be the frontline for better performance!";
      }
      // if a friendly char is near death
      let lowestHealthChar;
      for (var i = 0; i < playersList.length; i++) {
          if (playersList[i].hp < playersList[i].maxHp/5) {
            if (lowestHealthChar === undefined) {
              lowestHealthChar = playersList[i];
            } else {
              if (playersList[i].hp < lowestHealthChar.hp) {
                lowestHealthChar = playersList[i];
              }
            }
          currentDialogText = lowestHealthChar.name + ":" + " My health is low! Heal me and / or pick another frontline!";
        }
      }
    } else {
      // if still in tutorial, show tutorial text
      currentDialog = TUTORIAL_TEXT;
      currentDialogText = currentDialog[currentDialogNumber];
    }
  }
  // when a key is pressed
  keyDown() {
    // if is ctrl, shift or space, set the current ability to the ability that
    // is assigned to that key, if already activated, then clicking will cancel it
    // if (currentKeyPressed === 32 || currentKeyPressed === 16 || currentKeyPressed === 17) {
    //   if (currentCombatAbilityKey !== currentKeyPressed) {
    //     if (this.situation === "choose") {
    //       this.setAbility();
    //     } else if (this.situation === "ability") {
    //       currentAbility = 0;
    //       this.situation = "shoot";
    //       this.setAbility();
    //     }
    //   } else if (currentCombatAbilityKey === currentKeyPressed) {
    //     currentAbility = 0;
    //     this.situation = "shoot";
    //     currentCombatAbilityKey = "none";
    //   }
    // }
  }
}
