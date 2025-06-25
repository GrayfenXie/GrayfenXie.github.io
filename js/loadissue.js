// 将全局变量挂载到 window 对象上，避免重复声明
window.cachedIssues = []; // 缓存所有 Issue 数据
window.currentPage = 1; // 当前页码
window.perPage = 10; // 每页显示 10 条
window.isLoading = false; // 防止重复加载
const owner = "GrayfenXie";
const repo = "GrayfenXie.github.io";
const myUsername = "GrayfenXie";

async function loadAllIssues() {
    if (window.isLoading) return;
    window.isLoading = true;
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/comments?per_page=100&sort=created&direction=desc`);
        if (!response.ok) {
            throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        const comments = await response.json();
        const myComments = comments.filter(comment => comment.user.login === myUsername);
        window.cachedIssues = myComments; // 缓存所有 Issue 数据
        renderIssues(1, window.perPage); // 渲染第一页
        document.getElementById('allpic2').innerHTML = myComments.length;
    } catch (error) {
        console.error('Failed to load issues:', error);
        document.getElementById('issue-list').innerHTML = "<li class=failtoload>加载失败，请稍后再试</li>";
    } finally {
        window.isLoading = false;
    }
}

function renderIssues(page, perPage, isAppend = false) {
    const issueList = document.getElementById('issue-list');
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pageIssues = window.cachedIssues.slice(start, end);
    if (!isAppend) {
        issueList.innerHTML = ''; // 如果不是追加内容，则清空现有列表
    }
    pageIssues.forEach(issue => {
        const li = document.createElement('li');
        const date = new Date(issue.created_at);
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        const options = {
            gfm: true,
            breaks: true,
            smartLists: true,
        };
        const bodyHTML = marked(issue.body || '', options);
        li.innerHTML = `
            <div class="issue-body">${bodyHTML}</div>
            <div class="issue-date">${formattedDate}</div>
        `;
        li.classList.add("aissue");
        issueList.appendChild(li); // 将新内容追加到列表中

        // 计算当前显示的条目数
        const visibleIssues = start + pageIssues.length;
        document.getElementById('loadpic2').innerText = visibleIssues;
        anime();
    });

    // 更新“加载更多”按钮状态
    const moreButton = document.getElementById('more2');
    if (start + perPage >= window.cachedIssues.length) {
        moreButton.innerText = '加载到底部啦~';
        moreButton.style.cursor = 'unset';
        moreButton.style.pointerEvents = "none";
    } else {
        moreButton.innerText = '滚动加载更多...';
        moreButton.style.cursor = 'pointer';
        moreButton.style.pointerEvents = "auto";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById("img01");
    const span = document.getElementsByClassName("close")[0];
    var originalScrollPosition = 0; // 用于存储原始滚动位置
    // 定义打开模态框的函数
    function opens(img) {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt;

        // 记录当前滚动位置
        originalScrollPosition = window.scrollY || document.documentElement.scrollTop;
        // 添加禁止滚动的类
        document.body.classList.add('no-scroll');
        // 将页面滚动位置设置为之前记录的位置，以避免页面跳转
        document.body.style.position = 'fixed';
        document.body.style.top = -originalScrollPosition + 'px';
        setTimeout(() => {
            modalImg.style.opacity = 1;
        }, 100);
    }

    // 获取 <span> 元素，设置关闭模态框按钮
    span.onclick = function () {
  modalImg.style.opacity = 0;
  setTimeout(() => {
    modal.style.display = "none";
    // 移除禁止滚动的类
    document.body.classList.remove('no-scroll');
    // 恢复body的默认样式
    document.body.style.position = '';
    document.body.style.top = '';
    // 恢复原始滚动位置
    window.scrollTo(0, originalScrollPosition);
  }, "100");
  document.body.classList.remove('no-scroll');
  for (var i = a.length - 1; i >= 0; i--) {
    b[i].style.cursor = "zoom-in";
    a[i].classList.remove('big');
  }
}

    // 使用事件委托处理动态加载的图片点击事件
    document.getElementById('issue-list').addEventListener('click', function (event) {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'img') {
            opens(target);
        }
    });
});

// 检查是否滚动到底部并加载更多
let isFetching = false;
function checkScrollPosition() {
    const nearBottomThreshold = 2; // 当距离底部2px时开始加载
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - nearBottomThreshold &&
        !isFetching) {
        isFetching = true; // 设置标志变量
        window.currentPage++;
        renderIssues(window.currentPage, window.perPage, true); // 追加内容
        isFetching = false; // 加载完成后重置标志变量
    }
}

// 创建防抖后的滚动事件处理函数
const debouncedCheckScrollPosition2 = debounce(checkScrollPosition, 200); // 200ms内最多执行一次

// 监听滚动事件
document.addEventListener("scroll", (event) => {
    if (currentTabType == "issue-content") {
        debouncedCheckScrollPosition2();
    }
});

// 添加“加载更多”按钮的事件监听
document.getElementById('more2').addEventListener('click', () => {
    window.currentPage++;
    window.currentIssuePage = window.currentPage; // 更新当前页码
    renderIssues(window.currentPage, window.perPage, true); // 追加内容
});

// 在页面加载时加载所有 Issue 数据
document.addEventListener('DOMContentLoaded', () => {
    loadAllIssues();
});