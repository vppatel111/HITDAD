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

// These global variables are shared across ALL plugins.
// Be VERY careful with these to avoid conflicts.
var DIRECTION = {
   LEFT: 4,
   RIGHT: 6
};

var SPF_NPCS = {
  SECURITY_NPC: "security_npc"
};

// NOTE: SPF_CurrentlySelectedItem is only updated by the TMItemShortCut plugin
// however, TMItemShortCut initially returns null if the player has not opened
// the hotbar.

// ASSUMPTION: I assume that HITDAD by default has ONE pacifier item in
// the first slot of their inventory. This allows me to assume that this
// structure is always initialized.
var SPF_CurrentlySelectedItem = {};
var SPF_CSI = {};

// TODO: Convert this to an object later.
var SPF_Enemies = [];

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
// --------------------- End Helper functions -------------------------

function SPF_IsItemSelected(item) {
  if (SPF_CSI && item &&
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
      bitmap.drawCircle(25, 25, 15, 'red');
      this.bitmap = bitmap;

      // TODO: Add the custom bullet sprite into the game.
      // var bitmap = ImageManager.loadSystem("bullet");
      // this.bitmap = bitmap;

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

})();
