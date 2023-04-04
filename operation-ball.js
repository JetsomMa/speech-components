window.onload = function () {
  // 添加视口设置
  // var meta = document.createElement('meta');
  // meta.name = 'viewport';
  // meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
  // document.head.appendChild(meta);

  // 定义一个函数，入参为dom的 top left width height 返回值为新的 top left，要求dom的边沿不能超出屏幕展示区域
  function getNewPosition(top, left, width, height) {
    var newTop = top
    var newLeft = left
    if (left < 0) {
      newLeft = 0
    }
    if (left > document.documentElement.clientWidth - width) {
      newLeft = document.documentElement.clientWidth - width
    }
    if (top < 0) {
      newTop = 0
    }
    if (top > document.documentElement.clientHeight - height) {
      newTop = document.documentElement.clientHeight - height
    }
    return {
      top: newTop,
      left: newLeft
    }
  }

  // 获取设备宽度
  // var deviceWidth = document.documentElement.clientWidth;
  // 根据屏幕宽度动态调整小球与弹窗尺寸
  // var ballRadius = 50 25;
  // var popupWidth = deviceWidth > 480 ? 200 : 100;
  // var popupHeight = deviceWidth > 480 ? 305 : 152.5;
  
  var ballRadius = 50;
  var popupWidth = 200;
  var popupHeight = 305;
  // 创建小球元素，小球初始位置在屏幕右下角
  var ball = document.createElement('div');
  ball.style.width = ballRadius + 'px';
  ball.style.height = ballRadius + 'px';
  ball.style.background = 'url(https://download.mashaojie.cn/image/header.png)';
  ball.style.backgroundSize = 'cover';
  ball.style.position = 'fixed';
  ball.style.zIndex = '99998';
  ball.style.borderRadius = ballRadius + 'px';
  ball.style.cursor = 'move';
  ball.style.right = '20px';
  ball.style.bottom = '20px';
  document.body.appendChild(ball);

  // 创建一个弹窗元素，宽200高300，默认不展示，有好看的背景色和立体感
  var popup = document.createElement('div');
  popup.style.width = popupWidth + 'px';
  popup.style.height = popupHeight + 'px';
  popup.style.backgroundColor = 'white';
  popup.style.position = 'fixed';
  popup.style.zIndex = '99999';
  popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  popup.style.display = 'none';
  document.body.appendChild(popup);

  // 创建一个标题在弹窗的左上角展示，内容为“语音识别”
  var title = document.createElement('div');
  title.style.width = '100%';
  title.style.height = '35px';
  title.style.backgroundColor = 'white';
  title.style.position = 'absolute';
  title.style.top = '0';
  title.style.textAlign = 'center';
  title.style.lineHeight = '35px';
  title.style.color = '#333333';
  title.style.borderBottom = '1px solid #333333';
  title.textContent = '语音识别';
  popup.appendChild(title);

  // 创建一个关闭按钮，按钮相对于标题上下剧中
  var closeBtn = document.createElement('div');
  closeBtn.style.width = '20px';
  closeBtn.style.height = '20px';
  closeBtn.style.backgroundColor = '#87CEFA';
  closeBtn.style.position = 'absolute';
  closeBtn.style.right = '7px';
  closeBtn.style.top = '7px';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.textAlign = 'center';
  closeBtn.style.lineHeight = '22px';
  closeBtn.style.color = 'white';
  closeBtn.textContent = 'X';
  popup.appendChild(closeBtn);

  // 创建一个文本域，弹窗中间展示
  var textArea = document.createElement('textarea');
  textArea.style.width = '100%';
  textArea.style.height = '220px';
  textArea.style.width = '96%';
  textArea.style.marginLeft = '2%';
  textArea.style.marginTop = '40px';
  textArea.style.boxSizing = 'border-box';
  textArea.style.backgroundColor = '#F5F5F5';
  textArea.style.border = 'none';
  textArea.style.resize = 'none';
  popup.appendChild(textArea);

  // 创建一个按钮，在弹窗底部展示
  var btn = document.createElement('div');
  btn.style.width = '90%';
  btn.style.marginLeft = '5%';
  btn.style.marginBottom = '5px';
  btn.style.height = '35px';
  btn.style.backgroundColor = '#87CEFA';
  btn.style.position = 'absolute';
  btn.style.bottom = '0';
  btn.style.cursor = 'pointer';
  btn.style.borderRadius = '10px';
  btn.style.textAlign = 'center';
  btn.style.lineHeight = '40px';
  btn.style.color = 'white';
  btn.textContent = '提交';
  popup.appendChild(btn);


  // 当手指在小球上按下时，触发小球拖动标识
  var isDragging = false;
  var clickLock = false;
  var ballX = 0;
  var ballY = 0;
  // PC端适配
  ball.addEventListener('mousedown', function (e) {
    isDragging = true;
    ballX = e.clientX;
    ballY = e.clientY;
  });
  // 手机浏览器适配
  ball.addEventListener('touchstart', function (e) {
    isDragging = true;
    ballX = e.touches[0].clientX;
    ballY = e.touches[0].clientY;
  });

  // 当手指移动时，小球跟着手指移动，且小球的中心点和手指的位置重合，小球的边沿不能超出屏幕展示区域
  var moveLimit = (ballRadius * 7 / 24) ** 2
  // PC端适配
  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      var x = e.clientX - ballRadius / 2
      var y = e.clientY - ballRadius / 2
      var { top, left } = getNewPosition(y, x, ballRadius, ballRadius)

      if (!clickLock && (e.clientX - ballX) ** 2 + (e.clientY - ballY) ** 2 >= moveLimit){
        clickLock = true
      }

      if(clickLock){
        ball.style.top = top + 'px';
        ball.style.left = left + 'px';
      }
    }
  });
  // 手机浏览器适配
  document.addEventListener('touchmove', function (e) {
    if (isDragging) {
      var x = e.touches[0].clientX - ballRadius / 2;
      var y = e.touches[0].clientY - ballRadius / 2;
      var { top, left } = getNewPosition(y, x, ballRadius, ballRadius);

      if (!clickLock && (e.touches[0].clientX - ballX) ** 2 + (e.touches[0].clientY - ballY) ** 2 >= moveLimit) {
        clickLock = true;
      }

      if (clickLock) {
        ball.style.top = top + 'px';
        ball.style.left = left + 'px';
      }
    }
  });

  // 手指离开屏幕时，记录小球的位置
  // PC端适配
  document.addEventListener('mouseup', function (e) {
    isDragging = false;
  });
  // 手机浏览器适配
  document.addEventListener('touchend', function (e) {
    isDragging = false;
  });

  // 当小球ball被点击，记录小球的位置，小球隐藏，弹窗popup展示，弹窗的位置和小球的位置重合，且弹窗的边沿不能超出屏幕展示区域，弹窗的宽高和创建时一致，创建一个1s的动画，弹窗从小球的位置放大到弹窗的宽高
  // PC端适配
  ball.addEventListener('click', function (e) {
    if (clickLock) {
      clickLock = false
      return
    }

    ball.style.display = 'none';
    popup.style.display = 'block';
    var x = e.clientX - popupWidth / 2;
    var y = e.clientY - popupHeight / 2;
    var { top: y, left: x } = getNewPosition(y, x, popupWidth, popupHeight)
    popup.style.top = y + 'px';
    popup.style.left = x + 'px';
    popup.style.transform = 'scale(0)';
    setTimeout(function () {
      popup.style.transform = 'scale(1)';
    }, 0);
  });
  // 手机浏览器适配
  ball.addEventListener('touchend', function (e) {
    if (clickLock) {
      clickLock = false
      return
    }

    ball.style.display = 'none';
    popup.style.display = 'block';
    var x = e.changedTouches[0].clientX - popupWidth / 2;
    var y = e.changedTouches[0].clientY - popupHeight / 2;
    var { top: y, left: x } = getNewPosition(y, x, popupWidth, popupHeight);
    popup.style.top = y + 'px';
    popup.style.left = x + 'px';
    popup.style.transform = 'scale(0)';
    setTimeout(function () {
      popup.style.transform = 'scale(1)';
    }, 0);
  });

  // 当关闭按钮closeBtn被点击，弹窗popup隐藏，小球ball展示在原来位置，创建一个1s的动画，小球从弹窗的位置缩小到小球的宽高
  closeBtn.addEventListener('click', function () {
    popup.style.display = 'none';
    ball.style.display = 'block';
    ball.style.transform = 'scale(0)';
    setTimeout(function () {
      ball.style.transform = 'scale(1)';
    }, 0);
  });
};

