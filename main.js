'use script';
const JankenGame = {
    enemyHands: [ 'rock' , 'scissors' , 'paper'],
    elements: {},
    _inited: false,
    roundCount: 0,
    winCount: 0,
    images:'',
    handsImage: {
        rock: './images/rock.png',
        scissors: './images/scissors.png',
        paper: './images/paper.png'
    },
    rng: Math.random,
    init( options = { }){
        if( this._inited ) { return };
        if( options.rng ) { this.rng = options.rng }

        if(!Array.isArray(this.enemyHands) || this.enemyHands.length === 0 ) {
            console.warn('enemyHandsが空です');
        } 
        this.cacheEls();//要素取得の関数
        this.bindBtn();//イベント処理の関数
        this.update();
        this.reset();
        this._inited = true;
    },
    cacheEls(){
        const get =(sel)=> {
            const el = document.querySelector(sel);
            if(!el) throw new Error(`必要な情報がありません: ${sel}`);
            return el;
        }
        this.elements = {
            rockBtn: get('#rock-hand'),
            scissorsBtn: get('#scissors-hand'),
            paperBtn: get('#paper-hand'),
            enemyHandImage: get('#enemy-hands-image'),
            resultText: get('#enemy-text'),
            myHandImage: get('#my-hands-image'),
            finalResult: get('#final-result'),
            retryBtn: get('#retry-btn'),
            progressText: get('#progress-text'),
            enemyImage: get('#enemy-image'),
            historyList: get('#history'),
            
        }
    },
    bindBtn() {
        const { rockBtn, scissorsBtn, paperBtn, retryBtn } = this.elements;
        rockBtn.addEventListener('click', () => this.playRound('rock'));
        scissorsBtn.addEventListener('click', () => this.playRound('scissors'));
        paperBtn.addEventListener('click', () => this.playRound('paper'));
        retryBtn.addEventListener('click', () => this.reset());

        retryBtn.disabled = true;
        
    },
    getRandomHand() {
        return this.enemyHands[Math.floor(this.rng() * this.enemyHands.length)];
    },
    playRound( myHand ) {
        //早期リターン
        if (this.roundCount >= 5) return; //5回終了後は無視（ボタンは無効化してるけど二重保険をかけてる）
        const { enemyHandImage, myHandImage, resultText,enemyImage,historyList } = this.elements;
        const enemyHand = this.getRandomHand();
        myHandImage.src = this.handsImage[myHand];
        enemyHandImage.src = this.handsImage[enemyHand];
        //変数宣言→文字列が入ることの宣言
        let result = '';

        if (myHand === enemyHand) {
            result = 'あなた：あいこ';
            enemyImage.src = './images/thing.png';
        } else if (
            (myHand === 'rock' && enemyHand === 'scissors') ||
            (myHand === 'scissors' && enemyHand === 'paper') ||
            (myHand === 'paper' && enemyHand === 'rock')
        ) {
            result = 'あなた：勝ち';
            enemyImage.src = './images/angry.png';
            this.winCount++;
        } else {
            result = 'あなた：負け';
            enemyImage.src = './images/happy.png';
        }
        //処理によって変数に代入してその結果を書き込みしてる！！すごい
        resultText.textContent = result;
        this.roundCount++;

        const li = document.createElement('li');
        li.textContent = `${this.roundCount}戦目:あなた=${myHand}、あいて=${enemyHand} → ${result}`;
        historyList.appendChild(li);
        this.update();
    },
    
    update(){
        const { rockBtn, scissorsBtn, paperBtn, finalResult, retryBtn, progressText} = this.elements;
        // 途中経過（勝率・進捗）
            const played = this.roundCount;
            const wins = this.winCount;
            //勝負数が０なら０、それ以外は勝率を表示
            const winRate = played === 0 ? 0 : Math.round((wins / played) * 100);
            progressText.textContent = `進捗：${played}/5戦 現在：${wins}勝（勝率 ${winRate}%）`;

    if (this.roundCount >= 5) {
        // ラウンド終了：出し手ボタンを無効・リトライを有効
        rockBtn.disabled = true;
        scissorsBtn.disabled = true;
        paperBtn.disabled = true;
        retryBtn.disabled = false;

        finalResult.textContent = this.winCount >= 3
            ? `あなたの勝ち！(${this.winCount}勝 / 5戦)`
            : `あなたの負け…(${this.winCount}勝 / 5戦)`;
        } else {
        // 進行中：出し手ボタンを有効・リトライは無効のまま
            rockBtn.disabled = false;
            scissorsBtn.disabled = false;
            paperBtn.disabled = false;
            retryBtn.disabled = true;
            finalResult.textContent = '';
        }
  },

  reset() {
    const {
      rockBtn, scissorsBtn, paperBtn,
      enemyHandImage, myHandImage, resultText, finalResult, retryBtn, progressText,historyList,
    } = this.elements;

    this.roundCount = 0;
    this.winCount = 0;

    // 出し手ボタンは再び有効、リトライは不活性に戻す
    rockBtn.disabled = false;
    scissorsBtn.disabled = false;
    paperBtn.disabled = false;
    retryBtn.disabled = true;

    // 表示クリア
    enemyHandImage.src = './images/question.png';
    myHandImage.src = './images/question.png';
    resultText.textContent = '';
    finalResult.textContent = '';
    progressText.textContent = '進捗：0/5戦 現在：0勝（勝率 0%）';

    historyList.replaceChildren();
  }
};
document.addEventListener('DOMContentLoaded', ()=> { JankenGame.init()});