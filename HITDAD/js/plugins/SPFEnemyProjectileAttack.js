//=============================================================================
// SPFEnemyProjectileAttack
// v1.0
//
// Description: This plugin causes any enemies with <npc_type:n> in
// their notes to shoot at you.
//
// To use:
// 1. You must set the a tag <position:n> where n is the enemies x position on the map"
//    and have the enemy in its rightmost position for its path
// 2. You must set <movement:n> to the distance you want the enemy to travel to the left
//    before turning around.
//
// Other Tags available for customization:
//  <fire_rate:n>       The time between shots
//  <shot_delay:n>      Adds a delay between when the NPC first detects the player and its first shot
//  <movement:n>        Sets the distance the NPC will move to the left before turning around
//  <movement_pause:n>  Adds a pause at each end of the path before the NPC turns around
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
  var bulletCollider = {x: 0.16, y: 0.27, width: 0.67, height: 0.33};

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

    var x = this._x;
    var y = this._y;

    var boxesAtLocation = $gameMap.eventsXy(Math.floor(x), Math.floor(y));
    boxesAtLocation = boxesAtLocation.concat($gameMap.eventsXy(Math.floor(x - 1), Math.floor(y)));

    // If collided with 1 x 1 boxes.
    if (SPF_CollidedWithBoxes(this._x, this._y, bulletCollider,
                              BOX_TYPE.ONE_BY_ONE, boxesAtLocation))
    {
        return true;
    }

    boxesAtLocation = boxesAtLocation.concat($gameMap.eventsXy(Math.floor(x), Math.floor(y + 1)));
    // If collided with 1 x 2 boxes.
    if (SPF_CollidedWithBoxes(this._x, this._y, bulletCollider,
                              BOX_TYPE.ONE_BY_TWO, boxesAtLocation))
    {
        return true;
    }

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


  Game_Event.prototype.SPF_UpdateMovement = function() {

    if (SPF_IsEnemyStunned(this) ||
        SPF_IsEnemyPacified(this) ||
        this._playerDetected ||
        this._movementPauseCountDown > 0) {

      SPF_EnemyPauseMovement(this, true);
      return;

    } else {
      SPF_EnemyPauseMovement(this, false);
    }

    function changeDirection(enemy, left) {
      if (enemy._movementPause) {
        enemy._movementPauseCountDown = enemy._movementPause * 60;
      }
      enemy._movingLeft = left;
    }

    if (this._movingLeft) {
      if (Math.abs(this._startX - this.x) < this._movementRange) {
        this.moveStraight(4);
      } else {
        changeDirection(this, false);
      }
    } else {
      if (Math.abs(this._startX - this.x) > 0) {
        this.moveStraight(6);
      } else {
        changeDirection(this, true);
      }
    }
  }

  Game_Player.prototype.SPF_UpdateEnemyStates =  function() {

    SPF_Enemies.forEach(function(enemy) {

      enemy.SPF_UpdateMovement();

      if (!enemy._fireRate) return;

        let isStunned = SPF_IsEnemyStunned(enemy) || SPF_IsEnemyPacified(enemy);

        if (isPlayerInRange(enemy) &&
            isLookingInDirectionOfPlayer(enemy) &&
            !isStunned) {

          if (!enemy._playerDetected) {
            enemy._playerDetected = true;
            enemy._shotDelayCountdown = enemy._shotDelay * 60; // Adds delay before first shot is fired
            SPF_EnemyPauseMovement(enemy, true);
          }

          // Don't shoot until delays are finished
          if (enemy._shotDelayCountdown > 0 || enemy._fireCountdown > 0) {
            enemy._fireCountdown--;
            enemy._shotDelayCountdown--;
            return;
          } else {
            // Set countdown for next shot
            enemy._fireCountdown = enemy._fireRate * 60;
          }

          var bullet = new SPF_EnemyProjectile(enemy.direction());

          if (DEBUG) {
            var getColliderPoints = function () {
              return SPF_GetColliderPoints(bullet._x, bullet._y, bulletCollider);
            }
            SPF_DrawCollider("Bullet", getColliderPoints, bulletCollider);
          }

          // Shoot the projectile in that direction.
          if (enemy.direction() === DIRECTION.LEFT) {
              bullet.setup(enemy.x, enemy.y - 1, -1 * BULLET_SPEED);
          } else {
              // Spawn bullet on right of enemy if going right.
              bullet.setup(enemy.x + 1, enemy.y - 1, BULLET_SPEED);
          }
          AudioManager.playSe(SE_SHOOT);

        } else {
          enemy._playerDetected = false;
        }
    });
  }

})();
