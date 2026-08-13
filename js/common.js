let currentTabType = '';
var originalScrollPosition = 0;
var owner = "GrayfenXie";
var repo = "GrayfenXie.github.io";
var myUsername = "GrayfenXie";
var mainpart = document.getElementById('mainpart');
let openpicflag = true;

window.cachedIssues = [];
window.cachedIssues2 = [];
let _commentsPromise = null;
window.ipAnimInstance = null;
// 全局缓存Lottie JSON数据（核心：预加载复用，避免重复请求）
window.lottieJsonCache = {};

// 冻结滚动
function freezeScroll() {
    const scrollTop = mainpart.scrollTop;
    mainpart.dataset.scrollTop = scrollTop;
    mainpart.style.overflow = 'hidden';
}
// 恢复滚动
function unfreezeScroll() {
    const scrollTop = parseInt(mainpart.dataset.scrollTop || '0', 10);
    mainpart.style.overflow = '';
    mainpart.scrollTop = scrollTop;
}

// 移动端导航
var openit = document.getElementById('openit');
var closeit = document.getElementById('closeit');
var mobilemune = document.getElementById('mobilemune');
function openitfc() {
    mobilemune.style.display = 'flex';
    mobilemune.style.visibility = 'visible';
    setTimeout(() => mobilemune.style.opacity = '1', 250);
    closeit.style.display = 'block';
    openit.style.display = 'none';
}
function closeitfc() {
    mobilemune.style.opacity = '0';
    setTimeout(() => {
        mobilemune.style.visibility = 'hidden';
        mobilemune.style.display = 'none';
    }, 250);
    openit.style.display = 'block';
    closeit.style.display = 'none';
}
if (openit) openit.onclick = openitfc;
if (closeit) closeit.onclick = closeitfc;

