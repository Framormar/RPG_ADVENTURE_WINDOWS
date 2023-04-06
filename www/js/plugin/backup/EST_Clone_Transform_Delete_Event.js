/*:
@plugindesc This plugin can add new event / transform existing event based on other event. and finally can delete the event.
<EST_CLONE_TRANSFORM_DELETE_EVENT>
@author Estriole
@help
 ■ Information      ╒══════════════════════════╛
 EST - Clone Transform Delete Event 
 Version: 1.2
 By Estriole
 File name: EST_Clone_Transform_Delete_Event.js

 ■ Introduction     ╒══════════════════════════╛
 Want to Add New Event based on template event in current / other map
 or Transform Existing Event in current map Based on template event in current / other Map.
 then maybe you want to delete existing Event in current map? Now it's all
 possible with this Plugin.

 This plugin is second part of my Build and Decor Script conversion from ACE - MV

 ■ Features         ╒══════════════════════════╛
 - Add New Event in current map Based on other event in current/other Map.
 - Transform Existing Event in current map Based on other event in current / other Map.
 - Delete Existing Event in CURRENT Map.

 ■ Changelog       ╒══════════════════════════╛
 v1.0 2015.10.29           Initial Release
 v1.1 2015.11.02           Patch for delete_cur_map from EST_Save_Map_Event plugin
                    to reset selfswitches for event that changed. also method to reinit all map event.
 v1.2 2015.11.09           fixed bugs when having event with higher index than max index of map in editor
                    removed imported and use other method to recognized this script installed or not.
                    some callibration to make it flow with EST BUILD AND DECOR EX plugins.
 v1.3 2015.11.12           fix minor bug which 'sometimes' execute event command after tranforming event.
                    i change it so after event REPLACED using 'transform'. 
                    all event command after that will be stopped.

 ■ Plugin Download ╒══════════════════════════╛
  https://www.dropbox.com/s/euio02n6fyxr2l7/EST_Clone_Transform_Delete_Event.js?dl=0
  
 ■ How to use       ╒══════════════════════════╛
 1) Add New Event
 Plugin Command: 
  add_event source_map_id source_event_id x y
    example:
    add_event 8 2 3 7
    will add new event cloned from Map 8 EventId 2
    and will be placed in x = 3 and y = 7.

 Script Call:
  $gameMap.add_event(source_map_id, source_event_id ,x , y);
    example:
    $gameMap.add_event(8,2,3,7);
    will add new event cloned from Map 8 EventId 2
    and will be placed in x = 3 and y = 7.

 2) Transform Existing Event
 Plugin Command: 
  transform_event target_event_id source_map_id source_event_id
    example:
    transform_event 24 8 1
    will transform event 24 in current map with event
    cloned from Map 8 EventId 1
    x and y will still use old event value.

  transform_this_event source_map_id source_event_id
    example:
    transform_this_event 8 1
    will transform event that called it with event
    cloned from Map 8 EventId 1
    x and y will still use old event value.

 Script Call:
  $gameMap.transform_event(target_event_id, source_map_id, source_event_id);
    example:
    $gameMap.transform_event(24,8,1);
    will transform event 24 in current map with event
    cloned from Map 8 EventId 1
    x and y will still use old event value.

    some tips... if called from script call event command...
    $gameMap.transform_event(this._eventId,8,1);
    will transform event that calling it to event
    cloned from Map 8 EventId 1
    x and y will still use old event value.

 3) Delete Existing Event
 Plugin Command: 
  delete_event target_event_id
    example:
    delete_event 24
    will delete event 24 in current map

  delete_this_event
    will delete event that called it


 Script Call:
  $gameMap.delete_event(target_event_id);
    example:
    $gameMap.delete_event(24);
    will delete event 24 in current map

    some tips... if called from script call event command...
    $gameMap.delete_event(this._eventId);
    will delete event that CALLED it.

 4) FOR OTHER SCRIPTER that want to make compatibility patch for this plugin.
 check EST.Clone_Transform_Delete_Event exist or not.
 ex: if(EST && EST.Clone_Transform_Delete_Event) {
  place your code here.
 }
   
 ■ Dependencies     ╒══════════════════════════╛
 EST_Save_Map_Event.js plugin MUST be INSTALLED for this plugin to work.

 ■ Compatibility    ╒══════════════════════════╛
 I'm new in JS... and MV is new engine... so i cannot say for sure. 
 but it should be compatible with most things. this even compatible with 
 Hudell - Custom Event. so you can use both script without conflicting.

 ■ Parameters       ╒══════════════════════════╛
 this plugin did not have any parameter to set in plugin manager

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

 this plugin is the second step to slowly convert my EST - BUILD AND DECOR 
 series from ACE to MV. the plugin needed to add / transform / delete event
*/

var EST = EST || {};
EST.Clone_Transform_Delete_Event = EST.Clone_Transform_Delete_Event || {};

