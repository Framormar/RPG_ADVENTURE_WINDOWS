var Imported = Imported || {};
var Zale = Zale || {};
Zale.FileList = {};

/*:
 * @plugindesc Creates and maintains a list of all filenames in the game project. This is a scripting utility. <pluginID ZE - File List>
 * @author Zalerinian
 * @version 1.0.0
 * @date November 30th, 2015
 *
 * @param List File
 * @desc The filename for the list. Default: data/Filemap.json
 * @default data/Filemap.json
 *
 * @help
 * ==============================================================================
 *    Support
 * ==============================================================================
 *
 * Have an issue, question, or suggestion? My preferred method of contact would
 * be on the RMW forums, preferrably by posint in one of my topics, but if you
 * really need to reach me directly, feel free to PM me, or send me an email
 * using the address below.
 *
 * Author: Zalerinian
 * email: support at razelon.com
 *
 * ==============================================================================
 *    Help
 * ==============================================================================
 *
 * This plugin maintains a list of files present in a project so that other
 * plugins can easily identify all the files available to them. This plugin
 * provides functions to search the list with regular expressions. The file list
 * can be directly accessed via FileList._list
 *
 * There are 3 functions available to filter the results found in the file list.
 *
 * To just look at file names, use FileList.scan(regex).
 *
 * To just look at file paths, use FileList.scanPath(regex).
 *
 * To look at both the file path and file name, use FileList.scanWithPath(regex).
 */

(function(){
  if(Imported["MVCommons"]) {
    var author = [{
      email: "support@razelon.com",
      name: "Zalerinian",
      website: "http://www.razelon.com"
    }];
    PluginManager.register("ZE - File List", "1.0.0", PluginManager.getBasicPlugin("ZE - File List").description, author, "2015-11-30");
  } else if(!Imported["zAPI - File Tools"]) {
    throw new Error("ZE - File List requires zAPI - File Tools");
  } else {
    Imported["ZE - File List"] = "1.0.0";
  }
})();

function FileList() {
  throw new Error("FileList is a static class!");
}

