<template>
  <div class="w-full p-4">
    <h1 class="text-2xl font-bold mb-4">Vandaag</h1>

    <!-- Filter Bar toevoegen -->
    <FilterBar
        :show-category-filter="true"
        :show-sort-by-deadline="false"
        @filter-changed="handleFilterChange"
    />

    <div class="bg-white p-4 rounded shadow">
      <p class="mb-4">Aantal taken: {{ todayTasks.length }}</p>

      <div v-if="todayTasks.length > 0">
        <div v-for="task in todayTasks" :key="task.id" class="border-b py-2 last:border-b-0">
          <div class="flex items-start">
            <input
                type="checkbox"
                :checked="task.completed"
                @change="toggleTaskCompleted(task.id)"
                class="mt-1 mr-3 h-5 w-5 rounded"
            >
            <div class="flex-1">
              <h3 class="font-medium capitalize" :class="{ 'line-through text-gray-500': task.completed }">
                {{ task.title }}
              </h3>
              <p class="text-gray-600 text-sm capitalize">{{ task.description }}</p>
              <p class="text-xs text-gray-500">
                Deadline: {{ task.deadline.replace('T', ' ')  }} |
                Categorie: {{ task.category || 'Geen' }}
              </p>
            </div>


            <div class="flex items-center space-x-2 ml-2">
              <!-- Prioriteit badge -->
              <span
                  :class="getPriorityClass(task.priority)"
                  class="px-2 py-1 text-xs rounded-full font-medium"
              >
    {{ getPriorityText(task.priority) }}
  </span>

              <!-- Knoppen -->
              <button @click="editTask(task)" class="text-gray-400 hover:text-gray-500 p-1">
                <i class="fas fa-edit text-sm"></i>
              </button>
              <button @click="confirmDeleteTask(task.id)" class="text-red-500 hover:text-red-700 p-1">
                <i class="far fa-trash-alt text-sm"></i>
              </button>
            </div>

          </div>
        </div>
      </div>

      <div v-else>
        <p class="text-gray-500">Geen taken voor vandaag.</p>
      </div>
    </div>
    <TaskModal
        :is-open="showModal"
        :editing-task="editingTask"
        @close="closeModal"
        @task-added="onTaskAdded"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTasks } from '@/composables/useTasks'
import TaskModal from '@/components/TaskModal.vue'
import FilterBar from "@/components/FilterBar.vue";

//alle task functionaliteiten uit composable
const {
  tasks,
  toggleTaskCompleted,
  showModal,
  editingTask,
  editTask,
  closeModal,
  confirmDeleteTask,
  onTaskAdded
} = useTasks()

//alleen TodayPage-specifieke logica
// Filter state toevoegen
const currentFilters = ref({ priority: '', status: '' })

// Filter handling
const handleFilterChange = (filters) => {
  console.log('Filters received in TodayPage:', filters)
  currentFilters.value = filters
}

const todayTasks = computed(() => {
  // Eerst filteren op vandaag
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const todayString = `${year}-${month}-${day}`

  let result = tasks.filter(task => {
    if (!task.deadline) return false
    return task.deadline.startsWith(todayString)
  })

  // Dan nog filteren op prioriteit en status
  if (currentFilters.value.priority) {
    result = result.filter(task => task.priority === currentFilters.value.priority)
  }

  if (currentFilters.value.status) {
    if (currentFilters.value.status === 'completed') {
      result = result.filter(task => task.completed === true)
    } else if (currentFilters.value.status === 'pending') {
      result = result.filter(task => task.completed !== true)
    }
  }

  return result
})

// Helper functies voor styling
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