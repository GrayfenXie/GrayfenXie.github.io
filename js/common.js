let currentTabType = ''; // 当前激活的标签页类型
var originalScrollPosition = 0; // 用于存储原始滚动位置
var owner = "GrayfenXie";
var repo = "GrayfenXie.github.io";
var myUsername = "GrayfenXie";
var mainpart = document.getElementById('mainpart');
let openpicflag = true;

// 全局变量
window.cachedIssues = []; // #2 随笔
window.cachedIssues2 = []; // #6 弹棉花
let _commentsPromise = null;   // ← 缓存 Promise，保证只发一次

// 冻结 mainpart 的滚动
function freezeScroll() {
    const scrollTop = mainpart.scrollTop;
    mainpart.dataset.scrollTop = scrollTop;
    mainpart.style.overflow = 'hidden';   // 让 mainpart 不再滚动
}

// 恢复 mainpart 的滚动
function unfreezeScroll() {
    const scrollTop = parseInt(mainpart.dataset.scrollTop || '0', 10);
    mainpart.style.overflow = '';         // 恢复默认
    mainpart.scrollTop = scrollTop;
}

//手机导航栏按钮
var openit = document.getElementById('openit');
var closeit = document.getElementById('closeit');
var mobilemune = document.getElementById('mobilemune');
function openitfc() {
    mobilemune.style.display = 'flex';
    mobilemune.style.visibility = 'visible';
    setTimeout(function () {
        mobilemune.style.opacity = '1';
    }, 250);
    closeit.style.display = 'block';
    openit.style.display = 'none';
};
function closeitfc() {
    mobilemune.style.opacity = '0';
    setTimeout(function () {
        mobilemune.style.visibility = 'hidden';
        mobilemune.style.display = 'none';
    }, 250);
    openit.style.display = 'block';
    closeit.style.display = 'none';
};
openit.onclick = openitfc;
closeit.onclick = closeitfc;


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
            if (!Array.isArray(data) || data.length === 0) break; // 拉完最后一页
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

// 页面加载时初始化当前标签页类型
document.addEventListener('DOMContentLoaded', function () {
    const firstTab = document.querySelector('.tab');
    if (firstTab) {
        currentTabType = firstTab.getAttribute('data-tab');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const firstTab = document.querySelector('.tab[data-tab]');
    if (firstTab) {
        const tabName = firstTab.dataset.tab;
        currentTabType = tabName;
        document.querySelectorAll(`.tab[data-tab="${tabName}"]`).forEach(t => t.classList.add('active'));
    }
});

// 点击任意 tab
document.addEventListener('click', e => {
    const tab = e.target.closest('.tab[data-tab]');
    if (!tab) return;
    const targetTab = tab.dataset.tab;
    if (targetTab === currentTabType) return; // 重复点击当前页
    const targetContent = document.getElementById(targetTab);
    if (!targetContent) {
        console.error('Target content not found:', targetTab);
        return;
    }
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll(`.tab[data-tab="${targetTab}"]`).forEach(t => t.classList.add('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    targetContent.classList.add('active');
    currentTabType = targetTab;
    anime();
    pauseAllVideos();
    mainpart.scrollTo({ top: 0, behavior: 'smooth' });
    closeitfc();
});

function anime() {
    const eles = document.getElementsByClassName('image-item');
    const eles2 = document.getElementsByClassName('aissue');
    // const eles3 = document.getElementById('my-form');
    const eles4 = document.getElementsByClassName('portfolio-item');
    const eles5 = document.getElementsByClassName('guitar-item');
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
    resetStyles(eles4);
    resetStyles(eles5);
    setTimeout(() => {
        triggerAnimation(eles);
        triggerAnimation(eles2);
        triggerAnimation(eles4);
        triggerAnimation(eles5);
    }, 10);
}

// 打印机动画
document.addEventListener("DOMContentLoaded", function () {
    const text = "分享作品和日常"; // 要打印的文本
    const sloganElement = document.getElementById("slogen");
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            sloganElement.textContent += text.charAt(index); // 插入当前字符
            index++; // 移动到下一个字符
            setTimeout(typeWriter, 150); // 每个字符的打印间隔
        } else {
            // 打印完成后，开始逐个删除字符
            setTimeout(() => {
                deleteText();
            }, 2000); // 打印完成后等待2秒，然后开始删除
        }
    }

    function deleteText() {
        if (index > 0) {
            sloganElement.textContent = text.substring(0, index - 1); // 删除最后一个字符
            index--; // 移动到上一个字符
            setTimeout(deleteText, 60); // 删除字符的间隔时间
        } else {
            // 删除完成后，重新开始打印
            setTimeout(() => {
                typeWriter(); // 重新开始打印
            }, 1000); // 删除完成后等待1秒，然后重新开始
        }
    }

    setTimeout(() => {
        typeWriter();
    }, 500); // 启动动画
});

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

//模式切换
var flag = true;
var bgImage1 = 'url("img/sun.svg")'; // 注意路径是相对于HTML文件的
var bgImage2 = 'url("img/moon.svg")';
var switchbutton = document.getElementById('switch');
switchbutton.addEventListener('click', function () {
    if (flag) {
        document.body.classList.add("night");
        switchbutton.style.backgroundImage = bgImage2;
        flag = false;
    }
    else {
        document.body.classList.remove("night");
        switchbutton.style.backgroundImage = bgImage1;
        flag = true;
    }
});

//留言板
var Messageboard = document.getElementById("message-board");
var messageboxbutton = document.getElementById("messageboxbutton");
var flag2 = true;
messageboxbutton.onclick = function () {
    messagemodal.style.display = "block";
    setTimeout(() => {
        messagemodal.style.opacity = 1;
    }, 100);
    freezeScroll();
    flag2 = true;
}

//关闭留言板
// 获取 <span> 元素，设置关闭模态框按钮
var span2 = document.getElementsByClassName("close2")[0];
var messagemodal = document.getElementById("message-content");
// 点击 <span> 元素上的 (x), 关闭模态框
span2.onclick = function () {
    messagemodal.style.opacity = 0;
    setTimeout(() => {
        messagemodal.style.display = "none";
        unfreezeScroll();
    }, "100");
    document.body.classList.remove('no-scroll');
    flag2 = false;
    document.getElementById("my-form-status").style.display = "none";
}

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
    // 定义打开模态框的函数
    function opens(img) {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        freezeScroll();
        setTimeout(() => {
            modalImg.style.opacity = 1;
        }, 100);
        modalImg.onclick = look;
    }

    // 获取 <span> 元素，设置关闭模态框按钮
    span.onclick = function () {
        modalImg.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = "none";
            unfreezeScroll();
            modalImg.classList.remove('zoomed');
            modal.style.cursor = 'zoom-in';
            openpicflag = true;
        }, "100");
        document.body.classList.remove('no-scroll');
    }

    // 使用事件委托处理动态加载的图片点击事件
    document.getElementById('issue-list').addEventListener('click', function (event) {
        const target = event.target;

        // 确保点击的是 img 元素，并且它在 .issue-body 内
        if (target.tagName.toLowerCase() === 'img' && target.closest('.issue-body')) {
            opens(target);
        }
    });
});

