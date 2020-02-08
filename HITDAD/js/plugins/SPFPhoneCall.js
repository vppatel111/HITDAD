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
 * Phone Ring              // Will count down ring until call is missed or answered
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
 *      Event Page 2 should open when the variable N + 10 = 1 and call Phone Ring.
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
 * @param ringtone
 * @desc Ringtone for when HitDad gets a call
 * @default
 * @dir audio/bgs/
 * @type file
 *
 * @param ringtoneParams
 * @type string
 * @desc Parameters for ringtone ( {"volume":90, "pitch":100, "pan":0} )
 * @default {"volume":90, "pitch":100, "pan":0}
 *
 * @param ringDuration
 * @type number
 * @desc Seconds until call is missed
 * @default 8
 *
 * @param phoneClickSound
 * @desc Ringtone for when HitDad gets a call
 * @default
 * @dir audio/se/
 * @type file
 *
 * @param phoneClickParams
 * @type string
 * @desc Parameters for ringtone ( {"volume":90, "pitch":100, "pan":0} )
 * @default {"volume":90, "pitch":100, "pan":0}
 *
 *
 */
(function() {
    let parameters = PluginManager.parameters('SPFPhoneCall');
    let answerKey = parameters['key'] || "mouseup";
    let varNum = parseInt(parameters["varNum"] || 10)
    let ringDuration = parseInt(parameters["ringDuration"] || 8)
    let ringTone = JSON.parse(parameters['ringtoneParams'] || '{}');
    ringTone.name = parameters['ringtone'] || '';
    let phoneClickSe = JSON.parse(parameters['phoneClickParams'] || '{}');
    phoneClickSe.name = parameters['phoneClickSound'] || '';

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
                        $gameTimer.start(ringDuration * 60);
                        AudioManager.playBgs(ringTone);
                        break;
                    case "Ring":
                        if ($gameTimer.seconds() === 0)
                        {
                            $gameSwitches.setValue(varNum, false);
                            $gameVariables.setValue($gameVariables.value(varNum), 3);
                            $gameTimer.stop();
                            AudioManager.stopBgs(ringTone);
                        }
                        break;
                    case "Answer":
                        AnswerCall();
                        break;
                    case "End":
                        $gameVariables.setValue($gameVariables.value(varNum), 3);
                        AudioManager.playSe(phoneClickSe);
                    default:
                        break;
                }
            }
        }
    }

    let AnswerCall = function() {
        $gameSwitches.setValue(varNum, false);
        $gameVariables.setValue($gameVariables.value(varNum), 2);
        $gameTimer.stop();
        AudioManager.playSe(phoneClickSe);
        AudioManager.stopBgs(ringTone);
    }

})();

