window.imagesPerLoad = 9;

// 1. 原始数据：二维数组 → 对象数组
window.imagesData = [
  ['summerbbq.png', '夏日露营'],
  ['Nicholas2.png', '北极星的眼泪'],
  ['cattle.png', '放牛娃'],
  ['fallalone.png', '一叶知秋'],
  ['feelalone.png', '当你孤单你会想起谁'],
  ['gao.png', '永恒'],
  ['grasses.png', '稻草人'],
  ['makesnowman.png', '堆雪人'],
  ['nuhcnay.png', '夏日奇迹'],
  ['pinkspring.png', '春日迟'],
  ['ridethebike.png', '追风少年'],
  ['thelittlepark.png', '未知的相遇'],
  ['fallcamera.png', '秋日相片'],
  ['adventure.png', '命运石之门'],
  ['rowboat.png', '江上泛舟'],
  ['snowmoon.png', '月光'],
  ['spring.png', '春'],
  ['summer.png', '夏'],
  ['nextlife.png', '如果有来生'],
  ['winter.png', '冬日'],
  ['coolman.png', '帅'],
  ['blood.png', '吸血鬼'],
  ['smile.png', '微笑男孩'],
  ['sunset.png', '日落西山'],
  ['sunman.png', '落日垂钓'],
  ['sunboat.png', '飘向远方'],
  ['swordquest.png', '寻剑'],
  ['swordsman.png', '侠客行'],
  ['tothemoon.png', '划向明月的船'],
  ['topinkmoon.png', '月海'],
  ['pinkwinter.png', '粉色的冬天'],
  ['harrypoter.png', '魔法生日'],
  ['anniversary.png', '纪念日'],
  ['rideboat.png', '林间划船'],
  ['forest.png', '森林猎人'],
  ['butterfly.png', '阿飞的小蝴蝶'],
  ['umbrella.png', '雨蝶'],
  ['unamenight.png', '没有名字的夜晚'],
  ['clouds.png', '云舒']
].map(([file, alt]) => ({
  src: `https://cdn.grayfen.cn/${file}`,
  alt,
  smallSrc: `https://cdn.grayfen.cn/${file.replace('.png', '_zip.jpg')}`
}));

// 2. 洗牌（仅一次）
shuffleArray(imagesData);

// 3. 图片懒加载相关变量
let loadedImages = 0;

// 4. 工具函数
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// 5. 创建 DOM 并插入
// 5. 创建 DOM 并插入
function createImageElements(arr, limit) {
  if (loadedImages >= arr.length) return;

  const container = document.getElementById('works');
  const loadpic = document.getElementById('loadpic');
  const allpic = document.getElementById('allpic');
  allpic.textContent = arr.length;

  const fragment = document.createDocumentFragment();
  const sliceEnd = Math.min(loadedImages + limit, arr.length);

  for (let i = loadedImages; i < sliceEnd; i++) {
    const { src, alt, smallSrc } = arr[i];

    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = smallSrc;
    img.alt = alt;
    img.className = 'image-item';
    img.dataset.src = src;

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.textContent = alt;

    li.append(img, overlay);
    li.addEventListener('click', () => opens(li));
    fragment.appendChild(li);
  }

  container.appendChild(fragment);

  // ✅ 强制重排，确保动画触发
  container.offsetHeight;

  // ✅ 再触发动画
  anime();

  loadedImages = sliceEnd;
  loadpic.textContent = loadedImages;

  const moreBtn = document.getElementById('more');
  if (loadedImages >= arr.length) {
    setTimeout(() => {
      moreBtn.textContent = '加载到底部啦~';
      moreBtn.style.cursor = 'unset';
      moreBtn.style.pointerEvents = 'none';
    }, 300);
  }
}

// 6. 首次加载
createImageElements(imagesData, window.imagesPerLoad);

// 7. 点击“加载更多”
document.getElementById('more').addEventListener('click', () =>
  createImageElements(imagesData, window.imagesPerLoad)
);

// 8. 刷新回到顶部
window.onbeforeunload = () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

// 9. 模态框相关
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('img01');

function opens(li) {
  modal.style.display = 'block';
  modalImg.src = li.querySelector('img').dataset.src;
  modalImg.alt = li.querySelector('img').alt;
  freezeScroll();
  openpicflag = true;

  // ✅ 隐藏左右箭头
  document.querySelector('.modal-prev').style.display = 'none';
  document.querySelector('.modal-next').style.display = 'none';

  setTimeout(() => {
    modalImg.style.opacity = 1;
    modal.style.cursor = 'zoom-in';
  }, 100);

  modalImg.onclick = look;
}