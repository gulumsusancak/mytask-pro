<!--eerste component taskmodal.vue-->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
      <h2 class="text-xl font-bold mb-4">{{editingTask ? 'Taak bewerken' : 'Nieuwe Taak'}}</h2>

      <!-- Titel -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Titel: *</label>
        <input
            type="text"
            v-model="task.title"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Taak titel...">
      </div>

      <!-- Beschrijving -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Beschrijving:</label>
        <textarea
            v-model="task.description"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optioneel..."
            rows="3">
        </textarea>
      </div>

      <!-- Deadline -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Deadline:</label>
        <input
            v-model="task.deadline"
            type="datetime-local"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <!-- Prioriteit -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Prioriteit:</label>
        <select
            v-model="task.priority"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="low">Laag</option>
          <option value="medium">Gemiddeld</option>
          <option value="high">Hoog</option>
        </select>
      </div>

      <!-- Categorie -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Categorie:</label>
        <select
            v-model="task.category"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Geen categorie</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <!-- Knoppen -->
      <div class="flex justify-end space-x-2">
        <button
            @click="handleCancel"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
          Annuleren
        </button>
        <button
            @click="handleAdd"
            :disabled="!task.title.trim()"
            :class="task.title.trim()
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
/* eslint-disable no-undef */
import { reactive, watch } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

// Props - voeg editingTask toe
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  defaultCategory: {
    type: String,
    default: ''
  },
  editingTask: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'task-added'])
/* eslint-enable no-undef */

// Store - voeg updateTask toe
const { categories, addTask, updateTask } = useTaskStore()

// Task form data
const task = reactive({
  title: '',
  description: '',
  deadline: '',
  priority: 'medium',
  category: ''
})

// Watch for editingTask changes - vul formulier met bestaande data
watch(() => props.editingTask, (editingTask) => {
  if (editingTask) {
    // Bewerken: vul formulier met bestaande taak data
    task.title = editingTask.title || ''
    task.description = editingTask.description || ''
    task.deadline = editingTask.deadline || ''
    task.priority = editingTask.priority || 'medium'
    task.category = editingTask.category || ''
  } else {
    // Nieuwe taak: gebruik defaultCategory
    task.category = props.defaultCategory || ''
  }
}, { immediate: true })

// Watch for defaultCategory changes (voor nieuwe taken)
watch(() => props.defaultCategory, (newCategory) => {
  if (!props.editingTask && newCategory) {
    task.category = newCategory
  }
})

// Reset form
const resetForm = () => {
  task.title = ''
  task.description = ''
  task.deadline = ''
  task.priority = 'medium'
  task.category = props.defaultCategory || ''
}

// Handle cancel
const handleCancel = () => {
  resetForm()
  emit('close')
}

// Handle add/update - AANGEPAST: geen datum conversie meer
const handleAdd = () => {
  if (task.title.trim()) {
    if (props.editingTask) {
      updateTask(props.editingTask.id, {
        title: task.title,
        description: task.description,
        deadline: task.deadline,  // Direct zonder conversie
        priority: task.priority,
        category: task.category || null
      })
    } else {
      addTask({
        title: task.title,
        description: task.description,
        deadline: task.deadline,  // Direct zonder conversie
        priority: task.priority,
        category: task.category || null
      })
    }

    resetForm()
    emit('task-added')
    emit('close')
  }
}
</script>