/*:
@plugindesc This plugin can make us do Battle Royale (player vs enemy vs enemy vs ...)
<EST_BATTLE_ROYALE_EVO>
@author Estriole

@param Bribed Enemy Give Rewards
@desc if this set to true... bribed enemy drop item, give exp and gold, etc. (true/false)
@default true

@param Faction A State Id
@desc State Id to mark it belong to faction A
@default 13

@param Faction B State Id
@desc State Id to mark it belong to faction B
@default 14

@param Faction C State Id
@desc State Id to mark it belong to faction C
@default 15

@param Faction D State Id
@desc State Id to mark it belong to faction D
@default 16

@param Faction E State Id
@desc State Id to mark it belong to faction D
@default 17

@param Bribed Enemy State Id
@desc State Id to mark it belong to party
@default 18

@param Neutral Enemy State Id
@desc State Id to mark it neutral enemy
@default 19

@help
 ■ Information      ╒══════════════════════════╛
 EST - Battle Royale EVO
 Version: 1.4
 By Estriole
 File name: EST_BATTLE_ROYALE_EVO.js

 ■ Introduction     ╒══════════════════════════╛
	This plugin allow us to have battle royale in our game...
 what is battle royale? it's a battle with three or more combatant
 that is fought until only one combatant remain. This plugin also
 can make your actor 'bribe/recruit/persuade' enemy to fight for you
 so you can have 

 [Party + Allied Enemies] vs [Enemies] vs [Enemies] vs [Enemies] vs [Enemies] vs [Enemies]
 
     they will attack each other and party. also... Allied Enemy cannot be controlled.
 it will become auto battler.
 
 ■ Features         ╒══════════════════════════╛
 - Have BATTLE ROYALE. player + allied_enemy vs enemy vs enemy vs enemy vs enemy
 - you can bribe / recruit enemy to fight for you (automatic battle though)
   (also you cannot heal the battler)
 - your skill that attack all enemies will not hit bribed enemy
 - use state so it's simple if you want to make certain enemy change sides.

  ■ Changelog       ╒══════════════════════════╛
 v1.0 2015.10.27           Initial Release
 v1.1 2015.12.13        > Add scriptcall to check how many enemy have certain id in troop?
 						> Add scriptcall to check how many enemy have certain state in troop?
 						> Minor bugfix where normal enemy didn't have bribed enemy as opponent...
 						and still having bribed enemy as friend... 
 						> Add New group called 'Neutral Enemy'. which you don't have to kill
 						to win the battle. it will behave like faction... all neutral enemies
 						will form it's own faction. and will attack both enemy that's not it's
 						own faction and party... but the difference is... you don't have to kill it.
 						if you kill it... you will gain it's loot and exp. but if you don't
 						you won't get exp / loot from that enemy.
 v1.2 2015.12.16        > fix neutral enemy cannot be bribed.
 v1.3 2015.12.26        > fix bug when having reserve party...
 v1.4 2016.01.05        > fix bug created when i add neutral enemy feature which make party can 
 						attack bribed enemy ...


 ■ Plugin Download ╒══════════════════════════╛
 https://www.dropbox.com/s/gronsgs2nidew5b/EST_BATTLE_ROYALE_EVO.js?dl=0
  
 ■ How to use       ╒══════════════════════════╛
 1) Give the enemy the state that mark it's faction in battle
    you could also add state that mark enemy as bribed to make it battle for you.
 2) if you use Tsukihime Enemy Reinforcement...
 and add enemy more than 8 member...
 you might need script call / plugin call to add the state for the rest of the troop.
 plugin call:
 	add_state_to_troop_member troopIndex stateId

 	WARNING!! index start at 0. so first enemy in troop have 0 as index
 		ex:
 		add_state_to_troop_member 2 14
 		  will add state 14 to third enemy in the troop
 script call:
 	this.addStateToTroopMember(troopIndex,StateId);

 	WARNING!! index start at 0. so first enemy in troop have 0 as index
 		ex:
 		add_state_to_troop_member 2 14
 		  will add state 14 to third enemy in the troop

 3) since the faction and bribe is marked by state. 
 you could just create a skill to add / remove that state
 or use battle event to add / remove that state.

 4) ready for epic Battle Royale !!!

 5) to check how many enemy has certain id in troops 
 $gameTroop.checkHowManyEnemyHasId(id);

 example:
  $gameTroop.checkHowManyEnemyHasId(1);
  will return how many enemy id 1 in the troop.

 you can use this scriptcall in conditional branch
 example:
  $gameTroop.checkHowManyEnemyHasId(1) == 3;
 will return true if troop have 3 instance of enemy id 1

 6) to check how many enemy has certain state in troops
 $gameTroop.checkHowManyEnemyHasState(stateId);

 example:
	 $gameTroop.checkHowManyEnemyHasState(17);
	 will return how many enemy in the troop inflicted with state 17
 you can use this scriptcall in conditional branch
 example:
	 $gameTroop.checkHowManyEnemyHasState(17) > 2;
 will return true if troop have more than 2 member that inflicted by state 17
 
 7) now you can add 'neutral' enemy... neutral enemy is like faction enemy.
 it form it's own faction containing all neutral enemy...
 it will attack party or other enemy that's not neutral. but you don't have
 to kill it to win the battle. there's a catch though... if you kill it... 
 you will get exp and loot from that enemy. else... no loot and exp from it.

 8) for ADVANCED coder... you could manually set friend and opponent unit
 to enemy. by creating Game_Troop unit and filling it with enemy / actor.
 then assign it to enemy._manualOpponent and enemy._manualFriend

 example script call:
 var tmp = new Game_Troop();
 tmp._enemies = [];
 tmp._enemies.push($gameActors.actor(1));
 tmp._enemies.push($gameActors.actor(2));
 en = $gameTroop.members()[0];
 en._manualOpponent = tmp;
 en2 = $gameTroop.members()[1];
 en2._manualFriend = tmp;

 will set first member of enemy in troop to have actor 1 and 2 as it's enemy...
 and second member of enemy in troop to have actor 1 and 2 as it's friend...
 
 ■ Dependencies     ╒══════════════════════════╛
 Optional:
 Tsukihime Enemy Reinforcement
 to add more enemies... it won't be royale enough with just 8 enemies

 ■ Compatibility    ╒══════════════════════════╛
 I'm new in JS... and MV is new engine... so i cannot say for sure. 
 but it should be compatible with most things.

 ■ Parameters       ╒══════════════════════════╛
 Faction A State ID
    > state to mark enemy as faction A
 Faction B State ID
    > state to mark enemy as faction B
 Faction C State ID
    > state to mark enemy as faction C
 Faction D State ID
    > state to mark enemy as faction D
 Faction E State ID
    > state to mark enemy as faction E
 Bribed State ID
    > state to mark enemy as our allies
 
 YES... you could have party + allied troop vs 4 vs 3 vs 6 vs 7 vs 2

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
 Let's Battle Royale to Death !!!

*/

