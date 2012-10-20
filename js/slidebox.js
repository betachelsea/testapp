/*
 * SlideBoxクラス
 */
var SlideBox = enchant.Class.create({

	//img:オリジナルgif画像、 sq_size:パズル全体サイズ
	initialize: function(img, put_x, put_y, sq_size) {
		this.pieces = [];
		this.x = put_x;
		this.y = put_y;
		this.boxsize = sq_size;
		this.blankindex = 15;//初期値Blank
		//imgは正方形であることが保証されているものとする。
		var orgsize = img.width;
		console.log(img.width);
		
		//一辺を4つに分割
		this.divide = 4;
		
		for(var yn=0; yn<this.divide; yn++){
			for(var xn=0; xn<this.divide; xn++) {
				var psize = img.width/this.divide;
				var one = new Piece(img, psize, xn, yn, xn+yn*this.divide);
				one.image = img;
				var rate = sq_size/orgsize;
				one.scale(sq_size/orgsize); 
				one.x = put_x + xn*(sq_size/this.divide) + psize/2;
				one.y = put_y + yn*(sq_size/this.divide) + psize/2;
				
				
				if(xn+yn*this.divide === 15){
					one.setBlank();
				}
				
				this.pieces.push(one);
			}
		}		
	},
	
	changeImage: function(img) {
		var self = this;
		
		for(var i=0; i<self.pieces.length; i++){
			self.pieces[i].frame = i;
			self.pieces[i].orgimg = img;
			self.pieces[i].image = img;
		}
		self.blankindex = 15;
		self.pieces[15].setBlank();
	},
	
	//-1:ピース以外の部分をクリック
	getPieceNumber: function(click_x, click_y) {
		var self = this;
		var box_x = click_x - self.x;
		var box_y = click_y - self.y;
		
		//ピース以外の部分がクリックされたらはじく
		if( box_x < 0 || self.boxsize < box_x || 
			box_y < 0 || self.boxsize < box_y ) {
			return -1;
		}		
		
		var xn = Math.floor(box_x / (self.boxsize/self.divide));
		var yn = Math.floor(box_y / (self.boxsize/self.divide));
		 
		var num = xn + yn*self.divide;
		
		if(num > 15) return -1;
		else return num;
	},
	
	//上下左右ランダムにBlankが移動(移動可能な場所に）
	//必ずBlankが1回移動することを保証する
	oneShuffle: function() {
		var self = this;
		var moveDone = -1;
		var bi = self.blankindex;
		var d = self.divide;
		var xn = self.pieces[bi].loc_x;
		var yn = self.pieces[bi].loc_y;
		
		var swapindex = -1;
			var m = Math.floor(Math.random()*100) % 4;
			if(m === 0 && 0 <= yn-1)	{
				swapindex = xn+(yn-1)*d;
				movedone = self.swap(xn+(yn-1)*d);
			}
			else if(m === 1 && xn+1 < d) {
				movedone = self.swap((xn+1)+yn*d);
				swapindex = (xn+1)+yn*d;
			}
			else if(m === 2 && yn+1 < d) {
				movedone = self.swap(xn+(yn+1)*d);
				swapindex = xn+(yn+1)*d;
			}
			else if(m === 3 && 0 <= xn-1) {
				movedone = self.swap((xn-1)+yn*d);
				swapindex = (xn-1)+yn*d;
			}
	},
	
	//現在のblankと指定されたindexのマス（中身）を交換します
	//blankと同じindexであるときはエラーを返します
	//ToDo:交換不可の位置にあるときエラー
	
	swap: function(swap_index){
		var self = this;
		if(self.blankindex === swap_index) {
			console.log("cannot swap!");
			return -1;
		}
		
		var frame_n = self.pieces[swap_index].frame;
		
		self.pieces[self.blankindex].changeState(frame_n);
		self.blankindex = swap_index;
		self.pieces[self.blankindex].setBlank();
		
		return 1;
	},
	
	//ピース操作
	operatePiece: function(click_x, click_y){
		var self = this;
		var n = self.getPieceNumber(click_x, click_y);
		var d = self.divide;
		var bi = self.blankindex;
		
		if(self.judgeComplete() && n !== -1) {
			return 0;//バラバラにする合図
		}
		
		if (bi-d === n || bi+d === n ||
			bi+1 === n || bi-1 === n) {
			self.swap(n);
			return 1;
		}
		
		return -1;//failed
	},
	
	//完成状態を確認
	judgeComplete: function(){
		var result = true;
		var self = this;
		for(var i=0; i<self.pieces.length; i++){
			if(self.pieces[i].frame !== i){
				result = false;
			}
		}
		
		console.log("result->"+result);
		return result;
	}
});



/*
 * Pieceクラス - Sprite継承
 */
var Piece = enchant.Class.create(enchant.Sprite, {
	initialize: function(img, size, xn, yn, n) {
		enchant.Sprite.call(this, size, size);
		this.loc_x = xn;//X座標個数
		this.loc_y = yn;//Y座標個数
		this.backgroundColor = "white";
		//this.number = n;//パネル通し番号0-15
		this.frame = n;//表示中画像
		this.orgimg = img;//元画像
		this.blank = new Surface(size, size);
		var ctx = this.blank.context;
		ctx.fillStyle = "gray";
		ctx.fillRect(0,0,size,size);
				
	},
	
	setBlank: function() {
		var self = this;
		self.image = self.blank;
		self.frame = 15;
	},
	
	changeState: function(frame_n) {
		var self = this;
		self.image = self.orgimg;
		self.frame = frame_n;
	}
});