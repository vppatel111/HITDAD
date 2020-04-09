//=============================================================================
// SPFAudio
// v1.0
//=============================================================================

/*:
 * @plugindesc Plugin to extend consolidate all sound effects so they can be easily
 * adjusted throughout the game.
 *
 * @help Plugin to extend consolidate all sound effects so they can be easily
 * adjusted throughout the game.
 *
 * Sound effects for dying (Actor Collapse), taking damage (Actor Damage), and
 * healing (Actor Recovery) must be set in
 * Tools -> Database -> System -> Sounds
 *
 *
 * Plugin Commands
 * =================================================================================
 * Audio KidHey
 * Audio KidHmm
 * Audio KidHuh
 * Audio KidSurprised
 * Audio Monkey
 * =================================================================================
 *
 * @author Mike Greber
 *
 *
 * @param
 * @param ***PLAYER SETTINGS***
 * @default ==================================
 * @param
 *
 * @param Jump
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param JumpParam
 * @type string
 * @desc: {"volume":40, "pitch"100, "pan":0}
 * @default {"volume":40, "pitch":100, "pan":0}
 *
 * @param JumpLand
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param JumpLandParam
 * @type string
 * @desc: {"volume":50, "pitch"100, "pan":0}
 * @default {"volume":50, "pitch":100, "pan":0}
 *
 * @param WalkStep
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param WalkStepParam
 * @type string
 * @desc: {"volume":60, "pitch"100, "pan":0}
 * @default {"volume":60, "pitch":100, "pan":0}
 *
 * @param WalkStepHeavy
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param WalkStepHeavyParam
 * @type string
 * @desc: {"volume":60, "pitch"100, "pan":0}
 * @default {"volume":60, "pitch":100, "pan":0}
 *
 * @param LadderStep
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param LadderStepParam
 * @type string
 * @desc: {"volume":50, "pitch"100, "pan":0}
 * @default {"volume":50, "pitch":100, "pan":0}
 *
 * @param ThrowBox
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param ThrowBoxParam
 * @type string
 * @desc: {"volume":30, "pitch":60, "pan":0}
 * @default {"volume":30, "pitch":60, "pan":0}
 *
 * @param PickupBox
 * @desc Sound effect when HitDad throws box
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param PickupBoxParam
 * @type string
 * @desc: {"volume":25, "pitch":105, "pan":0}
 * @default {"volume":25, "pitch":105, "pan":0}
 *
 * @param BoxLand
 * @desc Sound effect when a box lands
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param BoxLandParam
 * @type string
 * @desc: {"volume":25, "pitch":105, "pan":0}
 * @default {"volume":25, "pitch":105, "pan":0}
 *
 * @param PickupBarrel
 * @desc Sound effect when HitDad picks up a barrel
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param PickupBarrelParam
 * @type string
 * @desc: {"volume":25, "pitch":105, "pan":0}
 * @default {"volume":25, "pitch":105, "pan":0}
 *
 * @param BarrelLand
 * @desc Sound effect when a barrel lands
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param BarrelLandParam
 * @type string
 * @desc: {"volume":25, "pitch":105, "pan":0}
 * @default {"volume":25, "pitch":105, "pan":0}
 *
 * @param GainItem
 * @desc Sound effect when a barrel lands
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param GainItemParam
 * @type string
 * @desc: {"volume":25, "pitch":105, "pan":0}
 * @default {"volume":25, "pitch":105, "pan":0}
 *
 * @param GainHealth
 * @desc Sound effect when a barrel lands
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param GainHealthParam
 * @type string
 * @desc: {"volume":25, "pitch":105, "pan":0}
 * @default {"volume":25, "pitch":105, "pan":0}
 *
 * @param
 * @param ***WEAPON SETTINGS***
 * @default =================================
 *
 * @param
 * @param *MILK BOTTLE*
 * @default ----------------------------
 * @param
 *
 * @param MilkBottle
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param MilkBottleParam
 * @desc: {"volume":50, "pitch"70, "pan":0}
 * @default {"volume":50, "pitch":70, "pan":0}
 *
 * @param MilkBottleKnockout
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param MilkBottleKnockoutParam
 * @desc: {"volume":50, "pitch"70, "pan":0}
 * @default {"volume":50, "pitch":70, "pan":0}
 *
 * @param MilkBottleMiss
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param MilkBottleMissParam
 * @desc: {"volume":50, "pitch"70, "pan":0}
 * @default {"volume":50, "pitch":70, "pan":0}
 *
 * @param
 * @param *DIAPER BOMB*
 * @default ----------------------------
 * @param
 *
 * @param ThrowDiaper
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param ThrowDiaperParam
 * @desc: {"volume":50, "pitch"70, "pan":0}
 * @default {"volume":50, "pitch":70, "pan":0}
 *
 * @param ThrowDiaperImpact
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param ThrowDiaperImpactParam
 * @desc: {"volume":50, "pitch"70, "pan":0}
 * @default {"volume":50, "pitch":70, "pan":0}
 *
 * @param DiaperGuardHit
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DiaperGuardHitParam
 * @desc: {"volume":50, "pitch"70, "pan":0}
 * @default {"volume":50, "pitch":70, "pan":0}
 *
 * @param
 * @param *DAD JOKE*
 * @default ----------------------------
 * @param
 *
 * @param DadJoke
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadJokeParam
 * @desc: {"volume":50, "pitch"70, "pan":0}
 * @default {"volume":50, "pitch":70, "pan":0}
 * 
 * @param
 * @param *WEAPONS COUNTDOWN*
 * @default ----------------------------
 * @param
 * 
 * @param Countdown
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param CountdownParam
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 *
 * @param
 * @param ***ENEMY SETTINGS***
 * @default ==================================
 * @param
 *
 * @param Shoot
 * @desc Sound effect when enemy fires bullet
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param ShootParam
 * @desc: {"volume":90, "pitch"70, "pan":0}
 * @default {"volume":90, "pitch":70, "pan":0}
 * 
 * @param Thud
 * @desc Sound effect when enemy is knockedout
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param ThudParam
 * @desc: {"volume":90, "pitch"70, "pan":0}
 * @default {"volume":90, "pitch":70, "pan":0}
 *
 * @param
 * @param ***VOICE SETTINGS***
 * @default =================================
 * @param
 *
 * @param KidHey
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidHeyParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 *
 * @param KidHmm
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidHmmParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 *
 * @param KidHuh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidHuhParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 *
 * @param KidWow
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidWowParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param KidSurprised
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidSurprisedParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param KidLaugh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidLaughParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param KidSad
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidSadParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param KidGo
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidGoParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 *
 * @param KidAhh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidAhhParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param Monkey
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param MonkeyParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadHuh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadHuhParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadOhh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadOhhParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadHmm
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadHmmParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadHighAhh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadHighAhhParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadLowAhh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadLowAhhParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadLaugh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadLaughParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadSigh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadSighParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param KidSigh
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param KidSighParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadConfront
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadConfrontParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadAngry
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadAngryParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param TomAnswer
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param TomAnswerParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param TomTell
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param TomTellParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param TomAdd
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param TomAddParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param TomGo
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param TomGoParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadBreath
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadBreathParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadQuestion
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadQuestionParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 * 
 * @param DadWonder
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param DadWonderParam
 * @type string
 * @desc: {"volume":100, "pitch"100, "pan":0}
 * @default {"volume":100, "pitch":100, "pan":0}
 */

