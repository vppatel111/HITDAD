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

    const _defaultWindowHeight = 691;
    const _defaultWindowWidth = 1000;

    // Width / Height
    const desiredAspectRatio = _defaultWindowWidth / _defaultWindowHeight;

    function getAspectRatio() {
        return innerWidth / innerHeight;
    }

    function ScaledClick(event) {
        let topPadding = 0;
        let leftPadding = 0;
        let windowHeight = _defaultWindowHeight;
        let windowWidth = _defaultWindowWidth;
        let scale = innerWidth / windowWidth;
        if (desiredAspectRatio > getAspectRatio()) {
            windowHeight *= innerWidth / windowWidth;
            topPadding = (innerHeight - windowHeight) / 2;
        } else if (desiredAspectRatio < getAspectRatio()) {
            scale = innerHeight / windowHeight;
            windowWidth *= innerHeight / windowHeight;
            leftPadding = (innerWidth - windowWidth) / 2;
        }
        this.scale = scale;
        this.x = (event.pageX - leftPadding) / this.scale;
        this.y = (event.pageY - topPadding) / this.scale;
    }

    document.addEventListener("mousedown", function (event) {


        if (!$gameSwitches || !$gamePlayer) {
            return;
        }

        let click = new ScaledClick(event);

        if (event.button === 2) { // Right Click
            if ($gamePlayer.isCarrying()) {
                $gamePlayer.drawTrajectory(click);
            }
            $gamePlayer.SPF_HurlBox(click);
            $gamePlayer.trajectory(click);
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

    document.addEventListener("mouseup", function (event) {


        if (!$gameSwitches || !$gamePlayer) {
            return;
        }

        // let click = new ScaledClick(event);
        //
        // if (event.button === 2) { // Right Click
        //     $gamePlayer.SPF_HurlBox(click.x);
            $gamePlayer._rightButtonClicked = false;
        // } else if (event.button === 0) { // Left Click
        //     if ($gameSwitches.value(10) && click.x < 200.0 && click.y < 200.0) {
        //         $gamePlayer.AnswerCall();
        //     } else {
        //
        //         if (!$gameSwitches.value(11) &&
        //             SPF_CSI &&
        //             $gameParty.numItems(SPF_CSI) &&
        //             !Input._isItemShortCut()) {
        //
        //             switch (SPF_CSI.id) {
        //                 case 1:
        //                     $gamePlayer.SPF_MeleeAttack();
        //                     break;
        //                 case 2:
        //                     $gamePlayer.DiaperBomb(click);
        //                     break;
        //                 case 3:
        //                     $gamePlayer.ChargeDadJoke();
        //                     break;
        //             }
        //         }
        //
        //     }
        // }
    });

})();
