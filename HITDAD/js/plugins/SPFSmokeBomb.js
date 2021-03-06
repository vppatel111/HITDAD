//=============================================================================
// SPFSmokeBomb
// v1.0
//
//=============================================================================

/*:
 * @plugindesc This plugin implements a smoke bomb attack.
 *
 * @author Vishal Patel
 *
 * @help REQUIRES TMJumpAction plugin.
 * This plugin implements the smoke bomb attack where when a player selects the
 * item from the hotbar and presses the right mouse button, the gamePlayer will
 * use an item with "itemID" and shoot a projectile which when it hits the
 * ground will "explode" and stun all enemies within the radius.
 * Each level MUST contain event with priority: above player and not tags <particle_effect><gravity:0>
 *
 * @param itemID
 * @type number
 * @desc Item required to perform attack.
 * @default 2
 *
 * @param gravity
 * @type number
 * @desc How fast the item will fall.
 * @default 0.005
 *
 * @param initialVelocity
 * @type number
 * @desc The initial speed of the projectile when thrown.
 * @default 0.20
 *
 * @param explosionRadius
 * @type number
 * @desc The number of pixels of the explosion.
 * @default 150
 *
 * @param stunDuration
 * @type number
 * @desc The number of frames the enemies are stunned when hit.
 * @default 250
 *
 * @param hurlSe
 * @desc Sound effect when HitDad throws diaper
 * @dir audio/se/
 * @type file
 *
 * @param hurlSeParam
 * @type string
 * @desc: {"volume":90, "pitch":70, "pan":0}
 * @default {"volume":90, "pitch":70, "pan":0}
 *
 * @param impactSe
 * @desc Sound effect when HitDad throws diaper
 * @dir audio/se/
 * @type file
 *
 * @param impactSeParam
 * @type string
 * @desc: {"volume":90, "pitch":70, "pan":0}
 * @default {"volume":90, "pitch":70, "pan":0}
 *
 */

function SPF_ProjectileBomb() {
   this.initialize.apply(this, arguments);
}

