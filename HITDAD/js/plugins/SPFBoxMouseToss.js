//=============================================================================
// SPFPhoneCall
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
 *
 */

(function() {

    Game_Player.prototype.executeMouseHurl = function(x) {
        if ($gamePlayer.isCarrying()) {
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

            let xDifference = x - $gamePlayer.screenX();
            $gamePlayer._carryingObject.hurl();
            $gamePlayer._carryingObject.dash(xDifference / 2000 , -0.3 );
            $gamePlayer._carryingObject = null;
            $gamePlayer._shotDelay = 1;
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

    function isEmpty(val){
        return (val === undefined || val == null || val.length <= 0);
    }

    document.addEventListener("mousedown", function (event) {
        console.log(SPF_CurrentlySelectedItem);
        if (!isEmpty($gamePlayer) && $gameSwitches && !$gameSwitches.value(11) && !($gameSwitches.value(10) && (event.pageX < 150 || event.pageY < 150)) && event.button === 0) {
            $gamePlayer.executeMouseHurl.call(this, event.pageX);
        }
    });




})();