(function($){
  "use strict";
  $._list      = null;
  $._updating  = false;
  $._pending   = 0;

  var params = $plugins.filter(function(plugin) { return plugin.description.contains('<pluginID ZE - File List>'); });
  if(params.length === 0) {
    console.warn("Couldn't find parameters for ZE - File List. Defaults will be used.");
  } else {
    params = params[0].parameters;
  }
  Zale.FileList.PARAMS   = params || {};
  Zale.FileList.FILENAME = params["List File"] || "data/Filemap.json";

  /*
   * FileList.updateList()
   * @note
   * Updates the file list if the game was run in local mode. If the
   * game is not in local mode, it will request the file at the path
   * speciied in the parameters.
   */
  $.updateList = function() {
    if(StorageManager.isLocalMode()) {
      this._list     = [];
      this._updating = true;
      StorageManager.readDir("", function(e, list){
        for(var i = list.length - 1; i >= 0; i--){
          this.processItem(list[i], "");
        }
      }.bind(this));
    } else {
      this.loadList();
    }
  }

  /*
   * FileList.processItem(item, dir)
   * @param {String} item The filename to check now.
   * @param {String} dir The directory the current item is in.
   * @note
   * This function will check if the current item is a directory. If
   * it is, it will add the current item to the dir variable, and
   * recursively call the processItem function with the new dir
   * to check all the items in that folder.
   *
   * The pending count is updated per item to keep track of how many
   * items are left to process, so that we know when we can call the
   * save function. It's really not the most reliable method to keep
   * track of items, as there will be several instances where the
   * count will be 0. However, it's difficult to measure when an
   * asynchronous recursive function is completed running.
   */
  $.processItem = function(item, dir) {
    if(StorageManager.isLocalMode()) {
      ++this._pending;
      StorageManager.isDirectory(dir + item, function(e, isdir) {
        if(isdir) {
          --this._pending
          dir += item + "/";
          StorageManager.readDir(dir, function(e, list){
            if(e) {
              throw e;
            }
            for(var i = list.length - 1; i >= 0; i--){
              this.processItem(list[i], dir);
            }
          }.bind(this));
        } else {
          --this._pending;
          this._list.push(dir + item);
        }
        if(this._pending === 0) {
          this._updating = false;
          this.saveList();
        }
      }.bind(this));
    }
  }

  /*
   * FileList.saveList()
   * @note
   * Saves the _list variable via the File Tools API, ignoring EEXIST
   * errors from the mkdir function.
   */
  $.saveList = function() {
    StorageManager.saveCompressedFile(Zale.FileList.FILENAME, JSON.stringify(this._list), function(e){
      if(e) {
        throw e;
      }
    }, ["EEXIST"]);
  }

  /*
   * FileList.loadList()
   * @note
   * Loads the list from the web server, or from the mobile device,
   * in order to get the list when not in local mode. This will work
   * in local mode, but the upadteList function is recommended for
   * local mode, as it will rebuild a new list, which will be the
   * most up to date at that time.
   */
  $.loadList = function() {
    StorageManager.loadCompressedFile(Zale.FileList.FILENAME, 'utf8', function(e, data) {
      if(e) {
        throw e;
      }
      this._list = JSON.parse(data);
    }.bind(this));
  }

  /*
   * FileList.scan(regex)
   * @param {RegExp} regex A regular expression to compare against filenames.
   * @note
   * Will return a list of files where the regex matches the filename
   * only. This will not check the directory path.
   * @return {Array} A list of files that match the regex.
   */
  $.scan = function(regex) {
    if(!this._list) {
      return [];
    }
    return this._list.filter(function(v) {
      return v.replace(/.*[\/\\]/, '').match(regex) !== null;
    });
  }

  /*
   * FileList.scanPath(regex)
   * @param {RegExp} regex The regular expression to compare against the folders of each item.
   * @note
   * This wil loop through each item, comparing the given regex
   * against the relative folder path to each file. This allows
   * us to get all files in a specific folder, rather than those
   * with a specific filename.
   * @return {Array} A list of files where the path matched the regex.
   */
  $.scanPath = function(regex) {
    if(!this._list) {
      return [];
    }
    return this._list.filter(function(v) {
      return v.replace(/\/[^\/]+?$/, '').match(regex) !== null;
    });
  }

  /*
   * FileList.scanWithPath(regex)
   * @param {RegExp} regex The regular expression to compare against the full relative path to each item.
   * @note
   * This function will compare the regex against each file,
   * including both the filename and folder path. This is
   * useful for finding specific files in specific folders
   * @return {Array} A list of files where the full relative path matched the regex.
   */
  $.scanWithPath = function(regex) {
    if(!this._list) {
      return [];
    }
    return this._list.filter(function(v) {
      return v.match(regex) !== null;
    })
  }

  $.regexEscape = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
})(FileList);

(function($) {
  var SM_readdirSync = $.readDirSync;
  $.readDirSync = function(dirPath) {
    SM_readdirSync.call(this, dirPath);
    if(!this.isLocalMode()) {
      var ary = FileList.scanPath(new RegExp(dirPath));
      return ary.filter(function(v) {
        return v.replace(/.*[\/\\]/)
      });
    }
  }

  var SM_readdir = $.readDir;
  $.readDir = function(dirPath, callback) {
    SM_readdir.call(this, dirPath, callback);
    if(!this.isLocalMode()){
      setTimeout(function() {
        var ary = FileList.scanPath(new RegExp(dirPath));
        callback.call(this, null, ary.filter(function(v) {
          return v.replace(/.*[\/\\]/);
        }));
      }, 0);
    }
  }
})(StorageManager);

// Update the list at startup. The list is updated asynchronously, so this does not slow down the startup time.
FileList.updateList();