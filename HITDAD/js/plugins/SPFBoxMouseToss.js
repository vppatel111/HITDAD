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
 * Plugin Command
 * =================================================================================
 * Must call InitializeBoxes on loading of level with pickupable boxes
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

    Game_Player.prototype.SPF_HurlBox = function(click) {

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

            let xDifference = calculateDifference(click);

            hurlObject(xDifference);
            $gamePlayer._carryingObject = null;
            $gamePlayer._shotDelay = 1;
            AudioManager.playSe(actSeHurl);

        } else {

                let objectToCarry = SPF_LineTrace(SPF_Boxes, 2.0, -0.75);

                if (objectToCarry)
                {
                    executeCarry(objectToCarry);
                }

        }
    };

    function hurlObject(xDifference) {
        $gamePlayer._carryingObject.hurl();
        let velocity = calculateAngleAndVelocity(xDifference);
        $gamePlayer._carryingObject.dash(velocity.xv , velocity.yv);
    }

    function executeCarry(object) {
        $gamePlayer._carryingObject = object;
        $gamePlayer._carryingObject.carry();
        AudioManager.playSe(actSeCarry);
    }

    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    function calculateDifference(click) {
        return click.x - $gamePlayer.screenX();
    }

    function calculateAngleAndVelocity(xDifference) {
        let toRight = xDifference >= 0;
        let magnitude = Math.abs(xDifference);

        let velocityX = Math.max(magnitude, 115) * Math.cos(45) / 1000;
        if (!toRight) {
            velocityX *= -1;
        }

        let velocityY = -Math.abs(clamp(magnitude, 115, 300) * Math.sin(45)) / 1000;
        let angle = Math.atan(-velocityY/velocityX);
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

        let output = {};
        output.xv = velocityX;
        output.yv = velocityY;
        output.angle = angle;
        output.velocity = velocity
        return output;
    }

    // Projectile calculation scaled to tile width
    function calculatePointInTrajectory(trajectory, time) {
        let gravity = 0.015;
        let tileWidth = 48;
        let xPosition = trajectory.xv * time * tileWidth + $gamePlayer.screenX();
        let yPosition = -0.5 * gravity * time * time * tileWidth - trajectory.yv * tileWidth * time ;

        let output = {};
        output.x = xPosition;
        output.y = -yPosition + $gamePlayer.screenY() - 98;
        console.log("Time", time, output.x, output.y);
        return output;
    }

    Game_Player.prototype.spawnTrajectoryPoints = function() {
        let points = [];

        for (let i = 0; i < 10; ++i) {
            let point = new Bitmap(1000, 691);
            points.push(point);
        }

        return points;
    }

    Game_Player.prototype.drawTrajectory = function(points, click) {

        let difference = calculateDifference(click);

        let velocity = calculateAngleAndVelocity(difference);

        for (let i = 0; i < points.length; ++i) {
            let pointPos = calculatePointInTrajectory(velocity, (i + 1) * 5);
            let point = new SPF_Sprite();
            points[i].drawCircle(pointPos.x , pointPos.y,10,"red");
            point.bitmap = points[i];
            point.visible = true;
            point.opacity = 255;
            point.show();
        }
    }

})();
