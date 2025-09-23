// =================  缓存 & 分页  =================
window.cachedIssues2 = [];
window.currentPage2   = 1;
window.perPage2       = 10;
window.isLoading2     = false;

// =================  入口：拉取全部吉他视频  =================
async function loadAllGuitar() {
  if (window.isLoading2) return;
  window.isLoading2 = true;
  const guitarList = document.getElementById('guitar-list');
  try {
    await fetchAllCommentsOnce();              // common.js 里带重试
    renderGuitars(1, window.perPage2);
    document.getElementById('allpic3').innerText = window.cachedIssues2.length;
  } catch (e) {
    console.error(e);
    guitarList.innerHTML = `
      <li class="failtoload">
        加载失败，请稍后再试
        <button onclick="window.isLoading2=false;loadAllGuitar()" style="margin-left:8px;">重新加载</button>
      </li>`;
  } finally {
    window.isLoading2 = false;
  }
}

// =================  获取单个视频评论数  =================
async function fetchCommentCount2(videoId) {
  try {
    const res = await fetch(`https://waline.grayfen.cn/comment?path=/videos/${videoId}`);
    const data = await res.json();
    return data ? data.count : 0;
  } catch {
    return 0;
  }
}

// =================  渲染吉他列表  =================
function renderGuitars(page, perPage2, isAppend = false) {
  const guitarList = document.getElementById('guitar-list');
  const start2 = (page - 1) * perPage2;
  const end2   = start2 + perPage2;
  const pageIssues = window.cachedIssues2.slice(start2, end2);

  if (!isAppend) guitarList.innerHTML = '';

  pageIssues.forEach((guitar, idx) => {
    const body = guitar.body || '';
    const urlMatch  = body.match(/url:\s*(https:\/\/img\.grayfen\.cn\/[^\s\n\r]+)/i);
    const nameMatch = body.match(/name:\s*([^\n\r]+)/i);
    if (!urlMatch || !nameMatch) return;

    const videoSrc  = decodeURIComponent(urlMatch[1]);
    const videoName = nameMatch[1].trim();
    const posterSrc = `${videoSrc}?frame=5000&w=1000&cs=srgb`;
    const date2     = new Date(guitar.created_at);
    const formattedDate2 = `${date2.toLocaleDateString()} ${date2.toLocaleString('en-US', { weekday: 'short' })} ${date2.toLocaleTimeString()}`;

    const li = document.createElement('li');
    const vid = `guitar-${guitar.id}-${idx}`;
    li.innerHTML = `
      <video id="${vid}"
             class="video-js vjs-default-skin vjs-loading"
             preload="none" poster="${posterSrc}" controls muted>
        <source src="${videoSrc}" type="video/mp4">
      </video>
      <div class="videoinfor">
        <h3 class="video-title">${videoName}</h3>
      </div>
      <div class="issue-footer">
        <div class="video-date">${formattedDate2}</div>
        <button class="comment-toggle" data-video-id="${guitar.id}" title="显示/隐藏评论">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="comment-count" data-video-id="${guitar.id}">0</span>
        </button>
      </div>
      <div class="waline-container" data-video-id="${guitar.id}" style="display: none;"></div>
    `;
    li.classList.add('guitar-item');
    guitarList.appendChild(li);

    // 初始化 Video.js
    setTimeout(() => {
      const player = videojs(vid, {
        controls: true, autoplay: false, bigPlayButton: true,
        fluid: false, aspectRatio: '16:9', width: '100%', height: 'auto'
      });
      player.ready(() => {
        player.removeClass('vjs-loading');
        player.on('play', () => pauseAllVideos(player));
        player.on('ended', () => { player.currentTime(0); player.load(); player.posterImage.show(); });
      });
    }, 0);

    // 拉取评论数
    fetchCommentCount2(guitar.id).then(count => {
      const countEl = li.querySelector(`.comment-count[data-video-id="${guitar.id}"]`);
      if (countEl) countEl.textContent = count;
    });

    // 评论区开关
    const toggleBtn = li.querySelector('.comment-toggle');
    const walineContainer = li.querySelector('.waline-container');
    toggleBtn.addEventListener('click', () => {
      const isVisible = walineContainer.style.display !== 'none';
      if (isVisible) {
        walineContainer.style.display = 'none';
      } else {
        document.querySelectorAll('.waline-container').forEach(el => el.style.display = 'none');
        walineContainer.style.display = 'block';
        if (!walineContainer.hasAttribute('data-waline-inited')) {
          Waline.init({
            el: walineContainer,
            serverURL: 'https://waline.grayfen.cn/',
            emoji: [
              '//unpkg.com/@waline/emojis@1.2.0/weibo',
              '//unpkg.com/@waline/emojis@1.2.0/bmoji'
            ],
            path: `/videos/${guitar.id}`,
            components: {
              VInfo: ({ nick }) => h('span', { class: 'wl-nick' }, nick),
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
          walineContainer.setAttribute('data-waline-inited', '1');
        }
      }
    });
  });

  // 更新“加载更多”按钮
  const moreBtn = document.getElementById('more3');
  if (start2 + perPage2 >= window.cachedIssues2.length) {
    moreBtn.innerText = '加载到底部啦~';
    moreBtn.style.pointerEvents = 'none';
  } else {
    moreBtn.innerText = '滚动加载更多...';
    moreBtn.style.pointerEvents = 'auto';
  }
  document.getElementById('loadpic3').innerText = Math.min(start2 + perPage2, window.cachedIssues2.length);
}

// =================  绑定「加载更多」按钮  =================
document.getElementById('more3').addEventListener('click', () => {
  window.currentPage2++;
  renderGuitars(window.currentPage2, window.perPage2, true);
});

// =================  初始化  =================
document.addEventListener('DOMContentLoaded', () => { loadAllGuitar(); });