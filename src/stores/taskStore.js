//taskstore.js
import { defineStore } from "pinia"
import { ref } from "vue"

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([])
    const categories = ref(['Prive'])

    // LocalStorage functies
    const saveToLocalStorage = () => {
        localStorage.setItem('mytasks-tasks', JSON.stringify(tasks.value))
        localStorage.setItem('mytasks-categories', JSON.stringify(categories.value))
    }

    const loadFromLocalStorage = () => {
        const savedTasks = localStorage.getItem('mytasks-tasks')
        const savedCategories = localStorage.getItem('mytasks-categories')

        if (savedTasks) {
            tasks.value = JSON.parse(savedTasks)
        }

        if (savedCategories) {
            categories.value = JSON.parse(savedCategories)
        }
    }

    // functie om completed status te wijzigen (checkbox)
    const toggleTaskCompleted = (taskId) => {
        const task = tasks.value.find(task => task.id === taskId)
        if (task) {
            task.completed = !task.completed
            saveToLocalStorage()
        }
    }

    const addTask = (newTask) => {
        const task = {
            id: Date.now(),
            title: newTask.title,
            description: newTask.description || '',
            deadline: newTask.deadline,
            priority: newTask.priority || 'medium',
            category: newTask.category || null,
            completed: false
        }
        tasks.value.push(task)
        saveToLocalStorage()
    }

    const addCategory = (categoryName) => {
        if (categoryName && !categories.value.includes(categoryName)) {
            categories.value.push(categoryName)
            saveToLocalStorage()
        }
    }

    const showTaskModal = ref(false)

    const openTaskModal = () => {
        showTaskModal.value = true
    }

    const closeTaskModal = () => {
        showTaskModal.value = false
    }

    //taken bewerken & verwijderen
    const deleteTask = (taskId) => {
        const taskIndex = tasks.value.findIndex(task => task.id === taskId)
        if (taskIndex !== -1) {
            tasks.value.splice(taskIndex, 1) //  splice in plaats van filter
            saveToLocalStorage()
        }
    }

    const updateTask = (taskId,updatedTask)=>{
        const index = tasks.value.findIndex(task=>task.id === taskId);
        if (index !== -1){
            tasks.value[index]= {...tasks.value[index], ...updatedTask} //dit behoudt alles van het originele taak en voegt de updated velden toe
            saveToLocalStorage();
        }
    }

    const showCategoryModal = ref(false);
    const openCategoryModal = () => {
        console.log('openCategoryModal called - setting to true')
        showCategoryModal.value = true
        console.log('showCategoryModal is now:', showCategoryModal.value)
    }

    const closeCategoryModal = () => {
        console.log('closeCategoryModal called - setting to false')
        showCategoryModal.value = false
        console.log('showCategoryModal is now:', showCategoryModal.value)
    }

    const deleteCategory = (categoryName)=>{

        //controleren of er taken zijn met die categorie
        const tasksWithCategory = tasks.value.filter(task=>task.category===categoryName);

        if (tasksWithCategory.length>0){
            //als er taken zijn bevestiging vragen
            const confirmMessage = `Er zijn ${tasksWithCategory.length} taken in deze categorie. Weet je zeker dat je "${categoryName}" wilt verwijderen? (De taken blijven bestaan maar zonder categorie.)`;

            if (!confirm(confirmMessage)){
                return; //als de gebruiker annuleert
            }

            //de categorie verwijderen van alle taken
            tasks.value.forEach(task=>{
                if (task.category===categoryName){
                    task.category=null;
                }
            })
        }
        const categoryIndex = categories.value.findIndex(cat=>cat===categoryName);
        if (categoryName!==-1){
            categories.value.splice(categoryIndex,1);
            saveToLocalStorage();
        }
    }



    // laad data
    loadFromLocalStorage()

    return {
        tasks,
        categories,
        toggleTaskCompleted,
        addTask,
        addCategory,
        showTaskModal,
        showCategoryModal,
        openTaskModal,
        closeTaskModal,
        deleteTask,
        updateTask,
        openCategoryModal,
        closeCategoryModal,
        deleteCategory
    }
})