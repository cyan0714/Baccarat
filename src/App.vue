<template>
  <div class="app">
    <h1>百家乐</h1>
    <BaccaratGame />
  </div>
</template>

<script setup lang="ts">
import BaccaratGame from './components/BaccaratGame.vue';
</script>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

body {
  margin: 0;
  background: #f0f0f0;
  font-family: Arial, sans-serif;
}
</style>
