import { PREFIX } from '~/core/constants/storage-keys'

const PERSISTED_STORE_IDS = ['auth', 'timer', 'site-settings']

export default defineNuxtPlugin(() => {
  for (const id of PERSISTED_STORE_IDS) {
    const newKey = `${PREFIX}${id}`
    const value = localStorage.getItem(id)
    if (value !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, value)
      localStorage.removeItem(id)
    }
  }
})
