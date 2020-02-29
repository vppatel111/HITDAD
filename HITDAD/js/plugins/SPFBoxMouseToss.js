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

    var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        aliasPluginCommand.call(this, command, args);

        if (command === 'InitializeBoxes') {
            initializeBoxes();
        }
    };



    Game_Player.prototype.drawTrajectory = function(mousePosition) {
        // var myPoints = [10,10, 40,30, 100,10]; //minimum two points
        // var tension = 1;
        // if (!$gamePlayer._rightButtonClicked) return;
        var explosion = new SPF_Sprite();
        let bitmap = new Bitmap(1000, 691);
        // bitmap.fillRect(0.0,0.0, 150.0,100.0,"blue");


        // At Hitdad holding box
        bitmap.drawCircle(this.screenX(),this.screenY() - 122,10,'red');

        // At mouse click X
        bitmap.drawCircle(mousePosition.x,this.screenY() - 122,10,'blue');

        // At peak
        bitmap.drawCircle((mousePosition.x + this.screenX()) / 2,this.screenY() - 122 - 144,10,'green');



        console.log(this);
        explosion.bitmap = bitmap;

        explosion.visible = true;
        explosion.opacity = 255;

        // Draw explosion slightly higher then where it landed.
        // explosion.x = mousePosition.x;//this.screenX();
        // explosion.y = this.screenY() - 122;

        explosion.spawnX = this._x;
        explosion.spawnY = this._y;

        explosion.show();
    }


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
            $gamePlayer._carryingObject.hurl();
            hurlObject(xDifference);
            $gamePlayer._carryingObject = null;
            $gamePlayer._shotDelay = 1;
            AudioManager.playSe(actSeHurl);

        } else {

                let objectToCarry = findBoxWithinReach();

                if (objectToCarry)
                {
                    executeCarry(objectToCarry);
                }

        }
    };

    function clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }

    function calculateDifference(click) {
        return click.x - $gamePlayer.screenX();
    }

    function calculateAngleAndVelocity(xDifference) {
        let velocityX = Math.max(xDifference, 115) * Math.cos(45) / 1000;
        let velocityY = -Math.abs(clamp(xDifference, 115, 300) * Math.sin(45)) / 1000;
        let angle = Math.atan(-velocityY/velocityX);
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

        let output = {};
        output.x = velocityX;
        output.y = velocityY;
        output.angle = angle;
        output.velocity = velocity
        return output;
    }

    Game_Player.prototype.trajectory = function (click) {
        let difference = calculateDifference(click);

        let velocity = calculateAngleAndVelocity(difference);

        let gravity = 0.0045;

        let timeToGround = Math.sqrt(0.98/0.015);

        let fVelocity = timeToGround * 0.015;

        let time =  fVelocity - velocity.y;

        console.log("Time", time);
    }

    function hurlObject(xDifference) {

       let velocity = calculateAngleAndVelocity(xDifference);


        $gamePlayer._carryingObject.dash(velocity.x , velocity.y);
        // $gamePlayer._carryingObject.dash(xDifference / 1900 , -0.3 );
    }

    function initializeBoxes() {
        let allEvents = $gameMap.events();
        SPF_Boxes = getPickupableEvents(allEvents);
    }

    function getPickupableEvents(events) {
        let pickupableEvents = [];

        events.forEach(function(event) {
            if (event._canPickup) {
                pickupableEvents.push(event);
            }
        });

        return pickupableEvents;
    }

    // Checks if and returns an enemy that is within melee range, returns null if none in range.
    function findBoxWithinReach() {
        let direction = $gamePlayer.direction();

        // So it scans from around the players back for detecting objects underneath
        let xTraceStart = direction === 4 ? $gamePlayer._realX + 0.5 : $gamePlayer._realX  - 0.5;

        let closestBox = null;
        let closestBoxDistance = null;

        SPF_Boxes.forEach(function(box) {
            let distanceToBox =  box._realX - xTraceStart; // Will be positive if box is to right of player
            let verticalOffset = Math.abs($gamePlayer._realY - box._realY);

            // Get box in direction player is facing to have positive distance value (direction === 6 means right)
            let forwardDistanceToBox = direction === 6 ? distanceToBox : - distanceToBox;

            if (forwardDistanceToBox < 1.75 && forwardDistanceToBox >= 0.0 && verticalOffset < 2.0) {
                if (!closestBox || closestBoxDistance > forwardDistanceToBox) {
                    closestBoxDistance = forwardDistanceToBox;
                    closestBox = box;
                }
            }
        });

        if (closestBox) {
            return closestBox;
        }
    }


    function executeCarry(object) {
        $gamePlayer._carryingObject = object;
        $gamePlayer._carryingObject.carry();
        AudioManager.playSe(actSeCarry);
    }

})();
