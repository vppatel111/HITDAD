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
 *========================================================================================
 *
 *
 * @author Mike Greber
 *
 * @param eventCollapse
 * @type boolean
 * @desc イベント戦闘不能時に崩壊エフェクトを使う。
 * 初期値: ON ( false = OFF 無効 / true = ON 有効 )
 * @default true
 *
 *
 */
(function() {
    let parameters = PluginManager.parameters('SPFCheckPoint');
    // let answerKey = parameters['key'] || "mouseup";
    // let varNum = parseInt(parameters["varNum"] || 10)
    // let ringDuration = parseInt(parameters["ringDuration"] || 8)
    // let ringTone = JSON.parse(parameters['ringtoneParams'] || '{}');
    // ringTone.name = parameters['ringtone'] || '';
    // let phoneClickSe = JSON.parse(parameters['phoneClickParams'] || '{}');
    // phoneClickSe.name = parameters['phoneClickSound'] || '';

    let itemsAtCheckpoint = {};
    let xPosition = 0;
    let yPosition = 0;
    let mapId = "";
    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        Game_Interpreter_pluginCommand.call( this, command, args )
        {

            if ( command === 'CheckPoint' ) {
                checkPoint();
                if (args && args.length > 1)
                {
                    xPosition = args[0];
                    yPosition = args[1];
                    mapId = $gameMap._mapId;
                    console.log("Set respawn position to", xPosition, yPosition, mapId);
                }
            } else if (command === "Respawn") {
                refillItems();
                reSpawnPlayer();
            }


        }
    }

    function checkPoint() {
        const items = $gameParty.allItems();

        for (let i = 0; i < items.length; ++i)
        {
            itemsAtCheckpoint[i] = $gameParty.numItems(items[i]);
        }
    }
    function refillItems() {
        const items = $gameParty.allItems();

        for (let i = 0; i < items.length; ++i)
        {
            let difference = itemsAtCheckpoint[i] - $gameParty.numItems(items[i]);
            console.log(itemsAtCheckpoint[i], $gameParty.numItems(items[i]));
            if (difference > 0)
            {
                console.log("Topping up", items[i].name);
                $gameParty.gainItem($dataItems[items[i].id], difference);
            }
        }
    }
    function reSpawnPlayer()
    {
        if (xPosition && yPosition) {
            console.log("Respawning at", xPosition, yPosition);
            $gamePlayer.reserveTransfer(mapId, xPosition, yPosition, 6, 0);
        }
    }

})();

