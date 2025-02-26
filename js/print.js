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
    },500);// 启动动画
});