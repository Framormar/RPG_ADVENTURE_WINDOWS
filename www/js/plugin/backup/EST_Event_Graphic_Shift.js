/*:
@plugindesc This plugin can shift event graphic by x pixel.
<EST_GRAPHIC_SHIFT>
@author Estriole
@help
 ■ Information      ╒══════════════════════════╛
 EST - Event Graphic Shift
 Version: 1.2
 By Estriole
 File name: EST_Event_Graphic_Shift.js

 ■ Introduction     ╒══════════════════════════╛
    Have charset that need the graphic to be shifted by x pixel?
 for example a building with the door not exactly in the middle of the
 event graphic. just use this plugin

 ■ Features         ╒══════════════════════════╛
  - shift graphic x
  - shift graphic y
  
 ■ Changelog       ╒══════════════════════════╛
 v1.0 2015.10.29           Initial Release
 v1.1 2015.10.30           improved regexp so we can also use , to separate the x and y
 						   fix bug when erasing event.
 v1.2 2015.11.01     -     fix crash when no event page met condition...
 v1.3 2015.11.12     -     add z to the graphic shift. so you can make event that on top of other event.
                           fix regexp so it recognize <graphic_shift: 1,2,3> (coma without spaces)
 v1.4 2015.11.22     -     ability to flip the graphic. using comment tag: <graphic_flip>

 ■ Plugin Download ╒══════════════════════════╛
 https://www.dropbox.com/s/i1sl7qzpyirmutd/EST_Event_Graphic_Shift.js?dl=0

 ■ How to use       ╒══════════════════════════╛  
 add Comment at the event page you want the graphic to shift
 <graphic_shift: offsetx offsety offset z>
 	example:
 	<graphic_shift: 32 -32, 2>
	 	<graphic_shift: 32, -32> (from v1.1 this work too)
 		<graphic_shift: 32  , -32> (from v1.1 this work too)
 		<graphic_shift: 32  ,-32> (from v1.1 this work too)

 	will shift the graphic x by +32 pixel (go to right 32 pixel) 
 	will shift the graphic y by -32 pixel (go to down 32 pixel)
 	will shift the graphic z by adding 2 z level so it will be on top of event with lower z value
 
 tips by default event z = event priority type * 2 + 1
     > below character = 0 => 0*2+1 = 3
     > same as character = 1 => 1*2+1 = 3
     > above character = 2 => 2*2+1 = 5
	 > [Tile] Event (ignore above 3 setting) = 0 => 0*2+1 = 1
 so if you add 2... the final z level will be added by value from default event z
 if you want to reduce z level. use negative value.

 some z level references:
 shadow = 6
 balloon = 7
 animation = 8
 mouse destination sprite = 9
 source : rpg_sprites.js 

 if you only want to shift x value you could do fine with not entering the offsety value
 or offset z.
 	example:
 	<graphic_shift: 32>

 
 if you want to FLIP the graphic 

 ■ Dependencies     ╒══════════════════════════╛
 None

 ■ Compatibility    ╒══════════════════════════╛
 I'm new in JS... and MV is new engine... so i cannot say for sure. 
 but it should be compatible with most things. 

 ■ Parameters       ╒══════════════════════════╛
 None

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
 [ http://www.rpgmakervxace.net/  ]
 [ http://forums.rpgmakerweb.com/ ]
 pm me : estriole

 ■ Author's Notes   ╒══════════════════════════╛
 This is part of the EST - DECOR AND BUILD SERIES.
*/

var EST = EST || {};
EST.Graphic_Shift = EST.Graphic_Shift || {};

// alias method Sprite_Character updatePosition to shift the event graphic if have comment tag
var est_graphic_shift_Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
Sprite_Character.prototype.updatePosition = function() {
    est_graphic_shift_Sprite_Character_updatePosition.call(this);
    if(this._character instanceof Game_Event){
      if (!this._character.page()) return;
      var shift = this._character.get_event_shift();
      var offsetX = shift && shift[0] ? Number(shift[0]) : 0;
      var offsetY = shift && shift[1] ? Number(shift[1]) : 0;
      var offsetZ = shift && shift[2] ? Number(shift[2]) : 0;
      this.x = this._character.screenX() + offsetX;
      this.y = this._character.screenY() + offsetY;
      this.z = this._character.screenZ() + offsetZ;

      var flipH = this._character.get_event_flipH();
      this._flippedH = this._flippedH || false;
      if (flipH && !this._flippedH) 
      {
        this._flippedH = true;
        this.scale.x = -this.scale.x;
      }
      if (!flipH && this._flippedH)
      {
        this._flippedH = false;
        this.scale.x = -this.scale.x;
      }

      var flipV = this._character.get_event_flipV();
      this._flippedV = this._flippedV || false;
      if (flipV && !this._flippedV) 
      {
        this._flippedV = true;
        this.scale.y = -this.scale.y;
      }
      if (!flipV && this._flippedV)
      {
        this._flippedV = false;
        this.scale.y = -this.scale.y;
      }
      var evRot = this._character.get_event_rot();
      this.rotation = evRot * Math.PI / 180;
	};
};

Game_Event.prototype.get_event_rot = function() {
  var shift = 0;
  var comment = "";
  if(!this.page()) return shift;
  var pagelist = this.page().list;
  for (var cmd of pagelist)
  {
    if(cmd.code == 108)   comment += cmd.parameters[0] + "\n";
    if(cmd.code == 408)   comment += cmd.parameters[0] + "\n";
  }
  if(comment.match(/<graphic_rotation:\s*(.*)>/im)) var shift = comment.match(/<graphic_rotation:\s*(.*)>/im)[1];
  return Number(shift);
};

Game_Event.prototype.get_event_flipH = function() {
  var comment = "";
  if(!this.page()) return false;
  var pagelist = this.page().list;
  for (var cmd of pagelist)
  {
    if(cmd.code == 108)   comment += cmd.parameters[0] + "\n";
    if(cmd.code == 408)   comment += cmd.parameters[0] + "\n";
  }
  if(comment.match(/<graphic_flip_h>/im)) return true;
  return false;
};

Game_Event.prototype.get_event_flipV = function() {
  var comment = "";
  if(!this.page()) return false;
  var pagelist = this.page().list;
  for (var cmd of pagelist)
  {
    if(cmd.code == 108)   comment += cmd.parameters[0] + "\n";
    if(cmd.code == 408)   comment += cmd.parameters[0] + "\n";
  }
  if(comment.match(/<graphic_flip_v>/im)) return true;
  return false;
};

// Game Event new method to grab event shift notetags
Game_Event.prototype.get_event_shift = function() {
	var shift = null;
	var comment = "";
	if(!this.page()) return shift;
	var pagelist = this.page().list;
	for (var cmd of pagelist)
	{
		if(cmd.code == 108) 	comment += cmd.parameters[0] + "\n";
		if(cmd.code == 408) 	comment += cmd.parameters[0] + "\n";
	}
	if(comment.match(/<graphic_shift:\s*(.*)>/im)) var shift = comment.match(/<graphic_shift:\s*(.*)>/im)[1].split(/(?:\s+,\s+|,\s+|\s+,|\s+|,)/);
	return shift;
};