/*:
@plugindesc This plugin automatically set text color and Word correction
<EST_AUTO_TEXT_COLOR_PLUS>
@author Estriole

@param UseInAllWindows
@desc Use Autocolor in all Windows. will override OnlyUseInMessage and WhatWindowUseThis
@default true

@param OnlyUseInMessage
@desc Use Autocolor only on message. window help, etc won't have effect (true / false) WILL OVERRIDE WhatWindowUseThis
@default false

@param WhatWindowUseThis
@desc List of Windows that use Autocolor (MUST be child/descendand of Window_Base) format: Window_Message, Window_Help, ....
@default Window_Message, Window_Help, Window_NameBox

@param UseYanflyNameBoxFix
@desc use yanfly name box fix... it's overwrite so if yanfly update the namebox...
this patch need to be updated >.<
@default true

@param ReturnColor
@desc return to this color after the text finished. # default 0
@default 0

@param OtherTextUseReturnColor
@desc Make Other Text use ReturnColor. meaning all your \c will become obselete (true/false)
@default false

@param AutoColorSwitch
@desc The switch to turn on autocolor (set to 0 to always on)
@default 0

@param CorrectCapSwitch
@desc Switch to activate the auto capitalization correction.
(will use the key you defined instead) (set to 0 to always on)
@default 0

@param DisableCaseSensitiveSwitch
@desc Switch to deactivate the Case sensitive detection
(set to 0 to ALWAYS DEACTIVATE Case Sensitive)
@default 0

@param StartAutoColor
@desc start with Auto Color's switch switched ON automatically.
(true / false)
@default true

@param StartAutoCorrect
@desc start with Auto Correct's switch switched ON automatically.
(true / false)
@default true

@param StartDisableCaseSensitive
@desc start with DisableCaseSensitive's switch switched ON automatically.
(true / false)
@default true

@param --- Add Entry Below ---
@desc no need to fill this... it's only separator
@default Blank for no entry

@param Starting_Entry 1
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default Nobita; 2

@param Starting_Entry 2
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default Doraemon; 3

@param Starting_Entry 3
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default Giant; 4

@param Starting_Entry 4
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default Suneo; 5

@param Starting_Entry 5
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default Shizuka; 6

@param Starting_Entry 6
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default Mag;10

@param Starting_Entry 7
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 8
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 9
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 10
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 11
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 12
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 13
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 14
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 15
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 16
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 17
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 18
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 19
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 20
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 21
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 22
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 23
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 24
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 25
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 26
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 27
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 28
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 29
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 30
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 31
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 32
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 33
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 34
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 35
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 36
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 37
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 38
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 39
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 40
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 41
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 42
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 43
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 44
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 45
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 46
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 47
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 48
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 49
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param Starting_Entry 50
@desc Format: Yourtext; colorid
separate them with semi colon (;)
@default

@param --- How to add more entry? ---
@desc you can add in game too... read how to use section
@default read help

@help
 ■ Information      ╒══════════════════════════╛
 EST - AUTO TEXT COLOR PLUS
 Version: 1.9
 By Estriole
 File name: EST_AUTO_TEXT_COLOR_PLUS.js

 ■ Introduction     ╒══════════════════════════╛
   This Plugin created based on conversion of my ACE script with same name. 
 
   the original script created because i got tired adding \c[4]Nobita\c[0] in the show message box. 
 so i want to make it automatic. each time i wrote Nobita it will change the color to what i set. 
 useful to color actor names or places or important things. i also add capitalization correction too. 
 so if you write nobita. it could fixed to Nobita(what you set in the config) if you want.
 both auto color and auto caps correct can be binded to switch too if you don't
 want to always using it. 

 ■ Features         ╒══════════════════════════╛
 - Auto Color Text
 - Auto Correct Text (will corrected to what you SET though)
 - Have individual switch for controling when you want some feature activated.
 - SMART Search so XXXword / wordXXX or XXXwordXXX will not included.
 - NOT case sensitive... so it can recognize DoraEmon or DorAEMON.
 - recognize \n[x] message code... so if actor 1 name is Doraemon... it can recognize it

 ■ Changelog       ╒══════════════════════════╛
   v1.0 2015.11.05           Initial Release
   v1.1 2015.11.06       - some regexp fix so plugin parameter is more flexible.
                           in prev version. if we type: Mag;1 
                           in plugin parameter. it won't be recognized. now it's OK.
                         - increase number of starting entry to 30
   v1.2 2015.11.09       - compatibility patch with yanfly message auto wrap.
                         - add parameter OtherTextUseReturnColor if set to true all other text
                           other than what you set in entry will colored using return color.
                         - add parameter OnlyUseInMessage if set to true will only use Autocolor
                           in Window Message... if false... Window Help will somehow affected...
                           when someone (or maybe i will) write plugins such as Global Escape Code for MV.
                           and you set it to false (and hopefully the plugins use convertEscapeCharacter)
                           meaning that this autocolor will works...
   v1.3 2015.11.15       - fix compatibility patch with yanfly message auto wrap.
                           now it won't throw error without it.
   v1.4 2015.11.19       - Add new plugin parameter: WhatWindowUseThis
                           you can specify what window use this plugins autocolor
                           (for now MUST BE child class of Window Base which use DrawTextEx)
                           format:
                           WhatWindowUseThis
                           Window_Message, Window_Help, Window_NameBox, ......
   v1.5 2015.11.23       - Add new plugin parameter: UseInAllWindows
                           if set to true... all window that can autocolor will use autocolor
                           this plugin also compatible with Modern Algebra Global Text Codes
                           so now skill / item / status / other window can be auto colored.
                           make sure his plugin is placed BELOW my plugin.
   v1.6 2015.11.27       - minor bugfix - check switch max for auto color and auto correct.
                           i also advice didn't modify modern algebra and use it as it is
                           by adding \* at the database entry. also having enemies that autocolor
                           using modern algebra plugin combined with yanfly battle engine using
                           visual selection... could cause fps loss (up to 20fps). so if you
                           use yanfly plugin... don't add \* in your enemy name 
   v1.7 2015.11.27       - minor bugfix - if switch is set to 0. will properly auto activate.
                           requested by Prescott... added new parameter. 
                           DisableCaseSensitiveSwitch => switch ID
                           when this is set. 
                           when switch on = CASE NOT SENSITIVE
                           when switch off = CASE SENSITIVE
                           if the switch id is 0. it will always CASE NOT SENSITIVE
                           there's also parameter to make it auto flip on.
   v1.8 2015.12.17       - changed autocolor for actor name... now normal text plugin parameter 
                           doesn't affect \n[1] which is actor 1 name... 
                           ex: plugin param: Doraemon; 11. actor name: Doraemon.
                           it won't be colored...
                           but instead you could use 
                           \\n\[1\];11 
                           (it's basically \n[1] but \ , [ and ] is escaped using extra \)
                           in plugin parameter to color actor 1 name to color 11. this way... 
                           even when you change actor 1 name... it will still colored.
   v1.9 2015.12.18       - add patch for Yanfly Namebox autocolor bugfix. it's overwrite patch...
                           so this plugin must be placed below yanfly's message core if you want
                           the namebox fix patch to work... the patch is optional and you can 
                           turn it off if you want in plugin parameter... 

 ■ Plugin Download ╒══════════════════════════╛
 https://www.dropbox.com/s/h8pnjrziv1cwfmz/EST_AUTO_TEXT_COLOR_PLUS.js?dl=0   

 ■ How to use       ╒══════════════════════════╛
 1) Fill the plugin parameter... see Parameter section for more detail
 add your entry from plugin manager.

 2) To control Auto Color / Auto Correct... just turn ON/OFF the coresponding switch.

 3) if you want to color your actor name....
 you could add some escape character in parameter... but you must add extra \ escape for
 special character ( \ , [ , ] )
 ex: \n[1]  use  \\n\[1\] instead for coloring actor 1 name.
     \v[1]  use  \\v\[1\] instead for coloring variable 1 value in text.
 example plugin parameter:
 \\n\[1\]; 10
 will auto color actor 1 name to color 10.

 4) if the data entry from plugin manager is not enough (20 built in). you can also add it inside
 the game... using this:
 Plugin Command:
    UPDATE_AC_ENTRY yourtexthere ; coloridhere
       >>> space(s) before and after ; will be deleted. 
        example:
        UPDATE_AC_ENTRY estriole cool     ;    8
            "estriole cool" will be colored to 8

 or Script Call:
    $gameSystem.add_AC_Entry(yourtexthere, coloridhere);
        example:
        $gameSystem.add_AC_Entry("Dragon Ball", 10);
            "Dragon Ball" will colored by 10;

 ■ Dependencies     ╒══════════════════════════╛
 None

 ■ Compatibility    ╒══════════════════════════╛
 I'm new in JS... and MV is new engine... so i cannot say for sure. 
 but it should be compatible with most things. 

 ■ Parameters       ╒══════════════════════════╛
 UseInAllWindows
      >>> default true
      >>> if true will only autocolor all window that can autocolor.
          will override OnlyUseInMessage and WhatWindowUseThis
 OnlyUseInMessage = true / false
      >>> default false
      >>> if true will only autocolor in message window all other 
          will override WhatWindowUseThis
 WhatWindowUseThis
      >>> List of Windows that use Autocolor (MUST be child/descendand of Window_Base
          WHICH USE DrawTextEx instead of DrawText). 
      >>> format: Window_Message, Window_Help, Window_NameBox, ....  (separated by coma)
 ReturnColor = number
      >>> return to this color after replacing the color.
 OtherTextUseReturnColor = true / false
      >>> default false
      >>> if set to true Make ALL Other Text use ReturnColor. meaning all your \c will become obselete
 AutoColorSwitch = switchId     
      >>> default 0
      >>> switch to turn on autocolor
      >>> set to 0 for ALWAYS autocolor
 CorrectCapSwitch = switchId
      >>> default 0
      >>> switch to turn on autocorrect
      >>> set to 0 for ALWAYS autocorrect
 DisableCaseSensitiveSwitch
      >>> default 0
      >>> Switch to deactivate the Case sensitive detection
      >>> (set to 0 to ALWAYS DEACTIVATE Case Sensitive)
 StartAutoColor = true / false
      >>> default true   
      >>> if set to true will auto flip ON the Auto color switch.
          at start of the game
 StartAutoCorrect = true / false
      >>> default true   
      >>> if set to true will auto flip ON the Auto color switch.
          at start of the game
 StartDisableCaseSensitive
      >>> default true
      >>> if set to true will start with DisableCaseSensitive's switch 
      switched ON automatically at start of the game.
 Starting_Entry X = YourText ; ColorId
      >>> example: Doraemon ; 4
      will auto color to 4 and auto correct to the entry...
      so if you use: dOrAeMoN ; 4
      when using auto correct it will become dOrAeMoN
 I provide BUILD IN 30 starting entry... if you don't want to use it...
 left it blank and it won't be added to entry.

 if 20 still not enough... read how to use on the way
 to add new entry inside the game using plugin command call.

 ■ License          ╒══════════════════════════╛
 Free to use in all project (except the one containing pornography)
 as long as i credited (ESTRIOLE). 

 ■ Support          ╒══════════════════════════╛
 While I'm flattered and I'm glad that people have been sharing and 
 asking support for scripts in other RPG Maker communities, I would 
 like to ask that you please avoid posting my scripts outside of where 
 I frequent because it would make finding support and fixing bugs 
 difficult for both of you and me.
   
 If you're ever looking for support, I can be reached at the following:
 [ http://forums.rpgmakerweb.com/ ]
 pm me : estriole

 ■ Author's Notes   ╒══════════════════════════╛
 JS regexp is suck compared to ruby. :D. many regexp not working in JS

*/

