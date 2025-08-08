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
// 获取真实评论数
async function fetchCommentCount(issueId) {
    try {
        const res = await fetch(
            `https://waline.grayfen.cn/comment?path=/issues/${issueId}`
        );
        const data = await res.json();
        return Array.isArray(data) ? data.length : 0;
    } catch {
        return 0;
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
            <span class="comment-count" data-issue-id="${issue.id}">0</span>
        </button>
    </div>
    <div class="waline-container" data-issue-id="${issue.id}" style="display: none;"></div>
`;

        li.classList.add("aissue");
        issueList.appendChild(li);

        // 获取并设置评论数
        fetchCommentCount(issue.id).then(count => {
            const countEl = li.querySelector(`.comment-count[data-issue-id="${issue.id}"]`);
            if (countEl) {
                countEl.textContent = count;
            }
        });

        // 添加点击事件监听
        const toggleBtn = li.querySelector('.comment-toggle');
        const walineContainer = li.querySelector('.waline-container');

        toggleBtn.addEventListener('click', function () {
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
}

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