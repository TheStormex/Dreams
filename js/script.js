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
  "Test"
];

const ENDING_SCREEN_TITLE = [
  "Victory",
  "Defeat"
];

const ENDING_SCREEN_TEXT = [
  "We won!",
  "We lost!"
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
let S_ROBOT_FACE;
let S_SCREWS_FACE;
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
let bolt;
let nuts;
let screws;
let robot;
// enemies
let serpent;
let serpent2;
let agent;
let agent2;

let boltImages;
let nutsImages;
let screwsImages;
let robotImages;
let serpentImages;
let agentImages;

// arrays
let enemiesList = [];
let playersList = [];

let timeoutsList = [];
let intervalsList = [];
let soundsList = [];

let lingeringAbilities = []

// how many turns has past
let turns = 1;

// if the beginning tutorial is past yet
let tutorial = false;

// if the game has started
let gameStarted = true;

// bullets characteristics
// (speed, angle, moveType, targets, effects, size, changes, image, wall, ifHit, timer)
// speed and size = % of screen
// change: what to change, how much to change total %, how long should it take to finish the change
// change for spawn = spawn, what tp spawn, what can cause the spawn (time, hit) if time, then how long; if hit, then hit what
// basic attacks
let pro_p_nuts_basic = new BulletStats(1.2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 3, [], "to be set", "to be set", "done", ["done", "nothing"], 250);
let pro_p_bolt_basic = new BulletStats(2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
let pro_p_screws_basic = new BulletStats(1.2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 3, [], "to be set", "to be set", "done", ["done", "nothing"], 250);
let pro_p_robot_basic = new BulletStats(2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
// let pro_p_zaria_basic = new BulletStats(2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
// let pro_p_grandma_basic = new BulletStats(2, "origin", "straight", "enemies", [["damage", 10], ["ultCharge", 1]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
// abilities bullets
// nuts
let pro_p_confidenceBoost = new BulletStats(0.6, "origin", "straight", "enemies", [["damage", 2], ["heal", "self", 2]], 8, [], "to be set", "to be set", "done", ["through", "nothing"], 150);
let pro_p_shockwave = new BulletStats(0, "origin", "stay", "enemies", [["damage", 10]], 2, [["size", -100, 2000]], "to be set", "to be set", "done", ["done", "nothing"], 150);
// bolt

// screws
let pro_p_logicBomb = new BulletStats(0.6, "origin", "straight", "enemies", [["damage", 100]], 8, [["speed", -100, 1500]], "to be set", "to be set", "done", ["done", "nothing"], 150);
let pro_p_backdoor = new BulletStats(0, "origin", "stay", "enemies", [["damage", 10]], 2, [["size", -100, 2000]], "to be set", "to be set", "done", ["done", "nothing"], 150);
let pro_p_ult_bitRotWorm = new BulletStats(2, "origin", "straight", "enemies", [["damage", 5]], 5, [], "to be set", "to be set", "done", ["through", "nothing"], 150);
let pro_p_DDOS = new BulletStats(1, "origin", "straight", "enemies", [["damage", 2], ["stun", 1500]], 6, [], "to be set", "to be set", "done", ["through", "nothing"], 150);
let pro_p_bruteForce = new BulletStats(1, "angles", "straight", "enemies", [["damage", 8]], 2, [], "to be set", "to be set", "done", ["done", "nothing"], 150);
// robot

// zaria
// let pro_p_laserBlast = new BulletStats(0.6, "origin", "straight", "enemies", [["damage", 40]], 8, [["speed", -100, 1500]], "to be set", "to be set", "done", ["done", "nothing"], 150);
// let pro_p_lightningBomb = new BulletStats(0, "origin", "stay", "enemies", [["damage", 10]], 2, [["size", -100, 2000]], "to be set", "to be set", "done", ["done", "nothing"], 150);
// let pro_p_ult_deathBeam = new BulletStats(2, "origin", "straight", "enemies", [["damage", 5]], 5, [], "to be set", "to be set", "done", ["through", "nothing"], 150);
// let pro_p_backOff = new BulletStats(0.6, "origin", "straight", "enemies", [["damage", 40]], 8, [["speed", -100, 1500]], "to be set", "to be set", "done", ["done", "nothing"], 150);
// // Grandma
// let pro_p_berate = new BulletStats(0.6, "origin", "straight", "enemies", [["damage", 40]], 8, [["speed", -100, 1500]], "to be set", "to be set", "done", ["done", "nothing"], 150);
// let pro_p_waltz = new BulletStats(0, "origin", "stay", "enemies", [["damage", 10]], 2, [["size", -100, 2000]], "to be set", "to be set", "done", ["done", "nothing"], 150);
// let pro_p_opera = new BulletStats(2, "origin", "straight", "enemies", [["damage", 5]], 5, [], "to be set", "to be set", "done", ["through", "nothing"], 150);
// enemy bullets
// agent
let pro_e_agentBullet = new BulletStats(0.8, "towards", "straight", "players", [["damage", 5]], 1.5, [], "to be set", "to be set", "done", ["done", "nothing"], 250);
let pro_e_serpentBullet = new BulletStats(0.4, "towards", "straight", "players", [["damage", 8]], 2, [], "to be set", "to be set", "done", ["done", "nothing"], 250);



// player abilities and effects
// screws abilities and effects
let ab_protectorsGlare_effect = new AbilityEffect("offense_change", "enemies", -60, "", false, false, 0, 1);
let ab_protectorsGlare = new PlayerAbility("Protector's Glare", 2, [ab_protectorsGlare_effect], "Target enemy gets -60 ATK", 32, "none", false, [[5, "use"]], 0);
let ab_energyRecharge_effect = new AbilityEffect("abilityRenew", "players", 0, "", false, false, 0, 0);
let ab_energyRecharge = new PlayerAbility("Energy Recharge", 2, [ab_energyRecharge_effect], "Target ally's abilities are Renewed", 32, "none", false, [[5, "use"], [10, "heal"]], 0);
let ab_confidenceBoost_effect = new AbilityEffect("bullet", "", 5, pro_p_bruteForce, false, false, 100, 5);
let ab_confidenceBoost = new PlayerAbility("Confidence Boost", 1, [ab_confidenceBoost_effect], "Buff self", 32, "none", false, [[10, "use"]], 1);
let ab_shockwave_effect = new AbilityEffect("bullet", "", 5, pro_p_bruteForce, false, false, 100, 5);
let ab_shockwave = new PlayerAbility("Shockwave",  3, [ab_shockwave_effect], "Damage and knockback enemies", 32, "none", false, [[5, "use"], [5, "hit"]], 0);
let ab_ult_hexcodeDeflector_effect = new AbilityEffect("defense_change", "players", 70, "", false, true, 0, 0);
let ab_ult_hexcodeDeflector = new PlayerAbility("Hexcode Deflector", 0, [ab_ult_hexcodeDeflector_effect], "All allies get +70 DEF", 32, "none", true, [[0, "use"]], 0);
// let ab_ult_guardianBarrier_effect = new AbilityEffect("defense_change", "players", 60, "", false, true, 0, 0);
// let ab_ult_guardianBarrier = new PlayerAbility("Guardian Barrier",  0, [ab_ult_guardianBarrier_effect], "All Allies +60 DEF", 32, "none", true, [[0, "use"]], 0);
let ab_ult_explosion_effect = new AbilityEffect("bullet", "", 10, pro_p_bruteForce, false, false, 100, 10);
let ab_ult_explosion =  new PlayerAbility("Explosion", 0, [ab_ult_explosion_effect], "Shoot a powerful beam", 32, "none", true, [[5, "hit"]], 0);
// bolt abilities and effects
let ab_logicBomb_effect = new AbilityEffect("bullet", "", 1, pro_p_logicBomb, false, false, 0, 1);
let ab_logicBomb = new PlayerAbility("Logic Bomb", 3, [ab_logicBomb_effect], "Throw a projectile", 32, "none", false, [[5, "hit"]], 1);
let ab_backdoor_effect = new AbilityEffect("bullet", "", 5, pro_p_backdoor, false, false, 20, 1);
let ab_backdoor_effect2 = new AbilityEffect("dash", "", 3, "", false, false, 0, 0);
let ab_backdoor = new PlayerAbility("Backdoor", 2, [ab_backdoor_effect, ab_backdoor_effect2], "Dash and leave behind dust", 32, "none", false, [[5, "hit"], [2, "use"]], 1);
let ab_cleanupProtocol_effect = new AbilityEffect("heal", "players", 60, "", false, false, 0, 0);
let ab_cleanupProtocol = new PlayerAbility("Cleanup Protocol",  3, [ab_cleanupProtocol_effect], "Target ally heals 60 HP", 32, "none", false, [[5, "use"], [10, "heal"]], 0);
let ab_signalBoost_effect = new AbilityEffect("ramp", "players", 5, "", false, false, 0, 0);
let ab_signalBoost = new PlayerAbility("Signal Boost", 4, [ab_signalBoost_effect], "Target ally gets +5 Energy", 32, "none", false, [[10, "use"]], 0);
let ab_ult_bitRotWorm_effect = new AbilityEffect("bullet", "", 20, pro_p_ult_bitRotWorm, false, false, 100, 1);
let ab_ult_bitRotWorm = new PlayerAbility("Bitrot Worm", 0, [ab_ult_bitRotWorm_effect], "Shoot a powerful beam", 32, "none", true, [[5, "hit"]], 0);
let ab_ult_ransomBot_effect = new AbilityEffect("defense_change", "enemies", -50, "", false, true, 0, 0);
let ab_ult_ransomBot = new PlayerAbility("Ransom Bot", 0, [ab_ult_ransomBot_effect], "All enemies get -50 DEF", 32, "none", true, [[0, "use"]], 0);
// nuts abilities and effects
let ab_firewall_effect = new AbilityEffect("defense_change", "players", 25, "", false, false, 0);
let ab_firewall = new PlayerAbility("Firewall", 3, [ab_firewall_effect], "Target ally gets +25 DEF", 32, "none", false, [[10, "use"]], 0);
let ab_targetExploits_effect = new AbilityEffect("defense_change", "enemies", -25, "", false, false, 0, 0);
let ab_targetExploits = new PlayerAbility("Target Exploits", 3, [ab_targetExploits_effect], "Target enemy gets - 25 DEF", 32, "none", false, [[10, "use"]], 0);
let ab_DOOS_effect = new AbilityEffect("bullet", "", 1, pro_p_DDOS, false, false, 0, 1);
let ab_DDOS = new PlayerAbility("DDoS", 2, [ab_DOOS_effect], "Stun enemies hit for 0.5 seconds", 32, "none", false, [[5, "hit"]], 1);
let ab_bruteForce_effect = new AbilityEffect("bullet", "", 2, pro_p_bruteForce, false, false, 100, 10);
let ab_bruteForce_effect2 = new AbilityEffect("dash", "", 3, "", false, false, 0, 0);
let ab_bruteForce = new PlayerAbility("Brute Force Attack", 1, [ab_bruteForce_effect, ab_bruteForce_effect2], "Dash and shoot around you", 32, "none", false, [[5, "hit"], [2, "use"]], 1);
let ab_ult_vpn_effect = new AbilityEffect("ramp", "players", 6, "", false, true, 0, 0);
let ab_ult_vpn = new PlayerAbility("Activate VPN", 0, [ab_ult_vpn_effect], "All allies get +6 Energy", 32, "none", true, [[0, "use"]], 0);
let ab_ult_EMP_effect = new AbilityEffect("bullet", "", 10, pro_p_DDOS, false, false, 100, 1);
let ab_ult_EMP = new PlayerAbility("EMP", 0, [ab_ult_EMP_effect], "Discharge stunning waves", 32, "none", true, [[5, "hit"]], 0);
// robot abilities and effects
let ab_plasmaPulse_effect = new AbilityEffect("bullet", "", 1, pro_p_logicBomb, false, false, 0, 1);
let ab_plasmaPulse = new PlayerAbility("Plasma Pulse", 3, [ab_plasmaPulse_effect], "Throw a projectile", 32, "none", false, [[5, "hit"]], 1);
let ab_escape_effect = new AbilityEffect("bullet", "", 5, pro_p_backdoor, false, false, 20, 1);
let ab_escape_effect2 = new AbilityEffect("dash", "", 3, "", false, false, 0, 0);
let ab_escape = new PlayerAbility("Escape", 2, [ab_escape_effect, ab_escape_effect2], "Dash and leave behind dust", 32, "none", false, [[5, "hit"], [2, "use"]], 1);
let ab_powerCharge_effect = new AbilityEffect("discount", "players", 1, "", false, false, 0, 0);
let ab_powerCharge = new PlayerAbility("Power Charge",  3, [ab_powerCharge_effect], "Target ally gets Discount 1", 32, "none", false, [[10, "use"]], 0);
let ab_erraticStimulant_effect = new AbilityEffect("ultCharge_change", "players", 20, "", false, false, 0, 0);
let ab_erraticStimulant = new PlayerAbility("Erratic Stimulant", 4, [ab_erraticStimulant_effect], "Target ally gets +20 Ult Charge", 32, "none", false, [[10, "use"]], 0);
let ab_ult_restorationBlast_effect = new AbilityEffect("heal", "players", 50, "", false, true, 0, 0);
let ab_ult_restorationBlast = new PlayerAbility("Restoration Blast", 0, [ab_ult_restorationBlast_effect], "All allies Heal for 50 HP", 32, "none", true, [[0, "use"]], 0);
let ab_ult_paradoxProtocol_effect = new AbilityEffect("bullet", "", 5, pro_p_logicBomb, false, false, 50, 10);
let ab_ult_paradoxProtocol =  new PlayerAbility("Explosion", 0, [ab_ult_paradoxProtocol_effect], "Drop a cluster of bombs", 32, "none", true, [[5, "hit"]], 0);

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
// enemies talents
let ta_e_agent_block_effect =  new AbilityEffect("defense_change", "", 1, pro_e_serpentBullet, false, false, 0, 6);
let ta_e_agent_block = new EnemyAbility("line", [ab_e_serpent_shoot_effect], [1800], "through", 8);
let ta_e_agent_pierce_effect = new AbilityEffect("bullet", "", 1, pro_e_serpentBullet, false, false, 0, 6);
let ta_e_agent_pierce = new EnemyAbility("line", [ab_e_serpent_shoot_effect], [1800], "through", 8);
let ta_e_serpent_swipe_effect = new AbilityEffect("bullet", "", 1, pro_e_serpentBullet, false, false, 0, 6);
let ta_e_serpent_swipe = new EnemyAbility("line", [ab_e_serpent_shoot_effect], [1800], "through", 8);
let ta_e_serpent_spray_effect = new AbilityEffect("bullet", "", 1, pro_e_serpentBullet, false, false, 0, 6);
let ta_e_serpent_spray = new EnemyAbility("line", [ab_e_serpent_shoot_effect], [1800], "through", 8);

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
  S_ROBOT_FACE = loadImage(`assets/images/robot.png`);
  S_SCREWS_FACE = loadImage(`assets/images/screws_face.png`);
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
  pro_p_bolt_basic.images = S_BOLT_BULLET_BASIC;
  pro_p_bolt_basic.sounds = A_BOLT_BASIC;
  pro_p_nuts_basic.images = S_NUTS_BULLET_BASIC;
  pro_p_nuts_basic.sounds = A_NUTS_BASIC;
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
    textSize(width/65+height/60);
    textAlign(CENTER);
    fill(0);
    // name
    text(currentChar.name, width/20, height-height/3.8);
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
    // frontline.refreshed = false;
    // if (frontline.frontlineTurns >= 3 && frontline.acted === true) {
    //   frontline.tired = true;
    // }
  }
  for (let i = 0; i < playersList.length; i++) {
    // reset stat changes
    playersList[i].offenseChange = 0;
    playersList[i].defenseChange = 0;
    playersList[i].abilityDiscount = 0;
    // // if a player character did not use any abilities last turn, it gains refreshed this turn
    // if (playersList[i].acted === false) {
    //   // if not the first turn, give the characters refreshed buff
    //   if (turns > 1) {
    //     playersList[i].energyBoost = 3;
    //     playersList[i].offenseChange = 10;
    //     playersList[i].defenseChange = 10;
    //     playersList[i].refreshed = true;
    //   }
    // } else if (playersList[i].acted === true) {
    //   playersList[i].energyBoost = 0;
    //   playersList[i].refreshed = false;
    // }
    // // if the frontline is tired, get debuffs
    // if (frontline.tired === true) {
    //   frontline.offenseChange = -10;
    //   frontline.defenseChange = -10;
    // }
    playersList[i].energy += playersList[i].energyTurn + playersList[i].energyBoost;
    console.log(playersList[i].name + " " + playersList[i].energyTurn);
    playersList[i].energy = constrain(playersList[i].energy, 0, playersList[i].maxEnergy);
    playersList[i].acted = false;
    // all abilities are no used yet
    for (let i2 = 0; i2 < playersList[i].abilities[0].length; i2++) {
      playersList[i].abilities[0][i2].used = false;
    }
  }
  // reset enemies stats
  for (let i = 0; i < enemiesList.length; i++) {
    enemiesList[i].offenseChange = 0;
    enemiesList[i].defenseChange = 0;
  }
  // enemies choose aggro targets: if a player's aggro level is 1 or more above all others, it is
  // the target. If 2 or more have same highest amount, choose randomly between them
  for (let i = 0; i < enemiesList.length; i++) {
    // the current highest aggro amount
    let highestAggro = 0;
    // how many players have the highest amount together
    let manyHighestAggro = [];
    // for each living player character that can be aggroed
    for (let i2 = 0; i2 < enemiesList[i].aggroList.length; i2++) {
      // record their aggro amount and compare it to the highest
      let currentPlayerAggro = enemiesList[i].aggroAmount[i2];
      if (currentPlayerAggro > highestAggro) {
        highestAggro = currentPlayerAggro;
        // in case of a tie later, clean the array and add this one
        // also clear since if it was currently filled with past lower numbers
        manyHighestAggro = [];
        append(manyHighestAggro, i2);
        // if many are same highest, note down their index
        // ex: bolt, nuts, screws, robot = 0, 1, 2, 3
        // if bolt and screws are the highest together (3), then the manyHighestAggro
        // array becomes (0, 2)
      } else if (currentPlayerAggro === highestAggro) {
        append(manyHighestAggro, i2);
      }
    }
    // if there are many that are highest, randomly choose one between them
    // if there is only one highest, random choice only returns the same one
    // then the current enemy's chosen target name is selected
    let chosenRandomPlayer = random(manyHighestAggro);
    enemiesList[i].currentAggro = playersList[chosenRandomPlayer].name;
    // reset the aggro for each enemy to be equal to each player
    // so new player actions will grab their attention again
    // from scratch
    for (let i2 = 0; i2 < enemiesList[i].aggroList.length; i2++) {
      enemiesList[i].aggroAmount[i2] = 1;
    }
  }
  // each enemy randomly choose whether to use talents, then if
  // they do, randomly choose a talent to activate
  for (let i = 0; i < enemiesList.length; i++) {
    let talentChance = enemiesList[i].talentRate;
    let randomNumber = random(0, 101);
    let chosenTalent;
    // if within the chance, do a talent
    if (randomNumber <= talentChance) {
      chosenTalent = random(enemiesList[i].talents);
      // do the talent

    }
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
  // if all players or enemies are dead, win or lose game
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
      // if the user is still alive
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

// // last dialog
// function previousDialog() {
//   currentDialogNumber -= 1;
//   currentDialogNumber = constrain(currentDialogNumber, 0, currentDialog.length-1);
// }
//
// // next dialog
// function nextDialog() {
//   currentDialogNumber += 1;
//   currentDialogNumber = constrain(currentDialogNumber, 0, currentDialog.length-1);
// }
//
// // skip tutorial
// function skipDialog() {
//   tutorial = false;
//   $(`#skipButton`).css(`display`, `none`);
//   $(`#previousButton`).css(`display`, `none`);
//   $(`#nextButton`).css(`display`, `none`);
// }

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
  bolt = new Player("Bolt", 200, 4, 10, [[ab_cleanupProtocol, ab_signalBoost, ab_ult_ransomBot], [ab_logicBomb, ab_backdoor, ab_ult_bitRotWorm]], pro_p_bolt_basic, boltImages);
  nutsImages = new Images(S_NUTS_LEFT, S_NUTS_RIGHT, S_NUTS_FRONT, S_NUTS_FACE);
  nuts = new Player("Nuts", 300, 3, 12, [[ab_firewall, ab_targetExploits, ab_ult_vpn], [ab_DDOS, ab_bruteForce, ab_ult_EMP]], pro_p_nuts_basic, nutsImages);
  screwsImages = new Images(S_SCREWS_FACE, S_SCREWS_FACE, S_SCREWS_FACE, S_SCREWS_FACE);
  screws = new Player("Screws", 200, 5, 20, [[ab_protectorsGlare, ab_energyRecharge, ab_ult_hexcodeDeflector], [ab_confidenceBoost, ab_shockwave, ab_ult_explosion]], pro_p_bolt_basic, screwsImages);
  robotImages = new Images(S_ROBOT_FACE, S_ROBOT_FACE, S_ROBOT_FACE, S_ROBOT_FACE);
  robot = new Player("Robot", 300, 4, 15, [[ab_powerCharge, ab_erraticStimulant, ab_ult_restorationBlast], [ab_escape, ab_plasmaPulse, ab_ult_paradoxProtocol]], pro_p_nuts_basic, robotImages);
  agentImages = new Images(S_AGENT_LEFT, S_AGENT_RIGHT, S_AGENT_FRONT, "none");
  agent = new Enemy("Hackshield Agent", 800, width/20+height/20, 4, [ab_e_agent_shoot, ab_e_agent_spread, ab_e_agent_explode], agentImages, [ta_e_agent_block, ta_e_agent_pierce], 60);
  for (var i = 0; i < agent.abilities.length; i++) {
    agent.abilities[i].user = agent;
  }
  agent2 = new Enemy("Hackshield Agent", 800, width/20+height/20, 4, [ab_e_agent_shoot, ab_e_agent_spread, ab_e_agent_explode], agentImages, [ta_e_agent_block, ta_e_agent_pierce], 60);
  for (var i = 0; i < agent2.abilities.length; i++) {
    agent2.abilities[i].user = agent2;
  }
  serpentImages = new Images(S_SERPENT_LEFT, S_SERPENT_RIGHT, S_SERPENT_FRONT, "none");
  serpent = new Enemy("Serverspy Serpent", 1000, width/20+height/20, 6, [ab_e_serpent_shoot, ab_e_serpent_wave, ab_e_serpent_gatling], serpentImages, [ta_e_serpent_swipe,
   ta_e_serpent_spray], 50);
  for (var i = 0; i < serpent.abilities.length; i++) {
    serpent.abilities[i].user = serpent;
  }
  serpent2 = new Enemy("Serverspy Serpent", 1000, width/20+height/20, 6, [ab_e_serpent_shoot, ab_e_serpent_wave, ab_e_serpent_gatling], serpentImages, [ta_e_serpent_swipe,
   ta_e_serpent_spray], 50);
  for (var i = 0; i < serpent2.abilities.length; i++) {
    serpent2.abilities[i].user = serpent2;
  }
  playersList = [bolt, nuts, screws, robot];
  enemiesList = [agent, agent2, serpent, serpent2];
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
  // set the list of aggro for each enemy, the list of all player characters in the battle they can target
  // set the amount of aggro of each player for the enemies to be equal
  for (let i = 0; i < enemiesList.length; i++) {
    for (let i2 = 0; i2 < playersList.length; i2++) {
      append(enemiesList[i].aggroList, playersList[i2].name);
      append(enemiesList[i].aggroAmount, 1);
    }
  }
  frontline = bolt;
  currentChar = "none";
  // enter the title state and starts the first turn
  whichScreen = PLAN_STATE;
  newTurn();
}
