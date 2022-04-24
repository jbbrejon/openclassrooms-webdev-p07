import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import("../views/Login.vue"),
    meta: {
      title: 'Accueil',
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import("../views/Home.vue"),
    meta: {
      title: 'Home - Groupomania',
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import("../views/User.vue"),
    meta: {
      title: 'Utilisateur',
    }
  },
  {
    path: '/edituser/:id',
    name: 'EditUser',
    component: () => import("../views/EditUser.vue"),
    meta: {
      title: 'Utilisateur',
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router
