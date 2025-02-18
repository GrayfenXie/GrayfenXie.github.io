// 切换标签页
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        console.log("Target Tab:", targetTab); // 调试信息

        // 确保目标内容区域存在
        const targetContent = document.getElementById(targetTab);
        if (!targetContent) {
            console.error("Target content not found:", targetTab);
            return;
        }

        // 移除所有标签和内容的active类
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // 添加active类到当前标签和内容
        tab.classList.add('active');
        targetContent.classList.add('active');
    });
});
const owner = "GrayfenXie";
const repo = "GrayfenXie.github.io";
const issueNumber = "2"; // 替换为目标Issue的编号
let maxlength = 0;
let currentPage = 1; // 当前加载的页码
const perPage = 10; // 每页加载10条评论
let totalComments = 0; // 总评论数

async function loadissues(page, perPage) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=${perPage}&page=${page}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        const issues = await response.json();

        // 获取评论列表容器
        const issueList = document.getElementById('issue-list');

        // 如果是第一页，清空现有列表
        if (page === 1) {
            issueList.innerHTML = '';
        }

        // 将新加载的评论倒序插入到列表顶部
        issues.forEach(issue => {
            const li = document.createElement('li');
            const date = new Date(issue.created_at);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            const bodyHTML = marked(issue.body || ''); // 确保 issue.body 是字符串
            li.innerHTML = `
                <div class="issue-body">${bodyHTML}</div>
                <div class="issue-date">${formattedDate}</div>
            `;
            issueList.insertBefore(li, issueList.firstChild); // 插入到列表顶部
        });

        // 更新加载状态
        totalComments += issues.length;
        document.getElementById('loadpic2').innerText = totalComments;

        // 如果加载的评论少于 perPage，说明已经加载完所有评论
        if (issues.length < perPage) {
            document.getElementById('more2').innerText = '已经到底啦~';
            document.getElementById('more2').style.cursor = 'default';
        }
    } catch (error) {
        console.error('Failed to load issues:', error);
        document.getElementById('issue-list').innerHTML = '<li>加载评论失败，请稍后再试。</li>';
    }
}


// 初始化加载第一页评论
document.addEventListener('DOMContentLoaded', () => {
    loadissues(currentPage, perPage);
});

// 滚动加载更多评论
function checkScrollPosition() {
    const nearBottomThreshold = 2; // 当距离底部2px时开始加载
    if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - nearBottomThreshold
    ) {
        currentPage++;
        loadissues(currentPage, perPage);
    }
}

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

// 创建防抖后的滚动事件处理函数
const debouncedCheckScrollPosition2 = debounce(checkScrollPosition, 200); // 200ms内最多执行一次

// 监听滚动事件
document.addEventListener('scroll', debouncedCheckScrollPosition2);

// 点击加载更多按钮
document.getElementById('more2').addEventListener('click', () => {
    currentPage++;
    loadissues(currentPage, perPage);
});