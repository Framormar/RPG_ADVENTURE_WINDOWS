//=============================================================================
// SAN_VirtualRTP.js
//=============================================================================
// Copyright (c) 2015 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc SAN_VirtualRTP ver0.10
 * Read material files from dir by plugin parameter pointed path.
 * 
 * @help
 *
 * THIS PLUGIN IS EXPEROMENTAL VERSION!!
 *
 * It's possible to commercial use, distribute, and modify under the MIT license.
 * But, don't eliminate and don't alter a comment of the beginning.
 * If it's good, please indicate an author name on credit.
 * 
 * Author doesn't shoulder any responsibility in all kind of damage by using this.
 * And please don't expect support. X(
 * 
 * @param imgPath
 * @desc Image dir path. Set Index.html's dir path of VRTP. relative path is also possible.
 * @default file:///C:/Program Files (x86)/KADOKAWA/RPGMV/NewData/
 *
 * @param audioPath
 * @desc Audio dir path. Set Index.html's dir path of VRTP. relative path is also possible.
 * @default file:///C:/Program Files (x86)/KADOKAWA/RPGMV/NewData/
 * 
 * @param dataPath
 * @desc Data dir path. Set Index.html's dir path of VRTP. relative path is also possible.
 * @default ./
 * 
 */

/*:ja
 * @plugindesc バーチャルRTP ver0.10
 * プラグインパラメータのパスから素材ファイルを読込みます。
 * @author サンシロ https://twitter.com/rev2nym
 * @version 0.10 2015/11/30 HTTPサーバー、ブラウザプレイに暫定対応、名前空間、著作権表記追加
 * 0.02 2015/11/13 img, audio, dataフォルダのパスを個別に設定するよう変更
 * 0.01 2015/11/11 VirtualRTP ver 0.01 として再公開
 * 
 * @help
 * プラグインパラメータで指定したパスから画像と音声ファイルを読み込みます。 
 * パスはPlugins.jsを直接編集することでも設定可能です。
 * 素材フォルダパスを指定することでゲームフォルダのimg, audioフォルダを削除することができます。
 * 
 * ※注意：上記フォルダを削除するとRPG Maker MVのエディタ上でも素材が削除されます。
 * 
 * 以下の環境で動作確認をしています。
 * ・RPG Maker MVのテストプレイ起動
 * ・Windows向け.exeファイル起動
 * ・Chrome （起動オプション : --allow-file-access-from-files）
 * ・Firefox （about:config で security.fileuri.strict_origin_policy を false に設定）
 * 
 * ※注意：上記ブラウザ設定はJavaScriptの同一生成元ポリシーによるセキュリティ対策を無効化するものです。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 *
 * @param imgPath
 * @desc 画像素材フォルダのパスです。Index.htmlがあるべき場所を指定してください。相対パスも可能です。
 * @default file:///C:/Program Files (x86)/KADOKAWA/RPGMV/NewData/
 *
 * @param audioPath
 * @desc 音声素材フォルダのパスです。Index.htmlがあるべき場所を指定してください。相対パスも可能です。
 * @default file:///C:/Program Files (x86)/KADOKAWA/RPGMV/NewData/
 * 
 * @param dataPath
 * @desc ゲームデータフォルダのパスです。Index.htmlがあるべき場所を指定してください。相対パスも可能です。
 * @default ./
 */

var Imported = Imported || {};
Imported.SAN_VirtualRTP = true;

var Sanshiro = Sanshiro || {};
Sanshiro.VirtualRTP = Sanshiro.VirtualRTP || {};

