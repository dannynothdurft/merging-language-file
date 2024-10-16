import { reactive, readonly } from 'vue'

type JsonObject = Record<string, unknown>

interface FileState {
  fileDefault: JsonObject | null
  fileMerged: JsonObject | null
  downloadFile: string | null
}

const state = reactive<FileState>({
  fileDefault: null,
  fileMerged: null,
  downloadFile: null,
})

type MutationKey = keyof FileState

const mutations = {
  updateValue<T extends MutationKey>(key: T, value: FileState[T]) {
    state[key] = value
  },
}

export default {
  state: readonly(state),
  mutations,
}
