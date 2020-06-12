class BulletStats {
  constructor(speed, angle, moveType, targets, effects, size, changes, images, sounds, wall, ifHit, timer) {
    this.speed = speed;
    this.angle = angle;
    this.moveType = moveType;
    // what char can this bullet hit?
    this.targets = targets;
    // what effects this bullet has when hit a target
    this.effects = effects;
    // how larget is this bullet
    this.size = size;
    // if this changes size, damage, who it affecs, speed, etc.
    // check which ones this have and apply those changes every draw
    this.changes = changes;
    // the images of this bullet
    this.images = images;
    // the sounds of this bullet and when they should play
    this.sounds = sounds;
    // if this touches a wall, what to do
    this.wall = wall;
    // if this hits a target what to do 0 = if disappear, 1 = others
    this.ifHit = ifHit;
    // start a timer when this bullet is spawned, when the timer reaches
    this.timer = timer;
  }
}