var parameters = PluginManager.parameters('SPFAudio');

/** Player Sound Effects **/

var SE_JUMP = JSON.parse(parameters['JumpParam'] || '{}');
SE_JUMP.name = parameters['Jump'] || '';

var SE_JUMPLAND = JSON.parse(parameters['JumpLandParam'] || '{}');
SE_JUMPLAND.name = parameters['JumpLand'] || '';

var SE_WALKSTEP = JSON.parse(parameters['WalkStepParam'] || '{}');
SE_WALKSTEP.name = parameters['WalkStep'] || '';

var SE_WALKSTEPHEAVY = JSON.parse(parameters['WalkStepHeavyParam'] || '{}');
SE_WALKSTEPHEAVY.name = parameters['WalkStepHeavy'] || '';

var SE_LADDERSTEP = JSON.parse(parameters['LadderStepParam'] || '{}');
SE_LADDERSTEP.name = parameters['LadderStep'] || '';

var SE_THROWBOX = JSON.parse(parameters['ThrowBoxParam'] || '{}');
SE_THROWBOX.name = parameters['ThrowBox'] || '';

var SE_PICKUPBOX = JSON.parse(parameters['PickupBoxParam'] || '{}');
SE_PICKUPBOX.name = parameters['PickupBox'] || '';

var SE_PICKUPBARREL = JSON.parse(parameters['PickupBarrelParam'] || '{}');
SE_PICKUPBARREL.name = parameters['PickupBarrel'] || '';

var SE_BOXLAND = JSON.parse(parameters['BoxLandParam'] || '{}');
SE_BOXLAND.name = parameters['BoxLand'] || '';

var SE_BARRELLAND = JSON.parse(parameters['BarrelLandParam'] || '{}');
SE_BARRELLAND.name = parameters['BarrelLand'] || '';

var SE_GAINITEM = JSON.parse(parameters['GainItemParam'] || '{}');
SE_GAINITEM.name = parameters['GainItem'] || '';

var SE_GAINHEALTH = JSON.parse(parameters['GainHealthParam'] || '{}');
SE_GAINHEALTH.name = parameters['GainHealth'] || '';

