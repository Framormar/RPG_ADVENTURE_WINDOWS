Scene_Map.prototype.createMiniMapSpriteset = function() {
    this._miniSpriteset = new Spriteset_MiniMap();
    this.addChild(this._miniSpriteset);
};

// modify after create spriteset instead or before createwindowlayer
// or after mapname window.
Scene_Map.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createMiniMapSpriteset();
    this.createMapNameWindow();
    this.createWindowLayer();
    this.createAllWindows();
};

function Spriteset_MiniMap() {
    this.initialize.apply(this, arguments);
}

Spriteset_MiniMap.prototype = Object.create(Spriteset_Map.prototype);
Spriteset_MiniMap.prototype.constructor = Spriteset_MiniMap;

Spriteset_MiniMap.prototype.initialize = function() {
    Spriteset_Map.prototype.initialize.call(this);
    this.width = this.width *2;
    this.height = this.height *2;
    console.log(this.width);
    console.log(this.height);
};

Spriteset_MiniMap.prototype.updatePosition = function() {
    var screen = $gameScreen;
    var scale = 0.2; //screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = (SceneManager._screenWidth - 400) + Math.round(-screen.zoomX() * (scale - 1));
    this.y = 50 + Math.round(-screen.zoomY() * (scale - 1));
    this.x += Math.round(screen.shake());
    // console.log(this);
};

Spriteset_MiniMap.prototype.createTilemap = function() {
    this._tilemap = new MiniTilemap();
    this._tilemap.tileWidth = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.tileWidth = $gameMap.tileWidth();
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    this.loadTileset();
    this._baseSprite.addChild(this._tilemap);
};


//alias here and make black screen opacity to 0. no need to overwrite.
Spriteset_MiniMap.prototype.createBaseSprite = function() {
    this._baseSprite = new Sprite();
    this._baseSprite.setFrame(0, 0, 2*this.width, 2*this.height);
    this._blackScreen = new ScreenSprite();
    this._blackScreen.opacity = 0;
    this.addChild(this._baseSprite);
    this._baseSprite.addChild(this._blackScreen);
};

function MiniTilemap() {
    this.initialize.apply(this, arguments);
}

MiniTilemap.prototype = Object.create(Tilemap.prototype);
MiniTilemap.prototype.constructor =MiniTilemap;

MiniTilemap.prototype.initialize = function() {
    PIXI.DisplayObjectContainer.call(this);

    this._margin = 20;
    this._width = 2*Graphics.width + this._margin * 2;
    this._height = 2*Graphics.height + this._margin * 2;
    this._tileWidth = 48;
    this._tileHeight = 48;
    this._mapWidth = 0;
    this._mapHeight = 0;
    this._mapData = null;
    this._layerWidth = 0;
    this._layerHeight = 0;
    this._lastTiles = [];

    /**
     * The bitmaps used as a tileset.
     *
     * @property bitmaps
     * @type Array
     */
    this.bitmaps = [];

    /**
     * The origin point of the tilemap for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();
    this.origin.x = this.origin.x *2;
    this.origin.y = this.origin.y *2;

    /**
     * The tileset flags.
     *
     * @property flags
     * @type Array
     */
    this.flags = [];

    /**
     * The animation count for autotiles.
     *
     * @property animationCount
     * @type Number
     */
    this.animationCount = 0;

    /**
     * Whether the tilemap loops horizontal.
     *
     * @property horizontalWrap
     * @type Boolean
     */
    this.horizontalWrap = false;

    /**
     * Whether the tilemap loops vertical.
     *
     * @property verticalWrap
     * @type Boolean
     */
    this.verticalWrap = false;

    this._createLayers();
    this.refresh();
};