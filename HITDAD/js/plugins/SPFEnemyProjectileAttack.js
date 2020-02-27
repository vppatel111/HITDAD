//=============================================================================
// SPFEnemyProjectileAttack
// v1.0
//
// Description: This plugin causes any enemies with "security_npc" in
// their notes to shoot at you.
//
// To use:
// 1. You must place a parallel event in the world that calls
//    plugin command "spf_ShootBullet()"
// 2. Then place a delay of N seconds (attack speed of enemy).
// 3. Ensure enemies have {"npcType": "security_npc"} in their note field and
//    have priority set to "Same as characters".
//=============================================================================

/*:
 * @plugindesc This plugin implements a projectile attack for enemies.
 *
 * @author Vishal Patel
 *
 * @param enemyDetectionRange
 * @type number
 * @desc Key to press to perform melee attack.
 * @default 5
 *
 * @param bulletDamage
 * @type number
 * @desc When the player gets hit, this is the amount of damage they'll take.
 * @default 150
 *
 * @param bulletSpeed
 * @type number
 * @desc The speed of the bullet.
 * @default 0.1
 *
 * @param shootSe
 * @desc Sound effect when enemy guard shoots a bullet.
 * @dir audio/se/
 * @type file
 *
 * @param shootSeParam
 * @type string
 * @desc: {"volume":90, "pitch":70, "pan":0}
 * @default {"volume":90, "pitch":70, "pan":0}
 *
 */
(function() {

  var parameters = PluginManager.parameters('SPFEnemyProjectileAttack');

  var ENEMY_RANGE = parseInt(parameters['enemyDetectionRange']);
  var BULLET_DAMAGE = parseInt(parameters['bulletDamage']);
  var BULLET_SPEED = parseFloat(parameters['bulletSpeed']);

  let SHOOT_SOUND = JSON.parse(parameters['shootSeParam'] || '{}');
  SHOOT_SOUND.name = parameters['shootSe'] || '';

  var DEBUG = false;

  // Defines a rectanglular collider for the bullet where each dimension is given
  // in tiles. The (x,y) coordinates define the top-left corner of the rectangle.
  var bulletCollider = {x: 0, y: 0.18, width: 1, height: 0.56};

  var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    aliasPluginCommand.call(this, command, args);

    if (command === 'spf_ShootBullet()') {
      checkEnemyDetection();
    }
  };

  function isLookingInDirectionOfPlayer(event) {
    var distanceX = event.x - $gamePlayer.x;
    var direction = event.direction();

    // Enemy is to the right of player and enemy is facing left.
    if (distanceX > 0 && direction == DIRECTION.LEFT) {
      return true;

    // Enemy is to the left of the player and enemy is facing right.
    } else if (distanceX < 0 && direction == DIRECTION.RIGHT) {
      return true;

    }

    return false;

  }

  // Player is within range if they are within:
  // - 1 tile above or below the security guard
  // - "ENEMY_RANGE" tiles to the left or right of the security guard
  function isPlayerInRange(event) {

    var distanceX = Math.abs(event.x - $gamePlayer.x);
    var distanceY = Math.abs(event.y - $gamePlayer.y);

    let range = event._detectionRange ? event._detectionRange : ENEMY_RANGE;
    // if (distanceX <= ENEMY_RANGE &&
    if (distanceX <= range &&
        distanceY <= 1) {
      return true;
    }

    return false;

  }

  // Extend SPF_Projectile to hurt player.
  function SPF_EnemyProjectile() {
      this.initialize.apply(this, arguments);
  }

  SPF_EnemyProjectile.prototype = Object.create(SPF_Projectile.prototype);
  SPF_EnemyProjectile.prototype.constructor = SPF_EnemyProjectile;
  SPF_EnemyProjectile.prototype.initialize = function (directionX) {
      SPF_Projectile.prototype.initialize.call(this, directionX);
  }

  SPF_EnemyProjectile.prototype.collidePlayer = function() {
    return SPF_CollidedWithPlayerCharacter(this._x, this._y, bulletCollider);
  }

  // There are 3 types of box, 1x1, 1x2 and 3x1.
  // TODO: Implement this for 3x1 boxes.
  SPF_EnemyProjectile.prototype.collideBoxes = function() {
    return SPF_CollidedWithBoxes(this._x, this._y, bulletCollider, BOX_TYPE.ONE_BY_ONE) ||
           SPF_CollidedWithBoxes(this._x, this._y + 1, bulletCollider, BOX_TYPE.ONE_BY_TWO);
  }

  SPF_EnemyProjectile.prototype.hurtPlayer = function() {
    $gamePlayer.battler().gainHp(-1 * BULLET_DAMAGE); // Damage the player.
  }

  SPF_EnemyProjectile.prototype.update = function () {
      SPF_Projectile.prototype.update.call(this);

      if (this.collidePlayer() && !this._dealtDamage) {
        this.erase();
        this._dealtDamage = true
        this.hurtPlayer();
      } else if (this.collideBoxes()) {
        this.erase();
      }
  }

  function checkEnemyDetection() {

    SPF_Enemies.forEach(function(enemy) {

      if (isPlayerInRange(enemy) &&
          isLookingInDirectionOfPlayer(enemy) &&
          !enemy._isStunned) {

        var bullet = new SPF_EnemyProjectile(enemy.direction());

        if (DEBUG) {
          var getColliderPoints = function() {
            return SPF_GetColliderPoints(bullet._x, bullet._y, bulletCollider);
          }
          SPF_DrawCollider("Bullet", getColliderPoints, bulletCollider);
        }

        // Shoot the projectile in that direction.
        if (enemy.direction() == DIRECTION.LEFT) {
          bullet.setup(enemy.x, enemy.y - 1, -1 * BULLET_SPEED);
        } else {
          // Spawn bullet on right of enemy if going right.
          bullet.setup(enemy.x + 1, enemy.y - 1, BULLET_SPEED);
        }

        AudioManager.playSe(SHOOT_SOUND);

      }

    });
  }

})();
