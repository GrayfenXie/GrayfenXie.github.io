// ========== 缓存 & 分页 ==========
window.cachedIssues = [];
window.currentPage    = 1;
window.perPage        = 10;
window.isLoading      = false;

// ========== marked 渲染器：把多张图收进九宫格 ==========
(function () {
  // 收集当前 issue 里的所有 <img>
  const currentImages = [];

  // 创建自定义 renderer
  const renderer = new marked.Renderer();
  const originImage = renderer.image.bind(renderer);

  renderer.image = function (href, title, text) {
    // 收集真正的 <img> 字符串
    currentImages.push(originImage(href, title, text));
    return '';   // 占位，稍后统一输出
  };

  // 全局暴露
  window.renderMarkdown = function (md) {
    currentImages.length = 0;                       // 每次清空
    const html = marked(md || '', {
      renderer,
      gfm: true,
      breaks: true,
      smartLists: true
    });
    // 返回：正文 HTML + 九宫格 HTML（多张图时才套）
    const gridHTML =
      currentImages.length > 1
        ? '<div class="issue-grid">' + currentImages.join('') + '</div>'
        : currentImages.join('');
    return html + gridHTML;
    // return html;
  };
})();

// ========== 拉取全部 Issue 数据 ==========
async function loadAllIssues() {
  if (window.isLoading) return;
  window.isLoading = true;
  try {
    await fetchAllCommentsOnce();        // 你原来的实现
    renderIssues(1, window.perPage);
    document.getElementById('allpic2').innerText = window.cachedIssues.length;
  } catch (e) {
    console.error(e);
    document.getElementById('issue-list').innerHTML =
      '<li class="failtoload">加载失败，请稍后再试</li>';
  } finally {
    window.isLoading = false;
  }
}

// ========== 获取某个 issue 的评论数 ==========
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

// ========== 渲染 Issue 列表 ==========
function renderIssues(page, perPage, isAppend = false) {
  const issueList = document.getElementById('issue-list');
  const start = (page - 1) * perPage;
  const end   = start + perPage;
  const pageIssues = window.cachedIssues.slice(start, end);

  if (!isAppend) issueList.innerHTML = '';

  pageIssues.forEach(issue => {
    const date = new Date(issue.created_at);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    // 使用上面封装好的函数
    const bodyHTML = window.renderMarkdown(issue.body || '');

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="issue-body">${bodyHTML}</div>
      <div class="issue-footer">
          <div class="issue-date">${formattedDate}</div>
          <button class="comment-toggle" data-issue-id="${issue.id}" title="显示/隐藏评论">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a 2 2 0 0 1 2 2z"></path>
              </svg>
              <span class="comment-count" data-issue-id="${issue.id}">0</span>
          </button>
      </div>
      <div class="waline-container" data-issue-id="${issue.id}" style="display: none;"></div>
    `;
    li.classList.add('aissue');
    issueList.appendChild(li);

    fetchCommentCount(issue.id).then(count => {
      const countEl = li.querySelector(`.comment-count[data-issue-id="${issue.id}"]`);
      if (countEl) countEl.textContent = count;
    });
  });

  // 加载更多按钮状态
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

// ========== 评论区开关 ==========
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
    document.querySelectorAll('.waline-container').forEach(el => el.style.display = 'none');
    container.style.display = 'block';

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

// ========== 加载更多按钮 ==========
document.getElementById('more2').addEventListener('click', () => {
  window.currentPage++;
  renderIssues(window.currentPage, window.perPage, true);
});

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  loadAllIssues();
});

// ========== 全局 loading & toast ==========
function toggleLoading(show = true) {
  const mask = document.getElementById('waline-loading');
  mask.style.display = show ? 'flex' : 'none';
}
function showToast(msg, duration = 2000) {
  const toast = document.getElementById('waline-toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', duration);
}

// ========== 把正文里的 <img> 统一搬进九宫格 ==========
(function () {
  // 统一处理所有 issue
  function packImagesToGrid() {
    document.querySelectorAll('.issue-body').forEach(body => {
      // 已处理过就跳过
      if (body.querySelector('.issue-grid')) return;

      const imgs = [...body.querySelectorAll('img')];
      if (imgs.length <= 1) return;   // 单张不处理

      // 创建九宫格
      const grid = document.createElement('div');
      grid.className = 'issue-grid';

      // 把现有 img 按原顺序搬进九宫格（DOM 移动）
      imgs.forEach(img => grid.appendChild(img));

      // 追加到 body 末尾
      body.appendChild(grid);
    });
  }

  // 在 renderIssues 渲染完 DOM 后统一执行
  const oldRenderIssues = window.renderIssues;
  window.renderIssues = function (...args) {
    oldRenderIssues.apply(this, args);
    // 让浏览器先完成 DOM 渲染
    setTimeout(packImagesToGrid, 0);
  };
})();

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