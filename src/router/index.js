import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainView from '../views/MainView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/main',
    name: 'Main',
    component: MainView,
    children: [
      {
        path: '',
        name: 'Welcome',
        component: () => import('../views/WelcomeView.vue'),
      },
      {
        path: 'land-rights',
        name: 'LandRights',
        component: () => import('../views/LandRightsView.vue'),
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('../views/UserManageView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.public) {
    next()
  } else if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
