//DOM-----------------
const $ =(sel)=> document.querySelector(sel);
const $rock                 = $('.rock');
const $scissors             = $('.scissors');
const $paper                = $('.paper');
const $cpuChoiceImage       = $('.cpu-choiced-image');
const $cpuChoice            = $('.cpu-choice');
const $myHandImage          = $('.my-hands-image');
const $retryButton          = $('.retry-button');
const $progressMessage      = $('.progress-message');
const $cpuImage             = $('.cpu-image');
const $historyList          = $('.history');
const $finalResult          = $('.final-result');

//データ
const cpuChoice = [ 'rock' , 'scissors' , 'paper'];
const handsImage     = {
        rock:       './images/rock.png',
        scissors:   './images/scissors.png',
        paper:      './images/paper.png',
}
const faceImage      = {
        angry   :      './images/angry.png',
        happy   :      './images/happy.png',
        thing   :      './images/thing.png',
        question:      './images/question.png',
}
let roundCount   = 0;
let winCount     = 0;
const MAX_ROUNDS = 5;
//関数---------------
function setButtonsEnabled(enabled) {
    $rock.disabled = !enabled;
    $scissors.disabled = !enabled;
    $paper.disabled = !enabled;
}
function setRetryEnabled(enabled) {
    $retryButton.disabled = !enabled;
}
function update() {
const played = roundCount;
      const wins    = winCount;
      const winRate = played === 0 ? 0 : Math.round((wins / played) * 100);
      $progressMessage.textContent = `進捗：${played}/${MAX_ROUNDS}戦 現在：${wins}勝（勝率 ${winRate}%）`;

    if (roundCount >= MAX_ROUNDS) {
            setButtonsEnabled(false);
            setRetryEnabled(true);
            $finalResult.textContent = winCount >= 3
            ? `あなたの勝ち！(${winCount}勝 / ${MAX_ROUNDS}戦)`
            : `あなたの負け…(${winCount}勝  / ${MAX_ROUNDS}戦)`;
        } else {
            setButtonsEnabled(true);
            setRetryEnabled(false);
            $finalResult.textContent = '';
        }
}
function getRandomHand() { return cpuChoice[Math.floor(Math.random()*cpuChoice.length)]; }
function playRound(myHand) {
    if(roundCount >= MAX_ROUNDS) return;
    let result               = '';
    const cpu                = getRandomHand();
    const $li                = document.createElement('li');
    $myHandImage.src         = handsImage[myHand];
    $cpuChoiceImage.src      = handsImage[cpu];
    if (myHand === cpu) {
            result = 'あなた：あいこ';
            $cpuImage.src = faceImage.thing;
        } else if (
            (myHand === 'rock' && cpu === 'scissors') ||
            (myHand === 'scissors' && cpu === 'paper') ||
            (myHand === 'paper' && cpu === 'rock')
        ) {
            result = 'あなた：勝ち';
            $cpuImage.src = faceImage.angry;
            winCount++;
        } else {
            result = 'あなた：負け';
            $cpuImage.src = faceImage.happy;
        }
        $cpuChoice.textContent = result;
        roundCount++;
        $li.textContent = `${roundCount}戦目:あなた=${myHand}、あいて=${cpu} → ${result}`;
        $historyList.appendChild($li);
        update();
}
function reset() {
    roundCount                   = 0;
    winCount                     = 0;
    $cpuChoiceImage.src     = faceImage.question;
    $myHandImage.src             = faceImage.question;
    $cpuImage.src           = faceImage.thing;
    $cpuChoice.textContent  = '何を出そうかな';
    $finalResult.textContent     = '';
    $progressMessage.textContent = `進捗：0/${MAX_ROUNDS}戦 現在：0勝（勝率 0%）`;
    $historyList.replaceChildren();
    setButtonsEnabled(true);
    setRetryEnabled(false);
}
update();
//イベント-------------
$rock.addEventListener('click', function() { playRound('rock'); });
$scissors.addEventListener('click',function() { playRound('scissors'); });
$paper.addEventListener('click', function() { playRound('paper'); });
$retryButton.addEventListener('click',function() { reset(); });