//=============================================================================
// SPFCheckPoint
// v1.0
//=============================================================================

/*:
 * @plugindesc This plugin is to implement checkpoints so item inventory and position are
 * reset upon dying.
 *
 * @help This plugin is to implement checkpoints so item inventory and position are
 * reset upon dying.
 *
 * Plugin Commands
 *========================================================================================
 * CheckPoint                   - Will record player position and inventory, call on level entry
 * ResetToCheckpointValues      - Refill inventory to checkpoint amounts
 * ResetEventStates             - Resets self switches on events with note <resets>
 *========================================================================================
 *
 *
 * @author Mike Greber
 *
 *
 *
 */
(function() {

    let itemsAtCheckpoint = [0,0,0];
    let itemNames = ["Milk Bottle", "Diaper Bomb", "Dad Joke"];

    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        Game_Interpreter_pluginCommand.call( this, command, args )
        {
            switch(command) {
                case "CheckPoint":
                    recordItemsAtCheckPoint();
                    break;
                case "ResetToCheckpointValues":
                    resetToCheckpointValues();
                    break;
                case "ResetEventStates":
                    resetEventSwitches();
                    break;
            }
        }
    }

    function recordItemsAtCheckPoint() {
        let items = $gameParty.allItems();

        for (let i = 0; i < itemsAtCheckpoint.length; ++i) {
            if (items[i]) {
                for (let j = 0; j < itemNames.length; ++j) {

                    if (items[i].name === itemNames[j]) {

                        itemsAtCheckpoint[j] = $gameParty.numItems(items[i]);
                    }
                }
            }

        }
    }

    function resetToCheckpointValues() {

        for (let i = 0; i < itemNames.length; ++i)
        {
            let difference = itemsAtCheckpoint[i] - $gameParty.numItems($dataItems[i + 1]);

            if (Math.abs(difference) > 0) {
                // console.log("Topping up", $dataItems[i + 1].name);
                $gameParty.gainItem($dataItems[i + 1], difference);
            }
        }


    }

    function resetEventSwitches() {
        let allEvents = $gameMap.events();
        allEvents.forEach(function(event) {
            if (event._resets) {
                event._priorityType = 1;
                if (event._npcType) {
                    SPF_ChangeEnemyState(event, SPF_ENEMYSTATE.PATROLLING);
                }
                let switches = ['A', 'B', 'C', 'D'];
                switches.forEach(function(switchname) {
                    let key = [$gameMap.mapId(), event.eventId(), switchname];
                    $gameSelfSwitches.setValue(key, false);
                });
            }
        });
    }

})();

