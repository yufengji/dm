# 纯文字+直播间送礼弹幕


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at 127.0.0.1:8080
npm run dev

# build for production with minification
npm run build
```

##文件说明
``` bash
# js
    index入口文件
##初始化
``` bash
参数说明
        eleId//插入的元素id（必填）
        canvasId//canvas的id（必填）
        canvasWidth//canvas的宽
        canvasHeight//canvas的高
        lineHeight//每一行的高
        txtFont//默认文字大小字体
        txtFillStyle//默认文字样式
        hideShadow//是否隐藏阴影
        isPaused//是否暂停
        isHide//是否隐藏
        maxShowNum//最多展示几条
示例
    var barrage = new Barrage({
        eleId: 'main',
        canvasId: 'canvas',
        canvasWidth: 1000,
        canvasHeight: 500,
        lineHeight: 50,
        txtFont: '30px microsoft YaHei',
        txtFillStyle: '#000',
        maxShowNum: 40
    });
    /**
    * 添加文字
    */
    document.getElementById('add1').onclick = function () {
        barrage.addText({type:1,txt:document.getElementById('txt').value,speed:1,txtFillStyle:'#fff',txtFont: '30px microsoft YaHei'});
    };
    /**
    * 添加带边框文字
    */
    document.getElementById('add2').onclick = function () {
        barrage.addText({type:2,txt:document.getElementById('txt').value,speed:1,txtFillStyle:'#fff',txtFont: '30px microsoft YaHei',boxSet:{padding:5,height:40}});
    };
    /**
    * 礼物
    */
    document.getElementById('add3').onclick = function () {
        barrage.addText({type:3,txt:'若～～只如初见 送出 金币',speed:1,txtFillStyle:'#fff',txtFont: '30px microsoft YaHei',gift:{url:'http://f1.img4399.com/box~cp/1862016/09/18/14_Ki04rf.70x70.png~250x250',num:4,width:50,height:50}});
    };
    /**
    * 弹幕开关
    */
    document.getElementById('close').onclick = function () {
        barrage.isHide = !barrage.isHide;
        document.getElementById('close').innerHTML = '开关' + barrage.isHide;
        if (barrage.isHide) {
            barrage.clearCanvas();
        }
    };
    /**
    * 弹幕暂停
    */
    document.getElementById('pause').onclick = function () {
        barrage.isPaused = !barrage.isPaused;
        document.getElementById('pause').innerHTML = '暂停' + barrage.isPaused;
    };
    /**
    * 尺寸切换
    */
    var isSmallSize = true;
        document.getElementById('changeSize').onclick = function () {
        if (isSmallSize) {
        isSmallSize = false;
        barrage.changesize(1600,1000);
        } else {
        isSmallSize = true;
        barrage.changesize(500,500);
    }
    /**
    * 清除弹幕
    */
    barrage.clearCanvas();
```
