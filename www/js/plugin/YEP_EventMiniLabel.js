//=============================================================================
// Yanfly Engine Plugins - Event Mini Label
// YEP_EventMiniLabel.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_EventMiniLabel = true;

var Yanfly = Yanfly || {};
Yanfly.EML = Yanfly.EML || {};

//=============================================================================
 /*:
 * @plugindesc v1.00 Creates miniature-sized labels over events to allow
 * you to insert whatever text you'd like in them.
 * @author Yanfly Engine Plugins
 *
 * @param Default Show
 * @desc Show mini labels by default?
 * NO - false     YES - true
 * @default true
 *
 * @param Minimum Width
 * @desc What is the minimum width in pixels for mini labels?
 * @default 136
 *
 * @param Font Size
 * @desc What is the font size used for text inside a mini label?
 * Default: 28
 * @default 20
 *
 * @param Y Buffer
 * @desc Alter the Y position of the label by this much.
 * @default 36
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin lets you place text above the heads of various events using a
 * miniature label through a comment tag.
 *
 * ============================================================================
 * Comment Tags
 * ============================================================================
 *
 * Comment tags are 'notetags' used within the lines of an event's comments.
 * The reason I'm using the comment tags instead of the notetags is because
 * each page of an event can yield a different potential name.
 *
 * To use this, make a comment within the event you wish to make the mini
 * label for and insert the following:
 *
 *   <Mini Label: text>
 *   This will display the 'text' above the event. You can use text codes for
 *   this comment tag and it will create dynamic messages.
 *
 *   <Mini Label Font Size: x>
 *   This will change the font size used for the mini label to x. If this tag
 *   isn't used, the font size will be the default value in the parameters.
 *
 *   <Mini Label Y Buffer: +x>
 *   <Mini Label Y Buffer: -x>
 *   This will adjust the Y buffer for the mini label by x value. If this tag
 *   isn't used, the Y buffer will be the default value in the parameters.
 *
 *   <Always Show Mini Label>
 *   This will make the mini label to always be shown, even when the plugin
 *   command to hide mini labels is used.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * If you would like to shut off the Event Mini Label mid-game or turn it on,
 * you can use the following plugin commands:
 *
 * Plugin Command:
 *
 *   HideMiniLabel
 *   Hides all Event Mini Label.
 *
 *   ShowMiniLabel
 *   Shows all Event Mini Label.
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_EventMiniLabel');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.EMWDefaultShow = eval(String(Yanfly.Parameters['Default Show']));
Yanfly.Param.EMWMinWidth = Number(Yanfly.Parameters['Minimum Width']);
Yanfly.Param.EMWFontSize = Number(Yanfly.Parameters['Font Size']);
Yanfly.Param.EMWBufferY = Number(Yanfly.Parameters['Y Buffer']);

//=============================================================================
// Game_System
//=============================================================================

Yanfly.EML.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    Yanfly.EML.Game_System_initialize.call(this);
    this.initEventMiniLabel();
};

Game_System.prototype.initEventMiniLabel = function() {
    this._showEventMiniLabel = Yanfly.Param.EMWDefaultShow;
};

Game_System.prototype.isShowEventMiniLabel = function() {
    if (this._showEventMiniLabel === undefined) this.initEventMiniLabel();
    return this._showEventMiniLabel;
};

Game_System.prototype.setEventMiniLabel = function(value) {
    this._showEventMiniLabel = value;
};

//=============================================================================
// Game_Interpreter
//=============================================================================

Yanfly.EML.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Yanfly.EML.Game_Interpreter_pluginCommand.call(this, command, args)
  if (command === 'HideMiniLabel') $gameSystem.setEventMiniLabel(false);
  if (command === 'ShowMiniLabel') $gameSystem.setEventMiniLabel(true);
};

//=============================================================================
// Window_EventMiniLabel
//=============================================================================

function Window_EventMiniLabel() {
    this.initialize.apply(this, arguments);
}

Window_EventMiniLabel.prototype = Object.create(Window_Base.prototype);
Window_EventMiniLabel.prototype.constructor = Window_EventMiniLabel;

Window_EventMiniLabel.prototype.initialize = function() {
    this._bufferY = Yanfly.Param.EMWBufferY;
    this._fontSize = Yanfly.Param.EMWFontSize;
    this._alwaysShow = false;
    var width = Yanfly.Param.EMWMinWidth;
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.contentsOpacity = this.showMiniLabel() ? 255 : 0;
    this.opacity = 0;
    this._character = null;
    this._page = 0;
    this._text = '';
};

Window_EventMiniLabel.prototype.standardFontSize = function() {
    if (this._fontSize !== undefined) return this._fontSize;
    return Yanfly.Param.EMWFontSize;
};

Window_EventMiniLabel.prototype.windowHeight = function() {
    var height = this.fittingHeight(1)
    height = Math.max(height, 36 + this.standardPadding() * 2);
    return height;
};

Window_EventMiniLabel.prototype.lineHeight = function() {
    return this.standardFontSize() + 8;
};

Window_EventMiniLabel.prototype.bufferY = function() {
    if (this._bufferY !== undefined) return this._bufferY;
    return Yanfly.Param.EMWBufferY;
};

Window_EventMiniLabel.prototype.setCharacter = function(character) {
    this.setText('');
    this._character = character;
    if (character._eventId) this.gatherDisplayData();
};

Window_EventMiniLabel.prototype.gatherDisplayData = function() {
    this._page = this._character.page();
    this._bufferY = Yanfly.Param.EMWBufferY;
    this._fontSize = Yanfly.Param.EMWFontSize;
    this._alwaysShow = false;
    if (!this._character.page()) {
        return this.visible = false;
    }
    var list = this._character.list();
    var max = list.length;
    var comment = '';
    for (var i = 0; i < max; ++i) {
      var ev = list[i];
      if ([108, 408].contains(ev.code)) comment += ev.parameters[0] + '\n';
    }
    this.extractNotedata(comment);
};

Window_EventMiniLabel.prototype.extractNotedata = function(comment) {
  if (comment === '') return;
  var tag1 = /<(?:MINI WINDOW|MINI LABEL):[ ](.*)>/i;
  var tag2 = /<(?:MINI WINDOW FONT SIZE|MINI LABEL FONT SIZE):[ ](\d+)>/i;
  var tag3 = /<(?:MINI WINDOW Y BUFFER|MINI LABEL Y BUFFER):[ ]([\+\-]\d+)>/i;
  var tag4 = /<(?:ALWAYS SHOW MINI WINDOW|ALWAYS SHOW MINI LABEL)>/i;
  var notedata = comment.split(/[\r\n]+/);
  var text = '';
  for (var i = 0; i < notedata.length; ++i) {
    var line = notedata[i];
    if (line.match(tag1)) {
      text = String(RegExp.$1);
    } else if (line.match(tag2)) {
      this._fontSize = parseInt(RegExp.$1);
    } else if (line.match(tag3)) {
      this._bufferY = parseInt(RegExp.$1);
    } else if (line.match(tag4)) {
      this._alwaysShow = true;
    }
  }
  this.setText(text);
};

Window_EventMiniLabel.prototype.setText = function(text) {
    if (this._text === text) return;
    this._text = text;
    this.refresh();
};

Window_EventMiniLabel.prototype.refresh = function() {
    this.contents.clear();
    var txWidth = this.textWidthEx(this._text);
    var width = txWidth + this.standardPadding() * 2;
    this.width = Math.max(width, Yanfly.Param.EMWMinWidth);
    this.height = this.windowHeight();
    this.createContents();
    var wx = (this.contents.width - txWidth) / 2;
    var wy = 0;
    this.drawTextEx(this._text, wx, wy);
};

Window_EventMiniLabel.prototype.textWidthEx = function(text) {
    return this.drawTextEx(text, 0, this.contents.height);
};

Window_EventMiniLabel.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (!this._character) return;
    if (!this._character._eventId) return;
    this.updatePage();
    this.updateOpacity();
};

Window_EventMiniLabel.prototype.updatePage = function() {
    if (this._page === this._character.page()) return;
    this.gatherDisplayData();
};

Window_EventMiniLabel.prototype.updateOpacity = function() {
    if (this.showMiniLabel()) {
      this.contentsOpacity += 16;
    } else {
      this.contentsOpacity -= 16;
    }
    var max = this._character.opacity();
    this.contentsOpacity = this.contentsOpacity.clamp(0, max);
};

Window_EventMiniLabel.prototype.showMiniLabel = function() {
    if (this._alwaysShow) return true;
    return $gameSystem.isShowEventMiniLabel();
};

//=============================================================================
// Sprite_Character
//=============================================================================

Yanfly.EML.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    Yanfly.EML.Sprite_Character_update.call(this);
    this.updateMiniLabel();
};

Sprite_Character.prototype.updateMiniLabel = function() {
    this.setupMiniLabel();
    if (!this._miniLabel) return;
    this.positionMiniLabel();
};

Sprite_Character.prototype.setupMiniLabel = function() {
    if (this._miniLabel) return;
    this._miniLabel = new Window_EventMiniLabel();
    this._miniLabel.setCharacter(this._character);
    this.parent.parent.addChild(this._miniLabel);
};

Sprite_Character.prototype.positionMiniLabel = function() {
    var win = this._miniLabel;
    win.x = this.x + win.width / -2;
    win.y = this.y + (this.height * -1) - win.height + win.bufferY();
};

//=============================================================================
// End of File
//=============================================================================
