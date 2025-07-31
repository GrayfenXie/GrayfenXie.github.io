// 全局变量
window.cachedIssues2 = [];
window.currentPage2 = 1;
window.perPage2 = 10;
window.isLoading2 = false;

async function loadAllGuitar() {
  if (window.isLoading2) return;
  window.isLoading2 = true;
  try {
    await fetchAllCommentsOnce();
    renderGuitars(1, window.perPage2);
    document.getElementById('allpic3').innerText = window.cachedIssues2.length;
  } catch (e) {
    console.error(e);
    document.getElementById('guitar-list').innerHTML =
      '<li class=failtoload>加载失败，请稍后再试</li>';
  } finally {
    window.isLoading2 = false;
  }
}

function renderGuitars(page, perPage2, isAppend = false) {
  const guitarList = document.getElementById('guitar-list');
  const start2 = (page - 1) * perPage2;
  const end2 = start2 + perPage2;
  const pageIssues = window.cachedIssues2.slice(start2, end2);
  if (!isAppend) guitarList.innerHTML = '';

  pageIssues.forEach((guitar, idx) => {
    const body = guitar.body || '';
    const urlMatch = body.match(/url:\s*(https:\/\/cdn\.grayfen\.cn\/[^\s\n\r]+)/i);
    const nameMatch = body.match(/name:\s*([^\n\r]+)/i);

    if (!urlMatch || !nameMatch) return;

    const videoSrc = decodeURIComponent(urlMatch[1]);
    const videoName = nameMatch[1].trim();
    const date2 = new Date(guitar.created_at);
    const formattedDate2 = `${date2.toLocaleDateString()} ${date2.toLocaleTimeString()}`;

    const li = document.createElement('li');
    const vid = `guitar-${guitar.id}-${idx}`;
    li.innerHTML = `
      <video id="${vid}"
             class="video-js vjs-default-skin vjs-loading"
             preload="none"
             poster="${videoSrc}?vframe/jpg/offset/2.5/w/1200/h/675"
             controls
             muted>
        <source src="${videoSrc}" type="video/mp4">
      </video>
      <div class="videoinfor">
        <h3 class="video-title">${videoName}</h3>
        <div class="video-date">${formattedDate2}</div>
      </div>
    `;
    li.classList.add('guitar-item');
    guitarList.appendChild(li);

    setTimeout(() => {
      const player = videojs(vid, {
        controls: true,
        autoplay: false,
        bigPlayButton: true,
        fluid: false,
        aspectRatio: '16:9',
        width: '100%',
        height: 'auto',
        controlBar: true
      });
      player.ready(() => {
        player.removeClass('vjs-loading');
        player.on('play', () => pauseAllVideos(player));
        player.on('ended', () => {
          player.currentTime(0);
          player.load();
          player.posterImage.show();
        });
      });
    }, 0);
  });

  const moreBtn = document.getElementById('more3');
  if (start2 + perPage2 >= window.cachedIssues2.length) {
    moreBtn.innerText = '加载到底部啦~';
    moreBtn.style.pointerEvents = 'none';
  } else {
    moreBtn.innerText = '滚动加载更多...';
    moreBtn.style.pointerEvents = 'auto';
  }
  document.getElementById('loadpic3').innerText =
    Math.min(start2 + perPage2, window.cachedIssues2.length);
}

document.getElementById('more3').addEventListener('click', () => {
  window.currentPage2++;
  renderGuitars(window.currentPage2, window.perPage2, true);
});

document.addEventListener('DOMContentLoaded', () => {
  loadAllGuitar();
});