// warning to requires EST_Save_Map_Event
var est_save_map_event_scene_boot_init = Scene_Boot.prototype.initialize
Scene_Boot.prototype.initialize = function() {
  est_save_map_event_scene_boot_init.call(this);
    if (EST && EST.Save_Map_Event === undefined) {
    alert_msg = "EST_Clone_Event.js plugin requires EST_Save_Map_Event.js plugin INSTALLED !!" ;
    alert_msg += "\nIf you don't install it... bugs can happen";
    window.alert(alert_msg);
    }
};

// Game Map new method to get the next event id
// smart search which will also look for blank event id in between 
// ex: event [1,2,3,4,5] -> it will give 6
// ex: event [1,3,4,5,6] -> it will give 2 (event id missing in between)
Game_Map.prototype.next_ev_id = function() {
    var idlist = [];
    var between_id = [];
    var next_id = 0;
    for (ev of events = this.events()) idlist.push(ev._eventId);
    var max_id = Math.max.apply(null, idlist);
    for (var i = 1; i <= max_id; i++) if (!(idlist.indexOf(i) >= 0)) { between_id.push(i) };
    if (JSON.stringify(between_id) == JSON.stringify([]))    next_id = max_id + 1;
    if (JSON.stringify(between_id) != JSON.stringify([]))    next_id = between_id[0];
    return next_id;
};

// new Game_Map method to grab event data from other map
Game_Map.prototype.get_event_data_from = function(mapId, eventId, callback) {
  var variableName = '$Map%1'.format(mapId.padZero(3));
  var filename = 'data/Map%1.json'.format(mapId.padZero(3));
  var onError = undefined
  var onLoad = function(xhr, filePath, name) {
    if (xhr.status < 400) {
      window[name] = JSON.parse(xhr.responseText);
      DataManager.onLoad(window[name]);

        var variableName = '$Map%1'.format(mapId.padZero(3));
        if (window[variableName] === undefined || window[variableName] === null) return;
         var event = window[variableName].events[eventId];
        if (event === undefined) return;
         var eventData = JsonEx.makeDeepCopy(event);
        callback.call(this, eventData);
    }
  };

  if (window[variableName] === undefined || window[variableName] === null) {
      var xhr = new XMLHttpRequest();
      var name = '$' + filename.replace(/^.*(\\|\/|\:)/, '').replace(/\..*/, '');
      xhr.open('GET', filename);
      xhr.overrideMimeType('application/json');

    if(onLoad === undefined){
      onLoad = function(xhr, filename, name) {
        if (xhr.status < 400) {
          window[name] = JSON.parse(xhr.responseText);
          DataManager.onLoad(window[name]);
        }
      };
    }
    if(onError === undefined) {
      onError = function() {
        DataManager._errorUrl = DataManager._errorUrl || filename;
      };
    }
    xhr.onload = function() {
      onLoad.call(this, xhr, filename, name);
    };
    xhr.onerror = onError;
    window[name] = null;
    xhr.send();

   } else {
    var variableName = '$Map%1'.format(mapId.padZero(3));
     if (window[variableName] === undefined || window[variableName] === null) return;
     var event = window[variableName].events[eventId];
     if (event === undefined) return;
     var eventData = JsonEx.makeDeepCopy(event);
     callback.call(this, eventData);
   }  
};

//alias Game_Event.event to use event data if exist
var est_clone_event_event = Game_Event.prototype.event;
Game_Event.prototype.event = function() {
   if (this._eventData) return this._eventData;
   est_clone_event_event.call();
};

//alias game event init event data to datamap event
var est_clone_event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    this._eventData = this._eventData || $dataMap.events[eventId] || $dataMap.events[1];
    this._isNewEvent = false;
    est_clone_event_initialize.call(this, mapId, eventId);
};

// replace _eventData in the event and reinit event based on new data
Game_Event.prototype.replace_data = function(new_data) {
    this._eventData = new_data;
    this.initialize(this._mapId, this._eventId);
    this._isNewEvent = true;
};

// new method to add event from same map / other map
Game_Map.prototype.add_event = function(mapid, eventid, x, y) {
    var next_id = this.next_ev_id();
    var this_map_id = this._mapId;
    this.get_event_data_from(mapid,eventid,function(eventData){
      eventData.x = x;
      eventData.y = y;
      eventData._eventId = next_id;
      var new_event = new Game_Event(this_map_id, next_id);
      new_event.replace_data(eventData);
      new_event._sourceId = [mapid , eventid];
      new_event._eventId = next_id;
      new_event._isNewEvent = true;
      $gameMap._events[next_id] = new_event;

      if (SceneManager._scene instanceof Scene_Map) {
      var sprite = new Sprite_Character(new_event);
      SceneManager._scene._spriteset._characterSprites.push(sprite);
      SceneManager._scene._spriteset._tilemap.addChild(sprite);
      }
    });
    if (!(EST && EST.Save_Map_Event === undefined)) $gameMap.save_cur_map()
};

