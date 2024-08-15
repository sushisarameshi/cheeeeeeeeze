// main.js

// 表示するテキストの配列を作成
const texts = [
    '2','2',    // 〇   *2
    '6','6',    // 〇   *2
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
    '8','8',    // 〇   *512
    '7','7',    // 〇   *1024
    '1','2',    // ×    *2048
    // 追加のテキスト
];

// 数字に対応する色を定義
const numberColors = {
    '1': '#FF5733', // 赤
    '2': '#33FF57', // 緑
    '3': '#3357FF', // 青
    '4': '#FFFF33', // 黄
    '5': '#FF33FF', // ピンク
    '6': '#33FFFF', // シアン
    '7': '#FFA533', // オレンジ
    '8': '#A533FF', // 紫
    '9': '#333333'  // 黒
};

let currentIndex = 0;
let intervalId1, intervalId2;
let zorome_count = 0;
let isFirstSlotStopped = false; // 追加: 1つ目のスロットが止まったかどうかを管理
let drumrollAudio; // 追加: ドラムロール効果音のオーディオオブジェクト
let window_load_roopEnd = 0;
let disp_size = 8;
let disp_size_base = 3;

// random_range を定義して範囲を設定
const random_range = 10;// 0から10までのランダムな数値範囲を定義

function startSlotInterval(intervalId, textContainerId) {
    intervalId = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * random_range); // 0からrandom_rangeまでのランダムな数値
        const textElement = document.getElementById(textContainerId);
        textElement.textContent = randomNumber;
        
        // 数字に応じて色を設定
        if (numberColors[randomNumber]) {
            textElement.style.color = numberColors[randomNumber];
        }
    }, 100); // 100msごとに更新
    return intervalId;
}

// スロットを停止する関数
function stopSlot() {
    clearInterval(intervalId1);
    clearInterval(intervalId2);

    stopPlayLoop(); // ドラムロール効果音の再生を停止
}

// スロットを1個止める関数
function stopFirstSlot() {
    // 追加: 1つ目のスロットを止める処理
    clearInterval(intervalId1);
    const textElement1 = document.getElementById('text-container1');
    textElement1.textContent = texts[currentIndex];

    // 数字に応じて色を設定
    if (numberColors[texts[currentIndex]]) {
        textElement1.style.color = numberColors[texts[currentIndex]];
    }

    isFirstSlotStopped = true;
}

