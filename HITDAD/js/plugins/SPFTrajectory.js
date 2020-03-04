//=============================================================================
// SPFTrajectory
// v1.0
//=============================================================================

/*:
 * @plugindesc Plugin to add
 *
 * @help Left click -> Attacks, Answer Calls
 * Right Click -> Pickup and throw box
 *
 * @author Mike Greber and Vishal Patel
 *
 */

(function () {

  function clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
  }

  function calculateAngleAndVelocity() {
      let magnitude = Math.abs(MOUSE_POSITION.distance());

      // BUG: Math.cos is in radians, therefore this 45 might be causing
      // potential issues.
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

      let velocity = velocityInput || calculateAngleAndVelocity();

      for (let i = 0; i < SPF_TRAJECTORY.length; ++i) {

          // TODO improve scaling of distance between points
          let timeInTrajectory = (i + 1) * clamp(3/Math.abs(velocity.vx), 1, 5);
          let pointPos = calculatePointInTrajectory(velocity, timeInTrajectory, gravity);
          SPF_TRAJECTORY[i].x = pointPos.x;
          SPF_TRAJECTORY[i].y = pointPos.y;
          SPF_TRAJECTORY[i].visible = true;
          SPF_TRAJECTORY[i].opacity = 255;
          SPF_TRAJECTORY[i].show();

      }
  }

})();
