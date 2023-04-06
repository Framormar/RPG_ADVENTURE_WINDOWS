/*:
 * @plugindesc Makes the HTML5Audio fallback a more viable option for games.
 * @author Zalerinian
 *
 * @help
 * ==============================================================================
 *    Support
 * ==============================================================================
 *
 * Have an issue, question, or suggestion? My preferred method of contact would
 * be on the RMW forums, preferably by posing in one of my topics, but if you
 * really need to reach me directly, feel free to PM me, or send me an email
 * using the address below.
 *
 * Author: Zalerinian
 * email: support at razelon.com
 *
 * ==============================================================================
 *
 * This plugin is, currently, very rushed/makeshift. I didn't really do a lot of
 * testing to make sure it worked perfectly in every situation, but it should be
 * enough to get things working.
 *
 * Please note, this plugin overwrites several functions in the AudioManager
 * class to fix some issues with it working with HTML5Audio. For that reason, I
 * recommend that this plugin be moved to the top, or relatively to the top, of
 * your plugins. This will help ensure that any plugins that aliased the
 * overwritten functions are not broken.
 *
 * If you have any issues using this plugin, please contact me via the methods in
 * the support section above.
 *
 * As of right now, unless there are issues with how the plugin currently is, I
 * am not sure if I plan to continue working on it.
 */
var Imported = Imported || {};

var Zale = Zale || {};
Zale.HTML5Audio = {};

(function() {
  if(Imported.MVCommons) {
    var author = [{
      email: "support@razelon.com",
      name: "Zalerinian",
      website: "http://www.razelon.com"
      }];
    var v = PluginManager.register("HTML5Audio Fallback", "1.0.0", PluginManager.getBasicPlugin("HTML5Audio Fallback").description, author, "2015-12-06");
    if (v === false){
      PluginManager.printPlugin("HTML5Audio Fallback");
      throw new Error("Unable to load HTML5Audio Fallback due to registration failure! Is there another version running?");
    }
  } else {
    Imported["HTML5Audio Fallback"] = "1.0.0";
  }
})();


//-----------------------------------------------------------------------------
/**
 * The static class that handles HTML5 Audio.
 *
 * @class Html5Audio
 * @constructor
 */
function Html5Audio() {
  this.initialize.apply(this, arguments);
}

Html5Audio.prototype.constructor = Html5Audio;
Html5Audio._unlocked = Utils.isNwjs();

/**
 * Sets up the Html5 Audio.
 *
 * @static
 * @method setup
 * @param {String} url The url of the audio file
 */
Html5Audio.prototype.setup = function (url) {
  if (!this._initialized) {
    this.initialize();
  }
  this.clear();
  this._url = url;
};

/**
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @return {Boolean} True if the audio system is available
 */
