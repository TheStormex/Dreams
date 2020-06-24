"use strict";

/********************************************************************

The Last Hacktivists
Che Tan

Two brave hacktivists broke into the system of the mega corporation
in control of everyone's information! Can they defeat the system's guards
and free the world from tyranny?
*********************************************************************/

// constants
// dialogue given by the hacker characters as tutorial
const TUTORIAL_TEXT = [
  "Bolt: Hey! Here you are!",
  "Nuts: We've been waiting for you!",
  "Bolt: It is time to finish this!",
  "Nuts: OmniSyt is going down today!",
  "Bolt: Let's help you get familiar with the interface!",
  "Nuts: You can see the AVATARS of the two enemies on top and us under them,",
  "Nuts: On the very bottom you can see our stats and abilities.",
  "Bolt: Switch between which one of us you see by hovering your mouse over our AVATARS.",
  "Bolt: You can see our stats: HEALTH, ENERGY and ULT CHARGE.",
  "Nuts: If our HEALTH hits 0, we get disconnected! Make sure that does not happen!",
  "Nuts: On the other hand, our goal is to make the enemies' HEALTH hit 0!",
  "Bolt: Our ENERGY is used to activate abilities, we get some ENERGY at the beginning of every turn.",
  "Bolt: You can see which turn we are on at the bottom-left corner of your screen.",
  "Bolt: A turn goes like so: you choose if any of us uses our SUPPORT ABILITIES you see down there in this PLAN STATE,",
  "Bolt: We can only use each of our SUPPORT ABILITIES once per turn.",
  "Bolt: Afterwards, you press the Fight! button to enter FIGHT STATE so we can destroy the enemies!",
  "Nuts: In the FIGHT STATE, you control one of us, the FRONTLINE that you have chosen. At the moment, Bolt is the frontline.",
  "Nuts: You use left click on the mouse to shoot at the enemies and WASD to move around.",
  "Nuts: Avoid enemies and their bullets, you can also press CTRL, SPACEBAR and SHIFT to activate COMBAT ABILITIES",
  "Nuts: After using a COMBAT ABILITY, it goes on cooldown so you'll have to wait before using it again.",
  "Nuts: When the bar above the stats reaches full, you go back to PLAN STATE and do it over again",
  "Bolt: If any of us did not use any abilities for a turn, we become REFRESHED, becoming stronger that turn and getting more ENERGY.",
  "Bolt: If any of us is frontline for more than 2 turns and used abilities, we become TIRED, so switch between which one of us being the frontline often!",
  "Nuts: All buffs and debuffs to our incoming and outgoing damage lasts for one turn, the same goes for the enemies.",
  "Nuts: Using SUPPORT and COMBAT abilities as well as hitting enemies with bullets increase our ULT CHARGE.",
  "Bolt: Once one of our ULT CHARGE is at 100%, click on our ULTIMATE ABILITY to use it. Mine is a COMBAT ABILITY while Nuts' is a SUPPORT ABILITY.",
  "Nuts and Bolt: All right! If you are ready, press Finish Tutorial to begin our quest!"
];

const ENDING_SCREEN_TITLE = [
  "Victory for the Hacktivists!",
  "Defeat of the Hacktivists!"
];

const ENDING_SCREEN_TEXT = [
  "We won! The future of information is saved!",
  "We lost! There is no hope against OmniSyt anymore... is there?"
];

let currentDialog = TUTORIAL_TEXT;
let currentDialogNumber = 0;
let currentDialogText;
// sounds for P5 part
let A_CHAR_DEATH;
let A_BOLT_BASIC;
let A_NUTS_BASIC;
let A_AGENT_BULLET;
let A_HIT_PLAYER;
let A_HIT_ENEMY;
let A_SERPENT_BULLET;
let A_SUPPORT;
let A_COMBAT;
let A_SUPPORT_ULT;
let A_COMBAT_ULT;
// images for P5 part
let S_BOLT_BULLET_BASIC;
let S_BOLT_FACE;
let S_BOLT_FRONT;
let S_BOLT_LEFT;
let S_BOLT_RIGHT;
let S_NUTS_BULLET_BASIC;
let S_NUTS_FACE;
let S_NUTS_FRONT;
let S_NUTS_LEFT;
let S_NUTS_RIGHT;
let S_AGENT_FRONT;
let S_AGENT_LEFT;
let S_AGENT_RIGHT;
let S_AGENT_BULLET;
let S_SERPENT_FRONT;
let S_SERPENT_LEFT;
let S_SERPENT_RIGHT;
let S_SERPENT_BULLET;
let S_LOGIC_BOMB;
let S_LOGIC_BOMB_EXPLOSION;
let S_BACK_DOOR;
let S_BEAM;
let S_DDOS;
let S_BRUTE_FORCE;
let S_LOGO;
let S_NAME;
// images for jquery part
const S_OMNISYT_LOGO = 0;

