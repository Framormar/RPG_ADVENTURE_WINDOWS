var EST = EST || {};
EST.MiniMap = EST.MiniMap || {};

//versi andi bawah
function MiniTilemap() {
    this.initialize.apply(this, arguments);
}

MiniTilemap.prototype = Object.create(Tilemap.prototype);
MiniTilemap.prototype.constructor = MiniTilemap;


function Sprite_MiniCharacter() {
    this.initialize.apply(this, arguments);
}

Sprite_MiniCharacter.prototype = Object.create(Sprite_Character.prototype);
Sprite_MiniCharacter.prototype.constructor = Sprite_MiniCharacter;


function Spriteset_MiniMap() {
    this.initialize.apply(this, arguments);
}

Spriteset_MiniMap.prototype = Object.create(Spriteset_Map.prototype);
Spriteset_MiniMap.prototype.constructor = Spriteset_MiniMap;

Spriteset_MiniMap.prototype.initialize = function() {
    Spriteset_Map.prototype.initialize.call(this);
};

Scene_Map.prototype.createMiniMapSpriteset = function() {
    this._miniSpriteset = new Spriteset_MiniMap();
    this.addChild(this._miniSpriteset);
};

// modify after create spriteset instead or before createwindowlayer
// or after mapname window. use alias
Scene_Map.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createMapNameWindow();
    this.createWindowLayer();
    this.createAllWindows();
    this.createMiniMapSpriteset();
};

Spriteset_MiniMap.prototype.updateTilemap = function() {
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};

//bisa dibikin jadi alias gak ya. kirim satu parameter.
// kalau ada parameter itu. kirim zoomScale * 0.2;
// trus di akhir x + 300 nya?
Spriteset_MiniMap.prototype.updatePosition = function() {
    var scale = 0.2;
    var screen = $gameScreen;
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = 450 + Math.round(-screen.zoomX() * (scale - 1));
    this.y = 50 + Math.round(-screen.zoomX() * (scale - 1));
    this.x += Math.round(screen.shake());
};

Spriteset_MiniMap.prototype.createTilemap = function() {
    this._tilemap = new MiniTilemap();
    this._tilemap.width *= 2;
    this._tilemap.height *= 2;
    this._tilemap.tileWidth = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    this.loadTileset();
    this._baseSprite.addChild(this._tilemap);
};


//alias here and make black screen opacity to 0. no need to overwrite.
EST.MiniMap.Spriteset_MiniMap_createBaseSprite = Spriteset_MiniMap.prototype.createBaseSprite;
Spriteset_MiniMap.prototype.createBaseSprite = function() {
    EST.MiniMap.Spriteset_MiniMap_createBaseSprite.call(this);
    this._blackScreen.opacity = 0;
};

//remove destination in minimap so it won't flash the tilemap
Spriteset_MiniMap.prototype.createDestination = function() {
};

Spriteset_MiniMap.prototype.updateTilemap = function() {
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._tilemap.origin.x -= this._tilemap.width * 0.2;
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    this._tilemap.origin.y -= this._tilemap.height * 0.2;
};


Spriteset_MiniMap.prototype.createCharacters = function() {
    this._characterSprites = [];
    $gameMap.events().forEach(function(ev) {
        var x = new Sprite_MiniCharacter(ev)
        console.log(x);
        this._characterSprites.push(x);
    }, this);
    $gameMap.vehicles().forEach(function(vehicle) {
        this._characterSprites.push(new Sprite_MiniCharacter(vehicle));
    }, this);
    $gamePlayer.followers().reverseEach(function(follower) {
        this._characterSprites.push(new Sprite_MiniCharacter(follower));
    }, this);
    this._characterSprites.push(new Sprite_MiniCharacter($gamePlayer));
    for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.addChild(this._characterSprites[i]);
    }
};


Sprite_MiniCharacter.prototype.updatePosition = function() {
    // var tw = $gameMap.tileWidth();
    this.x = this._character.screenX() * 2 - 48 - 10;
    this.y = this._character.screenY() * 2 - 48 - 10;
    this.z = this._character.screenZ();
};