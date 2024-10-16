<template>
  <div class="upload-file-container">
    <!-- Datei-Eingabe-Button -->
    <label class="file-btn" @click="onChooseFile">
      <span class="material-symbols-outlined"><IconUpload /></span>
      <p class="slot-input-text"><slot></slot></p>
    </label>

    <!-- Verstecktes Datei-Eingabefeld -->
    <input
      ref="inputRef"
      type="file"
      @change="handleFileChange"
      style="display: none"
    />

    <!-- Zeige Dateidetails, wenn eine Datei ausgewählt wurde -->
    <div v-if="selectedFile" class="file-card">
      <span class="material-symbols-outlined icon"><IconDocument /></span>

      <div class="file-info">
        <div style="flex: 1">
          <h6>Dateiname: {{ selectedFile.name }}</h6>
          <p>Dateigröße: {{ (selectedFile.size / 1024).toFixed(2) }} KB</p>

          <!-- Vorschau für Bilder -->
          <img
            v-if="filePreview"
            :src="filePreview"
            alt="Vorschau"
            style="max-width: 200px; margin-top: 10px"
          />
        </div>

        <!-- Datei löschen Button -->
        <button @click="clearFileInput">
          <span class="material-symbols-outlined close-icon"
            ><IconDelete
          /></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconDelete from './icons/IconDelete.vue'
import IconUpload from './icons/IconUpload.vue'
import IconDocument from './icons/IconDocument.vue'
import FileStore from '@/store/FileStore'
import { ref, defineProps } from 'vue'

const props = defineProps<{
  file: string // Typ des Props
}>()

// Referenzen und Variablen
const inputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const filePreview = ref<string | null>(null)

const onChooseFile = () => {
  inputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]

    if (selectedFile.value.type === 'application/json') {
      const reader = new FileReader()

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result as string)
          FileStore.mutations.updateValue(
            props.file === 'default' ? 'fileDefault' : 'fileMerged',
            jsonData,
          )
        } catch (error) {
          console.error('Fehler beim Parsen der JSON-Datei:', error)
        }
      }
      reader.readAsText(selectedFile.value)
    } else {
      filePreview.value = null
    }
  }
}

const clearFileInput = () => {
  if (inputRef.value) {
    inputRef.value.value = ''
  }
  selectedFile.value = null
  filePreview.value = null
  FileStore.mutations.updateValue(
    props.file === 'default' ? 'fileDefault' : 'fileMerged',
    null,
  )
}
</script>

<style>
.upload-file-container {
  background-color: #fff;
  padding: 10px;
  border-radius: 20px;
  height: max-content;
}

.file-btn {
  width: 330px;
  height: 150px;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #5d4dcc;
  background-color: #fff;
  border: 1.5px dashed #5d4dcc;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 20px;
}

.slot-input-text {
  text-align: center;
  font-size: 0.9rem;
}

.file-btn:hover {
  color: #5d4dcc;
  background-color: #fff;
}

.file-btn span {
  width: 50px;
  height: 50px;
  font-size: 30px;
  color: #5d4dcc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  background-color: #f1efff;
}

.file-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #000;
  background-color: #fff;
  border: 1px solid rgba(117, 96, 255, 0.281);
  border-radius: 10px;
  padding: 8px 15px;
  margin-top: 20px;
}

.file-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.file-info h6 {
  flex: 1;
  font-size: 13px;
  font-weight: 400;
}

.close-icon {
  font-size: 18px;
  cursor: pointer;
}

.file-info button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #463a99;
  background-color: #f1efff;
  border: none;
  border-radius: 30px;
}
</style>
