enchant();//use enchant.js

var _click_x = 0;
var _click_y = 0;
var _resource = ['8cell_animated.gif', 'break_dance.gif',
				'green_dance_girl.gif', 'spiral_circle.gif',
				'square.gif', 'truck.gif', 'glasses.gif',
				'green_rain.gif','matrix.gif','move.gif'];
				
var _nowResourceNum = 0;
var _playStartTime = -1;//-1:未測定、他：シャッフル開始時間
var _record = 0;
var _complete = false;
//var _shuffle_stop = false;

window.onload = function(){
	
	//初期設定＆リソース読み込み他
	var game = new Game(320, 480);
	game.fps = 15;
	
	for(var i=0; i<_resource.length; i++){
		game.preload("./gif/"+_resource[i]);
    }
    
    game.preload("./image/header.png");
    game.preload("./image/next.png");
    game.preload("./image/reset.png");
    game.preload("./image/prev.png");
    game.preload("./image/next_on.png");
    game.preload("./image/reset_on.png");
    game.preload("./image/prev_on.png");    
    
    game.onload = function() {
    	//スライドパズルの箱
    	var slideBox = new SlideBox(game.assets["./gif/"+_resource[_nowResourceNum]], 29+22, 60+22, 57*4);
    	
   		//ヘッダー
   		var header = new Sprite(320, 44);
   		header.image = game.assets["./image/header.png"];
   		
   		//表示情報   		
   		var info = new Label();
   		info.x = 10;
   		info.y = 380;
   		info.color = "white";
   		info.text ="SlidePuzzle + MOVE!";
   		
   		//操作系フッター
   		var nextButton = new Sprite(90, 48);
   		nextButton.image = game.assets["./image/next.png"];
   		nextButton.moveTo(320-90, 480-48);
   		nextButton.addEventListener("touchstart", function() {
			_shuffle_stop = true;
			_playStartTime = -1;
   			this.image = game.assets["./image/next_on.png"];
   			info.text = "SlidePuzzle + MOVE!";
   			_nowResourceNum++;
   			if(_nowResourceNum >= _resource.length){
   				_nowResourceNum = 0;
   			}
   			slideBox.changeImage(game.assets["./gif/"+_resource[_nowResourceNum]]);

   		});
   		nextButton.addEventListener("touchend", function() {
   			this.image = game.assets["./image/next.png"];
   		});
   		
   		var prevButton = new Sprite(90, 48);
   		prevButton.image = game.assets["./image/prev.png"];
   		prevButton.moveTo(0, 480-48);
   		prevButton.addEventListener("touchstart", function() {
   			_shuffle_stop = true;
   			_playStartTime = -1;
   			this.image = game.assets["./image/prev_on.png"];
   			_nowResourceNum--;
			info.text = "SlidePuzzle + MOVE!";
   			if(_nowResourceNum <= -1 ){
   				_nowResourceNum = _resource.length-1;
   			}
   			slideBox.changeImage(game.assets["./gif/"+_resource[_nowResourceNum]]);
   			
   		});
   		prevButton.addEventListener("touchend", function() {
   			this.image = game.assets["./image/prev.png"];
   		});
   		
   		var resetButton = new Sprite(140, 48);
   		resetButton.image = game.assets["./image/reset.png"];
   		resetButton.moveTo(90, 480-48);
   		resetButton.addEventListener("touchstart", function() {
   			_shuffle_stop = true;
   			_playStartTime = -1;
   			info.text = "SlidePuzzle + MOVE!";
   			this.image = game.assets["./image/reset_on.png"];
   			slideBox.changeImage(game.assets["./gif/"+_resource[_nowResourceNum]]);
   		});
   		resetButton.addEventListener("touchend", function() {
   			this.image = game.assets["./image/reset.png"];
   		});
   		
   		//メインScene
   		var scene = game.rootScene;
   		scene.backgroundColor = "Black";
   		for(var i=0; i<slideBox.pieces.length; i++){	
   			scene.addChild(slideBox.pieces[i]);
   		}

   		scene.addChild(header);
   		scene.addChild(nextButton);
   		scene.addChild(prevButton);
   		scene.addChild(resetButton);
   		
   		
   		
   		
   		//ゲーム開始・スライドパズルピース操作
   		scene.addEventListener('touchstart', function(e) {
   		
   			var result = slideBox.operatePiece(e.localX, e.localY);
   			console.log("result->"+result);
   			if(result === 0) {
   				//シャッフル
   				_shuffle_stop = false;
   				_complete = false;
   				_playStartTime = -1;
   				//シャッフルして開始
   				var shuffle_n = 0;
   				var add_shuffle = function(){
   					slideBox.oneShuffle();
   					shuffle_n++;
   					info.text = "Now shuffling…";
   					//シャッフル終了
					if(shuffle_n > 100) {
						this.removeEventListener('enterframe', add_shuffle);
						_playStartTime = parseInt(game.frame/game.fps);
						_shuffle_stop = false;
					}
					//シャッフル強制終了
					if(_shuffle_stop) {
						_shuffle_stop = false;
						this.removeEventListener('enterframe', add_shuffle);
						info.text = "SlidePuzzle + MOVE!";
						//_playStartTime = parseInt(game.frame/game.fps);
						slideBox.changeImage(game.assets["./gif/"+_resource[_nowResourceNum]]);

					}
   				};
   			
   				scene.addEventListener('enterframe', add_shuffle); 	
   			}
   			
   			
   			if(slideBox.judgeComplete() && _playStartTime !== -1){
   				_complete = true;
   				_record = (game.frame/game.fps) - _playStartTime;
   				info.text = "Congratulations! "+"Record time : "+getTimeStrings(_record);
   			}
   		});

   		
   		scene.addEventListener('enterframe', function() {
   			//slideBox.oneShuffle();
   			if(_playStartTime !== -1 && !_complete) {
   				var record = (game.frame/game.fps) - _playStartTime;
   				
   				info.text = "now time … " + getTimeStrings(record);
   			}
   			
   			if(_playStartTime === -1) {
   				
   			}
   		});
   		
   		
   		scene.addChild(info);
   		
   		var copy = new Label();
   		copy.x = 10;
   		copy.y = 400;
   		copy.text = "gif images from : www.avatarsdb.com";
   		copy.color = "white";
   		scene.addChild(copy);
   		
    }


    game.start();
};


function getTimeStrings(sectime) {
	var min = Math.floor(sectime / 60);
   	var sec = Math.floor(sectime - min*60);
   	var msec = Math.floor(sectime*100) - sec*100;
   	var recordstring = 	("0"+min).slice(-2) + " : "+
   				("0"+sec).slice(-2) + " : "+
   				("0"+msec).slice(-2);
   	return recordstring;
}



