<template>

<div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
  <div class="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
    <h2 class="text-xl font-bold mb-4">Nieuwe categorie</h2>
    <div class="mb-4">
      <label class="block text-sm font-medium mb-2">Categorie naam:</label>
      <input
          type="text"
          v-model="categoryName"
          class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Bijv. werk, school..."
          @keyup.enter="handleAdd">
    </div>

    <div class="flex justify-end space-x-2">
      <button @click="handleCancel"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
        Annuleren
      </button>
      <button @click="handleAdd"
              :class="categoryName.trim()
      ? 'bg-gradient-to-r from-blue-300 to-indigo-300 text-white hover:from-blue-400 hover:to-indigo-400'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              class="px-4 py-2 rounded font-medium transition-all">
        Toevoegen
      </button>
    </div>

  </div>
</div>
</template>

<script setup>
import {computed, ref} from 'vue'
import { useTaskStore } from '@/stores/taskStore'

// store exact zelfde als app.vue
const store = useTaskStore()
console.log('CategoryModal - store:', store)
console.log('CategoryModal - showCategoryModal:', store.showCategoryModal)

const showCategoryModal = computed(()=> store.showCategoryModal);
const addCategory = store.addCategory
const closeCategoryModal = store.closeCategoryModal

const categoryName = ref('')

// Handle cancel
const handleCancel = () => {
  categoryName.value = ''
  closeCategoryModal()
}

// Handle add
const handleAdd = () => {
  if (categoryName.value.trim()) {
    addCategory(categoryName.value.trim())
    categoryName.value = ''
    closeCategoryModal()
  }
}
</script>