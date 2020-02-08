//=============================================================================
// SPFPhoneCall
// v1.0
//=============================================================================

/*:
 * @plugindesc This plugin handles the phone call mechanic with just a few plugin commands
 * to be called in the event triggers. Must be used in conjunction with SRD_HUDMaker
 * plugin for visual indication of phone ringing.
 *
 * @help This plugin handles the phone call mechanic with just a few plugin commands
 * to be called in the event triggers. Must be used in conjunction with
 * SRD_HUDMaker plugin for visual indication of phone ringing.
 *
 * Plugin Commands
 *========================================================================================
 * Phone Trigger 1         // Call this in the event trigger
 * Phone Answer            // To answer phone (Not required typically, is called on click)
 * Phone End               // Call after dialogue is over
 *========================================================================================
 *
 * Each of these commands will increment the value of  + 10
 * variable (phone call #) + 10
 * to keep track of the state of each phone call event.
 *
 * For event:
 *      Event Page 1 should call Phone Trigger N with N being the phone call number.
 *      Event Page 2 should open when the variable N + 10 = 1 and include the ringtone.
 *      Event Page 3 should open when the variable N + 10 = 2 and include the dialogue,
 *             and then call Phone End.
 *      Event Page 4 should open when the variable N + 10 = 3 and be blank.
 *
 * The event tiles can then be duplicated in order to prevent the player from
 * stepping over the trigger.
 *
 * @author Mike Greber
 *
 * @param key
 * @type string
 * @desc Key or mouse click to press to answer phone call.
 * @default mouseup
 * 
 * @param varNum
 * @type number
 * @desc The variable and switch number that will be used to keep track of the state of phone calls.
 * @default 10
 *
 */
(function() {
    let parameters = PluginManager.parameters('SPFPhoneCall');
    let answerKey = parameters['key'];
    let varNum = parseInt(parameters["varNum"])

    if (answerKey === "mouseup") {
        document.addEventListener("mouseup", function (event) {
            if ($gameSwitches.value(varNum) && event.pageX < 250.0 && event.pageY < 80.0) {
                AnswerCall();
            }
        })
    } else {
        document.addEventListener('keyup', function (event) {
            if ($gameSwitches.value(varNum) && event.key === answerKey)
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
                        $gameSwitches.setValue(varNum, true);
                        $gameVariables.setValue(varNum, parseInt(args[1]) + 10);
                        $gameVariables.setValue($gameVariables.value(varNum), 1);
                        break;
                    case "Answer":
                        AnswerCall();
                        break;
                    case "End":
                        $gameVariables.setValue($gameVariables.value(varNum), 3);
                    default:
                        break;
                }
            }
        }
    }

    let AnswerCall = function() {
        $gameSwitches.setValue(varNum, false);
        $gameVariables.setValue($gameVariables.value(varNum), 2);
    }

})();

