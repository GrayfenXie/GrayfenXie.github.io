// 全局变量，用于缓存 Issue 数据
let cachedIssues = [];
let isLoading = false; // 防止重复加载
// 切换标签页
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTab);
        if (!targetContent) {
            console.error("Target content not found:", targetTab);
            return;
        }
    
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
        tab.classList.add('active');
        targetContent.classList.add('active');
    
        // 如果缓存中有数据，直接渲染
        if (cachedIssues.length > 0) {
            renderIssues(cachedIssues);
        } else {
            // 如果缓存为空，加载数据
            loadissues(currentPage, perPage);
        }
    
        anime();
    });
});

function anime() {
    const eles = document.getElementsByClassName('image-item');
    const eles2 = document.getElementsByClassName('aissue');

    // 重置动画状态
    function resetStyles(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transform = 'scale(0)';
            elements[i].style.opacity = '0';
        }
    }

    // 触发动画
    function triggerAnimation(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transform = 'scale(1)';
            elements[i].style.opacity = '1';
        }
    }

    resetStyles(eles);
    resetStyles(eles2);

    setTimeout(() => {
        triggerAnimation(eles);
        triggerAnimation(eles2);
    }, 10);
}

const owner = "GrayfenXie";
const repo = "GrayfenXie.github.io";
let maxlength = 0;
let currentPage = 1; // 当前加载的页码
const perPage = 10; // 每页加载10条评论
let totalComments = 0; // 总评论数

async function loadissues(page, perPage) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/comments?per_page=${perPage}&page=${page}&sort=created&direction=desc.`);
        if (!response.ok) {
            throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        const issues = await response.json();

        // 如果加载的数据为空，直接返回
        if (issues.length === 0) {
            console.warn("No more issues to load.");
            return;
        }

        // 获取评论列表容器
        const response2 = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`);       
        const issues2 = await response2.json();
        allpic2.innerHTML = issues2[0].comments;
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
            issueList.appendChild(li);
        });
        
        // 缓存 Issue 数据
        cachedIssues = issues;

        // 渲染 Issue 数据
        renderIssues(issues);

        // 更新加载状态
        totalComments += issues.length;
        document.getElementById('loadpic2').innerText = totalComments;
        // 如果加载的评论少于 perPage，说明已经加载完所有评论
        if (issues.length < perPage) {
            document.getElementById('more2').innerText = '加载到底部啦~';
            document.getElementById('more2').style.cursor = 'unset';
            document.getElementById('more2').style.pointerEvents = "none";
        }
    } catch (error) {
        console.error('Failed to load issues:', error);
        document.getElementById('issue-list').innerHTML = '<li>加载随笔失败，请稍后再试。</li>';
    }
}

function renderIssues(issues) {
    const issueList = document.getElementById('issue-list');
    issueList.innerHTML = ''; // 清空现有列表

    issues.forEach(issue => {
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
        issueList.appendChild(li);
    });
}


// 调用函数加载评论
loadissues(currentPage, perPage);

// 检查是否滚动到底部并加载更多图片
let isFetching = false;

function checkScrollPosition() {
    const nearBottomThreshold = 2; // 当距离底部2px时开始加载
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - nearBottomThreshold &&
        !isFetching) {
        isFetching = true; // 设置标志变量
        currentPage++;
        loadissues(currentPage, perPage).then(() => {
            isFetching = false; // 加载完成后重置标志变量
        });
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
    loadissues(currentPage, perPage);
});