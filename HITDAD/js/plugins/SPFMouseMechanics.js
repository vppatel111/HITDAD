//=============================================================================
// SPFPhoneCall
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

        if (event.button === 2) {
            $gamePlayer.SPF_HurlBox(event.pageX);
        } else if (event.button === 0) {
            if ($gameSwitches.value(10) && event.pageX < 150.0 && event.pageY < 150.0) {
                $gamePlayer.AnswerCall();
            } else {
                if (!$gameSwitches.value(11) && $gameParty.numItems(SPF_CSI) && !Input._isItemShortCut()) {
                    switch (SPF_CSI.id) {
                        case 1:
                            $gamePlayer.SPF_MeleeAttack();
                            break;
                        case 2:
                            $gamePlayer.DiaperBomb(event);
                            break;
                        case 3:
                            $gamePlayer.DadJoke();
                            break;
                    }
                }

            }
        }
    });

})();
