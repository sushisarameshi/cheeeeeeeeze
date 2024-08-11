// main.js

// 表示するテキストの配列を作成
const texts = [
    '2','2',
    '1','7',
    '3','3',
    '8','8',
    '1','1',
    '5','6',
    '5','5',
    '7','7',
    '3','3',
    '9','9',
    '5','5',
    '9','9',
    '2','2',
    '3','3',
    '8','2',
    // 追加のテキスト
];

const disp_txt = [
    'チーズ？倍',
    'チーズ２倍！',
    '２倍決定！',
    'チーズ２倍！',
    'チーズ４倍！',
    'チーズ８倍！',
    '８倍決定！',
    'チーズ２倍！',
    'チーズ４倍！',
    'チーズ８倍！',
    'チーズ１６倍！',
    'チーズ３２倍！',
    'チーズ６４倍！',
    'チーズ１２８倍！',
    'チーズ２５６倍！',
    'チーズ２５６決定！',
];

let currentIndex = 0;
let disp_txt_idx = 0;
let intervalId1, intervalId2;

// random_range を定義して範囲を設定
const random_range = 10;// 0から10までのランダムな数値範囲を定義

function startSlot() {
    // スロットのようにランダムな数値を表示する
    intervalId1 = setInterval(() => {
        const randomNumber1 = Math.floor(Math.random() * random_range); // 0からrandom_rangeまでのランダムな数値
        const textElement1 = document.getElementById('text-container1');
        textElement1.textContent = randomNumber1;
    }, 100); // 100msごとに更新

    intervalId2 = setInterval(() => {
        const randomNumber2 = Math.floor(Math.random() * random_range); // 0からrandom_rangeまでのランダムな数値
        const textElement2 = document.getElementById('text-container2');
        textElement2.textContent = randomNumber2;
    }, 100); // 100msごとに更新
}

function showText() {
    // スロットの動きを停止する
    clearInterval(intervalId1);
    clearInterval(intervalId2);

    // 事前に指定したテキストを表示
    const textElement1 = document.getElementById('text-container1');
    const textElement2 = document.getElementById('text-container2');
    const disp_cont = document.getElementById('disp_cont');
    textElement1.textContent = texts[currentIndex];
    textElement2.textContent = texts[(currentIndex + 1) % texts.length]; // 2つ目は次のテキスト
    disp_cont.textContent = disp_txt[disp_txt_idx+1];    // ？倍表示用

    // 効果音を再生
    if (texts[currentIndex] == texts[(currentIndex + 1) % texts.length]){
        const audio = document.getElementById('slot-sound');
        audio.play();
    }

    // 次のテキストに移動（次のラウンドのため）
    currentIndex+=2;
    if (currentIndex >= texts.length) {
        currentIndex = 0;
    }
    disp_txt_idx++;
    if (disp_txt_idx >= disp_txt.length) {
        disp_txt_idx = 0;
    }

    // ボタンのテキストを「Restart」に変更
    const button = document.getElementById('next-button');
    button.textContent = 'Restart';

    // ボタンのイベントリスナーを変更（Restartでスロットを再開）
    button.removeEventListener('click', showText);
    button.addEventListener('click', restartSlot);
}

function restartSlot() {
    startSlot();
    
    // ボタンのテキストを「Stop」に戻す
    const button = document.getElementById('next-button');
    button.textContent = 'Stop';

    // テキストを「？倍」に戻す
    const textElement1 = document.getElementById('text-container1');
    const textElement2 = document.getElementById('text-container2');
    const disp_cont = document.getElementById('disp_cont');
    textElement1.textContent = texts[currentIndex];
    textElement2.textContent = texts[(currentIndex + 1) % texts.length]; // 2つ目は次のテキスト
    if (texts[currentIndex-2] == texts[(currentIndex + 1) % texts.length-2]){
        disp_cont.textContent = disp_txt[disp_txt_idx];    // ？倍表示用
    }else{
        disp_cont.textContent = disp_txt[0];    // ？倍表示用
    }

    // イベントリスナーを元に戻す
    button.removeEventListener('click', restartSlot);
    button.addEventListener('click', showText);
}

document.getElementById('next-button').addEventListener('click', showText);

// startSlot() を呼び出すだけで random_range の設定は不要
window.onload = startSlot;