//=============================================================================
// SPFPhoneCall
// v1.0
//=============================================================================

/*:
 * @plugindesc This plugin handles the phone call mechanic with just a few plugin commands
 * to be called in the event triggers. Must be used in conjunction with SRD_HUDMaker
 * plugin for visual indication of phone ringing.
 *
 * Current phone call # will be set within plugin at variable 10
 *
 *
 * Plugin Commands
 *
 * Phone Trigger 1                     // Call this in the event trigger
 * Phone Answer                        // To answer phone (Not required typically, is called on click)
 * Phone End                           // Call after dialogue is over
 *
 * Each of these commands will increment the value of variable (phone call #) + 10 to keep track
 * of the state of each phone call event.
 *
 * @author Mike Greber
 *
 * @param key
 * @type string
 * @desc Key or mouse click to press to answer phone call.
 * @default mouseup
 *
 */
(function() {
    let parameters = PluginManager.parameters('SPFPhoneCall');
    let answerKey = parameters['key'];

    if (answerKey === "mouseup") {
        document.addEventListener("mouseup", function (event) {
            if ($gameSwitches.value(10) && event.pageX < 250.0 && event.pageY < 80.0) {
                AnswerCall();
            }
        })
    } else {
        document.addEventListener('keyup', function (event) {
            if ($gameSwitches.value(10) && event.key === answerKey)
            {
                    AnswerCall();
            }
        }, false);
    }


    var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        Game_Interpreter_pluginCommand.call( this, command, args )
        {
            if ( command === 'Phone' )
            {
                switch(args[0])
                {
                    case "Trigger":
                        $gameSwitches.setValue(10, true);
                        $gameVariables.setValue(10, parseInt(args[1]) + 10);
                        $gameVariables.setValue($gameVariables.value(10), 1);
                        break;
                    case "Answer":
                        AnswerCall();
                        break;
                    case "End":
                        $gameVariables.setValue($gameVariables.value(10), 3);
                    default:
                        break;
                }
            }
        }
    }

    let AnswerCall = function() {
        $gameSwitches.setValue(10, false);
        $gameVariables.setValue($gameVariables.value(10), 2);
    }

})();

