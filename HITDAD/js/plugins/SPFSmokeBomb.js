//=============================================================================
// SPFSmokeBomb
// v1.0
//
// TODO: Drawing entire trajectory is hard so only draw an arrow
// in the direction of shooting whne mouse down.
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
 */
(function() {

  var parameters = PluginManager.parameters('SPFSmokeBomb');

  var ITEM_ID = parseInt(parameters['itemID']);
  var GRAVITY = parseFloat(parameters['gravity']);
  var INITIAL_VELOCITY = parseFloat(parameters['initialVelocity']);
  var EXPLOSION_RADIUS = parseFloat(parameters['explosionRadius']);

  var EXPLOSION_RADIUS_TILES = EXPLOSION_RADIUS / 48; // Explosion radius in tiles.

  // Calculate the angle between the player and mouse and returns
  // the angle in radians.
  function angleToPlayer(mouseX, mouseY,
                         playerX, playerY) {

     return Math.atan2(playerY - mouseY, playerX - mouseX);

  }

  document.addEventListener("mousedown", function (event) {

      if ($dataMap) {

        var item = SPF_FindItemById(ITEM_ID);

        if (!SPF_isEmpty(item) &&
             SPF_IsItemSelected(item) &&
            !Input._isItemShortCut()) { // Do not fire if hotbar is open.

          var angle = angleToPlayer(event.pageX, event.pageY, $gamePlayer.screenX(), $gamePlayer.screenY());
          var bomb = new SPF_ProjectileBomb(angle);

          // TODO: Draw an arrow indicator for direction of throw.
          //var arrow = new SPF_ArrowSprite();

          // Decrement item after bomb is thrown
          $gameParty.loseItem(item, 1);
        }

      }
  });

  function SPF_ProjectileBomb() {
    this.initialize.apply(this, arguments);
  }

  function SPF_RoundToTwoDecimalPlaces(num) {
    return Math.round( num * 100 + Number.EPSILON ) / 100;
  }

  function SPF_DistanceBetweenTwoPoints(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
  }

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
    }

  }

  SPF_ProjectileBomb.prototype.explode = function () {

    var explosion = new SPF_Sprite();
    var bitmap = new Bitmap(EXPLOSION_RADIUS * 2,
                            EXPLOSION_RADIUS * 2);

    bitmap.drawCircle(EXPLOSION_RADIUS,
                      EXPLOSION_RADIUS,
                      EXPLOSION_RADIUS, 'red');

    explosion.bitmap = bitmap;

    explosion.visible = true;
    explosion.opacity = 255;

    // Draw explosion slightly higher then where it landed.
    explosion.x = this.screenX() - EXPLOSION_RADIUS;
    explosion.y = this.screenY() - EXPLOSION_RADIUS;

    explosion.spawnX = this._x;
    explosion.spawnY = this._y;

    // Make the smoke bomb slowly disperse
    explosion.setUpdate(function() {

      if (explosion.opacity > 0) {
        explosion.opacity -= 1;
      }

      // This ensures the explosion does not move when the screen moves.
      explosion.x = SPF_MapXToScreenX(this.spawnX) - EXPLOSION_RADIUS;
      explosion.y = SPF_MapYToScreenY(this.spawnY) - EXPLOSION_RADIUS;

    });

    explosion.show();

    // TODO: Stun the enemies caught in the radius of the blast
    // for a period of time instead of indefinitely.
    SPF_Enemies.forEach(function(enemy) {

      var distanceToExplosion = SPF_DistanceBetweenTwoPoints(enemy.x, enemy.y,
                                           explosion.spawnX, explosion.spawnY);

      if (distanceToExplosion < EXPLOSION_RADIUS_TILES) {
        SPF_IncapacitateEnemy(enemy);
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

      var bitmap = new Bitmap(100, 100);
      bitmap.drawCircle(25, 25, 15, 'red');
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