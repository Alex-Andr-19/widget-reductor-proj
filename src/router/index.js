import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: "/",
        component: import("@/pages/mainPage/mainPage.vue"),
        meta: {
            title: "Конструктор виджетов",
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: (to, from, savedPosition) => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 350);
    }
});

const DEFAULT_TITLE = "Informs"
router.beforeEach((to) => {
    document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;