var EST = EST || {};
EST.AutoColor = EST.AutoColor || {};

EST.AutoColor.param = $plugins.filter(function(p) { 
	return p.description.contains('<EST_AUTO_TEXT_COLOR_PLUS>'); })[0].parameters;
EST.AutoColor.setting = EST.AutoColor.setting || {};

for (key of Object.keys(EST.AutoColor.param))
{
  if (key == 'UseInAllWindows') EST.AutoColor.UseInAllWindows = EST.AutoColor.param[key];
  if (key == 'OnlyUseInMessage') EST.AutoColor.OnlyUseInMessage = EST.AutoColor.param[key];
  if (key == 'UseYanflyNameBoxFix') EST.AutoColor.UseYanflyNameBoxFix = EST.AutoColor.param[key];
	if (key == 'AutoColorSwitch') EST.AutoColor.ColorSwitch = Number(EST.AutoColor.param[key]);
	if (key == 'ReturnColor') EST.AutoColor.ReturnColor = Number(EST.AutoColor.param[key]);
  if (key == 'OtherTextUseReturnColor') EST.AutoColor.OtherTextColor = EST.AutoColor.param[key];
	if (key == 'CorrectCapSwitch') EST.AutoColor.CorrectCapSwitch = Number(EST.AutoColor.param[key]);
  if (key == 'DisableCaseSensitiveSwitch') EST.AutoColor.DisableCaseSensitiveSwitch = Number(EST.AutoColor.param[key]);
	if (key == 'StartAutoColor') EST.AutoColor.StartAutoColor = EST.AutoColor.param[key];
	if (key == 'StartAutoCorrect') EST.AutoColor.StartAutoCorrect = EST.AutoColor.param[key];
  if (key == 'StartDisableCaseSensitive') EST.AutoColor.StartDisableCaseSensitive = EST.AutoColor.param[key];
	if (key.match(/Starting_Entry/im) && EST.AutoColor.param[key] != "") 
	{
		var entry = EST.AutoColor.param[key].split(/\s+;\s+|;\s+|\s+;|;/);
		EST.AutoColor.setting[entry[0]] = Number(entry[1]);
	}
  if (key == 'WhatWindowUseThis') 
    EST.AutoColor.WhatWindowUseThis = EST.AutoColor.param[key].split(/\s+,\s+|,\s+|\s+,|,/);
}

