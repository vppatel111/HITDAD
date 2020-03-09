//=============================================================================
// SPFMouseMechanics
// v1.0
//=============================================================================

/*:
 * @plugindesc Plugin to make all attacks and box events fire with mouse click
 *
 * @help Left click -> Attacks, Answer Calls
 * Right Click -> Pickup and throw box
 *
 * @author Mike Greber
 *
 *
 */

(function() {

    function CanUseItem(SPF_CSI) {
      return !$gameSwitches.value(11) &&
              SPF_CSI &&
              $gameParty.numItems(SPF_CSI) &&
             !Input._isItemShortCut() &&
             !$gamePlayer.isCarrying();
    }

    document.addEventListener("mousedown", function (event) {

        if (!$gameSwitches || !$gamePlayer) {
            return;
        }

        let click = SPF_ScaledClick(event);

        if (event.button === 2) { // Right Click
            $gamePlayer.SPF_ThrowObject();
            if ($gamePlayer.isCarrying()) return;
            $gamePlayer._rightButtonClicked = true;

            if (CanUseItem(SPF_CSI) && SPF_CSI.id == 2) {
                $gamePlayer._carryingDiaperBomb = true;
            }

        } else if (event.button === 0) { // Left Click
            if ($gameSwitches.value(10) && click.x < 200.0 && click.y < 200.0) {
                $gamePlayer.AnswerCall();
            } else {

                if (CanUseItem(SPF_CSI)) {

                    switch (SPF_CSI.id) {
                        case 1:
                            $gamePlayer.SPF_MeleeAttack();
                            break;
                        case 3:
                            $gamePlayer.ChargeDadJoke();
                            break;
                    }
                }

            }
        }
    });

    document.addEventListener("mousemove", function (event) {

        if (!$gameSwitches || !$gamePlayer) {
            return;
        }


        if ($gamePlayer.isCarrying() ||
            ($gamePlayer._rightButtonClicked &&
             $gamePlayer.isCarryingDiaperBomb())) {

            SPF_ScaledClick(event);
        }

    });

    document.addEventListener("mouseup", function (event) {

        if (!$gameSwitches || !$gamePlayer) {
            return;
        }

        let click = SPF_ScaledClick(event);

        if (event.button === 2) { // Right Click
            if (!$gamePlayer._justThrewBox && !$gamePlayer.isCarrying()) {
                $gamePlayer.SPF_ThrowDiaperBomb(click);
            } else {
                $gamePlayer._justThrewBox = false;
            }
            if (!$gamePlayer.isCarrying()) {
                $gamePlayer.hideTrajectory();
            }
            $gamePlayer._rightButtonClicked = false;
         }
    });

})();
