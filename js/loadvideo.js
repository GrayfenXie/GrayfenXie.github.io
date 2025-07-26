// 将全局变量挂载到 window 对象上，避免重复声明
window.cachedIssues2 = []; // 缓存所有 Issue 数据
window.currentPage2 = 1; // 当前页码
window.perPage2 = 10; // 每页显示 10 条
window.isLoading2 = false; // 防止重复加载

async function loadAllGuitar() {
    if (window.isLoading2) return;
    window.isLoading2 = true;
    try {
        const response2 = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/6/comments?per_page=100&sort=created`);
        if (!response2.ok) {
            throw new Error(`Failed to fetch issues: ${response2.statusText}`);
        }
        const videos = await response2.json();
        const myVideos = videos.filter(comment => comment.user.login === myUsername);
        window.cachedIssues2 = myVideos.reverse(); // 缓存所有 Issue 数据
        renderIssues2(1, window.perPage2); // 渲染第一页
        document.getElementById('allpic2').innerHTML = myVideos.length;
    } catch (error) {
        console.error('Failed to load issues:', error);
        document.getElementById('guitar-list').innerHTML = "<li class=failtoload>加载失败，请稍后再试</li>";
    } finally {
        window.isLoading2 = false;
    }
}

function renderIssues2(page, perPage2, isAppend = false) {
    const guitarList = document.getElementById('guitar-list');
    const start2 = (page - 1) * perPage2;
    const end2 = start2 + perPage2;
    const pageIssues = window.cachedIssues2.slice(start2, end2);
    if (!isAppend) {
        guitarList.innerHTML = ''; // 如果不是追加内容，则清空现有列表
    }
    pageIssues.forEach(guitar => {
        const li2 = document.createElement('li');
        const date = new Date(guitar.created_at);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        const options = {
            gfm: true,
            breaks: true,
            smartLists: true,
        };
        const guitarlist = document.getElementById('guitar-list');
        const bodyHTML = marked(guitar.body || '', options);
        const match = bodyHTML.match(/https:\/\/cdn\.grayfen\.cn\/[^"'>\s]+/i);
        if (!match) {
            console.warn('没有在 Issue 里找到七牛直链');
            return;
        }
        const videoSrc = decodeURIComponent(match[0]); 
        li2.innerHTML = `
            <video class="videoplayer" controlsList="nodownload" disablePictureInPicture controls muted
                poster="${videoSrc}?vframe/jpg/offset/1/w/1200/h/675">
                <source src="${videoSrc}" type="video/mp4">
                您的浏览器不支持 HTML5 视频播放。
            </video>
        `;
        li2.classList.add("guitar-item");
        guitarlist.appendChild(li2); // 将新内容追加到列表中

        // 计算当前显示的条目数
        const visibleIssues = start2 + pageIssues.length;
        document.getElementById('loadpic2').innerText = visibleIssues;
        anime();
    });
    const moreButton2 = document.getElementById('more3');
    if (start2 + perPage2 >= window.cachedIssues2.length) {
        moreButton2.innerText = '加载到底部啦~';
        moreButton2.style.cursor = 'unset';
        moreButton2.style.pointerEvents = "none";
    } else {
        moreButton2.innerText = '滚动加载更多...';
        moreButton2.style.cursor = 'pointer';
        moreButton2.style.pointerEvents = "auto";
    }
}

// 检查是否滚动到底部并加载更多
let isFetching2 = false;
function checkScrollPosition() {
    const nearBottomThreshold = 2; // 当距离底部2px时开始加载
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - nearBottomThreshold &&
        !isFetching2) {
        isFetching2 = true; // 设置标志变量
        window.currentPage++;
        renderIssues2(window.currentPage, window.perPage, true); // 追加内容
        isFetching2 = false; // 加载完成后重置标志变量
    }
}

// 创建防抖后的滚动事件处理函数
const debouncedCheckScrollPosition3 = debounce(checkScrollPosition, 200); // 200ms内最多执行一次

// 监听滚动事件
document.addEventListener("scroll", (event) => {
    if (currentTabType == "issue-content") {
        debouncedCheckScrollPosition3();
    }
});

// 添加“加载更多”按钮的事件监听
document.getElementById('more3').addEventListener('click', () => {
    window.currentPage++;
    window.currentIssuePage = window.currentPage; // 更新当前页码
    renderIssues2(window.currentPage, window.perPage, true); // 追加内容
});

// 在页面加载时加载所有 Issue 数据
document.addEventListener('DOMContentLoaded', () => {
    loadAllGuitar();
});