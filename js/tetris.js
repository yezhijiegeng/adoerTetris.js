"use strict"
+(function(){
    var Tetris=function(opt) {
        this.blockSize=opt.blockSize;
        this.rows=opt.rows || 10;
        this.cols=opt.cols || 18;
        this.terisNode=document.getElementById(opt.id);
        this._init();
    }
    Tetris.prototype={
        blockSize:0,
        terisNode:null,
        rows:0,
        cols:0,
        canvas:null,
        canvasW:this.blockSize*10,
        canvasH:this.blockSize*20,
        // img:new Image(),
        downFlag:true,
        drawCanvasBlockFlag:true,
        // 下落时间间隔 初始为每隔1000ms下落一个小方格。
        speedTime:1000,
        // 当前活动块对象
        activeBlock:[],
        time:null,
        timeFlag:true,
        //随机形态映射数组
        shapeArr:["S","Z","L","J","I","O","T"],
        //随机方向映射数组
        dirArr:["up","right","down","left"],
        //深拷贝
        deepCopy: function(p, c) {
            var self=this;
            var c = c || {};
            for (var i in p) {
                if (typeof p[i] === 'object') {
                    c[i] = (p[i].constructor === Array) ? [] : {};
                    self.deepCopy(p[i], c[i]);
                } else {
                    c[i] = p[i];
                }
            }
            return c;
        },
        //各个形态方块原始数据
        blockData:null,
        // 创建数组
        dataArr1: [
            //真实
         // [0,1,2,3,4,5,6,7,8,9],
            [0,0,0,1,1,1,0,0,0,0],
            [0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        dataArr:[],
        // 创建blockData
        buildBlockData:function(){
            var self=this;
            var r=self.rows;
            //rows为奇数 中心点为 (r-1)/2 为偶数时中心点为(r/2)-1
            var n=r%2===0?(r/2)-1:(r-1)/2;
            self.blockData={
                // S形态
                S:{
                    up:{
                        xy:[
                            {x: n, y: 0},
                            {x: n-1, y: 0},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"S",
                        color:"purple",
                        value:1
                    },
                    right:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"S",
                        color:"purple",
                        value:1
                    },
                    down:{
                        xy:[
                            {x: n, y: 0},
                            {x: n-1, y: 0},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"S",
                        color:"purple",
                        value:1
                    },
                    left:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"S",
                        color:"purple",
                        value:1
                    }
                },
                // Z形态
                Z:{
                    up:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"Z",
                        color:"green",
                        value:2
                    },
                    right:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"Z",
                        color:"green",
                        value:2
                    },
                    down:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"Z",
                        color:"green",
                        value:2
                    },
                    left:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"Z",
                        color:"green",
                        value:2
                    }
                },
                // L形态
                L:{
                    up:{
                        xy:[
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"L",
                        color:"blue",
                        value:3
                    },
                    right:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"L",
                        color:"blue",
                        value:3
                    },
                    down:{
                        xy:[
                            {x: n, y: -2},
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"L",
                        color:"blue",
                        value:3
                    },
                    left:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"L",
                        color:"blue",
                        value:3
                    }
                },
                // J形态
                J:{
                    up:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                            {x: n, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"J",
                        color:"pink",
                        value:4
                    },
                    right:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                            {x: n+2, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"J",
                        color:"pink",
                        value:4
                    },
                    down:{
                        xy:[
                            {x: n, y: -2},
                            {x: n+1, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"J",
                        color:"pink",
                        value:4
                    },
                    left:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"J",
                        color:"pink",
                        value:4
                    }
                },
                // T形态
                T:{
                    up:{
                        xy:[
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    },
                    right:{
                        xy:[
                            {x: n-1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    },
                    down:{
                        xy:[
                            {x: n+1, y: -2},
                            {x: n+1, y: -1},
                            {x: n, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    },
                    left:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n-1, y: 0},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"T",
                        color:"lightBlue",
                        value:5
                    }
                },
                // O形态
                O:{
                    up:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"O",
                        color:"yellow",
                        value:6
                    },
                    right:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"O",
                        color:"yellow",
                        value:6
                    },
                    down:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"O",
                        color:"yellow",
                        value:6
                    },
                    left:{
                        xy:[
                            {x: n, y: -1},
                            {x: n, y: 0},
                            {x: n+1, y: -1},
                            {x: n+1, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"O",
                        color:"yellow",
                        value:6
                    }
                },
                // I形态
                I:{
                    up:{
                        xy:[
                            {x: n, y: -3},
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"up",
                        nextDir:"right",
                        shape:"I",
                        color:"red",
                        value:7
                    },
                    right:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                            {x: n+2, y: 0},
                        ],
                        dir:"right",
                        nextDir:"down",
                        shape:"I",
                        color:"red",
                        value:7
                    },
                    down:{
                        xy:[
                            {x: n, y: -3},
                            {x: n, y: -2},
                            {x: n, y: -1},
                            {x: n, y: 0},
                        ],
                        dir:"down",
                        nextDir:"left",
                        shape:"I",
                        color:"red",
                        value:7
                    },
                    left:{
                        xy:[
                            {x: n-1, y: 0},
                            {x: n, y: 0},
                            {x: n+1, y: 0},
                            {x: n+2, y: 0},
                        ],
                        dir:"left",
                        nextDir:"up",
                        shape:"I",
                        color:"red",
                        value:7
                    }
                }

            }
        },
        // 创建dataArr
        buildDataArr:function(){
            var self=this;
            var bigArr=new Array();
            for(var i=0;i<self.cols;i++){
                var smArr=new Array();
                for(var j=0;j<self.rows;j++){
                    smArr[j]=0;
                }
                bigArr.push(smArr)
            }
            self.dataArr=bigArr;
        },
        // 随机生成 一种方块 （一共七种 S，Z，L，J，I，O，T 每一种有4种方向(上，右，下，左)。
        builBlockXY:function(){
            var self=this;
            //随机产生0-6数组，代表7种形态。
            var blockRandomNum = Math.floor(Math.random()*7);
            //随机产生0-3(上，右，下，左)，代表4个方向的形态
            var dirRandomNum = Math.floor(Math.random()*4);
            //初始坐标
            var shape=self.shapeArr[blockRandomNum];
            var dir=self.dirArr[dirRandomNum];
            self.activeBlock = self.deepCopy(self.blockData[shape][dir]);
        },
        // 更新dataArr对应位置元素值为0大于1
        updateDataArr:function(dataXY,value){
            var self=this;
            // Y为第几行，X为第几列。
            for(var j=0,l2=dataXY.length;j<l2;j++){
                if(self.dataArr[dataXY[j].y]){
                    self.dataArr[dataXY[j].y][dataXY[j].x]=value;
                }
            }
            //判断是否有消行 有就删除这一行 并且在头部新添加一行[0,0,0,0,0,0,0,0,0,0]
            var l1=self.dataArr.length;
            for(var i1=0;i1<l1;i1++){
                if(self.dataArr[i1].join().indexOf("0")<0){
                    self.dataArr.splice(i1,1);
                    self.dataArr.unshift([0,0,0,0,0,0,0,0,0,0]);
                }
            }
        },
        // 生成方块下一步移动的坐标，并判断是否到达顶部。
        changeBlockXY:function(){
            var self=this;
            var moveFlag=true;
            var activeBlock=self.activeBlock.xy;
            /*
             判断下一个nextActiveBlockXY中的任意一个小方格的Y坐标
             1、是否超过底线，如果超过，那么采用当前方块，并停止向下移动。
             2、是否遇到dataArr中值为1的元素，如果遇到，那么采用当前方块，并停止向下移动。
             */
            for(var i=0,l=activeBlock.length;i<l;i++){
                //判断是否超过底线
                if(activeBlock[i].y+1>=self.cols){
                    //更新dataArr对应位置的元素为activeBlock.value
                    self.updateDataArr(activeBlock,self.activeBlock.value);
                    //重新生成新的方块坐标
                    self.builBlockXY();
                    moveFlag=false;
                    break;
                }
                // 判断是否遇到dataArr中值大于或等于activeBlock.value的元素
                var rowIndex=activeBlock[i].y+1;
                var colIndex=activeBlock[i].x;
                if(self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex]>=1){
                    //更新dataArr对应位置的元素为activeBlock.value
                    self.updateDataArr(activeBlock,self.activeBlock.value);
                    //重新生成新的方块坐标 新的activeBlock
                    self.builBlockXY();
                    //判断是否到达顶部
                    for(var j=0,l1=activeBlock.length;j<l1;j++){
                        if(activeBlock[j].y>=0 && self.dataArr[0][activeBlock[j].x]>=1){
                            self.drawCanvasBlockFlag=false;
                            self.timeFlag=false;
                            console.log("游戏结束");
                            console.log(activeBlock);
                            break;
                        }
                    }
                    moveFlag=false;
                    break;
                }
            }
            if(moveFlag){
                // 当前方块坐标往下移动一步
                activeBlock[0].y+=1;
                activeBlock[1].y+=1;
                activeBlock[2].y+=1;
                activeBlock[3].y+=1;
            }
        },
        // 根据坐标以及宽高绘制一个小方格
        drawSmBlockCanvas:function(x,y,w,h,color){
            this.canvas.ctx.fillStyle="rgba(0,0,0,0.3)";
            this.canvas.ctx.fillRect(x, y,w, h);
            // this.img.src=this.img_src;
            var img=new Image();
            img.src="./images/"+color+"Blcok.png";
            // this.img.src="./images/redBlcok.png";
            this.canvas.ctx.drawImage(img,x,y,this.blockSize,this.blockSize);
        },
        // 根据当前 activeBlock 坐标画出其真实形态
        drawBlockCanvas:function(){
            var self=this;
            var activeBlock=self.activeBlock.xy;
            for(var i=0,l=activeBlock.length;i<l;i++){
                var x=activeBlock[i].x*self.blockSize;
                var y=activeBlock[i].y*self.blockSize;
                self.drawSmBlockCanvas(x,y,self.blockSize, self.blockSize,self.activeBlock.color);
            }
        },
        // 左右移动时改变activeBlock的坐标 并判断是否碰壁 或者碰到dataArr中值为1的元素
        changeLeftRightBlockXY:function(direction){
            var self=this;
            var activeBlock=self.activeBlock.xy;
            if(direction==="right"){
                //检测移动后是否碰壁 或者碰到dataArr中值为1的元素 如果没有碰壁才进行移动坐标
                var moveRightFalg=true;
                for(var i=0,l=activeBlock.length;i<l;i++){
                    //检测是否碰到dataArr中值为1的元素
                    if(self.dataArr[activeBlock[i].y] && self.dataArr[activeBlock[i].y][activeBlock[i].x+1]>=1){
                        moveRightFalg=false;
                    }
                    //检测碰壁
                    if(activeBlock[i].x+1>self.rows-1){
                        moveRightFalg=false;
                    }
                }
                if(moveRightFalg){
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    //绘制向左 或向右移动后的 新的方块
                    for(var i=0,l=activeBlock.length;i<l;i++){

                        activeBlock[i].x+=1;

                        var x=activeBlock[i].x*self.blockSize;
                        var y=activeBlock[i].y*self.blockSize;
                        self.drawSmBlockCanvas(x,y,self.blockSize, self.blockSize,self.activeBlock.color);
                    }
                    // 绘制dataArr中值为1的小方块
                    self.drawDataArrCanvas();
                }
            }else if(direction==="left"){
                //检测移动后是否碰壁 或者碰到dataArr中值为1的元素 如果没有碰壁才进行移动坐标
                var moveLeftFalg=true;
                for(var i=0,l=activeBlock.length;i<l;i++){
                    //检测是否碰到dataArr中值为1的元素
                    if(self.dataArr[activeBlock[i].y] && self.dataArr[activeBlock[i].y][activeBlock[i].x-1]>=1){
                        moveLeftFalg=false;
                    }
                    //检测碰壁
                    if(activeBlock[i].x-1<0){
                        moveLeftFalg=false;
                    }
                }
                if(moveLeftFalg){
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    //绘制向左 或向右移动后的 新的方块
                    for(var i=0,l=activeBlock.length;i<l;i++){
                        activeBlock[i].x-=1;

                        var x=activeBlock[i].x*self.blockSize;
                        var y=activeBlock[i].y*self.blockSize;
                        self.drawSmBlockCanvas(x,y,self.blockSize, self.blockSize,self.activeBlock.color);
                    }
                    // 绘制dataArr中值为1的小方块
                    self.drawDataArrCanvas();
                }
            }

        },
        // 每次activeBlock坐标向右旋转90° 从根据activevBlock查询下一个nextBlock
        rotate:function(){
            var self=this;
            var shape=self.activeBlock.shape;
            if(shape!=="O"){
                var rotateFlag=true;
                var activeBlock=self.activeBlock;
                var activeBlockXY=activeBlock.xy;
                //判断activeBlock比初始时下移了多少 左移或右移了多少
                //originBlock为初始的activeBlock
                var originBlockXY=self.blockData[activeBlock.shape][activeBlock.dir].xy;
                var offset_y=activeBlockXY[0].y-originBlockXY[0].y;
                var offset_x=activeBlockXY[0].x-originBlockXY[0].x;

                //下一个 nextBlock
                var nextBlock=self.deepCopy(self.blockData[activeBlock.shape][activeBlock.nextDir]);
                var nextBlockXY=nextBlock.xy;
                for(var i=0,l=nextBlockXY.length;i<l;i++){
                    nextBlockXY[i].x+=offset_x;
                    nextBlockXY[i].y+=offset_y;
                    var rowIndex=nextBlockXY[i].y;
                    var colIndex=nextBlockXY[i].x;
                    if(colIndex<0 || (self.dataArr[rowIndex] && self.dataArr[rowIndex][colIndex]>=1)){
                        rotateFlag=false;
                        break;
                    }
                }
                if(rotateFlag){
                    self.activeBlock=nextBlock;
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    // 绘制dataArr中值大于1的小方块
                    self.drawDataArrCanvas();
                    if(self.drawCanvasBlockFlag){
                        // 根据方块坐标绘制新的方块
                        self.drawBlockCanvas();
                    }
                }
            }
        },
        // 监听键盘上下左右事件
        bindEvent:function(){
            var self=this;
            document.addEventListener("keydown",function(e){
                // 监听方向键
                // 上
                if(e.keyCode=="38"){
                    if(self.timeFlag){
                        self.rotate();
                    }
                }
                // 下
                if(e.keyCode=="40"){
                    if(self.timeFlag){
                        // 清空画布
                        self.clearCanvas();
                        // 绘制基础底色和网格
                        self.drawBase();
                        // 生成下一个方块的坐标
                        self.changeBlockXY();
                        // 绘制dataArr中值为1的小方块
                        self.drawDataArrCanvas();
                        if(self.drawCanvasBlockFlag){
                            // 根据方块坐标绘制新的方块
                            self.drawBlockCanvas();
                        }
                    }
                }
                // 左
                if(e.keyCode=="37"){
                    if(self.timeFlag){
                        self.changeLeftRightBlockXY("left");
                    }
                }
                // 右
                if(e.keyCode=="39"){
                    if(self.timeFlag){
                        self.changeLeftRightBlockXY("right");
                    }
                }
            });
        },
        // 根据dataArr画出元素值>1的小方块
        drawDataArrCanvas:function(){
            var self=this;
            for(var i=0,l=self.dataArr.length;i<l;i++){
                var arr=self.dataArr[i];
                for(var j=0,l1=arr.length;j<l1;j++){
                    if(arr[j]>=1){
                        var color="";
                        switch (arr[j]){
                            case 1:color="purple";break;
                            case 2:color="green";break;
                            case 3:color="blue";break;
                            case 4:color="pink";break;
                            case 5:color="lightBlue";break;
                            case 6:color="yellow";break;
                            case 7:color="red";break;
                        }
                        var x=j*self.blockSize;
                        var y=i*self.blockSize;
                        self.drawSmBlockCanvas(x,y,self.blockSize,self.blockSize,color);
                    }
                }
            }
        },
        // 清除画布
        clearCanvas:function(){
            this.canvas.ctx.clearRect(0,0,this.canvasW,this.canvasH);
        },
        // 第一次构建基础网格
        buildBase:function(){
            var self=this;
            self.canvasW=self.blockSize*self.rows,
                self.canvasH=self.blockSize*self.cols,

                self.canvas=document.createElement("canvas");
            self.canvas.width=self.canvasW;
            self.canvas.height=self.canvasH;

            self.terisNode.style.width=self.canvasW+"px";
            self.terisNode.style.height=self.canvasH+"px";
            self.terisNode.appendChild(self.canvas);


            self.canvas.ctx=self.canvas.getContext("2d")
            self.canvas.ctx.beginPath();
            // 绘制网格
            for(var i=1;i<self.rows;i++){
                self.canvas.ctx.moveTo(self.blockSize*i,0);
                self.canvas.ctx.lineTo(self.blockSize*i, self.canvasH);
                self.canvas.ctx.lineWidth = 1;
            }
            for(var i=1;i<self.cols;i++){
                self.canvas.ctx.moveTo(0,self.blockSize*i);
                self.canvas.ctx.lineTo(self.canvasW,self.blockSize*i);
                self.canvas.ctx.lineWidth = 1;
            }
            self.canvas.ctx.strokeStyle="#B88858";
            self.drawBase();
        },
        // 每一次重新绘制基础网格
        drawBase:function(){
            var self=this;
            self.canvas.ctx.fillStyle="#295159";
            self.canvas.ctx.fillRect(0, 0, self.canvasW, self.canvasH);
            self.canvas.ctx.stroke();
        },
        // 播放开始
        play:function(){
            var self=this;
            // 构建blockData
            self.buildBlockData();
            // 构建dataArr
            self.buildDataArr();
            // 第一次构建基础网格
            self.buildBase();
            // 随机生成一个形态的坐标
            self.builBlockXY();
            self.drawBlockCanvas();
            // 监听键盘上下左右事件
            self.bindEvent();

            self.time=setInterval(function(){
                if(self.timeFlag){
                    // 清空画布
                    self.clearCanvas();
                    // 绘制基础底色和网格
                    self.drawBase();
                    // 生成下一个方块的坐标
                    self.changeBlockXY();
                    // 绘制dataArr中值为1的小方块
                    self.drawDataArrCanvas();
                    if(self.drawCanvasBlockFlag){
                        // 根据方块坐标绘制新的方块
                        self.drawBlockCanvas();
                    }
                }
                console.log(self.time);
            },self.speedTime);
        },
        _init:function(){
            var self=this;
            self.play();
        }
    }
    window.Tetris=Tetris;
})();
