<template>
  <button @click="newStartButton">
    <!-- <IconMerge /> -->
    <p>New Start</p>
  </button>
</template>

<script setup lang="ts">
const newStartButton = async () => {
  window.location.reload()
}
</script>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: #fff;
  box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

button:hover {
  box-shadow: inset 1px 1px 2px 2px rgba(0, 0, 0, 0.2);
}

button:active {
  background: #dfd0f9;
  background: linear-gradient(90deg, #dfd0f9 0%, #320095 100%);
}

button:active p {
  color: #fff;
}
</style>
