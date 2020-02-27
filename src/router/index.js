import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/gameover",
    name: "Gameover",
    component: () => import("@/views/Gameover")
  },
  {
    path: "/results",
    name: "Results",
    component: () => import("@/views/Results")
  },
  {
    path: "/game",
    name: "Game",
    component: () => import("@/views/Game")
  },
  {
    path: "/",
    name: "Start",
    component: () => import("@/views/Start")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
