//=============================================================================
// SPFCore
// v1.0
//
// To initialize enemies:
// Each level needs ONE event with the following calls:
// Plugin command: spf_initializeEnemies()
// Wait: 60 frames
// Erase Event (under character).
//=============================================================================

/*:
 * @plugindesc This plugin is required for all SPF plugins to work.
 * This plugin assumes that TMJumpAction plugin is also installed. Also each level
 * requires some initialization, see above.
 *
 * IMPORTANT: Import this plugin BEFORE the other SPF plugins.
 *
 * @author Vishal Patel
 */

var DEBUG = true;

// These global variables are shared across ALL plugins.
// Be VERY careful with these to avoid conflicts.
var DIRECTION = {
   LEFT: 4,
   RIGHT: 6
};

var SPF_NPCS = {
  SECURITY_NPC: "security_npc"
};

var BOX_TYPE = {
  ONE_BY_ONE: {x: 0,  y: 0, width: 1, height: 1},
  ONE_BY_TWO: {x: 0,  y: -1, width: 1, height: 2},
  THREE_BY_ONE: {x: -1, y: 0, width: 3, height: 1},
};

// NOTE: SPF_CurrentlySelectedItem is only updated by the TMItemShortCut plugin
// however, TMItemShortCut initially returns null if the player has not opened
// the hotbar.

// ASSUMPTION: I assume that HITDAD by default has ONE pacifier item in
// the first slot of their inventory. This allows me to assume that this
// structure is always initialized.
var SPF_CurrentlySelectedItem = {};
var SPF_CSI = {};

var SPF_Enemies = [];

// Defines a rectanglular hitbox for HITDAD units are in tiles.
// The (x, y) coordinates define the top left corner of hitbox.
// In this case, define a 2 block high hitbox that starts at head
// and extends down to legs.
var HIT_DAD_HITBOX = {x: -0.5, y: -2, width: 1, height: 2};

function SPF_CollidedWithPlayerCharacter(x, y, collider) {
  var point_l1 = {x: $gamePlayer._realX + HIT_DAD_HITBOX.x,
                  y: $gamePlayer._realY + HIT_DAD_HITBOX.y};
  var point_l2 = {x: x + collider.x,
                  y: y + collider.y};

  var point_r1 = {x: $gamePlayer._realX + HIT_DAD_HITBOX.x + HIT_DAD_HITBOX.width,
                  y: $gamePlayer._realY + HIT_DAD_HITBOX.y + HIT_DAD_HITBOX.height};
  var point_r2 = {x: x + collider.x + collider.width,
                  y: y + collider.y + collider.height};
  return SPF_DoesRectanglesOverlap(point_l1, point_r1, point_l2, point_r2);
}

// TODO: Determine what we collided into was really a box.
// Each box needs a collider on it.
function SPF_CollidedWithBoxes(x, y, collider, boxCollider) {

  //console.log(x, y, collider);

  // Get all events on a specific tile.
  var boxesAtLocation = $gameMap.eventsXy(Math.floor(x), Math.floor(y));

  var collidedWithBoxes = false;
  boxesAtLocation.forEach(function(event) {

    console.log(event);

    // HACK: If it has collideH and collideW colliders and
    // has property "can_pickup", its very likely its a box.
    if (event._collideH && event._collideW && event._canPickup) {

      // Actual width is always half the real width => due to TMJumpAction.
      var BOX_HITBOX = boxCollider;

      if (DEBUG) { // Draw a collider on impact.
        var getColliderPoints = function() {
          return SPF_GetColliderPoints(event._x, event._y, BOX_HITBOX);
        }
        SPF_DrawCollider("Box", getColliderPoints, BOX_HITBOX);
      }

      var point_l1 = {x: event._x + BOX_HITBOX.x,
                      y: event._y + BOX_HITBOX.y};
      var point_l2 = {x: x + collider.x,
                      y: y + collider.y};

      var point_r1 = {x: event._x + BOX_HITBOX.x + BOX_HITBOX.width,
                      y: event._y + BOX_HITBOX.y + BOX_HITBOX.height};
      var point_r2 = {x: x + collider.x + collider.width,
                      y: y + collider.y + collider.height};
      if (SPF_DoesRectanglesOverlap(point_l1, point_r1, point_l2, point_r2)) {
        collidedWithBoxes = true;
      }
    }

  });

  return collidedWithBoxes;

}

// Checks if on phone or answering phone, takes mouse event as parameter
function SPF_OnPhone(event) {
    return ($gameSwitches.value(10) && event.pageY < 150.0 && event.pageY < 150.0) || $gameSwitches.value(11);
}

function SPF_Projectile() {
  this.initialize.apply(this, arguments);
}