(function() {

    function VirtualRTP() {};

    VirtualRTP.solveRelativePath = function(path) {
        var indexPath     = window.location.href;
        var directoryPath = indexPath.replace(/\/[^/]*$/, '');
        if ((/^\.\.\//).test(path)) {
            path = path.replace(/^\.\./, directoryPath.replace(/\/[^/]*$/, ''));
        } else if ((/^\.\//).test(path)) {
            path = path.replace(/^\./, directoryPath);
        }
        return path
    };

    VirtualRTP.imgPath   = VirtualRTP.solveRelativePath(PluginManager.parameters('SAN_VirtualRTP')['imgPath']);
    VirtualRTP.audioPath = VirtualRTP.solveRelativePath(PluginManager.parameters('SAN_VirtualRTP')['audioPath']);
    VirtualRTP.dataPath  = VirtualRTP.solveRelativePath(PluginManager.parameters('SAN_VirtualRTP')['dataPath']);

    AudioManager._path = VirtualRTP.audioPath + AudioManager._path;

    Sanshiro.VirtualRTP.oldImageManagerloadAnimation = ImageManager.loadAnimation;
    ImageManager.loadAnimation = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/animations/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadAnimation.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/animations/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadBattleback1 = ImageManager.loadBattleback1;
    ImageManager.loadBattleback1 = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/battlebacks1/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadBattleback1.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/battlebacks1/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadBattleback2 = ImageManager.loadBattleback2;
    ImageManager.loadBattleback2 = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/battlebacks2/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadBattleback2.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/battlebacks2/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadEnemy = ImageManager.loadEnemy;
    ImageManager.loadEnemy = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/enemies/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadEnemy.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/enemies/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadCharacter = ImageManager.loadCharacter;
    ImageManager.loadCharacter = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/characters/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadCharacter.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/characters/', filename, hue, false);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadFace = ImageManager.loadFace;
    ImageManager.loadFace = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/faces/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadFace.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/faces/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadParallax = ImageManager.loadParallax;
    ImageManager.loadParallax = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/parallaxes/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadParallax.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/parallaxes/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadPicture = ImageManager.loadPicture;
    ImageManager.loadPicture = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/pictures/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadPicture.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/pictures/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadSvActor = ImageManager.loadSvActor;
    ImageManager.loadSvActor = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/sv_actors/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadSvActor.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/sv_actors/', filename, hue, false);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadSvEnemy = ImageManager.loadSvEnemy;
    ImageManager.loadSvEnemy = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/sv_enemies/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadSvEnemy.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/sv_enemies/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadSystem = ImageManager.loadSystem;
    ImageManager.loadSystem = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/system/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadSystem.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/system/', filename, hue, false);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadTileset = ImageManager.loadTileset;
    ImageManager.loadTileset = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/tilesets/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadTileset.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/tilesets/', filename, hue, false);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadTitle1 = ImageManager.loadTitle1;
    ImageManager.loadTitle1 = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/titles1/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadTitle1.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/titles1/', filename, hue, true);
    };

    Sanshiro.VirtualRTP.oldImageManagerloadTitle2 = ImageManager.loadTitle2;
    ImageManager.loadTitle2 = function(filename, hue) {
        var filename_escaped = filename.replace(/[\-\[\]\{\}\(\)*+?.,\\\^$|#\s]/g, "\\$&");
        regex = new RegExp("img/titles2/"+filename_escaped+".png",'g');
        if (FileList.scanWithPath(regex)[0])
        return Sanshiro.VirtualRTP.oldImageManagerloadTitle2.call(this,filename,hue);
        return this.loadBitmap(VirtualRTP.imgPath + 'img/titles2/', filename, hue, true);
    };

    DataManager.loadDataFile = function(name, src) {
        var xhr = new XMLHttpRequest();
        var url = VirtualRTP.dataPath + 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
        xhr.onerror = function() {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        window[name] = null;
        xhr.send();
    };

    Sanshiro.VirtualRTP.Graphics__paintUpperCanvas = Graphics._paintUpperCanvas;
    Graphics._paintUpperCanvas = function() {
        try {
            Sanshiro.VirtualRTP.Graphics__paintUpperCanvas.call(this);
        } catch (e) {
            console.log(e);
        }
    };

})();