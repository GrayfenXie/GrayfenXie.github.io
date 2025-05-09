let currentTabType = ''; // 当前激活的标签页类型

// 页面加载时初始化当前标签页类型
document.addEventListener('DOMContentLoaded', function () {
    const firstTab = document.querySelector('.tab');
    if (firstTab) {
        currentTabType = firstTab.getAttribute('data-tab');
    }
});

// 切换标签页
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTab);
        if (!targetContent) {
            console.error("Target content not found:", targetTab);
            return;
        }

        // 如果点击的是当前激活的标签页，不执行任何操作
        if (targetTab === currentTabType) {
            return;
        }

        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        targetContent.classList.add('active');

        currentTabType = targetTab;
        anime();
    });
});

function anime() {
    const eles = document.getElementsByClassName('image-item');
    const eles2 = document.getElementsByClassName('aissue');
    const eles3 = document.getElementById('my-form');
    const eles4 = document.getElementsByClassName('portfolio-item');
    // 重置动画状态
    function resetStyles(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transform = 'scale(0)';
            elements[i].style.opacity = '0';
        }
    }

    // 触发动画
    function triggerAnimation(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transform = 'scale(1)';
            elements[i].style.opacity = '1';
        }
    }

    resetStyles(eles);
    resetStyles(eles2);
    resetStyles(eles4);
    // eles3.style.transform = 'scale(0)';
    // eles3.style.opacity = '0';

    setTimeout(() => {
        triggerAnimation(eles);
        triggerAnimation(eles2);
        triggerAnimation(eles4);
        // eles3.style.transform = 'scale(1)';
        // eles3.style.opacity = '1';
    }, 10);
}

// 打印机动画
document.addEventListener("DOMContentLoaded", function () {
    const text = "分享作品和日常"; // 要打印的文本
    const sloganElement = document.getElementById("slogen");
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            sloganElement.textContent += text.charAt(index); // 插入当前字符
            index++; // 移动到下一个字符
            setTimeout(typeWriter, 150); // 每个字符的打印间隔
        } else {
            // 打印完成后，开始逐个删除字符
            setTimeout(() => {
                deleteText();
            }, 2000); // 打印完成后等待2秒，然后开始删除
        }
    }

    function deleteText() {
        if (index > 0) {
            sloganElement.textContent = text.substring(0, index - 1); // 删除最后一个字符
            index--; // 移动到上一个字符
            setTimeout(deleteText, 60); // 删除字符的间隔时间
        } else {
            // 删除完成后，重新开始打印
            setTimeout(() => {
                typeWriter(); // 重新开始打印
            }, 1000); // 删除完成后等待1秒，然后重新开始
        }
    }

    setTimeout(() => {
        typeWriter();
    }, 500); // 启动动画
});

// 防抖函数
function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

//模式切换
var flag = true;
var bgImage1 = 'url("img/sun.svg")'; // 注意路径是相对于HTML文件的
var bgImage2 = 'url("img/moon.svg")';
var switchbutton = document.getElementById('switch');
switchbutton.addEventListener('click', function () {
  if (flag) {
    document.body.classList.add("night");
    switchbutton.style.backgroundImage = bgImage2;
    flag = false;
  }
  else {
    document.body.classList.remove("night");
    switchbutton.style.backgroundImage = bgImage1;
    flag = true;
  }
});

var Messageboard = document.getElementById("message-board");
var messageboxbutton = document.getElementById("messageboxbutton");
var flag2 = true;
messageboxbutton.onclick = function () {
  messagemodal.style.display = "block";
  setTimeout(() => {
    messagemodal.style.opacity = 1;
  }, 100);
  // 记录当前滚动位置
  originalScrollPosition = window.scrollY || document.documentElement.scrollTop;
  // 添加禁止滚动的类
  document.body.classList.add('no-scroll');
  // 将页面滚动位置设置为之前记录的位置，以避免页面跳转
  document.body.style.position = 'fixed';
  document.body.style.top = -originalScrollPosition + 'px';
  flag2 = true;
}

//关闭留言板
// 获取 <span> 元素，设置关闭模态框按钮
var span = document.getElementsByClassName("close2")[0];
var messagemodal = document.getElementById("message-content");
// 点击 <span> 元素上的 (x), 关闭模态框
span.onclick = function () {
  messagemodal.style.opacity = 0;
  setTimeout(() => {
    messagemodal.style.display = "none";
    // 移除禁止滚动的类
    document.body.classList.remove('no-scroll');
    // 恢复body的默认样式
    document.body.style.position = '';
    document.body.style.top = '';
    // 恢复原始滚动位置
    window.scrollTo(0, originalScrollPosition);
  }, "100");
  document.body.classList.remove('no-scroll');
  flag2 = false;
}