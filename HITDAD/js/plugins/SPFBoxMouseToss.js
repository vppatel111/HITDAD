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
 * @param carrySe
 * @desc Sound effect when HitDad throws box
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param carrySeParam
 * @type string
 * @desc: {"volume":90, "pitch":70, "pan":0}
 * @default {"volume":90, "pitch":70, "pan":0}
 */

(function() {

    let parameters = PluginManager.parameters('SPFBoxMouseToss');

    let actSeHurl = JSON.parse(parameters['hurlSeParam'] || '{}');
    actSeHurl.name = parameters['hurlSe'] || '';

    let actSeCarry = JSON.parse(parameters['carrySeParam'] || '{}');
    actSeCarry.name = parameters['carrySe'] || '';

    Game_Player.prototype.SPF_HurlBox = function(mouseX) {
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
            let lastRealY = target._realY;
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
            for (let i = 0; i < targets.length; i++) {
                let character = targets[i];
                if (!character._through && target.isCollide(character)) return;
            }

            let xDifference = (mouseX - $gamePlayer.screenX());
            $gamePlayer._carryingObject.hurl();
            $gamePlayer._carryingObject.dash(xDifference / 2000 , -0.3 );
            $gamePlayer._carryingObject = null;
            $gamePlayer._shotDelay = 1;
            AudioManager.playSe(actSeHurl);

        } else {

                let objectToCarry = null;

                if ($gamePlayer._topObject)
                {
                    objectToCarry = $gamePlayer._topObject;
                    $gamePlayer._topObject = null;

                } else if ((Object.prototype.toString.call($gamePlayer._landingObject) !== '[object Array]'))
                {
                    objectToCarry = $gamePlayer._landingObject;
                    $gamePlayer._landingObject = null;

                } else if ($gamePlayer._rightObject)
                {
                    objectToCarry = $gamePlayer._rightObject;
                    $gamePlayer._rightObject = null;

                } else if ($gamePlayer._leftObject)
                {
                    objectToCarry = $gamePlayer._leftObject;
                    $gamePlayer._leftObject = null;
                }

                if (objectToCarry)
                {
                    executeCarry(objectToCarry);
                }

        }
    };

    function executeCarry(object) {
        // if (typeof object.eventId !== "function") return;
        //
        // let event = $gameMap.event(object.eventId());

        // if (SPF_ParseNote(event).npcType !== SPF_NPCS.SECURITY_NPC) {
        if (object._canPickup) {
            $gamePlayer._carryingObject = object;
            $gamePlayer._carryingObject.carry();
            AudioManager.playSe(actSeCarry);
        }
    }

})();
