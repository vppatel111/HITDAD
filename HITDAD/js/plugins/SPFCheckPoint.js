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
 * TopUpItems            - Refill inventory to checkpoint amounts
 * TopUpItems 2 3 0      - Refill inventory to the specified amounts
 * GainItems 3 0 1       - Gain the specified amounts
 *========================================================================================
 *
 * items tagged with <resets> in the note will have all their self switches turned off
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
                    recordItemsAtCheckPoint();
                    break;
                case "ResetToCheckpointValues":
                    resetToCheckpointValues();
                    break;
                case "ResetEventStates":
                    resetEventSwitches();
                    break;
                case "TopUpItems":
                    if (args && args.length > 0)
                    {
                        for (let i = 0; i < args.length; ++i)
                        {

                            itemsAtCheckpoint[i] = parseInt(args[i]);
                        }
                    }
                    reFillItems();
                    break;
                case "GainItems":
                    GainItems(args);
                    break;
            }
        }
    }

    function recordItemsAtCheckPoint() {
        let items = $gameParty.allItems();
        // itemsAtCheckpoint = items;
        for (let i = 0; i < items.length; ++i)
        {
            itemsAtCheckpoint[i] = $gameParty.numItems(items[i]);
        }
    }

    function GainItems(args)
    {
        let items = $gameParty.allItems();

        // let length = Math.min(items.length, args.length);
        console.log(items);
        for (let i = 0; i < args.length; ++i)
        {
            if (args[i] > 0)
            {
                console.log("Adding", args[i], items[i].name);
                $gameParty.gainItem($dataItems[items[i].id], parseInt(args[i]));
            }
        }
    }

    function reFillItems() {
        let items = $gameParty.allItems();

        let length = Math.min(items.length, itemsAtCheckpoint.length);

        for (let i = 0; i < length; ++i)
        {
            let difference = itemsAtCheckpoint ? itemsAtCheckpoint[i] - $gameParty.numItems(items[i]) : 0;
            console.log(itemsAtCheckpoint[i], $gameParty.numItems(items[i]), difference);
            if (difference > 0)
            {
                console.log("Topping up", items[i].name);
                $gameParty.gainItem($dataItems[items[i].id], difference);
            }
        }
    }

    function resetToCheckpointValues() {
        let items = $gameParty.allItems();

        console.log(itemsAtCheckpoint);

        let length = Math.min(items.length, itemsAtCheckpoint.length);

        for (let i = 0; i < length; ++i)
        {
            let difference = itemsAtCheckpoint ? itemsAtCheckpoint[i] - $gameParty.numItems(items[i]) : 0;
            console.log(itemsAtCheckpoint[i], $gameParty.numItems(items[i]), difference);
            if (difference > 0)
            {
                console.log("Topping up", items[i].name);
                $gameParty.gainItem($dataItems[items[i].id], difference);
            } else if (difference < 0)
            {
                console.log("Reducing", items[i].name);
                $gameParty.loseItem($dataItems[items[i].id], -difference);
            }
        }


    }

    function resetEventSwitches() {
        let allEvents = $gameMap.events();
        allEvents.forEach(function(event) {
            if (event._resets) {
                let switches = ['A', 'B', 'C'];
                switches.forEach(function(switchname) {
                    let key = [$gameMap.mapId(), event.eventId(), switchname];
                    $gameSelfSwitches.setValue(key, false);
                });
            }
        });
    }

})();

