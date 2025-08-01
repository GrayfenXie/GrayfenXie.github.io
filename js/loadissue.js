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