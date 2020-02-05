/*:
 * @plugindesc Allows Phone Call mechanic in conjunction with SRD_HUDMaker.js plugin! Press Tab to answer phone call
 * @author Mike Greber
 */

(function() {
    document.addEventListener('keyup', function (e) {
        if (e.key === "Tab")
        {
            if ($gameSwitches.value(10)) {
                AnswerCall();
            }
        }
    }, false);
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

