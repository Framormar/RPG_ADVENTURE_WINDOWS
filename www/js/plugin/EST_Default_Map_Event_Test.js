/*:
@plugindesc set default map for event test instead of using blank map which could throw errors
<DEFMAPEVENTTEST>
@author Estriole

@param Default Map
@desc Default Map id for event test
@default 1

@help
just for testing
*/
var EST = EST || {};
EST.DefaultMapEventTest = EST.DefaultMapEventTest || {};

EST.DefaultMapEventTest.param = $plugins.filter(function(p) { 
	return p.description.contains('<DEFMAPEVENTTEST>'); })[0].parameters;
EST.DefaultMapEventTest.defMapId = Number(EST.DefaultMapEventTest.param['Default Map']);

var est_event_test_fix_make_empty_map = DataManager.makeEmptyMap;
DataManager.makeEmptyMap = function() {
	if(this.isEventTest()) return this.loadMapData(EST.DefaultMapEventTest.defMapId);
	est_event_test_fix_make_empty_map.call(this);
};