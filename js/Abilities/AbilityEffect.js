class AbilityEffect {
  constructor(type, canTargets, amount, bullet, step, aoe, delay, perDelay, whenHappen) {
    // type of the effect
    this.type = type;
    // what characters this ability effect can target, gets a list when used (player support)
    this.canTargets = canTargets;
    this.canTargetsList;
    // the character(s) that are being targeted by this ability effect right now (player support)
    this.targets = [];
    // how much of the effect is applied, if make bullet, how many times make a shot
    this.amount = amount;
    // if this makes a bullet, what type
    this.bullet = bullet;
    // if this effect requires another step in the ability
    this.step = step;
    // if this is an area of effect ability that affect all targets of group (support)
    this.aoe = aoe;
    // if there is a delay between parts of this effect (output many bullets but 1 at a time)
    this.delay = delay;
    // how many bullets are created per delay time (per shot)
    this.perDelay = perDelay;
    // after how many turns this effect happens (0 is now)
    this.whenHappen = whenHappen;

  }
}
