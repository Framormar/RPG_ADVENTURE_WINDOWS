//=============================================================================
// VirtualRTP.js
//=============================================================================

/*:
 * @plugindesc ヴァーチャルRTP
 * プラグインパラメータのパスから素材ファイルを読込みます。
 * @author サンシロ https://twitter.com/rev2nym
 * @version 0.02 2015/11/13 img, audio, dataフォルダのパスを個別に設定するよう変更
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

(function() {
	
	function VirtualRTP() {};
	
    VirtualRTP.imgPath   = PluginManager.parameters('VirtualRTP')['imgPath'];
    VirtualRTP.audioPath = PluginManager.parameters('VirtualRTP')['audioPath'];
    VirtualRTP.dataPath  = PluginManager.parameters('VirtualRTP')['dataPath'];
    
    AudioManager._path = VirtualRTP.audioPath + AudioManager._path;
    
	ImageManager.loadAnimation = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/animations/', filename, hue, true);
	};
	
	ImageManager.loadBattleback1 = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/battlebacks1/', filename, hue, true);
	};
	
	ImageManager.loadBattleback2 = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/battlebacks2/', filename, hue, true);
	};
	
	ImageManager.loadEnemy = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/enemies/', filename, hue, true);
	};
	
	var estOldImageManagerLoadCharacter = ImageManager.loadCharacter;
	ImageManager.loadCharacter = function(filename, hue) {
        regex = new RegExp("img/characters/"+filename+".png",'img');
        if (FileList.scanWithPath(regex)[0])
        {
        	console.log("enter")
        return estOldImageManagerLoadCharacter.call(this,filename,hue);
        }else{
        	console.log("entOORRr")
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/characters/', filename, hue, false);
	    }
	};
	
	ImageManager.loadFace = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/faces/', filename, hue, true);
	};
	
	ImageManager.loadParallax = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/parallaxes/', filename, hue, true);
	};
	
	ImageManager.loadPicture = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/pictures/', filename, hue, true);
	};
	
	ImageManager.loadSvActor = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/sv_actors/', filename, hue, false);
	};
	
	ImageManager.loadSvEnemy = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/sv_enemies/', filename, hue, true);
	};
	
	ImageManager.loadSystem = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/system/', filename, hue, false);
	};
	
	ImageManager.loadTileset = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/tilesets/', filename, hue, false);
	};
	
	ImageManager.loadTitle1 = function(filename, hue) {
	    return this.loadBitmap(VirtualRTP.imgPath + 'img/titles1/', filename, hue, true);
	};
	
	ImageManager.loadTitle2 = function(filename, hue) {
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
	
})();