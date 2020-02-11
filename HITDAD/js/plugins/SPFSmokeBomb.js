//=============================================================================
// SPFPhoneCall
// v1.0
//
// TODO: Extend off the projectile plugin instead of building a custom implementation.
// TODO: Drawing entire trajectory is hard so only draw an arrow
// in the direction of shooting whne mouse down.
//=============================================================================

/*:
 * @plugindesc Plugin to extend TMJumpAction to allow player to hurl box in the
 * direction of a mouse click. REQUIRES TMJumpAction plugin.
 *
 * @author Vishal Patel
 *
 * @help: REQUIRES TMJumpAction plugin.
 *
 */
(function() {

  var GRAVITY = 0.005;                        // Units: m/s^2
  var INITIAL_VELOCITY = 0.20;                // Initial value = 0.25
  var EXPLOSION_RADIUS = 150;
  var EXPLOSION_RADIUS_TILES = EXPLOSION_RADIUS / 48; // Explosion radius in tiles.

  // Calculate the angle between the player and mouse and returns
  // the angle in radians.
  function angleToPlayer(mouseX, mouseY,
                         playerX, playerY) {

     return Math.atan2(playerY - mouseY, playerX - mouseX);

  }

  // TODO: Ensure this only works on gamemap as otherwise we'll get errors.
  document.addEventListener("mousedown", function (event) {

      if ($dataMap) {

          var angle = angleToPlayer(event.pageX, event.pageY, $gamePlayer.screenX(), $gamePlayer.screenY());
          var bomb = new SPF_ProjectileBomb(angle);

          // Draw a nice ol' line instead.
          //var arrow = new SPF_ArrowSprite();
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

    // TODO: Create the projectile bomb extended off the original projectile.
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
    explosion.x = this.screenX();
    explosion.y = this.screenY() - EXPLOSION_RADIUS;

    explosion.spawnX = this._x;
    explosion.spawnY = this._y;

    // Make the smoke bomb slowly disperse
    explosion.setUpdate(function() {

      if (explosion.opacity > 0) {
        explosion.opacity -= 1;
      }

      // This ensures the explosion does not move when the screen moves.
      explosion.x = SPF_MapXToScreenX(this.spawnX);
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

      // Bullet keeps track of projectile X & Y in map.
      this._bullet = projectile;

      this.visible = true;
      this.opacity = 255;

      SceneManager._scene.addChild(this);
  };

  SPF_ProjectileBomb_Sprite.prototype.update = function () {
      Sprite.prototype.update.call(this);

      // Update the bullet position
      this._bullet.update();

      this.opacity = this._bullet._opacity;

      // Convert map X/Y into a screen coordinate to draw.
      this.x = this._bullet.screenX();
      this.y = this._bullet.screenY();
  };

  function SPF_ArrowSprite() {
      this.initialize.apply(this, arguments);
  }

  SPF_ArrowSprite.prototype = Object.create(Sprite.prototype);
  SPF_ArrowSprite.prototype.constructor = SPF_ArrowSprite;
  SPF_ArrowSprite.prototype.initialize = function () {
      Sprite.prototype.initialize.call(this);

      // I'm stupid, the reason why this doesn't work is because the SPRITE
      // needs to be in the location of the gameplayer, not the bitmap.
      var tw = $gameMap.tileWidth();
      var th = $gameMap.tileHeight();

      var bitmap = new Bitmap(100, 100);
      bitmap.drawArrow(0, 0, "red");

      this.bitmap = bitmap;

      this.x = Math.round($gameMap.adjustX($gamePlayer.x) * tw);
      this.y = Math.round($gameMap.adjustY($gamePlayer.y) * th);

      this.visible = true;
      this.opacity = 255;

      console.log("drwaing arrow @", this.x, this.y);

      SceneManager._scene.addChild(this);
  };

  SPF_ArrowSprite.prototype.update = function () {
      Sprite.prototype.update.call(this);

      // Update the bullet position
      // this._bullet.update();
      //
      // this.opacity = this._bullet._opacity;
      //
      // // Convert map X/Y into a screen coordinate to draw.
      // this.x = this._bullet.screenX();
      // this.y = this._bullet.screenY();
  };

})();
