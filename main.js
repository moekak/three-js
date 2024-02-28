import "./style.css";
import * as THREE from "three";

// キャンバス用意
const canvas = document.querySelector("#webgl");

// シーンを追加
const scene = new THREE.Scene();

// 背景用のテクスチャ(背景を追加する)
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("img/scene-bg.jpg");
scene.background = bgTexture;

// サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
// レンダラーのサイズ
renderer.setSize(sizes.width, sizes.height);

// レンダラーのピクセル比を設定する。高解像度のディスプレイ（例えば、Retinaディスプレイなど）でのグラフィックスの表示品質を向上させるのに重要
renderer.setPixelRatio(window.devicePixelRatio);

// オブジェクトを作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);


const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const trousMaterial = new THREE.MeshNormalMaterial()
const torus = new THREE.Mesh(torusGeometry, trousMaterial)
torus.position.set(0, 1, 10)
scene.add(box, torus);

// 線形補間で滑らかに移動させる
// x = スタート地点, y = 終了地点, a = 滑らか度合い
function lerp(x,y,a){
  return (1-a) * x + a * y
}

// scrollPercentがこの範囲内にどの程度進んでいるかを0から1の値で返す
function scalePercent(start, end){
  return (scrollParcent - start) / (end - start)
}


// スクロールアニメーション
const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  function(){
    camera.lookAt(box.position)
    camera.position.set(0, 1, 10)
    box.position.z = lerp(-15, 2, scalePercent(0, 40))
    torus.position.z = lerp(10, -30, scalePercent(0, 40))
  }
})

animationScripts.push({
  start: 40,
  end: 60,
  function(){
    camera.lookAt(box.position)
    camera.position.set(0, 1, 10)
    box.rotation.z = lerp(1, Math.PI /**回転具合（この場合は180度） */, scalePercent(40, 60))

  }
})

animationScripts.push({
  start: 60,
  end: 80,
  function(){
    camera.lookAt(box.position)
    camera.position.x = lerp(0, -15, scalePercent(60, 80))
    camera.position.y = lerp(1, 15, scalePercent(60, 80))
    camera.position.z = lerp(10, 25, scalePercent(60, 80))

  }
})

animationScripts.push({
  start: 80,
  end: 100,
  function(){
    camera.lookAt(box.position)
    box.rotation.x += 0.02
    box.rotation.y += 0.02

  }
})

// アニメーション開始
function playScrollAnimation(){
  animationScripts.forEach((animation)=>{
    if(scrollParcent >= animation.start && scrollParcent <= animation.end){
      animation.function()
    }
    
  })
}

let scrollParcent = 0;
// ブラウザのスクロール率を取得する
document.body.onscroll = ()=>{

  // ページの現在のスクロール位置が全体のどの位置にあるかをパーセンテージで表す式
  scrollParcent = (document.documentElement.scrollTop /**現在のスクロール位置 */ / (document.documentElement.scrollHeight /**ページの全体の高さ*/  - document.documentElement.clientHeight)) * 100 /**現在ユーザーに表示されているページの部分の高さ */ 


}


// アニメーション
const tick = () => {
  //次のフレーム（画面が更新される次の瞬間）が来たら、またtick関数を呼ぶようにブラウザに伝える
  window.requestAnimationFrame(tick);

  playScrollAnimation()
  // 3Dの世界（scene）をカメラ（camera）を使って画面に描画する命令。作った3Dの世界が画面に表示される
  renderer.render(scene, camera);
};

tick();

// ブラウザのリサイズ操作(これはコピペで使える。おまじないみたいなもの)
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  // カメラのアスペクト比を変えたら必ず書かないといけない記述
  camera.updateProjectionMatrix();
  // レンダラーのサイズも更新する
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});


window.addEventListener("onload", ()=>{
  window.scrollTo(0, 0)
})