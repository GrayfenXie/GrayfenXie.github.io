window.imagesPerLoad = 9; 
window.imagesData = [
  { src: 'https://cdn.grayfen.cn/summerbbq.png', alt: '夏日露营' },
  { src: 'https://cdn.grayfen.cn/Nicholas2.png', alt: '北极星的眼泪' },
  { src: 'https://cdn.grayfen.cn/cattle.png', alt: '放牛娃' },
  { src: 'https://cdn.grayfen.cn/fallalone.png', alt: '一叶知秋' },
  { src: 'https://cdn.grayfen.cn/feelalone.png', alt: '当你孤单你会想起谁' },
  { src: 'https://cdn.grayfen.cn/gao.png', alt: '永恒' },
  { src: 'https://cdn.grayfen.cn/grasses.png', alt: '稻草人' },
  { src: 'https://cdn.grayfen.cn/makesnowman.png', alt: '堆雪人' },
  { src: 'https://cdn.grayfen.cn/nuhcnay.png', alt: '夏日奇迹' },
  { src: 'https://cdn.grayfen.cn/pinkspring.png', alt: '春日迟' },
  { src: 'https://cdn.grayfen.cn/ridethebike.png', alt: '追风少年' },
  { src: 'https://cdn.grayfen.cn/thelittlepark.png', alt: '未知的相遇' },
  { src: 'https://cdn.grayfen.cn/fallcamera.png', alt: '秋日相片' },
  { src: 'https://cdn.grayfen.cn/adventure.png', alt: '命运石之门' },
  { src: 'https://cdn.grayfen.cn/rowboat.png', alt: '江上泛舟' },
  { src: 'https://cdn.grayfen.cn/snowmoon.png', alt: '月光' },
  { src: 'https://cdn.grayfen.cn/spring.png', alt: '春' },
  { src: 'https://cdn.grayfen.cn/summer.png', alt: '夏' },
  { src: 'https://cdn.grayfen.cn/nextlife.png', alt: '如果有来生' },
  { src: 'https://cdn.grayfen.cn/winter.png', alt: '冬日' },
  { src: 'https://cdn.grayfen.cn/coolman.png', alt: '帅' },
  { src: 'https://cdn.grayfen.cn/blood.png', alt: '吸血鬼' },
  { src: 'https://cdn.grayfen.cn/smile.png', alt: '微笑男孩' },
  { src: 'https://cdn.grayfen.cn/sunset.png', alt: '日落西山' },
  { src: 'https://cdn.grayfen.cn/sunman.png', alt: '落日垂钓' },
  { src: 'https://cdn.grayfen.cn/sunboat.png', alt: '飘向远方' },
  { src: 'https://cdn.grayfen.cn/swordquest.png', alt: '寻剑' },
  { src: 'https://cdn.grayfen.cn/swordsman.png', alt: '侠客行' },
  { src: 'https://cdn.grayfen.cn/tothemoon.png', alt: '划向明月的船' },
  { src: 'https://cdn.grayfen.cn/topinkmoon.png', alt: '月海' },
  { src: 'https://cdn.grayfen.cn/pinkwinter.png', alt: '粉色的冬天' },
  { src: 'https://cdn.grayfen.cn/harrypoter.png', alt: '魔法生日' },
  { src: 'https://cdn.grayfen.cn/anniversary.png', alt: '纪念日' },
  { src: 'https://cdn.grayfen.cn/rideboat.png', alt: '林间划船' },
  { src: 'https://cdn.grayfen.cn/forest.png', alt: '森林猎人' },
  { src: 'https://cdn.grayfen.cn/butterfly.png', alt: '阿飞的小蝴蝶' },
  { src: 'https://cdn.grayfen.cn/umbrella.png', alt: '雨蝶' },
  { src: 'https://cdn.grayfen.cn/unamenight.png', alt: '没有名字的夜晚' },
  { src: 'https://cdn.grayfen.cn/clouds.png', alt: '云舒' }
];

//jq动画
window.onload = anime();

window.onbeforeunload = function () {
  //刷新后页面自动回到顶部
  document.documentElement.scrollTop = 0;  //ie下
  document.body.scrollTop = 0;  //非ie
}

//查看原图
var modal = document.getElementById('myModal');
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var a = document.getElementsByClassName("modal-content");
var b = document.getElementsByClassName("modal");
var flag = true;

function opens(self) {
  modal.style.display = "block";
  modalImg.src = self.firstElementChild.src;
  modalImg.alt = self.firstElementChild.alt;
  // 记录当前滚动位置
  originalScrollPosition = window.scrollY || document.documentElement.scrollTop;
  // 添加禁止滚动的类
  document.body.classList.add('no-scroll');
  // 将页面滚动位置设置为之前记录的位置，以避免页面跳转
  document.body.style.position = 'fixed';
  document.body.style.top = -originalScrollPosition + 'px';
  flag = true;
  setTimeout(() => {
    modalImg.style.opacity = 1;
    for (var i = a.length - 1; i >= 0; i--) {
      b[i].style.cursor = "zoom-in";
    }
  }, 100);
}
function look(self) {
  if (flag) {
    //放大
    for (var i = a.length - 1; i >= 0; i--) {
      b[i].style.cursor = "zoom-out";
      a[i].classList.add('big');
    }
    flag = false;
  }
  else {
    //缩小
    for (var i = a.length - 1; i >= 0; i--) {
      b[i].style.cursor = "zoom-in";
      a[i].classList.remove('big');
    }
    flag = true;
  }
}
// 当前已加载图片数量
let loadedImages = 0;
// const imagesPerLoad = 9; // 每次加载的图片数量

// 函数用于洗牌数组
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 函数用于创建img元素并赋值src和alt
var loadnum = 0;
function createImageElements(imagesArray, limit) {
  const container = document.getElementById('works');
  let imagesToLoad = imagesArray.slice(loadedImages, loadedImages + limit);
  var loadpic = document.getElementById('loadpic');
  var allpic = document.getElementById('allpic');
  allpic.innerHTML = imagesArray.length;
  imagesToLoad.forEach(image => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.className = 'image-item';
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.textContent = image.alt;
    li.appendChild(img);
    li.appendChild(overlay);
    container.appendChild(li);
    li.addEventListener('click', function () {
      opens(this);
    });
  });
  loadedImages += limit;
  loadnum = loadnum + limit;
  const moreButton = document.getElementById('more');
  if (loadedImages >= imagesArray.length) {
    setTimeout(() => {
      loadpic.innerHTML = imagesArray.length;
      moreButton.innerHTML = '加载到底部啦~';
      moreButton.style.cursor = 'unset';
      moreButton.style.pointerEvents = "none";
    }, "300")
  } else {
    loadpic.innerHTML = loadnum;
  }
  anime();
}

// 初始化加载9张图片
shuffleArray(imagesData);
createImageElements(imagesData, imagesPerLoad);

//点击加载更多
var more = document.getElementById("more");
more.addEventListener("click", function () {
  createImageElements(imagesData, imagesPerLoad);
});