var EST = EST || {};
EST.Battle_Royale = EST.Battle_Royale || {};
var _PluginCommands = _PluginCommands || {};

(function($){

$.param = $plugins.filter(function(p) { 
  return p.description.contains('<EST_BATTLE_ROYALE_EVO>'); })[0].parameters;

$.factionState = []
for (key of Object.keys($.param))
{
 if (key.match(/Neutral Enemy State Id/im) && $.param[key] != "")
  $.neutralState = Number($.param[key]);  	
 if (key.match(/Bribed Enemy State Id/im) && $.param[key] != "")
  $.bribedState = Number($.param[key]);  	
 if (key.match(/Faction \w State id/im) && $.param[key] != "")
  $.factionState.push(Number($.param[key]));
 if (key.match(/Bribed Enemy Give Rewards/im) && $.param[key] != "")
  $.bribedGiveReward = $.param[key].toUpperCase() == 'TRUE' ? true : false;  	
}

$.Game_Enemy_opponentsUnit = Game_Enemy.prototype.opponentsUnit
Game_Enemy.prototype.opponentsUnit = function() {
	if (this._manualOpponent) return this._manualOpponent;
	this.checkCustomOpponent();
	if (this._customOpponent) return this._customOpponent;
	return $.Game_Enemy_opponentsUnit.call(this);
};

$.Game_Enemy_friendsUnit = Game_Enemy.prototype.friendsUnit
Game_Enemy.prototype.friendsUnit = function() {
	if(this._manualFriend) return this._manualFriend;
	this.checkCustomFriend();
	if (this._customFriend) return this._customFriend;
    return $.Game_Enemy_friendsUnit.call(this);
};

Game_Enemy.prototype.checkCustomOpponent = function() {
	var tmpOpponent = new Game_Troop();
	tmpOpponent.setupNormalOpponent();	
    if (this.isStateAffected($.neutralState)) tmpOpponent.setupFactionOpponent($.neutralState);
	for(state of $.factionState) if (this.isStateAffected(state)) tmpOpponent.setupFactionOpponent(state);
    if (this.isStateAffected($.bribedState)) tmpOpponent.setupBribedOpponent();     
	this._customOpponent = tmpOpponent;
};

Game_Enemy.prototype.checkCustomFriend = function() {
	var tmpFriend = new Game_Troop();
	tmpFriend.setupNormalFriend();	
    if (this.isStateAffected($.neutralState)) tmpFriend.setupFactionFriend($.neutralState);
	for(state of $.factionState) if (this.isStateAffected(state)) tmpFriend.setupFactionFriend(state);
    if (this.isStateAffected($.bribedState)) tmpFriend.setupBribedFriend();     
	 this._customFriend = tmpFriend;
};

Game_Troop.prototype.setupNormalOpponent = function() {
	this._enemies = [];
	for (actor of $gameParty.members())	this._enemies.push(actor);		
	var tmp = $gameTroop._enemies.filter(function(enemy){
	  return enemy.isStateAffected($.bribedState);
	});
	for (en of tmp)	this._enemies.push(en);				
};
Game_Troop.prototype.setupNormalFriend = function() {
	this._enemies = [];
	var tmp = $gameTroop._enemies.filter(function(enemy){
	  !enemy.isStateAffected($.bribedState);
	});
	for (en of tmp)	this._enemies.push(en);				
};

Game_Troop.prototype.setupBribedOpponent = function() {
	this._enemies = [];
	var tmp = $gameTroop._enemies.filter(function(enemy){
	  return !enemy.isStateAffected($.bribedState)
	});
	for (en of tmp)	this._enemies.push(en);				
};
Game_Troop.prototype.setupBribedFriend = function() {
	this._enemies = [];
	for (actor of $gameParty.members())	this._enemies.push(actor);		
	var tmp = $gameTroop._enemies.filter(function(enemy){
	  return enemy.isStateAffected($.bribedState)
	});
	for (en of tmp)	this._enemies.push(en);
};

Game_Troop.prototype.setupFactionOpponent = function(state) {
	this._enemies = [];
	for (actor of $gameParty.members())	this._enemies.push(actor);		
	var tmp = $gameTroop._enemies.filter(function(enemy){
	  return !enemy.isStateAffected(state) || enemy.isStateAffected($.bribedState);
	});
	for (en of tmp)	this._enemies.push(en);
};
Game_Troop.prototype.setupFactionFriend = function(state) {
	this._enemies = [];
	var tmp = $gameTroop._enemies.filter(function(enemy){
	  return enemy.isStateAffected(state) && !enemy.isStateAffected($.bribedState);
	});
	for (en of tmp)	this._enemies.push(en);				
};

Game_Troop.prototype.checkHowManyEnemyHasId = function(id) {
  var count = 0;
  for (en of this._enemies)
  {
    if(en._enemyId == id) count ++;
  }
  return count;
};

Game_Troop.prototype.checkHowManyEnemyHasState = function(state) {
  var count = 0;
  for (en of this._enemies)
  {
  	if(en.isStateAffected(state)) count++;
  }
  return count;
};

Game_Troop.prototype.resetCustomRoyale = function() {
	for(enemy of this._enemies)
	{
		enemy._customOpponent = null;
		enemy._customFriend = null;
	}
};

// patch for yanfly battle engine. so it will filter out bribed enemy
// on enemy selection
if(typeof(Yanfly) !== 'undefined' && Yanfly.BEC)
{
$.Window_EnemyVisualSelect_refresh = Window_EnemyVisualSelect.prototype.refresh;
Window_EnemyVisualSelect.prototype.refresh = function() {
    this.contents.clear();
    if(this._battler && this._showEnemyName && this._battler.isStateAffected($.bribedState))
    	return;
	$.Window_EnemyVisualSelect_refresh.call(this);
};

$.Game_Battler_isSelected = Game_Battler.prototype.isSelected;
Game_Battler.prototype.isSelected = function() {
    if ($gameParty.inBattle() && BattleManager.isAllSelection()) {
    	if (this.isStateAffected($.bribedState)) return false;
    }
	return $.Game_Battler_isSelected.call(this);
};
}//end checking yanfly BEC loaded or not

// patch for including bribed members to troop reward
$.Game_Troop_deadMembers = Game_Troop.prototype.deadMembers;
Game_Troop.prototype.deadMembers = function() {
	var oldMember = $.Game_Troop_deadMembers.call(this);
	var bribedAliveMember = this.members().filter(function(member) {
        return member.isAlive() && member.isStateAffected($.bribedState);
    });
    if ($gameTemp._makeRewardsFlag) return oldMember.concat(bribedAliveMember);
    return oldMember;
};


$.BattleManager_makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
	if($.bribedGiveReward) $gameTemp._makeRewardsFlag = true;
	$.BattleManager_makeRewards.call(this);
	$gameTemp._makeRewardsFlag = false;
};

// patch so when the remaining alive enemy is bribed/neutral... win the battle.
$.Game_Troop_aliveMembers = Game_Troop.prototype.aliveMembers;
Game_Troop.prototype.aliveMembers = function() {
	var oldMember = $.Game_Troop_aliveMembers.call(this);
	if ($gameTemp._checkWin)
	{
		oldMember = oldMember.filter(function(enemy){
		  return !enemy.isStateAffected($.bribedState) && !enemy.isStateAffected($.neutralState);
		});		
	}else{
		if($gameTemp._battleEnemyWindowRefresh){
			oldMember = oldMember.filter(function(enemy){
			  return !enemy.isStateAffected($.bribedState);
			});		
		}
	}	
	return oldMember;
};

$.Window_BattleEnemy_refresh = Window_BattleEnemy.prototype.refresh;
Window_BattleEnemy.prototype.refresh = function() {
	$gameTemp._battleEnemyWindowRefresh = true;		
	$.Window_BattleEnemy_refresh.call(this);
	$gameTemp._battleEnemyWindowRefresh = false;		
};

$.Game_Troop_isAllDead = Game_Troop.prototype.isAllDead;
Game_Troop.prototype.isAllDead = function() {
	$gameTemp._checkWin = true;	
	var oldVal = $.Game_Troop_isAllDead.call(this);
    $gameTemp._checkWin = false;
    return oldVal;
};

//plugin call for adding state
Game_Interpreter.prototype.addStateToTroopMember = function(args, stateId) {
	if (args.constructor == Array)
	{
		var troopIndex = Number(args[0]);
		stateId = Number(args[1]);
	} else {
		var troopIndex = Number(args);		
		stateId = Number(stateId);
	}
	if(!stateId || !troopIndex || isNaN(stateId) || isNaN(troopIndex) ) return;
	var battler = $gameTroop.members()[troopIndex];	
	if(!battler) return;
	battler.addState(stateId);
};

_PluginCommands["ADD_STATE_TO_TROOP_MEMBER"] = Game_Interpreter.prototype.addStateToTroopMember;

$.game_interpreter_plugincommand =
                      Game_Interpreter.prototype.pluginCommand;

// add my plugin command
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if(_PluginCommands[command.toUpperCase()]) return _PluginCommands[command.toUpperCase()].call(this,args);
    $.game_interpreter_plugincommand.call(this, command, args);
};

})(EST.Battle_Royale);