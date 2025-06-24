<template>
  <div class="bg-gray-50 p-4 rounded-lg mb-6">
    <h3 class="text-sm font-medium text-gray-700 mb-3">Filter & Sorteer</h3>

<!-- priority dropdown -->
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Prioriteit</label>
      <select v-model="selectedPriority" class="w-full text-sm p-2 border border-gray-300 rounded-md">
        <option value="">Alle prioriteiten</option>
        <option value="high">Hoog</option>
        <option value="medium">Gemiddeld</option>
        <option value="low">Laag</option>
      </select>
    </div>

    <!-- status filter -->
    <div class="mt-4">
      <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
      <select
          v-model="selectedStatus"
          class="w-full text-sm p-2 border border-gray-300 rounded-md"
      >
        <option value="">Alle taken</option>
        <option value="completed">Voltooid</option>
        <option value="pending">Niet voltooid</option>
      </select>
    </div>

    <!-- sorteer opties - alleen tonen als showSortByDeadline true is -->
    <div v-if="showSortByDeadline" class="mt-4">
      <label class="flex items-center">
        <input
            type="checkbox"
            v-model="sortByDeadline"
            class="mr-2"
        >
        <span class="text-xs font-medium text-gray-600">Sorteer op deadline</span>
      </label>
    </div>

  </div>
</template>
<script setup>
/* eslint-disable no-undef */
import { ref, watch } from 'vue'

const emit = defineEmits(['filter-changed']);

const selectedPriority = ref('');
const selectedStatus = ref('');
const sortByDeadline = ref(false);

defineProps({
  showCategoryFilter: {
    type: Boolean,
    default: true
  },
  showSortByDeadline: {  // <- nieuwe prop
    type: Boolean,
    default: true
  }
})

// Watch voor veranderingen en emit naar parent
watch([selectedPriority, selectedStatus, sortByDeadline], ([newPriority, newStatus, newSort]) => {
  console.log('Filters changed:', { priority: newPriority, status: newStatus, sortByDeadline:newSort })
  emit('filter-changed', {
    priority: newPriority,
    status: newStatus,
    sortByDeadline: newSort
  })
})
/* eslint-enable no-undef */
</script>