// Sprite wrapper that let's us easily change the update
// behaviour and provides some other handy functions.
function SPF_Sprite() {
    this.initialize.apply(this, arguments);
}

function SPF_Timer() {
  this.initialize.apply(this, arguments);
}

// --------------------- Helper functions ----------------------------
function SPF_isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function SPF_RoundToTwoDecimalPlaces(num) {
  return Math.round( num * 100 + Number.EPSILON ) / 100;
}

function SPF_DistanceBetweenTwoPoints(x1, y1, x2, y2) {
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

// Returns true if 2 rectangles overlap.
// Where l1, l2 is the top left corners of rectangle 1 and 2 respectively and
// r1, r2 is the bottom right corners of rectangle 1 and 2 respectively.
// Credit to: https://www.geeksforgeeks.org/find-two-rectangles-overlap/
function SPF_DoesRectanglesOverlap(point_l1, point_r1, point_l2, point_r2) {

  // If one rectangle is on left side of other
  if (point_l1.x > point_r2.x || point_l2.x > point_r1.x)
      return false;

  // If one rectangle is above other
  if (point_l1.y > point_r2.y || point_l2.y > point_r1.y)
      return false;

  return true;

}
// --------------------- End Helper functions -------------------------

function SPF_LoadIconOntoBitmap(sourceBitmap, iconIndex) {
  var bitmap = ImageManager.loadSystem('IconSet');
  var pw = Window_Base._iconWidth;
  var ph = Window_Base._iconHeight;
  var sx = iconIndex % 16 * pw;
  var sy = Math.floor(iconIndex / 16) * ph;

  sourceBitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
}

function SPF_IsItemSelected(item) {
  if (item &&
      (SPF_CurrentlySelectedItem || SPF_CSI) &&
      (SPF_CurrentlySelectedItem.id == item.id|| SPF_CSI.id == item.id) ) {
    return true;
  }

  return false;
}

function SPF_MapXToScreenX(mapX) {
  var tw = $gameMap.tileWidth();
  return Math.round($gameMap.adjustX(mapX) * tw);
}

function SPF_MapYToScreenY(mapY) {
  var th = $gameMap.tileHeight();
  return Math.round($gameMap.adjustY(mapY) * th);
}

function SPF_IncapacitateEnemy(enemy) {
  $gameSelfSwitches.setValue([$gameMap._mapId, enemy.eventId(), 'A'], true);
}

// Stun duration is in units of frames.
function SPF_StunEnemy(enemy, stunDuration) {
  $gameSelfSwitches.setValue([$gameMap._mapId, enemy.eventId(), 'B'], true);
  enemy.stunTimer = new SPF_Timer();
  enemy._isStunned = true;

  var stunTimerAnimation = new SPF_Sprite();
  stunTimerAnimation.bitmap = new Bitmap(200, 200);

  // Draw a full progress bar.
  stunTimerAnimation.bitmap.resetProgressBar(25, 25, 100);
  stunTimerAnimation.bitmap.drawProgressBar(25, 25, 100, 125);

  // Position just above enemy head.
  stunTimerAnimation.x = SPF_MapXToScreenX(enemy._x) - 50;
  stunTimerAnimation.y = SPF_MapYToScreenY(enemy._y) - 100;

  enemy.stunTimer.start(stunDuration,
    function () { //onExpire
      SPF_UnstunEnemy(enemy);
      stunTimerAnimation.remove();
    },
    function() { // onTick
      stunTimerAnimation.bitmap.resetProgressBar(25, 25, 100);
      stunTimerAnimation.bitmap.drawProgressBar(25, 25, this.getAsProgress(), 125);

      stunTimerAnimation.x = SPF_MapXToScreenX(enemy._x) - 50;
      stunTimerAnimation.y = SPF_MapYToScreenY(enemy._y) - 100;
    });

    stunTimerAnimation.show();
}

function SPF_UnstunEnemy(enemy) {
  $gameSelfSwitches.setValue([$gameMap._mapId, enemy.eventId(), 'B'], false);
  enemy._isStunned = false;
  enemy.stunTimer = {};
}

function SPF_FindItemById(idOfItem) {

    var listOfItems = $gameParty.allItems();
    var itemToReturn = {};

    listOfItems.forEach(function(item) {
      if (item.id == idOfItem) {
        itemToReturn = item;
      }
    });

    return itemToReturn;
}

/*
  Use event notes field to keep track of types
  ex) {"npcType": "security_npc"}
*/

// Converts Note JSON into a JS object.
function SPF_ParseNote(event) {

  var parsedJSON = {};
  try {
      parsedJSON = JSON.parse(event.event().note);
  } catch(e) {
      // Do nothing...
  }

  return parsedJSON;
}

(function() {

  var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    aliasPluginCommand.call(this, command, args);

    // TODO: Rename this to initialize.
    if (command === 'spf_initializeEnemies()') {
      initializeEnemies();
      initializePlayer();
    }
  };

  function initializeEnemies() {
    var allEvents = $gameMap.events();
    SPF_Enemies = getEnemyEvents(allEvents);
  }

  // The currently selected item by default is the first in the
  // player's inventory.
  function initializePlayer() {
    SPF_CurrentlySelectedItem = $gameParty.allItems()[0];
  }

  function getEnemyEvents(events) {

    var enemyEvents = [];
    events.forEach(function(event) {

      var eventJSON = SPF_ParseNote(event);

      if (!SPF_isEmpty(eventJSON) &&
          eventJSON.npcType == SPF_NPCS.SECURITY_NPC) {

        enemyEvents.push(event);
      }

    });

    return enemyEvents;
  }

  SPF_Projectile.prototype.initialize = function(override_projectile) {
    this._opacity = 0;
    this.setup($gamePlayer.x, $gamePlayer.y - 1, 0.01);

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
    this._opacity = 0;
    SceneManager._scene.removeChild(this._sprite);
  };

  function SPF_Projectile_Sprite() {
      this.initialize.apply(this, arguments);
  }

  SPF_Projectile_Sprite.prototype = Object.create(Sprite.prototype);
  SPF_Projectile_Sprite.prototype.constructor = SPF_Projectile_Sprite;
  SPF_Projectile_Sprite.prototype.initialize = function (projectile) {
      Sprite.prototype.initialize.call(this);

      var bitmap = ImageManager.loadSystem("BulletIcon");
      this.bitmap = bitmap;
      // if (bitmap) {
      //   this.bitmap = bitmap;
      // } else {
      //   var bitmap = new Bitmap(100, 100);
      //   bitmap.drawCircle(25, 25, 15, 'red');
      //   this.bitmap = bitmap;
      // }

      // Bullet keeps track of projectile X & Y in map.
      this._bullet = projectile;

      this.visible = true;
      this.opacity = 255;

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

  SPF_Sprite.prototype = Object.create(Sprite.prototype);
  SPF_Sprite.prototype.constructor = SPF_Sprite;
  SPF_Sprite.prototype.initialize = function (bitmap) {
      Sprite.prototype.initialize.call(this);
  };

  // Set the update callback.
  SPF_Sprite.prototype.setUpdate = function (updateFunction) {
      this._update = updateFunction;
  };

  SPF_Sprite.prototype.show = function () {
    SceneManager._scene.addChild(this);
  }

  SPF_Sprite.prototype.remove = function () {
    SceneManager._scene.removeChild(this);
  }

  SPF_Sprite.prototype.update = function () {
      Sprite.prototype.update.call(this);

      if (typeof this._update === "function") {
        this._update();
      }

  };

  // SPF_Message.prototype = Object.create(Window_Message.prototype);
  // SPF_Message.prototype.constructor = SPF_Message;
  //
  // SPF_Message.prototype.initialize = function() {
  //     Window_Message.prototype.initialize.call(this);
  // }
  //
  // SPF_Message.prototype.close

  SPF_Timer.prototype = Object.create(Game_Timer.prototype);
  SPF_Timer.prototype.constructor = SPF_Timer;
  SPF_Timer.prototype.initialize = function () {
      Game_Timer.prototype.initialize.call(this);

      this._initialCount = 0;

      //HACK: Piggyback off of sprite to update our timer.
      //TODO: Allow the user to pass in a sprite that the timer will be going on
      // so we are not creating extra sprites.
      var self = this; // Use SPF_Timer in SPF_Sprite.
      this._sceneElement = new SPF_Sprite();
      this._sceneElement.setUpdate(function() {
        if (self._working && self._frames > 0) {
              self._frames--;
              if (self.onTick) { self.onTick() };
              if (self._frames === 0) {
                  self.onExpire();

                  // Remove from scene when timer
                  SceneManager._scene.removeChild(this);
              }
          }
      });
      this._sceneElement.show();
  };

  // TODO: Use check for isInDialog() to avoid updating enemies when player
  // is doing things.

  SPF_Timer.prototype.start = function(count, onExpireCallback, onTick) {
    Game_Timer.prototype.start.call(this, count);
    // Change the onExpire to call our custom function
    this.onExpire = onExpireCallback;
    if (onTick) { this.onTick = onTick; }
    this._initialCount = count;
  }

  // Returns the time left as a number from 100-0, useful for using in a
  // progress bar element.
  SPF_Timer.prototype.getAsProgress = function() {
      return Math.round( (this._frames / this._initialCount) * 100);
  }

})();
