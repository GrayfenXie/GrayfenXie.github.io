// var imageArray = [
//   'https://cdn.grayfen.cn/summerbbq.png',
//   'https://cdn.grayfen.cn/Nicholas2.png',
//   'https://cdn.grayfen.cn/cattle.png',
//   'https://cdn.grayfen.cn/fallalone.png',
//   'https://cdn.grayfen.cn/feelalone.png',
//   'https://cdn.grayfen.cn/gao.png',
//   'https://cdn.grayfen.cn/grasses.png',
//   'https://cdn.grayfen.cn/makesnowman.png',
//   'https://cdn.grayfen.cn/nuhcnay.png',
//   'https://cdn.grayfen.cn/pinkspring.png',
//   'https://cdn.grayfen.cn/ridethebike.png',
//   'https://cdn.grayfen.cn/thelittlepark.png',
//   'https://cdn.grayfen.cn/camera.png',
//   'https://cdn.grayfen.cn/adventure.png',
//   'https://cdn.grayfen.cn/rowboat.png',
//   'https://cdn.grayfen.cn/snowmoon.png',
//   'https://cdn.grayfen.cn/spring.png',
//   'https://cdn.grayfen.cn/summer.png',
//   'https://cdn.grayfen.cn/nextlife.png',
//   'https://cdn.grayfen.cn/winter.png',
//   'https://cdn.grayfen.cn/coolman.png',
//   'https://cdn.grayfen.cn/blood.png',
//   'https://cdn.grayfen.cn/smile.png',
//   'https://cdn.grayfen.cn/umbrella.png',
// ]
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
  { src: 'https://cdn.grayfen.cn/umbrella.png', alt: '撑伞' },
];

// 函数用于洗牌数组
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 函数用于创建img元素并赋值src和alt
function createImageElements(imagesArray) {
  // 获取一个容器元素，用于存放所有的img元素
  const container = document.getElementById('works');

  // 遍历数组中的每个对象
  imagesArray.forEach(image => {
    // 创建一个新的li元素
    const li = document.createElement('li');
    
    // 创建一个新的img元素
    const img = document.createElement('img');
    // 为img元素设置src和alt属性
    img.src = image.src;
    img.alt = image.alt;
     // 创建一个遮罩层
     const overlay = document.createElement('div');
     overlay.className = 'image-overlay';
     overlay.textContent = image.alt;
     
     // 将img元素和遮罩层添加到li元素中
     li.appendChild(img);
     li.appendChild(overlay);
     
     // 将li元素添加到容器中
     container.appendChild(li);
  });
}

// 调用洗牌函数
shuffleArray(imagesData);

// 调用函数，传入数组
createImageElements(imagesData);

//jq动画
window.onload = function () {
   var eles = document.getElementsByTagName('img')
   var lxl = 1
   for (var i = 0; i < eles.length; i++) {
     eles[i].style.transform = 'scale(' + lxl + ')'
   }
 }
// var newArr = []
// while (imageArray.length != 0) {
//   var index = Math.floor(Math.random() * imageArray.length)
//   newArr.push(imageArray[index])
//   imageArray.splice(index, 1)
// }
// const imageContainer = $('#works')
// newArr.forEach((src) => {
//   imageContainer.append(`
//     <li class="works-item">
//       <div class="works-item__text">${src.replace(pre, ' ')}</div>
//     </li>
//   `)
// })

