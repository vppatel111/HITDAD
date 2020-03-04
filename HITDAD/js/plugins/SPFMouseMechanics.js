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

    document.addEventListener("mousedown", function (event) {

        if (!$gameSwitches || !$gamePlayer) {
            return;
        }

        let click = SPF_ScaledClick(event);

        if (event.button === 2) { // Right Click
            $gamePlayer.SPF_ThrowObject();
            $gamePlayer.SPF_ThrowDiaperBomb();
            $gamePlayer._rightButtonClicked = true;
        } else if (event.button === 0) { // Left Click
            if ($gameSwitches.value(10) && click.x < 200.0 && click.y < 200.0) {
                $gamePlayer.AnswerCall();
            } else {

                if (!$gameSwitches.value(11) &&
                     SPF_CSI &&
                     $gameParty.numItems(SPF_CSI) &&
                    !Input._isItemShortCut()) {

                    switch (SPF_CSI.id) {
                        case 1:
                            $gamePlayer.SPF_MeleeAttack();
                            break;
                        case 2:
                            $gamePlayer._carryingDiaperBomb = null;
                            $gamePlayer.DiaperBomb(click);
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

        if ($gamePlayer._rightButtonClicked &&
            ($gamePlayer.isCarrying() ||
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
            $gamePlayer.SPF_ThrowObject();
            $gamePlayer.SPF_ThrowDiaperBomb();
            $gamePlayer.hideTrajectory();
            $gamePlayer._rightButtonClicked = false;
         }
    });

})();
