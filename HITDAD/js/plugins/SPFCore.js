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

var DEBUG = false;

// These global variables are shared across ALL plugins.
// Be VERY careful with these to avoid conflicts.

const _defaultWindowHeight = 691;
const _defaultWindowWidth = 1000;
// Width / Height
const desiredAspectRatio = _defaultWindowWidth / _defaultWindowHeight;

var showHotbar = true;
var showHealth = true;

// Makes the hotbar active when an blocking event is not running
// and a game message is not being displayed. Refactored for use with item UI.
function canShowHotbar() {
    return !$gameMap.isEventRunning() &&
    !$gameMessage.isBusy() &&
    showHotbar;
}

var DIRECTION = {
   LEFT: 4,
   RIGHT: 6
};

var SPF_NPCS = {

    NORMAL_GUARD: 1,
    MASKED_GUARD: 2,
    DEAF_GUARD: 3

};

var BOX_TYPE = {
  ONE_BY_ONE: {type: 1, x: 0,  y: 0, width: 1, height: 1},
  ONE_BY_TWO: {type: 2, x: 0,  y: -1, width: 1, height: 2},
  THREE_BY_ONE: {type: 3, x: -1, y: 0, width: 3, height: 1},
};

// Holds sprites for trajectory
var SPF_TRAJECTORY = [];

// Scaled to screen size, set in SPF_ScaledClick
var MOUSE_POSITION = {
    x: 0.0,
    y: 0.0,
    scale: 0.0,

    distance: function() {
        return this.x - $gamePlayer.screenX();
    },

    toRight: function() {
        return this.distance() > 0;
    },
}

// NOTE: SPF_CurrentlySelectedItem is only updated by the TMItemShortCut plugin
// however, TMItemShortCut initially returns null if the player has not opened
// the hotbar.

// ASSUMPTION: I assume that HITDAD by default has ONE pacifier item in
// the first slot of their inventory. This allows me to assume that this
// structure is always initialized.
var SPF_CurrentlySelectedItem = {};
var SPF_CSI = {
    name:""
};

var SPF_Enemies = [];
var SPF_Boxes = [];

// Defines a rectanglular hitbox for HITDAD units are in tiles.
// The (x, y) coordinates define the top left corner of hitbox.
// In this case, define a 2 block high hitbox that starts at head
// and extends down to legs.
var HIT_DAD_HITBOX = {x: -0.5, y: -2, width: 1, height: 2};