EST.AutoColor.UseInAllWindows = EST.AutoColor.UseInAllWindows.toUpperCase() == "TRUE" ? true : false;
EST.AutoColor.OnlyUseInMessage = EST.AutoColor.OnlyUseInMessage.toUpperCase() == "TRUE" ? true : false;
EST.AutoColor.UseYanflyNameBoxFix = EST.AutoColor.UseYanflyNameBoxFix.toUpperCase() == "TRUE" ? true : false;
// if switch value error it will set it to 0 (no switch)
if (isNaN(EST.AutoColor.ColorSwitch)) EST.AutoColor.ColorSwitch = 0;
if (isNaN(EST.AutoColor.CorrectCapSwitch)) EST.AutoColor.CorrectCapSwitch = 0;
if (isNaN(EST.AutoColor.DisableCaseSensitiveSwitch)) EST.AutoColor.DisableCaseSensitiveSwitch = 0;

var est_auto_text_color_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  est_auto_text_color_Game_System_initialize.call(this);
  this._AC_setting = JsonEx.makeDeepCopy(EST.AutoColor.setting);
};

Game_System.prototype.AutoColorOk = function() {
    if (EST.AutoColor.ColorSwitch > 0 && EST.AutoColor.ColorSwitch < $dataSystem.switches.length)
        return $gameSwitches.value(EST.AutoColor.ColorSwitch);
    return true;
};
Game_System.prototype.AutoCorrectOk = function() {
    if (EST.AutoColor.CorrectCapSwitch > 0 && EST.AutoColor.CorrectCapSwitch < $dataSystem.switches.length)
        return $gameSwitches.value(EST.AutoColor.CorrectCapSwitch);
    return true;
};
Game_System.prototype.DisableCaseOk = function() {
    if (EST.AutoColor.DisableCaseSensitiveSwitch > 0 && EST.AutoColor.DisableCaseSensitiveSwitch < $dataSystem.switches.length)
        return $gameSwitches.value(EST.AutoColor.DisableCaseSensitiveSwitch);
    return true;
};

