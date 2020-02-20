//=============================================================================
// SPFDebugTools
// v1.0
//
// Useful tools to debug the game.
//=============================================================================

/*:
 * @plugindesc This plugin contains some useful tools for debugging the game
 * Note: Remember to turn this plugin off when deploying.
 *
 * @author Vishal Patel
 */

// Keeps a list of IDs for colliders already drawn to screen.
var SPF_DRAWN_COLLIDERS = {};

function SPF_GetPlayerColliderPoints() {
  return {
    point_l: {x: $gamePlayer._realX + HIT_DAD_HITBOX.x,
              y: $gamePlayer._realY + HIT_DAD_HITBOX.y},
    point_r: {x: $gamePlayer._realX + HIT_DAD_HITBOX.x + HIT_DAD_HITBOX.width,
              y: $gamePlayer._realY + HIT_DAD_HITBOX.y + HIT_DAD_HITBOX.height}
  };
}

function SPF_GetColliderPoints(x, y, collider) {
  return {
    point_l: {x: x + collider.x,
              y: y + collider.y},
    point_r: {x: x + collider.x + collider.width,
              y: y + collider.y + collider.height}
  };
}

function SPF_DrawCollider(collider_id, getColliderPoints, hitbox) {

  // Don't redraw colliders already drawn to the screen.
  if (SPF_DRAWN_COLLIDERS[collider_id]) {
    return false;
  }

  var collider = new SPF_Sprite();
  var colliderPoints = getColliderPoints();

  var bitmap = new Bitmap(100, 100);
  bitmap.fillRect(0, 0, hitbox.width * 48, hitbox.height * 48, "red");
  collider.bitmap = bitmap;
  collider.visible = true;
  collider.opacity = 255;

  collider.setUpdate(function() {
    var point_l = getColliderPoints().point_l;
    collider.x = SPF_MapXToScreenX(point_l.x);
    collider.y = SPF_MapYToScreenY(point_l.y);
  });

  SPF_DRAWN_COLLIDERS[collider_id] = collider;

  collider.show();

}

(function() {

  // Press the "L" key to draw the colliders.
  document.addEventListener("keypress", function (event) {
    if (event.keyCode == 108) {
      SPF_DrawCollider("Player", SPF_GetPlayerColliderPoints, HIT_DAD_HITBOX);
    }
  });

})();
