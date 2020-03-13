// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"Community_Basic","status":true,"description":"Plugin used to set basic parameters.","parameters":{"cacheLimit":"20","screenWidth":"1000","screenHeight":"690","changeWindowWidthTo":"","changeWindowHeightTo":"","renderingMode":"auto","alwaysDash":"off"}},
{"name":"MadeWithMv","status":true,"description":"Show a Splash Screen \"Made with MV\" and/or a Custom Splash Screen before going to main screen.","parameters":{"Show Made With MV":"false","Made with MV Image":"MadeWithMv","Show Custom Splash":"true","Custom Image":"7PFLogoPixel","Fade Out Time":"120","Fade In Time":"120","Wait Time":"160"}},
{"name":"SPFAudio","status":true,"description":"Plugin to extend consolidate all sound effects so they can be easily\r\nadjusted throughout the game.","parameters":{"":"","***PLAYER SETTINGS***":"==================================","Jump":"Jump_Grunt","JumpParam":"{\"volume\":40, \"pitch\":100, \"pan\":0}","JumpLand":"Jump_Land","JumpLandParam":"{\"volume\":100, \"pitch\":100, \"pan\":0}","WalkStep":"walking_step_v2","WalkStepParam":"{\"volume\":60, \"pitch\":100, \"pan\":0}","LadderStep":"ladder-climb-v2","LadderStepParam":"{\"volume\":50, \"pitch\":100, \"pan\":0}","ThrowBox":"throw_item2","ThrowBoxParam":"{\"volume\":30, \"pitch\":60, \"pan\":0}","PickupBox":"crate-lift","PickupBoxParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}","BoxLand":"crate-land","BoxLandParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}","PickupBarrel":"barrel-lift","PickupBarrelParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}","BarrelLand":"barrel-drop","BarrelLandParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}","GainItem":"item-get","GainItemParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}","***WEAPON SETTINGS***":"=================================","*MILK BOTTLE*":"----------------------------","MilkBottle":"bottle-attack-v2","MilkBottleParam":"{\"volume\":50, \"pitch\":100, \"pan\":0}","MilkBottleMiss":"bottle-miss","MilkBottleMissParam":"{\"volume\":50, \"pitch\":70, \"pan\":0}","*DIAPER BOMB*":"----------------------------","ThrowDiaper":"diaper-throw","ThrowDiaperParam":"{\"volume\":50, \"pitch\":70, \"pan\":0}","ThrowDiaperImpact":"diaper-impact-v2","ThrowDiaperImpactParam":"{\"volume\":90, \"pitch\":70, \"pan\":0}","DiaperGuardHit":"guard-puke","DiaperGuardHitParam":"{\"volume\":50, \"pitch\":100, \"pan\":0}","*DAD JOKE*":"----------------------------","DadJoke":"guards-laugh-v2","DadJokeParam":"{\"volume\":50, \"pitch\":70, \"pan\":0}","***ENEMY SETTINGS***":"==================================","Shoot":"enemy_shoot","ShootParam":"{\"volume\":90, \"pitch\":70, \"pan\":0}","***VOICE SETTINGS***":"=================================","KidHey":"hey-kid","KidHeyParam":"{\"volume\":100, \"pitch\":100, \"pan\":0}","KidHmm":"hmm-kid","KidHmmParam":"{\"volume\":100, \"pitch\":100, \"pan\":0}","KidHuh":"huh-kid","KidHuhParam":"{\"volume\":100, \"pitch\":100, \"pan\":0}","KidSurprised":"surprised-kid","KidSurprisedParam":"{\"volume\":100, \"pitch\":100, \"pan\":0}","Monkey":"monkey-v2","MonkeyParam":"{\"volume\":100, \"pitch\":100, \"pan\":0}"}},
{"name":"TMJumpAction","status":true,"description":"マップシーンをそれっぽいアクションゲームにします。\r\n使用方法などは配布サイトを参照してください。","parameters":{"gravity":"0.015","friction":"10.0","tileMarginTop":"0","stepsForTurn":"20","allDeadEvent":"0","guardState":"2","guardMoveRate":"25","eventCollapse":"true","hpGauge":"false","floorDamage":"1","damageFallRate":"1","damageFallHeight":"100","flickWeight":"1","flickSkill":"1","stageRegion":"60","wallRegion":"61","slipWallRegion":"62","slipFloorRegion":"63","roughFloorRegion":"64","marshFloorRegion":"65","waterTerrainTag":"1","levelupPopup":"LEVEL UP!!","levelupAnimationId":"46","attackToOk":"true","jumpToCancel":"true","useEventSeSwim":"true","jumpSe":"Jump_Grunt","jumpSeParam":"{\"volume\":40, \"pitch\":100, \"pan\":0}","dashSe":"","dashSeParam":"{\"volume\":90, \"pitch\":50, \"pan\":0}","flickSe":"","flickSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","swimSe":"","swimSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","changeSe":"","changeSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","carrySe":"Jump_Grunt","carrySeParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}","hurlSe":"throw_item2","hurlSeParam":"{\"volume\":30, \"pitch\":60, \"pan\":0}","guardSe":"","guardSeParam":"{\"volume\":90, \"pitch\":150, \"pan\":0}","landSe":"Jump_Land","landSeParam":"{\"volume\":50, \"pitch\":100, \"pan\":0}","walkSe":"walking_step_v2","walkSeParam":"{\"volume\":60, \"pitch\":100, \"pan\":0}","damagedSe":"knockout_hit","damagedSeParam":"{\"volume\":50, \"pitch\":90, \"pan\":0}","playerBulletsMax":"32","enemyBulletsMax":"256","weaponSprite":"true","autoDamageSe":"true","bulletTypeName1":"Bullet1","bulletTypeName2":"Bullet1","bulletTypeName3":"Bullet1","bulletTypeName4":"Bullet1","bulletTypeSize":"6,6,6,6","attackKey":"","pickupKey":"","jumpKey":" ","dashKey":"","padButtons":"ok,cancel,menu,shift,attack,jump,pageup,pagedown","padButtonNames":"決定,キャンセル,メニュー,ダッシュ,アタック,ジャンプ,キャラ変更(前),キャラ変更(次)","defaultPadButtons":"cancel,ok,shift,jump,pageup,pagedown,attack,menu,menu,menu,menu,menu","padConfigCommand":"パッドボタン配置","stepAnimeConstantA":"0.13","stepAnimeConstantB":"300"}},
{"name":"TMItemShortCut","status":true,"description":"マップシーンで直接アイテムを使用する機能を追加します。","parameters":{"shortCutKey":"E","slotNumber":"3","windowX":"608","windowY":"600","windowWidth":"204","windowHeight":"64","backgroundType":"1","windowHide":"false"}},
{"name":"TDDP_BindPictureToMap","status":true,"description":"1.0.2 Plugin Commands for binding pictures to the map and/or changing what layer they're drawn on.","parameters":{}},
{"name":"SRD_SuperToolsEngine","status":true,"description":"The heart of all maker-style plugins; it adds a playtesting editor that can be opened with F12.","parameters":{"Connect Editor":"true","Auto Open Window":"false","Auto Move Window":"true","Menu Editor Exempt List":"[\"Window_BattleLog\",\"Window_MapName\"]"}},
{"name":"SRD_HUDMaker","status":true,"description":"Allows developers to create their own map-based HUD through an in-game GUI window!","parameters":{"Active Updating":"false","Show During Events":"transparent","Map Global Condition":"","Battle Global Condition":"","Disable Delete Key":"true"}},
{"name":"SPFCore","status":true,"description":"This plugin is required for all SPF plugins to work.\r\nThis plugin assumes that TMJumpAction plugin is also installed. Also each level\r\nrequires some initialization, see above.\r\n\r\nIMPORTANT: Import this plugin BEFORE the other SPF plugins.","parameters":{}},
{"name":"SPFTrajectory","status":true,"description":"Draws trajectories for boxes and diaper bombs when holding right-click","parameters":{}},
{"name":"SPFSmokeBomb","status":true,"description":"This plugin implements a smoke bomb attack.","parameters":{"itemID":"2","gravity":"0.005","initialVelocity":"0.20","explosionRadius":"150","stunDuration":"250","hurlSe":"throw_item2","hurlSeParam":"{\"volume\":50, \"pitch\":70, \"pan\":0}","impactSe":"Jump_Land","impactSeParam":"{\"volume\":90, \"pitch\":70, \"pan\":0}"}},
{"name":"SPFDadJoke","status":true,"description":"This plugin implements the dad joke attack.","parameters":{"itemID":"3","stunRadius":"200","stunDuration":"250","chargeTime":"100","characterWidth":"20","textHeight":"50"}},
{"name":"SPFEnemyProjectileAttack","status":true,"description":"This plugin implements a projectile attack for enemies.","parameters":{"enemyDetectionRange":"5","bulletDamage":"150","bulletSpeed":"0.1","shootSe":"enemy_shoot","shootSeParam":"{\"volume\":90, \"pitch\":70, \"pan\":0}"}},
{"name":"SPFPhoneCall","status":true,"description":"This plugin handles the phone call mechanic with just a few plugin commands\r\nto be called in the event triggers. Must be used in conjunction with SRD_HUDMaker\r\nplugin for visual indication of phone ringing.","parameters":{"key":"mouseup","varNum":"10","ringtone":"phone_rington","ringtoneParams":"{\"volume\":70, \"pitch\":90, \"pan\":0}","ringDuration":"13","phoneClickSound":"phone_pickup","phoneClickParams":"{\"volume\":50, \"pitch\":100, \"pan\":0}"}},
{"name":"SPFBoxMouseToss","status":true,"description":"Plugin to extend TMJumpAction to allow player to hurl box in the\r\ndirection of a mouse click. REQUIRES TMJumpAction plugin.","parameters":{"hurlSe":"throw_item2","hurlSeParam":"{\"volume\":30, \"pitch\":60, \"pan\":0}","carrySe":"Jump_Grunt","carrySeParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}"}},
{"name":"SPFMouseMechanics","status":true,"description":"Plugin to extend TMJumpAction to allow player to hurl box in the\r\ndirection of a mouse click. REQUIRES TMJumpAction plugin.","parameters":{"hurlSe":"","hurlSeParam":"{\"volume\":90, \"pitch\":70, \"pan\":0}"}},
{"name":"SPFCheckPoint","status":true,"description":"This plugin is to implement checkpoints so item inventory and position are\r\nreset upon dying.","parameters":{}},
{"name":"YEP_SaveEventLocations","status":true,"description":"Enable specified maps to memorize the locations of events\nwhen leaving and loading them upon reentering the map.","parameters":{}},
{"name":"SRD_TimerUpgrade","status":true,"description":"Gives developers move control over the visual and mechanical aspects of the game's timer system.","parameters":{"Timer Format":"%3:%4","Timer Position":"TOP-L","Timer Start SE":"","Timer Expire SE":"Bell3, 80, 100, 0","Pause Color":"#FFFF00","Use Background":"false","== Auto Settings ==":"","Use Auto-Stop":"true","Use Auto-Pause":"true","Auto-Pause Opacity":"120","Use Auto-Abort":"true","== Label Settings ==":"","Default Label":"","Label Font Size":"22","== Font Settings ==":"","Timer Font":"GameFont","Timer Font Size":"40","Timer Italic":"false","Timer Text Color":"#e32020","Timer Outline Color":"#ffffff"}},
{"name":"YEP_MessageCore","status":true,"description":"Adds more features to the Message Window to customized the\nway your messages appear and functions.","parameters":{"---General---":"","Default Rows":"4","Default Width":"Graphics.boxWidth","Face Indent":"Window_Base._faceWidth + 24","Fast Forward":"Input.isPressed('pagedown')","Word Wrapping":"false","---Font---":"","Font Name":"GameFont","Font Size":"28","Font Size Change":"12","Font Changed Max":"96","Font Changed Min":"12","---Name Box---":"","Name Box Buffer X":"-28","Name Box Buffer Y":"0","Name Box Padding":"this.standardPadding() * 4","Name Box Color":"0","Name Box Clear":"false","Name Box Added Text":"\\c[0]"}},
{"name":"SPFMeleeAttack","status":true,"description":"This plugin implements a melee attack where when the player\r\npresses a key with \"keyCode\", the gamePlayer will use an item specified\r\nby \"itemID\" and immediately incapacitate an enemy.","parameters":{"itemID":"1","swingRange":"3","swingSpeed":"5","verticalOffset":"50","horizontalOffset":"7","soundEffect":"","soundEffectParams":"{\"volume\":90, \"pitch\":100, \"pan\":0}"}}
];
