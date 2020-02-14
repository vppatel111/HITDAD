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
 * @param soundEffect
 * @desc Sound effect for pacifier attack
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param soundEffectParams
 * @type string
 * @desc Parameters for pacifier sound effect ( {"volume":90, "pitch":100, "pan":0} )
 * @default {"volume":90, "pitch":100, "pan":0}
 */
(function() {

  var parameters = PluginManager.parameters('SPFMeleeAttack');
  var attackKey = parseInt(parameters['keyCode']);
  var itemID = parseInt(parameters['itemID']);
  let sePacify = JSON.parse(parameters['soundEffectParams'] || '{}');
  sePacify.name = parameters['soundEffect'] || '';

  Input.SPFCustomKeypress = function(event) {
    if (event.keyCode === attackKey) {  // Q
        PerformAttack();
    }
  }

  document.addEventListener('keydown', Input.SPFCustomKeypress);

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

    var item = SPF_FindItemById(itemID);

    if (!SPF_isEmpty(item) && SPF_IsItemSelected(item)) {

      // Figure out if we hit an enemy.
      var enemyHit = getEnemyCollision(eventsHit);

      // Incapacitate the enemy.
      if (!SPF_isEmpty(enemyHit)) {
        $gameParty.loseItem(item, 1);
        SPF_IncapacitateEnemy(enemyHit);
        AudioManager.playSe(sePacify);
      }

    }

  }

  Game_Player.prototype.SPF_MeleeAttack = function() {

    // Check collision between all targets.
    let eventsHit = getEventsInDirectionOfCollision();

    // Do nothing if the player didn't collide with any events.
    if (eventsHit.length === 0) return;

    let item = SPF_FindItemById(itemID);

    if (!SPF_isEmpty(item) && SPF_IsItemSelected(item)) {

      // Figure out if we hit an enemy.
      var enemyHit = getEnemyCollision(eventsHit);

      // Incapacitate the enemy.
      if (!SPF_isEmpty(enemyHit)) {
        $gameParty.loseItem(item, 1);
        SPF_IncapacitateEnemy(enemyHit);
        AudioManager.playSe(sePacify);
      }

    }

  }

})();
