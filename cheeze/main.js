// main.js

// 表示するテキストの配列を作成
const texts = [
    '2',
    '2',
    '4',
    '4',
    '8',
    '8',
    // 追加のテキスト
];

let currentIndex = 0;
let intervalId1, intervalId2;

function startSlot() {
    // スロットのようにランダムな数値を表示する
    intervalId1 = setInterval(() => {
        const randomNumber1 = Math.floor(Math.random() * random_range); // 0から99までのランダムな数値
        const textElement1 = document.getElementById('text-container1');
        textElement1.textContent = randomNumber1;
    }, 100); // 100msごとに更新

    intervalId2 = setInterval(() => {
        const randomNumber2 = Math.floor(Math.random() * random_range); // 0から99までのランダムな数値
        const textElement2 = document.getElementById('text-container2');
        textElement2.textContent = randomNumber2;
    }, 100); // 100msごとに更新
}

function showText() {
    // スロットの動きを停止する
    clearInterval(intervalId1);
    clearInterval(intervalId2);

    // 効果音を再生
    const audio = document.getElementById('slot-sound');
    audio.play();

    // 事前に指定したテキストを表示
    const textElement1 = document.getElementById('text-container1');
    const textElement2 = document.getElementById('text-container2');
    textElement1.textContent = texts[currentIndex];
    textElement2.textContent = texts[(currentIndex + 1) % texts.length]; // 2つ目は次のテキスト

    // 次のテキストに移動（次のラウンドのため）
    currentIndex++;
    if (currentIndex >= texts.length) {
        currentIndex = 0;
    }

    // ボタンのテキストを「Restart」に変更
    const button = document.getElementById('next-button');
    button.textContent = 'Restart';

    // ボタンのイベントリスナーを変更（Restartでスロットを再開）
    button.removeEventListener('click', showText);
    button.addEventListener('click', restartSlot);
}

function restartSlot() {
    startSlot(random_range = 10);
    
    // ボタンのテキストを「Stop」に戻す
    const button = document.getElementById('next-button');
    button.textContent = 'Stop';

    // イベントリスナーを元に戻す
    button.removeEventListener('click', restartSlot);
    button.addEventListener('click', showText);
}

document.getElementById('next-button').addEventListener('click', showText);

// ページロード時にスロットを開始
window.onload = startSlot(random_range = 10);
