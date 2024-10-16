<template>
  <HeaderCP />
  <main>
    <div class="main-app-view-container">
      <div class="input-view-container">
        <UploadFile file="default"
          >Select file from Shopify default language</UploadFile
        >
        <UploadFile file="merged">Select merged file</UploadFile>
      </div>
      <div>
        <MergeButton />
      </div>
    </div>
    <FooterCP />
  </main>
</template>

<script setup lang="ts">
import HeaderCP from './components/HeaderCP.vue'
import FooterCP from './components/FooterCP.vue'
import UploadFile from './components/UploadFile.vue'
import MergeButton from './components/MergeButton.vue'
</script>

<style scoped>
.main-app-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.input-view-container {
  display: flex;
  gap: 10px;
}
</style>
