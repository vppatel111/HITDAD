//=============================================================================
// SPFCore
// v1.0
//
//=============================================================================

/*:
 * @plugindesc This plugin is required for all SPF plugins to work.
 * This plugin assumes that TMJumpAction plugin is also installed.
 *
 * @author Vishal Patel
 */

// These global variables are shared across ALL plugins.
// Be VERY careful with these to avoid conflicts.
var DIRECTION = {
   LEFT: 4,
   RIGHT: 6
};

var SPF_NPCS = {
  SECURITY_NPC: "security_npc"
};

function SPF_Projectile() {
  this.initialize.apply(this, arguments);
}

function SPF_isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/*
  Use event notes field to keep track of event state.
  ex) {"npcType": "security_npc", "isStunned": "false"}

*/

// Converts Note JSON into a JS object.
function SPF_ParseNote(event) {

  var parsedJSON = {};
  try {
      parsedJSON = JSON.parse(event.event().note);
      // console.log("Actually parsed: ", parsedJSON);
  } catch(e) {
      // Do nothing...
  }

  return parsedJSON;
}

(function() {

  SPF_Projectile.prototype.initialize = function(override_projectile) {
    this._opacity = 0;
    this.setup($gamePlayer.x, $gamePlayer.y - 1, 0.01);

    console.log("This is override", override_projectile);

    // If an override of SPF_Projectile is passed in use that, otherwise
    // use default SPF_Projectile object.
    this._sprite = new SPF_Projectile_Sprite(override_projectile ||
                                             this);

  };

  SPF_Projectile.prototype.setup = function (x, y, vx) {
    this._opacity = 255;
    this._x = x;
    this._y = y;
    this._vx = vx;
  }

  SPF_Projectile.prototype.collideMap = function() {
    var x = Math.floor(this._x);
    var y = Math.floor(this._y);

    // Implemented by TMJumpAction plugin.
    return !$gameMap.checkPassageBullet(x, y);
  }

  // Need to account for tile width to stay on tile
  // the projectile was spawned.
  SPF_Projectile.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round($gameMap.adjustX(this._x) * tw);
  };

  SPF_Projectile.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round($gameMap.adjustY(this._y) * th);
  };

  // If you define an update, it will be updated.
  SPF_Projectile.prototype.update = function () {
    this._x += this._vx;

    if (this.collideMap()) {
      this.erase();
    }

  }

  SPF_Projectile.prototype.erase = function() {
    // TODO: Remove the projectile completely instead
    // of just making it disappear.
    this._opacity = 0;
  };

  function SPF_Projectile_Sprite() {
      this.initialize.apply(this, arguments);
  }

  SPF_Projectile_Sprite.prototype = Object.create(Sprite.prototype);
  SPF_Projectile_Sprite.prototype.constructor = SPF_Projectile_Sprite;
  SPF_Projectile_Sprite.prototype.initialize = function (projectile) {
      Sprite.prototype.initialize.call(this);

      var bitmap = new Bitmap(100, 100);
      bitmap.drawCircle(25, 25, 15, 'white');
      this.bitmap = bitmap;

      // Bullet keeps track of projectile X & Y in map.
      this._bullet = projectile;

      this.visible = true;
      this.opacity = 255;

      console.log($gameMap.adjustY(this._bullet._y),
                  $gameMap.adjustY(this._bullet._x))

      SceneManager._scene.addChild(this);
  };

  SPF_Projectile_Sprite.prototype.update = function () {
      Sprite.prototype.update.call(this);

      // Update the bullet position
      this._bullet.update();

      this.opacity = this._bullet._opacity;

      // Convert map X/Y into a screen coordinate to draw.
      this.x = this._bullet.screenX();
      this.y = this._bullet.screenY();
  };

})();