// new method to delete event and event sprite
Game_Map.prototype.delete_event = function (eventid){
  if ($gameMap._events[eventid]) var ev = $gameMap._events[eventid];
  if (ev === undefined) return;
  for (sprite of SceneManager._scene._spriteset._tilemap.children)    
  {
    if (sprite._character == ev) SceneManager._scene._spriteset._tilemap.removeChild(sprite);
  }
  $gameMap._events[eventid] = null;
  $gameSelfSwitches.setValue([this._mapId, eventid, 'A'], false);
  $gameSelfSwitches.setValue([this._mapId, eventid, 'B'], false);
  $gameSelfSwitches.setValue([this._mapId, eventid, 'C'], false);
  $gameSelfSwitches.setValue([this._mapId, eventid, 'D'], false);
  if (!(EST && EST.Save_Map_Event === undefined)) $gameMap.save_cur_map()
};

// new method to transform CURRENT map event to other / same map event.
Game_Map.prototype.transform_event = function (eventid, src_map, src_evid){
  if ($gameMap._events[eventid]) var target_event = $gameMap._events[eventid];
  if (target_event === undefined) return;
  var this_map_id = this._mapId;
  var event_replaced = false;
  this.get_event_data_from(src_map, src_evid, function(eventData){
    eventData.x = target_event.x;
    eventData.y = target_event.y;
    eventData.id = eventid;
    target_event.replace_data(eventData);
    $gameSelfSwitches.setValue([this_map_id, eventid, 'A'], false);
    $gameSelfSwitches.setValue([this_map_id, eventid, 'B'], false);
    $gameSelfSwitches.setValue([this_map_id, eventid, 'C'], false);
    $gameSelfSwitches.setValue([this_map_id, eventid, 'D'], false);
    event_replaced = true;
  });
  if (event_replaced) this._interpreter.clear();
  if (!(EST && EST.Save_Map_Event === undefined)) $gameMap.save_cur_map();
};

// method to delete saved map from the memory
var est_clone_event_Game_Map_delete_cur_map = Game_Map.prototype.delete_cur_map;
Game_Map.prototype.delete_cur_map = function (){
  if($gameSystem._est_resaved_map[this._mapId]){
    for (ev of $gameSystem._est_resaved_map[this._mapId]) {
     if (ev && ev._isNewEvent){
      $gameSelfSwitches.setValue([this._mapId, ev._eventId, 'A'], false);
      $gameSelfSwitches.setValue([this._mapId, ev._eventId, 'B'], false);
      $gameSelfSwitches.setValue([this._mapId, ev._eventId, 'C'], false);
      $gameSelfSwitches.setValue([this._mapId, ev._eventId, 'D'], false);      
      $gameMap.delete_event(ev._eventId);
     }
    }
  }
  est_clone_event_Game_Map_delete_cur_map.call(this);
};

//alias method to create plugin command
  var est_clone_event_GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    est_clone_event_GameInterpreter_pluginCommand.call(this, command, args);
     if (command.toUpperCase() === 'ADD_EVENT') 
      {
       alert_msg = "wrong plugin command\ncorrect format> add_event source_map_id source_event_id x y"
       if (args.length != 4) return window.alert(alert_msg);
       source_map_id = Number(args[0]);
       source_event_id = Number(args[1]);
       x = Number(args[2]);
       y = Number(args[3]);
       $gameMap.add_event(source_map_id,source_event_id,x,y);
      };
     if (command.toUpperCase() === 'TRANSFORM_EVENT')
      {
       alert_msg = "wrong plugin command\ncorrect format> transform_event target_event_id source_map_id source_event_id"
       if (args.length != 3) return window.alert(alert_msg);
       target_event_id = Number(args[0]);
       source_map_id = Number(args[1]);
       source_event_id = Number(args[2]);
       $gameMap.transform_event(target_event_id, source_map_id, source_event_id);
      };
     if (command.toUpperCase() === 'TRANSFORM_THIS_EVENT')
      {
       alert_msg = "wrong plugin command\ncorrect format> transform_this_event source_map_id source_event_id"
       if (args.length != 2) return window.alert(alert_msg);
       target_event_id = this._eventId;
       source_map_id = Number(args[0]);
       source_event_id = Number(args[1]);
       $gameMap.transform_event(target_event_id, source_map_id, source_event_id);
      };
     if (command.toUpperCase() === 'DELETE_EVENT')
      {
       alert_msg = "wrong plugin command\ncorrect format> delete_event target_event_id"
       if (args.length != 1) return window.alert(alert_msg);
       target_event_id = Number(args[0]);
       $gameMap.delete_event(target_event_id);
      };
     if (command.toUpperCase() === 'DELETE_THIS_EVENT')
      {
       target_event_id = this._eventId;
       $gameMap.delete_event(target_event_id);
      };
  };