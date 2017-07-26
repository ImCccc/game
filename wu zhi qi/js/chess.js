;(function($){
	$.fn.createChess = function(options){
		//判断对象是否jquery对象：this instanceof jQuery
		//判断是否是canvas对象，不是返回提示
		if (!this[0].tagName == 'CANVAS') return;
		//游戏是否结束的标记
        var over =false;
        //当前是否是本人下棋的标记
        var me = "true"
        //该数组用于描述坐标的位置是否已经有棋子，
        //初始化，将棋盘所有落子位置都设置成0
        var chessBoard = new Array();
        for (var i = 0; i < 15; i++) {
            chessBoard[i] = [];
            for (var j = 0; j < 15; j++) {
                chessBoard[i][j] = 0;
            }
        }
		//保存当前对象
		var self = this ;
		//获取画板对象
		var context= this[0].getContext('2d');
		//初始化默认配置,记得加‘;’，height:450 }; 不然报错
		var settings = {
			//画板的宽
			width:450,
			//画板的高 
			height:450
		};
		var w = settings.width;
		var h = settings.height;
		var wide = w/15;
		//初始化的方法
		(function(settings){
			//初始化元素的宽高，self[0] 是将jquery对象转化为doument对象；
			//此处不能调用this，会报错
			self[0].width = w ;
			self[0].height=h;

            for (var i = 0; i < 15; i++) {
                //画线的开始坐标
                context.moveTo(wide/2 + i * wide,wide/2);
                //画线的结束坐标
                context.lineTo(wide/2+ i * wide,w-wide/2);
                context.moveTo(wide/2,wide/2+ i * wide);
                context.lineTo(h-wide/2,wide/2+ i * wide);
            }
            //设置线的颜色
            context.strokeStyle = "#ACACAC";
            //开始画线
            context.stroke();
		})(settings);
        //画旗子的方法
        var oneStep = function(n,m,me){
            //画圆开始
            context.beginPath();
            /*
                画圆的参数(1,2,3,4,5)
                1、2： 圆心
                3：    半径
                4、5   弧度开始，弧度结束  
             */
            context.arc(wide/2+n*wide,wide/2+m*wide,wide/2-2,0,2*Math.PI);
            //画圆的结束
            context.closePath();
            var gradient = context.createRadialGradient(wide/2+n*wide+2,wide/2+m*wide-2,13,wide/2+n*wide+2,wide/2+m*wide-2,0);
            if (me) {
                gradient.addColorStop(0,'#0a0a0a'); 
                gradient.addColorStop(1,'#636766'); }
            else {
                gradient.addColorStop(0,'#d1d1d1'); 
                gradient.addColorStop(1,'#f9f9f9'); }
            //填充的颜色
            context.fillStyle = gradient;
            //fill方法是填充，stroke方法是描边
            context.fill();
        }
        //点击事件的触发
        this.on('click',function(e){
        	e = e || window.event;
            if (over || !me) {return; }
            // offsetX和offsetY这两个方法，是用于取得鼠标点击的位置
            var x = e.offsetX;
            var y = e.offsetY;
            //计算出，下棋在棋盘的坐标位置
            var i = Math.floor(x/wide);
            var j = Math.floor(y/wide);
            //判断这个位置是否已经有棋子，如果没有chessBoard[i][j] == 0，才让下棋
            if (chessBoard[i][j] == 0) {
            	//触发下棋的方法
                oneStep(i,j,me);
                //将坐标位置标记为已经下棋
                chessBoard[i][j] = 1;
                for(var k=0;k<count;k++){
                    if (wins[i][j][k]) {
                        myWin[k]++;
                        comWin[k] = 6;
                        if (myWin[k] == 5) {
                            window.alert("你赢了！");
                            over = true;
                        }
                    }
                }
                //如果本人在下完一个棋子后，游戏没有赢，那么到计算机下棋
                if (!over) {me = !me; comAI(); }
            }
        })

    /*==========================算法的部分===========================*/
	    
	    //1.赢法数组wins,和初始化
	    var wins = [];
	    for(var i=0; i<15; i++){
	        wins[i] = [];
	        for (var j = 0; j < 15; j++) {
	            wins[i][j] = [];
	        }
	    }
	    //统计所有赢法的变量，代表赢得比赛方法的总数
	    var count = 0;

        /*  
            所有的横线的赢法的统计
            赢法的例子
            wins[0][0][0] = true    wins[1][0][0] = true
            wins[0][1][0] = true    wins[1][1][0] = true
            wins[0][2][0] = true    wins[1][2][0] = true
            wins[0][3][0] = true    wins[1][3][0] = true
            wins[0][4][0] = true    wins[1][4][0] = true
            
            赢法的例子
            wins[0][1][1] = true    wins[4][5][2] = true
            wins[0][2][1] = true    wins[4][6][2] = true
            wins[0][3][1] = true    wins[4][7][2] = true
            wins[0][4][1] = true    wins[4][8][2] = true
            wins[0][5][1] = true    wins[4][9][2] = true
        */
	    for (var i = 0; i < 15; i++) {
	        for (var j = 0; j < 11; j++) {
	            for (var k = 0; k < 5; k++) {
	                wins[i][j+k][count] = true;
	            }
	            count++;
	        }
	    }
        /*  
            所有的竖线的赢法的统计
        */
	    for (var i = 0; i < 15; i++) {
	        for (var j = 0; j < 11; j++) {
	            for (var k = 0; k < 5; k++) {
	                wins[j+k][i][count] = true;
	            }
	            count++;
	        }
	    }
        /*  
            所有的斜线的赢法的统计
        */
	    for (var i = 0; i < 11; i++) {
	        for (var j = 0; j < 11; j++) {
	            for (var k = 0; k < 5; k++) {
	                wins[i+k][j+k][count] = true;
	            }
	            count++;
	        }
	    }
        /*  
            所有的反斜线的赢法的统计
        */	    
	    for (var i = 0; i < 11; i++) {
	        for (var j = 14; j > 3; j--) {
	            for (var k = 0; k < 5; k++) {
	                wins[i+k][j-k][count] = true;
	            }
	            count++;
	        }
	    }

	    // 2.赢法统计数组
	    //我方的赢法的统计数组
	    var myWin = [];
	   	//电脑方的赢法的统计数组
	    var comWin = [];
	    for (var i = 0; i < count; i++) {
	        myWin[i] = 0;
	        comWin[i] = 0;
	    }
	    var comAI = function(){
	    	/* 
	    		用于统计每一个坐标位置如果出现我的棋子，那么将会对计算机的威胁的积分，
	    		每一个坐标都会计算出一个唯一的威胁积分，
	    		如果积分大，那么计算机下棋在该位置的概率就会增加
	    	*/
	        var myScore = [];
	    	/* 
	    		用于统计每一个坐标位置如果出现计算机的棋子，那么将会对计算机会赢的概率有多大，
	    		概率越大，积分积分就越大
	    		如果积分大，那么计算机下棋在该位置的概率就会增加
	    	*/
	        var computerScore = [];
	        //保存积分的最大值
	        var max = 0;
	        //保存最大值时，对应的坐标位置，计算机将以该位置进行下棋
	        var u = 0, v = 0;
	        //初始化积分数据
	        for (var i = 0; i < 15; i++) {
	            myScore[i] = [];
	            computerScore[i] = [];
	            for (var j = 0; j < 15; j++) {
	                myScore[i][j] = 0;
	                computerScore[i][j] = 0;
	            }
	        }
	        for (var i = 0; i < 15; i++) {
	            for(var j = 0; j < 15; j++){
	            	/*
						for (var i = 0; i < 15; i++) 
							for(var j = 0; j < 15; j++)
								if (chessBoard[i][j] == 0)
						历遍每一个坐标，如该坐标没有棋子，
						那么计算出该坐标的'威胁度',和'胜利度',这2个值，用积分体现
	            	 */
	                if (chessBoard[i][j] == 0) {
	                    for (var k = 0; k < count; k++) {
	                        if (wins[i][j][k]) {
	                            if (myWin[k] == 1) {
	                            myScore[i][j] += 200;
	                            }
	                            else if (myWin[k] == 2) {
	                                myScore[i][j] += 400;
	                            }
	                            else if (myWin[k] == 3) {
	                                myScore[i][j] += 2000;
	                            }
	                            else if (myWin[k] == 4) {
	                                myScore[i][j] += 20000;
	                            }
	                            if (comWin[k] == 1) {
	                                computerScore[i][j] += 220;
	                            }
	                            else if (comWin[k] == 2) {
	                                computerScore[i][j] += 420;
	                            }
	                            else if (comWin[k] == 3) {
	                                computerScore[i][j] += 2200;
	                            }
	                            else if (comWin[k] == 4) {
	                                computerScore[i][j] += 20000;
	                            }
	                        }
	                    }
	                }
	               	/* 
	               		每一次计算出坐标的积分，都会和max对比，
	               		如果大于，将该值赋给max，同时保存坐标，整个循环后，
	               		就会得出一个最大利益的坐标 
	               	*/
	                if (myScore[i][j] > max) {
	                    max = myScore[i][j];
	                    u = i;
	                    v = j;
	                }
	                if (computerScore[i][j] > max) {
	                    max = computerScore[i][j];
	                    u = i;
	                    v = j;
	                }
	            }
	        }
	        oneStep(u,v,false);
	        chessBoard[u][v] = 2;
	        for(var k=0;k<count;k++){
	            if (wins[u][v][k]) {
	                comWin[k]++;
	                myWin[k] = 6;
	                if (comWin[k] == 5) {
	                    window.alert("计算机赢了！");
	                    over = true;
	                }
	            }
	        }
	        if (!over) {
	            me = !me;
	        }
	    }
	}
})(jQuery)

$(function(){
	$('#chess').createChess();
})