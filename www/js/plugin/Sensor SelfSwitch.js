//=========================================================
// Sensor SelfSwitch
// Sensor SelfSwitch.js
// Version: 1.00
//=========================================================

var Imported = Imported || {};
Imported.LSensor = true;

var Lyson = Lyson || {};
Lyson.Sensor = Lyson.Sensor || {};

/*:
* @author Lyson
* @plugindesc Allows events to flip a self switch when a
* player is in range.
*
* @param Self Switch
* @desc The self switch to flip when the player is in range.
* A, B, C, or D
* @default D
*
* @help
* =============================================================================
* What does it do?
* =============================================================================
*
* This plugin activates a self switch when a player is in a certain proximity
* of an event. It uses a notetag in the note of the event to set the proximity.
*
* =============================================================================
* Usage
* =============================================================================
*
* In the plugin parameters, set the self switch to be triggered on the event
* when a player enters the range. Options are A, B, C, and D. Default is D.
* 
*-----------------------------------------------------------------------------
* Notetag
*-----------------------------------------------------------------------------
* 
* This notetag goes in the note box for the event.
*
*    <Sensor: x>
*
* Where x is the number of tiles away that the selfswitch will be triggered.
*
*-----------------------------------------------------------------------------
* =============================================================================
*/

Lyson.Parameters = PluginManager.parameters('Sensor SelfSwitch');
Lyson.Param = Lyson.Param || {};

Lyson.Param.SelfSwitch = String(Lyson.Parameters['Self Switch']);


Lyson.Sensor.Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function () {
    Lyson.Sensor.Game_Event_setupPage.call(this);
    this.setupRange();
};

Game_Event.prototype.setupRange = function () {
    this._sensorRange = 0;
};

Lyson.Sensor.Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function () {
    Lyson.Sensor.Game_Event_update.call(this);
    this.updateSensor();
};

Lyson.Sensor.processEventNotetags = function (evObj) {
    if (!$dataMap) {
        console.log("No map!")
        return;
    }
    
    var event = evObj.event();

    if (event.note) {
        var note1 = /<(?:SENSOR):[ ](\d+)>/i;
        var notedata = event.note.split(/(?:>)[ ]/);
        for (var i = 0; i < notedata.length; i++) {
            var tag = notedata[i];
            if (tag.match(note1)) {
                evObj._sensorRange = parseInt(RegExp.$1)
            }
        }
    }
};

Game_Event.prototype.updateSensor = function () {
    if (this._erased) return;
    Lyson.Sensor.processEventNotetags(this);
    if (!this._sensorRange) { this._sensorRange = 0 };
    if (this._sensorRange <= 0) return;
    var inRange = Math.abs(this.deltaXFrom($gamePlayer.x));
    inRange += Math.abs(this.deltaYFrom($gamePlayer.y));
    if (inRange <= this._sensorRange) {
        $gameSelfSwitches.setValue([this._mapId, this._eventId, Lyson.Param.SelfSwitch], true)
    } else {
        $gameSelfSwitches.setValue([this._mapId, this._eventId, Lyson.Param.SelfSwitch], false)
    };
};