/** Weapon Sound Effects **/

var SE_MILKBOTTLE = JSON.parse(parameters['MilkBottleParam'] || '{}');
SE_MILKBOTTLE.name = parameters['MilkBottle'] || '';

var SE_MILKBOTTLEMISS = JSON.parse(parameters['MilkBottleMissParam'] || '{}');
SE_MILKBOTTLEMISS.name = parameters['MilkBottleMiss'] || '';

var SE_MILKBOTTLE_KNOCKOUT = JSON.parse(parameters['MilkBottleKnockoutParam'] || '{}');
SE_MILKBOTTLE_KNOCKOUT.name = parameters['MilkBottleKnockout'] || '';

var SE_DIAPERTHROW = JSON.parse(parameters['ThrowDiaperParam'] || '{}');
SE_DIAPERTHROW.name = parameters['ThrowDiaper'] || '';

var SE_DIAPERTHROWIMPACT = JSON.parse(parameters['ThrowDiaperParam'] || '{}');
SE_DIAPERTHROWIMPACT.name = parameters['ThrowDiaperImpact'] || '';

var SE_DIAPERGUARDHIT = JSON.parse(parameters['DiaperGuardHitParam'] || '{}');
SE_DIAPERGUARDHIT.name = parameters['DiaperGuardHit'] || '';

var SE_DADJOKE = JSON.parse(parameters['DadJokeParam'] || '{}');
SE_DADJOKE.name = parameters['DadJoke'] || '';

var SE_COUNTDOWN = JSON.parse(parameters['CountdownParam'] || '{}');
SE_COUNTDOWN.name = parameters['Countdown'] || '';

/** Enemy Sound Effects **/

var SE_SHOOT = JSON.parse(parameters['ShootParam'] || '{}');
SE_SHOOT.name = parameters['Shoot'] || '';

var SE_THUD = JSON.parse(parameters['ThudParam'] || '{}');
SE_THUD.name = parameters['Thud'] || '';

/** Voice Sound Effects **/

var SE_KIDHEY = JSON.parse(parameters['KidHeyParam'] || '{}');
SE_KIDHEY.name = parameters['KidHey'] || '';

var SE_KIDHMM = JSON.parse(parameters['KidHmmParam'] || '{}');
SE_KIDHMM.name = parameters['KidHmm'] || '';

var SE_KIDHUH = JSON.parse(parameters['KidHuhParam'] || '{}');
SE_KIDHUH.name = parameters['KidHuh'] || '';

var SE_KIDSURPRISED = JSON.parse(parameters['KidSurprisedParam'] || '{}');
SE_KIDSURPRISED.name = parameters['KidSurprised'] || '';

var SE_KIDWOW = JSON.parse(parameters['KidWowParam'] || '{}');
SE_KIDWOW.name = parameters['KidWow'] || '';

var SE_KIDLAUGH = JSON.parse(parameters['KidLaughParam'] || '{}');
SE_KIDLAUGH.name = parameters['KidLaugh'] || '';

var SE_KIDSAD = JSON.parse(parameters['KidSadParam'] || '{}');
SE_KIDSAD.name = parameters['KidSad'] || '';

var SE_KIDGO = JSON.parse(parameters['KidGoParam'] || '{}');
SE_KIDGO.name = parameters['KidGo'] || '';

var SE_KIDAHH = JSON.parse(parameters['KidAhhParam'] || '{}');
SE_KIDAHH.name = parameters['KidAhh'] || '';

var SE_MONKEY = JSON.parse(parameters['MonkeyParam'] || '{}');
SE_MONKEY.name = parameters['Monkey'] || '';

var SE_DADHUH = JSON.parse(parameters['DadHuhParam'] || '{}');
SE_DADHUH.name = parameters['DadHuh'] || '';

var SE_DADOHH = JSON.parse(parameters['DadOhhParam'] || '{}');
SE_DADOHH.name = parameters['DadOhh'] || '';

var SE_DADHMM = JSON.parse(parameters['DadHmmParam'] || '{}');
SE_DADHMM.name = parameters['DadHmm'] || '';

var SE_DADHIGHAHH = JSON.parse(parameters['DadHighAhhParam'] || '{}');
SE_DADHIGHAHH.name = parameters['DadHighAhh'] || '';

var SE_DADLOWAHH = JSON.parse(parameters['DadLowAhhParam'] || '{}');
SE_DADLOWAHH.name = parameters['DadLowAhh'] || '';

var SE_DADLAUGH = JSON.parse(parameters['DadLaughParam'] || '{}');
SE_DADLAUGH.name = parameters['DadLaugh'] || '';

var SE_DADSIGH = JSON.parse(parameters['DadSighParam'] || '{}');
SE_DADSIGH.name = parameters['DadSigh'] || '';

