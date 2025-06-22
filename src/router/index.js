import { createRouter, createWebHistory } from 'vue-router'

//pages importeren:
import HomePage from "@/pages/HomePage.vue";
import TodayPage from "@/pages/TodayPage.vue";
import CompletedTasks from "@/pages/CompletedTasks.vue";
import CategoryPage from "@/pages/CategoryPage.vue";

const routes = [
    {
        path:'/',
        name:'home',
        component:HomePage
    },
    {
        path:'/today',
        name:'today',
        component: TodayPage
    },
    {
        path:'/completed',
        name:'completed',
        component: CompletedTasks
    },
    {
        path:'/category/:id',
        name:'category',
        component: CategoryPage,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router