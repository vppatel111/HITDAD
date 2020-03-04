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
        if ($gamePlayer.isCarrying() && canThrow()) {

            hurlObject();

        } else {

            let objectToCarry = SPF_LineTrace(SPF_Boxes, 2.0, -0.75);
            if (objectToCarry) {
                executeCarry(objectToCarry);
            }
        }
    };


    function hurlObject() {
        let velocity = calculateAngleAndVelocity();
        $gamePlayer._carryingObject.dash(velocity.vx , velocity.vy);
        $gamePlayer._carryingObject.hurl();
        $gamePlayer._carryingObject = null;
        $gamePlayer._shotDelay = 1;
        AudioManager.playSe(SE_THROWBOX);
    }


    function executeCarry(object) {
        $gamePlayer._carryingObject = object;
        $gamePlayer._carryingObject.carry();
        AudioManager.playSe(SE_PICKUPBOX);
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


    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }


    function calculateAngleAndVelocity() {
        let magnitude = Math.abs(MOUSE_POSITION.distance());

        let velocityX = Math.max(magnitude, 115) * Math.cos(45) / 1000;
        if (!MOUSE_POSITION.toRight()) {
            velocityX *= -1;
        }

        let velocityY = -Math.abs(clamp(magnitude, 115, 300) * Math.sin(45)) / 1000;
        let angle = Math.atan(-velocityY/velocityX);
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

        let output = {};
        output.vx = velocityX;
        output.vy = velocityY;
        output.angle = angle;
        output.velocity = velocity;
        return output;
    }

    // Projectile calculation scaled to tile width
    function calculatePointInTrajectory(trajectory, time) {
        let gravity = 0.015;
        let tileWidth = 48;
        let xPosition = trajectory.vx * time * tileWidth + $gamePlayer.screenX();
        let yPosition = -0.5 * gravity * time * time * tileWidth - trajectory.vy * tileWidth * time ;

        let output = {};
        output.x = xPosition;
        output.y = -yPosition + $gamePlayer.screenY() - 98;
        return output;
    }


    function spawnTrajectoryPoints(number) {

        if (SPF_TRAJECTORY.length > 0) return;

        for (let i = 0; i < number; ++i) {
            let point = new SPF_Sprite();
            point.bitmap = new Bitmap(1000, 691);
            point.bitmap.drawCircle(5 , 5,5,"white");
            SPF_TRAJECTORY.push(point);
        }
    }


    Game_Player.prototype.hideTrajectory = function() {
        SPF_TRAJECTORY.forEach(function(point) {
            point.remove();
        });
    }


    Game_Player.prototype.drawTrajectory = function() {

        spawnTrajectoryPoints(10);

        let velocity = calculateAngleAndVelocity();

        for (let i = 0; i < SPF_TRAJECTORY.length; ++i) {

            // TODO improve scaling of distance between points
            let pointPos = calculatePointInTrajectory(velocity, (i + 1) * clamp(3/Math.abs(velocity.vx), 1, 5 ));
            SPF_TRAJECTORY[i].x = pointPos.x;
            SPF_TRAJECTORY[i].y = pointPos.y;
            SPF_TRAJECTORY[i].visible = true;
            SPF_TRAJECTORY[i].opacity = 255;
            SPF_TRAJECTORY[i].show();

        }
    }

})();
