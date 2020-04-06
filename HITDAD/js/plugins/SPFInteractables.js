//=============================================================================
// SPFBoxToss
// v1.1
//=============================================================================

/*:
 * @plugindesc Plugin to extend TMJumpAction to allow player to make popups appear when near interactable event.
 *  REQUIRES TMJumpAction plugin and SPFCore plugin.
 *
 * @help Plugin to extend TMJumpAction to make popups appear when near interactable event.
 * REQUIRES TMJumpAction plugin and SPFCore plugin.
 *
 * Must tag any interactables with <interactable>
 *
 * Plugin Command
 * =================================================================================
 * Must call Initialize on loading of level
 * =================================================================================
 *
 * @author Mike Greber
 *
 */

(function() {

    Game_Player.prototype.SPF_CheckForInteractables = function() {

        SPF_Interactables.forEach(function(interactable) {

            let xDistance = Math.abs(interactable._realX - $gamePlayer._x);
            let yDistance = Math.abs(interactable._realY - $gamePlayer._y);

            let hintText = "Press F"

            // Create Interactable  on first iteration only
            if (!interactable._interactableBitmap) {
                interactable._interactableBitmap = new SPF_Sprite();

                let hintBitmap = new Bitmap(getTextLength(hintText), 48);
                hintBitmap.drawText(hintText, 0, 20, getTextLength(hintText), 24, "center");

                interactable._interactableBitmap.bitmap = hintBitmap;
                interactable._interactableBitmap.show();
                interactable._interactableBitmap.opacity = 0;
            }

            // Update Bitmap Location
            interactable._interactableBitmap.x = interactable.screenX() - getTextLength(hintText) / 2;
            interactable._interactableBitmap.y = interactable.screenY() - 48;

            let isActive = $gameSelfSwitches.value([$gameMap._mapId, interactable.eventId(), 'A']);

            // turn show indicator on or off - do only once
            if (!interactable._showingInteractablePopup && xDistance + yDistance < 3 && isActive) {
                interactable._showingInteractablePopup = true;
            } else if (interactable._showingInteractablePopup && xDistance + yDistance > 3) {
                interactable._showingInteractablePopup = false;
            }

            // fade animation
            let fadeRate = 10;
            if (interactable._showingInteractablePopup && interactable._interactableBitmap.opacity < 255)
            {
                interactable._interactableBitmap.opacity += fadeRate;

            } else if ((!interactable._showingInteractablePopup) && interactable._interactableBitmap.opacity > 0) {

                interactable._interactableBitmap.opacity -= fadeRate;

            } else if (!interactable._showingInteractablePopup && interactable._interactableBitmap.opacity <= 0) {

                interactable._interactableBitmap.opacity = 0;
            }

        });
    };


    // Returns # of characters * 10px width.
    function getTextLength(text) {
        return text.length * 10;
    }

})();