function actualScreenWidth() {
    return MOUSE_POSITION.scale * _defaultWindowWidth;
}

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
function SPF_CollidedWithBoxes(x, y, collider, boxCollider, boxesAtLocation) {

  // Get all events on a tile as well as one tile above, below, to the right and
  // to the left of the tile.
  var collidedWithBoxes = false;
  boxesAtLocation.forEach(function(event) {

    // HACK: If it has collideH and collideW colliders and
    // has property "can_pickup", its very likely its a box.
    if (event._collideH && event._collideW && event._canPickup &&
        event._boxType == boxCollider.type) {

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

function getAspectRatio() {
    return innerWidth / innerHeight;
}

function calculateMouseDistanceToPlayer(click) {
    return click.x - $gamePlayer.screenX();
}

function SPF_ScaledClick(click) {

    let topPadding = 0;
    let leftPadding = 0;
    let windowHeight = _defaultWindowHeight;
    let windowWidth = _defaultWindowWidth;
    let scale = innerWidth / windowWidth;

    if (desiredAspectRatio > getAspectRatio()) {
        windowHeight *= innerWidth / windowWidth;
        topPadding = (innerHeight - windowHeight) / 2;
    } else if (desiredAspectRatio < getAspectRatio()) {
        scale = innerHeight / windowHeight;
        windowWidth *= innerHeight / windowHeight;
        leftPadding = (innerWidth - windowWidth) / 2;
    }

    MOUSE_POSITION.x = (click.pageX - leftPadding) / scale;
    MOUSE_POSITION.y = (click.pageY - topPadding) / scale;
    MOUSE_POSITION.scale = scale;

    return MOUSE_POSITION;
}

// Calculate the angle between the player and mouse and returns
// the angle in radians.
function SPF_AngleToPlayer(mouseX, mouseY,
                           playerX, playerY) {

   return Math.atan2(playerY - mouseY, playerX - mouseX);

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

function SPF_IsEnemyStunned(enemy) {
    return enemy._state > 1;
}

function SPF_EnemyStartPatrol(enemy) {
        SPF_ChangeEnemyState(enemy, SPF_ENEMYSTATE.PATROLLING);
}

function SPF_EnemyStartShoot(enemy) {
        SPF_ChangeEnemyState(enemy, SPF_ENEMYSTATE.SHOOTING);
}

function SPF_IsEnemyPacified(enemy) {
    return enemy._state === SPF_ENEMYSTATE.PACIFIED;
}

function SPF_IncapacitateEnemy(enemy) {
    SPF_ChangeEnemyState(enemy, SPF_ENEMYSTATE.PACIFIED);
}

function SPF_EnemyPauseMovement(enemy, pause) {
    enemy.setMoveSpeed(pause ? 0 : 4);
    enemy.setStepAnime(!pause);
    enemy.setWalkAnime(!pause);
    if (enemy._movementPauseCountDown > 0) enemy._movementPauseCountDown--;
}

// Stun duration is in units of frames.
function SPF_StunEnemy(enemy, stunType, stunDuration) {
  var stunTimerAnimation = new SPF_Sprite();
  stunTimerAnimation.bitmap = new Bitmap(200, 200);

  // Draw a full progress bar.
  stunTimerAnimation.bitmap.resetProgressBar(25, 25, 100);
  stunTimerAnimation.bitmap.drawProgressBar(25, 25, 100, 125);

  // Position just above enemy head.
  stunTimerAnimation.x = SPF_MapXToScreenX(enemy._x) - 50;
  stunTimerAnimation.y = SPF_MapYToScreenY(enemy._y) - 100;

  if (SPF_IsEnemyStunned(enemy) && enemy.stunTimer) {

    // Only update stun duration if new stun duration is longer
    // then remaining stun duration.
    if (enemy.stunTimer._frames < stunDuration) {
      enemy.stunTimer.resetTimerFrames(stunDuration);
    }

  } else {
      SPF_ChangeEnemyState(enemy, stunType);
    enemy._state = stunType;
    enemy.stunTimer = new SPF_Timer();
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

}

function SPF_UnstunEnemy(enemy) {
    if (!SPF_IsEnemyPacified(enemy)) {
        SPF_EnemyStartPatrol(enemy);
    }

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


/** Sprite Sheet Switching **/

const SPF_SPRITESHEET = {
    DEFAULT: 0,
    FALLING: 1,
    CARRYING: 2,
    LANDING:3,
}

/**
 * @param {SPF_SPRITESHEET} name
 */
function SPF_ChangeSpriteSheet(name) {

    let file;
    let index;

    switch(name) {
        case SPF_SPRITESHEET.DEFAULT:
            file = "!hitdad";
            index = 0;
            break;
        case SPF_SPRITESHEET.FALLING:
            file = "!hitdad";
            index = 1;
            break;
        case SPF_SPRITESHEET.CARRYING:
            file = "!hitdad_carry"
            index = 0;
            break;
        case SPF_SPRITESHEET.LANDING:
            $gamePlayer.isCarrying() ?
                SPF_ChangeSpriteSheet(SPF_SPRITESHEET.CARRYING) :
                SPF_ChangeSpriteSheet(SPF_SPRITESHEET.DEFAULT);
            break;
        default:
            console.log("Error switching sprite sheet");
            break;
    }

    if (file) {
        $gameActors.actor(1).setCharacterImage(file, index);
        $gamePlayer.refresh();
    }
}

const SPF_ENEMYSTATE = {
    PATROLLING: 0,
    SHOOTING: 1,
    DIAPERSTUNNED: 2,
    JOKESTUNNED: 3,
    PACIFIED:4,
}

function SPF_ChangeEnemyState(enemy, state) {

    if (enemy._state === state) return;

    if (state === SPF_ENEMYSTATE.PACIFIED)
    {
        // Puts enemy behind player
        enemy._priorityType = 0;
    }
    enemy._state = state;

    let file;
    let index;

    switch(state) {
        case SPF_ENEMYSTATE.PATROLLING:
            file = "!hitdad_carry";
            index = 3;
            break;
        case SPF_ENEMYSTATE.SHOOTING:
            file = "!hitdad_carry";
            index = 2;
            break;
        case SPF_ENEMYSTATE.DIAPERSTUNNED:
            file = "!hitdad_knockout";
            index = 1;
            break;
        case SPF_ENEMYSTATE.JOKESTUNNED:
            file = "!hitdad_knockout";
            index = 0;
            break;
        case SPF_ENEMYSTATE.PACIFIED:
            file = "!hitdad_pacified";
            index = 0;
            break;
        default:
            console.log("Error switching sprite sheet");
            break;
    }

    if (file) {
        enemy.setImage(file, index);
        enemy.refresh();
    }
}


/**
 * Do a line trace forward from the player, return first hit event in range or null if none in range
 *
 * @method SPF_LineTrace
 * @param {Array} events The list of events to check for
 * @param {Number} range The max distance for the line trace from the trace start (in tiles or fraction of tiles)
 * @param {Number} traceStartOffset The offset for the start of the line trace from the player (+ moves start in front of player, - behind)
 * @param {Number} verticalStartOffset The offset for the center of the vertical tolerance
 * @param {Number} verticalTolerance The y tolerance for the line trace.
 * @param {CallableFunction} checkFunction Extra function to pass in, if the function returns true for an event, the event is ignored.
 */
function SPF_LineTrace(events, range, traceStartOffset = 0.0, verticalTolerance= 2.0, verticalStartOffset = 0, checkFunction = null) {
    let direction = $gamePlayer.direction();

    // Adjusts trace start if an offset is set
    let xTraceStart = direction === DIRECTION.RIGHT ? $gamePlayer._realX + traceStartOffset : $gamePlayer._realX - traceStartOffset;

    let closestEvent;
    let closestEventDistance;

    events.forEach(function(event) {

        if (typeof checkFunction === "function") {
            if (checkFunction(event)) return;
        }

        let distanceToBox =  event._realX - xTraceStart; // Will be positive if box is to right of player

        // Stop execution if direction of object does not match direction of player
        if (!(distanceToBox > 0 === (direction === DIRECTION.RIGHT))) return;

        let verticalOffset = Math.abs($gamePlayer._realY - event._realY + verticalStartOffset);

        let forwardDistanceToBox = Math.abs(distanceToBox);

        // Assigns closest event if object is in range of the trace
        if (forwardDistanceToBox <= range && forwardDistanceToBox >= 0.0 && verticalOffset < verticalTolerance) {
            if (!closestEvent || closestEventDistance > forwardDistanceToBox) {
                closestEventDistance = forwardDistanceToBox;
                closestEvent = event;
            }
        }
    });

    if (closestEvent) {
        return closestEvent;
    }
}

(function() {

  var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    aliasPluginCommand.call(this, command, args);

    switch(command)
    {
        case "Initialize":
            initializeEnemies();
            initializeBoxes();
            initializePlayer();
            break;
        case "HideUI":
            showHotbar = false;
            showHealth = false;
            break;
        case "HideHotbar":
            showHotbar = false;
            break;
        case "HideHealth":
            showHotbar = false;
            break;
        case "ShowUI":
            showHealth = true;
            showHotbar = true;
            break;
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

    let enemyEvents = [];
    events.forEach(function(event) {
        if (event._npcType) {
        enemyEvents.push(event);
      }
    });

    return enemyEvents;
  }

    function initializeBoxes() {
      let allEvents = $gameMap.events();
      SPF_Boxes = getPickupableEvents(allEvents);
    }

    function getPickupableEvents(events) {
        let pickupableEvents = [];

        events.forEach(function(event) {
            if (event._canPickup) {
                pickupableEvents.push(event);
            }
        });

        return pickupableEvents;
    }

  SPF_Projectile.prototype.initialize = function(directionX) {
    this._opacity = 0;
    this.setup($gamePlayer.x, $gamePlayer.y - 1, 0.01);

    // Default sprite direction is left, flip sprite if moving in the other
    // direction.
    this._sprite = new SPF_Projectile_Sprite(this);

    if (directionX && directionX == DIRECTION.RIGHT) {
      this._sprite.scale.x = -1;
    }

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

  SPF_Timer.prototype.resetTimerFrames = function(count) {
    this._initialCount = count;
    this._frames = count;
  }

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