const PLAN_STATE = new PlanState();
const FIGHT_STATE = new FightState();

// framecount
let framecount = 0;

// variables
let frontline = "bolt";
let currentChar;
let whichScreen;
let winLose;
// players and enemy objects
// players
let main;
let roller;
let zaria;
let grandma;
// enemies
let wallraiser;
let bigBully;
let twistedClock;
let cardImp;

let boltImages;
let nutsImages;
let serpentImages;
let agentImages;

// arrays
let enemiesList = [];
let playersList = [];

let timeoutsList = [];
let intervalsList = [];
let soundsList = [];

// how many turns has past
let turns = 1;

// if the beginning tutorial is past yet
let tutorial = true;

// if the game has started
let gameStarted = false;

// bullets characteristics
// (speed, angle, moveType, targets, effects, size, changes, image, wall, ifHit, timer)
// speed and size = % of screen
// change: what to change, how much to change total %, how long should it take to finish the change
// change for spawn = spawn, what tp spawn, what can cause the spawn (time, hit) if time, then how long; if hit, then hit what
// basic attacks
let pro_p_main_basic = new BulletStats(1.2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 3, [], "to be set", "to be set", "done", ["done", "nothing"], 250);
let pro_p_roller_basic = new BulletStats(2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
let pro_p_zaria_basic = new BulletStats(2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
let pro_p_grandma_basic = new BulletStats(2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
// abilities
let pro_p_logicBomb = new BulletStats(0.6, "origin", "straight", "enemies", [["damage", 40]], 8, [["speed", -100, 1500]], "to be set", "to be set", "done", ["done", "nothing"], 150);
let pro_p_backdoor = new BulletStats(0, "origin", "stay", "enemies", [["damage", 10]], 2, [["size", -100, 2000]], "to be set", "to be set", "done", ["done", "nothing"], 150);
let pro_p_ult_bitRotWorm = new BulletStats(2, "origin", "straight", "enemies", [["damage", 5]], 5, [], "to be set", "to be set", "done", ["through", "nothing"], 150);
let pro_p_DDOS = new BulletStats(1, "origin", "straight", "enemies", [["damage", 2], ["stun", 500]], 6, [], "to be set", "to be set", "done", ["through", "nothing"], 150);
let pro_p_bruteForce = new BulletStats(1, "angles", "straight", "enemies", [["damage", 8]], 2, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
// enemy bullets
// agent
let pro_e_agentBullet = new BulletStats(0.8, "towards", "straight", "players", [["damage", 5]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 250);
let pro_e_serpentBullet = new BulletStats(0.4, "towards", "straight", "players", [["damage", 8]], 2, [], "to be set", "to be set", "done", ["done", "nothing"], 250);



// nuts and bolt's abilities and effects
let ab_logicBomb_effect = new AbilityEffect("bullet", "", 1, pro_p_logicBomb, false, false, 0, 1);
let ab_logicBomb = new PlayerAbility("Logic Bomb", 2, [ab_logicBomb_effect], "Throw a projectile", 32, "none", false, [[5, "hit"]], 1.5);
let ab_backdoor_effect = new AbilityEffect("bullet", "", 5, pro_p_backdoor, false, false, 20, 1);
let ab_backdoor_effect2 = new AbilityEffect("dash", "", 3, "", false, false, 0, 0);
let ab_backdoor = new PlayerAbility("Backdoor", 1, [ab_backdoor_effect, ab_backdoor_effect2], "Dash and leave behind dust", 32, "none", false, [[5, "hit"], [2, "use"]], 1);
let ab_cleanupProtocol_effect = new AbilityEffect("heal", "players", 60, "", false, false, 0, 0);
let ab_cleanupProtocol = new PlayerAbility("Cleanup Protocol",  3, [ab_cleanupProtocol_effect], "Heal 60 HP to a friendly character", 32, "none", false, [[5, "use"], [10, "heal"]], 0);
let ab_signalBoost_effect = new AbilityEffect("ramp", "players", 5, "", false, false, 0, 0);
let ab_signalBoost = new PlayerAbility("Signal Boost", 4, [ab_signalBoost_effect], "Give 5 energy to a friendly character", 32, "none", false, [[10, "use"]], 0);
let ab_ult_bitRotWorm_effect = new AbilityEffect("bullet", "", 20, pro_p_ult_bitRotWorm, false, false, 100, 1);
let ab_ult_bitRotWorm = new PlayerAbility("Bitrot Worm", 0, [ab_ult_bitRotWorm_effect], "Shoot a powerful beam", 32, "none", true, [[5, "hit"]], 0);
let ab_firewall_effect = new AbilityEffect("defense_up", "players", 25, "", false, false, 0);
let ab_firewall = new PlayerAbility("Firewall", 3, [ab_firewall_effect], "Increase defense by 25% to a friendly character", 32, "none", false, [[10, "use"]], 0);
let ab_targetExploits_effect = new AbilityEffect("defense_down", "enemies", 25, "", false, false, 0, 0);
let ab_targetExploits = new PlayerAbility("Target Exploits", 3, [ab_targetExploits_effect], "Decrease defense by 25% to an enemy character", 32, "none", false, [[10, "use"]], 0);
let ab_DOOS_effect = new AbilityEffect("bullet", "", 1, pro_p_DDOS, false, false, 0, 1);
let ab_DDOS = new PlayerAbility("DDoS", 2, [ab_DOOS_effect], "Stun enemies hit for 0.5 seconds", 32, "none", false, [[5, "hit"]], 1);
let ab_bruteForce_effect = new AbilityEffect("bullet", "", 2, pro_p_bruteForce, false, false, 100, 10);
let ab_bruteForce_effect2 = new AbilityEffect("dash", "", 3, "", false, false, 0, 0);
let ab_bruteForce = new PlayerAbility("Brute Force Attack", 1, [ab_bruteForce_effect, ab_bruteForce_effect2], "Dash and shoot around you", 32, "none", false, [[5, "hit"], [2, "use"]], 1);
let ab_ult_vpn_effect = new AbilityEffect("offense_up", "players", 80, "", false, true, 0, 0);
let ab_ult_vpn = new PlayerAbility("Activate VPN", 0, [ab_ult_vpn_effect], "Increase offence by 80% to all friendly characters", 32, "none", true, [[0, "use"]], 0);

// the ability that is being activated right now
let currentAbility;

// keycodes:
// w - 87 / a - 65/ s - 83/ d - 68 / space -32 / shift - 16 / control - 17
// buttons to press for each combat ability and the keycode
let combatButtons = [["Space", 32], ["Shift", 16], ["Ctrl", 17]];

// enemies abilities
// let ab_e_wallStraight = new EnemyAbility("", "", "");
// let ab_e_inOut = new EnemyAbility("", "", "");
let ab_e_agent_shoot_effect = new AbilityEffect("bullet", "", 4, pro_e_agentBullet, false, false, 200, 1);
let ab_e_agent_spread_effect = new AbilityEffect("bullet", "", 3, pro_e_agentBullet, false, false, 300, 2);
let ab_e_agent_explode_effect = new AbilityEffect("bullet", "", 1, pro_e_agentBullet, false, false, 0, 8);
let ab_e_agent_shoot = new EnemyAbility("noise", [ab_e_agent_shoot_effect], [1500], "walls", 10);
let ab_e_agent_spread = new EnemyAbility("noise", [ab_e_agent_spread_effect], [1800], "through", 10);
let ab_e_agent_explode = new EnemyAbility("line", [ab_e_agent_explode_effect], [2000], "walls", 10);
let ab_e_serpent_shoot_effect = new AbilityEffect("bullet", "", 2, pro_e_serpentBullet, false, false, 500, 3);
let ab_e_serpent_gatling_effect = new AbilityEffect("bullet", "", 6, pro_e_serpentBullet, false, false, 100, 1);
let ab_e_serpent_wave_effect = new AbilityEffect("bullet", "", 1, pro_e_serpentBullet, false, false, 0, 6);
let ab_e_serpent_shoot = new EnemyAbility("line", [ab_e_serpent_shoot_effect], [1800], "through", 8);
let ab_e_serpent_wave = new EnemyAbility("line", [ab_e_serpent_wave_effect], [1800], "walls", 8);
let ab_e_serpent_gatling = new EnemyAbility("noise", [ab_e_serpent_gatling_effect], [1800], "through", 8);

let projectilesList = [];

let mouseOver = 0;
let currentKeyPressed = 0;
let currentCombatAbilityKey = 0;
let gameScreen;

// how long until go back to plan state from fight
let fightTimer;
let fightTime = 0;
let currentFightTime = 0;

// to prevent sound from overlapping
let sfxTimer;


$(document).ready(start);

function start() {
}

// p5 preload, load image sprites
function preload() {
  S_BOLT_BULLET_BASIC = loadImage(`assets/images/bolt_basicBullet.png`);
  S_BOLT_FACE = loadImage(`assets/images/bolt_face.png`);
  S_BOLT_FRONT = loadImage(`assets/images/bolt_front.png`);
  S_BOLT_LEFT = loadImage(`assets/images/bolt_left.png`);
  S_BOLT_RIGHT = loadImage(`assets/images/bolt_right.png`);
  S_NUTS_BULLET_BASIC = loadImage(`assets/images/nuts_basicBullet.png`);
  S_NUTS_FACE = loadImage(`assets/images/nuts_face.png`);
  S_NUTS_FRONT = loadImage(`assets/images/nuts_front.png`);
  S_NUTS_LEFT = loadImage(`assets/images/nuts_left.png`);
  S_NUTS_RIGHT = loadImage(`assets/images/nuts_right.png`);
  S_AGENT_FRONT = loadImage(`assets/images/agent.png`);
  S_AGENT_LEFT = loadImage(`assets/images/agent_left.png`);
  S_AGENT_RIGHT = loadImage(`assets/images/agent_right.png`);
  S_AGENT_BULLET = loadImage(`assets/images/agent_bullet.png`);
  S_SERPENT_FRONT = loadImage(`assets/images/serpent.png`);
  S_SERPENT_LEFT = loadImage(`assets/images/serpent_left.png`);
  S_SERPENT_RIGHT = loadImage(`assets/images/serpent_right.png`);
  S_SERPENT_BULLET = loadImage(`assets/images/serpent_bullet.png`);
  S_LOGIC_BOMB = loadImage(`assets/images/logicBomb.png`);
  S_LOGIC_BOMB_EXPLOSION = loadImage(`assets/images/logicBombExplosion.png`);
  S_BACK_DOOR = loadImage(`assets/images/backdoor.png`);
  S_BEAM = loadImage(`assets/images/beam.png`);
  S_DDOS = loadImage(`assets/images/ddos.png`);
  S_BRUTE_FORCE = loadImage(`assets/images/bruteForce.png`);
  S_LOGO = loadImage(`assets/images/clown.png`);
  S_NAME = loadImage(`assets/images/clown.png`);
}

// p5 setup, load sounds,
function setup() {
  gameScreen = createCanvas(windowWidth, windowHeight);
  gameScreen.style('display', 'none');
  background(100);

  // load sounds
  A_CHAR_DEATH = loadSound(`assets/sounds/a_char_death.wav`);
  soundsList.push(A_CHAR_DEATH);
  A_BOLT_BASIC = loadSound(`assets/sounds/a_bolt_basic.wav`);
  soundsList.push(A_BOLT_BASIC);
  A_NUTS_BASIC = loadSound(`assets/sounds/a_nuts_basic.wav`);
  soundsList.push(A_NUTS_BASIC);
  A_AGENT_BULLET = loadSound(`assets/sounds/a_agent_bullet.wav`);
  soundsList.push(A_AGENT_BULLET);
  A_SERPENT_BULLET = loadSound(`assets/sounds/a_serpent_bullet.wav`);
  soundsList.push(A_SERPENT_BULLET);
  A_HIT_PLAYER = loadSound(`assets/sounds/a_hit_player.wav`);
  soundsList.push(A_HIT_PLAYER);
  A_HIT_ENEMY = loadSound(`assets/sounds/a_hit_enemy.wav`);
  soundsList.push(A_HIT_ENEMY);
  A_SUPPORT = loadSound(`assets/sounds/a_support.wav`);
  soundsList.push(A_SUPPORT);
  A_COMBAT = loadSound(`assets/sounds/a_combat.wav`);
  soundsList.push(A_COMBAT);
  A_SUPPORT_ULT = loadSound(`assets/sounds/a_support_ult.wav`);
  soundsList.push(A_SUPPORT_ULT);
  A_COMBAT_ULT = loadSound(`assets/sounds/a_combat_ult.wav`);
  soundsList.push(A_COMBAT_ULT);

  // add the image to each bullet's image slot and sounds slot
  pro_p_main_basic.images = S_BOLT_BULLET_BASIC;
  pro_p_main_basic.sounds = A_BOLT_BASIC;
  pro_p_roller_basic.images = S_NUTS_BULLET_BASIC;
  pro_p_roller_basic.sounds = A_NUTS_BASIC;
  pro_p_zaria_basic.images = S_BOLT_BULLET_BASIC;
  pro_p_zaria_basic.sounds = A_BOLT_BASIC;
  pro_p_grandma_basic.images = S_NUTS_BULLET_BASIC;
  pro_p_grandma_basic.sounds = A_NUTS_BASIC;
  pro_p_logicBomb.images = S_LOGIC_BOMB;
  pro_p_logicBomb.sounds = A_COMBAT;
  pro_p_backdoor.images = S_BACK_DOOR;
  pro_p_backdoor.sounds = A_COMBAT;
  pro_p_ult_bitRotWorm.images = S_BEAM;
  pro_p_ult_bitRotWorm.sounds = A_COMBAT_ULT;
  pro_p_DDOS.images = S_DDOS;
  pro_p_DDOS.sounds = A_COMBAT;
  pro_p_bruteForce.images = S_BRUTE_FORCE;
  pro_p_bruteForce.sounds = A_COMBAT;
  // enemy bullets
  // agent
  pro_e_agentBullet.images = S_AGENT_BULLET;
  pro_e_agentBullet.sounds = A_AGENT_BULLET;
  pro_e_serpentBullet.images = S_SERPENT_BULLET;
  pro_e_serpentBullet.sounds = A_SERPENT_BULLET;

  initialisation();
}

// p5 draw
function draw() {
  clear();
  if (gameStarted === true) {
    checkAliveAll();
    whichScreen.draw();
    framecount++;
  }
  // console.log(framecount);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// draw current character name, head, health bar, energy, ult charge if there is one
function drawCommonUI() {
  if (currentChar != "none") {
    push();
    // make the menu box
    rectMode(CENTER, CENTER);
    noStroke();
    fill(255);
    rect(width/2, height-height/6, width, height/3);
    // name of char, health bar, energy, ult charge
    textSize(width/30+height/60);
    textAlign(CENTER);
    fill(0);
    // name
    text(currentChar.name, width/20, height-height/4);
    fill(255);
    strokeWeight(5);
    stroke(0);
    // health bar
    rect(width/2.8, height-height/3.63, width/2, height/20);
    noStroke();
    fill(255, 0 , 0);
    rectMode(CORNER);
    let healthBarLength = map(currentChar.hp, 0, currentChar.maxHp, 0, width/2);
    rect(width/2.8-width/4, height-height/3.63-height/40, healthBarLength, height/20);
    // health text
    fill(0);
    let healthText = currentChar.hp + " " + "/" + " " + currentChar.maxHp;
    textAlign(CENTER, CENTER);
    textSize(width/70+height/100);
    text(healthText, width/3, height-height/3.63);
    // energy
    let energyText = "Energy: " + currentChar.energy + "/" + currentChar.maxEnergy;
    fill(0);
    textSize(width/80+height/60)
    text(energyText, width-width/3.2, height-height/3.6);
    // ult charge
    let ultChargeText = "Ult Charge: " + currentChar.ultCharge + "%";
    text(ultChargeText, width-width/8, height-height/3.6);
    // character head image
    imageMode(CENTER, CENTER);
    image(currentChar.images.face, width/18, height-height/7, width/10, height/6);
    // how many turns has passed
    let turnsText = "Turn " + turns;
    text(turnsText, width/18, height-height/30);
    pop();
  } else {
    currentChar = playersList[0];
  }
}

// when returning to PlanState, give player characters new energy, if a character has not moved, they gain bonus energy
// reset the buffs and debuffs of all characters
function newTurn() {
  // the frontline who fought last turn gets 1 more turn as frontline, if too many, then they are now fatigued
  // if was frontline, then cannot have refreshed
  if (turns > 1) {
    frontline.frontlineTurns++;
    frontline.refreshed = false;
    if (frontline.frontlineTurns >= 3 && frontline.acted === true) {
      frontline.tired = true;
    }
  }
  for (let i = 0; i < playersList.length; i++) {
    // reset stat changes
    playersList[i].offenseChange = 0;
    playersList[i].defenseChange = 0;
    // if a player character did not use any abilities last turn, it gains refreshed this turn
    if (playersList[i].acted === false) {
      // if not the first turn, give the characters refreshed buff
      if (turns > 1) {
        playersList[i].energyBoost = 3;
        playersList[i].offenseChange = 10;
        playersList[i].defenseChange = 10;
        playersList[i].refreshed = true;
      }
    } else if (playersList[i].acted === true) {
      playersList[i].energyBoost = 0;
      playersList[i].refreshed = false;
    }
    // if the frontline is tired, get debuffs
    if (frontline.tired === true) {
      frontline.offenseChange = -10;
      frontline.defenseChange = -10;
    }
    playersList[i].energy += playersList[i].energyTurn + playersList[i].energyBoost;
    playersList[i].energy = constrain(playersList[i].energy, 0, playersList[i].maxEnergy);
    playersList[i].acted = false;
    // all abilities are no used yet
    for (let i2 = 0; i2 < playersList[i].abilities[0].length; i2++) {
      playersList[i].abilities[0][i2].used = false;
    }
  }
  for (let i = 0; i < enemiesList.length; i++) {
    enemiesList[i].offenseChange = 0;
    enemiesList[i].defenseChange = 0;
  }
}

// check if all enemies and players are alive if all dead of 1 type, go to game end screen
function checkAliveAll() {
  for (let i = 0; i < enemiesList.length; i++) {
    if (enemiesList[i].hp <= 0) {
      enemiesList.splice(i, 1);
      A_CHAR_DEATH.play();
    }
  }
  for (let i = 0; i < playersList.length; i++) {
    if (playersList[i].hp <= 0) {
      if (playersList.length > 1) {
        if (currentChar.name === playersList[i].name) {
          currentChar = playersList[(i+1)%playersList.length];
        }
        // if we are in fight state, then if the frontline dies, go back to Plan state
        if (frontline.name === playersList[i].name && whichScreen === FIGHT_STATE) {
          // if this is the last player character
          if (playersList.length <= 1) {
            winLose = "lose";
            endGame();
          } else if (playersList.length > 1) {
            fightToPlan();
          }
        }
        if (frontline.name === playersList[i].name) {
          frontline = playersList[(i+1)%playersList.length];
        }
      }
      playersList.splice(i, 1);
      A_CHAR_DEATH.play();
    }
  }
  if (enemiesList.length <= 0 && gameStarted === true) {
    winLose = "win";
    endGame()
  }
  if (playersList.length <= 0 && gameStarted === true) {
    winLose = "lose";
    endGame();
  }
}

// go from the fight state to the plan state
function fightToPlan() {
  for (let i = 0; i < intervalsList.length; i++) {
      clearInterval(intervalsList[i]);
  }
  for (let i = 0; i < enemiesList.length; i++) {
    enemiesList[i].currentImage = enemiesList[i].images.front;
  }
  for (let i = 0; i < playersList.length; i++) {
    playersList[i].currentImage = playersList[i].images.front;
  }
  projectilesList = [];
  for (var i = 0; i < soundsList.length; i++) {
      soundsList[i].stop();
  }
  turns++;
  newTurn();
  whichScreen = PLAN_STATE;
}

// create bullets to shoot
function shootBullets(effect, ability) {
  let theEffect = effect;
  let theAbility = ability;
  let howManyShots = theEffect.amount;
  let howManyBulletsPerShot = theEffect.perDelay;
  let shotsCount = 0;
  // create timer that creates every shot of bullets
  let allBulletSpawnTimer = setInterval(() => {
    for (let i = 0; i < howManyBulletsPerShot; i++) {
      // set the angle of the new bullet
      let angleOfBullet;
      switch (theEffect.bullet.angle) {
        case "origin":
          angleOfBullet = theAbility.user.angle;
          break;
        case "random":
          angleOfBullet = random(0, 2*PI);
          break;
        case "angles":
          angleOfBullet = ((PI*2)/howManyBulletsPerShot)*i;
          break;
        case "towards":
        // for the enemy to aim at the player
          let angleTowardsTarget;
          let side1 = frontline.x-theAbility.user.x;
          let side2 = frontline.y-theAbility.user.y;
          angleTowardsTarget = atan(side2/side1);
          if (side1 <= 0) {
            angleTowardsTarget += PI;
          }
          angleOfBullet = random(angleTowardsTarget-PI/4, angleTowardsTarget+PI/4);
        default:
      }
      let newAbilityBullet = new Bullet(theAbility.user, theAbility.user.x, theAbility.user.y, width*(theEffect.bullet.speed/2)/100+height*(theEffect.bullet.speed/2)/100, angleOfBullet, theEffect.bullet.moveType, theEffect.bullet.targets, theEffect.bullet.effects, width*(theEffect.bullet.size/2)/100+height*(theEffect.bullet.size/2)/100, theEffect.bullet.changes, theEffect.bullet.images, theEffect.bullet.sounds, theEffect.bullet.wall, theEffect.bullet.ifHit, theEffect.bullet.timer);
      newAbilityBullet.sounds.play();
      // start the interval for changes of each bullet
      for (let i = 0; i < newAbilityBullet.changes.length; i++) {
        let timePerLoop = 10;
        let whichChange;
        switch (newAbilityBullet.changes[i][0]) {
          case "size":
            // total change / miliseconds
            let bulletSizeChange = (newAbilityBullet.changes[i][1]*newAbilityBullet.size/100)/(newAbilityBullet.changes[i][2]/10);
            let bulletSizeTarget =  newAbilityBullet.size + newAbilityBullet.changes[i][1]*newAbilityBullet.size/100;
            let bulletSizeTimeCount = 0;
             whichChange = i;
            let bulletSizeInterval = setInterval(() => {
              // change the bullet's size
              newAbilityBullet.size += bulletSizeChange;
              bulletSizeTimeCount++;
              // if time reaches max, clear timer
              if (newAbilityBullet.changes[whichChange][2] / bulletSizeTimeCount <= timePerLoop) {
                clearInterval(bulletSizeInterval);
              }
              // if reach target, stop timer
              if (newAbilityBullet.changes[whichChange][1] > 0) {
                if (newAbilityBullet.size >= bulletSizeTarget) {
                  clearInterval(bulletSizeInterval);
                }
              } else if (newAbilityBullet.changes[whichChange][1] < 0) {
                if (newAbilityBullet.size <= bulletSizeTarget) {
                  clearInterval(bulletSizeInterval);
                }
              }
              // if bullet would be too small, finish timer
              if (newAbilityBullet.size <= 0) {
                let index = projectilesList.indexOf(this);
                projectilesList.splice(index, 1);
                clearInterval(bulletSizeInterval);
              }

            }, timePerLoop);
            break;
          case "speed":
            // total change / miliseconds
            let bulletSpeedChange = (newAbilityBullet.changes[i][1]*newAbilityBullet.speed/100)/(newAbilityBullet.changes[i][2]/10);
            let bulletSpeedTarget =  newAbilityBullet.speed + newAbilityBullet.changes[i][1]*newAbilityBullet.speed/100;
            let bulletSpeedTimeCount = 0;
            let timePerSpeedLoop = 10;
            whichChange = i;
            let bulletSpeedInterval = setInterval(() => {
              // change the bullet's size
              newAbilityBullet.speed += bulletSpeedChange;
              bulletSpeedTimeCount++;
              // if time reaches max, clear timer
              if (newAbilityBullet.changes[whichChange][2] / bulletSpeedTimeCount <= timePerSpeedLoop) {
                clearInterval(bulletSpeedInterval);
              }
              // if reach target, stop timer
              if (newAbilityBullet.changes[whichChange][1] > 0) {
                if (newAbilityBullet.speed >= bulletSpeedTarget) {
                  clearInterval(bulletSpeedInterval);
                }
              } else if (newAbilityBullet.changes[whichChange][1] < 0) {
                if (newAbilityBullet.speed <= bulletSpeedTarget) {
                  clearInterval(bulletSpeedInterval);
                }
              }
              // if bullet would be too small, finish timer
              if (newAbilityBullet.speed <= 0) {
                clearInterval(bulletSpeedInterval);
              }

            }, timePerLoop);
            break;
          case "spawn":
            // for (let i3 = 0; i3 < newAbilityBullet.changes[i].length; i++) {
            //   let newSpawnBulletStats = newAbilityBullet.changes[i][1];
            //   let newSpawnedBullet = new Bullet(theAbility.user, newAbilityBullet.x, newAbilityBullet.y, width*(newSpawnBulletStats.speed/2)/100+height*(newSpawnBulletStats.speed/2)/100, newAbilityBullet.angle, newSpawnBulletStats.moveType, newSpawnBulletStats.targets, newSpawnBulletStats.effects, width*(newSpawnBulletStats.size/2)/100+height*(newSpawnBulletStats.size/2)/100, newSpawnBulletStats.changes, newSpawnBulletStats.images, newSpawnBulletStats.sounds, newSpawnBulletStats.wall, newSpawnBulletStats.ifHit, newSpawnBulletStats.timer);
            //   projectilesList.push(newSpawnedBullet);
            //   newSpawnedBullet.sounds.play();
            // }
            break;
          default:
        }
      }
      projectilesList.push(newAbilityBullet);
    }
    shotsCount++;
    if (shotsCount >= howManyShots) {
      clearInterval(allBulletSpawnTimer);
    }
  }, theEffect.delay);
  intervalsList.push(allBulletSpawnTimer);
}

// end the game
function endGame() {
  gameStarted = false;
  playersList.length = 0;
  enemiesList.length = 0;
  projectilesList.length = 0;
  timeoutsList.length = 0;
  intervalsList.length = 0;
  for (var i = 0; i < soundsList.length; i++) {
    if (soundsList[i].isPlaying()) {
      soundsList[i].stop();
    }
  }
  soundsList.length = 0;
  gameScreen.style('display', 'none');
  $(`#endScreen`).css(`display`, 'block');
  let endingScreenParts;
  if (winLose === "win") {
    endingScreenParts = 0;
  } else if (winLose === "lose") {
    endingScreenParts = 1;
  }
  console.log(endingScreenParts);
  $(`#endingTitle`).text(ENDING_SCREEN_TITLE[endingScreenParts]);
  $(`#endingText`).text(ENDING_SCREEN_TEXT[endingScreenParts]);
}

// p5 mouse is pressed
function mousePressed() {
  if (tutorial === false && gameStarted === true) {
    whichScreen.mouseDown();
  }
}

// p5 key is pressed
function keyPressed() {
  if (tutorial === false && gameStarted === true) {
    currentKeyPressed = keyCode;
    whichScreen.keyDown();
  }
}

// begin the game
function startGame() {
  gameStarted = true;
  $(`#startScreen`).css(`display`, `none`);
    gameScreen.style('display', 'block');
  $(`#dialogBox`).css('display', 'block');
  currentDialogNumber = 0;
}

// last dialog
function previousDialog() {
  currentDialogNumber -= 1;
  currentDialogNumber = constrain(currentDialogNumber, 0, currentDialog.length-1);
}

// next dialog
function nextDialog() {
  currentDialogNumber += 1;
  currentDialogNumber = constrain(currentDialogNumber, 0, currentDialog.length-1);
}

// skip tutorial
function skipDialog() {
  tutorial = false;
  $(`#skipButton`).css(`display`, `none`);
  $(`#previousButton`).css(`display`, `none`);
  $(`#nextButton`).css(`display`, `none`);
}

// restart game
// function restart() {
//   console.log("restart");
//   $(`#endScreen`).css(`display`, 'none');
//   $(`#endingTitle`).css(`display`, 'none');
//   $(`#endingText`).css(`display`, 'none');
//   turns = 1;
//   tutorial = true;
//   gameStarted = false;
//   currentDialogNumber = 0;
//   mouseOver = 0;
//   currentKeyPressed = 0;
//   currentCombatAbilityKey = 0;
//   fightTime = 0;
//   currentFightTime = 0;
//   $(`#startScreen`).css(`display`, `block`);
//   $(`#skipButton`).css(`display`, `inline-block`);
//   $(`#previousButton`).css(`display`, `inline-block`);
//   $(`#nextButton`).css(`display`, `inline-block`);
//   initialisation();
// }

// reset all stats
function initialisation() {
  // reset all stats fora new game
  // create the player characters and enemy characters
  // players
  boltImages = new Images(S_BOLT_LEFT, S_BOLT_RIGHT, S_BOLT_FRONT, S_BOLT_FACE);
  main = new Player("Main", 200, 4, 10, [[ab_cleanupProtocol, ab_signalBoost], [ab_logicBomb, ab_backdoor, ab_ult_bitRotWorm]], pro_p_main_basic, boltImages);
  roller = new Player("Roller", 200, 4, 10, [[ab_cleanupProtocol, ab_signalBoost], [ab_logicBomb, ab_backdoor, ab_ult_bitRotWorm]], pro_p_roller_basic, boltImages);
  nutsImages = new Images(S_NUTS_LEFT, S_NUTS_RIGHT, S_NUTS_FRONT, S_NUTS_FACE);
  zaria = new Player("Zaria", 300, 3, 12, [[ab_firewall, ab_targetExploits, ab_ult_vpn], [ab_DDOS, ab_bruteForce]], pro_p_zaria_basic, nutsImages);
  grandma = new Player("Grandma", 300, 3, 12, [[ab_firewall, ab_targetExploits, ab_ult_vpn], [ab_DDOS, ab_bruteForce]], pro_p_grandma_basic, nutsImages);
  // enemies
  agentImages = new Images(S_AGENT_LEFT, S_AGENT_RIGHT, S_AGENT_FRONT, "none");
  wallraiser = new Enemy("Wallraiser", 800, width/20+height/20, 2, [ab_e_agent_shoot, ab_e_agent_spread, ab_e_agent_explode], agentImages);
  for (var i = 0; i < wallraiser.abilities.length; i++) {
    wallraiser.abilities[i].user = wallraiser;
  }
  bigBully = new Enemy("Big Bully", 800, width/20+height/20, 2, [ab_e_agent_shoot, ab_e_agent_spread, ab_e_agent_explode], agentImages);
  for (var i = 0; i < bigBully.abilities.length; i++) {
    bigBully.abilities[i].user = bigBully;
  }
  serpentImages = new Images(S_SERPENT_LEFT, S_SERPENT_RIGHT, S_SERPENT_FRONT, "none");
  twistedClock = new Enemy("Twisted Clock", 1000, width/20+height/20, 4, [ab_e_serpent_shoot, ab_e_serpent_wave, ab_e_serpent_gatling], serpentImages);
  for (var i = 0; i < twistedClock.abilities.length; i++) {
    twistedClock.abilities[i].user = twistedClock;
  }
  serpentImages = new Images(S_SERPENT_LEFT, S_SERPENT_RIGHT, S_SERPENT_FRONT, "none");
  cardImp = new Enemy("Card Imp", 1000, width/20+height/20, 4, [ab_e_serpent_shoot, ab_e_serpent_wave, ab_e_serpent_gatling], serpentImages);
  for (var i = 0; i < cardImp.abilities.length; i++) {
    cardImp.abilities[i].user = cardImp;
  }
  playersList = [main, roller, zaria, grandma];
  enemiesList = [wallraiser, bigBully, twistedClock, cardImp];
// set the number of steps of each ability of each player
  for (let i = 0; i < playersList.length; i++) {
    for (let i2 = 0; i2 <  playersList[i].abilities[0].length; i2++) {
      for (let i3 = 0; i3 < playersList[i].abilities[0][i2].effects.length; i3++) {
        if (playersList[i].abilities[0][i2].effects[i3].step === true) {
          playersList[i].abilities[0][i2].steps++;
        }
      }
    }
  }
  frontline = main;
  currentChar = "none";
  // enter the title state and starts the first turn
  whichScreen = PLAN_STATE;
  newTurn();
}
