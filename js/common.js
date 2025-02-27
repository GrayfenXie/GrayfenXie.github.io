let currentTabType = ''; // 当前激活的标签页类型

// 切换标签页
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTab);
        if (!targetContent) {
            console.error("Target content not found:", targetTab);
            return;
        }

        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        targetContent.classList.add('active');

        currentTabType = targetTab;
        if (currentTabType === 'issue-content') {
            // 如果缓存中有数据，直接渲染第一页
            if (window.cachedIssues && window.cachedIssues.length > 0) {
                renderIssues(1, window.perPage);
            }
        }
        anime();
    });
});

function anime() {
    const eles = document.getElementsByClassName('image-item');
    const eles2 = document.getElementsByClassName('aissue');

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

    setTimeout(() => {
        triggerAnimation(eles);
        triggerAnimation(eles2);
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