<template>
  <div class="w-full p-4">
    <h1 class="text-2xl font-bold mb-4">Voltooide Taken</h1>

    <div class="bg-white p-4 rounded shadow">
      <p class="mb-4">Aantal voltooide taken: {{ completedTasks.length }}</p>

      <div v-if="completedTasks.length > 0">
        <div v-for="task in completedTasks" :key="task.id" class="border-b py-2 last:border-b-0">
          <div class="flex items-start">
            <div class="flex-1">
              <h3 class="font-medium line-through text-gray-500 capitalize">
                {{ task.title }}
              </h3>
              <p class="text-gray-600 text-sm capitalize">{{ task.description }}</p>
              <p class="text-xs text-gray-500">
                Deadline: {{ task.deadline.replace('T', ' ') || 'Geen' }} |
                Categorie: {{ task.category || 'Geen' }}
              </p>
            </div>

            <div class="flex items-center space-x-2 ml-2">
              <!-- Prioriteit badge -->
              <span
                  :class="getPriorityClass(task.priority)"
                  class="px-2 py-1 text-xs rounded-full font-medium">
                      {{ getPriorityText(task.priority) }}
              </span>

              <!-- Delete knop -->
              <button @click="confirmDeleteTask(task.id)" class="text-gray-500 hover:text-red-600 p-1">
                <i class="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p class="text-gray-500">Geen voltooide taken gevonden.</p>
      </div>
    </div>

    <!-- Task Modal -->
    <TaskModal
        :is-open="showModal"
        :editing-task="editingTask"
        @close="closeModal"
        @task-added="onTaskAdded"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTasks } from '@/composables/useTasks'
import TaskModal from '@/components/TaskModal.vue'

// ✅ Alle task functionaliteit uit composable
const {
  tasks,
  showModal,
  editingTask,
  closeModal,
  confirmDeleteTask,
  onTaskAdded
} = useTasks()

//alleen CompletedTasks-specifieke logica
const completedTasks = computed(() => {
  return tasks.filter(task => task.completed === true)
})

// functies voor styling
const getPriorityClass = (priority) => {
  const classes = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  }
  return classes[priority] || classes.medium
}

const getPriorityText = (priority) => {
  const text = {
    high: 'Hoog',
    medium: 'Gemiddeld',
    low: 'Laag'
  }
  return text[priority] || 'Gemiddeld'
}
</script>