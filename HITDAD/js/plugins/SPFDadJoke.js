//=============================================================================
// SPFDadJoke
// v1.0
//
// TODO:
// - Implement actual telling of dad jokes while charging attack
// - Change "explosion" effect?
// - ALMOST WORKS, increase the width, might need to specify a width
// per object to print each joke correctly.
// - ALSO increase the time to cast dad joke to be able to read joke.
// - ALSO center the text in the middle.
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
  var CHARGE_TIME = 50;

  var DAD_JOKES = [
                    {
                      "charge": 0,
                      "text": "Just been fired from a job as an interrogator..."
                    },
                    {
                      "charge": 25,
                      "text": "I suppose I should have asked why..."
                    }
                  ];

  var dadJokeIndex = 0; // Keep track of which jokes have already been told.
  var currentJokeIndex = 0;

  var attackCharge = 0;

  var chargeAnimation;
  var jokeAnimation;

  function getDadJoke() {
      var joke = DAD_JOKES[dadJokeIndex];

      // Reset back to index 0 if all jokes have been told.
      if (dadJokeIndex < DAD_JOKES.length - 1) {
        ++dadJokeIndex;
      } else {
        dadJokeIndex = 0;
      }
  }

  document.addEventListener("mouseup", function (event) {
      // Only call if this item is equipped
      if ($dataMap &&  SPF_CSI && SPF_CSI.id === ITEM_ID) {
        // Reset the current charge if player release mouse button.
        attackCharge = 0;
        if (chargeAnimation) {
          chargeAnimation.remove();
          jokeAnimation.remove();
        }
      }

  });

  Game_Player.prototype.ChargeDadJoke = function() {
    chargeAnimation = new SPF_Sprite();
    jokeAnimation = new SPF_Sprite();

    // TODO:
    // Following the character with the progress bar is hard;
    // maybe put this above the selected item hotbar.
    var bitmap = new Bitmap(200, 200);

    // 50 * 2 is the max lenth of the progress bar => attackCharge @ full * 2
    bitmap.resetProgressBar(25, 25, CHARGE_TIME*2);
    currentJokeIndex = 0;

    var jokeBitmap = new Bitmap(200, 200);
    jokeBitmap.clearRect(0, 20, 200, 20);
    jokeBitmap.drawText(DAD_JOKES[currentJokeIndex].text, 0, 20, 200, 20, "center");
    jokeAnimation.bitmap = jokeBitmap;
    jokeAnimation.x = 300;
    jokeAnimation.y = 600;
    jokeAnimation.show();

    currentJokeIndex += 1;

    chargeAnimation.bitmap = bitmap;
    chargeAnimation.setUpdate(function() {
      attackCharge += 1;

      // Draw green progress bar at twice the length of charge and
      // with the color green.
      this.bitmap.drawProgressBar(25, 25, attackCharge * 2, 125);

      if (attackCharge >= CHARGE_TIME) {
        stunEnemiesInRadius();
        attackCharge = 0;
        chargeAnimation.remove();
        jokeAnimation.remove();
      }

      // Display the next part of the dad joke.
      if (attackCharge >= DAD_JOKES[currentJokeIndex].charge) {
        jokeBitmap.clearRect(0, 20, 200, 20);
        jokeBitmap.drawText(DAD_JOKES[currentJokeIndex].text, 0, 20, 200, 20, "center");
        // currentJokeIndex += 1;
      }

    });

    chargeAnimation.show();

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
