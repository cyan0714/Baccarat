<template>
  <div class="baccarat-game">
    <GameRules />
    <div class="baccarat-table">
      <div class="game-area">
        <div class="dealer-area">
          <Transition name="win">
            <div v-if="gameState.winner === 'banker'" class="win-text">
              WIN
            </div>
          </Transition>
          <h3>庄家 ({{ gameState.bankerScore }})</h3>
          <div class="cards">
            <CardComponent v-for="(card, index) in gameState.bankerCards" 
                          :key="`${card.suit}-${card.value}`"
                          :card="card"
                          :index="index"
                          :position="'banker'"
                          :class="{ 'extra': index >= 2 }" />
          </div>
        </div>
        
        <div class="player-area">
          <Transition name="win">
            <div v-if="gameState.winner === 'player'" class="win-text">
              WIN
            </div>
          </Transition>
          <h3>闲家 ({{ gameState.playerScore }})</h3>
          <div class="cards">
            <CardComponent v-for="(card, index) in gameState.playerCards" 
                          :key="`${card.suit}-${card.value}`"
                          :card="card"
                          :index="index"
                          :position="'player'"
                          :class="{ 'extra': index >= 2 }" />
          </div>
        </div>
      </div>

      <div class="betting-area">
        <div class="bet-options">
          <button @click="placeBet('player')" 
                  :disabled="gameState.gameStatus !== 'waiting'">
            闲家 (1:1)
          </button>
          <button @click="placeBet('banker')" 
                  :disabled="gameState.gameStatus !== 'waiting'">
            庄家 (0.95:1)
          </button>
          <button @click="placeBet('tie')" 
                  :disabled="gameState.gameStatus !== 'waiting'">
            和局 (8:1)
          </button>
        </div>
        
        <button class="deal-button" 
                @click="startGame" 
                :disabled="gameState.gameStatus !== 'waiting'">
          发牌
        </button>
      </div>
    </div>

    <div class="balance">
      余额: {{ balance }}
    </div>
    
    <div v-if="gameState.winner" class="result">
      <button @click="resetGame">再来一局</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { GameState, BetState } from '../types/game';
import CardComponent from './Card.vue';
import { GameService } from '../services/gameService';
import { audioService } from '../services/audioService';
import GameRules from './GameRules.vue'

const gameService = new GameService();

const gameState = reactive<GameState>({
  playerCards: [],
  bankerCards: [],
  playerScore: 0,
  bankerScore: 0,
  gameStatus: 'waiting',
  winner: null
});

const betState = reactive<BetState>({
  player: 0,
  banker: 0,
  tie: 0
});

const balance = ref(1000); // 初始余额

const placeBet = (type: 'player' | 'banker' | 'tie') => {
  const betAmount = 10;
  if (balance.value >= betAmount) {
    betState[type] += betAmount;
    balance.value -= betAmount;
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const dealInitialCards = async () => {
  // 清空上一局的牌
  gameState.playerCards = [];
  gameState.bankerCards = [];
  
  // 按百家乐规则发牌，添加延时创造动画效果
  await audioService.playDealSound();
  gameState.playerCards.push(gameService.drawCard());
  await sleep(200);
  await audioService.playDealSound();
  gameState.bankerCards.push(gameService.drawCard());
  await sleep(200);
  await audioService.playDealSound();
  gameState.playerCards.push(gameService.drawCard());
  await sleep(200);
  await audioService.playDealSound();
  gameState.bankerCards.push(gameService.drawCard());
  await sleep(500);
  
  calculateScores();
};

const dealExtraCard = async (isPlayer: boolean) => {
  await audioService.playExtraCardSound();
  const card = gameService.drawCard();
  if (isPlayer) {
    gameState.playerCards.push(card);
  } else {
    gameState.bankerCards.push(card);
  }
  await sleep(500);
  calculateScores();
};

const calculateScores = () => {
  gameState.playerScore = gameService.calculateHandScore(gameState.playerCards);
  gameState.bankerScore = gameService.calculateHandScore(gameState.bankerCards);
};

const checkWinner = () => {
  if (gameState.playerScore > gameState.bankerScore) {
    gameState.winner = 'player';
    balance.value += betState.player * 2;
  } else if (gameState.bankerScore > gameState.playerScore) {
    gameState.winner = 'banker';
    balance.value += betState.banker * 1.95; // 庄家抽水5%
  } else {
    gameState.winner = 'tie';
    balance.value += betState.tie * 8;
  }
  
  // 重置下注
  betState.player = 0;
  betState.banker = 0;
  betState.tie = 0;
};

const startGame = async () => {
  if (betState.player + betState.banker + betState.tie === 0) {
    alert('请先下注！');
    return;
  }
  
  gameState.gameStatus = 'dealing';
  await dealInitialCards();
  
  // 补牌规则
  if (gameState.playerScore < 6) {
    await dealExtraCard(true);
  }
  
  if (gameService.shouldDrawThirdCard(gameState.bankerScore, false, gameState.playerScore)) {
    await dealExtraCard(false);
  }
  
  await sleep(500); // 等待最后一张牌的动画完成
  checkWinner();
  gameState.gameStatus = 'finished';
};

const resetGame = () => {
  gameState.gameStatus = 'waiting';
  gameState.winner = null;
};
</script>

<style scoped>
.baccarat-table {
  padding: 20px;
  background: #006400;
  border-radius: 10px;
  color: white;
}

.game-area {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  gap: 100px;
  padding: 20px;
}

.dealer-area,
.player-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  position: relative;
}

.cards {
  display: flex;
  gap: 10px;
  min-height: 140px;
  position: relative;
  justify-content: center;
  width: 450px;
  margin: 0 auto;
}

.cards:empty {
  min-width: 320px;
}

.betting-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.bet-options {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background: #ffd700;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.balance {
  font-size: 1.2em;
  margin: 20px 0;
}

.result {
  margin-top: 20px;
  font-size: 1.5em;
  color: #ffd700;
}

.result button {
  margin-left: 10px;
  background: #4CAF50;
  color: white;
}

.betting-area button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.betting-area button:active:not(:disabled) {
  transform: translateY(0);
}

.win-text {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #ff0000;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 24px;
  animation: win-pulse 2s ease-in-out infinite;
  box-shadow: 0 2px 8px rgba(255, 0, 0, 0.5);
  z-index: 100;
}

@keyframes win-pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

/* WIN 标记的过渡动画 */
.win-enter-active,
.win-leave-active {
  animation: deal-card 0.5s ease-out;
  animation-fill-mode: both;
}

@keyframes deal-card {
  0% {
    transform: translate(50vw, -50vh) rotate(180deg);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0) rotate(0);
    opacity: 1;
  }
}
</style> 
