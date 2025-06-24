<template>
  <div class="w-full p-4">
    <!-- Header met titel en knop -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold capitalize">
        {{ route.params.id }}
      </h1>
      <button @click="openModal" class="px-6 py-3 bg-gradient-to-r from-indigo-300 to-blue-300 text-white rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all shadow-lg font-medium">
        <i class="fas fa-plus mr-2"></i>
        Nieuwe {{ route.params.id }} taak
      </button>
    </div>

    <FilterBar
        :show-category-filter="false"
        :show-sort-by-deadline="true"
        @filter-changed="handleFilterChange"
    />

    <div class="bg-white p-4 rounded shadow">
      <p class="mb-4">Aantal taken: {{ filteredTasks.length }}</p>

      <div v-if="filteredTasks.length > 0">
        <div v-for="task in filteredTasks" :key="task.id" class="border-b py-2 last:border-b-0">
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
                Deadline: {{ task.deadline.replace('T', ' ') }}
              </p>
            </div>

            <div class="flex items-center space-x-2 ml-2">
              <!-- Prioriteit badge -->
              <span
                  :class="getPriorityClass(task.priority)"
                  class="px-2 py-1 text-xs rounded-full font-medium">
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
        <p class="text-gray-500">Geen taken gevonden.</p>
      </div>
    </div>

    <!-- Task Modal met defaultCategory -->
    <TaskModal
        :is-open="showModal"
        :default-category="currentCategory"
        :editing-task="editingTask"
        @close="closeModal"
        @task-added="onTaskAdded"
    />
  </div>
</template>

<script setup>
import { computed, ref} from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from "@/stores/taskStore"
import { useTasks } from '@/composables/useTasks'
import TaskModal from '@/components/TaskModal.vue'
import FilterBar from "@/components/FilterBar.vue";

const route = useRoute()
const store = useTaskStore()

// alle task-gerelateerde functionaliteit uit composable
const {
  tasks,
  toggleTaskCompleted,
  showModal,
  editingTask,
  editTask,
  openModal,
  closeModal,
  confirmDeleteTask,
  onTaskAdded
} = useTasks()

//  alleen page-specifieke logica hier
const currentCategory = computed(() => {
  const categoryId = route.params?.id
  if (!categoryId) return ''

  const exactCategory = store.categories.find(cat =>
      cat.toLowerCase() === categoryId.toLowerCase()
  )

  return exactCategory || categoryId
})

// Filter state toevoegen
const currentFilters = ref({ priority: '', status: '', sortByDeadline: false })

// Filter handling
const handleFilterChange = (filters) => {
  console.log('Filters received in CategoryPage:', filters)
  currentFilters.value = filters
}

const filteredTasks = computed(() => {
  const categoryId = route.params?.id
  if (!categoryId) return []

  // Eerst filteren op categorie
  let result = tasks.filter(task =>
      task.category?.toLowerCase() === categoryId.toLowerCase()
  )

  // Dan filteren op prioriteit
  if (currentFilters.value.priority) {
    result = result.filter(task => task.priority === currentFilters.value.priority)
  }

  // Filteren op status
  if (currentFilters.value.status) {
    if (currentFilters.value.status === 'completed') {
      result = result.filter(task => task.completed === true)
    } else if (currentFilters.value.status === 'pending') {
      result = result.filter(task => task.completed !== true)
    }
  }

  // Sorteer op deadline (als checkbox aangevinkt is)
  if (currentFilters.value.sortByDeadline) {
    result.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1

      return new Date(a.deadline) - new Date(b.deadline)
    })
  }

  return result
})

//functies voor styling
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