//=============================================================================
// SPFBoxToss
// v1.1
//=============================================================================

/*:
 * @plugindesc Plugin to extend TMJumpAction to allow player to hurl box in the
 * direction of a mouse click. REQUIRES TMJumpAction plugin and SPFCore plugin.
 *
 * @help Plugin to extend TMJumpAction to allow player to hurl box in the
 * direction of a mouse click.  REQUIRES TMJumpAction plugin and SPFCore plugin.
 *
 * Box will land on trajectory displayed.
 *
 * Plugin Command
 * =================================================================================
 * Must call Initialize on loading of level
 * =================================================================================
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


    Game_Player.prototype.SPF_ThrowObject = function() {
        if ($gamePlayer.isCarrying()) {

            if (canThrow())
            {
                hurlObject();
            }

        } else {

            let objectToCarry = SPF_LineTrace(SPF_Boxes, 2.0, -0.75, 1.5, -0.5);
            if (objectToCarry) {
                executeCarry(objectToCarry);
            }
        }
    };


    function hurlObject() {
        let velocity = SPF_BoxCalculateAngleAndVelocity();
        $gamePlayer._carryingObject.dash(velocity.vx , velocity.vy);
        $gamePlayer._carryingObject.hurl();
        $gamePlayer._carryingObject = null;
        $gamePlayer._shotDelay = 1;
        $gamePlayer._justThrewBox = true;
        AudioManager.playSe(SE_THROWBOX);
        SPF_ChangeSpriteSheet(SPF_SPRITESHEET.DEFAULT);
    }


    function executeCarry(object) {
        $gamePlayer._carryingObject = object;
        $gamePlayer._carryingObject.carry();
        AudioManager.playSe(SE_PICKUPBOX);
        SPF_ChangeSpriteSheet(SPF_SPRITESHEET.CARRYING);
    }


    function canThrow() {
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
        return true;
    }

})();
