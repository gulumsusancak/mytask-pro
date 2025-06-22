<!--app.vue-->
<template>
  <div class="flex h-screen bg-gray-100 relative">
    <!-- Zijbalk navigatie -->
    <aside
        class="fixed md:static h-full bg-gradient-to-b from-indigo-200 to-blue-200 shadow-xl p-6 z-20 transition-all duration-300 overflow-hidden"
        :class="sidebarOpen ? 'w-64 left-0' : 'w-0 -left-64 md:left-0 md:w-64'"
    >
      <!-- MyTasks-Pro header -->
      <div class="mb-8 p-3">
        <div class="border-l-4 border-indigo-600 pl-4">
          <h1 class="text-2xl  text-indigo-600">MyTasks-Pro</h1>
          <p class="text-sm text-indigo-600 font-light">Persoonlijke takenplanner</p>
        </div>
      </div>

      <!-- Hoofdnavigatie -->
      <nav class="space-y-3 whitespace-nowrap">
        <router-link to="/" class="flex items-center p-3 rounded-xl text-white hover:bg-white hover:bg-opacity-50 transition-all">
          <i class="fas fa-home mr-4 w-5"></i>
          Home
        </router-link>
        <router-link to="/today" class="flex items-center p-3 rounded-xl text-white hover:bg-white hover:bg-opacity-50 transition-all">
          <i class="fas fa-calendar-day mr-4 w-5"></i>
          Vandaag
        </router-link>
        <router-link to="/completed" class="flex items-center p-3 rounded-xl text-white hover:bg-white hover:bg-opacity-50 transition-all">
          <i class="fas fa-check-circle mr-4 w-5"></i>
          Voltooid
        </router-link>
      </nav>

      <!-- Categorieën sectie -->
      <div class="mt-8 whitespace-nowrap ml-5">
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-semibold uppercase text-sm text-indigo-600">Categorieën</h2>
          <button @click="openCategoryModal" class="text-sm text-indigo-600 hover:text-blue-600">
            <i class="fas fa-plus w-5"></i>
          </button>
        </div>
        <nav class="space-y-2">
          <div
              v-for="category in categories"
              :key="category"
              class="flex items-center p-3 rounded-xl text-white hover:bg-white hover:bg-opacity-20 hover:text-white transition-all group"
          >
            <!-- Router link deel -->
            <router-link
                :to="`/category/${category.toLowerCase()}`"
                class="flex items-center flex-1 min-w-0"
            >
              <i class="fas fa-tag mr-2 w-5 text-indigo-400"></i>
              <span class="truncate">{{ category }}</span>
            </router-link>

            <!-- Delete knop - verschijnt bij hover -->
            <button
                @click="confirmDeleteCategory(category)"
                class="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-600 p-1 transition-opacity ml-2"
            >
              <i class="fas fa-trash-alt text-sm"></i>
            </button>
          </div>
        </nav>
      </div>
    </aside>

    <!-- Overlay voor wanneer sidebar open is op mobiel -->
    <div
        v-if="sidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
    ></div>

    <!-- Hoofdinhoud container -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Mobiele navigatiebalk -->
      <div class="bg-white p-4 shadow-md flex justify-between items-center md:hidden">
        <button @click="toggleSidebar" class="text-gray-500">
          <i class="fas fa-bars text-xl"></i>
        </button>
        <!-- Mobiele titel -->
        <div class="text-lg font-semibold text-indigo-600">MyTasks-Pro</div>
        <div></div> <!-- Placeholder voor evenwicht -->
      </div>

      <!-- Hoofdinhoud -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
    <TaskModal/>
    <CategoryModal/>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import TaskModal from "@/components/TaskModal.vue";
import CategoryModal from "@/components/CategoryModal.vue";

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const store = useTaskStore();
const categories = store.categories;
const openCategoryModal = store.openCategoryModal;
const deleteCategory = store.deleteCategory

// Delete category with confirmation
const confirmDeleteCategory = (categoryName) => {
  deleteCategory(categoryName)
}
</script>