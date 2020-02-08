//=============================================================================
// SPFEnemyProjectileAttack
// v1.0
//
// Description: This plugin causes any enemies with "security_npc" in
// their notes to shoot at you.
//
// To use:
// 1. You must place an event in the world that calls plugin command "spf_ShootBullet()"
// 2. Then place a delay of N seconds (attack speed of enemy).
// 3. Ensure enemies have {"npcType": "security_npc"} in their note field.
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
 * @default 500
 *
 * @param bulletSpeed
 * @type number
 * @desc The speed of the bullet.
 * @default 0.1
 *
 */
(function() {

  var parameters = PluginManager.parameters('SPFEnemyProjectileAttack');

  var ENEMY_RANGE = parseInt(parameters['enemyDetectionRange']);
  var BULLET_DAMAGE = parseInt(parameters['bulletDamage']);
  var BULLET_SPEED = parseFloat(parameters['bulletSpeed']);

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

    if (distanceX <= ENEMY_RANGE &&
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
  SPF_EnemyProjectile.prototype.initialize = function () {
      SPF_Projectile.prototype.initialize.call(this);
  }

  // TODO: Change collider based on actual hitbox of HITDAD.
  SPF_EnemyProjectile.prototype.isCollidedWithPlayerCharacters = function(x, y) {
    return $gamePlayer.x == x &&
           $gamePlayer.y == y + 1; // Deal damage if projectile hits his face.
  }

  SPF_EnemyProjectile.prototype.collidePlayer = function() {
    var x = Math.floor(this._x);
    var y = Math.floor(this._y);

    return this.isCollidedWithPlayerCharacters(x, y);
  }

  SPF_EnemyProjectile.prototype.killPlayer = function() {
    $gamePlayer.battler().gainHp(-1 * BULLET_DAMAGE); // Damage the player.
  }

  SPF_EnemyProjectile.prototype.update = function () {
      SPF_Projectile.prototype.update.call(this);

      if (this.collidePlayer()) {
        this.erase();
        this.killPlayer();
      }
  }

  function checkEnemyDetection() {

    SPF_Enemies.forEach(function(enemy) {

      if (isPlayerInRange(enemy) &&
          isLookingInDirectionOfPlayer(enemy) &&
          !enemy._isStunned) {

        var bullet = new SPF_EnemyProjectile();

        // Shoot the projectile in that direction.
        if (enemy.direction() == DIRECTION.LEFT) {
          bullet.setup(enemy.x, enemy.y - 1, -1 * BULLET_SPEED);
        } else {
          bullet.setup(enemy.x, enemy.y - 1, BULLET_SPEED);
        }

      }

    });
  }

})();
