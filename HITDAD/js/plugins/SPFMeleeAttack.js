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
 * @param swingRange
 * @type number
 * @desc Number of pixels of swing arc.
 * @default 16
 *
 * @param swingSpeed
 * @type number
 * @desc The speed of the swing in degrees per frame.
 * @default 5
 *
 * @param verticalOffset
 * @type number
 * @desc The vertical position of the animation relative to $gamePlayer
 * @default 50
 *
 * @param horizontalOffset
 * @type number
 * @desc The horizontal position of the animation relative to $gamePlayer
 * @default 7
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

  var SWING_RANGE = parseInt(parameters['swingRange']);
  var SWING_SPEED = parseInt(parameters['swingSpeed']);

  // Change position of attack animation.
  var VERTICAL_OFFSET = parseInt(parameters['verticalOffset']);
  var HORIZONTAL_OFFSET = parseInt(parameters['horizontalOffset']);;

  var bottleAnimation;
  var swingDegrees;

  function rotateSwing(angle) {
    return (SWING_SPEED * Math.PI) / 180;
  }

  Game_Player.prototype.SPF_MeleeAttack = function() {

    let item = SPF_FindItemById(itemID);
    let enemyHit = SPF_LineTrace(SPF_Enemies, 2.0, 0.0, 2.0, 0.0, SPF_IsEnemyPacified);
    let direction = $gamePlayer.direction();

    if (bottleAnimation) { bottleAnimation.remove(); }

    let bottleBitmap = new Bitmap(32, 32);
    SPF_LoadIconOntoBitmap(bottleBitmap, item.iconIndex);

    bottleAnimation = new SPF_Sprite();
    bottleAnimation.bitmap = bottleBitmap;

    // This function changes the pivot for rotation to (x,y) = (16, 32 + SWING_RANGE).
    bottleAnimation.setTransform(0, 0, 1.3, 1.3, 0, 0, 0, 16, 32 + SWING_RANGE);

    swingDegrees = 0;
    bottleAnimation.setUpdate(function() {

      bottleAnimation.x =
      SPF_MapXToScreenX($gamePlayer._realX) + HORIZONTAL_OFFSET;

      if (direction === DIRECTION.LEFT) {
        bottleAnimation.x -= 10; // Account for size of HITDAD's sprite.
      }

      bottleAnimation.y =
      SPF_MapYToScreenY($gamePlayer._realY) - VERTICAL_OFFSET;

      // Add 90 degree offset to rotate correctly.
      bottleAnimation.rotation = swingDegrees;

      // Note: Circle used by PixiJS is shifted where 0 degrees is at (0, 1) and
      // 0 => 2*Pi is clockwise.
      if (swingDegrees > (Math.PI/2) || swingDegrees < -(Math.PI/2)) {
        this.remove();
      } else {

        if (direction === DIRECTION.RIGHT) {
          swingDegrees += rotateSwing(swingDegrees);
        } else {
          swingDegrees -= rotateSwing(swingDegrees);
        }

      }

    });

    bottleAnimation.show();

    if (!enemyHit) return;

    if (!SPF_isEmpty(item) && SPF_IsItemSelected(item)) {

      $gameParty.loseItem(item, 1);
      SPF_IncapacitateEnemy(enemyHit);
      AudioManager.playSe(SE_MILKBOTTLE);

    }
  }

})();
