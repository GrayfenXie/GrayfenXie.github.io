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
let currentPage = 1;
const perPage = 10; // 每页加载10条评论
let maxlength = 0;

async function loadissues(page) {
    try {
        // 替换为你的GitHub用户名、仓库名称和Issue编号
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?per_page=${perPage}&page=${page}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        const issues = await response.json();
        const response2 = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`);
        const issues2 = await response2.json();
        allpic2.innerHTML = issues2[0].comments;

        maxlength = maxlength + issues.length
        loadpic2.innerHTML = maxlength;

        const issueList = document.getElementById('issue-list');

        issues.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // 遍历评论数组，动态生成HTML内容
        issues.forEach(issue => {
            const li = document.createElement('li');
            const date = new Date(issue.created_at); // 解析时间戳
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`; // 格式化日期和时间
            // 使用marked.js将Markdown转换为HTML
            const bodyHTML = marked(issue.body);
            li.innerHTML = `
                    <div class="issue-body">${bodyHTML}</div>
                    <div class="issue-date">${formattedDate}</div>
                `;
            issueList.appendChild(li);
        });
        if (issues.length < perPage) {
            setTimeout(() => {
                document.getElementById('more2').innerHTML = '加载到底部啦~';
                document.getElementById('more2').style.cursor = 'unset';
            }, "300")
        }
    }

    catch (error) {
        console.error('Failed to load issues:', error);
        document.getElementById('issue-list').innerHTML = '<li>加载评论失败，请稍后再试。</li>';
    }
}

// 调用函数加载评论
loadissues(currentPage);

// 检查是否滚动到底部并加载更多图片
function checkScrollPosition() {
    const nearBottomThreshold = 2; // 当距离底部2px时开始加载
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - nearBottomThreshold &&
        loadedImages < imagesData.length) {
        currentPage++;
        loadissues(currentPage);
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
document.addEventListener("scroll", (event) => {
    debouncedCheckScrollPosition2();
});

// 添加“加载更多”按钮的事件监听
document.getElementById('more2').addEventListener('click', () => {
    currentPage++;
    loadissues(currentPage);
});