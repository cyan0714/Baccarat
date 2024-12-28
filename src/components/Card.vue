<template>
  <div class="card" 
       :class="{ 
         'face-down': !card,
         'dealing': isDealing 
       }"
       :style="cardStyle">
    <img :src="cardImageSrc" 
         :alt="card ? `${displayValue} of ${card.suit}` : 'Card back'"
         class="card-image"
         />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { Card } from '../types/game';
import { getCardImage, CARD_BACK } from '../services/cardAssets';


const props = defineProps<{
  card?: Card;
  index?: number;
  position?: 'player' | 'banker';
}>();

const isDealing = ref(true);

// 计算卡牌的初始位置和动画延迟
const cardStyle = computed(() => {
  const delay = props.index ? props.index * 0.2 : 0;
  return {
    '--delay': `${delay}s`,
    '--initial-x': '50vw',
    '--initial-y': props.position === 'banker' ? '-50vh' : '50vh'
  };
});

onMounted(() => {
  setTimeout(() => {
    isDealing.value = false;
  }, (props.index || 0) * 200 + 500);
});

const displayValue = computed(() => {
  if (!props.card) return '';
  switch (props.card.value) {
    case 1: return 'A';
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    default: return props.card.value.toString();
  }
});

const cardImageSrc = computed(() => {
  if (!props.card) return CARD_BACK;
  return getCardImage(props.card.suit, props.card.value);
});
</script>

<style scoped>
.card {
  width: 140px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  background: white;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dealing {
  animation: deal-card var(--animation-duration, 0.5s) ease-out var(--delay, 0s);
  animation-fill-mode: backwards;
}

@keyframes deal-card {
  0% {
    transform: translate(var(--initial-x), var(--initial-y)) rotate(180deg);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0) rotate(0);
    opacity: 1;
  }
}

/* 补牌动画 */
.card.extra {
  animation: deal-extra-card 0.5s ease-out;
}

@keyframes deal-extra-card {
  0% {
    transform: translate(100vw, 0) rotate(90deg);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0) rotate(0);
    opacity: 1;
  }
}
</style> 
