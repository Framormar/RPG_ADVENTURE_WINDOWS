/*:
@plugindesc This plugin is the MANAGER to swap event with building / decorations based on item.
<EST_FORMAR_REGIONMAPLOADER>
@author Estriole

@param DefaultUpdatingRegionMapTransition
@desc when updating region map. use this transitions.
0 -> black, 1->white, 2->none
@default 0

@help
 ■ Information      ╒══════════════════════════╛
 EST FORMAR - RegionMapLoader
 Version: 1.0
 By Estriole
 File name: EST_FORMAR_RegionMapLoader.js

 ■ Introduction     ╒══════════════════════════╛

 ■ Features         ╒══════════════════════════╛

 ■ Changelog       ╒══════════════════════════╛
   v1.0 2015.11.??           Initial Release

 ■ Plugin Download ╒══════════════════════════╛
 
 ■ How to use       ╒══════════════════════════╛
 
 ■ Dependencies     ╒══════════════════════════╛

 ■ Compatibility    ╒══════════════════════════╛
 I'm new in JS... and MV is new engine... so i cannot say for sure. 
 but it should be compatible with most things. 

 ■ Parameters       ╒══════════════════════════╛

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
 Conversion of Formar Tilemap Swapper
*/
var EST = EST || {};
EST.FormarRegionMapLoader = EST.FormarRegionMapLoader || {};

EST.FormarRegionMapLoader.param = $plugins.filter(function(p) { 
  return p.description.contains('<EST_FORMAR_REGIONMAPLOADER>'); })[0].parameters;

EST.FormarRegionMapLoader.defTrans = EST.FormarRegionMapLoader.param['DefaultUpdatingRegionMapTransition'];
EST.FormarRegionMapLoader.defTrans = Number(EST.FormarRegionMapLoader.defTrans);
if (isNaN(EST.FormarRegionMapLoader.defTrans)) EST.FormarRegionMapLoader.defTrans = 2;
if (EST.FormarRegionMapLoader.defTrans > 2) EST.FormarRegionMapLoader.defTrans = 2;

var est_formar_regionmaploader_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
  est_formar_regionmaploader_Game_System_initialize.call(this);
  this._EstRegionMapData = null;
};

var est_formar_regionmaploader_game_map_setup = Game_Map.prototype.setup
Game_Map.prototype.setup = function(mapId) {
	est_formar_regionmaploader_game_map_setup.call(this,mapId);
  this.refreshRegionMap(); 
};

var est_formar_regionmaploader_game_switches_onchange = Game_Switches.prototype.onChange
Game_Switches.prototype.onChange = function() {
  est_formar_regionmaploader_game_switches_onchange.call(this);
  $gameMap.refreshRegionMap();
};

Game_Map.prototype.refreshRegionMap = function() {
  $gameSystem._EstRegionMapData = null;
};

// actually it Transfer Player to same position without transition 
Game_Interpreter.prototype.updatingRegionMap = function(fade) {
  if(fade == undefined || fade > 2) fade = EST.FormarRegionMapLoader.defTrans;  
  var mapId = this._mapId;
  var x = $gamePlayer.x;
  var y = $gamePlayer.y;
  $gamePlayer.reserveTransfer(mapId, x, y, 0, fade);
};


//overwrite >.<. i don't have much option.
Game_Map.prototype.tileId = function(x, y, z) {
    var width = $dataMap.width;
    var height = $dataMap.height;
    if($gameSystem._EstRegionMapData) 
      return $gameSystem._EstRegionMapData[(z * height + y) * width + x] || 0;
    return $dataMap.data[(z * height + y) * width + x] || 0;
};

Game_Map.prototype.data = function() {
  if ($gameSystem._EstRegionMapData) return $gameSystem._EstRegionMapData;
  this.getRegionMapData();
  this.requestRefresh();
  return $gameSystem._EstRegionMapData;// = data;
};

Game_Map.prototype.getRegionMapData = function() {
  var data = JsonEx.makeDeepCopy($dataMap.data);
  var width = this.width();
  var height = this.height();
   if($dataMap.note.match(/<region_map>([\s\S]*?)<\/region_map>/img)){
    var mapnotes = $dataMap.note.match(/<region_map>([\s\S]*?)<\/region_map>/img)
    mapnotes.forEach(function(mapnote){
        mapnote = mapnote.replace(/<region_map>\s*/i,'');
        mapnote = mapnote.replace(/\s*<\/region_map>/i,'');
        mapnote = mapnote.split('\n');
        mapnote.forEach(function(regiondata){
          regiondata = regiondata.split(/(?:\s+,\s+|,\s+|\s+,|\s+|,)/);
          if($gameSwitches.value(Number(regiondata[2])))
          {
            $gameMap.get_map_data(Number(regiondata[1]), function(tmpdata){
            for (var x = 0; x < width; x++)
            {
                for (var y = 0; y < height; y++)
                {
                 if($gameMap.regionId(x,y) == Number(regiondata[0]))
                  {
                    data[(0 * height + y) * width + x] = JsonEx.makeDeepCopy(tmpdata [(0 * height + y) * width + x]);
                    data[(1 * height + y) * width + x] = JsonEx.makeDeepCopy(tmpdata [(1 * height + y) * width + x]);
                    data[(2 * height + y) * width + x] = JsonEx.makeDeepCopy(tmpdata [(2 * height + y) * width + x]);
                    data[(3 * height + y) * width + x] = JsonEx.makeDeepCopy(tmpdata [(3 * height + y) * width + x]);
                  }//end if this regionId(x,y)
                }//end for var y 
              }//end for var x              
            });//end this.get_map_data
          }// end if switches region data 2 on
        });//end mapnote each
    });//end mapnotes foreach
   } // end if datamap note match
  $gameSystem._EstRegionMapData = data;
};

Game_Map.prototype.get_map_data = function(mapId, callback) {
  var variableName = '$Map%1'.format(mapId.padZero(3));
  var filename = 'data/Map%1.json'.format(mapId.padZero(3));
  var onError = undefined
  var onLoad = function(xhr, filePath, name) {
    if (xhr.status < 400) {
      window[name] = JSON.parse(xhr.responseText);
      DataManager.onLoad(window[name]);

        var variableName = '$Map%1'.format(mapId.padZero(3));
        if (window[variableName] === undefined || window[variableName] === null) return;
         var map = window[variableName].data;
        if (map === undefined) return;
         var mapData = JsonEx.makeDeepCopy(map);
        callback.call(this, mapData);
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
     var map = window[variableName].data;
     if (map === undefined) return;
     var mapData = JsonEx.makeDeepCopy(map);
     callback.call(this, mapData);
   }  
};
