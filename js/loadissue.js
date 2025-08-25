// 缓存 & 分页
window.cachedIssues   = [];
window.currentPage    = 1;
window.perPage        = 10;
window.isLoading      = false;

// 拉取全部 Issue 数据
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

// 获取某个 issue 的评论数
async function fetchCommentCount(issueId) {
  try {
    const res = await fetch(
      `https://waline.grayfen.cn/comment?path=/issues/${issueId}`
    );
    const data = await res.json();
    return data ? data.count : 0;
  } catch {
    return 0;
  }
}

// 渲染 Issue 列表
function renderIssues(page, perPage, isAppend = false) {
  const issueList = document.getElementById('issue-list');
  const start = (page - 1) * perPage;
  const end   = start + perPage;
  const pageIssues = window.cachedIssues.slice(start, end);

  if (!isAppend) issueList.innerHTML = '';

  pageIssues.forEach(issue => {
    const date = new Date(issue.created_at);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const options = { gfm: true, breaks: true, smartLists: true };
    const bodyHTML = marked(issue.body || '', options);

    const li = document.createElement('li');
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
    li.classList.add('aissue');
    issueList.appendChild(li);

    // 设置评论数
    fetchCommentCount(issue.id).then(count => {
      const countEl = li.querySelector(`.comment-count[data-issue-id="${issue.id}"]`);
      if (countEl) countEl.textContent = count;
    });
  });

  // “加载更多”按钮状态
  const moreButton = document.getElementById('more2');
  if (start + perPage >= window.cachedIssues.length) {
    moreButton.innerText   = '加载到底部啦~';
    moreButton.style.cursor = 'unset';
    moreButton.style.pointerEvents = 'none';
  } else {
    moreButton.innerText   = '滚动加载更多...';
    moreButton.style.cursor = 'pointer';
    moreButton.style.pointerEvents = 'auto';
  }
  document.getElementById('loadpic2').innerText = Math.min(end, window.cachedIssues.length);
}

// ===== 评论区切换事件（事件委托） =====
document.addEventListener('click', e => {
  const btn = e.target.closest('.comment-toggle');
  if (!btn) return;
  const issueId = btn.dataset.issueId;
  const container = btn.closest('li').querySelector(`.waline-container[data-issue-id="${issueId}"]`);
  if (!container) return;

  const isVisible = container.style.display !== 'none';
  if (isVisible) {
    container.style.display = 'none';
  } else {
    // 关闭其它评论区
    document.querySelectorAll('.waline-container').forEach(el => el.style.display = 'none');
    container.style.display = 'block';

    // 首次点击初始化 Waline
    if (!container.hasAttribute('data-waline-inited')) {
      Waline.init({
        el: container,
        serverURL: 'https://waline.grayfen.cn/',
        emoji: [
          '//unpkg.com/@waline/emojis@1.2.0/weibo',
          '//unpkg.com/@waline/emojis@1.2.0/bmoji',
        ],
        path: `/issues/${issueId}`,
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
      container.setAttribute('data-waline-inited', '1');
    }
  }
});

// 加载更多按钮
document.getElementById('more2').addEventListener('click', () => {
  window.currentPage++;
  renderIssues(window.currentPage, window.perPage, true);
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadAllIssues();
});

/* ========= 全局 loading & toast ========= */
// 显示/隐藏 loading
function toggleLoading(show = true) {
  const mask = document.getElementById('waline-loading');
  mask.style.display = show ? 'flex' : 'none';
}

// 显示 toast
function showToast(msg, duration = 2000) {
  const toast = document.getElementById('waline-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', duration);
}

// /* 监听 Waline 事件（对所有已初始化的评论区都生效） */
// document.addEventListener('DOMContentLoaded', () => {
//   // 监听全局事件
//   document.addEventListener('waline:submit', () => toggleLoading(true));   // 发送前
//   document.addEventListener('waline:submitted', () => {                   // 发送成功
//     toggleLoading(false);
//     showToast('评论已发送 ✅');
//   });
//   document.addEventListener('waline:error', () => {                       // 发送失败
//     toggleLoading(false);
//     showToast('发送失败，请重试 ❌');
//   });
// });