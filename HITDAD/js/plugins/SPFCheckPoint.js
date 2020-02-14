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
 * CheckPoint            - Will record player position and inventory, call on level entry
 * RefillItems           - Call when re-spawning to refill inventory to checkpoint amounts
 *========================================================================================
 *
 *
 * @author Mike Greber
 *
 *
 *
 */
(function() {

    let itemsAtCheckpoint = [];

    let xPosition = 0;
    let yPosition = 0;

    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        Game_Interpreter_pluginCommand.call( this, command, args )
        {
            switch(command) {
                case "CheckPoint":
                    checkPoint();
                    if (args && args.length > 1)
                    {
                        xPosition = args[0];
                        yPosition = args[1];
                        $gameVariables.setValue(6,args[0]);
                        $gameVariables.setValue(7,args[1]);
                        $gameVariables.setValue(5, $gameMap._mapId);
                        console.log("Set respawn position to", $gameVariables.value(5),$gameVariables.value(6),$gameVariables.value(7));
                    }
                    break;
                case "Respawn":
                    reSpawnPlayer();
                    break;
                case "RefillItems":
                    reFillItems();
                    break;
            }

        }
    }

    function checkPoint() {
        let items = $gameParty.allItems();

        for (let i = 0; i < items.length; ++i)
        {
            itemsAtCheckpoint[i] = $gameParty.numItems(items[i]);
        }
        $gameVariables[100] = itemsAtCheckpoint;
    }
    function reFillItems() {
        // let items = $gameParty.allItems();
        //
        // for (let i = 0; i < items.length; ++i)
        // {
        //     let difference = itemsAtCheckpoint ? itemsAtCheckpoint[i] - $gameParty.numItems(items[i]) : 0;
        //     console.log(itemsAtCheckpoint[i], $gameParty.numItems(items[i]), difference, itemsAtCheckpoint.length);
        //     if (difference > 0)
        //     {
        //         console.log("Topping up", items[i].name);
        //         $gameParty.gainItem($dataItems[items[i].id], difference);
        //     }
        // }
        let items = $gameParty.allItems();

        for (let i = 0; i < items.length; ++i)
        {
            let difference = $gameVariables[100] ? $gameVariables[100][i] - $gameParty.numItems(items[i]) : 0;
            console.log($gameVariables[100][i], $gameParty.numItems(items[i]), difference, $gameVariables[100].length);
            if (difference > 0)
            {
                console.log("Topping up", items[i].name);
                $gameParty.gainItem($dataItems[items[i].id], difference);
            }
        }
    }

    function reSpawnPlayer()
    {
        // if (xPosition && yPosition) {
        //     // console.log("Respawning at", xPosition, yPosition);
        //     // $gameParty.members().forEach(function(m) {
        //     //     m.recoverAll();
        //     // });
        //     // $gameActors.actor(1).recoverAll();
        //     // $gameActors.actor(1).removeState(1);
        //     // $gamePlayer.reserveTransfer($gameMap.mapId(), xPosition, yPosition);
        //     // $gamePlayer.performTransfer();
        // }
    }

})();

