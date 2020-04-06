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
 * Must tag any interactables with <interactable> as well as make an event with the tag <interactable_indicator>
 * in each level which should have the image set as what should popup over the indicator
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

            // turn show indicator on or off - do only once
            if (!interactable._showingInteractablePopup && xDistance + yDistance < 3) {
                interactable._showingInteractablePopup = true;
                SPF_InteractableIndicator.locate(interactable._realX, interactable._realY - 2);
            } else if (interactable._showingInteractablePopup && xDistance + yDistance > 3) {
                interactable._showingInteractablePopup = false;
            }

            // fade animation
            let fadeRate = 10;
            if (interactable._showingInteractablePopup && SPF_InteractableIndicator._opacity < 255)
            {
                SPF_InteractableIndicator.setOpacity(SPF_InteractableIndicator._opacity + fadeRate);
            } else if (!interactable._showingInteractablePopup && SPF_InteractableIndicator._opacity > 0) {
                SPF_InteractableIndicator.setOpacity(SPF_InteractableIndicator._opacity - fadeRate);
            } else if (!interactable._showingInteractablePopup && SPF_InteractableIndicator._opacity <= 0) {
                SPF_InteractableIndicator.setOpacity(0);
                SPF_InteractableIndicator.locate(0, 0);
            }

        });
    };




})();