function showText() {
    if (!isFirstSlotStopped) {
        stopFirstSlot();    // 1つ目のスロットを止める
        if (window_load_roopEnd){
            playSound('roollEnd.mp3');  // 効果音を再生
        }
        window_load_roopEnd++

    } else {
        stopSlot();     // 2つ目のスロットを止めて結果を表示
        playSound('roollEnd.mp3');  // 効果音を再生
        // 事前に指定したテキストを表示
        const textElement1 = document.getElementById('text-container1');
        const textElement2 = document.getElementById('text-container2');
        const disp_cont = document.getElementById('disp_cont');
        const disp_result = document.getElementById('disp_result');
        textElement1.textContent = texts[currentIndex];
        textElement2.textContent = texts[(currentIndex + 1) % texts.length]; // 2つ目は次のテキスト

        // 数字に応じて色を設定
        if (numberColors[texts[currentIndex]]) {
            textElement1.style.color = numberColors[texts[currentIndex]];
        }
        if (numberColors[texts[(currentIndex + 1) % texts.length]]) {
            textElement2.style.color = numberColors[texts[(currentIndex + 1) % texts.length]];
        }


        // ゾロ目時処理
        if (texts[currentIndex] == texts[(currentIndex + 1) % texts.length]){
            zorome_count++;
            disp_cont.textContent = 2**(zorome_count) + '倍！';       // ？倍表示
            disp_result.textContent = '現在：チーズ' + 2**(zorome_count) + '倍！';       // ？倍表示
            disp_result.style.fontSize = (disp_size_base+(zorome_count))*disp_size + 'px';
            playSound('Cheer-Yay02-1(High-Long-Solo).mp3');  // 効果音を再生
        }else if (zorome_count != 0){
            disp_cont.textContent = 'やったね！';   // 倍率決定後表示
            disp_result.textContent = '結果：チーズ' + 2**(zorome_count) + '倍！';       // ？倍表示
            disp_result.style.fontSize = (disp_size_base+(zorome_count))*disp_size + 'px';
            zorome_count=0;
        }else{
            disp_cont.textContent = '残念！';   // 1回も当たらなかったとき
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
    playLoop('drumroll.mp3'); // ドラムロール効果音の再生を開始
    intervalId1 = startSlotInterval(intervalId1, 'text-container1');
    intervalId2 = startSlotInterval(intervalId2, 'text-container2');

    // ボタンのテキストを「Stop」に戻す
    const button = document.getElementById('next-button');
    button.textContent = 'Stop';

    // テキストを「？倍」に戻す
    const textElement1 = document.getElementById('text-container1');
    const textElement2 = document.getElementById('text-container2');
    const disp_cont = document.getElementById('disp_cont');
    const disp_result = document.getElementById('disp_result');
    textElement1.textContent = texts[currentIndex];
    textElement2.textContent = texts[(currentIndex + 1) % texts.length]; // 2つ目は次のテキスト
    if (texts[currentIndex-2] == texts[(currentIndex + 1) % texts.length-2]){
        disp_cont.textContent = 'ゾロ目が揃えば' + 2**(zorome_count+1) +'倍';       // ？倍表示
        disp_result.textContent = '現在：チーズ' + 2**(zorome_count) + '倍！';       // ？倍表示
        if(zorome_count == 0){
            disp_result.style.fontSize = 20 + 'px';
        }else{
            disp_result.style.fontSize = (disp_size_base+(zorome_count))*disp_size + 'px';
        }
        
    }else{
        disp_cont.textContent = '？倍';       // ？倍表示
        disp_result.textContent = '現在：チーズ' + 2**(zorome_count) + '倍！';       // ？倍表示
        if(zorome_count == 0){
            disp_result.style.fontSize = 20 + 'px';
        }else{
            disp_result.style.fontSize = (disp_size_base+(zorome_count))*disp_size + 'px';
        }
    }

    // 数字に応じて色を設定
    if (numberColors[texts[currentIndex]]) {
        textElement1.style.color = numberColors[texts[currentIndex]];
    }
    if (numberColors[texts[(currentIndex + 1) % texts.length]]) {
        textElement2.style.color = numberColors[texts[(currentIndex + 1) % texts.length]];
    }

    // イベントリスナーを元に戻す
    button.removeEventListener('click', restartSlot);
    button.addEventListener('click', showText);

    // スロット停止状態をリセット
    isFirstSlotStopped = false;
}

// ドラムロール効果音の再生を開始する関数
function playLoop(url) {
    drumrollAudio = new Audio(url);
    drumrollAudio.loop = true; // ループ再生
    drumrollAudio.play(); // ドラムロールを再生
}

// ドラムロール効果音の再生を停止する関数
function stopPlayLoop() {
    if (drumrollAudio) {
        drumrollAudio.pause(); // 再生を停止
        drumrollAudio.currentTime = 0; // 再生位置をリセット
    }
}


// 効果音を動的に生成して再生する関数
function playSound(url) {
    const audio = new Audio(url); // 新しい Audio オブジェクトを作成
    audio.play(); // 効果音を再生
}

// 起動時スロット表示（追加- スロットが回らないように設定）
window.addEventListener('load', function() {
    // スロット開始のためのボタンイベントリスナー設定（ボタンがクリックされるとスロットが開始するように設定）
    const button = document.getElementById('next-button');
    button.textContent = 'Start !';
    button.addEventListener('click', showText);
    button.addEventListener('click', restartSlot);
});