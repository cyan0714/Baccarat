<template>
  <div class="rules-button" @click="showRules = true">
    游戏规则
  </div>

  <Transition name="modal">
    <div v-if="showRules" class="rules-modal">
      <div class="rules-content">
        <h2>百家乐游戏规则</h2>
        
        <div class="rules-text">
          <h3>基本规则</h3>
          <ul>
            <li>玩家可以投注在「闲家」或「庄家」</li>
            <li>牌面点数：A为1点，2至9按面值计算，10和花牌为0点</li>
            <li>两张牌点数相加超过10时，只取个位数</li>
          </ul>

          <h3>停牌规则</h3>
          <ul>
            <li>闲家点数为6，庄家为7时停牌；或者闲家点数为7，庄家为6时停牌</li>
            <li>庄家或闲家有一方点数为8或9时停牌</li>
          </ul>

          <h3>补牌规则</h3>
          <h4>闲家补牌规则</h4>
          <ul>
            <li>闲家点数为0-5时必须补牌</li>
          </ul>

          <h4>庄家补牌规则</h4>
          <ul>
            <li>庄家点数为0-2时必须补牌</li>
            <li>庄家点数为3-时，要根据闲家补牌的点数决定是否补牌(见以下4点)</li>
            <li>当庄家点数为3时，闲家点数为8时，庄家必须补牌</li>
            <li>当庄家点数为4时，闲家补的牌为2~7时，庄家必须补牌</li>
            <li>当庄家点数为5时，闲家补的牌为4~7时，庄家必须补牌</li>
            <li>当庄家点数为6时，闲家补的牌为6或7时，庄家必须补牌</li>
          </ul>
        </div>

        <button class="close-button" @click="showRules = false">关闭</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showRules = ref(false)
</script>

<style scoped>
.rules-button {
  position: fixed;
  right: 20px;
  top: 20px;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  z-index: 100;
}

.rules-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.rules-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.rules-text {
  margin: 20px 0;
}

.close-button {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
ul li {
  list-style: none;
}
</style> 
