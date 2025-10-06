//DOM-----------------
const $ =(sel)=> document.querySelector(sel);
const $rock                 = $('.rock');
const $scissors             = $('.scissors');
const $paper                = $('.paper');
const $computerChoiceImage  = $('.computer-choiced-image');
const $computerChoice       = $('.computer-choice');
const $myHandImage          = $('.my-hands-image');
const $retryButton          = $('.retry-button');
const $progressMessage      = $('.progress-message');
const $computerImage        = $('.computer-image');
const $historyList          = $('.history');
const $finalResult          = $('.final-result');

//データ
const computerChoice = [ 'rock' , 'scissors' , 'paper'];
const handsImage     = {
        rock:       './images/rock.png',
        scissors:   './images/scissors.png',
        paper:      './images/paper.png',
}
let roundCount = 0;
let winCount = 0;
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
function getRandomHand() { return computerChoice[Math.floor(Math.random()*computerChoice.length)]; }
function playRound(myHand) {
    if(roundCount >= MAX_ROUNDS) return;
    let result               = '';
    const computer           = getRandomHand();
    const $li                = document.createElement('li');
    $myHandImage.src         = handsImage[myHand];
    $computerChoiceImage.src = `./images/${computer}.png`;
    if (myHand === computer) {
            result = 'あなた：あいこ';
            $computerImage.src = './images/thing.png';
        } else if (
            (myHand === 'rock' && computer === 'scissors') ||
            (myHand === 'scissors' && computer === 'paper') ||
            (myHand === 'paper' && computer === 'rock')
        ) {
            result = 'あなた：勝ち';
            $computerImage.src = './images/angry.png';
            winCount++;
        } else {
            result = 'あなた：負け';
            $computerImage.src = './images/happy.png';
        }
        $computerChoice.textContent = result;
        roundCount++;
        $li.textContent = `${roundCount}戦目:あなた=${myHand}、あいて=${computer} → ${result}`;
        $historyList.appendChild($li);
        update();
}
function reset() {
    roundCount                   = 0;
    winCount                     = 0;
    $computerChoiceImage.src     = './images/question.png';
    $myHandImage.src             = './images/question.png';
    $computerImage.src           = './images/thing.png';
    $computerChoice.textContent  = '何を出そうかな';
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