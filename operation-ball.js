(function () {
  function init() {
    let isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true;
    }

    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    document.head.appendChild(meta);

    var ballRadius = 50;
    var popupWidth = 260;
    var popupHeight = 305;
    var titleHeight = 35;

    var ball = createBallElement(ballRadius);
    var popup = createPopupElement(popupWidth, popupHeight);

    var title = createTitleElement(titleHeight);
    var closeBtn = createCloseBtnElement();
    var textArea = createTextAreaElement();
    var speechBtn = createSpeechBtnElement();
    var comfirmBtn = createComfirmBtnElement();

    popup.appendChild(title);
    popup.appendChild(closeBtn);
    popup.appendChild(textArea);
    popup.appendChild(speechBtn);
    popup.appendChild(comfirmBtn);

    var isDragging = false;
    var clickLock = false;
    var startX = 0;
    var startY = 0;
    var offsetX = 0;
    var offsetY = 0;

    function getNewPosition(offsetX, offsetY, width, height) {
      offsetX = offsetX - width / 2;
      offsetY = offsetY - height / 2;
      var newTop = startY + offsetY
      var newLeft = startX + offsetX
      if (startX + offsetX < 0) {
        newLeft = 0
      }
      if (startX + offsetX + width > document.documentElement.clientWidth) {
        newLeft = document.documentElement.clientWidth - width
      }
      if (startY + offsetY < 0) {
        newTop = 0
      }
      if (startY + offsetY + height > document.documentElement.clientHeight) {
        newTop = document.documentElement.clientHeight - height
      }
      return {
        top: newTop,
        left: newLeft
      }
    }

    function mousedownFunction (e) {
      e.stopPropagation();
      e.preventDefault();
      isDragging = true;
      if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
      }
    }
    ball.addEventListener(isMobile ? 'touchstart' : 'mousedown', mousedownFunction, { passive: false } );
    title.addEventListener(isMobile ? 'touchstart' : 'mousedown', mousedownFunction, { passive: false } );

    var moveLimit = (ballRadius / 3) ** 2
    document.addEventListener(isMobile ? 'touchmove' : 'mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x, y;
      if (e.type === 'touchmove') {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      offsetX = x - startX;
      offsetY = y - startY;

      if (!clickLock && offsetX ** 2 + offsetY ** 2 >= moveLimit) {
        clickLock = true;
      }

      if (clickLock) {
        if(ball.style.display !== 'none'){
          var { top, left } = getNewPosition(offsetX, offsetY, ballRadius, ballRadius);
          ball.style.top = top + 'px';
          ball.style.left = left + 'px';
        }
        if(popup.style.display !== 'none'){
          var { top, left } = getNewPosition(offsetX, offsetY, popupWidth, titleHeight);
          if(top + popupHeight > document.documentElement.clientHeight){
            top = document.documentElement.clientHeight - popupHeight;
          }
          popup.style.top = top + 'px';
          popup.style.left = left + 'px';
        }
      }
    }, { passive: false });

    document.addEventListener(isMobile ? 'touchend' : 'mouseup', function (e) {
      if (isDragging) {
        isDragging = false;
        startX = 0;
        startY = 0;
        offsetX = 0;
        offsetY = 0;
      }
    });

    ball.addEventListener( isMobile ? 'touchend' : 'click', function(e) {
      if (clickLock) {
        clickLock = false
        return
      }
      
      ball.style.display = 'none';
      popup.style.display = 'block';

      var x, y;
      if (isMobile) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      x = x - popupWidth + ballRadius / 2;
      y = y - titleHeight / 2;
      
      var top, left;
      if(y + popupHeight > document.documentElement.clientHeight){
        top = document.documentElement.clientHeight - popupHeight;
      }else{
        top = y;
      }

      if(x < 0){
        left = 0;
      } else {
        left = x;
      }
      
      popup.style.top = top + 'px';
      popup.style.left = left + 'px';
      popup.style.transform = 'scale(0)';
      setTimeout(function () {
        popup.style.transform = 'scale(1)';
      }, 0);
    });
    
    closeBtn.addEventListener( isMobile ? 'touchend' : 'click', function(e) {
      e.preventDefault();
      popup.style.display = 'none';
      ball.style.display = 'block';

      // 将小球恢复到面板的中心位置
      var x, y;
      if (isMobile) {
        x = e.changedTouches[0].clientX - popupWidth / 2;
        y = e.changedTouches[0].clientY - popupHeight / 2;
      } else {
        x = e.clientX - popupWidth / 2;
        y = e.clientY - popupHeight / 2;
      }
      var top = y + popupHeight / 2 - ballRadius / 2;
      var left = x + popupWidth / 2 - ballRadius / 2;
      ball.style.top = top + 'px';
      ball.style.left = left + 'px';

      ball.style.transform = 'scale(0)';
      setTimeout(function () {
        ball.style.transform = 'scale(1)';
      }, 0);
    }, { passive: false });

    document.body.appendChild(ball);
    document.body.appendChild(popup);
  }

  function createBallElement(ballRadius) {
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
    return ball;
  }

  function createPopupElement(popupWidth, popupHeight) {
    var popup = document.createElement('div');
    popup.style.width = popupWidth + 'px';
    popup.style.height = popupHeight + 'px';
    popup.style.backgroundColor = 'white';
    popup.style.position = 'fixed';
    popup.style.zIndex = '99999';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.display = 'none';
    return popup;
  }

  function createTitleElement(titleHeight) {
    var title = document.createElement('div');
    title.style.width = '100%';
    title.style.height = titleHeight + 'px';
    title.style.backgroundColor = 'white';
    title.style.position = 'absolute';
    title.style.top = '0';
    title.style.textAlign = 'center';
    title.style.lineHeight = titleHeight + 'px';
    title.style.color = '#333333';
    title.style.borderBottom = '1px solid #333333';
    title.textContent = '语音识别';
    return title;
  }

  function createCloseBtnElement() {
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
    return closeBtn;
  }

  function createTextAreaElement() {
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
    textArea.placeholder = '请触发语音识别，然后开始说话...';
    return textArea;
  }

  function createSpeechBtnElement() {
    var speechBtn = document.createElement('button');
    speechBtn.style.width = '42%';
    speechBtn.style.marginLeft = '5%';
    speechBtn.style.marginBottom = '5px';
    speechBtn.style.height = '35px';
    speechBtn.style.backgroundColor = '#87CEFA';
    speechBtn.style.bottom = '0';
    speechBtn.style.cursor = 'pointer';
    speechBtn.style.borderRadius = '10px';
    speechBtn.style.textAlign = 'center';
    speechBtn.style.fontSize = '16px';
    speechBtn.style.color = 'white';
    speechBtn.textContent = '语音识别';
    speechBtn.style.userSelect = 'none';
    return speechBtn;
  }

  function createComfirmBtnElement() {
    var comfirmBtn = document.createElement('button');
    comfirmBtn.style.width = '42%';
    comfirmBtn.style.marginLeft = '5%';
    comfirmBtn.style.marginBottom = '5px';
    comfirmBtn.style.height = '35px';
    comfirmBtn.style.backgroundColor = '#87CEFA';
    comfirmBtn.style.bottom = '0';
    comfirmBtn.style.cursor = 'pointer';
    comfirmBtn.style.borderRadius = '10px';
    comfirmBtn.style.textAlign = 'center';
    comfirmBtn.style.fontSize = '16px';
    comfirmBtn.style.color = 'white';
    comfirmBtn.textContent = '确认完成';
    comfirmBtn.style.userSelect = 'none';
    return comfirmBtn;
  }

  window.onload = function() {
    init()
  }
})();

