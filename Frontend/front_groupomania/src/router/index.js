import { createRouter, createWebHistory } from 'vue-router'
import SignupApp from '../views/SignupApp.vue'

const routes = [
  {
    path: '/',
    name: 'signupApp',
    component: SignupApp
  },
  
  {
    path: '/LoginApp',
    name: 'LoginApp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginApp.vue')
  },

  {
    path: '/PostApp',
    name: 'PostApp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "SignupApp" */ '../views/PostApp.vue')
  },

  {
    path: '/ProfilUser',
    name: 'ProfilUser',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "ProfilUser" */ '../views/ProfilUser.vue')
  },
  
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
