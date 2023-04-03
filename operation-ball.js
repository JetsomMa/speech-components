window.onload = function() {
  // 创建小球元素
  var ball = document.createElement('div');
  ball.style.width = '70px';
  ball.style.height = '70px';
  ball.style.backgroundColor = '#87CEFA';
  ball.style.position = 'fixed';
  ball.style.zIndex = '99998';
  ball.style.borderRadius = '50%';
  ball.style.cursor = 'move';
  document.body.appendChild(ball);

  // 记录小球位置
  var ballX, ballY;
  ballX = parseInt(ball.style.left);
  ballY = parseInt(ball.style.top);

  // 拖动小球
  var isDragging = false;
  var startX, startY, deltaX, deltaY;
  ball.addEventListener('touchstart', function(e) {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    deltaX = 0;
    deltaY = 0;
  });
  document.addEventListener('touchmove', function(e) {
    if (isDragging) {
      deltaX = e.touches[0].clientX - startX;
      deltaY = e.touches[0].clientY - startY;
      ball.style.top = parseInt(ball.style.top) + deltaY + 'px';
      ball.style.left = parseInt(ball.style.left) + deltaX + 'px';
    }
  });
  document.addEventListener('touchend', function(e) {
    isDragging = false;
    ballX = parseInt(ball.style.left);
    ballY = parseInt(ball.style.top);
  });

  // 点击小球展示弹窗
  ball.addEventListener('click', function() {
    ball.style.display = 'none';

    // 创建弹窗元素
    var popup = document.createElement('div');
    popup.style.width = '300px';
    popup.style.height = '200px';
    popup.style.backgroundColor = 'white';
    popup.style.position = 'fixed';
    popup.style.zIndex = '99999';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(popup);

    // 创建关闭按钮
    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '20px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    popup.appendChild(closeButton);

    // 关闭弹窗
    closeButton.addEventListener('click', function() {
      popup.style.display = 'none';
      ball.style.display = 'block';
      ball.style.transition = 'all 1s ease-in-out';
      ball.style.top = ballY + 'px';
      ball.style.left = ballX + 'px';
    });

    // 创建文本域和按钮
    var textarea = document.createElement('textarea');
    textarea.id = 'speechInput';
    textarea.style.width = '80%';
    textarea.style.height = '60%';
    textarea.style.margin = '20px auto';
    textarea.style.display = 'block';
    popup.appendChild(textarea);

    var startButton = document.createElement('button');
    startButton.id = 'speechInputStart';
    startButton.innerHTML = '开始录音';
    startButton.style.width = '100px';
    startButton.style.height = '30px';
    startButton.style.margin = '20px auto';
    startButton.style.display = 'block';
    popup.appendChild(startButton);
  });

  // 自适应手机端
  window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
      ball.style.width = '50px';
      ball.style.height = '50px';
      ball.style.fontSize = '16px';
    } else {
      ball.style.width = '70px';
      ball.style.height = '70px';
      ball.style.fontSize = '18px';
    }
  });

  // 优化弹窗样式
  var style = document.createElement('style');
  style.innerHTML = `
    #speechInput {
      border: none;
      outline: none;
      resize: none;
      font-size: 16px;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 5px;
      box-shadow:0 0 5px rgba(0, 0, 0, 0.3);
    }
    #speechInputStart {
      border: none;
      outline: none;
      background-color: #87CEFA;
      color: white;
      font-size: 16px;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
    #speechInputStart:hover {
      background-color: #6495ED;
    }
    `;
  document.head.appendChild(style);
};
    
    