(function() {

  var parameters = PluginManager.parameters('SPFSmokeBomb');

  var ITEM_ID = parseInt(parameters['itemID']);
  var GRAVITY = parseFloat(parameters['gravity']);
  var INITIAL_VELOCITY = parseFloat(parameters['initialVelocity']);
  var EXPLOSION_RADIUS = parseFloat(parameters['explosionRadius']);
  var STUN_DURATION = parseInt(parameters['stunDuration']);

  let HURL_SOUND = JSON.parse(parameters['hurlSeParam'] || '{}');
  HURL_SOUND.name = parameters['hurlSe'] || '';
  let IMPACT_SOUND = JSON.parse(parameters['impactSeParam'] || '{}');
  IMPACT_SOUND.name = parameters['impactSe'] || '';

  var EXPLOSION_RADIUS_TILES = EXPLOSION_RADIUS / 48; // Explosion radius in tiles.

  Game_Player.prototype.SPF_ThrowDiaperBomb = function(event) {

    if ($gamePlayer.isCarryingDiaperBomb()) {
      let angle = SPF_AngleToPlayer(event.x, event.y, $gamePlayer.screenX(), $gamePlayer.screenY());
      let bomb = new SPF_ProjectileBomb(angle);

      // // Decrement item after bomb is thrown
      // $gameParty.loseItem(SPF_CSI, 1);
      // AudioManager.playSe(HURL_SOUND);
      // Decrement item after bomb is thrown
      $gameParty.loseItem(SPF_CSI, 1);
      AudioManager.playSe(SE_DIAPERTHROW);
      $gamePlayer._carryingDiaperBomb = null;
    }

  }

  Game_Player.prototype.isCarryingDiaperBomb = function() {
    return this._carryingDiaperBomb !== null;
  }

  // Static properties
  SPF_ProjectileBomb._GRAVITY = GRAVITY;
  SPF_ProjectileBomb._INITIAL_VELOCITY = INITIAL_VELOCITY;

  SPF_ProjectileBomb.prototype.initialize = function(angle) {
    this._opacity = 0;

    var initialVx = -1 * Math.cos(angle) * INITIAL_VELOCITY;
    var initialVy = -1 * Math.sin(angle) * INITIAL_VELOCITY;

    initialVx = SPF_RoundToTwoDecimalPlaces(initialVx);
    initialVy = SPF_RoundToTwoDecimalPlaces(initialVy);

    this.setup($gamePlayer.x, $gamePlayer.y - 1, initialVx, initialVy);

    this._sprite = new SPF_ProjectileBomb_Sprite(this);

  };

  SPF_ProjectileBomb.prototype.setup = function (x, y, vx, vy) {
    this._opacity = 255;
    this._x = x;
    this._y = y;
    this._vx = vx;
    this._vy = vy;
  }

  SPF_ProjectileBomb.prototype.collideMap = function() {
    var x = Math.floor(this._x);
    var y = Math.floor(this._y);

    // Implemented by TMJumpAction plugin.
    return !$gameMap.checkPassageBullet(x, y);
  }

  // Need to account for tile width to stay on tile
  // the projectile was spawned.
  SPF_ProjectileBomb.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round($gameMap.adjustX(this._x) * tw);
  };

  SPF_ProjectileBomb.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round($gameMap.adjustY(this._y) * th);
  };

  // If you define an update, it will be updated.
  SPF_ProjectileBomb.prototype.update = function () {

    this._vy += GRAVITY;
    this._x += this._vx;
    this._y += this._vy;

    if (this.collideMap()) {
       this.erase();
       this.explode();
       AudioManager.playSe(SE_DIAPERTHROWIMPACT);
    }

  }

  SPF_ProjectileBomb.prototype.explode = function () {

    let explosion = this;
    if (SPF_ParticleEffect) {
      SPF_ParticleEffect.locate(this._x, this._y);
      SPF_ParticleEffect.effectsTimer = new SPF_Timer();
      SPF_ParticleEffect.effectsTimer.start(10,
          function () {
            SPF_ParticleEffect.locate(0, 0);
            $gameMap.pausePEmitter("1");
          });
      $gameMap.createPEmitter("1", ["fart1", "fart2", "fart3"], "fart_emitter2", SPF_ParticleEffect.eventId());
      $gameMap.setPEmitterZ("1", 9)
    }
    // Stun all vulnerable enemies in range
    SPF_Enemies.forEach(function(enemy) {

      if (enemy._npcType === SPF_NPCS.MASKED_GUARD ||
          SPF_IsEnemyPacified(enemy)) {
        return;
      }

      let distanceToExplosion = SPF_DistanceBetweenTwoPoints(enemy.x, enemy.y,
                                           explosion._x, explosion._y);

      if (distanceToExplosion < EXPLOSION_RADIUS_TILES) {
        SPF_StunEnemy(enemy, SPF_ENEMYSTATE.DIAPERSTUNNED, STUN_DURATION);

        AudioManager.playSe(SE_DIAPERGUARDHIT);
        AudioManager.playSe(SE_COUNTDOWN);
      }

    });

  }

  SPF_ProjectileBomb.prototype.erase = function() {
    this._opacity = 0;

    // By removing sprite from screen, we won't get updates anymore.
    SceneManager._scene.removeChild(this._sprite);
  };

  function SPF_ProjectileBomb_Sprite() {
      this.initialize.apply(this, arguments);
  }

  SPF_ProjectileBomb_Sprite.prototype = Object.create(Sprite.prototype);
  SPF_ProjectileBomb_Sprite.prototype.constructor = SPF_ProjectileBomb_Sprite;
  SPF_ProjectileBomb_Sprite.prototype.initialize = function (projectile) {
      Sprite.prototype.initialize.call(this);

      var item = SPF_FindItemById(ITEM_ID);

      var bitmap = new Bitmap(100, 100);
      SPF_LoadIconOntoBitmap(bitmap, item.iconIndex);

      this.bitmap = bitmap;
      this._bomb = projectile;
      this.visible = true;
      this.opacity = 255;

      SceneManager._scene.addChild(this);
  };

  SPF_ProjectileBomb_Sprite.prototype.update = function () {
      Sprite.prototype.update.call(this);

      // Update the bullet position
      this._bomb.update();
      this.opacity = this._bomb._opacity;

      // Convert map X/Y into a screen coordinate to draw.
      this.x = this._bomb.screenX();
      this.y = this._bomb.screenY();
  };

})();
