var imageArray = [
    'https://cdn.grayfen.cn/summerbbq.png',
    'https://cdn.grayfen.cn/Nicholas2.png',
    'https://cdn.grayfen.cn/cattle.png',
    'https://cdn.grayfen.cn/fallalone.png',
    'https://cdn.grayfen.cn/feelalone.png',
    'https://cdn.grayfen.cn/gao.png',
    'https://cdn.grayfen.cn/grasses.png',
    'https://cdn.grayfen.cn/makesnowman.png',
    'https://cdn.grayfen.cn/nuhcnay.png',
    'https://cdn.grayfen.cn/pinkspring.png',
    'https://cdn.grayfen.cn/ridethebike.png',
    'https://cdn.grayfen.cn/thelittlepark.png',
]
var newArr = [];
while (imageArray.length != 0) {
    var index = Math.floor(Math.random() * imageArray.length); 
    newArr.push(imageArray[index]);
    imageArray.splice(index, 1);
}
const imageContainer = document.getElementById('works');
newArr.forEach(src => {
  const li = document.createElement('li');
  const img = document.createElement('img');
  var pre = new RegExp("https://cdn.grayfen.cn/");
  img.src = src;
  img.alt = src.replace(pre," ");
  imageContainer.appendChild(li).appendChild(img);
});
window.onload=function(){
    var eles = document.getElementsByTagName("img");
    var lxl = 1;
    for (var i = 0; i < eles.length; i++) {
            eles[i].style.transform = "scale("+ lxl +")";
    }
}