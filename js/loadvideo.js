// 将全局变量挂载到 window 对象上，避免重复声明
window.cachedIssues2 = []; // 缓存所有 Issue 数据
window.currentPage2 = 1; // 当前页码
window.perPage2 = 10; // 每页显示 10 条
window.isLoading2 = false; // 防止重复加载

async function loadAllGuitar() {
  if (window.isLoading2) return;
  window.isLoading2 = true;
  try {
    await fetchAllCommentsOnce();
    renderIssues2(1, window.perPage2);
    document.getElementById('allpic3').innerText = window.cachedIssues2.length;
  } catch (e) {
    console.error(e);
    document.getElementById('guitar-list').innerHTML =
      '<li class=failtoload>加载失败，请稍后再试</li>';
  } finally {
    window.isLoading2 = false;
  }
}

function renderIssues2(page, perPage2, isAppend = false) {
    const guitarList = document.getElementById('guitar-list');
    const start2 = (page - 1) * perPage2;
    const end2 = start2 + perPage2;
    const pageIssues = window.cachedIssues2.slice(start2, end2);
    if (!isAppend) guitarList.innerHTML = '';

    pageIssues.forEach((guitar, idx) => {
        const li = document.createElement('li');
        const date = new Date(guitar.created_at);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        const bodyHTML = marked(guitar.body || '', { gfm: true, breaks: true });
        const match = bodyHTML.match(/https:\/\/cdn\.grayfen\.cn\/[^"'>\s]+/i);
        if (!match) return;
        const videoSrc = decodeURIComponent(match[0]);

        // 唯一 id，确保多次渲染不冲突
        const vid = `guitar-${guitar.id}-${idx}`;
        li.innerHTML = `
      <video id="${vid}"
             class="video-js vjs-default-skin vjs-loading"
             preload="none"
             poster="${videoSrc}?vframe/jpg/offset/2.5/w/1200/h/675"
             controls
             muted>
        <source src="${videoSrc}" type="video/mp4">
      </video>
    `;
        li.classList.add('guitar-item');
        guitarList.appendChild(li);

        // 延迟初始化，避免闪屏
        setTimeout(() => {
            const player = videojs(vid, {
                controls: true,
                autoplay: false,
                bigPlayButton: true,
                fluid: false,
                aspectRatio: '16:9',   // 直接给它一个比例
                width: '100%',
                height: 'auto',
                controlBar: true
            });
            player.ready(() => {
                player.removeClass('vjs-loading'); // 移除透明锁

                // 播放结束后回到封面
                player.on('ended', () => {
                    player.currentTime(0);
                    player.load();              // 让浏览器重新显示 poster
                    player.posterImage.show();  // Video.js 强制把 poster 放出来
                });
            });
        }, 0);
    });

    // 底部提示
    const moreBtn = document.getElementById('more3');
    if (start2 + perPage2 >= window.cachedIssues2.length) {
        moreBtn.innerText = '加载到底部啦~';
        moreBtn.style.pointerEvents = 'none';
    } else {
        moreBtn.innerText = '滚动加载更多...';
        moreBtn.style.pointerEvents = 'auto';
    }

    document.getElementById('loadpic2').innerText =
        Math.min(start2 + perPage2, window.cachedIssues2.length);
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