// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"Community_Basic","status":true,"description":"Plugin used to set basic parameters.","parameters":{"cacheLimit":"20","screenWidth":"1000","screenHeight":"690","changeWindowWidthTo":"","changeWindowHeightTo":"","renderingMode":"auto","alwaysDash":"off"}},
{"name":"MadeWithMv","status":false,"description":"Show a Splash Screen \"Made with MV\" and/or a Custom Splash Screen before going to main screen.","parameters":{"Show Made With MV":"false","Made with MV Image":"MadeWithMv","Show Custom Splash":"true","Custom Image":"7PFLogoPixelBigger","Fade Out Time":"120","Fade In Time":"120","Wait Time":"160"}},
{"name":"TMJumpAction","status":true,"description":"マップシーンをそれっぽいアクションゲームにします。\r\n使用方法などは配布サイトを参照してください。","parameters":{"gravity":"0.02","friction":"1.0","tileMarginTop":"0","stepsForTurn":"20","allDeadEvent":"0","guardState":"2","guardMoveRate":"25","eventCollapse":"true","hpGauge":"true","floorDamage":"10","damageFallRate":"10","damageFallHeight":"5","flickWeight":"1","flickSkill":"1","stageRegion":"60","wallRegion":"61","slipWallRegion":"62","slipFloorRegion":"63","roughFloorRegion":"64","marshFloorRegion":"65","waterTerrainTag":"1","levelupPopup":"LEVEL UP!!","levelupAnimationId":"46","attackToOk":"true","jumpToCancel":"true","useEventSeSwim":"true","jumpSe":"","jumpSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","dashSe":"","dashSeParam":"{\"volume\":90, \"pitch\":50, \"pan\":0}","flickSe":"","flickSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","swimSe":"","swimSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","changeSe":"","changeSeParam":"{\"volume\":90, \"pitch\":100, \"pan\":0}","carrySe":"","carrySeParam":"{\"volume\":90, \"pitch\":70, \"pan\":0}","hurlSe":"","hurlSeParam":"{\"volume\":90, \"pitch\":70, \"pan\":0}","guardSe":"","guardSeParam":"{\"volume\":90, \"pitch\":150, \"pan\":0}","playerBulletsMax":"32","enemyBulletsMax":"256","weaponSprite":"true","autoDamageSe":"true","bulletTypeName1":"Bullet1","bulletTypeName2":"Bullet1","bulletTypeName3":"Bullet1","bulletTypeName4":"Bullet1","bulletTypeSize":"6,6,6,6","attackKey":"Q","pickupKey":"X","jumpKey":" ","dashKey":"C","padButtons":"ok,cancel,menu,shift,attack,jump,pageup,pagedown","padButtonNames":"決定,キャンセル,メニュー,ダッシュ,アタック,ジャンプ,キャラ変更(前),キャラ変更(次)","defaultPadButtons":"cancel,ok,shift,jump,pageup,pagedown,attack,menu,menu,menu,menu,menu","padConfigCommand":"パッドボタン配置","stepAnimeConstantA":"0.1","stepAnimeConstantB":"300"}},
{"name":"TDDP_BindPictureToMap","status":true,"description":"1.0.2 Plugin Commands for binding pictures to the map and/or changing what layer they're drawn on.","parameters":{}},
{"name":"TMItemShortCut","status":true,"description":"マップシーンで直接アイテムを使用する機能を追加します。","parameters":{"shortCutKey":"E","slotNumber":"8","windowX":"408","windowY":"0","windowWidth":"408","windowHeight":"64","backgroundType":"0","windowHide":"true"}},
{"name":"SRD_SuperToolsEngine","status":true,"description":"The heart of all maker-style plugins; it adds a playtesting editor that can be opened with F12.","parameters":{"Connect Editor":"true","Auto Open Window":"false","Auto Move Window":"true","Menu Editor Exempt List":"[\"Window_BattleLog\",\"Window_MapName\"]"}},
{"name":"SRD_HUDMaker","status":true,"description":"Allows developers to create their own map-based HUD through an in-game GUI window!","parameters":{"Active Updating":"false","Show During Events":"transparent","Map Global Condition":"","Battle Global Condition":"","Disable Delete Key":"true"}},
{"name":"SPFCore","status":true,"description":"This plugin is required for all SPF plugins to work.\r\nThis plugin assumes that TMJumpAction plugin is also installed. Also each level\r\nrequires some initialization, see above.\r\n\r\nIMPORTANT: Import this plugin BEFORE the other SPF plugins.","parameters":{}},
{"name":"SPFMeleeAttack","status":true,"description":"This plugin implements a melee attack where when the player\r\npresses a key with \"keyCode\", the gamePlayer will use an item specified\r\nby \"itemID\" and immediately incapacitate an enemy.","parameters":{"keyCode":"81","itemID":"1"}},
{"name":"SPFEnemyProjectileAttack","status":true,"description":"This plugin implements a projectile attack for enemies.","parameters":{"enemyDetectionRange":"5","bulletDamage":"500","bulletSpeed":"0.1"}},
{"name":"SPFPhoneCall","status":true,"description":"This plugin handles the phone call mechanic with just a few plugin commands\r\nto be called in the event triggers. Must be used in conjunction with SRD_HUDMaker\r\nplugin for visual indication of phone ringing.","parameters":{"key":"mouseup","varNum":"10"}}
];
