//=============================================================================
// SPFTrajectory
// v1.0
//=============================================================================

/*:
 * @plugindesc Draws trajectories for boxes and diaper bombs when holding right-click
 *
 * @help Hold Left click (while holding bomb or box) -> will automatically draw
 * throwing projectile.
 *
 * @author Mike Greber
 *
 */

function SPF_Clamp(num, min, max) {
     return num <= min ? min : num >= max ? max : num;
}

function SPF_BoxCalculateAngleAndVelocity() {
     let magnitude = Math.abs(MOUSE_POSITION.distance());

     // BUG: Math.cos is in radians, therefore this 45 might be causing
     // potential issues.
     let velocityX = Math.max(magnitude, 115) * Math.cos(45) / 1000;
     if (!MOUSE_POSITION.toRight()) {
         velocityX *= -1;
     }

     let velocityY = -Math.abs(SPF_Clamp(magnitude, 115, 300) * Math.sin(45)) / 1000;
     let angle = Math.atan(-velocityY/velocityX);
     let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

     let output = {};
     output.vx = velocityX;
     output.vy = velocityY;
     output.angle = angle;
     output.velocity = velocity;
     return output;
}

function SPF_BombCalculateProjectileAngleAndVelocity() {
  var INITIAL_VELOCITY = 0.20;

  let mouseDistance = Math.abs(MOUSE_POSITION.distance());
  let magnitude = Math.abs(INITIAL_VELOCITY);

  let angle = SPF_AngleToPlayer(MOUSE_POSITION.x,
                                MOUSE_POSITION.y,
                                $gamePlayer.screenX(),
                                $gamePlayer.screenY());

  let velocityX = -1 * Math.cos(angle) * INITIAL_VELOCITY;
  let velocityY = -1 * Math.sin(angle) * INITIAL_VELOCITY;

  velocityX = SPF_RoundToTwoDecimalPlaces(velocityX);
  velocityY = SPF_RoundToTwoDecimalPlaces(velocityY);

  let output = {};
  output.vx = velocityX;
  output.vy = velocityY;
  output.angle = angle;
  output.velocity = magnitude;
  return output;
}

(function () {

  // Projectile calculation scaled to tile width
  function calculatePointInTrajectory(trajectory, time, gravityInput) {
      let gravity = gravityInput || 0.015;
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


  Game_Player.prototype.drawTrajectory = function(velocityInput, gravity) {

      spawnTrajectoryPoints(10);

      let velocity = velocityInput || SPF_BoxCalculateAngleAndVelocity();

      for (let i = 0; i < SPF_TRAJECTORY.length; ++i) {

          // TODO improve scaling of distance between points
          let timeInTrajectory = (i + 1) * SPF_Clamp(3/Math.abs(velocity.vx), 1, 5);
          let pointPos = calculatePointInTrajectory(velocity, timeInTrajectory, gravity);
          SPF_TRAJECTORY[i].x = pointPos.x;
          SPF_TRAJECTORY[i].y = pointPos.y;
          SPF_TRAJECTORY[i].visible = true;
          SPF_TRAJECTORY[i].opacity = 255;
          SPF_TRAJECTORY[i].show();

      }
  }

})();
