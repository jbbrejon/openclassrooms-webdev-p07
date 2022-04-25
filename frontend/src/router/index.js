// Module dependencies
import { createRouter, createWebHistory } from 'vue-router'

// Create route objet
const routes = [
  {
    path: '/',
    name: 'Login',
    // Import vue component
    component: () => import("../views/Login.vue"),
    meta: {
      title: ' Connexion - Groupomania',
    }
  },
  {
    path: '/home',
    name: 'Home',
    // Import vue component
    component: () => import("../views/Home.vue"),
    meta: {
      title: 'Home - Groupomania',
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    // Import vue component
    component: () => import("../views/User.vue"),
    meta: {
      title: 'Profil - Groupomania',
    }
  },
  {
    path: '/edituser/:id',
    name: 'EditUser',
    // Import vue component
    component: () => import("../views/EditUser.vue"),
    meta: {
      title: 'Gestion du profil - Groupomania',
    }
  },
]

// Set router
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router
