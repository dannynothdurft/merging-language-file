<template>
  <button @click="mergedAndDownload" v-if="status === 'merged'">
    <IconMerge />
    <p>Merge the files</p>
  </button>
  <div class="loading-spinner" v-if="status === 'loading'">
    <IconLoading />
  </div>
  <button @click="jsonDownload" v-if="status === 'download'">
    <IconDownload />
    <p>Jetzt Downloaden</p>
  </button>
  <div v-if="status === 'final'">
    <p>Download finish</p>
  </div>
</template>

<script setup lang="ts">
import IconMerge from './icons/IconMerge.vue'
import IconLoading from './icons/IconLoading.vue'
import IconDownload from './icons/IconDownload.vue'

import { computed, ref } from 'vue'
import FileStore from '@/store/FileStore'

const status = ref('merged')

const fileDefault = computed(() => FileStore.state.fileDefault)
const fileMerged = computed(() => FileStore.state.fileMerged)

type JsonValue = string | number | boolean | JsonObject | JsonValue[] | unknown
interface JsonObject {
  [key: string]: JsonValue
}

/*
const mergedJsons = (
  defaultJson: JsonObject,
  mergedJson: JsonObject,
): JsonObject => {
  const merge = (defaultObj: JsonObject, mergedObj: JsonObject): JsonObject => {
    const result: JsonObject = {}

    for (const key in defaultObj) {
      if (defaultObj.hasOwnProperty(key)) {
        if (
          mergedObj.hasOwnProperty(key) &&
          typeof mergedObj[key] === 'object' &&
          mergedObj[key] !== null
        ) {
          result[key] = merge(
            defaultObj[key] as JsonObject,
            mergedObj[key] as JsonObject,
          )
        } else {
          result[key] = mergedObj.hasOwnProperty(key) ? mergedObj[key] : ''
        }
      }
    }

    return result
  }

  return merge(defaultJson, mergedJson)
}
  */

const mergedJsons = (
  defaultJson: JsonObject,
  mergedJson: JsonObject,
): JsonObject => {
  const merge = (defaultObj: JsonObject, mergedObj: JsonObject): JsonObject => {
    const result: JsonObject = {}

    for (const key in defaultObj) {
      if (defaultObj.hasOwnProperty(key)) {
        if (
          mergedObj.hasOwnProperty(key) &&
          typeof mergedObj[key] === 'object' &&
          mergedObj[key] !== null
        ) {
          // Rekursiver Aufruf für verschachtelte Objekte
          result[key] = merge(
            defaultObj[key] as JsonObject,
            mergedObj[key] as JsonObject,
          )
        } else if (
          mergedObj.hasOwnProperty(key) &&
          mergedObj[key] !== '' &&
          mergedObj[key] !== undefined
        ) {
          // Übernehme den Wert aus mergedJson, wenn er vorhanden und nicht leer ist
          result[key] = mergedObj[key]
        } else {
          // Übernehme den Wert aus defaultJson, wenn der Wert aus mergedJson leer ist
          result[key] = defaultObj[key]
        }
      }
    }

    return result
  }

  return merge(defaultJson, mergedJson)
}

const mergedAndDownload = async () => {
  if (fileDefault.value && fileMerged.value) {
    status.value = 'loading'

    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const merged = await new Promise<JsonObject>(resolve => {
        if (fileDefault.value && fileMerged.value) {
          const mergedResult = mergedJsons(fileDefault.value, fileMerged.value)
          resolve(mergedResult)
        }
      })

      const newFile = JSON.stringify(merged, null, 2)

      FileStore.mutations.updateValue('downloadFile', newFile)

      status.value = 'download'
    } catch (error) {
      console.error('Fehler beim Zusammenführen der Dateien:', error)
      status.value = 'merged'
    }
  } else {
    console.error('fileDefault oder fileMerged sind null.')
  }
}

const jsonDownload = () => {
  const downloadFile = FileStore.state.downloadFile

  if (downloadFile && typeof downloadFile === 'string') {
    try {
      const blob = new Blob([downloadFile], {
        type: 'application/json',
      })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'merged.json'

      link.click()

      URL.revokeObjectURL(link.href)

      status.value = 'final'
    } catch (error) {
      console.error('Fehler beim Erstellen der JSON-Datei:', error)
    }
  } else {
    console.error('downloadFile ist null oder undefiniert.')
  }
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

.button-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
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

.loading-spinner {
  margin-top: 15px;
  border-radius: 50%; /* Rundes Element */
  animation: spin 1s linear infinite; /* Anwendung der Animation */
}

@keyframes spin {
  0% {
    transform: rotate(0deg); /* Startposition */
  }
  100% {
    transform: rotate(360deg); /* Endposition */
  }
}
</style>
