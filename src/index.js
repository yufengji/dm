// require('es5-shim');
// require('es5-shim/es5-sham');
require("./requestNextAnimationFrame");
class Barrage {
    constructor(option){
        this.eleId = option.eleId;//初始化dom id——必填
        this.canvasId = option.canvasId;//canvas id——必填
        this.canvasW = option.canvasWidth;//canvas 宽——必填
        this.canvasH = option.canvasHeight;//canvas 高——必填
        this.lineHeight = option.lineHeight;//文字 行高——必填
        this.txtFont = option.txtFont || '';//默认文字大小字体
        this.txtFillStyle = option.txtFillStyle || '';//默认文字样式
        this.specialFont = option.specialFont || '';//特殊文字大小字体
        this.specialFillStyle = option.specialFillStyle || '';//特殊文字样式
        this.hideShadow = option.hideShadow || false;//是否隐藏阴影
        /**
         * type:类型：1纯文字，2：带边框的文字，3：礼物
         * txt:文字
         * speed:速度
         * txtFillStyle:文字颜色
         * txtFont:文字字号字体等
         * boxSet:绘制边框文字的时候配置，padding:左右间距，height:边框的高度（边框的颜色和文字颜色一样）
         * gift:绘制送礼时配置，url:礼物图片的url地址，num:连击数，width:礼物的宽，height：礼物的高
         * type->1:{type:1,txt:'3444ddddddddddddddddddddddddddddddddddddd444444444',speed:1,txtFillStyle:'#fff',txtFont: '30px microsoft YaHei'},
         * type->2:{type:2,txt:'3444444444444444444444',speed:1,txtFillStyle:'#fff',txtFont: '30px microsoft YaHei',boxSet:{padding:5,height:40}},
         * type->3:{type:3,txt:'ssssssssssssssssss4',speed:1,txtFillStyle:'#fff',txtFont: '30px microsoft YaHei',gift:{url:'http://f1.img4399.com/box~cp/1862016/09/18/14_Ki04rf.70x70.png~250x250',num:4,width:50,height:50}},
         */
        this.barrageArray = [];//每一条弹幕配置相关数组
        this.barrageContain = document.getElementById(this.eleId);//弹幕容器
        this.isPaused = option.isPaused || false;//是否暂停
        this.isHide = option.isHide || false;//是否隐藏
        this.maxShowNum = option.maxShowNum || -1;
        this.checkLineExit();
        this.createEle();
        this.animate();
    }
    checkLineExit () {
        /**
         * 确认每一行是否可以插入
         */
        this.lArray = [];
        for (let i = 0; i < Math.floor(this.canvasH / this.lineHeight); i++) {
            this.lArray.push(0);
        }
    }
    createEle () {
        /**
         * 创建元素
         */
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.canvasId;
        this.canvas.height = this.canvasH;
        this.canvas.width = this.canvasW;
        this.barrageContain.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
    }
    addText (data) {
        /**
         * 添加文字
         */
        if (this.isHide) {
            return false;
        }
        data.x = this.canvasW;
        data.y = -1;
        this.barrageArray.push(data);
    }
    animate () {
        /**
         * 动画
         * 非暂停和隐藏状态执行
         */
        const animate = () => {
            if (!this.isPaused && !this.isHide) {
                this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
                const showNum = this.maxShowNum == -1 ? this.barrageArray.length : (this.maxShowNum > this.barrageArray.length ? this.barrageArray.length : this.maxShowNum);
                for (let i = 0; i < this.barrageArray.length; i++) {
                    if (i < showNum) {
                        let singleWidth;
                        /**
                         * 调节速度
                         * @type {number}
                         */
                        this.barrageArray[i].x -= this.barrageArray[i].speed;
                        /**
                         * 新插入判断
                         */
                        if (this.barrageArray[i].y == -1) {
                            let isExit = false;
                            /**
                             * 判断当前是否有可以插入的行
                             */
                            for (let j = 0; j < this.lArray.length; j++) {
                                if (this.lArray[j] == 0 && !isExit) {
                                    this.barrageArray[i].y = j;
                                    this.lArray[j] = 1;
                                    isExit = true;
                                }
                            }
                            /**
                             * 当前都没有可以插入的将所有置为可插入
                             */
                            if (!isExit) {
                                for (let g = 0; g < this.lArray.length; g++) {
                                    this.lArray[g] = 0;
                                }
                                this.barrageArray[i].y = 0;
                                this.lArray[0] = 1;
                            }
                        }
                        this.context.save();
                        /**
                         * 每一条弹幕的绘制
                         * 1：纯文字
                         * 2：带边框的文字
                         * 3：文字带图片
                         */
                        switch (this.barrageArray[i].type) {
                            case 1:
                                this.context.font = this.barrageArray[i].txtFont || this.txtFont;
                                this.context.fillStyle = this.barrageArray[i].txtFillStyle || this.txtFillStyle;
                                singleWidth = this.context.measureText(this.barrageArray[i].txt).width;
                                if (!this.hideShadow && !(/Firefox/i).test(window.navigator.userAgent)) {
                                    this.context.shadowOffsetX = 1;
                                    this.context.shadowOffsetY = 1;
                                    this.context.shadowColor = "#000";
                                    this.context.shadowBlur = 4;
                                }
                                this.context.textBaseline = 'middle';
                                this.context.fillText(this.barrageArray[i].txt,this.barrageArray[i].x,this.barrageArray[i].y * this.lineHeight+30);
                                break;
                            case 2:
                                /**
                                 * 绘制文字
                                 */
                                this.context.font = this.barrageArray[i].txtFont || this.txtFont;
                                this.context.fillStyle = this.barrageArray[i].txtFillStyle || this.txtFillStyle;
                                singleWidth = this.context.measureText(this.barrageArray[i].txt).width;
                                this.context.textBaseline = 'middle';
                                if (!this.hideShadow && !(/Firefox/i).test(window.navigator.userAgent)) {
                                    this.context.shadowOffsetX = 1;
                                    this.context.shadowOffsetY = 1;
                                    this.context.shadowColor = "#000";
                                    this.context.shadowBlur = 4;
                                }
                                this.context.fillText(this.barrageArray[i].txt,this.barrageArray[i].x,this.barrageArray[i].y * this.lineHeight+30);
                                /**
                                 * 绘制边框
                                 */
                                this.context.strokeStyle = this.barrageArray[i].txtFillStyle || this.txtFillStyle;
                                this.context.lineWidth = 2;
                                this.context.beginPath();
                                this.context.rect(this.barrageArray[i].x-this.barrageArray[i].boxSet.padding,this.barrageArray[i].y * this.lineHeight + 30 - this.barrageArray[i].boxSet.height/2,singleWidth+2*this.barrageArray[i].boxSet.padding,this.barrageArray[i].boxSet.height);
                                this.context.stroke();
                                break;
                            case 3:
                                /**
                                 * 绘制文字
                                 */
                                this.context.font = this.barrageArray[i].txtFont || this.txtFont;
                                this.context.fillStyle = this.barrageArray[i].txtFillStyle || this.txtFillStyle;
                                singleWidth = this.context.measureText(this.barrageArray[i].txt).width;
                                this.context.textBaseline = 'middle';
                                this.context.fillText(this.barrageArray[i].txt,this.barrageArray[i].x,this.barrageArray[i].y * this.lineHeight+30);
                                /**
                                 * 绘制图片
                                 * 不在onload里绘制是因为在onload里绘制动画已经再次执行，onload还未完成，导致图片出不来
                                 */
                                const img = new Image();
                                img.src = this.barrageArray[i].gift.url;
                                this.context.drawImage(img,this.barrageArray[i].x + singleWidth,this.barrageArray[i].y * this.lineHeight+30-this.barrageArray[i].gift.height/2,this.barrageArray[i].gift.width,this.barrageArray[i].gift.height);
                                /**
                                 * 绘制连击文字
                                 */
                                singleWidth += this.barrageArray[i].gift.width;
                                if (this.barrageArray[i].gift.num > 1) {
                                    this.context.fillText('x' + this.barrageArray[i].gift.num + '连击！',this.barrageArray[i].x + singleWidth,this.barrageArray[i].y * this.lineHeight+30);
                                    singleWidth += this.context.measureText('x' + this.barrageArray[i].gift.num + '连击！').width;
                                }
                                break;
                        }
                        this.context.restore();
                        /**
                         * 文字离开右边界，当行置为可插入状态
                         */
                        if (this.canvasW-this.barrageArray[i].x - parseInt(singleWidth) == 100 || this.canvasW-this.barrageArray[i].x - parseInt(singleWidth) == 101) {
                            this.lArray[this.barrageArray[i].y] = 0;
                        }
                        /**
                         * 文字离开左边界各数组移除对应值
                         */
                        if (-this.barrageArray[i].x >= singleWidth + 20) {
                            this.barrageArray.splice(i,1);
                        }
                    }
                }
            }
            requestNextAnimationFrame(animate);
        };
        requestNextAnimationFrame(animate);
    }
    clearCanvas () {
        /**
         * 清除弹幕
         */
        for (let i = 0; i < this.lArray.length; i++) {
            this.lArray[i] = 0;
        }
        this.barrageArray = [];
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
    changesize (w,h) {
        /**
         * 改变canvas宽高
         */
        this.canvas.width = w;
        this.canvas.height = h;
        this.canvasW = w;
        this.canvasH = h;
        this.clearCanvas();
        this.checkLineExit();
    }
}
window.Barrage = Barrage;