/*:
 * @plugindesc A wrapper plugin to provide other plugins with easy access to the Filesystem.
 * @author Zalerinian
 * @version 1.0.0
 * @date November 30th, 2015
 *
 * @help
 * ==============================================================================
 *    Support
 * ==============================================================================
 *
 * Have an issue, question, or suggestion? My preferred method of contact would
 * be on the RMW forums, preferably by posting in one of my topics, but if you
 * really need to reach me directly, feel free to PM me, or send me an email
 * using the address below.
 *
 * Author: Zalerinian
 * email: support at razelon.com
 *
 * ==============================================================================
 *    Overview
 * ==============================================================================
 *
 * This plugin is intended as a plugin API to allow plugins to have better access
 * to files. This allows us to check for file/directory existence, as well as
 * save and load files.
 *
 * Many functions work on both local and web/mobile modes, however the save,
 * delete, and create directory functions are not supported for web/mobile by
 * default. The load function will work on web/mobile by sending a request to
 * download the file, NOT by accessing localStorage.
 *
 * Additionally, all functions, aside from the content path functions, have both
 * Synchronous and Asynchronous versions, allowing developers to make their
 * plugins how they want. For performance reasons, asynchronous calls are
 * preferred. To use the synchronous version simply add 'Sync' to the end of a
 * function's name, and omit the callback parameter.
 *
 * Please note: the function parameters in the descriptions below are based on
 * the asynchronous versions of the functions, and thus have a 'callback'
 * parameter. You can ignore this parameter on the synchronous version.
 *
 * Function names in [square braces] are aliases to the function they are with,
 * and may be used to call that function.
 *
 *
 * ==============================================================================
 *    Content Paths
 * ==============================================================================
 *
 * localContentPath()
 * ------------------------------------------------------------------------------
 * This will return the directory that the game is run from. It uses the same
 * method to get the project's path as the default engine.
 *
 * localTempPath()
 * ------------------------------------------------------------------------------
 * This function will return the string "temp/" by default, indicating that the
 * game's temporary content folder is 'temp'. This function can be changed by
 * other plugins to change the temp folder always, or based on specific
 * conditions.
 *
 *
 * ==============================================================================
 *    Existence Functions
 * ==============================================================================
 *
 * [isfile] fileExists(filePath, callback)
 * ------------------------------------------------------------------------------
 * This function will check if the given path exists, and is a file. In web mode,
 * this function uses HTTP HEAD requests to get the file headers for the given
 * path. As this does not specify whether or not the path is a file or directory,
 * it is up to the caller to know or guess as to what it is.
 *
 * [isDirectory] directoryExists(dirPath, callback)
 * ------------------------------------------------------------------------------
 * This function, similar to fileExists, will check if the given path exists and
 * is a directory (folder). In web mode, this is no different than fileExists,
 * because we cannot tell if what we're requesting is a file or folder.
 *
 * [isEmpty] directoryIsEmpty(dirPath, callback)
 * ------------------------------------------------------------------------------
 * This function will check if the given path is an empty directory or not. This
 * will not ensure that the directory exists, meaning that the Synchronous
 * version will throw an error, while the Asynchronous version will pass the
 * error object to the callback.
 *
 *
 * ==============================================================================
 *    Manipulation Functions
 * ==============================================================================
 *
 * saveCompressedFile(filePath, str, callback, suppress)
 * ------------------------------------------------------------------------------
 * This function will save the given data to the given filepath. If the game is
 * not in local move, the async version of the function will send an error to the
 * callback saying "The game is not in local mode.", as we cannot save files
 * without a server backend with unique accounts and folders.
 *
 * Please note that this function only uses LZString's compressToBase64 function.
 * It will not use JsonEx to create a serialized string of an object, and expects
 * the inputted data to already be a string.
 *
 * loadCompressedFile(filePath, encoding, callback, suppress)
 * ------------------------------------------------------------------------------
 * This function will load and decompress the requested file. Please note that
 * the function expects that the files were compressed using LZString's
 * compressToBase64, as this uses decompressFromBase64 to decompress it.
 *
 * This function does have a web mode fallback. Since the files should already be
 * compressed into the game, this function will use a GET request to get the file
 * from the web server, or mobile device, and then use LZString's function to
 * decode the data.
 *
 * [rmdir] removeDirectory(dirPath, callback)
 * ------------------------------------------------------------------------------
 * This function will recursively remove a directory. This means that the
 * directory requested, and any files/directories in it will be gone, with no way
 * to get the data back without specialized data recovery software.
 *
 * [del] removeFile(filePath, callback)
 * ------------------------------------------------------------------------------
 * This function will remove the given file. This will not work on directories.
 * To remove a directory, please use the removeDirectory function instead. This
 * will permanently remove the files from the user's hard drive, not by putting
 * them in the recycling bin. The only way to undo this is to use specialized
 * recovery software, so be sure you really want to delete a file before you do!
 *
 * mkdir(dirPath, mode, callback)
 * ------------------------------------------------------------------------------
 * This function will create the requested directory, if possible. An optional
 * mode parameter allows you to change the directory's permissions on unix-based
 * machines, such as Macs or Linux devices. This has no affect on windows, and
 * defaults to 777 (full permissions for anyone).
 *
 * readDir(dirPath, callback)
 * ------------------------------------------------------------------------------
 * This function will check the given directory and list all the files available
 * in that directory. It will not automatically check sub-folders. This has no
 * web fallback, as there is no reliable way to list the contents of a folder
 * on a remote web server.
 */

