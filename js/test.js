const guitarlist = document.getElementById('guitar-list');
const bodyHTML = 'https://cdn.grayfen.cn/%E4%BA%BA%E9%97%B4%E7%99%BD%E9%A6%96.mp4';
const li = document.createElement('li');
li.innerHTML = `
            <video class="videoplayer" controlsList="nodownload" disablePictureInPicture controls muted>
                <source src="${bodyHTML}" type="video/mp4">
                您的浏览器不支持 HTML5 视频播放。
            </video>
        `;
        li.classList.add("guitar-item");
        guitarlist.appendChild(li); // 将新内容追加到列表中