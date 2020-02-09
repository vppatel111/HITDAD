//=============================================================================
// SPFPhoneCall
// v1.0
//=============================================================================

/*:
 * @plugindesc Plugin to extend TMJumpAction to allow player to hurl box in the
 * direction of a mouse click. REQUIRES TMJumpAction plugin.
 *
 * @help Plugin to extend TMJumpAction to allow player to hurl box in the
 * direction of a mouse click.  REQUIRES TMJumpAction plugin.
 *
 * For event:
 *
 * @author Mike Greber
 *
 *
 */

(function() {

    function playerX() {
        console.log($gameMap);
        var tw = $gameMap.tileWidth();
        console.log(tw);
        console.log($gameMap.adjustX(10.0));
        // return Math.round($gameMap.adjustX($gamePlayer._x) * tw);
    };

    Game_Player.prototype.executeMouseHurl = function(event) {
        playerX();
        // let xdifference = this.x - x;
        // let ydifference = this.y - y;
        // console.log(playerX(), "Mouse", this.y);
        // console.log(this.x - $gamePlayer.x, "Mouse", this.y - $gamePlayer.y);

        // console.log($gamePlayer.screenX, "Player");


        // this._carryingObject.hurl();
        // this._carryingObject.dash(10.0,10.0);
        // this._carryingObject = null;
        // this._shotDelay = 1;
        // AudioManager.playSe(actSeHurl);
    };

    document.addEventListener("mousedown", function (event) {
        console.log("mouse clicked at", event.pageX,  " -  ",  event.pageY);
        console.log("player at", $gamePlayer.screenX(),  " -  ",  $gamePlayer.screenY());
        $gamePlayer.executeMouseHurl.call(event);
    });


})();