(function(){
  var Imported = Imported || {};
  if(Imported.MVCommons) {
    var author = [{
      email: "support@razelon.com",
      name: "Zalerinian",
      website: "http://www.razelon.com"
    }];
    PluginManager.register("zAPI - File Tools", "1.0.0", PluginManager.getBasicPlugin("zAPI - File Tools").description, author, "2015-11-30");
  } else {
    Imported["zAPI - File Tools"] = "1.0.0";
  }
})();

(function($) {
  "use strict";
 /*
  * $._clearingTemp
  * A flag indicating if the temp folder is still being cleared.
  *
  * $.fs
  * Create a class-wide instance of the File System. It's more efficient than
  * creating it each time we make a call to read or write files.
  */
  $._clearingTemp = false;
  if($.isLocalMode()) {
    $.fs = require('fs');
    $._clearingTemp = true;
  }

  /*
   * StorageManager.localContentPath()
   * @note
   * Returns the folder on the computer that the game is running
   * from. While this works on any platform, it only really
   * matters on the desktop clients, as that's where we have access
   * to the filesystem.
   * @return {String} The base filepath for the game.
   */
  $.localContentPath = function() {
    var path = window.location.pathname.replace(/\/[^\/]*$/, '');
    if (path.match(/^\/([A-Z]\:)/)) {
      path = path.slice(1);
    }
    if(path.lastIndexOf("/") !== path.length - 1) {
      path += "/";
    }
    return decodeURIComponent(path);
  }

  /*
   * StorageManager.localTempPath()
   * @note
   * Unlike localContentPath, this function does not return the whole
   * path to the temporary folder, just the "temp/" part. The
   * reason for this is that almost every function interally calls
   * localContentPath, so using this to prepend the temp path to a
   * path would cause issues with the game's base path being
   * duplicated in the function.
   * @return {String} A temporary working directory.
   */
  $.localTempPath = function() {
    return "temp/";
  }


  /*
   * StorageManager.fileExists(filePath, callback)
   * @param {String} The path to check.
   * @param {Function} callback The function that will be called.
   * @note
   * The callback will receive two arguments. If the first is
   * not null, an error has occurred and the data could not be
   * retrieved. If it is null, the second argument will be
   * true if the file exists.
   *
   * This function is aliased as "isFile"
   */
  $.fileExists = function(filePath, callback) {
    if(this.isLocalMode()) {
      this.fs.stat(this.localContentPath() + filePath, function(e, stats) {
        callback.call(this, e, e ? null : stats.isFile());
      });
    } else {
      this.webGetFile(filePath, "HEAD", function(xhr, path, m) {
        if(xhr.status >= 400){
          callback.call(this, new Error(xhr.status + " " + xhr.statusText), false);
        } else {
          callback.call(this, null, xhr.status === 200);
        }
      });
    }
  }
  $.isFile = $.fileExists;

  /*
   * StorageManager.fileExistsSync(filePath)
   * @param {String} filePath The path to check.
   * @return {Boolean} Whether or not the path is a file.
   * @note
   * If the node FS object encounters an error, it is not handled
   * here, you must check for errors being thrown.
   *
   * This function will return true if the requested path is a file.
   * When using non-desktop versions of the game, this function will
   * send a HEAD request to the web server/mobile device to get the
   * HTTP headers of the path. This method does not distinguish
   * between files and folders, and will return true as long as the
   * status code returned is 200 (HTTP success code).
   *
   * This function is aliased as "isFileSync".
   */
  $.fileExistsSync = function(filePath) {
    if(this.isLocalMode()) {
      return this.fs.statSync(this.localContentPath() + filePath).isFile();
    } else {
      return this.webGetFileSync(filePath, "HEAD") === 200;
    }
  }
  $.isFileSync = $.fileExistsSync;

  /*
   * StorageManager.directoryExists(dirPath, callback)
   * @param {String} dirPath The path to check
   * @param {Function} callback The function to call.
   * @note
   * The callback will get two arguments. If the first is not null,
   * an error has occurred. If it is null, the second will be a boolean
   * indicating whether or not the directory exists.
   *
   * This function is aliased as "isDirectory".
   */
  $.directoryExists = function(dirPath, callback) {
    if(this.isLocalMode()) {
      this.fs.stat(this.localContentPath() + dirPath, function(e, stats) {
        callback.call(this, e, e ? null : stats.isDirectory());
      });
    } else {
      if(dirPath.lastIndexOf("/") !== dirPath.length - 1) {
        dirPath += "/";
      }
      this.webGetFile(dirPath, "HEAD", function(xhr, path, m){
        if(xhr.status >= 400){
          callback.call(this, new Error(xhr.status + " " + xhr.statusText), false);
        } else {
          callback.call(this, null, xhr.status === 200);
        }
      });
    }
  }
  $.isDirectory = $.directoryExists;

  /*
   * StorageManager.directoryExistsSync(dirPath)
   * @param {String} dirPath The path to check.
   * @return {Boolean} Whether or not the path is a directory (folder).
   * @note
   * If the node FS object encounters an error, it is not handled
   * here, you must check for errors being thrown.
   *
   * This function will return true if the requested path is a
   * directory. When using non-desktop versions of the game, this
   * function will send a HEAD request to the web server/mobile
   * device to get the HTTP headers of the path. This method does not
   * distinguish between files and folders, and will return true as
   * long as the status code returned is 200 (HTTP success code).
   *
   * This function is aliased as "isDirectorySync"
   */
  $.directoryExistsSync = function(dirPath) {
    if(this.isLocalMode()) {
      return this.fs.statSync(this.localContentPath() + dirPath).isDirectory();
    } else {
      if(dirPath.lastIndexOf("/") !== dirPath.length - 1) {
        dirPath += "/";
      }
      return this.webGetFileSync(dirPath, "HEAD") === 200;
    }
  }
  $.isDirectorySync = $.directoryExistsSync;

  /*
   * StorageManager.removeDirectorySync(dirPath)
   * @param {String} dirPath The directory to remove.
   * @return {Boolean} Whether or not the directory was removed.
   * @note
   * In local mode, this function will check if the path exists. If
   * it doesn't, false is returned. The directory is then read and
   * each file is removed. If an entry is a folder, the function
   * recursively calls itself on that directory, so that it may be
   * cleared out. Once a folder is empty, it is removed.
   *
   * In non-desktop mode, this function has no fallback, and simply
   * returns true.
   *
   * This function is aliased as "rmdirSync".
   *
   * This function is adapted from:
   * http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
   */
  $.removeDirectorySync = function(dirPath) {
    if(this.isLocalMode()) {
      if( this.fs.existsSync(dirPath) ) {
        this.fs.readdirSync(dirPath).forEach(function(file,index){
          var curPath = dirPath + "/" + file;
          if(this.fs.lstatSync(curPath).isDirectory()) { // recurse
            this.removeDirectorySync(curPath);
          } else { // delete file
            this.fs.unlinkSync(curPath);
          }
        }, this);
        this.fs.rmdirSync(dirPath);
      } else {
        return false;
      }
    }
    return true;
  }
  $.rmdirSync = $.removeDirectorySync;

  /*
   * StorageManager.removeDirectory(dirPath, callback)
   * @param {String} dirPath The path to remove.
   * @param {Function} callback The function to call
   * @note
   * This function will asynchronously remove a folder by recusively
   * calling itself on nested folders to clear them out, as trying
   * to remove a non-emtpy directory will throw an ENOTEMPTY error.
   * In order to simplify the funtion, instead of binding all the
   * internal callbacks to 'this' in order to access the class' fs
   * object, a local variable, 'fs', is created as a local reference
   * to the object.
   *
   * This funtion is aliased as "rmdir".
   *
   * This function is adapted from:
   * http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
   */
  $.removeDirectory = function(dirPath, callback) {
    if(StorageManager.isLocalMode()) {
      var fs = StorageManager.fs;
      fs.readdir(dirPath, function(err, files) {
        if(err) {
          // Pass the error on to callback
          callback(err, null);
          return;
        }
        var wait = files.length,
          count = 0,
          folderDone = function(err) {
            count++;
            // If we cleaned out all the files, continue
            if( count >= wait || err) {
              fs.rmdir(dirPath,callback);
            }
          };
        // Empty directory to bail early
        if(!wait) {
          folderDone();
          return;
        }
        // Remove one or more trailing slash to keep from doubling up
        dirPath = dirPath.replace(/\/+$/,"");
        files.forEach(function(file) {
          var curPath = dirPath + "/" + file;
          fs.lstat(curPath, function(err, stats) {
            if( err ) {
              callback(err, null);
              return;
            }
            if( stats.isDirectory() ) {
              StorageManager.removeDirectory(curPath, folderDone);
            } else {
              fs.unlink(curPath, folderDone);
            }
          });
        });
      });
    }
  }
  $.rmdir = $.removeDirectory;

  /*
   * StorageManager.directoryIsEmpty(dirPath, callback)
   * @param {String} dirPath The file path to check.
   * @param {Function} callback The function to call.
   * @note
   * This function will call the readDir function to get a list of
   * files in a folder. If there is an internal error getting the
   * contents of a folder, the callback is called with the first
   * argument being an error object. If there is no error, the
   * callback's first argument will be null, and the second
   * argument will be a boolean (true/false) indicating if the
   * direcctory is empty or not.
   *
   * This function is aliased as "isEmpty".
   */
  $.directoryIsEmpty = function(dirPath, callback) {
    if(this.isLocalMode()) {
      this.readDir(dirPath, function(e, list) {
        if(e) {
          callback.call(this, e, false);
        } else {
          callback.call(this, null, list.length === 0);
        }
      });
    }
  }
  $.isEmpty = $.directoryIsEmpty;

  /*
   * StorageManager.directoryIsEmptySync(dirPath)
   * @param {String} dirPath The file path to check.
   * @param {Function} callback The function to call.
   * @note
   * If in local mode, this function will return true if the given
   * drectory is empty. This internally called readDirSync to get a
   * list of files in the directory, and will return true if the list
   * is empty.
   *
   * This function is aliased as "isEmptySync".
   */
  $.directoryIsEmptySync = function(dirPath) {
    if(this.isLocalMode()) {
      return this.readDirSync(dirPath).length === 0;
    }
  }
  $.isEmptySync = $.directoryIsEmptySync;

  /*
   * StorageManager.saveCompressedFile(filePath, str, callback, suppress)
   * @param {String} filePath The path to the file.
   * @param {String} str The data to save.
   * @param {Function} callback The function to call.
   * @param {Array} suppress a list of error codes (Strings) to ignore.
   * @note
   * The callback will receive one argument, which will either be
   * null, or an error.
   * If suppress is supplied, it should be an array of error codes to
   * ignore.
   */
  $.saveCompressedFile = function(filePath, str, callback, suppress) {
    if(this.isLocalMode()) {
      if(!MVC.isArray(suppress)) {
        suppress = [suppress];
      }
      var data = LZString.compressToBase64(str);
      var dirPath = filePath.substring(0, filePath.lastIndexOf("/") + 1);
      this.mkdir(dirPath, function(e){
        if(e && (!suppress || suppress && !suppress.contains(e.code))) {
          throw e;
        }
        this.fs.writeFile(this.localContentPath() + filePath, data, callback);
      }.bind(this));
    } else {
      callback.call(this, new Error("The game is not in local mode."));
    }
  }

  /*
   * StorageManager.saveCompressedFileSync(filePath, str, suppress)
   * @param {String} filePath The path to save to.
   * @param {String} str The data to save.
   * @param {Array} suppress a list of error codes (Strings) to ignore.
   * @return {Boolean} Whether or not the file has been saved.
   * @note
   * This function will save the given data to the given filepath
   * after compressing it. This should not be used to serialize
   * as it only uses the base JSON object to convert objects to
   * strings, not the provided JsonEx class.
   *
   * If suppress is supplied, it should be an array of error codes
   * to ignore. Such codes are returned by NodeJS' fs object, such as
   * ENOENT (directory doesn't exist).
   */
  $.saveCompressedFileSync = function(filePath, str, suppress) {
    if(this.isLocalMode()) {
      if(!MVC.isArray(suppress)) {
        suppress = [suppress];
      }
      var data = LZString.compressToBase64(str);
      var dirPath = filePath.substring(0, filePath.lastIndexOf("/") + 1);
      try {
        this.mkdirSync(dirPath);
      } catch(e) {
        if(!(suppress.contains(e.code))){
          throw e;
        }
      }
      fs.writeFileSync(this.localContentPath() + filePath, data);
      return true;
    } else {
      return false;
    }
  }

  /*
   * StorageManager.loadCompressedFile(filePath, callback, suppress)
   * @param {String} filePath The path to load.
   * @param {Function} callback The function to call.
   * @param {Array} suppress a list of error codes (Strings) to ignore.
   * @note
   * Local Mode
   * The callback will get 2 arguments, if the first is not null, it
   * is an error object and the second will be null. If the first is
   * not null, then no error occurred and the second argument will
   * contain the decompressed data.
   *
   * Mobile/Web Mode
   * The funciton will request the file from the mobile device/web
   * server. As long as the status code is below 400, the callback
   * will be called with no error, and the response string being
   * decompressed. If there status code is 400 or more, then an
   * error is passed as the first argument to the callback, gotten by
   * combinding the status code and status text. You'll receive
   * messages like 404 Not Found, or 403 Forbidden.
   *
   * If suppress is provided, it should be an array of strings that
   * represent error codes to ignore.
   */
  $.loadCompressedFile = function(filePath, encoding, callback, suppress) {
    if(this.isLocalMode()) {
      if(!MVC.isArray(suppress)) {
        suppress = [suppress];
      }
      this.fs.readFile(this.localContentPath() + filePath, {encoding: encoding || null}, function(e, data){
        if(e && (!suppress || suppress && !suppress.contains(e.code))) {
          callback.call(this, e, null);
          return;
        }
        callback.call(this, null, LZString.decompressFromBase64(data));
      });
    } else {
      this.webGetFile(filePath, "GET", function(xhr){
        if(xhr.status >= 400) {
          callback.call(this, new Error(xhr.status + " " + xhr.statusText), null);
        } else {
          callback.call(this, null, LZString.decompressFromBase64(xhr.responseText));
        }
      });
    }
  }

  /*
   * StorageManager.loadCompressedFileSync(filePath, suppress)
   * @param {String} filePath The path to load.
   * @param {Array} suppress a list of error codes (Strings) to ignore.
   * @note
   * The data that we're loading should be a compressed string using
   * LZString's compressToBase64 function.
   * @return {String} The decompressed data.
   */
  $.loadCompressedFileSync = function(filePath, encoding, suppress) {
    if(this.isLocalMode()) {
      if(!MVC.isArray(suppress)) {
        suppress = [suppress];
      }
      try {
        return LZString.decompressFromBase64(this.fs.readFileSync(this.localContentPath() + filePath, {encoding: encoding || null}));
      } catch(e) {
        if(!suppress || suppress && !suppress.contains(e.code)) {
          throw e;
        } else {
          return null;
        }
      }
    } else {
      return LZString.decompressFromBase64(this.webGetFileSync(filePath, "GET"));
    }
  }

  /*
   * StorageManager.removeFile(filePath, callback)
   * @param {String} filePath The path to delete.
   * @param {Function} callback The function to call.
   * @note
   * The function will receive one argument. If it is null, the
   * function succeeded. If not, the argument is an error object.
   *
   * This funciton is aliased as "del".
   */
  $.removeFile = function(filePath, callback) {
    if(this.isLocalMode()) {
      this.fs.unlink(this.localContentPath() + filePath, callback);
    }
  }
  $.del = $.removeFile;

  /*
   * StorageManager.removeFileSync(filePath)
   * @param {String} filePath The path to delete.
   * @return {Boolean} Whether or not the file has been removed.
   * @note
   * If the path does not exist, or the path is not a file, an error
   * will be thrown.
   *
   * This function is aliased as "delSync".
   */
  $.removeFileSync = function(filePath) {
    if(this.isLocalMode()) {
      this.fs.unlinkSync(this.localContentPath() + filePath);
    }
    return true;
  }
  $.delSync = $.removeFileSync;

  /*
   * StorageManager.mkdirSync(dirPath, mode)
   * @param {String} dirPath The folder to create.
   * @param {Number} mode The unix permission number to create the folder with. This has no affect on Windows.
   * @note
   * Synchronously creates the requested directory. If there is an
   * error creating the directory, it will be thrown.
   *
   * 511 is the decimal equivalent to Octal 777, used for unix
   * permissions.
   *
   * @return {Boolean} Returns true.
   */
  $.mkdirSync = function(dirPath, mode) {
    if(this.isLocalMode()) {
      this.fs.mkdirSync(this.localContentPath() + dirPath, mode || 511);
    }
    return true;
  }

  /*
   * StorageManager.mkdir(dirPath, mode, callback)
   * @param {String} dirPath The folder to create.
   * @param {Number} mode The unix permission number to create the folder with. This has no affect on Windows.
   * @param {Function} callback The function to call.
   * @note
   * Asynchronously creates the requested directory. If there is an
   * error creating the directory, it will be passed as an argument
   * to the callback.
   *
   * 511 is the decimal equivalent to Octal 777, used for unix
   * permissions.
   *
   * @return {Boolean} Returns true.
   */
  $.mkdir = function(dirPath, mode, callback) {
    if(this.isLocalMode()) {
      this.fs.mkdir(this.localContentPath() + dirPath, mode || 511, callback);
    }
  }

  /*
   * StorageManager.readDir(dirPath, callback)
   * @param {String} dirPath The directory path to read.
   * @param {Function} callback The function to call.
   * @note
   * Calls the callback function with receive two arguments. If there
   * was an error reading the directory, the first argument will be
   * and error object, and the second will be invalid. If the first
   * argument is null, the second will be a list of files, excluding
   * the '.' and '..' special directories.
   */
  $.readDir = function(dirPath, callback) {
    if(this.isLocalMode()) {
      this.fs.readdir(this.localContentPath() + dirPath, callback);
    }
  }

  /*
   * StorageManager.readDirSync(dirPath)
   * @param {String} dirPath The directory path to read.
   * @note
   * Returns a list of files, excluding the '.' and '..' special
   * directories. If there is an error reading the requested
   * directory, it will be thrown.
   */
  $.readDirSync = function(dirPath) {
    if(this.isLocalMode()) {
      return this.fs.readdirSync(this.localContentPath() + dirPath);
    }
  }

  /*
   * StorageManager.webGetFileSync(filePath, method)
   * @param {String} filePath The path to request from.
   * @param {String} method The HTTP method to use. Defaults to "GET"
   * @note
   * Requests the filepath from the web server or mobile device. This
   * is used to determine if files exist for the existance functions,
   * and the loadCompressedFile functions.
   * @return The status code, if the method is HEAD, or a string if the method is GET.
   */
  $.webGetFileSync = function(filePath, method) {
    var xhr = new XMLHttpRequest();
    xhr.open(method || 'GET', filePath, false);
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType("application/json");
    }
    xhr.send();
    if(method.toLowerCase() === "head") {
      return xhr.status;
    } else {
      if(xhr.status >= 400){
        return xhr.status + " " + xhr.statusText;
      }
      return xhr.responseText;
    }
  }

  /*
   * StorageManager.webGetFile(filePath, method, onLoad, onError)
   * @param {String} filePath The path to request from.
   * @param {String} method The HTTP method to use. Defaults to "GET"
   * @param {Function} onLoad The function to call when the data is done loading.
   * @param {Function} onError The function to call when there was an error loading.
   * @note
   * Requests the filepath from the web server or mobile device. This
   * is used to determine if files exist for the existance functions,
   * and the loadCompressedFile functions.
   */
  $.webGetFile = function(filePath, method, onLoad, onError){
    var xhr = new XMLHttpRequest();
    xhr.open(method || 'GET', filePath);
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType("application/json");
    }
    xhr.onload = function() {
      onLoad.call(this, xhr, filePath, method);
    };
    xhr.onerror = onError;
    xhr.send();
  }

  // Clears the temp folder on startup. The call is async so as to
  // not increase the game's startup time.
  // This deletes and then recreates the temp folder so that plugins
  // may use it during the game's run.
  StorageManager.rmdir(StorageManager.localContentPath() + "temp", function(e, list) {
    if(e && e.code !== "ENOENT") {
      throw e;
    } else {
      StorageManager.mkdir(StorageManager.localTempPath(), function(e) {
        if(e) {
          throw e;
        }
        StorageManager._clearingTemp = false;
      })
    }
  });

  /*
   * End StorageManager wrapper
   */
})(StorageManager);