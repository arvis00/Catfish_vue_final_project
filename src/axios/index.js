import axios from "axios"
// import cookie from '@/vue-cookie'

const http = axios.create({
  baseURL: "https://api.unsplash.com"
})

export default http