Html5Audio.prototype.initialize = function (url) {
  if (!this._initialized) {
    this._initialized = false;
    this._audioElement = null;
    this._gainTweenInterval = null;
    this._tweenGain = 0;
    this._tweenTargetGain = 0;
    this._tweenGainStep = 0;
    this._staticSePath = null;
    if (!this._audioElement) {
      try {
        this._audioElement = new Audio();
      } catch (e) {
        console.error(e);
        this._audioElement = null;
      }
    }
    if (!!this._audioElement) {
      this._setupEventHandlers();
      document.getElementsByTagName('body')[0].appendChild(this._audioElement);
    }
    this._initialized = true;
  }
  if(!!url) {
    this.setup(url);
  }
  return !!this._audioElement;
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
Html5Audio.prototype._setupEventHandlers = function () {
  document.addEventListener('touchstart', this._onTouchStart.bind(this));
  document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
  this._audioElement.addEventListener("canplaythrough", this._onLoadedData.bind(this));
  this._audioElement.addEventListener("error", this._onError.bind(this));
  this._audioElement.addEventListener("ended", this._onEnded.bind(this));
};

/**
 * @static
 * @method _onTouchStart
 * @private
 */
Html5Audio.prototype._onTouchStart = function () {
  if (this._audioElement && !Html5Audio._unlocked) {
    if (this._isLoading) {
      this._load(this._url);
      Html5Audio._unlocked = true;
    } else {
      if (this._staticSePath) {
        this._audioElement.src = this._staticSePath;
        this._audioElement.volume = 0;
        this._audioElement.loop = false;
        this._audioElement.play();
        Html5Audio._unlocked = true;
      }
    }
  }
};

/**
 * @static
 * @method _onVisibilityChange
 * @private
 */
Html5Audio.prototype._onVisibilityChange = function () {
  if (document.visibilityState === 'hidden') {
    this._onHide();
  } else {
    this._onShow();
  }
};

/**
 * @static
 * @method _onLoadedData
 * @private
 */
Html5Audio.prototype._onLoadedData = function () {
  this._buffered = true;
  if (Html5Audio._unlocked) this._onLoad();
};

/**
 * @static
 * @method _onError
 * @private
 */
Html5Audio.prototype._onError = function () {
  this.__error = arguments;
  this._hasError = true;
};

/**
 * @static
 * @method _onEnded
 * @private
 */
Html5Audio.prototype._onEnded = function () {
  if (!this._audioElement.loop) {
    this.stop();
      while (this._stopListeners.length > 0) {
      var listener = this._stopListeners.shift();
      listener();
    }
  }
};

/**
 * @static
 * @method _onHide
 * @private
 */
Html5Audio.prototype._onHide = function () {
  this._audioElement.volume = 0;
  this._tweenGain = 0;
};

/**
 * @static
 * @method _onShow
 * @private
 */
Html5Audio.prototype._onShow = function () {
  this.fadeIn(0.5);
};

/**
 * Clears the audio data.
 *
 * @static
 * @method clear
 */
Html5Audio.prototype.clear = function () {
  this.stop();
  this._volume = 1;
  this._loadListeners = [];
  this._stopListeners = [];
  this._hasError = false;
  this._autoPlay = false;
  this._isLoading = false;
  this._buffered = false;
};

/**
 * Set the URL of static se.
 *
 * @static
 * @param {String} url
 */
Html5Audio.prototype.setStaticSe = function (url) {
  if (!this._initialized) {
    this.initialize();
    this.clear();
  }
  this._staticSePath = url;
};

/**
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(Html5Audio.prototype, 'url', {
  get: function () {
    return this._url;
  },
  configurable: true
});

/**
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */
Object.defineProperty(Html5Audio.prototype, 'volume', {
  get: function () {
    return this._volume;
  },
  set: function (value) {
    this._volume = value;
    if (this._audioElement) {
      this._audioElement.volume = this.volume;
    }
  },
  configurable: true
});

/**
 * Checks whether the audio data is ready to play.
 *
 * @static
 * @method isReady
 * @return {Boolean} True if the audio data is ready to play
 */
Html5Audio.prototype.isReady = function () {
  return this._buffered;
};

/**
 * Checks whether a loading error has occurred.
 *
 * @static
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
Html5Audio.prototype.isError = function () {
  return this._hasError;
};

/**
 * Checks whether the audio is playing.
 *
 * @static
 * @method isPlaying
 * @return {Boolean} True if the audio is playing
 */
Html5Audio.prototype.isPlaying = function () {
  return !this._audioElement.paused;
};

/**
 * Plays the audio.
 *
 * @static
 * @method play
 * @param {Boolean} loop Whether the audio data play in a loop
 * @param {Number} offset The start position to play in seconds
 */
Html5Audio.prototype.play = function (loop, offset) {
  if (this.isReady()) {
    offset = offset || 0;
    this._startPlaying(loop, offset);
  } else if (this._audioElement) {
    this._autoPlay = true;
    this.addLoadListener(function () {
      if (this._autoPlay) {
        this.play(loop, offset);
        if (this._gainTweenInterval) {
          clearInterval(this._gainTweenInterval);
          this._gainTweenInterval = null;
        }
      }
    }.bind(this));
    if (!this._isLoading) this._load(this._url);
  }
};

/**
 * Stops the audio.
 *
 * @static
 * @method stop
 */
Html5Audio.prototype.stop = function () {
  if (this._audioElement) this._audioElement.pause();
  this._autoPlay = false;
  if (this._tweenInterval) {
    clearInterval(this._tweenInterval);
    this._tweenInterval = null;
    this._audioElement.volume = 0;
  }
};

Html5Audio.prototype.cleanUp = function() {
  try {
    document.getElementsByTagName('body')[0].removeChild(this._audioElement);
  } catch(e) {
    console.warn("The audio element with the file " + this._url + " appears to have already been removed.");
  }
}

/**
 * Performs the audio fade-in.
 *
 * @static
 * @method fadeIn
 * @param {Number} duration Fade-in time in seconds
 */
Html5Audio.prototype.fadeIn = function (duration) {
  if (this.isReady()) {
    if (this._audioElement) {
      this._tweenTargetGain = this._volume;
      this._tweenGain = 0;
      this._startGainTween(duration);
    }
  } else if (this._autoPlay) {
    this.addLoadListener(function () {
      this.fadeIn(duration);
    }.bind(this));
  }
};

/**
 * Performs the audio fade-out.
 *
 * @static
 * @method fadeOut
 * @param {Number} duration Fade-out time in seconds
 */
Html5Audio.prototype.fadeOut = function (duration) {
  if (this._audioElement) {
    this._tweenTargetGain = 0;
    this._tweenGain = this._volume;
    this._startGainTween(duration);
  }
};

/**
 * Gets the seek position of the audio.
 *
 * @static
 * @method seek
 */
Html5Audio.prototype.seek = function () {
  if (this._audioElement) {
    return this._audioElement.currentTime;
  } else {
    return 0;
  }
};

/**
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @static
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
Html5Audio.prototype.addLoadListener = function (listner) {
  this._loadListeners.push(listner);
};

Html5Audio.prototype.addStopListener = function(listener) {
  this._stopListeners.push(listener);
}

/**
 * @static
 * @method _load
 * @param {String} url
 * @private
 */
Html5Audio.prototype._load = function (url) {
  if (this._audioElement) {
    this._isLoading = true;
    this._audioElement.src = url;
    this._audioElement.load();
  }
};

/**
 * @static
 * @method _startPlaying
 * @param {Boolean} loop
 * @param {Number} offset
 * @private
 */
Html5Audio.prototype._startPlaying = function (loop, offset) {
  this._audioElement.loop = loop;
  if (this._gainTweenInterval) {
    clearInterval(this._gainTweenInterval);
    this._gainTweenInterval = null;
  }
  if (this._audioElement) {
    this._audioElement.volume = this._volume;
    this._audioElement.currentTime = offset;
    this._audioElement.play();
  }
};

/**
 * @static
 * @method _onLoad
 * @private
 */
Html5Audio.prototype._onLoad = function () {
  this._isLoading = false;
  while (this._loadListeners.length > 0) {
    var listener = this._loadListeners.shift();
    listener();
  }
};

/**
 * @static
 * @method _startGainTween
 * @params {Number} duration
 * @private
 */
Html5Audio.prototype._startGainTween = function (duration) {
  this._audioElement.volume = this._tweenGain;
  if (this._gainTweenInterval) {
    clearInterval(this._gainTweenInterval);
    this._gainTweenInterval = null;
  }
  this._tweenGainStep = (this._tweenTargetGain - this._tweenGain) / (60 * duration);
  this._gainTweenInterval = setInterval(function () {
    this._applyTweenValue(this._tweenTargetGain);
  }.bind(this), 1000 / 60);
};

/**
 * @static
 * @method _applyTweenValue
 * @param {Number} volume
 * @private
 */
Html5Audio.prototype._applyTweenValue = function (volume) {
  this._tweenGain += this._tweenGainStep;
  if (this._tweenGain < 0 && this._tweenGainStep < 0) {
    this._tweenGain = 0;
  }
  else if (this._tweenGain > volume && this._tweenGainStep > 0) {
    this._tweenGain = volume;
  }

  if (Math.abs(this._tweenTargetGain - this._tweenGain) < 0.01) {
    this._tweenGain = this._tweenTargetGain;
    clearInterval(this._gainTweenInterval);
    this._gainTweenInterval = null;
  }

  this._audioElement.volume = this._tweenGain;
};



SceneManager.initAudio = function() {
  var noAudio = Utils.isOptionValid('noaudio');
  if (!WebAudio.initialize(noAudio) && !noAudio) {
    console.warn("Warning: The Web Audio API is not supported by your browser. Attempting to fall back to HTML5 audio...");
  }
};

AudioManager.createBuffer = function(folder, name) {
  var ext = this.audioFileExt();
  var url = this._path + folder + '/' + encodeURIComponent(name) + ext;
  if (this.shouldUseHtml5Audio()) {
    return new Html5Audio(url);
  } else {
    return new WebAudio(url);
  }
};

AudioManager.shouldUseHtml5Audio = function() {
  // We use HTML5 Audio to play BGM instead of Web Audio API
  // because decodeAudioData() is very slow on Android Chrome.
  if(!WebAudio._initialized) {
    WebAudio.initialize();
  }
  return (Utils.isAndroidChrome() || !WebAudio._context);
};

AudioManager.playStaticSe = function(se) {
  if (se.name) {
    this.loadStaticSe(se);
    for (var i = 0; i < this._staticBuffers.length; i++) {
      var buffer = this._staticBuffers[i];
      if (buffer._reservedSeName === se.name) {
         buffer.stop();
         this.updateSeParameters(buffer, se);
         buffer.play(false);
         break;
      }
    }
  }
};

AudioManager.loadStaticSe = function(se) {
  if (se.name && !this.isStaticSe(se)) {
    var buffer = this.createBuffer('se', se.name);
    buffer._reservedSeName = se.name;
    this._staticBuffers.push(buffer);
    if (this.shouldUseHtml5Audio()) {
      buffer.setStaticSe(buffer._url);
    }
  }
};

AudioManager.audioFileExt = function() {
  if ((WebAudio.canPlayOgg() || !WebAudio._context) && !Utils.isMobileDevice()) {
    return '.ogg';
  } else if(Utils.isInternetExplorer()) {
    return ".mp3";
  } else {
    return '.m4a';
  }
};

AudioManager.checkWebAudioError = function(webAudio) {
  if (webAudio && webAudio.isError() && !!WebAudio._context) {
    throw new Error('Failed to load: ' + webAudio.url);
  }
};

Zale.HTML5Audio.AM_playse = AudioManager.playSe;
AudioManager.playSe = function(se) {
  if (se.name) {
    this._seBuffers.forEach(function(audio) {
      if(audio && this.shouldUseHtml5Audio() && !audio.isPlaying()) {
        console.log("Cleaning up " + audio._url);
        audio.cleanUp();
      }
    }, this);
  }
  Zale.HTML5Audio.AM_playse.call(this, se);
};

Zale.HTML5Audio.AM_sse = AudioManager.stopSe;
AudioManager.stopSe = function() {
  this._seBuffers.forEach(function(audio) {
    if(this.shouldUseHtml5Audio()) {
      audio.cleanUp();
    }
  }, this)
}

Zale.HTML5Audio.AM_sbgm = AudioManager.stopBgm;
AudioManager.stopBgm = function() {
  if(this.shouldUseHtml5Audio() && this._bgmBuffer) {
    this._bgmBuffer.cleanUp();
  }
  Zale.HTML5Audio.AM_sbgm.call(this);
}

Zale.HTML5Audio.AM_sbgs = AudioManager.stopBgs;
AudioManager.stopBgs = function() {
  if(this.shouldUseHtml5Audio() && this._bgsBuffer) {
    this._bgsBuffer.cleanUp();
  }
  Zale.HTML5Audio.AM_sbgs.call(this);
}

Zale.HTML5Audio.AM_sme = AudioManager.stopMe;
AudioManager.stopMe = function() {
  if(this.shouldUseHtml5Audio() && this._meBuffer) {
    this._meBuffer.cleanUp();
  }
  Zale.HTML5Audio.AM_sme.call(this);
}

Zale.HTML5Audio.SM_oss = SceneManager.onSceneStart;
SceneManager.onSceneStart = function() {
  Zale.HTML5Audio.SM_oss.call(this);
  var tags = document.getElementsByTagName('audio');
  if(!!tags) {
    for(var i = tags.length; i >= 0; i--){
      var audio = tags[i];
      if(audio && AudioManager.shouldUseHtml5Audio() && audio.paused && audio.networkState !== 2) {
        document.getElementsByTagName('body')[0].removeChild(audio);
      }
    }
  }
};

Utils.isInternetExplorer = function() {
  return !!(navigator.userAgent.match(/Trident/i));
}