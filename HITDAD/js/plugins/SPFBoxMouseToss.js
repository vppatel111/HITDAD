//=============================================================================
// SPFBoxToss
// v1.0
//=============================================================================

/*:
 * @plugindesc Plugin to extend TMJumpAction to allow player to hurl box in the
 * direction of a mouse click. REQUIRES TMJumpAction plugin.
 *
 * @help Plugin to extend TMJumpAction to allow player to hurl box in the
 * direction of a mouse click.  REQUIRES TMJumpAction plugin.
 *
 * Box will land approximately at the same distance horizontally as the mouse click.
 *
 * @author Mike Greber
 *
 * @param hurlSe
 * @desc Sound effect when HitDad throws box
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param hurlSeParam
 * @type string
 * @desc: {"volume":90, "pitch":70, "pan":0}
 * @default {"volume":90, "pitch":70, "pan":0}
 *
 */

(function() {

    let parameters = PluginManager.parameters('SPFBoxMouseToss');

    let actSeHurl = JSON.parse(parameters['hurlSeParam'] || '{}');
    actSeHurl.name = parameters['hurlSe'] || '';

    Game_Player.prototype.SPF_HurlBox = function(mouseX) {
        if ($gamePlayer.isCarrying()) {
            console.log("Is Carrying");
            let target = $gamePlayer._carryingObject;
            let lastRealX = target._realX;
            target.collideMapLeft();
            if (lastRealX !== target._realX) {
                target._realX = lastRealX;
                return;
            }
            target.collideMapRight();
            if (lastRealX !== target._realX) {
                target._realX = lastRealX;
                return;
            }
            var lastRealY = target._realY;
            target.collideMapUp();
            if (lastRealY !== target._realY) {
                target._realY = lastRealY;
                return;
            }
            target.collideMapDown();
            if (lastRealY !== target._realY) {
                target._realY = lastRealY;
                return;
            }
            let targets = target.collideTargets();
            for (var i = 0; i < targets.length; i++) {
                var character = targets[i];
                if (!character._through && target.isCollide(character)) return;
            }

            let xDifference = mouseX - $gamePlayer.screenX();
            $gamePlayer._carryingObject.hurl();
            $gamePlayer._carryingObject.dash(xDifference / 2000 , -0.3 );
            AudioManager.playSe(actSeHurl);
            $gamePlayer._carryingObject = null;
            $gamePlayer._shotDelay = 1;
        } else {
            if ( $gamePlayer.isLanding() && ((Object.prototype.toString.call($gamePlayer._landingObject) !== '[object Array]') || (!!$gamePlayer._leftObject) || (!!$gamePlayer._rightObject))) // 7PF Pickup Implementation
            {
                if (!!$gamePlayer._rightObject) {
                    $gamePlayer._landingObject = $gamePlayer._rightObject;
                }
                if (!!$gamePlayer._leftObject) {
                    $gamePlayer._landingObject = $gamePlayer._leftObject;
                }
                $gamePlayer.executeCarry();
                console.log("Pickup Called");
            }

        }
    };


   //  function toRadians(angle) {
   //      return angle * Math.PI / 180;
   //  }
   //
   //
   // function calculateVelocity(x,y) {
   //      let g = 0.015;
   //      let radians = toRadians(65);
   //      let velocity =  x / (Math.cos(radians) * Math.sqrt(((-2 * y)/g) + ((2 * Math.sin(radians) * g) / (Math.cos(radians)))));
   //      return velocity;
   // }
   //
   //  Math.clamp = function(val, min, max){
   //      return Math.min(Math.max(min, val), max);
   //  }

    // function isEmpty(val){
    //     return (val === undefined || val == null || val.length <= 0);
    // }
    //
    // document.addEventListener("mousedown", function (event) {
    //     console.log(event.button);
    //     if (!isEmpty($gamePlayer) && $gameSwitches && !SPF_OnPhone(event) && event.button === 2) {
    //         SPF_HurlBox(event.pageX);
    //     }
    // });

})();
