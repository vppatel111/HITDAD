//=============================================================================
// SPFDadJoke
// v1.0
//
// TODO:
// - ALSO increase the time to cast dad joke to be able to read joke.
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
 * @param stunDuration
 * @type number
 * @desc The number of frames the enemies are stunned when hit.
 * @default 250
 *
 * @param chargeTime
 * @type number
 * @desc The number of frames it takes to charge the dad joke attack.
 * @default 100
 *
 * @param characterWidth
 * @type number
 * @desc The width of each character in the font.
 * @default 20
 *
 * @param textHeight
 * @type number
 * @desc The height of each character in the font.
 * @default 50
 *
 */

 var SPF_StunnedEnemyEmitters = []; // Keeps IDs for the stunned enemies.

(function() {

  var parameters = PluginManager.parameters('SPFDadJoke');
  var ITEM_ID = parseInt(parameters['itemID']);
  var STUN_RADIUS = parseFloat(parameters['stunRadius']);
  var STUN_RADIUS_TILES = STUN_RADIUS / 48; // Stun radius in tiles.
  var STUN_DURATION = parseInt(parameters['stunDuration']);
  var CHARGE_TIME = parseInt(parameters['chargeTime']);
  var CHARACTER_WIDTH = parseInt(parameters['characterWidth']);
  var TEXT_HEIGHT = parseInt(parameters['textHeight']);

  // Jokes can only be 2 phrases.
  var DAD_JOKES = [
                    ["There was a tap on my door this morning...",
                     "My plumber has a strange sense of humour..."],
                    ["Found out my mate Jack can communicate with vegetables...",
                     "Apparently Jack and the beans talk."],
                    ["Just been fired from a job as an interrogator...",
                     "I suppose I should have asked why..."],
                    ["Did you know today is ‘National Hindsight Day’? ",
                     "Or really, it should have been..."],
                    ["I just got attacked by a gang of mime artists...",
                     "They did unspeakable things to me..."],
                  ];

  var FIRST_HALF = 0;
  var SECOND_HALF = 1;

  var currentJokeIndex = 0; // Keep track of which jokes have already been told.

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

  // Returns # of characters * 10px width.
  function getDadJokeTextLength(currentJokeIndex, partIndex) {
    var joke = DAD_JOKES[currentJokeIndex][partIndex];
    return joke.length * CHARACTER_WIDTH;
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

    if (chargeAnimation) { chargeAnimation.remove(); }
    if (jokeAnimation) { jokeAnimation.remove(); }

    chargeAnimation = new SPF_Sprite();
    jokeAnimation = new SPF_Sprite();

    var bitmap = new Bitmap(200, 200);

    // 50 * 2 is the max lenth of the progress bar => attackCharge @ full * 2
    bitmap.resetProgressBar(25, 25, CHARGE_TIME*2);

    var jokeLength = getDadJokeTextLength(currentJokeIndex, FIRST_HALF);

    // new Bitmap(width, height);
    var jokeBitmap = new Bitmap(jokeLength, 200);
    jokeBitmap.clearRect(0, 0, jokeLength, TEXT_HEIGHT);
    jokeBitmap.drawText(DAD_JOKES[currentJokeIndex][FIRST_HALF], 0, 20,
                        jokeLength, 20, "center");
    jokeAnimation.bitmap = jokeBitmap;
    jokeAnimation.x = offsetX(jokeLength);
    jokeAnimation.y = 525;
    jokeAnimation.show();

    chargeAnimation.bitmap = bitmap;
    chargeAnimation.x = 345;
    chargeAnimation.y = 480;
    chargeAnimation.setUpdate(function() {
      attackCharge += 1;

      // Draw green progress bar at twice the length of charge and
      // with the color green.
      this.bitmap.drawProgressBar(25, 25, attackCharge * 2, 125);

      if (attackCharge >= CHARGE_TIME) {
        executeDadJoke();
        attackCharge = 0;
        chargeAnimation.remove();
        chargeAnimation = null;

        // Display second half of the joke.
        jokeBitmap.clearRect(0, 0, jokeLength, TEXT_HEIGHT);

        // New joke length for second half.
        jokeLength = getDadJokeTextLength(currentJokeIndex, SECOND_HALF);
        
        jokeAnimation.x = offsetX(jokeLength);
        jokeBitmap.drawText(DAD_JOKES[currentJokeIndex][SECOND_HALF], 0, 20,
                            jokeLength, 20, "center");
        jokeAnimation.fadeOut();

        updateJokeIndex();
      }

    });

    chargeAnimation.show();

  }

  function offsetX(jokeLength) {
    var LENGTH_OF_SCREEN = 970;
    return Math.floor((LENGTH_OF_SCREEN - jokeLength) / 2);
  }

  function updateJokeIndex() {
      currentJokeIndex += 1;
      if (currentJokeIndex >= DAD_JOKES.length) {
        currentJokeIndex = 0;
      }
  }

  function executeDadJoke() {
    $gameScreen.startShake(3, 5, 120);

    SPF_Enemies.forEach(function(enemy) {
      if (enemy._npcType === SPF_NPCS.DEAF_GUARD ||
          SPF_IsEnemyPacified(enemy)) {

        return;
      }

      DisplayParticles(enemy);
      SPF_StunEnemy(enemy, SPF_ENEMYSTATE.JOKESTUNNED, STUN_DURATION);

    });
    AudioManager.playSe(SE_DADJOKE);
    AudioManager.playSe(SE_COUNTDOWN);
    let item = SPF_FindItemById(ITEM_ID);
    $gameParty.loseItem(item, 1);
  }

  function DisplayParticles(enemy) {

    var emitterId = "enemy" + enemy._eventId;
    $gameMap.createPEmitter(emitterId, "HA!", "laugh_emitter", enemy.eventId);

    $gameMap.setPEmitterZ(emitterId, 5); // 5 => In front of character.

    // 1 and linear are from the game.
    $gameMap.movePEmitterPos(emitterId,
    [SPF_MapXToScreenX(enemy._realX),
     SPF_MapYToScreenY(enemy._realY) - 100,
      1, 'linear']);

    SPF_StunnedEnemyEmitters.push(emitterId);
  }

})();
