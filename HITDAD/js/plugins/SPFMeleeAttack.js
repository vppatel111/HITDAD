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
  var itemID = parseInt(parameters['itemID']);
  let sePacify = JSON.parse(parameters['soundEffectParams'] || '{}');
  sePacify.name = parameters['soundEffect'] || '';


  Game_Player.prototype.SPF_MeleeAttack = function() {

    let enemyHit = SPF_LineTrace(SPF_Enemies, 2.0, 0.0, 2.0, SPF_IsEnemyPacified);

    if (!enemyHit) return;

    let item = SPF_FindItemById(itemID);

    if (!SPF_isEmpty(item) && SPF_IsItemSelected(item)) {

      $gameParty.loseItem(item, 1);
      SPF_IncapacitateEnemy(enemyHit);
      AudioManager.playSe(sePacify);

    }
  }

})();
