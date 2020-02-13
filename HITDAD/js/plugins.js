// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"Community_Basic","status":true,"description":"Plugin used to set basic parameters.","parameters":{"cacheLimit":"20","screenWidth":"1000","screenHeight":"690","changeWindowWidthTo":"","changeWindowHeightTo":"","renderingMode":"auto","alwaysDash":"off"}},
{"name":"MadeWithMv","status":true,"description":"Show a Splash Screen \"Made with MV\" and/or a Custom Splash Screen before going to main screen.","parameters":{"Show Made With MV":"false","Made with MV Image":"MadeWithMv","Show Custom Splash":"true","Custom Image":"7PFLogoPixel","Fade Out Time":"120","Fade In Time":"120","Wait Time":"160"}},
{"name":"TMJumpAction","status":true,"description":"マップシーンをそれっぽいアクションゲームにします。\r\n使用方法などは配布サイトを参照してください。","parameters":{"gravity":"0.015","friction":"1.0","tileMarginTop":"0","stepsForTurn":"20","allDeadEvent":"0","guardState":"2","guardMoveRate":"25","eventCollapse":"true","hpGauge":"true","floorDamage":"1","damageFallRate":"1","damageFallHeight":"100","flickWeight":"1","flickSkill":"1","stageRegion":"60","wallRegion":"61","slipWallRegion":"62","slipFloorRegion":"63","roughFloorRegion":"64","marshFloorRegion":"65","waterTerrainTag":"1","levelupPopup":"LEVEL UP!!","levelupAnimationId":"46","attackToOk":"true","jumpToCancel":"true","useEventSeSwim":"true","jumpSe":"Jump_Grunt","jumpSeParam":"{\"volume\":40, \"pitch\":100, \"pan\":0}","dashSe":"","dashSeParam":"{\"volume\":90, \"pitch\":50, \"pan\":0}","flickSe":"","flickSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","swimSe":"","swimSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","changeSe":"","changeSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","carrySe":"Jump_Grunt","carrySeParam":"{\"volume\":25, \"pitch\":105, \"pan\":0}","hurlSe":"throw_item2","hurlSeParam":"{\"volume\":30, \"pitch\":60, \"pan\":0}","guardSe":"","guardSeParam":"{\"volume\":90, \"pitch\":150, \"pan\":0}","landSe                                        // 7PFAudio":"","landSeParam                                   // 7PFAudio":"{\"volume\":50, \"pitch\":100, \"pan\":0}","damagedSe":"knockout_hit","damagedSeParam":"{\"volume\":50, \"pitch\":90, \"pan\":0}","playerBulletsMax":"32","enemyBulletsMax":"256","weaponSprite":"true","autoDamageSe":"true","bulletTypeName1":"Bullet1","bulletTypeName2":"Bullet1","bulletTypeName3":"Bullet1","bulletTypeName4":"Bullet1","bulletTypeSize":"6,6,6,6","attackKey":"Q","pickupKey":"F","jumpKey":" ","dashKey":"C","padButtons":"ok,cancel,menu,shift,attack,jump,pageup,pagedown","padButtonNames":"決定,キャンセル,メニュー,ダッシュ,アタック,ジャンプ,キャラ変更(前),キャラ変更(次)","defaultPadButtons":"cancel,ok,shift,jump,pageup,pagedown,attack,menu,menu,menu,menu,menu","padConfigCommand":"パッドボタン配置","stepAnimeConstantA":"0.1","stepAnimeConstantB":"300"}},
{"name":"TMItemShortCut","status":true,"description":"マップシーンで直接アイテムを使用する機能を追加します。","parameters":{"shortCutKey":"E","slotNumber":"8","windowX":"408","windowY":"0","windowWidth":"408","windowHeight":"64","backgroundType":"0","windowHide":"true"}},
{"name":"TDDP_BindPictureToMap","status":true,"description":"1.0.2 Plugin Commands for binding pictures to the map and/or changing what layer they're drawn on.","parameters":{}},
{"name":"SRD_SuperToolsEngine","status":true,"description":"The heart of all maker-style plugins; it adds a playtesting editor that can be opened with F12.","parameters":{"Connect Editor":"true","Auto Open Window":"false","Auto Move Window":"true","Menu Editor Exempt List":"[\"Window_BattleLog\",\"Window_MapName\"]"}},
{"name":"SRD_HUDMaker","status":true,"description":"Allows developers to create their own map-based HUD through an in-game GUI window!","parameters":{"Active Updating":"false","Show During Events":"transparent","Map Global Condition":"","Battle Global Condition":"","Disable Delete Key":"true"}},
{"name":"SPFCore","status":true,"description":"This plugin is required for all SPF plugins to work.\r\nThis plugin assumes that TMJumpAction plugin is also installed. Also each level\r\nrequires some initialization, see above.\r\n\r\nIMPORTANT: Import this plugin BEFORE the other SPF plugins.","parameters":{}},
{"name":"SPFMeleeAttack","status":true,"description":"This plugin implements a melee attack where when the player\r\npresses a key with \"keyCode\", the gamePlayer will use an item specified\r\nby \"itemID\" and immediately incapacitate an enemy.","parameters":{"keyCode":"81","itemID":"1","soundEffect":"knockout_hit","soundEffectParams":"{\"volume\":90, \"pitch\":100, \"pan\":0}"}},
{"name":"SPFEnemyProjectileAttack","status":true,"description":"This plugin implements a projectile attack for enemies.","parameters":{"enemyDetectionRange":"5","bulletDamage":"150","bulletSpeed":"0.1"}},
{"name":"SPFPhoneCall","status":true,"description":"This plugin handles the phone call mechanic with just a few plugin commands\r\nto be called in the event triggers. Must be used in conjunction with SRD_HUDMaker\r\nplugin for visual indication of phone ringing.","parameters":{"key":"mouseup","varNum":"10","ringtone":"phone_rington","ringtoneParams":"{\"volume\":70, \"pitch\":90, \"pan\":0}","ringDuration":"8","phoneClickSound":"phone_pickup","phoneClickParams":"{\"volume\":50, \"pitch\":100, \"pan\":0}"}},
{"name":"SPFBoxMouseToss","status":true,"description":"Plugin to extend TMJumpAction to allow player to hurl box in the\r\ndirection of a mouse click. REQUIRES TMJumpAction plugin.","parameters":{"hurlSe":"throw_item2","hurlSeParam":"{\"volume\":30, \"pitch\":60, \"pan\":0}"}},
{"name":"SPFSmokeBomb","status":true,"description":"This plugin implements a smoke bomb attack.","parameters":{"itemID":"2","gravity":"0.005","initialVelocity":"0.20","explosionRadius":"150","hurlSe":"throw_item2","hurlSeParam":"{\"volume\":40, \"pitch\":95, \"pan\":0}","impactSe":"Jump_Land","impactSeParam":"{\"volume\":100, \"pitch\":70, \"pan\":0}"}}
];
