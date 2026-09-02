// 缓存 & 分页 
window.cachedIssues = [];
window.currentPage = 1;
window.perPage = 10;
window.isLoading = false;

// marked 渲染器：把多张图收进九宫格 
(function () {
  const currentImages = [];
  const currentVideos = [];
  const renderer = new marked.Renderer();
  const originImage = renderer.image.bind(renderer);

  renderer.image = function (href, title, text) {
    currentImages.push(originImage(href, title, text));
    return '';
  };

  window.renderMarkdown = function (md) {
    currentImages.length = 0;
    currentVideos.length = 0;

    // 1. 先干掉 Markdown 末尾所有换行/空白
    md = (md || '').replace(/\n\s*$/g, '');

    // 1.5 抽出 <video> 标签（发布端拼的 HTML），marked 不需要处理它
    md = md.replace(/<video[^>]*>[\s\S]*?<\/video>|<video[^>]*\/>/gi, m => {
      currentVideos.push(m);
      return '\n\n';
    });

    // 2. 再解析
    const html = marked(md, {
      renderer,
      gfm: true,
      breaks: true,
      smartLists: true
    });

    // 3. 再去掉 marked 可能产生的末尾空 <p></p> 或 <br>
    const trimmed = html
      .replace(/(?:\s*<p>(?:\s*<br\s*\/?>)+\s*<\/p>\s*)+$/gi, '')
      .replace(/(?:\s*<p>\s*<\/p>\s*)+$/gi, '')   // 再清一遍纯空段落
      .replace(/(<br\s*\/?>\s*){2,}(?=<\/p>)/gi, '')
      .trimEnd();

    const gridHTML =
      currentImages.length > 1
        ? '<div class="issue-grid">' + currentImages.join('') + '</div>'
        : currentImages.join('');

    // 视频放在正文后、图片九宫格前；每个视频包一层并叠加播放小图标
    const videoHTML = currentVideos.length
      ? '\n<div class="issue-videos">' + currentVideos.map(v =>
          '<div class="issue-video-item">' + v +
          '<span class="video-play-icon" aria-hidden="true"></span>' +
          '</div>'
        ).join('\n') + '</div>'
      : '';

    return trimmed + videoHTML + gridHTML;
  };
})();

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
      '<li class="failtoload">加载失败，请稍后再试</li>';
  } finally {
    window.isLoading = false;
  }
}