// 加载评论
async function fetchAllCommentsOnce() {
    if (_commentsPromise) return _commentsPromise;
    _commentsPromise = (async () => {
        let page = 1;
        let allComments = [];
        while (true) {
            const res = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/issues/comments?per_page=100&sort=created&page=${page}`,
                { method: 'GET' }
            );
            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) break;
            allComments = allComments.concat(data);
            page++;
        }
        const c2 = allComments.filter(c =>
            c.issue_url.endsWith('/2') &&
            (c.user.login === myUsername || c.user.login === 'grayfenxie[bot]')
        );
        const c6 = allComments.filter(c =>
            c.issue_url.endsWith('/6') &&
            (c.user.login === myUsername || c.user.login === 'grayfenxie[bot]')
        );
        window.cachedIssues = c2.reverse();
        window.cachedIssues2 = c6.reverse();
    })();
    return _commentsPromise;
}

// Tab 初始化
document.addEventListener('DOMContentLoaded', function () {
    const firstTab = document.querySelector('.tab');
    if (firstTab) currentTabType = firstTab.getAttribute('data-tab');
});
document.addEventListener('DOMContentLoaded', () => {
    const firstTab = document.querySelector('.tab[data-tab]');
    if (firstTab) {
        const tabName = firstTab.dataset.tab;
        currentTabType = tabName;
        document.querySelectorAll(`.tab[data-tab="${tabName}"]`).forEach(t => t.classList.add('active'));
    }
});

let typeTimer = null;
let issueDataLoaded = false; // 新增全局标记，防止重复请求
// Tab 点击切换
document.addEventListener('click', e => {
    const tab = e.target.closest('.tab[data-tab]');
    if (!tab) return;
    const targetTab = tab.dataset.tab;

    // ✅ 第一步优先判断：点击当前激活tab，直接终止，不执行任何操作
    if (targetTab === currentTabType) return;

    // 首次进入日常tab触发加载
    if(targetTab === "issue-content" && !issueDataLoaded){
        issueDataLoaded = true;
        const listDom = document.getElementById('issue-list');
        listDom.innerHTML = `<li class="loading-row" style="padding:40px 0;">正在加载日常...</li>`;
        loadAllIssues()
        .catch(()=>{
            listDom.innerHTML = `<li class="failtoload">加载失败，点击重试</li>`;
            issueDataLoaded = false;
        })
    }

    // ✅ 只执行一次：清空全部tab active
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    // 给所有同data-tab的tab统一激活（侧边+移动端菜单一并处理）
    document.querySelectorAll(`.tab[data-tab="${targetTab}"]`).forEach(t => t.classList.add('active'));

    // 切换内容面板
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const targetContent = document.getElementById(targetTab);
    if (targetContent) {
        targetContent.classList.add('active');
    }

    // 更新全局状态（唯一可信源！所有UI跟随currentTabType，不要反过来）
    currentTabType = targetTab;

    anime();
    pauseAllVideos();
    mainpart.scrollTo({ top: 0, behavior: 'smooth' });
    closeitfc();
    setTimeout(refreshTabLottie, 300);
});

// 入场动画
function anime() {
    const eles = document.getElementsByClassName('image-item');
    const eles2 = document.getElementsByClassName('aissue');
    const eles4 = document.getElementsByClassName('portfolio-item');
    const eles5 = document.getElementsByClassName('guitar-item');
    function resetStyles(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transform = 'scale(0)';
            elements[i].style.opacity = '0';
        }
    }
    function triggerAnimation(elements) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.transform = 'scale(1)';
            elements[i].style.opacity = '1';
        }
    }
    resetStyles(eles);
    resetStyles(eles2);
    resetStyles(eles4);
    resetStyles(eles5);
    setTimeout(() => {
        triggerAnimation(eles);
        triggerAnimation(eles2);
        triggerAnimation(eles4);
        triggerAnimation(eles5);
    }, 10);
}

// 打字机动画
document.addEventListener("DOMContentLoaded", function () {
    const slogenElement = document.getElementById("slogen");
    if (!slogenElement) return;
    const text = "分享作品和日常";
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            slogenElement.textContent += text.charAt(index);
            index++;
            typeTimer = setTimeout(typeWriter, 150);
        } else {
            typeTimer = setTimeout(deleteText, 2000);
        }
    }
    function deleteText() {
        if (index > 0) {
            slogenElement.textContent = text.substring(0, index - 1);
            index--;
            typeTimer = setTimeout(deleteText, 60);
        } else {
            typeTimer = setTimeout(typeWriter, 1000);
        }
    }
    setTimeout(() => typeWriter(), 500);
});

// 防抖
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

// 日夜模式切换
var flag = true;
var bgImage1 = 'url("img/sun.svg")';
var bgImage2 = 'url("img/moon.svg")';
var switchbutton = document.getElementById('switch');
if (switchbutton) {
    switchbutton.addEventListener('click', function () {
        if (flag) {
            document.body.classList.add("night");
            switchbutton.style.backgroundImage = bgImage2;
            flag = false;
        } else {
            document.body.classList.remove("night");
            switchbutton.style.backgroundImage = bgImage1;
            flag = true;
        }
    });
}

// 留言板
var messageboxbutton = document.getElementById("messageboxbutton");
var flag2 = true;
var messagemodal = document.getElementById("message-content");
if (messageboxbutton && messagemodal) {
    messageboxbutton.onclick = function () {
        messagemodal.style.display = "block";
        setTimeout(() => messagemodal.style.opacity = 1, 100);
        freezeScroll();
        flag2 = true;
    }
}
var span2 = document.getElementsByClassName("close2")[0];
if (span2 && messagemodal) {
    span2.onclick = function () {
        messagemodal.style.opacity = 0;
        setTimeout(() => {
            messagemodal.style.display = "none";
            unfreezeScroll();
        }, 100);
        document.body.classList.remove('no-scroll');
        flag2 = false;
        const statusDom = document.getElementById("my-form-status");
        if (statusDom) statusDom.style.display = "none";
    }
}

// 大图缩放
function look() {
    if (openpicflag) {
        modalImg.classList.add('zoomed');
        modal.style.cursor = 'zoom-out';
        openpicflag = false;
    } else {
        modalImg.classList.remove('zoomed');
        modal.style.cursor = 'zoom-in';
        openpicflag = true;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById("img01");
    const span = document.getElementsByClassName("close")[0];
    if (!modal || !modalImg) return;
    function opens(img) {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        freezeScroll();
        setTimeout(() => modalImg.style.opacity = 1, 100);
        modalImg.onclick = look;
    }
    if (span) {
        span.onclick = function () {
            modalImg.style.opacity = 0;
            setTimeout(() => {
                modal.style.display = "none";
                unfreezeScroll();
                modalImg.classList.remove('zoomed');
                modal.style.cursor = 'zoom-in';
                openpicflag = true;
            }, 100);
            document.body.classList.remove('no-scroll');
        }
    }
    const issueList = document.getElementById('issue-list');
    if (issueList) {
        issueList.addEventListener('click', function (event) {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'img' && target.closest('.issue-body')) {
                opens(target);
            }
        });
    }
});

// 暂停视频
function pauseAllVideos(excludePlayer) {
    document.querySelectorAll('video').forEach(v => {
        if (excludePlayer && v === excludePlayer.el()?.querySelector('video')) return;
        v.pause();
    });
    if (window.videojs) {
        Object.values(videojs.getPlayers()).forEach(p => {
            if (p !== excludePlayer && !p.paused()) p.pause();
        });
    }
}

// 滚动加载
function initScrollLoader(tabName, loadMoreFn, threshold = 2) {
    const debounced = debounce(() => {
        const { scrollTop, clientHeight, scrollHeight } = mainpart;
        const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
        if (nearBottom && currentTabType === tabName) {
            loadMoreFn();
        }
    }, 200);
    mainpart.addEventListener('scroll', debounced);
}
document.addEventListener('DOMContentLoaded', () => {
    initScrollLoader('issue-content', () => {
        if (window.isLoading) return;
        window.currentPage++;
        renderIssues(window.currentPage, window.perPage, true);
    });
    initScrollLoader('guitar-content', () => {
        if (window.isLoading2) return;
        window.currentPage2++;
        renderGuitars(window.currentPage2, window.perPage2, true);
    });
    initScrollLoader('image-content', () => {
        if (window.loadedImages >= (window.imagesData?.length || 0)) return;
        createImageElements(window.imagesData, window.imagesPerLoad || 9);
    });
});

// 导航栏显示隐藏
const nav = document.getElementById('subNav');
const HIDE = 'hide';
if (mainpart && nav) {
    mainpart.addEventListener('scroll', () => {
        const top = mainpart.scrollTop;
        top > 300 ? nav.classList.remove(HIDE) : nav.classList.add(HIDE);
    });
}

// 大图左右切换
(function () {
    let currentImgs = [];
    let currentIdx = 0;
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('img01');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    if (!modal || !modalImg) return;
    document.addEventListener('click', function (e) {
        const img = e.target.closest('#issue-content .issue-body img');
        if (!img) return;
        const parent = img.closest('.issue-body');
        currentImgs = Array.from(parent.querySelectorAll('img')).map(i => i.src);
        currentIdx = currentImgs.indexOf(img.src);
        openModal(img.src);
    });
    function openModal(src) {
        modal.style.display = 'block';
        modalImg.src = src;
        modalImg.style.opacity = 1;
        const arrowsVisible = currentImgs.length > 1;
        if (prevBtn) prevBtn.style.display = arrowsVisible ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = arrowsVisible ? 'block' : 'none';
    }
    function showPrev() {
        if (!currentImgs.length) return;
        currentIdx = (currentIdx - 1 + currentImgs.length) % currentImgs.length;
        modalImg.src = currentImgs[currentIdx];
    }
    function showNext() {
        if (!currentImgs.length) return;
        currentIdx = (currentIdx + 1) % currentImgs.length;
        modalImg.src = currentImgs[currentIdx];
    }
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    document.addEventListener('keydown', function (e) {
        if (modal.style.display !== 'block') return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
})();

// ===================== Lottie 核心修复区 =====================
const timestamp = Date.now();
// 追加时间戳绕过缓存
const animSrc = {
    paint: `https://img.grayfen.cn/ip/paint_compressed.json?t=${timestamp}`,
    daily: `https://img.grayfen.cn/ip/daily_compressed.json?t=${timestamp}`,
    book: `https://img.grayfen.cn/ip/book_compressed.json?t=${timestamp}`,
    guitar: `https://img.grayfen.cn/ip/guitar_compressed.json?t=${timestamp}`
};
const ANIM_SPEED = 1.5;
const animMap = {};

// 销毁单个Lottie实例
function destroyLottieInstance(item) {
    if (item?.anim) {
        try { item.anim.destroy(); } catch (e) { }
    }
}
// 销毁全部Tab动画
function destroyAllTabLottie() {
    Object.values(animMap).forEach(item => destroyLottieInstance(item));
    Object.keys(animMap).forEach(key => delete animMap[key]);
}
// 刷新动画状态
function refreshTabLottie() {
    Object.values(animMap).forEach(item => {
        const { anim, dom } = item;
        if (!anim || typeof anim.play !== 'function') return;
        if (dom.classList.contains('active')) {
            anim.setSpeed(ANIM_SPEED);
            anim.play();
        } else {
            anim.pause();
            anim.goToAndStop(0, true); // 停在首帧（解决空白）
        }
    });
}

// 预加载所有JSON（解决首屏网络延迟）
async function preloadAllLottieJson() {
    const keys = Object.keys(animSrc);
    for (const key of keys) {
        const url = animSrc[key];
        if (window.lottieJsonCache[key]) continue;
        try {
            const res = await fetch(url, { mode: 'cors' });
            if (!res.ok) throw new Error('请求失败');
            window.lottieJsonCache[key] = await res.json();
        } catch (err) {
            console.error(`预加载 ${key} 失败`, err);
        }
    }
}

// 重建Tab图标动画（使用预加载数据，不再远程请求）
async function initAllTabLottie() {
    destroyAllTabLottie();
    // 先确保JSON已预加载
    await preloadAllLottieJson();

    const allTabDom = document.querySelectorAll('.tab, .rightmenu .tab');
    allTabDom.forEach((tab, idx) => {
        const icon = tab.querySelector('.lottie-icon');
        const animType = icon.dataset.anim;

        // JSON 预加载失败：直接保留静态图，不初始化动画
        if (!icon || !animType || !window.lottieJsonCache[animType]) {
            return;
        }

        const animKey = animType + '_' + idx;
        try {
            const anim = lottie.loadAnimation({
                container: icon,
                renderer: 'svg',
                loop: true,
                autoplay: false,
                animationData: window.lottieJsonCache[animType],
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet'
                }
            });
            anim.setSpeed(ANIM_SPEED);
            animMap[animKey] = { anim, dom: tab };
            // 强制渲染动画首帧
            anim.goToAndStop(0, true);

            // ✅ 动画完全加载成功：添加 loaded 类，隐藏静态图
            anim.addEventListener('DOMLoaded', () => {
                icon.classList.add('loaded');
            });

            // ✅ 动画加载失败：销毁实例，永久保留静态图
            anim.addEventListener('error', () => {
                console.error(`【${animType}】动画加载失败，使用静态兜底`);
                destroyLottieInstance(animMap[animKey]);
            });
        } catch (err) {
            console.error(`【${animType}】动画初始化异常，保留静态图`, err);
        }
    });

    // 绑定hover事件
    Object.values(animMap).forEach(item => {
        const { anim, dom } = item;
        dom.onmouseenter = null;
        dom.onmouseleave = null;
        dom.addEventListener('mouseenter', () => {
            if (anim) {
                anim.setSpeed(ANIM_SPEED);
                anim.goToAndPlay(0, true);
            }
        });
        dom.addEventListener('mouseleave', () => {
            if (anim && !dom.classList.contains('active')) {
                anim.pause();
                anim.goToAndStop(0, true);
            }
        });
    });
    refreshTabLottie();
}

// ========== 分阶段初始化（等待布局完成，彻底解决首屏空白） ==========
document.addEventListener('DOMContentLoaded', async function () {
    // 阶段1：立即预加载JSON
    await preloadAllLottieJson();

    // 阶段2：等待布局渲染完成（延迟300ms，解决容器未布局）
    setTimeout(async () => {
        await initAllTabLottie();
    }, 300);

    // 头像动画
    const staticAvatar = document.querySelector('.avatar-static');
    const avatarAnimContainer = document.getElementById('avatar-animation');
    if (avatarAnimContainer) {
        try {
            const avatarAnim = lottie.loadAnimation({
                container: avatarAnimContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://img.grayfen.cn/ip/avatar.json'
            });
            avatarAnim.addEventListener('DOMLoaded', () => {
                avatarAnimContainer.style.transition = 'opacity 0.3s';
                avatarAnimContainer.style.opacity = '1';
            });
            avatarAnim.addEventListener('error', () => {
                avatarAnimContainer.style.opacity = '0';
                if (staticAvatar) staticAvatar.style.opacity = '1';
            });
            setTimeout(() => avatarAnimContainer.style.opacity = '1', 1500);
        } catch (e) {
            if (staticAvatar) staticAvatar.style.opacity = '1';
        }
    }

    // IP形象动画
    const mascot = document.getElementById('ipMascot');
    const bubble = document.getElementById('ipBubble');
    const AUDIO_MAP = [
        'https://img.grayfen.cn/ip/IP%E8%AF%AD%E9%9F%B3/%E6%AD%AA%E5%98%B4%E7%AC%91.mp3?no-wait=on ',
        'https://img.grayfen.cn/ip/IP%E8%AF%AD%E9%9F%B3/%E6%94%BE%E7%8B%A0%E8%AF%9D.mp3?no-wait=on ',
        'https://img.grayfen.cn/ip/IP%E8%AF%AD%E9%9F%B3/%E8%87%AA%E6%88%91%E4%BB%8B%E7%BB%8D.mp3?no-wait=on ',
        'https://img.grayfen.cn/ip/IP%E8%AF%AD%E9%9F%B3/%E6%B1%82%E9%A5%B6.mp3?no-wait=on ',
        'https://img.grayfen.cn/ip/IP%E8%AF%AD%E9%9F%B3/%E5%89%91.mp3?no-wait=on '
    ];
    const slogans = [
        '（歪嘴）桀桀桀桀桀桀桀桀桀桀桀桀',
        '所有杀不死我的，都会让我变得更强大！',
        '在下鬼凤，誓要成为一名独当一面的冒险家！',
        '大侠饶命！我刚出新手村！！！',
        '吾手里这把剑，专治各种不服！',
    ];
    let clickflag = true;
    let timer = null;
    AUDIO_MAP.forEach(url => fetch(url, { mode: 'no-cors' }).catch(() => { }));

    if (mascot) {
        try {
            const anim = lottie.loadAnimation({
                container: mascot,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: 'ip/ip.json'
            });
            window.ipAnimInstance = anim;
            anim.addEventListener('DOMLoaded', () => playMarker('default', true));
            anim.addEventListener('error', () => console.error('IP动画加载失败'));

            function playMarker(name, loop = false) {
                const m = anim.animationData?.markers?.find(o => o.cm === name);
                if (!m) return;
                anim.loop = loop;
                anim.playSegments([m.tm, m.tm + m.dr], true);
            }
            mascot.addEventListener('click', () => {
                if (!clickflag) return;
                clickflag = false;
                const idx = Math.floor(Math.random() * slogans.length);
                if (bubble) {
                    bubble.textContent = slogans[idx];
                    bubble.classList.add('show');
                }
                clearTimeout(timer);
                const audio = new Audio(AUDIO_MAP[idx]);
                audio.play().catch(() => { });
                playMarker('talk', false);
                audio.addEventListener('ended', () => {
                    if (bubble) bubble.classList.remove('show');
                    playMarker('default', true);
                    clickflag = true;
                }, { once: true });
            });
        } catch (e) { }
    }
});

// 页面从缓存恢复（后退/标签唤醒）强制重建
window.addEventListener('pageshow', async function (e) {
    if (e.persisted) {
        setTimeout(async () => {
            await initAllTabLottie();
            // 重建IP动画
            if (window.ipAnimInstance) {
                try { window.ipAnimInstance.destroy(); } catch (e) { }
            }
            const mascot = document.getElementById('ipMascot');
            if (mascot) {
                const anim = lottie.loadAnimation({
                    container: mascot,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: 'ip/ip.json'
                });
                window.ipAnimInstance = anim;
            }
        }, 200);
    }
});

// // Tab点击刷新动画
// document.addEventListener('click', e => {
//     const tab = e.target.closest('.tab[data-tab]');
//     if (!tab) return;
//     setTimeout(refreshTabLottie, 300);
// });

// 粒子动画
function getParticleCount() {
    const isMobile = /Mobile|Android|iOS/.test(navigator.userAgent);
    const isLowEnd = isMobile && window.innerWidth < 768;
    return isLowEnd ? 60 : 120;
}
let isParticleLoaded = false;
window.addEventListener('load', function () {
    if (isParticleLoaded) return;
    setTimeout(() => {
        if (window.pJSDom?.length > 0) {
            window.pJSDom.forEach(item => item.pJS.fn.vendors.destroypJS());
            window.pJSDom = [];
        }
        fetch('particlesjs-config.json')
            .then(res => {
                if (!res.ok) throw new Error('粒子配置请求失败');
                return res.json();
            })
            .then(config => {
                config.particles.number.value = getParticleCount();
                particlesJS('particles-js', config);
                isParticleLoaded = true;
            })
            .catch(err => console.error('粒子动画加载失败', err));
    }, 500);
});

// 页面显隐（切后台/前台）
document.addEventListener('visibilitychange', async () => {
    const status = document.hidden;
    let needRebuild = false;
    Object.values(animMap).forEach(item => {
        if (!item?.anim || typeof item.anim.play !== 'function') {
            needRebuild = true;
            return;
        }
        status ? item.anim.pause() : item.anim.play();
    });
    // 实例失效自动重建
    if (needRebuild && !status) {
        setTimeout(async () => await initAllTabLottie(), 200);
    }
    // IP动画
    if (window.ipAnimInstance && typeof window.ipAnimInstance.play === 'function') {
        status ? window.ipAnimInstance.pause() : window.ipAnimInstance.play();
    }
});

// 头像弹窗：myInfo 底部上滑，不隐藏滚动、仅关闭按钮关闭遮罩
document.addEventListener('DOMContentLoaded', function(){
    const avatarWrap = document.getElementById('avatarWrap');
    const myInfoPanel = document.getElementById('myInfo');
    const infoCloseBtn = myInfoPanel?.querySelector('.close');
    
    if(!avatarWrap || !myInfoPanel || !infoCloseBtn){
        console.error('缺失DOM元素，点击失效');
        return;
    }

    function openMyInfo() {
        myInfoPanel.classList.add('active');
    }
    function closeMyInfo() {
        myInfoPanel.classList.remove('active');
    }

    // 头像打开
    avatarWrap.addEventListener('click', openMyInfo);
    // 仅关闭按钮关闭
    infoCloseBtn.addEventListener('click', closeMyInfo);
    // ESC 关闭
    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && myInfoPanel.classList.contains('active')) {
            closeMyInfo();
        }
    })
});