// 替换原来的 pauseAllVideos
function pauseAllVideos(excludePlayer) {
    // 1. 原生 <video>
    document.querySelectorAll('video').forEach(v => {
        if (excludePlayer && v === excludePlayer.el().querySelector('video')) return;
        v.pause();
    });

    // 2. Video.js 实例
    if (window.videojs) {
        Object.values(videojs.getPlayers()).forEach(p => {
            if (p !== excludePlayer && !p.paused()) p.pause();
        });
    }
}

/**
 * @param {string}   tabName      data-tab 值
 * @param {Function} loadMoreFn   到底部时执行的加载函数
 * @param {number}   threshold    距离底部多少 px 触发
 */
function initScrollLoader(tabName, loadMoreFn, threshold = 2) {
    const debounced = debounce(() => {
        // 关键：用 mainpart 的滚动信息
        const { scrollTop, clientHeight, scrollHeight } = mainpart;
        const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

        if (nearBottom && currentTabType === tabName) {
            loadMoreFn();
        }
    }, 200);

    // 关键：把事件绑在 mainpart 上
    mainpart.addEventListener('scroll', debounced);
}

// 为各 tab 注册滚动加载
document.addEventListener('DOMContentLoaded', () => {
    // 随笔
    initScrollLoader('issue-content', () => {
        if (window.isLoading) return;
        window.currentPage++;
        renderIssues(window.currentPage, window.perPage, true);
    });

    // 弹棉花
    initScrollLoader('guitar-content', () => {
        if (window.isLoading2) return;
        window.currentPage2++;
        renderGuitars(window.currentPage2, window.perPage2, true);
    });

    // 插画（可选，如已使用“点击加载更多”可跳过）
    initScrollLoader('image-content', () => {
        if (window.loadedImages >= window.imagesData?.length) return;
        createImageElements(window.imagesData, window.imagesPerLoad || 9);
    });
});

//显示导航栏
const nav = document.getElementById('subNav');
const HIDE = 'hide';
mainpart.addEventListener('scroll', () => {
    const top = mainpart.scrollTop;   // ← 用 scrollTop，且用 mainpart 取值
    top > 300
        ? nav.classList.remove(HIDE)
        : nav.classList.add(HIDE);
});

//大图左右切换
(function () {
    let currentImgs = [];   // 当前 issue 的所有图片 src
    let currentIdx = 0;    // 当前显示第几张
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('img01');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    // ✅ 修改：只绑定 #issue-content 内的图片，排除插画模块
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

        // ✅ 单张图片隐藏左右箭头
        const arrowsVisible = currentImgs.length > 1;
        prevBtn.style.display = arrowsVisible ? 'block' : 'none';
        nextBtn.style.display = arrowsVisible ? 'block' : 'none';
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

    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // 键盘左右箭头也能切换
    document.addEventListener('keydown', function (e) {
        if (modal.style.display !== 'block') return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
})();
const mascot = document.getElementById('ipMascot');
const bubble = document.getElementById('ipBubble');
const mascotimg = document.getElementById('ipMascotImg');
const DEFAULT_GIF = 'img/ip-default.gif';
const TALK_GIF   = 'img/ip-talk.gif';
const slogans = [
  '（歪嘴）桀桀桀桀桀桀桀桀桀桀桀桀',
  '所有杀不死我的，都会让我变得更强大！',
  '在下鬼凤，誓要成为一名独当一面的冒险家！',
  '大侠饶命！我刚出新手村！！！',
  '我手里这把剑，虽是新手铁剑，但专治各种不服！',
];
let clickflag = true;
let timer = null; 
mascot.addEventListener('click', () => {
    if (!clickflag) return;
    clickflag = false;
    mascotimg.src = TALK_GIF;

    const idx = Math.floor(Math.random() * slogans.length);
    bubble.textContent = slogans[idx];

    bubble.classList.add('show');
    clearTimeout(timer);

    timer = setTimeout(() => {
        mascotimg.src = DEFAULT_GIF;
        bubble.classList.remove('show');
        clickflag = true;
    }, 2000);
});