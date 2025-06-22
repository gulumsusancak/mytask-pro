//composable usetasks.js
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

export function useTasks() {
    const store = useTaskStore()
    const { tasks, toggleTaskCompleted, deleteTask } = store

    // Modal state
    const showModal = ref(false)
    const editingTask = ref(null)

    // Modal functies
    const editTask = (task) => {
        editingTask.value = task
        showModal.value = true
    }

    const openModal = () => {
        editingTask.value = null
        showModal.value = true
    }

    const closeModal = () => {
        showModal.value = false
        editingTask.value = null
    }

    const confirmDeleteTask = (taskId) => {
        if (confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
            deleteTask(taskId)
        }
    }

    const onTaskAdded = () => {
        console.log('Taak toegevoegd/bijgewerkt!')
    }

    return {
        tasks,
        toggleTaskCompleted,
        showModal,
        editingTask,
        editTask,
        openModal,
        closeModal,
        confirmDeleteTask,
        onTaskAdded
    }
}