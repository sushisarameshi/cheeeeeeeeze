// main.js

// 表示するテキストの配列を作成
const texts = [
    '2','2',    // 〇   *2
    '1','7',    // ×    *2
    '3','3',    // 〇   *2
    '8','8',    // 〇   *4
    '1','1',    // 〇   *8
    '5','6',    // ×    *8
    '5','5',    // 〇   *2
    '7','7',    // 〇   *4
    '3','3',    // 〇   *8
    '9','9',    // 〇   *16
    '5','5',    // 〇   *32
    '9','9',    // 〇   *64
    '2','2',    // 〇   *128
    '3','3',    // 〇   *256
    '8','2',    // ×    *512
    // 追加のテキスト
];

let currentIndex = 0;
let intervalId1, intervalId2;
let zorome_count = 0;
let isFirstSlotStopped = false; // 追加: 1つ目のスロットが止まったかどうかを管理

// random_range を定義して範囲を設定
const random_range = 10;// 0から10までのランダムな数値範囲を定義

function startSlotInterval(intervalId, textContainerId) {
    intervalId = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * random_range); // 0からrandom_rangeまでのランダムな数値
        document.getElementById(textContainerId).textContent = randomNumber;
    }, 100); // 100msごとに更新

    return intervalId;
}

// スロットの動作を開始する関数
function startSlot() {
    intervalId1 = startSlotInterval(intervalId1, 'text-container1');
    intervalId2 = startSlotInterval(intervalId2, 'text-container2');
}

// スロットを停止する関数
function stopSlot() {
    clearInterval(intervalId1);
    clearInterval(intervalId2);
}

// スロットを1個止める関数
function stopFirstSlot() {
    // 追加: 1つ目のスロットを止める処理
    clearInterval(intervalId1);
    const textElement1 = document.getElementById('text-container1');
    textElement1.textContent = texts[currentIndex];
    isFirstSlotStopped = true;

}

function showText() {
    if (!isFirstSlotStopped) {
        // 1つ目のスロットを止める
        stopFirstSlot();
        } else {
            // 2つ目のスロットを止めて結果を表示
            stopSlot();

            // 事前に指定したテキストを表示
            const textElement1 = document.getElementById('text-container1');
            const textElement2 = document.getElementById('text-container2');
            const disp_cont = document.getElementById('disp_cont');
            textElement1.textContent = texts[currentIndex];
            textElement2.textContent = texts[(currentIndex + 1) % texts.length]; // 2つ目は次のテキスト

        // ゾロ目時処理
        if (texts[currentIndex] == texts[(currentIndex + 1) % texts.length]){
            zorome_count++;
            disp_cont.textContent = 'チーズ' + 2**(zorome_count) + '倍！';       // ？倍表示
                // 同じ音源を複数重ねて再生する
            playSound('Cheer-Yay02-1(High-Long-Solo).mp3');
        }else if (zorome_count != 0){
            disp_cont.textContent = 'チーズ' + 2**(zorome_count) + '倍決定！';   // 倍率決定後表示
            zorome_count=0;
        }else{
            disp_cont.textContent = '残念！';                              // 1回も当たらなかったとき
        }

        // 次のテキストに移動（次のラウンドのため）
        currentIndex += 2;
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
}

function restartSlot() {
    intervalId1 = startSlotInterval(intervalId1, 'text-container1');
    intervalId2 = startSlotInterval(intervalId2, 'text-container2');

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
        disp_cont.textContent = 'ゾロ目が揃えばチーズ' + 2**(zorome_count+1) +'倍';       // ？倍表示
    }else{
        disp_cont.textContent = 'チーズ？倍';       // ？倍表示
    }

    // イベントリスナーを元に戻す
    button.removeEventListener('click', restartSlot);
    button.addEventListener('click', showText);

    // スロット停止状態をリセット
    isFirstSlotStopped = false;
}

document.getElementById('next-button').addEventListener('click', showText);

//起動時スロット表示
window.addEventListener('load', function(){
    intervalId1 = startSlotInterval(intervalId1, 'text-container1');
    intervalId2 = startSlotInterval(intervalId2, 'text-container2');
});

// 効果音を動的に生成して再生する関数
function playSound(url) {
    const audio = new Audio(url); // 新しい Audio オブジェクトを作成
    audio.play(); // 効果音を再生
}
