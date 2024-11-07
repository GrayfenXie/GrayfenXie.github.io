const imagesData = [
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
  { src: 'https://cdn.grayfen.cn/camera.png', alt: '秋日相片' },
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
  { src: 'https://cdn.grayfen.cn/tothemoon2.png', alt: '随波逐流' },
  { src: 'https://cdn.grayfen.cn/pinkwinter.png', alt: '粉色的冬天' },
];

//jq动画
window.onload = anime()
function anime() {
  var eles = document.getElementsByTagName('img')
  var lxl = 1
  setTimeout(()=>{
    for (var i = 0; i < eles.length; i++) {
      eles[i].style.transform = 'scale(' + lxl + ')'
      eles[i].style.opacity = '1'
    }
  },20)
}

//查看原图
var modal = document.getElementById('myModal');
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
function opens(self) {
  modal.style.display = "block";
  modalImg.src = self.previousElementSibling.src;
  modalImg.alt = self.previousElementSibling.alt;
  document.getElementById('myModal').scrollTop = 0;
  document.onkeydown = false;
  document.body.classList.add('no-scroll');
  setTimeout(() => {
    modalImg.style.opacity = 1;
  }, "100");
}
var a = document.getElementsByClassName("modal-content");
var b = document.getElementsByClassName("modal");
var flag = true;
function look(self) {
  if (flag) {
    for (var i = a.length - 1; i >= 0; i--) {
      b[i].style.cursor = "zoom-out";
      a[i].style.width = "100vw";
      a[i].style.height = "auto";
    }
    flag = false;
  }
  else {
    for (var i = a.length - 1; i >= 0; i--) {
      b[i].style.cursor = "zoom-in";
      a[i].style.height = "100%";
      a[i].style.width = "auto";
    }
    flag = true;
  }
}
// 获取 <span> 元素，设置关闭模态框按钮
var span = document.getElementsByClassName("close")[0];
// 点击 <span> 元素上的 (x), 关闭模态框
span.onclick = function () {
  modalImg.style.opacity = 0;
  setTimeout(() => {
    modal.style.display = "none";
  }, "100");
  document.body.classList.remove('no-scroll');
  for (var i = a.length - 1; i >= 0; i--) {
    a[i].style.height = "100%";
    a[i].style.width = "auto";
    b[i].style.cursor = "zoom-in";
  }
}
// 当前已加载图片数量
let loadedImages = 0;
const imagesPerLoad = 9; // 每次加载的图片数量

// 函数用于洗牌数组
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 函数用于创建img元素并赋值src和alt
function createImageElements(imagesArray, limit) {
  const container = document.getElementById('works');
  let imagesToLoad = imagesArray.slice(loadedImages, loadedImages + limit);

  imagesToLoad.forEach(image => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.textContent = image.alt;
    li.appendChild(img);
    li.appendChild(overlay);
    container.appendChild(li);
    overlay.addEventListener('click', function () {
      opens(this);
    });
  });

  loadedImages += limit;
  if (loadedImages >= imagesArray.length) {
    setTimeout(() => {
      document.getElementById('more').innerHTML = '已加载到底部';
    }, "300");
  }
  anime();
}

// 初始化加载9张图片
shuffleArray(imagesData);
createImageElements(imagesData, imagesPerLoad);

// 检查是否滚动到底部并加载更多图片
function checkScrollPosition() {
  const nearBottomThreshold = 5; // 当距离底部5px时开始加载
  if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - nearBottomThreshold &&
      loadedImages < imagesData.length) {
    createImageElements(imagesData, imagesPerLoad);
  }
}

// 监听滚动事件
window.addEventListener('scroll', checkScrollPosition);