// 获取某个 issue 的评论数 
async function fetchCommentCount(issueId) {
  try {
    const res = await fetch(`https://waline.grayfen.cn/comment?path=/issues/${issueId}`);
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
  const end = start + perPage;
  const pageIssues = window.cachedIssues.slice(start, end);

  if (!isAppend) issueList.innerHTML = '';

  pageIssues.forEach(issue => {
    const date = new Date(issue.created_at);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleString('en-US', { weekday: 'short' })} ${date.toLocaleTimeString()}`;
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
    moreButton.innerText = '加载到底部啦~';
    moreButton.style.cursor = 'unset';
    moreButton.style.pointerEvents = 'none';
  } else {
    moreButton.innerText = '滚动加载更多...';
    moreButton.style.cursor = 'pointer';
    moreButton.style.pointerEvents = 'auto';
  }
  document.getElementById('loadpic2').innerText = Math.min(end, window.cachedIssues.length);
}

// 评论区开关 
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
          '//cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/weibo',
          '//cdn.jsdelivr.net/npm/@waline/emojis@1.2.0/bmoji',
        ],
        path: `/issues/${issueId}`,
        components: {
          MarkdownGuide: () => null
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

// // 初始化 
// document.addEventListener('DOMContentLoaded', () => {
//   loadAllIssues();
// });

// 全局 loading & toast 
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

// 把正文里的 <img> 统一搬进九宫格 
(function () {
  /* 打包九宫格 */
  function packImagesToGrid() {
    document.querySelectorAll('.issue-body').forEach(body => {
      if (body.querySelector('.issue-grid')) return;   // 已处理过

      const imgs = [...body.querySelectorAll('img')];
      if (imgs.length <= 1) return;                    // 单张不处理

      // 1. 创建九宫格
      const grid = document.createElement('div');
      grid.className = 'issue-grid';
      imgs.forEach(img => grid.appendChild(img));

      // 2. 把 grid 插到 body 末尾（或你想放的位置）
      body.appendChild(grid);

      // 3. 关键：删掉因“搬家”而变空的 <p></p>
      body.querySelectorAll('p').forEach(p => {
        if (p.innerHTML.replace(/\s|<br\s*\/?>/gi, '') === '') p.remove();
      });
    });
  }

  //播放动画：只针对带 [data-animate-new] 标记的新节点
  function playAnimeForNew() {
    const news = document.querySelectorAll('.aissue[data-animate-new]');
    news.forEach(el => {
      el.style.transform = 'scale(1)';
      el.style.opacity = '1';
      el.removeAttribute('data-animate-new');   // 标记用完即焚
    });
  }

  // 随笔视频增强：离屏自动暂停 + 进入视口预加载元数据
  const diaryVideoIO = ('IntersectionObserver' in window)
    ? new IntersectionObserver(entries => {
        entries.forEach(en => {
          const v = en.target;
          if (!en.isIntersecting) {
            if (!v.paused) v.pause();
          } else if (v.getAttribute('preload') === 'none') {
            v.setAttribute('preload', 'metadata');
          }
        });
      }, { root: null, rootMargin: '300px 0px', threshold: 0 })
    : null;

  // 初始化随笔中的视频：互斥播放 + 离屏暂停 + 播放小图标
  function setupDiaryVideos(container) {
    const videos = (container || document).querySelectorAll('.issue-videos video');
    videos.forEach(v => {
      if (v.dataset.videoReady) return;
      v.dataset.videoReady = '1';

      // 统一：去除原生控制条，使用自定义音量条 + 播放默认静音
      v.removeAttribute('controls');
      v.muted = true;

      // 自定义音量条：视频画面右侧的小竖条，悬停显示，可点击/拖拽调音量
      const volWrap = document.createElement('div');
      volWrap.className = 'video-volume';
      volWrap.innerHTML = '<div class="video-volume-fill"></div><div class="video-volume-thumb"></div>';
      v.parentElement.appendChild(volWrap);
      const volFill  = volWrap.querySelector('.video-volume-fill');
      const volThumb = volWrap.querySelector('.video-volume-thumb');

      const updateVolUI = () => {
        const level = v.muted ? 0 : v.volume;
        volFill.style.height  = (level * 100) + '%';
        volThumb.style.bottom = (level * 100) + '%';
      };
      const setVolFromEvent = e => {
        const rect = volWrap.getBoundingClientRect();
        let pct = (rect.bottom - e.clientY) / rect.height;
        pct = Math.min(1, Math.max(0, pct));
        v.muted = false; // 手动调节即取消静音
        v.volume = pct;
        updateVolUI();
      };
      let volDragging = false;
      volWrap.addEventListener('pointerdown', e => {
        e.preventDefault();
        e.stopPropagation();
        volDragging = true;
        if (volWrap.setPointerCapture) volWrap.setPointerCapture(e.pointerId);
        setVolFromEvent(e);
      });
      volWrap.addEventListener('pointermove', e => {
        if (volDragging) setVolFromEvent(e);
      });
      const stopVolDrag = e => {
        volDragging = false;
        if (volWrap.releasePointerCapture) volWrap.releasePointerCapture(e.pointerId);
      };
      volWrap.addEventListener('pointerup', stopVolDrag);
      volWrap.addEventListener('pointercancel', stopVolDrag);
      v.addEventListener('volumechange', updateVolUI);
      updateVolUI();

      // 原生控制条已隐藏：点击视频画面切换播放/暂停
      v.addEventListener('click', () => {
        if (v.paused) v.play().catch(() => {}); else v.pause();
      });

      // 每个视频上的小播放图标
      const icon = v.parentElement?.querySelector('.video-play-icon');
      const setIcon = show => { if (icon) icon.classList.toggle('is-hidden', !show); };

      // 播放时隐藏图标；暂停 / 播放结束恢复显示
      v.addEventListener('play', () => {
        setIcon(false);
        // 播放时暂停其他所有视频
        document.querySelectorAll('video').forEach(o => { if (o !== v) o.pause(); });
        if (window.videojs) {
          Object.values(videojs.getPlayers()).forEach(p => { if (!p.paused()) p.pause(); });
        }
      });
      v.addEventListener('pause', () => setIcon(true));
      v.addEventListener('ended', () => setIcon(true));

      // 点击小图标触发播放
      if (icon) {
        icon.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          v.play().catch(() => {});
        });
      }

      if (diaryVideoIO) diaryVideoIO.observe(v);
    });
  }

  //拦截 renderIssues
  const oldRenderIssues = window.renderIssues;
  window.renderIssues = function (page, perPage, isAppend = false) {
    //先记录“旧”节点
    const oldOnes = new Set(document.querySelectorAll('.aissue'));

    //真正渲染 DOM（此时新节点已插入）
    oldRenderIssues.call(this, page, perPage, isAppend);

    //给所有“新”节点打标记
    document.querySelectorAll('.aissue').forEach(li => {
      if (!oldOnes.has(li)) li.setAttribute('data-animate-new', '');
    });

    //等浏览器完成搬图、重排后再播动画
    requestAnimationFrame(() => {
      packImagesToGrid();      // 搬运 <img>
      playAnimeForNew();       // 统一播放
      setupDiaryVideos();      // 初始化随笔视频（互斥播放/离屏暂停）
    });
  };
})();