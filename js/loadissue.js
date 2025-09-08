// ========== 缓存 & 分页 ==========
window.cachedIssues = [];
window.currentPage    = 1;
window.perPage        = 10;
window.isLoading      = false;

// ========== marked 渲染器：把多张图收进九宫格 ==========
(function () {
  const currentImages = [];
  const renderer = new marked.Renderer();
  const originImage = renderer.image.bind(renderer);

  renderer.image = function (href, title, text) {
    currentImages.push(originImage(href, title, text));
    return '';
  };

  window.renderMarkdown = function (md) {
    currentImages.length = 0;
    const html = marked(md || '', {
      renderer,
      gfm: true,
      breaks: true,
      smartLists: true
    });
    const gridHTML =
      currentImages.length > 1
        ? '<div class="issue-grid">' + currentImages.join('') + '</div>'
        : currentImages.join('');
    return html + gridHTML;
  };
})();

// ========== 拉取全部 Issue 数据 ==========
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
      '<li class="failtoload">加载失败，请稍后再试</li>';
  } finally {
    window.isLoading = false;
  }
}

// ========== 获取某个 issue 的评论数 ==========
async function fetchCommentCount(issueId) {
  try {
    const res = await fetch(`https://waline.grayfen.cn/comment?path=/issues/${issueId}`);
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
/* ========== 九宫格 & 动画（一次性解决） ========== */
(function () {
  /* 打包九宫格 */
  function packImagesToGrid() {
    document.querySelectorAll('.issue-body').forEach(body => {
      if (body.querySelector('.issue-grid')) return;          // 已处理过
      const imgs = [...body.querySelectorAll('img')];
      if (imgs.length <= 1) return;                           // 单张不处理
      const grid = document.createElement('div');
      grid.className = 'issue-grid';
      imgs.forEach(img => grid.appendChild(img));
      body.appendChild(grid);
    });
  }

  /* 播放动画：只针对带 [data-animate-new] 标记的新节点 */
  function playAnimeForNew() {
    const news = document.querySelectorAll('.aissue[data-animate-new]');
    news.forEach(el => {
      el.style.transform = 'scale(1)';
      el.style.opacity   = '1';
      el.removeAttribute('data-animate-new');   // 标记用完即焚
    });
  }

  /* 拦截 renderIssues */
  const oldRenderIssues = window.renderIssues;
  window.renderIssues = function (page, perPage, isAppend = false) {
    /* 1. 先记录“旧”节点 */
    const oldOnes = new Set(document.querySelectorAll('.aissue'));

    /* 2. 真正渲染 DOM（此时新节点已插入） */
    oldRenderIssues.call(this, page, perPage, isAppend);

    /* 3. 给所有“新”节点打标记 */
    document.querySelectorAll('.aissue').forEach(li => {
      if (!oldOnes.has(li)) li.setAttribute('data-animate-new', '');
    });

    /* 4. 等浏览器完成搬图、重排后再播动画 */
    requestAnimationFrame(() => {
      packImagesToGrid();      // 搬运 <img>
      playAnimeForNew();       // 统一播放
    });
  };
})();