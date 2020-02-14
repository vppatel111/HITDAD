//=============================================================================
// SPFDadJoke
// v1.0
//
// TODO:
// - Add plugin parameters.
// - Implement actual telling of dad jokes while charging attack
// - Change "explosion" effect?
//=============================================================================

/*:
 * @plugindesc This plugin implements the dad joke attack.
 *
 * @author Vishal Patel
 *
 * @help
 * This plugin implements the dad joke attack where when a player selects
 * the item from the hotbar, they must press and hold the right mouse button
 * for N amount of time to "charge up the attack". When the player hits max charge,
 * we use the item with "itemID" and cause an "explosion" in a radius around
 * the player and all enemies withing the radius will be stunned.
 *
 * @param itemID
 * @type number
 * @desc Item required to perform attack.
 * @default 3
 *
 * @param stunRadius
 * @type number
 * @desc The number of pixels of the stun effect.
 * @default 200
 *
 */
(function() {

  var parameters = PluginManager.parameters('SPFDadJoke');
  var ITEM_ID = parseInt(parameters['itemID']);
  var STUN_RADIUS = parseFloat(parameters['stunRadius']);
  var STUN_RADIUS_TILES = STUN_RADIUS / 48; // Stun radius in tiles.

  var DAD_JOKES = [
                    ["Just been fired from a job as an interrogator...",
                     "I suppose I should have asked why..."]
                  ];
  var dadJokeIndex = 0; // Keep track of which jokes have already been told.

  var chargeAnimation;
  var progressBar;

  var attackCharge = 0;

  function getDadJoke() {
      var joke = DAD_JOKES[dadJokeIndex];

      // Reset back to index 0 if all jokes have been told.
      if (dadJokeIndex < DAD_JOKES.length - 1) {
        ++dadJokeIndex;
      } else {
        dadJokeIndex = 0;
      }
  }

  // document.addEventListener("mousedown", function (event) {
  //     // make sure not on phone or carrying a box and is left click
  //     if ($dataMap && !$gamePlayer.isCarrying() && !SPF_OnPhone(event) && event.button === 0 && false) {
  //
  //       var item = SPF_FindItemById(ITEM_ID);
  //       console.log("Here we gooo!", item, SPF_IsItemSelected(item));
  //
  //       if (!SPF_isEmpty(item) &&
  //            SPF_IsItemSelected(item) &&
  //           !Input._isItemShortCut()) { // Do not fire if hotbar is open.
  //
  //         chargeAttack();
  //       }
  //
  //     }
  // });

  document.addEventListener("mouseup", function (event) {
      // Only call if this item is equipped
      if ($dataMap &&  SPF_CSI && SPF_CSI.id === ITEM_ID) {
        // Reset the current charge if player release mouse button.
        attackCharge = 0;
        if (chargeAnimation) {
          chargeAnimation.remove();
          progressBar.remove();
        }
      }

  });

  function chargeAttack() {

    progressBar = new SPF_Sprite();

    // TODO:
    // Following the character with the progress bar is hard;
    // maybe put this above the selected item hotbar.
    var bitmap = new Bitmap(200, 200);

    // 50 * 2 is the max lenth of the progress bar => attackCharge @ full * 2
    bitmap.resetProgressBar(25, 25, 50*2);
    progressBar.bitmap = bitmap;

    chargeAnimation = new SPF_Sprite();
    chargeAnimation.setUpdate(function() {
      attackCharge += 1;

      // Draw green progress bar at twice the length of charge and
      // with the color green.
      progressBar.bitmap.drawProgressBar(25, 25, attackCharge * 2, 125);

      if (attackCharge >= 50) {
          stunEnemiesInRadius();
          attackCharge = 0;
          chargeAnimation.remove();
          progressBar.remove();
      }

    });

    progressBar.show();
    chargeAnimation.show();

    // TODO: Print a joke.

  }

  Game_Player.prototype.DadJoke = function() {
    progressBar = new SPF_Sprite();

    // TODO:
    // Following the character with the progress bar is hard;
    // maybe put this above the selected item hotbar.
    var bitmap = new Bitmap(200, 200);

    // 50 * 2 is the max lenth of the progress bar => attackCharge @ full * 2
    bitmap.resetProgressBar(25, 25, 50*2);
    progressBar.bitmap = bitmap;

    chargeAnimation = new SPF_Sprite();
    chargeAnimation.setUpdate(function() {
      attackCharge += 1;

      // Draw green progress bar at twice the length of charge and
      // with the color green.
      progressBar.bitmap.drawProgressBar(25, 25, attackCharge * 2, 125);

      if (attackCharge >= 50) {
        stunEnemiesInRadius();
        attackCharge = 0;
        chargeAnimation.remove();
        progressBar.remove();
      }

    });

    progressBar.show();
    chargeAnimation.show();

    // TODO: Print a joke.
  }

  function stunEnemiesInRadius() {

    // TODO: Any other effect I can use here?
    var explosion = new SPF_Sprite();
    var bitmap = new Bitmap(STUN_RADIUS * 2,
                            STUN_RADIUS * 2);

    bitmap.drawCircle(STUN_RADIUS,
                      STUN_RADIUS,
                      STUN_RADIUS, 'grey');

    explosion.bitmap = bitmap;

    explosion.visible = true;
    explosion.opacity = 255;

    // Draw explosion slightly higher then where it landed.
    explosion.x = SPF_MapXToScreenX($gamePlayer.x) - STUN_RADIUS;
    explosion.y = SPF_MapYToScreenY($gamePlayer.y) - STUN_RADIUS;

    explosion.spawnX = $gamePlayer.x;
    explosion.spawnY = $gamePlayer.y;

    // Make the smoke bomb slowly disperse
    explosion.setUpdate(function() {

      if (explosion.opacity > 0) {
        explosion.opacity -= 5;
      }

      // This ensures the explosion does not move when the screen moves.
      explosion.x = SPF_MapXToScreenX(this.spawnX) - STUN_RADIUS;
      explosion.y = SPF_MapYToScreenY(this.spawnY) - STUN_RADIUS;

    });

    explosion.show();

    // TODO: Stun the enemies caught in the radius of the blast
    // for a period of time instead of indefinitely.
    SPF_Enemies.forEach(function(enemy) {

      var distanceToExplosion = SPF_DistanceBetweenTwoPoints(enemy.x, enemy.y,
                                           explosion.spawnX, explosion.spawnY);

      if (distanceToExplosion < STUN_RADIUS_TILES) {
        SPF_IncapacitateEnemy(enemy);
      }

    });

    // Decrement item after bomb is thrown
    // ASSUMPTION: Item is not empty because we check item before chargeAttack()
    // therefore it should still be defined.
    var item = SPF_FindItemById(ITEM_ID);
    $gameParty.loseItem(item, 1);

  }

})();