var est_auto_text_color_Game_Switches_init = Game_Switches.prototype.initialize; 
Game_Switches.prototype.initialize = function() {
    est_auto_text_color_Game_Switches_init.call(this);
    if (EST.AutoColor.StartAutoColor.toUpperCase() === 'TRUE' && EST.AutoColor.ColorSwitch > 0 && 
    		EST.AutoColor.ColorSwitch < $dataSystem.switches.length) this._data[EST.AutoColor.ColorSwitch] = true;

    if (EST.AutoColor.StartAutoCorrect.toUpperCase() === 'TRUE' && EST.AutoColor.CorrectCapSwitch > 0 && 
    		EST.AutoColor.CorrectCapSwitch < $dataSystem.switches.length) this._data[EST.AutoColor.CorrectCapSwitch] = true;

    if (EST.AutoColor.StartDisableCaseSensitive.toUpperCase() === 'TRUE' && EST.AutoColor.DisableCaseSensitiveSwitch > 0 && 
        EST.AutoColor.DisableCaseSensitiveSwitch < $dataSystem.switches.length) this._data[EST.AutoColor.DisableCaseSensitiveSwitch] = true;
};

var est_auto_text_color_Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(text) {
  if (!EST.AutoColor.UseInAllWindows)
  {
    if (EST.AutoColor.OnlyUseInMessage && this.constructor != Window_Message) 
      return est_auto_text_color_Window_Base_convertEscapeCharacters.call(this,text);

    var windowName = this.constructor.toString().match(/function (\w*)/)[1];
    if (EST.AutoColor.WhatWindowUseThis.indexOf(windowName) < 0)
      return est_auto_text_color_Window_Base_convertEscapeCharacters.call(this,text);
  }
  var xtext = text;
    var word, use, regex, regpat;
    for (key in $gameSystem._AC_setting)
    { 
        regpat = $gameSystem.DisableCaseOk() ? 'img' : 'mg';
        regex = new RegExp("\\b("+String(key)+")\\b",regpat);
        if(key.match(/\\/)) regex = new RegExp("("+String(key)+")",regpat);
        xtext = xtext.replace(regex, function(x){
            use = $gameSystem.AutoCorrectOk() ? key : x;
            if (use.match(/\\/)) use = x;
            if ($gameSystem.AutoColorOk()) return "\\c["+$gameSystem._AC_setting[key]+"]"+use+"\\c["+EST.AutoColor.ReturnColor+"]";
            if (!$gameSystem.AutoColorOk()) return use;
        });
    }
    if(EST.AutoColor.OtherTextColor.toUpperCase() === 'TRUE') xtext = "\\c["+EST.AutoColor.ReturnColor+"]"+xtext+"\\c["+EST.AutoColor.ReturnColor+"]";
    xtext = est_auto_text_color_Window_Base_convertEscapeCharacters.call(this,xtext);
	return xtext;
};

