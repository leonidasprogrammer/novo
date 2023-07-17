import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333'
})

//https://roketseat-notes.onrender.com
//http://localhost:3333
//http://127.0.0.1:5173/

/*export const api = axios.create({
  baseURL: "http://localhost:3333"
  
})

api.get("/users/:id")*/