var SE_KIDSIGH = JSON.parse(parameters['KidSighParam'] || '{}');
SE_KIDSIGH.name = parameters['KidSigh'] || '';

var SE_DADCONFRONT = JSON.parse(parameters['DadConfrontParam'] || '{}');
SE_DADCONFRONT.name = parameters['DadConfront'] || '';

var SE_DADANGRY = JSON.parse(parameters['DadAngryParam'] || '{}');
SE_DADANGRY.name = parameters['DadAngry'] || '';

var SE_TOMANSWER = JSON.parse(parameters['TomAnswerParam'] || '{}');
SE_TOMANSWER.name = parameters['TomAnswer'] || '';

var SE_TOMTELL = JSON.parse(parameters['TomTellParam'] || '{}');
SE_TOMTELL.name = parameters['TomTell'] || '';

var SE_TOMADD = JSON.parse(parameters['TomAddParam'] || '{}');
SE_TOMADD.name = parameters['TomAdd'] || '';

var SE_TOMGO = JSON.parse(parameters['TomGoParam'] || '{}');
SE_TOMGO.name = parameters['TomGo'] || '';

var SE_DADBREATH = JSON.parse(parameters['DadBreathParam'] || '{}');
SE_DADBREATH.name = parameters['DadBreath'] || '';

var SE_DADQUESTION = JSON.parse(parameters['DadQuestionParam'] || '{}');
SE_DADQUESTION.name = parameters['DadQuestion'] || '';

var SE_DADWONDER = JSON.parse(parameters['DadWonderParam'] || '{}');
SE_DADWONDER.name = parameters['DadWonder'] || '';

// To play different footstep sound on last level
function playFootstepSound() {
    if ($gameMap.mapId() !== 10) { //Not last map
        AudioManager.playSe(SE_WALKSTEP);
    } else {
        AudioManager.playSe(SE_WALKSTEPHEAVY);
    }

}

/** Plugin commands for event specific sounds **/

var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    aliasPluginCommand.call(this, command, args);

    if (command === 'Audio') {
        // console.log("Audio Plugin Called");
        switch(args[0]) {
            case "KidHey":
                AudioManager.playSe(SE_KIDHEY);
                break;
            case "KidHmm":
                AudioManager.playSe(SE_KIDHMM);
                break;
            case "KidHuh":
                AudioManager.playSe(SE_KIDHUH);
                break;
            case "KidSurprised":
                AudioManager.playSe(SE_KIDSURPRISED);
                break;
            case "KidWow":
                AudioManager.playSe(SE_KIDWOW);
                break;
            case "KidLaugh":
                AudioManager.playSe(SE_KIDLAUGH);
                break;
            case "KidSad":
                AudioManager.playSe(SE_KIDSAD);
                break;
            case "KidGo":
                AudioManager.playSe(SE_KIDGO);
                break;
            case "KidAhh":
                AudioManager.playSe(SE_KIDAHH);
                break;
            case "Monkey":
                AudioManager.playSe(SE_MONKEY);
                break;
            case "DadHuh":
                AudioManager.playSe(SE_DADHUH);
                break;
            case "DadOhh":
                AudioManager.playSe(SE_DADOHH);
                break;
            case "DadHmm":
                AudioManager.playSe(SE_DADHMM);
                break;
            case "DadHighAhh":
                AudioManager.playSe(SE_DADHIGHAHH);
                break;
            case "DadLowAhh":
                AudioManager.playSe(SE_DADLOWAHH);
                break;
            case "DadLaugh":
                AudioManager.playSe(SE_DADLAUGH);
                break;
            case "DadSigh":
                AudioManager.playSe(SE_DADSIGH);
                break;
            case "KidSigh":
                AudioManager.playSe(SE_KIDSIGH);
                break;
            case "DadConfront":
                AudioManager.playSe(SE_DADCONFRONT);
                break;
            case "DadAngry":
                AudioManager.playSe(SE_DADANGRY);
                break;
            case "TomAnswer":
                AudioManager.playSe(SE_TOMANSWER);
                break;
            case "TomTell":
                AudioManager.playSe(SE_TOMTELL);
                break;
            case "TomAdd":
                AudioManager.playSe(SE_TOMADD);
                break;
            case "TomGo":
                AudioManager.playSe(SE_TOMGO);
                break;
            case "DadBreath":
                AudioManager.playSe(SE_DADBREATH);
                break;
            case "DadQuestion":
                AudioManager.playSe(SE_DADQUESTION);
                break;
            case "DadWonder":
                AudioManager.playSe(SE_DADWONDER);
                break;
            case "HealthPickup":
                AudioManager.playSe(SE_GAINHEALTH);
                break;
            default:
                console.log("Invalid Audio Plugin Call:", args[0], "does not exist");
                break;
        }
    }
};