Game_System.prototype.add_AC_Entry = function(name, color) {
    this._AC_setting[name] = color;
};



if(EST.AutoColor.UseYanflyNameBoxFix && typeof Yanfly !== 'undefined' && Yanfly.Message)
{
  Window_Message.prototype.convertEscapeCharacters = function(text) {
    text = this.convertNameBox(text);
    text = Window_Base.prototype.convertEscapeCharacters.call(this, text);
    text = this.convertMessageCharacters(text);
    return text;
  };
  Window_Message.prototype.convertNameBox = function(text) {
    text = text.replace(/\\N\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 1);
    }, this);
    text = text.replace(/\\N1\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 1);
    }, this);
    text = text.replace(/\\N2\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 2);
    }, this);
    text = text.replace(/\\N3\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 3);
    }, this);
    text = text.replace(/\\NC\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 3);
    }, this);
    text = text.replace(/\\N4\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 4);
    }, this);
    text = text.replace(/\\N5\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 5);
    }, this);
    text = text.replace(/\\NR\<(.*?)\>/gi, function() {
        return Yanfly.nameWindow.refresh(arguments[1], 5);
    }, this);
    return text;
 };
};

//alias method to create plugin command
  var est_auto_color_GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    est_auto_color_GameInterpreter_pluginCommand.call(this, command, args);
     if (command.toUpperCase() === 'UPDATE_AC_ENTRY') 
      {
       alert_msg = "wrong plugin command\ncorrect format> ADD_AC_ENTRY ENTRYNAME ; COLORID"
       var setting = args.join(" ").split(/\s+;\s+|;\s+|\s+;|;/);
       $gameSystem.add_AC_Entry(setting[0],Number(setting[1]));
      };
  };