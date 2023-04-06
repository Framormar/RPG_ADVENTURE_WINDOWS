/*:
@plugindesc This plugin can make event that use actor / party member sprite.
<EST_ACTOR_EVENT>
@author Estriole

@help
 ■ Information      ╒══════════════════════════╛
 EST - Actor Event
 Version: 1.0
 By Estriole
 File name: EST_ACTOR_EVENT.js

 ■ Introduction     ╒══════════════════════════╛
 This plugin can create event that use actor or party member graphic

 ■ Features         ╒══════════════════════════╛
 - create event that use actor graphic
 - create event that use party member graphic

  ■ Changelog       ╒══════════════════════════╛
 v1.0 2015.12.09           Initial Release

 ■ Plugin Download ╒══════════════════════════╛
 https://www.dropbox.com/s/t0xvhqurcroj3rz/EST_ACTOR_EVENT.js?dl=0

 ■ How to use       ╒══════════════════════════╛
 > to use actor graphic as event... add this comment in your event page:

 <actor_event: x>

 change x to your actor id in database

 > to use party member grapic as event... add this comment in your event page:

 <party_event: x>

 change x to party member index. remember index start at 0 !!!
 0 -> first member, 1-> second member, 2-> 3rd member and so on.

 ■ Dependencies     ╒══════════════════════════╛
 none

 ■ Compatibility    ╒══════════════════════════╛
 I'm new in JS... and MV is new engine... so i cannot say for sure. 
 but it should be compatible with most things.

 ■ Parameters       ╒══════════════════════════╛
 None
 
 ■ License          ╒══════════════════════════╛
 Free to use in all project (except the one containing pornography)
 as long as i credited (ESTRIOLE). 

 ■ Extra Credit ╒══════════════════════════╛
 - Victor Sant since he create ACE version of this plugin 

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
 None

*/
var EST = EST || {};
EST.ActorEvent = EST.ActorEvent || {};

(function($){
Game_Event.prototype.getEventActorEvent = function() {
  var shift = null;
  var comment = "";
  if(!this.page()) return shift;
  var pagelist = this.page().list;
  for (var cmd of pagelist)
  {
    if(cmd.code == 108)   comment += cmd.parameters[0] + "\n";
    if(cmd.code == 408)   comment += cmd.parameters[0] + "\n";
  }
  if(comment.match(/<actor_event:\s*(.*)>/im)) var shift = Number(comment.match(/<actor_event:\s*(.*)>/im)[1]);
  return shift;
};

Game_Event.prototype.getEventPartyEvent = function() {
  var shift = null;
  var comment = "";
  if(!this.page()) return shift;
  var pagelist = this.page().list;
  for (var cmd of pagelist)
  {
    if(cmd.code == 108)   comment += cmd.parameters[0] + "\n";
    if(cmd.code == 408)   comment += cmd.parameters[0] + "\n";
  }
  if(comment.match(/<party_event:\s*(.*)>/im)) var shift = Number(comment.match(/<party_event:\s*(.*)>/im)[1]);
  return shift;
};

$.Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function() {
  $.Game_Event_setupPageSettings.call(this);
  this.setupEventActorGraphic();
};

Game_Event.prototype.setupEventActorGraphic = function() {
  var evActorId = this.getEventActorEvent();
  var evPartyId = this.getEventPartyEvent();
  var evActor = null;
  if(evActorId) evActor = $gameActors.actor(evActorId);
  if(evPartyId) evActor = $gameParty.members()[evPartyId];
  if(evActor) this.setImage(evActor._characterName, evActor._characterIndex);
};

$.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
  $gameMap.events().forEach(function(ev){
    ev.setupEventActorGraphic();
  });
  $.Scene_Map_start.call(this);
};

})(EST.ActorEvent);