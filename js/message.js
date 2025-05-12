var form = document.getElementById("my-form");

async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);
    var myTextarea = document.getElementById('myTextarea').value;
    var messagebox = document.getElementById('messagebox').value;
    if (myTextarea.length == 0 || messagebox.length == 0) {
        status.classList.add("fail-status");    
        status.innerHTML = "内容不能为空"
    }
    else {
        fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok && myTextarea.length != 0) {
                status.classList.add("success-status");
                status.innerHTML = "发送成功";
                form.reset()
                currentChars.textContent = 0;
                setTimeout(() => {
                    status.innerHTML = "";
                }, 3000);
            }
        }).catch(error => {
            status.classList.add("fail-status");
            status.innerHTML = "emmm好像出了点状况"
        });
    }
}
form.addEventListener("submit", handleSubmit)

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('myTextarea');
    const currentChars = document.getElementById('currentChars'); // 当前字数显示
    const remainingChars = document.getElementById('remainingChars'); // 剩余字数显示
    const maxCharacters = 100; // 设置最大字数

    // 使用防抖逻辑延迟处理输入事件
    let debounceTimeout;
    textarea.addEventListener('input', function () {
        clearTimeout(debounceTimeout); // 清除之前的延迟
        debounceTimeout = setTimeout(() => {
            const currentValue = textarea.value; // 获取当前输入内容
            const currentLength = currentValue.length; // 计算当前字符数

            // 如果超过最大字符数，截断内容
            if (currentLength > maxCharacters) {
                textarea.value = currentValue.substring(0, maxCharacters);
            }

            // 更新显示的字符数和剩余字符数
            const updatedLength = textarea.value.length; // 更新后的字符数
            currentChars.textContent = updatedLength; // 显示当前字数
        }, 100); // 延迟100毫秒处理输入事件
    });
});