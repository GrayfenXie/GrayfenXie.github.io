// 将全局变量挂载到 window 对象上，避免重复声明
window.cachedIssues = []; // 缓存所有 Issue 数据
window.currentPage = 1; // 当前页码
window.perPage = 10; // 每页显示 10 条
window.isLoading = false; // 防止重复加载

async function loadAllIssues() {
    if (window.isLoading) return;
    window.isLoading = true;
    try {
        await fetchAllCommentsOnce();
        renderIssues(1, window.perPage);
        document.getElementById('allpic2').innerText = window.cachedIssues.length;
    } catch (e) {
        console.error(e);
        document.getElementById('issue-list').innerHTML =
            '<li class=failtoload>加载失败，请稍后再试</li>';
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
        issueList.innerHTML = '';
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
    <div class="issue-footer">
        <div class="issue-date">${formattedDate}</div>
        <button class="comment-toggle" data-issue-id="${issue.id}" title="显示/隐藏评论">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="comment-count" data-issue-id="${issue.id}">...</span>
        </button>
    </div>
    <div class="waline-container" data-issue-id="${issue.id}" style="display: none;"></div>
`;
        
        li.classList.add("aissue");
        issueList.appendChild(li);

        // 添加点击事件监听
        const toggleBtn = li.querySelector('.comment-toggle');
        const walineContainer = li.querySelector('.waline-container');
        
        toggleBtn.addEventListener('click', function() {
            const isVisible = walineContainer.style.display !== 'none';
            
            if (isVisible) {
                // 隐藏评论区
                walineContainer.style.display = 'none';
            } else {
                // 显示评论区
                walineContainer.style.display = 'block';
                
                // 如果还没初始化 Waline，就初始化
                if (!walineContainer.hasAttribute('data-waline-inited')) {
                    Waline.init({
                        el: walineContainer,
                        serverURL: 'https://waline.grayfen.cn/',
                        emoji: [
                            '//unpkg.com/@waline/emojis@1.2.0/weibo',
                            '//unpkg.com/@waline/emojis@1.2.0/bmoji',
                        ],
                        path: `/issues/${issue.id}`,
                        components: {
                            VInfo: ({ nick }) => h('span', { class: 'wl-nick' }, nick),
                            MarkdownGuide: () => null,
                        },
                        lang: 'zh-CN',
                        dark: 'html[class="night"]',
                        search: false,
                        login: 'disable',
                        imageUploader: false,
                        highlighter: false,
                        meta: ['nick', 'mail']
                    });
                    
                    walineContainer.setAttribute('data-waline-inited', '1');
                }
            }
        });

        // 计算当前显示的条目数
        const visibleIssues = start + pageIssues.length;
        document.getElementById('loadpic2').innerText = visibleIssues;
        anime();
    });

    // 更新"加载更多"按钮状态
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
    // 获取真实评论数
async function fetchCommentCount(issueId) {
    try {
        const res = await fetch(`https://waline.grayfen.cn/comment?type=count&path=/issues/${issueId}`);
        const data = await res.json();
        return data || 0;
    } catch {
        return 0;
    }
}

// 为每条 issue 获取评论数并更新 DOM
pageIssues.forEach(async issue => {
    const li = document.createElement('li');
    const date = new Date(issue.created_at);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const options = { gfm: true, breaks: true, smartLists: true };
    const bodyHTML = marked(issue.body || '', options);

    li.innerHTML = `
        <div class="issue-body">${bodyHTML}</div>
        <div class="issue-footer">
            <div class="issue-date">${formattedDate}</div>
            <button class="comment-toggle" data-issue-id="${issue.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="comment-count" data-issue-id="${issue.id}">...</span>
            </button>
        </div>
        <div class="waline-container" data-issue-id="${issue.id}" style="display: none;"></div>
    `;

    li.classList.add("aissue");
    issueList.appendChild(li);

    // ✅ 拿到真实评论数
    try {
        const res = await fetch(`https://waline.grayfen.cn/comment?type=count&path=/issues/${issue.id}`);
        const count = (await res.json()) || 0;
        li.querySelector(`.comment-count[data-issue-id="${issue.id}"]`).textContent = count;
    } catch {
        li.querySelector(`.comment-count[data-issue-id="${issue.id}"]`).textContent = '0';
    }
});
}
// function renderIssues(page, perPage, isAppend = false) {
//     const issueList = document.getElementById('issue-list');
//     const start = (page - 1) * perPage;
//     const end = start + perPage;
//     const pageIssues = window.cachedIssues.slice(start, end);
//     if (!isAppend) {
//         issueList.innerHTML = ''; // 如果不是追加内容，则清空现有列表
//     }
//     pageIssues.forEach(issue => {
//         const li = document.createElement('li');
//         const date = new Date(issue.created_at);
//         const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//         const options = {
//             gfm: true,
//             breaks: true,
//             smartLists: true,
//         };
//         const bodyHTML = marked(issue.body || '', options);
//         // li.innerHTML = `
//         //     <div class="issue-body">${bodyHTML}</div>
//         //     <div class="issue-date">${formattedDate}</div>
//         // `;
//         li.innerHTML = `
//             <div class="issue-body">${bodyHTML}</div>
//             <div class="issue-date">${formattedDate}</div>
//             <div class="waline-container" data-issue-id="${issue.id}"></div>
//         `;
//         li.classList.add("aissue");
//         issueList.appendChild(li); // 将新内容追加到列表中

//         // 计算当前显示的条目数
//         const visibleIssues = start + pageIssues.length;
//         document.getElementById('loadpic2').innerText = visibleIssues;
//         anime();
//     });

//     // 更新“加载更多”按钮状态
//     const moreButton = document.getElementById('more2');
//     if (start + perPage >= window.cachedIssues.length) {
//         moreButton.innerText = '加载到底部啦~';
//         moreButton.style.cursor = 'unset';
//         moreButton.style.pointerEvents = "none";
//     } else {
//         moreButton.innerText = '滚动加载更多...';
//         moreButton.style.cursor = 'pointer';
//         moreButton.style.pointerEvents = "auto";
//     }

//     // 渲染完当前页后
// pageIssues.forEach(issue => {
//   const container = document.querySelector(`.waline-container[data-issue-id="${issue.id}"]`);
//   if (!container || container.hasAttribute('data-waline-inited')) return; // 避免重复
//   Waline.init({
//     el: container,
//     serverURL: 'https://waline.grayfen.cn/',
//     emoji: [
//       '//unpkg.com/@waline/emojis@1.2.0/weibo',
//       '//unpkg.com/@waline/emojis@1.2.0/bmoji',
//     ],
//     path: `/issues/${issue.id}`, // 关键：每条 Issue 的唯一路径
//     components: {
//     // 把用户名的 <a> 换成 <span>
//     VInfo: ({ nick }) => h('span', { class: 'wl-nick' }, nick),
//     MarkdownGuide: () => null, // 隐藏 Markdown 指南
//   },
//     lang: 'zh-CN',
//     dark: 'html[class="night"]', // 支持夜间模式
//     search: false,
//     login: 'disable',
//     imageUploader: false,   // 禁用前端上传按钮
//     highlighter: false,      // 顺带关掉代码高亮上传（可选）
//     // 隐藏网址输入框
//     meta: ['nick', 'mail'] // 只保留昵称、邮箱，去掉 url
//   });
//   container.setAttribute('data-waline-inited', '1');
// });
// }

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