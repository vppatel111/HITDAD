//=============================================================================
// SPFMeleeAttack
// v1.0
//
// TODOS:
// - Add variable distance collision detection.
// - Only allow player to melee attack active enemies
//=============================================================================

/*:
 * @plugindesc This plugin implements a melee attack where when the player
 * presses a key with "keyCode", the gamePlayer will use an item specified
 * by "itemID" and immediately incapacitate an enemy.
 *
 * @author Vishal Patel
 *
 * @param keyCode
 * @type number
 * @desc Key to press to perform melee attack.
 * @default 81
 *
 * @param itemID
 * @type number
 * @desc Item required to perform attack.
 * @default 1
 *
 *
 */
(function() {

  var parameters = PluginManager.parameters('SPFMeleeAttack');
  var attackKey = parseInt(parameters['keyCode']);
  var itemID = parseInt(parameters['itemID']);

  Input.SPFCustomKeypress = function(event) {
    if (event.keyCode === attackKey) {  // Q
        PerformAttack();
    }
  }

  document.addEventListener('keydown', Input.SPFCustomKeypress);

  function findItemById(idOfItem, listOfItems) {
      var itemToReturn = {};

      listOfItems.forEach(function(item) {
        if (item.id == idOfItem) {
          itemToReturn = item;
        }
      });

      return itemToReturn;
  }

  function getEnemyCollision(events) {

    var enemyEvent = {};
    events.forEach(function(event) {

      var eventJSON = SPF_ParseNote(event);
      if (eventJSON.npcType == SPF_NPCS.SECURITY_NPC) {
        enemyEvent = event;
      }
    });

    return enemyEvent;
  }

  // Checks collision of player with all events based on the direction they
  // are facing.
  function getEventsInDirectionOfCollision() {

    var direction = $gamePlayer.direction();

    switch (direction) {
      case 4: // Left
        if ($gamePlayer.isCollidedWithEvents($gamePlayer.x - 1, $gamePlayer.y)) {
          return $gameMap.eventsXyNt($gamePlayer.x - 1, $gamePlayer.y);
        }
        break;
      case 6: // Right
        if ($gamePlayer.isCollidedWithEvents($gamePlayer.x + 1, $gamePlayer.y)) {
          return $gameMap.eventsXyNt($gamePlayer.x + 1, $gamePlayer.y);
        }
        break;
    }

    return []; // No collision with events.

  }

  function PerformAttack() {

    // Check collision between all targets.
    var eventsHit = getEventsInDirectionOfCollision();

    // Do nothing if the player didn't collide with any events.
    if (eventsHit.length == 0) return;

    var item = findItemById(itemID, $gameParty.allItems());

    if (!SPF_isEmpty(item)) {

      // Figure out if we hit an enemy.
      var enemyHit = getEnemyCollision(eventsHit);

      // Incapacitate the enemy.
      if (!SPF_isEmpty(enemyHit)) {
        $gameParty.loseItem(item, 1);
        SPF_IncapacitateEnemy(enemyHit);
      }

    }

  }

})();
