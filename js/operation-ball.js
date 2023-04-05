/* 悬浮小球交互脚本 */  
(function () {
  let ballDom = {
    textArea: '',
    speechBtn: ''
  }

  let disabledComfirm = false
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

    function checkDisabledComfirm(){
      if(!textArea.value || disabledComfirm){
        comfirmBtn.disabled = true
      } else {
        comfirmBtn.disabled = false
      }
    }

    textArea.addEventListener('input', () => {
      checkDisabledComfirm()
    })

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
      if(e.isTrusted){
        if (isMobile) {
          x = e.changedTouches[0].clientX - popupWidth / 2;
          y = e.changedTouches[0].clientY - popupHeight / 2;
        } else {
          x = e.clientX - popupWidth / 2;
          y = e.clientY - popupHeight / 2;
        }
      }

      var top = y + popupHeight / 2 - ballRadius / 2;
      var left = x + popupWidth / 2 - ballRadius / 2;
      if(!x && !y){
        top = popup.style.top - ballRadius / 2;
        left = popup.style.left - ballRadius / 2;
      }

      ball.style.top = top + 'px';
      ball.style.left = left + 'px';

      ball.style.transform = 'scale(0)';
      setTimeout(function () {
        ball.style.transform = 'scale(1)';
      }, 0);

      textArea.value = '';
    }, { passive: false });

    // 当确认按钮被点击
    comfirmBtn.addEventListener( isMobile ? 'touchend' : 'click', function(e) {
      e.stopPropagation();
      // 创建自定义事件
      var speechComfirm = new CustomEvent("speech-comfirm", {
        detail: {
          result: textArea.value
        }
      });

      // 触发自定义事件
      document.dispatchEvent(speechComfirm);
      closeBtn.click();
      closeBtn.touchend();
    }, { passive: false });

    document.body.appendChild(ball);
    document.body.appendChild(popup);

    return {
      textArea,
      speechBtn,
      isMobile,
      checkDisabledComfirm
    }
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
    textArea.style.padding = '5px';
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
    comfirmBtn.textContent = '发送结果';
    comfirmBtn.style.userSelect = 'none';
    comfirmBtn.disabled = true
    return comfirmBtn;
  }

  /////////////////////////////////////////////////////////////////// 巨大的分割线 ///////////////////////////////////////////////////////////////////
  /** 获取签名 start */
  function toUint8Array(wordArray) {
    // Shortcuts
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;

    // Convert
    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return u8;
  }
  function Uint8ArrayToString(fileData){
    let dataString = '';
    for (let i = 0; i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i]);
    }
    return dataString;
  }
  // 签名函数示例
  function signCallback(signStr) {
    const secretKey = config.secretKey;
    const hash = window.CryptoJSTest.HmacSHA1(signStr, secretKey);
    const bytes = Uint8ArrayToString(toUint8Array(hash));
    return window.btoa(bytes);
  }
  /** 获取签名 end */

  /** 语音识别代码 start */
  let config = {
    secretKey: '67xYtyoZ6NQGrEWdXCcomZ8ScWAXlZWD',
    secretId: 'AKIDeEhvugQ9iV5OQCj38yYsysWw85mCOt9L',
    appId: 1312578295,
  }

  const params = {
    signCallback: signCallback, // 鉴权函数
    // 用户参数
    secretid:  config.secretId,
    appid: config.appId,
    // 实时识别接口参数
    engine_model_type : '16k_zh', // 因为内置WebRecorder采样16k的数据，所以参数 engineModelType 需要选择16k的引擎，为 '16k_zh'
    // 以下为非必填参数，可跟据业务自行修改
    voice_format : 1,
    hotword_id : '08003a00000000000000000000000000',
    needvad: 1,
    filter_dirty: 1,
    filter_modal: 2,
    filter_punc: 0,
    convert_num_mode : 1,
    word_info: 2
  }

  let webAudioSpeechRecognizer;
  let isCanStop;
  let resultText = '';
  function createWebAudioSpeechRecognizer(){
    webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params);
    
    // 开始识别
    webAudioSpeechRecognizer.OnRecognitionStart = (res) => {
      // console.log('OnRecognitionStart->开始识别', res);
      isCanStop = true;
      ballDom.speechBtn.textContent = '请说话...'
    };
    // 一句话开始
    webAudioSpeechRecognizer.OnSentenceBegin = (res) => {
      // console.log('OnSentenceBegin->一句话开始', res);
      // isCanStop = true;
      // ballDom.speechBtn.textContent = '请说话...'
    };
    // 识别变化时
    webAudioSpeechRecognizer.OnRecognitionResultChange = (res) => {
      // console.log('OnRecognitionResultChange->识别变化时', res);
      ballDom.textArea.value = `${resultText}${res.result.voice_text_str}`;
    };
    // 一句话结束
    webAudioSpeechRecognizer.OnSentenceEnd = (res) => {
      // console.log('OnSentenceEnd->一句话结束', res);
      resultText += res.result.voice_text_str;
      ballDom.textArea.value = resultText;
    };
    // 识别结束
    webAudioSpeechRecognizer.OnRecognitionComplete = (res) => {
      // console.log('OnRecognitionComplete->识别结束', res);
      ballDom.speechBtn.textContent = '语音识别'
      disabledComfirm = false
      ballDom.checkDisabledComfirm()
    };
    // 识别错误
    webAudioSpeechRecognizer.OnError = (res) => {
      // console.error('OnError->识别失败', res)
      ballDom.speechBtn.textContent = '语音识别'
      alert('识别失败:' + JSON.stringify(res))
    };
  }
  /** 语音识别代码 end */

  window.onload = function() {
    ballDom = init()
    
    ballDom.speechBtn.addEventListener( ballDom.isMobile ? 'touchend' : 'click', function () {
      if (isCanStop) {
        webAudioSpeechRecognizer.stop();
      } else {
        ballDom.speechBtn.textContent = '链接中...'
        disabledComfirm = true
        ballDom.checkDisabledComfirm()
        webAudioSpeechRecognizer.start();
      }
    });

    createWebAudioSpeechRecognizer()
  }
})();

